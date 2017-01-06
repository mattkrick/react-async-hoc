# react-async-hoc
Load 3rd party scripts from a url in a higher order component

##Installation
`yarn add react-async-hoc`

## What's it do
This is a simple little higher-order component (HOC) for loading scripts from a url
and giving it to you in props instead of `window`.
Some 3rd party vendors don't make npm packages for their scripts & you must load them from a url.
This really sucks, but it's usually to comply with regulations (Stripe.js, ReCaptcha, etc.)
For example, with Stripe, instead of adding a script tag, you can use this & then get `window.Stripe` as a prop.
Yay modularity & lazy loading!

##Usage

### Stick it around your component that needs to load the url

Example:

```js
import withAsync from 'react-async-hoc';
const statelessComponent = (props) => {
  const {Stripe} = props;
  if (Stripe === undefined) {
    return <FetchingScript/>
  }
  if (Stripe === null) {
    return <Loading/>
  }

  onEventHandler = () => {
    Stripe.stealMoney();
  }
  return <div onClick={onEventHandler}>I can haz?</div>
}
return withAsync({Stripe: 'https://js.stripe.com/v2/'});
```


## License

MIT
