/**
 * Created by deexiao on 2017/10/13.
 */
const MessageBody_1 = require("../model/MessageBody");
const MessageType_1 = require("../model/MessageType");
const Util = require('../utils/Util');
const config = require("../config");
const log = require('../config/logger');

const MessageProcessCore_1 = require('./MessageProcessCore');


let socketPort = process.env.NODE_APP_INSTANCE ? config.socket_port + Number(process.env.NODE_APP_INSTANCE) : config.socket_port;
let io = require('socket.io')(socketPort);

let currentIp = Util.getIPAddress();

log.info('current socketPort:' + socketPort);

MessageProcessCore_1.removeHostClients(currentIp,socketPort);

if (config.redisOptions) {
	const redis = require('socket.io-redis');
	io.adapter(redis({
		host: config.redisOptions.host,
		port: config.redisOptions.port,
		password: config.redisOptions.auth
	}));
}

MessageProcessCore_1.socketServer = io;
io.on('connection', function (conn) {
	log.info('user connected,id:' + conn.id);
	conn.on("msg", function (dataStr) {
		log.info("ws received length" + dataStr.length);
		log.info("ws received DATA:" + dataStr);
		let connInfo = {
			connKey: conn.id,
			serverWsIp: currentIp,
			serverWsPort: socketPort,
			clientIp: '',
			clientPort: ''
		};
		MessageProcessCore_1.initReceive(dataStr, connInfo);
		// log.info("Received " + str);
	});
	conn.on("disconnect", function (reason) {
		log.info(`user disconnected event,conn id:${conn.id},${reason}`);
		try {
			MessageProcessCore_1.disconnectClientInfo(conn.id);
		}
		catch (e) {
			log.error(e);
		}
	});
	conn.on("error", function (error) {
		log.error(error);
	});
});

io.on("close", function () {
	log.info('ws server close');
});
io.on("exit", function (code) {
	log.info('ws server exit');
});


module.exports = io;
