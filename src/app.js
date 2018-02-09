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
	port = config.koa_port || 3366;

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

var server = require('http').Server(app.callback());
// start socket host
require("./service/WebsocketSocketioHost")(server);

server.listen(port, ip);
log.info('listening on port %s', port);

process.on('uncaughtException', function (err) {
	log.error('Uncaught exception ', err);
});

process.on('unhandledRejection', (reason, p) => {
	log.error(reason, p);
});
