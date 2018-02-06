/**
 * Created by deexiao on 2017/10/24.
 */
import io from 'socket.io-client';
import MessageInfo from './MessageInfo';
const getTestPort = function () {
	return 3366;
	/*let ran = Math.random() * 10;
	 if (ran < 4) {
	 return '3366';
	 }
	 else if (ran < 7) {
	 return '3367';
	 } else {
	 return '3368';
	 }*/
}

const getTestIpPort = function () {
 return 'http://localhost:3366';
 /*
	let ran = Math.random() * 10;
	 if (ran < 4) {
	 return 'http://172.16.8.199:3366';
	 }
	 else if (ran < 7) {
	 return 'http://172.16.8.197:3366';
	 } else {
	 return 'http://172.16.8.197:3367';
	 }
	 */
}

module.exports = {
	socket: null,
	clientInfo: null,
	connectServer: function (clientInfo, receive) {
		this.connectServerCore(clientInfo, receive);
		this.registerClient(clientInfo);
	},
	/**
	 * 连接服务端，并订阅相关事件
	 * @param clientInfo 客户端业务信息
	 * @param receive 客户端接受消息回调
	 */
	connectServerCore: function (clientInfo, receive) {
		this.socket = io.connect(getTestIpPort());
		let selfSocket = this.socket;
		this.socket.on('disconnect', function () {
			console.log('disconnect from server.')
		});

		this.socket.on('reconnect', function () {
			console.log('reconnect.');
			//重新注册用户信息
			let sendMsg = new MessageInfo('', '', '', 1, clientInfo);
			selfSocket.emit('msg', JSON.stringify(sendMsg));
		});

		this.socket.on('msg', function (data) {

			console.log(data);
			receive(JSON.parse(data));
		});
	},
	/**
	 * 注册客户端
	 * @param clientInfo
	 */
	registerClient: function (clientInfo) {
		this.clientInfo = clientInfo;
		let sendMsg = new MessageInfo('', '', '', 0, clientInfo);
		this.socket.emit('msg', JSON.stringify(sendMsg));
	},
	/**
	 * 发送消息
	 * @param targetProName 目标属性名
	 * @param targetProValues 目标属性值
	 * @param isRegisterInfoPro 是否注册RegisterInfo属性
	 * @param message  消息体
	 */
	sendMsg: function (targetProName, targetProValues, isRegisterInfoPro, message) {
		message.from = this.clientInfo.userId;
		let sendMsg = new MessageInfo(targetProName, targetProValues, isRegisterInfoPro, 4, message);
		this.socket.emit('msg', JSON.stringify(sendMsg));
	}
}
