/**
 * Created by deexiao on 2018/02/01.
 * websocket客户端帮助类
 */
import io from 'socket.io-client';
import MessageInfo from './MessageInfo';
module.exports = {
	socket: null,   // websocket对象
	clientInfo: null, // 客户端信息
	requestId: 1,   // ws请求标识
	inters: null,  // 心跳执行对象
	forceClose: false, //是否强制关闭
	config: {
		wsUrl: '', // websocket地址
		bid: '',  // 业务id
		bName: '', // 业务名称
		xua: 'app', // 设备类型
		reconnectInterval: 1000, // 重连时间间隔
		heartInterval: 20000 // 心跳执行间隔
	},
	/**
	 * 连接ws服务、注册客户端信息
	 * @param option ws相关配置
	 * @param clientInfo 客户端信息
	 * @param receive 客户端接受消息回调
	 */
	connectServer: function (option, clientInfo, receiveData) {
		Object.assign(this.config, option);
		this.clientInfo = clientInfo;
		if (receiveData) {
			this.onmessage = receiveData;
		}
		this.connectServerCore();
	},
	/**
	 * 连接服务端，并订阅相关事件
	 * @param clientInfo 客户端业务信息
	 * @param receive 客户端接受消息回调
	 */
	connectServerCore: function () {
		let _self = this;
		if (window && ('WebSocket' in window)) {
			_self.socket = io.connect(_self.config.wsUrl, {
				"transports": ['websocket', 'polling']
			});
			//_self.socket = new WebSocket(_self.config.wsUrl);
		}
		else {
			console.log('浏览器不支持webSocket');
		}
		if (_self.socket) {
			_self.socket.on('connect', function () {
				console.log("websocket连接成功");
				_self.onopen();
				_self.registerClient(_self.clientInfo);
				_self.heartBeat(_self.clientInfo);
			});
			_self.socket.on('reconnect', function () {
				console.log("websocket连接成功");
				_self.reconnect(e);
				_self.registerClient(_self.clientInfo);
				_self.heartBeat(_self.clientInfo);
			});
			_self.socket.on('disconnect', function (e) {
				console.log("websocket连接关闭", e);
				_self.onclose(e);
				if (!_self.forceClose) {
					setTimeout(function () {
						console.log("reconnect", e);
						_self.connectServerCore();
					}, _self.reconnectInterval);
				}
			});
			_self.socket.on('msg', function (data) {
				console.log("websocket接收消息", data);
				_self.onmessage(JSON.parse(data));
			});
			_self.socket.on('error' ,function (e) {
				console.log("websocket连接错误", e);
			});
			//监听窗口关闭事件，当窗口关闭时，主动去关闭连接，防止连接还没断开就关闭窗口，server端会抛异常。
			window.onbeforeunload = function () {
				_self.forceClose = true;
				_self.socket.close();
			}
		}
	}
	,
	/**
	 * 注册客户端
	 * @param clientInfo
	 */
	registerClient: function (clientInfo) {
		this.clientInfo = clientInfo;
		let sendMsg = new MessageInfo('', '', '', 0, clientInfo);
		this.socket.emit('msg', JSON.stringify(sendMsg));
		console.log('registerClient end');
	},
	/**
	 * 发送消息
	 * @param msgInfo 消息对象
	 */
	sendMsg: function (msgInfo) {
		message.from = this.clientInfo.userId;
		let sendMsg = new MessageInfo(msgInfo.targetProName, msgInfo.targetProValues, msgInfo.isRegisterInfoPro, 4, msgInfo.message);
		this.socket.emit('msg', JSON.stringify(sendMsg));
		console.log('sendMsg end');
	},
	/**
	 * 心跳
	 * @param clientInfo 客户端信息
	 */
	heartBeat: function (clientInfo) {
		let selfSocket = this.socket;
		let _config = this.config;
		if (this.inters) {
			clearInterval(this.inters);
			this.inters = null;
		}
		this.inters = setInterval(function () {
			let message = new MessageInfo('', '', '', 7, {userId:clientInfo.userId});
			selfSocket && selfSocket.emit('msg', JSON.stringify(message));
			console.log('sended heartBeat');
		}, _config.heartInterval);

	},
	/**
	 * onopen 事件
	 */
	onopen: function () {
	},
	/**
	 * reconnect 事件
	 */
	reconnect: function () {
	},
	/**
	 * onmessage 事件
	 */
	onmessage: function (data) {
	},
	/**
	 * onclose 事件
	 */
	onclose: function () {
	},
	/**
	 * onerror 事件
	 */
	onerror: function () {
	}
}
