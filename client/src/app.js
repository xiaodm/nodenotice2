/**
 * Created by deexiao on 2017/10/17.
 */
const
koa = require('koa'),
	path = require('path'),

	bodyParser = require('koa-bodyparser'),
	conditional = require('koa-conditional-get'),
	etag = require('koa-etag'),
	compress = require('koa-compress'),
	//staticCache = require('koa-static-cache'),
	serve = require('koa-static'),
	onerror = require('koa-onerror'),
	Router = require('koa-router'),
	render = require('koa-ejs');

const app = new koa(),
	appRouter = require('./router'),
	ip = process.env.HTTP_IP || undefined,
	port = process.env.HTTP_PORT || 8000;

//渲染模板
render(app, {
	root: 'view',
	viewExt: 'ejs',
	layout: false
});

onerror(app);

app.use(bodyParser({
	limit: '10mb'
}));
app.use(conditional());
app.use(etag());
app.use(compress());

app.use(serve('src/public'));

//应用路由
appRouter(app);

app.listen(port, ip);

console.log('listening on port %s', port);

module.exports = app;
