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
