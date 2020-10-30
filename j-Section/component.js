COMPONENT('section', 'margin:0;scroll:true;delay:100;scrollbar:0;visibleY:1;height:100;invisible:1;back:Back;delayanim:100', function(self, config, cls) {

	var elb, elh;
	var scrollbar;
	var cls2 = '.' + cls;
	var init = false;
	var ww = 0;
	var current;

	self.readonly();

	self.init = function() {
		var obj;

		if (W.OP)
			obj = W.OP;
		else
			obj = $(W);

		var resize = function() {
			for (var i = 0; i < M.components.length; i++) {
				var com = M.components[i];
				if (com.name === 'section' && com.dom.offsetParent && com.$ready && !com.$removed)
					com.resize();
			}
		};

		obj.on('resize', function() {
			setTimeout2('sectionresize', resize, 200);
		});
	};

	self.destroy = function() {
		scrollbar && scrollbar.destroy();
	};

	self.configure = function(key, value, init) {
		switch (key) {
			case 'minheight':
			case 'margin':
			case 'marginxs':
			case 'marginsm':
			case 'marginmd':
			case 'marginlg':
				!init && self.resize();
				break;
			case 'selector': // backward compatibility
				config.parent = value;
				self.resize();
				break;
		}
	};

	self.scrollbottom = function(val) {
		if (val == null)
			return elb[0].scrollTop;
		elb[0].scrollTop = (elb[0].scrollHeight - self.dom.clientHeight) - (val || 0);
		return elb[0].scrollTop;
	};

	self.scrolltop = function(val) {
		if (val == null)
			return elb[0].scrollTop;
		elb[0].scrollTop = (val || 0);
		return elb[0].scrollTop;
	};

	self.make = function() {

		self.aclass(cls);
		self.element.find('> section[data-if]').aclass(cls + '-section');

		var dom = self.element.find('> div');

		config.invisible && self.aclass('invisible');
		config.scroll && self.element.wrapInner('<div class="' + cls + '-body"></div></div>');

		self.element.prepend('<div class="{0}-header"><span class="{0}-back hidden"><i class="fa fa-chevron-left"></i>{1}</span><label></label></div>'.format(cls, config.back));

		elb = self.find('> .{0}-body'.format(cls)).eq(0);
		elh = self.find('> .{0}-header'.format(cls)).eq(0);
		elh.prepend(dom);

		elh.find(cls2 + '-back').on('click', function() {
			self.set($(this).attrd('parent'));
		});

		self.aclass('{0} {0}-hidden'.format(cls));
		if (config.scroll) {
			if (config.scrollbar) {
				scrollbar = W.SCROLLBAR(self.find(cls2 + '-body'), { visibleY: config.visibleY, visibleX: config.visibleX, orientation: config.visibleX ? null : 'y', parent: self.element });
				self.scrolltop = scrollbar.scrollTop;
				self.scrollbottom = scrollbar.scrollBottom;
			} else {
				self.aclass(cls + '-scroll');
				self.find(cls2 + '-body').aclass('noscrollbar');
			}
		}

		self.resize();
	};

	self.released = function(is) {
		!is && self.resize();
	};

	var css = {};

	self.resize = function(scrolltop) {

		if (self.release())
			return;

		var el = self.parent(config.parent);
		var h = el.height();
		var w = el.width();
		var width = WIDTH();
		var margin = config.margin;
		var responsivemargin = config['margin' + width];

		if (responsivemargin != null)
			margin = responsivemargin;

		if (margin === 'auto')
			margin = self.element.offset().top;

		if (h === 0 || w === 0) {
			self.$waiting && clearTimeout(self.$waiting);
			self.$waiting = setTimeout(self.resize, 234);
			return;
		}

		// var offsetH = self.find(cls2 + '-header').height();

		h = ((h / 100) * config.height) - margin;

		if (config.minheight && h < config.minheight)
			h = config.minheight;

		css.height = h;
		css.width = self.element.width();
		ww = css.width;

		self.find(cls2 + '-section').css('width', css.width);

		css.width = null;
		self.css(css);
		elb.length && elb.css(css);
		self.element.SETTER('*', 'resize');
		var c = cls + '-hidden';
		self.hclass(c) && self.rclass(c, 100);
		scrollbar && scrollbar.resize();
		scrolltop && self.scrolltop(0);

		if (!init) {
			self.rclass('invisible', 250);
			init = true;
		}

	};

	self.resizescrollbar = function() {
		scrollbar && scrollbar.resize();
	};

	var done_close_cb = function(el) {
		el.aclass('hidden invisible').rclass(cls + '-animate');
	};

	var done_close = function() {
		setTimeout(done_close_cb, config.delayanim, $(this));
	};

	var done_open_cb = function(el) {
		el.rclass(cls + '-animate');
	};

	var done_open = function() {
		setTimeout(done_open_cb, config.delayanim, $(this));
		setTimeout(self.resize, config.delay, config.scrolltop);
	};

	self.setter = function(value, path, type) {

		if (current === value) {
			setTimeout(self.resize, config.delay, config.scrolltop);
			return;
		}

		var section = elb.find(cls2 + '-section[data-if="' + value + '"]');
		var visible = elb.find(cls2 + '-visible');
		var ltr = false;
		var parent;

		current = value;

		if (visible.length) {
			parent = visible.attrd('parent');
			ltr = parent === value;
			visible.rclass(cls + '-visible').aclass(cls + '-animate').animate({ 'margin-left': ltr ? ww : -ww }, config.delayanim, done_close);
		}

		if (section.length) {

			var icon = section.attrd('icon');

			elh.find('label').html((icon ? '<i class="{0}"></i>'.format(icon) : '') + Thelpers.encode(section.attrd('title')));

			var child = section[0].children[0];
			if (child && (child.tagName === ('SCR' + 'IPT') || child.tagName === 'TEMPLATE')) {
				section[0].innerHTML = child.innerHTML;
				if (child.innerHTML.COMPILABLE())
					COMPILE();
			}

			parent = section.attrd('parent');
			section.rclass('hidden invisible');

			if (type)
				section.css({ 'margin-left': ltr ? -ww : ww }).aclass(cls + '-visible ' + cls + '-animate').animate({ 'margin-left': 0 }, config.delayanim, done_open);
			else
				section.aclass(cls + '-visible');

			elh.find('span').tclass('hidden', !parent).attrd('parent', parent || '');
			config.autofocus && setTimeout(function() {
				section.find(typeof(config.autofocus) === 'string' ? config.autofocus : 'input[type="text"],select,textarea').eq(0).focus();
			}, config.delayanim * 2);
		}

	};
});