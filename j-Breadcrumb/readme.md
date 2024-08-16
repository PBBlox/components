## j-Breadcrumb

- jComponent `v19|v20`

__Configuration__:

- `icon {String}` home icon (default: `ti ti-home`)
- `exec {String}` path to the method `function(url, el)` for manual processing of links
- `historyapi {Boolean}` enables redirecting via `REDIRECT()` (default `true`)
- `style {Number}` supports two styles `1` classic (default), `2` with bigger padding and only with bottom border
- `root {String}` a label for root item (default: `Root`)
- `rooturl {String}` a relative URL address for root item (default: `/`)
- `title {String}` enables generating `document.title` from the last item of the breadcrumb (default: `null`)
- __NEW__: `arrowicon {String}` arrow icon (default: `ti ti-angle-right`)

## Data-source example

```js
[
	{
		name: 'Home',                // A link label
		url: '/'                     // URL address
		callback: Function(el, e)    // Optional, a callback for the click event
	},
	{
		name: 'Products',            // A link label
		url: '/'                     // URL address
	}
];
```

## Methods

- `component.add(name1, url1, [callback])(name2, url2)(name3, url3)...`
- `component.root()` it resets a breadcrumb

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)