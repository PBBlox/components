COMPONENT('template', function(self, config, cls) {

	var properties = null;
	var is = false;
	var checksum = 0;

	self.readonly();

	self.configure = function(key, value) {
		if (key === 'properties')
			properties = value.split(',').trim();
	};

	self.make = function(template) {

		self.aclass(cls);

		if (template) {
			self.template = Tangular.compile(template);
			return;
		}

		var script = self.find('script');

		if (!script.length) {
			script = self.element;
			self.element = self.parent();
		}

		var html = script.html();
		is = html.COMPILABLE();

		self.template = Tangular.compile(html);
		script.remove();
	};

	self.setter = function(value, path) {

		var p = self.path.toString();

		if (properties && path !== p) {
			var key = path.substring(p.length + 1);
			if (!key || properties.indexOf(key))
				return;
		}

		var tmp = HASH(value);

		if (checksum === tmp)
			return;

		checksum = tmp;

		if (value) {
			setTimeout2(self.ID, function() {
				self.html(self.template(value)).rclass('hidden');
				is && COMPILE(self.element);
			}, 100);
		} else
			self.aclass('hidden');
	};
});