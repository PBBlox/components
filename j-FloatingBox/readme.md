## j-FloatingBox

- jComponent `v19|v20`
- supports __dark mode__

__Configuration__:

- `zindex {Number}` a default z-index for forms (default: `10`)

__Methods__:

- `component.show(opt)` shows a box
	- `opt.id {String}` __required__ - a box identifier
	- `opt.element {HTML Element}` __required__ - target element
		- or you can use absolute position:
		- `opt.x {Number}`
		- `opt.y {Number}`
	- `opt.offsetX {Number}` affects offset X
	- `opt.offsetY {Number}` affects offset Y
	- `opt.align {String}` align `left` (default), `center` or `right`
	- `opt.position {String}` align `top` (default), `bottom`
	- `opt.minwidth {Number}`
	- `opt.maxwidth {Number}`
	- `opt.mouseleave {String}` a link to the method, it's executed when the mouse cursor leaves the box `function(e, close)}`
	- `opt.autofocus {Boolean}` tries to focus first input/textarea
	- `opt.hide {String}` a link to the method `function(box_element)`
	- `opt.show {String}` a link to the method `function(box_element)`
	- `opt.autohide {Boolean}` enables hiding a box after clicking on it
	- `opt.delay {Number}` a simple delay for rendering (default: `0`)
	- `opt.scrolltop {Boolean}` it deducts scroll top position from the current offset Y (default: `false`)
	- `opt.url {String}` optional, URL address for the content
		- `opt.path {String}` will replace all `~PATH~` phrases in the downloaded template
		- `opt.ID {String}` will replace all `~ID~` phrases in the downloaded template
- `component.hide()` hides the last open box
- `component.hide([box_id])` hides the specific box and its all nested boxes
- `component.hide(true)` hides all boxes

### Boxes

```html
<div class="floatingbox" data-id="yourid" data-config="">
	Your content
</div>
```

__Configuration__:

- `init {String}` a link to the method, it's executed when the box is initialized the first time `function(element)`
- `reload {String}` a link to the method `function(element)`
- `hide {String}` a link to the method, it's executed when the box is going to hide `function(element)`
- `scope {String}` a custom scope/plugin name
- `zindex {Number}` a custom z-index for this box

### Author

- Peter Širka <petersirka@gmail.com>
- [License](https://www.totaljs.com/license/)