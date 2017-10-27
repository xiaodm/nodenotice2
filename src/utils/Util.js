/**
 * Created by deexiao on 2017/10/13.
 */

"use strict";
const log = require("../config/logger");
const request = require("co-request");
const Error = require('../utils/Error');
const Util = (function () {
	function Util() {
	}
	Util.getIPAddress = function () {
		var interfaces = require('os').networkInterfaces();
		for (var devName in interfaces) {
			var iface = interfaces[devName];
			if (!/(loopback|vmware|internal)/gi.test(devName)) {
				for (var i = 0; i < iface.length; i++) {
					var alias = iface[i];
					if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.mac !== '00:00:00:00:00:00')
						return alias.address;
				}
			}
		}
		return '0.0.0.0';
	};
	Util.succeed = function (result) {
		return { data: result, success: true };
	};

	Util.error = function (errorCode) {
		return { data: false, success: false, error: Error[errorCode] };
	};

	Util.postData = function (url, data) {
		return request.post({
			url: url,
			body: data,
			json: true,
			headers: {"content-type": "application/json"}
		}).catch(err => {
			log.error('post successful!  Server responded with:', err);
		});
	};

	return Util;
}());
module.exports = Util;
