/**
 * Created by deexiao on 2017/10/13.
 */
const Util = require('../utils/Util');
const config = require("../config");
const log = require('../config/logger');

const MessageProcessCore_1 = require('./MessageProcessCore');

/**
 * socket.io Host
 * @param http 应用服务，目前仅用做socketio port宿主
 * @constructor
 */
function SocketioManager(http) {

	//当前运行环境变量
	let currentIp = Util.getIPAddress(), // process.env.HTTP_IP || '',
		port = config.koa_port , // process.env.HTTP_PORT || '',
		processId = process.pid,
		processIndex = process.env.PROCESS_INDEX || '';

	//初始化socketio
	let io = require('socket.io')(http, {
		"transports": ['websocket', 'polling']
	});

	if (config.redisOptions) {
		log.info('io.adapter by redis');
		const redis = require('socket.io-redis');
		io.adapter(redis({
			host: config.redisOptions.host,
			port: config.redisOptions.port,
			password: config.redisOptions.auth
		}));
	}

	MessageProcessCore_1.socketServer = io;

	// io 连接事件
	io.on('connection', function (conn) {
		//log.data.info('user connected,id:' + conn.id);
		conn.on("msg", function (dataStr) {
			//log.data.info("ws received length" + dataStr.length);
			//log.data.info("ws received DATA:" + dataStr);
			let connInfo = {
				connKey: conn.id,
				wsIp: currentIp,
				wsPort: port,
				wsPid: processId,
				wsPIndex: processIndex,
				clientIp: '',
				clientPort: ''
			};
			MessageProcessCore_1.initReceive(dataStr, connInfo);
		});
		conn.on("disconnect", function (reason) {
			//log.data.info(`user disconnected event,conn id:${conn.id},${reason}`);
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
	// io 关闭连接事件
	io.on("close", function () {
		//log.data.info('ws server close');
	});
	// io 退出事件
	io.on("exit", function (code) {
		//log.data.info('ws server exit');
	});
}
module.exports = SocketioManager;


