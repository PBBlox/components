COMPONENT('title', 'separator:-', function(self, config) {

	self.singleton();
	self.readonly();

	self.make = function() {
		config.name = document.title;
	};

	self.setter = function(value) {
		self.rename(value);
	};

	self.rename = function(text) {
		if (!text)
			text = config.empty;
		document.title = (text ? (text + ' ' + config.separator + ' ') : '') + config.name;
	};

});