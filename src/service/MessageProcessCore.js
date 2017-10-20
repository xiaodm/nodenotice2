/**
 * Created by deexiao on 2017/10/16.
 */

"use strict";
const ClientInfo_1 = require("../model/ClientInfo");
const MessageType_1 = require("../model/MessageType");
const MessageBody_1 = require("../model/MessageBody");
const log = require('../config/logger');
const Client_Service = require("./ClientService");

module.exports = {
	socketServer: null,
	async initReceive(data,connKey){
		try {
			await this.processSubscriptMessage(data, {connKey:connKey});
		}
		catch (e) {
			console.log(e);
		}
	},

	/**
	 * 订阅消息处理器
	 * @param message
	 * @param rinfo
	 */
	async processSubscriptMessage(message, rinfo) {
		if (!message || message.length < 1) {
			return;
		}
		var messageInfo = JSON.parse(message);
		messageInfo.message.connKey = rinfo.connKey;
		if (messageInfo.messageType == MessageType_1.MessageType.OnlineRegister
			|| messageInfo.messageType == MessageType_1.MessageType.ReplyRegister) {
			await registerClientInfo(messageInfo, rinfo);
		}
		/*if (messageInfo.messageType == MessageType_1.MessageType.RequestStatusReply) {
		 await replyCurrentInfo(messageInfo, rinfo);
		 }*/
		if (messageInfo.messageType == MessageType_1.MessageType.UpdateClientInfo) {
			await updateClientInfo(messageInfo, rinfo);
		}
		if (messageInfo.messageType == MessageType_1.MessageType.DisConnect) {
			await this.disconnectClientInfo(messageInfo.connKey);
		}
		if (messageInfo.messageType == MessageType_1.MessageType.CustomMessage) {
			// TODO send msg to targets
			await this.sendMsg(messageInfo);
			console.log("receve CustomMessage:" + messageInfo.message);
		}
	},

	/**
	 * 返回所有连接信息
	 * @returns {Array<ClientInfo>}
	 */
	async getAllClient() {
		return await Client_Service.list();
	},

	/**
	 * 返回所有连接信息的注册信息registerInfo
	 * @returns {Array<any>}
	 */
	async getAllRegisterInfos() {
		return (await Client_Service.list()).map(function (item, index) {
			return item.registerInfo;
		});
	},
	/**
	 *  根据属性名和属性值获取目标
	 * @param proName  目标属性名字
	 * @param proValues 目标属性值集合
	 * @param isRegisterInfoPro 是否为自定义的RegisterInfo内属性
	 */
	async getClientByCondition(proNames, proArrayValues, isRegisterInfoPro) {
		// TODO  通过db能力去检索，目前是全查询出来再检索，数据量大可能有效率问题
		let list = await Client_Service.list();

		return list.filter(function (item) {
			var match = false;
			for (var i = 0; i < proNames.length; i++) {
				var proValues = proArrayValues[i].split(",");
				if (isRegisterInfoPro) {
					match = proValues.lastIndexOf(item.registerInfo[proNames[i]]) > -1;
				}
				else {
					match = proValues.lastIndexOf(item[proNames[i]]) > -1;
				}
				if (!match) {
					break;
				}
			}
			return match;
		});
	},

	/**
	 * 发送业务消息到其他客户端
	 * @param data
	 * @returns {Promise.<void>}
	 */
	async sendMsg(data) {
		let io = this.socketServer;

		try {
			var connkeys = await this.getClientByCondition(data.targetProName, data.targetProValues, data.isRegisterInfoPro).map(t => t.connKey);
			/*if (!io.sockets) {
			 console.log(" method sendMessage: io.sockets is false.");
			 return;
			 }*/
			//发送消息
			var messageInfo = new MessageBody_1.MessageBody(data.messageType, data.message);
			var message = messageInfo.messageJsonString();
			connkeys.forEach(function (connKey) {
				try {
					io.to(connKey).emit('msg', message);
				} catch (e) {
					// TODO log to db ?
					log.error(e);
				}
			});
		}
		catch (e) {
			log.error(e);
		}
	},

	/**
	 * 客户端下线
	 * @param connKey
	 */
	async disconnectClientInfo(connKey) {
		await Client_Service.remove(connKey);
	}
};


/**
 * 添加客户端
 * @param clientInfo
 * @param rinfo
 * @returns {Promise.<void>}
 */
const addClientToList = async function (clientInfo, rinfo) {
	if (!clientInfo.isTestClient) {
		if (!clientInfo.ip) {
			clientInfo.ip = rinfo.address;
		}
		clientInfo.port = rinfo.port;
	}
	clientInfo.registerInfo.connectionId = clientInfo.connKey;
	await Client_Service.upsert(clientInfo);
};

/**
 * 修改客户端信息
 * @param clientInfo 客户端信息实体
 */
const updateClientInfo = async function (messageInfo, rinfo) {
	var clientInfo = messageInfo.message;
	await this.addClientToList(clientInfo, rinfo);
	/*	var args = [];
	 args.push(clientInfo);
	 //回调当前客户端方法
	 this.socketio.connections.forEach(function (conn) {
	 conn.send(JSON.stringify({
	 "CallbackId": "123",
	 "Hub": "SeatStatusHub",
	 "Method": "SeatStatusChangeNotice",
	 "Args": args
	 }));
	 });*/
};
/**
 * 注册客户端
 * @param clientInfo 客户端信息实体
 */
const registerClientInfo = async function (messageInfo, rinfo) {
	//  clientInfo.resetIPPort(rinfo.address, rinfo.port)
	var clientInfo = messageInfo.message;
	this.addClientToList(clientInfo, rinfo);
};



/**
 * 客户端下线
 * @param userId
 */
const disconnectClientInfoByUserId = async function (userId) {
	await Client_Service.removeByUserId(userId);
};


