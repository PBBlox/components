COMPONENT('idletime', 'count:300', function(self, config) {

	var is = false;
	var count = 0;
	var interval;
	var interval_rebind;
	var $W = $(W);

	self.singleton();
	self.blind();
	self.readonly();

	function rebind() {
		is && EMIT('idletime', false, 0);
		is = false;
		count = 0;
		unbind();
		interval_rebind && clearTimeout(interval_rebind);
		interval_rebind = setTimeout(rebind2, config.count * 100);
	}

	function rebind2() {
		$W.on('mousemove click keyup touchstart focus', rebind);
	}

	function unbind() {
		$W.off('mousemove click keyup touchstart focus', rebind);
	}

	self.destroy = function() {
		interval_rebind && clearTimeout(interval_rebind);
		clearInterval(interval);
		interval = null;
		unbind();
	};

	self.make = function() {
		rebind2();
		interval = setInterval(function() {
			if (count > config.count && !is) {
				is = true;
				EMIT('idletime', true, count);
			} else
				count++;
		}, 1000);
	};
});