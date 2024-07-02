## j-UIStudio

This component renders the app according to the Total.js Flow UI Studio schema.

- jComponent `v19|v20`

__Configuration__:

- `url {String}` a link to the Flow UI Studio schema (must be in the `json` format)
- `css {Boolean}` applies app style to the current element (default: `true`)
- `ssid {String}` optional, adds a session identifier to the URL address for the Flow
- `title {Boolean}` optional, rewrites `document.title` by the app name
- `plus {String}` optional, it works only with `title:true` and it adds `title - config.plus`
- `onmeta {String}` optional, a link to the `function(meta)` captures a meta data
- `onapp {String}` optional, a link to the `function(app)` captures a new UI design
- `origin {String}` optional
- `onrequest {String}` optional, a link to the `function(payload)` can modify request data
- `flowoutput {Boolean}` optional, enables outputs only from FlowOutput component (default: `true`)

__Properties__:

- `component.app` contains an `app` instance

__Good to know__:

The component extends the `app` instance by adding `breadcrumb {Array}` property.

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)