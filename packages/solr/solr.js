var DEFAULTS = {
	host: 'http://127.0.0.1',
	port: '8983',
	core: '', // if defined, should begin with a slash
	path: '/solr', // should also begin with a slash
	timeout: 2000 //ms
};

Solr = function(options) {
	options = options || {};
	this.options = merge(options, DEFAULTS);
};

Solr.createClient = function(options) {
	var solr = new Solr(options);
	logger.info(options);
	return solr;
};

Solr.prototype.query = function(options, callback) {
	options = options || {};

	var url =  this.options.host
		+ ':'
		+ this.options.port
		+ this.options.path
		+ this.options.core
		+ "/select?"
		+ queryStringify(options);
	try{
		HTTP.get(url, {timeout:this.options.timeout},callback)
	}catch(e){
		throw e;
	}

};



function merge(a, b){
	if (a && b) {
		for (var key in b) {
			if (typeof a[key] == 'undefined') {
				a[key] = b[key];
			} else if (typeof a[key] == 'object' && typeof b[key] == 'object') {
				a[key] = merge(a[key], b[key]);
			}
		}
	}
	return a;
}

var stringifyPrimitive = function(v) {
	switch (typeof v) {
		case 'string':
			return v;

		case 'boolean':
			return v ? 'true' : 'false';

		case 'number':
			return isFinite(v) ? v : '';

		default:
			return '';
	}
};

var queryStringify = function(obj, sep, eq, name) {
	sep = sep || '&';
	eq = eq || '=';
	if (obj === null) {
		obj = undefined;
	}

	if (typeof obj === 'object') {
		return Object.keys(obj).map(function(k) {
			var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
			if (Array.isArray(obj[k])) {
				return obj[k].map(function(v) {
					return ks + encodeURIComponent(stringifyPrimitive(v));
				}).join(sep);
			} else {
				return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
			}
		}).join(sep);

	}

	if (!name) return '';
	return encodeURIComponent(stringifyPrimitive(name)) + eq +
		encodeURIComponent(stringifyPrimitive(obj));
};