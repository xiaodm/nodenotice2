/**
 * Created by deexiao on 2017/10/16.
 */

"use strict";
const _ = require('lodash');
const MessageInfo_1 = require("../model/MessageInfo");
const MessageType_1 = require("../model/MessageType");
const MessageBody_1 = require("../model/MessageBody");
const log = require('../config/logger');
const Client_Service = require("./ClientService");

module.exports = {
	socketServer: null,
	async initReceive(data, connInfo){
		try {
			await this.processSubscriptMessage(data, connInfo);
		}
		catch (e) {
			log.error(e);
		}
	},

	/**
	 * 订阅消息处理器
	 * @param message
	 * @param connInfo
	 */
	async processSubscriptMessage(message, connInfo) {
		if (!message || message.length < 1) {
			return;
		}
		var messageInfo = JSON.parse(message);
		messageInfo.message.connKey = connInfo.connKey;
		switch (messageInfo.messageType) {
			case MessageType_1.MessageType.OnlineRegister:
				await registerClientInfo(messageInfo, connInfo, this.socketServer);
				break;
			case MessageType_1.MessageType.Reconnected:
				await registerClientInfo(messageInfo, connInfo, this.socketServer);
				break;
			case MessageType_1.MessageType.UpdateClientInfo:
				await updateClientInfo(messageInfo, connInfo);
				break;
			case MessageType_1.MessageType.DisConnect:
				await this.disconnectClientInfo(messageInfo.connKey);
				break;
			case MessageType_1.MessageType.CustomMessage:
				await this.sendMsg(messageInfo);
				log.info("receve CustomMessage:" + messageInfo.message);
				break;
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
	async getClientByCondition(proName, proValue, isRegisterInfoPro) {
		return await Client_Service.getByJsonProp(proName, proValue, isRegisterInfoPro);
	},

	/**
	 * 发送业务消息到其他客户端
	 * @param data
	 * @returns {Promise.<void>}
	 */
	async sendMsg(data) {
		await sendMsgCore(data, this.socketServer)
	},

	/**
	 * 客户端下线
	 * @param connKey
	 */
	async disconnectClientInfo(connKey) {
		let user = await  Client_Service.getByConnKey(connKey);
		await Client_Service.remove(connKey);
		if (user && user.length > 0) {
			//通知好友、所在组|直播间的成员
			//测试阶段，先直接通知所有在线人员
			let sendData = new MessageInfo_1.MessageInfo(1, 1, false, MessageType_1.MessageType.DisConnect, {
				userId: user[0].userId
			});
			await sendMsgCore(sendData, this.socketServer);
		}
	},
	/**
	 * 移除当前server-port host的客户端
	 * @param serverWsIp
	 * @param serverWsPort
	 * @param processId
	 * @returns {Promise.<void>}
	 */
	async removeHostClients(serverWsIp, serverWsPort,processId){
		log.info(`remove By ServerPort ${serverWsIp}:${serverWsPort} - ${processId}`);
		await  Client_Service.removeByServerPort(serverWsIp,serverWsPort,processId);
	}
};


const sendMsgCore = async function (data, io) {
	try {
		let connClients = await Client_Service.getByJsonProp(data.targetProName, data.targetProValues, data.isRegisterInfoPro);
		let connKeys = connClients.map(t => t.connKey);
		log.info('target connkeys:' + connKeys);
		/*if (!io.sockets) {
		 console.log(" method sendMessage: io.sockets is false.");
		 return;
		 }*/
		//发送消息
		let messageInfo = new MessageBody_1.MessageBody(data.messageType, data.message);
		let message = messageInfo.messageJsonString();
		connKeys.forEach(function (connKey) {
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
};

/**
 * 添加客户端
 * @param clientInfo
 * @param connInfo
 * @returns {Promise.<void>}
 */
const addClientToList = async function (clientInfo, connInfo) {
	let clientInfo_db = _.assignIn(clientInfo, connInfo);
	clientInfo_db.registerInfo.connectionId = clientInfo.connKey;
	await Client_Service.upsert(clientInfo_db);
};

/**
 * 修改客户端信息
 * @param clientInfo 客户端信息实体
 */
const updateClientInfo = async function (messageInfo, rinfo) {
	var clientInfo = messageInfo.message;
	await addClientToList(clientInfo, rinfo);
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
const registerClientInfo = async function (messageInfo, connInfo, io) {
	//  clientInfo.resetIPPort(rinfo.address, rinfo.port)
	var clientInfo = messageInfo.message;
	await addClientToList(clientInfo, connInfo);

	//通知好友、所在组|直播间的成员
	//测试阶段，先直接通知所有在线人员
	let sendData = new MessageInfo_1.MessageInfo(1, 1, false, MessageType_1.MessageType.OnlineRegister, {
		userId: clientInfo.userId
	});
	await sendMsgCore(sendData, io);

};


/**
 * 客户端下线
 * @param userId
 */
const disconnectClientInfoByUserId = async function (userId) {
	await Client_Service.removeByUserId(userId);
};


