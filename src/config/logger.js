/**
 * Created by deexiao on 2017/10/12.
 */
"use strict";

const path = require('path'),
	bunyan = require('bunyan');

const log_path = path.resolve(__dirname, '../../logs');

function reqSerializer(req) {
	return {
		method: req.method,
		url: req.url,
		headers: req.headers
	};
}

//app日志文件
module.exports = bunyan.createLogger({
	src: true,
	name: 'node-notice',
	streams: [
		{
			level: 'info',
			path: `${log_path}/node-notice.log`,
			period: '1d',   // daily rotation
			count: 30        // keep 30 back copies
		},
		{
			level: 'info',
			stream: process.stdout            // log INFO and above to stdout
		},
	],
	serializers: {
		req: reqSerializer
	}
});
