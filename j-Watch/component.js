COMPONENT('watch', function(self, config, cls) {

	self.readonly();

	self.make = function() {
		self.aclass(cls);
	};

	self.setter = function(value, path, type) {
		config.exec && self.SEEX(config.exec, value, self.element, type, path ? path.toString() : '');
	};

});