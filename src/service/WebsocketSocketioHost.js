/**
 * Created by deexiao on 2017/10/13.
 */
const ClientInfo_1 = require("../model/ClientInfo");
const MessageBody_1 = require("../model/MessageBody");
const MessageType_1 = require("../model/MessageType");
// const PhoneConnInfo_1 = require("../seatnotice/PhoneConnInfo");
// const ws = require("nodejs-websocket");
const config = require("../config");
const log = require('../config/logger');

const WebsocketNWHost = (function () {

	function WebsocketNWHost(server, messageHub, clientsMgr) {
		//移动客户端列表
		this.listPhone = [];
		this.messageHub = messageHub;
		this.clientsMgr = clientsMgr;
	}

	WebsocketNWHost.prototype.initSocket = function () {
		let _messageHub = this.messageHub;
		let _clientsMgr = this.clientsMgr;
		let _this = this;

		let _socketPort = process.env.NODE_APP_INSTANCE ? config.socket_port + process.env.NODE_APP_INSTANCE : config.socket_port;
		let io = require('socket.io')(_socketPort);

		if (config.redisOptions) {
			const redis = require('socket.io-redis');
			io.adapter(redis({ host: config.redisOptions.host, port: config.redisOptions.port, password: config.redisOptions.auth }));
		}
		io.on('connection',function (conn) {
			console.log('user connected,id:' + conn.id);
			conn.on("msg", function (dataStr) {
				console.log("ws received length" + dataStr.length);
				try {
					var data = JSON.parse(dataStr);
					try {
						var connkeys = _clientsMgr.getTagetConnKeys(data.targetProName, data.targetProValues, data.isRegisterInfoPro);
						if (!io.sockets) {
							console.log(" method sendMessage: io.sockets is false.");
							return;
						}

						connkeys.forEach(function (connKey) {
							var messageInfo = new MessageBody_1.MessageBody(data.messageType, data.message);
							var message = messageInfo.messageJsonString();
							try {
								io.sockets.socket(connKey).emit('msg', message);
							}catch(e) {
								// TODO log to db ?
								log.error(e);
							}
						});
					}
					catch (e) {
						log.error(e);
					}
				}
				catch (e) {
					log.error(e);
				}
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
					_clientsMgr.disconnectClientAndLog(clientInfo);
				}
				catch (e) {
					console.log(e);
				}
			});
			conn.on("error", function (error) {
				console.log(error);
			});
		});
		_this.wsServer = server;
		server.on("close", function () {
			console.log('ws server close');
		});
		process.on("exit", function (code) {
			console.log('ws server exit');
		});
		//init proxy ws
		if (config.ConnectExternalProxyWsServer) {
			try {
				var conn = ws.connect("ws://" + config.ExternalProxyWsServerIp + ":" + config.websocketPort, function () {
					console.log('connect to server websocket connKey:' + this.id);
				});
				conn.on("text", function (dataStr) {
					var data = JSON.parse(dataStr);
					if (data.proxyMsg) {
						_messageHub.sendMessageByIps(data.ips, data.messageType, data.message);
					}
				});
			}
			catch (e) {
				console.log(e);
			}
		}
		return server;
	};
	/**
	 * 添加注册信息
	 * @param data
	 */
	WebsocketNWHost.prototype.addDeviceToPhoneList = function (phoneInfo) {
		var hasi = -1;
		for (var i = 0; i < this.listPhone.length; i++) {
			if (this.listPhone[i].deviceNumber == phoneInfo.deviceNumber) {
				hasi = i;
				break;
			}
		}
		if (hasi > -1) {
			this.listPhone.splice(hasi, 1, phoneInfo);
		}
		else {
			this.listPhone.push(phoneInfo);
		}
	};
	return WebsocketNWHost;
}());
exports.WebsocketNWHost = WebsocketNWHost;
