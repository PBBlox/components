COMPONENT('selection', 'remember:1;key:id;class:selected;click:.selection;selector:.selection;attr:id;event:click;dblclickselectall:1', function(self, config, cls) {

	self.make = function() {

		self.aclass(cls);

		self.event(config.event, config.click, function(e) {
			e.preventDefault();
			e.stopPropagation();
			var el = $(this);
			if (config.click !== config.selector)
				el = el.find(config.selector);
			self.toggle(el);
		});

		if (config.dblclickselectall) {
			self.event('dblclick', config.click, function() {
				self.selecttoggle();
			});
		}

		config.cancel && self.watch(self.makepath(config.cancel), self.selectnone);
	};

	self.selectall = function() {
		var arr = self.find(config.selector);
		var sel = [];
		for (var i = 0; i < arr.length; i++) {
			var el = $(arr[i]);
			sel.push(el.attrd(config.attr));
			el.aclass(config.class);
		}
		self.bind('@modified @touched', sel);
	};

	self.selectnone = function() {
		var model = self.get();
		if (model && model.length) {
			var arr = self.find(config.selector);
			for (var i = 0; i < arr.length; i++) {
				var el = $(arr[i]);
				el.rclass(config.class);
			}
			self.bind('@modified @touched', []);
		}
	};

	self.selecttoggle = function() {
		var arr = self.find(config.selector);
		var sel = [];
		for (var i = 0; i < arr.length; i++) {
			var el = $(arr[i]);
			if (el.hclass(config.class)) {
				el.rclass(config.class);
			} else {
				sel.push(el.attrd(config.attr));
				el.aclass(config.class);
			}
		}
		self.bind('@modified @touched', sel);
	};

	self.toggle = function(id) {

		if (id instanceof jQuery)
			id = id.attrd(config.attr);

		var model = self.get();
		var added = false;
		if (model == null) {
			model = [id];
			added = true;
			self.rewrite(model);
		} else {
			var index = model.indexOf(id);
			if (index === -1) {
				model.push(id);
				added = true;
			} else
				model.splice(index, 1);
		}

		var el = self.find(config.selector + '[data-{0}="{1}"]'.format(config.attr, id));
		el.tclass(config.class, added);
		self.bind('@modified @touched', model);
	};

	self.recalc = function() {
		var arr = self.find(config.selector);
		var model = self.get() || EMPTYARRAY;
		for (var i = 0; i < arr.length; i++) {
			var el = $(arr[i]);
			el.tclass(config.class, model.indexOf(el.attrd(config.attr)) !== -1);
		}
	};

	var datasource = function(path, value) {

		if (M.is20)
			value = path;

		if (!config.remember) {
			self.bind('@modified', []);
			return;
		}

		if (!value)
			value = EMPTYARRAY;

		var model = self.get() || EMPTYARRAY;
		var rem = [];
		for (var i = 0; i < model.length; i++) {
			var item = value.findItem(config.key, model[i]);
			if (!item)
				rem.push(model[i]);
		}

		for (var i = 0; i < rem.length; i++)
			model.splice(model.indexOf(rem[i]), 1);

		self.bind('@modified @setter', model);
	};

	self.configure = function(key, value) {
		if (key === 'datasource')
			self.datasource(value, datasource);
	};

	self.setter = function(value) {
		setTimeout2(self.ID, self.recalc, 10);
	};

});