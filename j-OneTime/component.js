COMPONENT('onetime', 'expire:1 year;delay:1000', function(self, config) {

	self.readonly();

	self.make = function() {

		if (!config.exec)
			return;

		var key = [];
		for (let item of self.dom.attributes)
			key.push(item.name + '=' + item.value);
		key = 'onetime' + HASH(key.join('|')).toString(36);

		if (CACHE(key))
			return;

		setTimeout(function() {
			self.EXEC(config.exec);
			CACHE(key, '1', config.expire);
		}, config.delay);

	};

});