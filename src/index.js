import React, {Component} from 'react';

const loadJS = (url) => new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url;
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
});

const loadCSS = (url) => new Promise((resolve, reject) => {
  const linkElement = document.createElement('link');
  linkElement.setAttribute('rel', 'stylesheet');
  linkElement.setAttribute('type', 'text/css');
  linkElement.setAttribute('href', url);
  document.head.appendChild(linkElement);
  linkElement.onload = resolve;
  linkElement.onerror = reject;
});

const requestedUrls = new Set();
const globalProps = {};

export default ({fetchScripts, fetchStyles}) => ComposedComponent => {
  return class WithAsync extends Component {
    componentDidMount() {
      if (typeof window === 'undefined') return;
      const scriptsToFetch = fetchScripts || this.props.fetchScripts;
      const stylesToFetch = fetchStyles || this.props.fetchStyles;
      if (scriptsToFetch) {
        const urls = Object.keys(scriptsToFetch);
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          if (requestedUrls.has(url)) continue;
          requestedUrls.add(url);
          loadJS(url)
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
      if (stylesToFetch) {
        const urls = Object.keys(stylesToFetch);
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          if (requestedUrls.has(url)) continue;
          requestedUrls.add(url);
          loadCSS(url)
            .then(() => {
              cb()
            })
            .catch((e) => {
              console.error(`Failed loading async styles from ${url}: ${e}`);
            })
        }
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} {...globalProps}/>
      );
    }
  }
}
