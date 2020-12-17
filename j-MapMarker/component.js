COMPONENT('mapmarker', 'parent:auto;type:roadmap;draggable:false;markerwidth:40;markerheight:50;infox:0;infoy:0;labelopacity:0.75;markercluster:1', function(self, config, cls) {

	var markers = [];
	var skip = false;

	self.readonly();

	self.init = function() {
		IMPORT('https://maps.googleapis.com/maps/api/js?key={0}&libraries=geometry .js'.format(config.key));
	};

	self.parseGPS = function(val) {
		var tmp = val.split(',');
		if (tmp[0] && tmp[1])
			return new google.maps.LatLng(tmp[0].trim(), tmp[1].trim());
	};

	self.prepare = function(lat, lng) {

		lat = lat.toString();
		lng = lng.toString();

		var max = function(val, num) {
			var index = val.indexOf('.');
			return index === -1 ? val : val.substring(0, index + 1 + num);
		};

		return max(lat, 6) + ',' + max(lng, 6);
	};

	self.onscroll = function() {

		var visible = [];

		for (var i = 0; i < markers.length; i++) {
			var opt = markers[i].custom;
			opt.gps = self.gps;
			opt.zoom = self.map.zoom;
			opt.onposition && opt.onposition();
			if (self.map.getBounds().contains(markers[i].getPosition()))
				visible.push(opt);
		}

		EMIT('reflow');
		config.onposition && self.SEEX(config.onposition, self, visible);
	};

	self.make = function() {

		self.aclass(cls);

		WAIT('google', function() {

			var animations = { drop: google.maps.Animation.DROP, bounce: google.maps.Animation.BOUNCE };
			var options = {};

			options.zoom = config.zoom || 13;
			options.scrollwheel = true;
			options.streetViewControl = false;
			options.mapTypeControl = false;
			options.mapTypeId = config.type;
			options.fullscreenControl = false;
			options.gestureHandling = 'greedy';

			if (config.darkmode || $('body').hclass('ui-dark'))
				options.styles = PARSE('[{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]}]');

			self.map = new google.maps.Map(self.element.get(0), options);
			self.geo = new google.maps.Geocoder();

			var pos = self.get();
			if (pos && !(/[a-z]/i).test(pos))
				self.map.setCenter(self.parseGPS(pos));

			self.map.addListener('center_changed', function() {
				var pos = self.map.center;
				var gps = pos.lat() + ',' + pos.lng();
				skip = true;
				self.gps = gps;
				self.zoom = self.map.zoom;
				self.set(gps);
				setTimeout2(self.ID + 'scroll', self.onscroll, 100);
			});

			options = { position: self.map.getCenter(), map: self.map };
			options.draggable = config.draggable;

			if (config.animation)
				options.animation = animations[config.animation];

			if (config.icon)
				options.icon = config.icon;

			config.onready && self.SEEX(config.onready, self);
			self.resize();

			if (config.markercluster)
				self.markercluster = new MarkerClusterer(self.map, [], { styles: [{ width: 30, height: 30, className: cls + '-cluster-1', }, { width: 40, height: 40, className: cls + '-cluster-2', }, {width: 50, height: 50, className: cls + '-cluster-3' }], clusterClass: cls + '-cluster' });

		});
	};

	self.setter = function(value) {

		if (skip) {
			skip = false;
			return;
		}

		if (value) {
			if ((/[a-z]/i).test(value)) {
				self.geo.geocode({ address: value, partialmatch: true }, function(response, status) {
					if (status === 'OK' && response.length) {
						var result = response[0].geometry.location;
						self.map.setCenter(result);
					}
				});
			} else
				self.map.setCenter(self.parseGPS(value));
		}

	};

	self.resizeforce = function() {

		var d = WIDTH();
		var h = config['height' + d] || config.height || 0;
		var m = config['margin' + d] || config.margin || 0;

		if (h) {
			self.css({ width: '', height: h - m });
		} else {
			var parent = self.parent(config.parent);
			var w = parent.width();
			var h = parent.height();
			self.css({ width: w, height: h - m });
		}

		self.map && google.maps.event.trigger(self.map, 'resize');
	};

	self.resize = function() {
		setTimeout2(self.ID, self.resizeforce, 300);
	};

	ON('resize2', self.resize);

	self.reset = function(lat, lng) {
		google.maps.event.trigger(self.map, 'resize');
		if (lng !== null) {
			var position = new google.maps.LatLng(lat, lng);
			self.map.setCenter(position);
		}
		return self;
	};

	self.clear = function() {
		if (markers.length) {
			for (var i = 0; i < markers.length; i++)
				markers[i].setMap(null);
			markers = [];
			self.markercluster && self.markercluster.clearMarkers();
		}
	};

	self.add = function(opt) {

		// opt.icon {String}
		// opt.gps {String}
		// opt.center {Boolean}
		// opt.callback {Function(opt)}
		// opt.onclick {Function(opt)}
		// opt.onposition {Function(opt)}
		// opt.tooltip

		var pos = self.parseGPS(opt.gps);
		var icon = { url: opt.icon, scaledSize: new google.maps.Size(config.markerwidth, config.markerheight), origin: new google.maps.Point(0, 0), anchor: new google.maps.Point((config.markerwidth + (config.markerwidth / 2)) >> 0, config.markerheight) };
		var marker = new MarkerWithLabel({ position: pos, map: self.map, draggable: false, raiseOnDrag: false, labelStyle: { opacity: config.labelopacity }, labelAnchor: new google.maps.Point(config.infox, config.infoy), labelClass: cls + '-marker', labelInBackground: false, icon: icon, title: opt.tooltip, zIndex: 1 });
		var html = $('<div class="{0}-marker"></div>'.format(cls));
		marker.set('labelContent', html[0]);
		markers.push(marker);

		marker.custom = opt;
		opt.marker = marker;
		opt.element = html;
		opt.zoom = self.zoom;
		opt.gps = self.gps;
		opt.map = self.map;
		self.markercluster.addMarker(marker);

		opt.remove = function() {
			markers.splice(markers.indexOf(opt.marker), 1);
			opt.marker.setMap(null);
			delete opt.callback;
			delete opt.onclick;
		};

		opt.setIcon = function(icon) {
			marker.setIcon(icon);
		};

		opt.setPosition = function(gps) {
			if (opt.gps !== gps && gps) {
				opt.gps = gps;
				opt.marker.setPosition(self.parseGPS(gps));
			}
		};

		opt.setVisible = function(value) {
			opt.marker.setVisible(value);
		};

		opt.onclick && google.maps.event.addListener(marker, 'click', function() {
			opt.onclick(opt);
		});

		opt.callback && opt.callback(opt);

		setTimeout2(self.ID + 'move', function(pos) {
			opt.center && self.map.setCenter(pos);
			self.onscroll();
		}, 500, null, pos);
	};

}, ['https://cdn.componentator.com/markerwithlabel.min@123.js', 'https://cdn.componentator.com/markerclusterer.min@365.js']);