/**
 * Created by deexiao on 2017/10/13.
 */
module.exports = function (app) {
	let router = new require('koa-router')();

	router.get('/', function (ctx, next) {
		ctx.body = 'Node Notice!';
	});

	require('./Client')(router);
	require('./Message')(router);


	app.use(router.routes()).use(router.allowedMethods());
};
