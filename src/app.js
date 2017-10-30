/**
 * Created by deexiao on 2017/10/12.
 */
const Koa = require('koa'),
	bodyParser = require('koa-bodyparser'),
	onerror = require('koa-onerror'),
    cors = require('koa2-cors');

const config = require('./config');
const log = require('./config/logger');
const app = new Koa(),
	ip = process.env.HTTP_IP || undefined,
	port = config.koa_port || 3000;


/*app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	log.info(`${ctx.method} ${ctx.url} - ${ms}`);
});*/

onerror(app);

app.use(cors());

app.use(bodyParser({
	limit: '10mb'
}));

app.on('error', err => {
	log.error('server error', err)
});
app.on('error', (err, ctx) => {
	log.error('server error', err, ctx)
});

const appRouter = require('./router');
appRouter(app);

const websocketHost = require("./service/WebsocketSocketioHost");

module.exports = app.listen(port, ip);
log.info('listening on port %s', port);
