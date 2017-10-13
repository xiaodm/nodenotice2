/**
 * Created by deexiao on 2017/10/12.
 */
"use strict";

require('babel-register')({
	ignore: /node_modules\/(?!koa-*)/
});

// 启动
require('./src/app');
