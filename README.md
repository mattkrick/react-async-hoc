# react-async-hoc
Load 3rd party scripts and styles from a url in a higher order component

##Installation
`yarn add react-async-hoc`

## What's it do
This is a simple little higher-order component (HOC) for loading scripts from a url
and giving it to you in props instead of `window`.
Some 3rd party vendors don't make npm packages for their scripts & you must load them from a url.
This really sucks, but it's usually to comply with regulations (Stripe.js, ReCaptcha, etc.)
For example, with Stripe, instead of adding a script tag, you can use this & then get `window.Stripe` as a prop.
For styles, this might be useful if you're using a 3rd party package that comes with CSS but you prefer CSS-in-JS.
You can also return a method (or a promisified method) instead of the whole global object.
Yay modularity & lazy loading!

##Usage

### Stick it around your component that needs to load the url

Example:

```js
import withAsync from 'react-async-hoc';
const statelessComponent = (props) => {
  const {stripe} = props;
  // undefined if the script hasn't loaded yet
  if (!stripe) {
    return <Loading/>
  }

  onEventHandler = () => {
    stripe.stealMoney();
}
  return <div onClick={onEventHandler}>I can haz?</div>
}

const stripeCb = () => {
  const stripe = window.Stripe;
  stripe.setPublishableKey(stripeKey);
  return {
    stripe,
    // example of returning a promisified method when the API doesn't follow a node standard callback
    createToken: (fields) => new Promise((resolve) => {
      stripe.card.createToken(fields, (status, response) => {
        resolve(response);
      })
    })
  };
};

return withAsync({'https://js.stripe.com/v2/': stripeCb});
```

##API

```
withAsync(fetchScripts, fetchStyles)
```

- `fetchScripts`: An object containing all the scripts you want to fetch.
If you don't know this until runtime, have the parent component pass in a `fetchScripts` property.
Pass in as many scripts as you want to load.
  - `key`: the url of the script to fetch
  - `value`: the callback to run one that script has been loaded
- `fetchStyles`: Identical to `fetchScripts`, but for loading CSS.


## License

MIT
