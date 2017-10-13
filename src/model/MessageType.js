/**
 * Created by deexiao on 2017/10/13.
 */
"use strict";
(function (MessageType) {
	/**
	 * 上线注册
	 */
	MessageType[MessageType["OnlineRegister"] = 0] = "OnlineRegister";
	/**
	 * 回复注册
	 */
	MessageType[MessageType["ReplyRegister"] = 1] = "ReplyRegister";
	/**
	 * 下线
	 */
	MessageType[MessageType["DisConnect"] = 2] = "DisConnect";
	/**
	 * 修改属性
	 */
	MessageType[MessageType["UpdateClientInfo"] = 3] = "UpdateClientInfo";
	/**
	 * 自定义消息发送
	 */
	MessageType[MessageType["CustomMessage"] = 4] = "CustomMessage";
	/**
	 * 请求响应状态数据
	 */
	MessageType[MessageType["RequestStatusReply"] = 5] = "RequestStatusReply";
	/**
	 * 注册udp连接信息
	 */
	MessageType[MessageType["RegisterUDPConn"] = 6] = "RegisterUDPConn";
})(exports.MessageType || (exports.MessageType = {}));
var MessageType = exports.MessageType;
