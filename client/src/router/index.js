/**
 * Created by deexiao on 2017/10/17.
 */
module.exports = function (app) {

	let router = new require('koa-router')();

	require('../controller/chat')(router);

	app.use(router.routes()).use(router.allowedMethods());

};
