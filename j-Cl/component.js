COMPONENT('cl', function(self, config) {
	self.nocompile();
	self.readonly();
	self.make = function() {
		var data = config.items || self.attr('value') || self.attr('items') || self.attrd('items') || self.html();
		data && self.set(data.parseSource());
	};
});