COMPONENT('autoselect', 'selector:.autoselect a;class:selected', function(self, config) {

	self.singleton();
	self.readonly();

	self.refresh = function() {
		var url = NAV.url || location.pathname;
		$(config.selector).each(function() {
			var el = $(this);
			var href = el.attr('href');
			el.tclass(config.class, url === href || (href !== '/' && url.includes(href)));
		});
	};

	self.make = self.refresh;
	self.setter = self.refresh;

});