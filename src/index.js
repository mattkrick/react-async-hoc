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

const global = {};

export default exposedGlobals => ComposedComponent => {
  return class WithAsync extends Component {
    componentDidMount() {
      if (typeof window !== 'undefined') {
        const globalNames = Object.keys(exposedGlobals);
        for (let i = 0; i < globalNames.length; i++) {
          const globalName = globalNames[i];
          if (!global.hasOwnProperty(globalName)) {
            const url = exposedGlobals[globalName];
            global[globalName] = null;
            loadUrl(url)
              .then(() => {
                global[globalName] = window[globalName];
                this.forceUpdate();
              })
              .catch((e) => {
                console.error(`Failed loading async script ${globalName} from ${url}: ${e}`);
              })
          }
        }
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} {...global}/>
      );
    }
  }
}
