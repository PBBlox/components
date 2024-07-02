COMPONENT('floatingpanel', 'minwidth:200;height:200', function(self, config, cls) {

	var cls2 = '.' + cls;
	var container, timeout, prevtop, previndex;
	var is = false, skiphide = false;
	var parentclass;
	var imported = {};

	self.readonly();
	self.singleton();

	self.make = function() {

		self.aclass(cls + ' hidden');
		self.append('<div class="{0}-scrollbar"><div class="{0}-container"></div></div>'.format(cls));

		self.scrollbar = SCROLLBAR(self.find(cls2 + '-scrollbar'), { orientation: 'y' });
		container = self.find(cls2 + '-container');

		self.event('click', '.selectable', function(e) {
			var el = $(this);
			if (self.opt.callback) {
				self.opt.scope && M.scope(self.opt.scope);
				self.opt.callback(el);
				is = true;
				self.hide(0);
				e.preventDefault();
				e.stopPropagation();
			}
		});

		var e_click = function(e) {

			if (skiphide) {
				skiphide = false;
				return;
			}

			var node = e.target;
			var count = 0;

			is = true;

			while (true) {
				var c = node.getAttribute('class') || '';
				if (c.indexOf(cls) !== -1) {
					is = false;
					break;
				}
				node = node.parentNode;
				if (!node || !node.tagName || node.tagName === 'BODY' || count > 4)
					break;
				count++;
			}

			if (is)
				self.hide(0);
			else
				self.opt.scope && M.scope(self.opt.scope);
		};

		var e_resize = function() {
			is && self.hide(0);
		};

		self.bindedevents = false;

		self.bindevents = function() {
			if (!self.bindedevents) {
				$(document).on('click', e_click);
				$(W).on('resize', e_resize);
				self.bindedevents = true;
			}
		};

		self.unbindevents = function() {
			if (self.bindedevents) {
				self.bindedevents = false;
				$(document).off('click', e_click);
				$(W).off('resize', e_resize);
			}
		};

		var fn = function() {
			is && self.hide(1);
		};

		self.on('reflow + resize + resize2', fn);
		self.on('scroll', function(el) {
			if (is && (!el || !el[0] || el[0].parentNode.$scrollbar !== self.scrollbar))
				self.hide(1);
		});

		$(W).on('scroll', fn);
	};

	self.up = function() {
		is && self.move(-1);
	};

	self.down = function() {
		is && self.move(1);
	};

	self.select = function(el) {
		if (is && self.opt.callback) {
			if (el) {
				self.opt.scope && M.scope(self.opt.scope);
				self.opt.callback(selected);
			} else {
				var selected = container.find('.selected');
				if (selected.length) {
					self.opt.scope && M.scope(self.opt.scope);
					self.opt.callback(selected);
				}
			}
			self.hide(0);
		}
	};

	self.move = function(step) {

		var arr = self.element.find('.selectable');
		var index = -1;

		for (var i = 0; i < arr.length; i++) {
			var el = arr[i];
			if (el.classList.contains('selected')) {
				index = i;
				break;
			}
		}

		var newindex = index + step;

		if (previndex === newindex)
			return;

		if (arr[index])
			arr[index].classList.remove('selected');

		index = newindex;
		previndex = newindex;

		if (index > arr.length - 1)
			index = arr.length - 1;
		else if (index < 0)
			index = 0;

		if (arr[index]) {
			arr[index].classList.add('selected');
			var top = arr[index].offsetTop;
			if (prevtop !== top) {
				prevtop = top;
				var h = self.scrollbar.element.height();
				self.scrollbar.scrollTop(top - 30);
			}
		}

	};

	self.show = function(opt) {

		// opt.element
		// opt.items
		// opt.callback(value, el)
		// opt.offsetX     --> offsetX
		// opt.offsetY     --> offsetY
		// opt.offsetWidth --> plusWidth
		// opt.placeholder
		// opt.render
		// opt.custom
		// opt.minwidth
		// opt.maxwidth
		// opt.classname
		// opt.height

		var el = opt.element instanceof jQuery ? opt.element[0] : opt.element;

		prevtop = null;
		previndex = null;
		self.tclass(cls + '-default', !opt.render);

		if (parentclass) {
			self.rclass(parentclass);
			parentclass = null;
		}

		if (opt.classname) {
			self.aclass(opt.classname);
			parentclass = opt.classname;
		}

		if (!opt.minwidth)
			opt.minwidth = 200;

		if (is) {
			var me = self.target === el;
			self.hide(0);
			if (me)
				return;
		}

		self.initializing = true;
		self.target = el;

		var element = $(opt.element);

		setTimeout(self.bindevents, 500);

		self.opt = opt;
		opt.class && self.aclass(opt.class);

		self.target = element[0];

		var w = element.width();
		var offset = element.offset();
		var width = w + (opt.offsetWidth || 0);

		if (opt.minwidth && width < opt.minwidth)
			width = opt.minwidth;
		else if (opt.maxwidth && width > opt.maxwidth)
			width = opt.maxwidth;

		if (opt.import) {

			var isnew = false;
			var arr;

			if (imported[opt.import]) {
				arr = imported[opt.import];
				container.empty();
			} else {
				var tmp = $('<ui-import config="url:{0}"></ui-import>'.format(opt.import));
				arr = imported[opt.import] = [];
				isnew = true;
				for (var i = 0; i < tmp.length; i++)
					arr.push(tmp[i]);
			}

			for (var i = 0; i < arr.length; i++)
				container[0].appendChild(arr[i]);

			isnew && COMPILE(container);

		} else {
			if (typeof(opt.html) !== 'string') {
				var tmp = $(opt.html);
				opt.ishidden = tmp.hclass('hidden');
				opt.isinvisible = tmp.hclass('invisible');
				opt.parent = tmp.rclass('hidden invisible').parent();
			}
			container.empty().append(opt.html);
		}

		var options = { left: 0, top: 0, width: width };

		switch (opt.align) {
			case 'center':
				options.left = Math.ceil((offset.left - width / 2) + (opt.element.innerWidth() / 2));
				break;
			case 'right':
				options.left = (offset.left - width) + opt.element.innerWidth();
				break;
			default:
				options.left = offset.left;
				break;
		}

		options.top = opt.position === 'bottom' ? ((offset.top - self.height()) + element.height()) : offset.top;
		options.scope = M.scope ? M.scope() : '';

		if (opt.offsetX)
			options.left += opt.offsetX;

		if (opt.offsetY)
			options.top += opt.offsetY;

		var mw = width;
		var mh = opt.height || config.height;

		if (options.left < 0)
			options.left = 10;
		else if ((mw + options.left) > WW)
			options.left = (WW - mw) - 10;

		if (options.top < 0)
			options.top = 10;
		else if ((mh + options.top) > WH)
			options.top = (WH - mh) - 10;

		self.css(options);
		self.scrollbar.element.css('height', mh);

		setTimeout(function() {
			self.scrollbar.resize();
			self.initializing = false;
			self.opt.init && self.opt.init();
			is = true;
		}, 100);

		if (is)
			return;

		self.rclass('hidden');

		setTimeout(function() {
			if (self.opt && self.target && self.target.offsetParent)
				self.aclass(cls + '-visible');
			else
				self.hide(1);
		}, 105);
	};

	self.hide = function(sleep) {

		if (!is || self.initializing)
			return;

		var hideforce = function() {
			self.unbindevents();
			self.rclass(cls + '-visible').aclass('hidden');
			if (self.opt) {

				if (self.opt.import) {
					var arr = [];
					var dom = container[0];
					while (dom.children.length)
						arr.push(dom.removeChild(dom.children[0]));
					imported[self.opt.import] = arr;
				}

				if (self.opt.parent) {

					var parent = self.opt.parent[0];
					var first = $(container[0].children[0]);

					if (self.opt.ishidden)
						first.aclass('hidden');

					if (self.opt.isinvisible)
						first.aclass('invisible');

					while (container[0].children.length)
						parent.appendChild(container[0].children[0]);

				}

				self.opt.parent = null;
				self.opt.close && self.opt.close();
				self.opt.class && self.rclass(self.opt.class);
				self.opt = null;
			}
			is = false;
		};

		timeout && clearTimeout(timeout);
		if (sleep)
			timeout = setTimeout(hideforce, sleep ? sleep : 100);
		else
			hideforce();
	};
});