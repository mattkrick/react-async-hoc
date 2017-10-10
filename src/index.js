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

export default (fetchScripts, fetchStyles) => ComposedComponent => {
  return class WithAsync extends Component {

    state = {};

    loopUrls = (type) => {
      const obj = type === 'script' ? fetchScripts : fetchStyles;
      const loader = type === 'script' ? loadJS : loadCSS;
      const urls = Object.keys(obj);
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const getScript = requestedUrls.has(url) ? Promise.resolve() : loader(url);
        getScript
          .then(() => {
            const cb = obj[url];
            const newProps = cb();
            if (typeof newProps === 'object') {
              this.setState(newProps);
            }
          })
          .catch((e) => {
            console.error(`Failed loading async ${type} from ${url}: ${e}`);
          })
      }
    };

    componentDidMount() {
      if (typeof window === 'undefined') return;
      const scriptsToFetch = fetchScripts || this.props.fetchScripts;
      const stylesToFetch = fetchStyles || this.props.fetchStyles;
      if (scriptsToFetch) {
        this.loopUrls('script');
      }
      if (stylesToFetch) {
        this.loopUrls('css');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} {...this.state}/>
      );
    }
  }
}
