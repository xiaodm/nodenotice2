/**
 * Created by deexiao on 2017/10/12.
 */
const Koa = require('koa'),
	bodyParser = require('koa-bodyparser'),
	onerror = require('koa-onerror');

const config = require('./config');
const log = require('./config/logger');
const app = new Koa(),
	ip = process.env.HTTP_IP || undefined,
	port = config.koa_port || 3000;

const appRouter = require('./router');
appRouter(app);

onerror(app);

app.use(bodyParser({
	limit: '10mb'
}));

app.on('error', err => {
	log.error('server error', err)
});
app.on('error', (err, ctx) => {
	log.error('server error', err, ctx)
});

module.exports = app.listen(port, ip);
log.info('listening on port %s', port);
