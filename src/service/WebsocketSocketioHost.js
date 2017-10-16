/**
 * Created by deexiao on 2017/10/13.
 */
const ClientInfo_1 = require("../model/ClientInfo");
const MessageBody_1 = require("../model/MessageBody");
const MessageType_1 = require("../model/MessageType");
const config = require("../config");
const log = require('../config/logger');

const MessageProcessCore_1 = require('./MessageProcessCore');

const WebsocketNWHost = (function () {

	function WebsocketNWHost() {
	}

	WebsocketNWHost.prototype.initSocket = function () {
		let _this = this;

		let _socketPort = process.env.NODE_APP_INSTANCE ? config.socket_port + process.env.NODE_APP_INSTANCE : config.socket_port;
		let io = require('socket.io')(_socketPort);

		if (config.redisOptions) {
			const redis = require('socket.io-redis');
			io.adapter(redis({ host: config.redisOptions.host, port: config.redisOptions.port, password: config.redisOptions.auth }));
		}

		MessageProcessCore_1.socketServer = io;
		io.on('connection',function (conn) {
			console.log('user connected,id:' + conn.id);
			conn.on("msg", function (dataStr) {
				console.log("ws received length" + dataStr.length);

				// log.info("Received " + str);
			});
			conn.on("disconnect", function (reason) {
				log.info(`user disconnected event,conn id:${conn.id},${reason}`);
				var clientInfo = new ClientInfo_1.ClientInfo("", "", "0", "", false, conn.id);
				try {
					_this.wsServer.connections.forEach(function (conn) {
						var messageInfo = new MessageBody_1.MessageBody(MessageType_1.MessageType.DisConnect, clientInfo);
						var message = messageInfo.messageJsonString();
						conn.send(message);
					});
					//_clientsMgr.disconnectClientAndLog(clientInfo);
				}
				catch (e) {
					console.log(e);
				}
			});
			conn.on("error", function (error) {
				console.log(error);
			});
		});

		io.on("close", function () {
			console.log('ws server close');
		});
		io.on("exit", function (code) {
			console.log('ws server exit');
		});

		return io;
	};

	return WebsocketNWHost;
}());
exports.WebsocketNWHost = WebsocketNWHost;
