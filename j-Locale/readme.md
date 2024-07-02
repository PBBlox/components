## j-Locale

This component sets current browser locale (number format, date format and time format) according to the `navigatior.language`.

- jComponent `v19|v20`
- singleton
- `path` will contain current's browser locale
- sets `DEF.dateformat` and it creates environment value called `[ts]`

__Configuration__:

- `language {String}` optional, a custom language (default: `navigator.language`)
- `requests {Boolean}` optional, adds a language to the every request (it affects `DEF.languagehtml`, default: `false`)

__Environments__:

- `[ts]` full timestamp
- `[date]` only date
- `[time]` only time

__Output__:

```js
{
	dt: 'yyyy–MM–dd', // date format
	nf: 1,  // number format: 1 = 100 000.123, 2 = 100 000,123, 3 = 100.000,123, 4 = 100,000.123
	fdw: 0, // first day of week
	tf: 24  // time format: 12, 24
}
````

__Methods__:

- `component.use(language)`

__Supported special languages__:

- `eu` with the dd.MM.yyyy with a 24 hour system
- `us` with the MM-dd-yyyy with a 12 hour system

### Author

- Peter Širka <petersirka@gmail.com> and Lucia Širková
- [License](https://www.totaljs.com/license/)