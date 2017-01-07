import React, {Component} from 'react';

const loadUrl = (url) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

const requestedUrls = new Set();
const globalProps = {};

export default fetchScripts => ComposedComponent => {
  return class WithAsync extends Component {
    componentDidMount() {
      if (typeof window === 'undefined') return;
      const scriptsToFetch = fetchScripts || this.props.fetchScripts;
      const urls = Object.keys(scriptsToFetch);
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        if (requestedUrls.has(url)) continue;
        requestedUrls.add(url);
        loadUrl(url)
          .then(() => {
            const cb = fetchScripts[url];
            const newProps = cb();
            if (typeof newProps === 'object') {
              Object.assign(globalProps, newProps);
              this.forceUpdate();
            }
          })
          .catch((e) => {
            console.error(`Failed loading async script from ${url}: ${e}`);
          })
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} {...globalProps}/>
      );
    }
  }
}
