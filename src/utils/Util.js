/**
 * Created by deexiao on 2017/10/13.
 */

"use strict";
const log = require("../config/logger");
const request = require("co-request");
const Util = (function () {
	function Util() {
	}

	Util.succeed = function (result) {
		var returnBase = { data: null, success: null };
		returnBase.data = result;
		returnBase.success = true;
		return returnBase;
	};

	Util.error = function (errorMsg) {
		var returnBase = { data: null, success: null, error: null };
		returnBase.data = false;
		returnBase.success = false;
		returnBase.error = { code: 99901, message: errorMsg };
		return returnBase;
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
exports.Util = Util;
