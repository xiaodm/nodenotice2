/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';

import wsConn from './connect/connect';
import statusService from './connect/service';

const clientService = statusService('http://localhost:3355');

Vue.use(Vuex);

const now = new Date();
const store = new Vuex.Store({
	state: {
		// 当前用户
		user: {
			userId: '',
			name: '',
			img: 'dist/images/1.jpg'
		},
		clientInfo: null,
		liveId: '直播间_1',
		// 会话列表
		sessions: [
			/*{
			 id: 1,
			 user: {
			 name: '示例介绍',
			 img: 'dist/images/2.png'
			 },
			 messages: [
			 {
			 content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
			 date: now
			 }, {
			 content: '项目地址: https://github.com/coffcer/vue-chat',
			 date: now
			 }
			 ]
			 },*/
			/*{
			 id: 'qwe',
			 user: {
			 name: 'qwe',
			 img: 'dist/images/2.jpg'
			 },
			 messages: []
			 },
			 {
			 id: 'asd',
			 user: {
			 name: 'asd',
			 img: 'dist/images/3.jpg'
			 },
			 messages: []
			 }*/
		],
		// 当前选中的会话
		currentSessionId: 'qwe',
		// 过滤出只包含这个key的会话
		filterKey: ''
	},
	mutations: {
		INIT_DATA (state) {
			clientService.getAllOnlines(function (res, error) {
				if (!error && res && res.success) {
					let data_session = localStorage.getItem('vue-chat-session');
					if (data_session) {
						data_session = JSON.parse(data_session);
					}
					res.data.push({
						userId: state.liveId,
						img: 'dist/images/live1.jpg',
						isLive: true
					});
					state.sessions = res.data.map((item) => {
						let datasn = data_session ? data_session.filter(i => i.id === item.userId) : [];
						return {
							id: item.userId,
							user: {
								userId: item.userId,
								name: item.userId,
								img: item.img || 'dist/images/3.jpg'
							},
							isLive: item.isLive,
							messages: datasn.length > 0 ? datasn[0].messages : []
						}
					});
				}

			});
		},
		// 发送消息
		SEND_MESSAGE ({sessions, currentSessionId}, content) {
			if (!currentSessionId)return;
			let session = sessions.find(item => item.id === currentSessionId);
			if (!session)return;
			if (!session.isLive) {
				wsConn.sendMsg('userId', session.id, false, {content: content, type: '0', targetId: session.id});
			}
			else {
				wsConn.sendMsg('liveId', session.id, false, {content: content, type: '0', targetId: session.id});
			}
			session.messages.push({
				content: content,
				date: new Date(),
				self: true,
				from: '我'
			});
		},
		// 选择会话
		SELECT_SESSION (state, id) {
			if (id === state.currentSessionId) {
				return;
			}
			if (id === state.liveId) {
				clientService.joinLive(state.user.userId, state.liveId, null);
				state.clientInfo.liveId = state.liveId;
			} else if (state.currentSessionId === state.liveId) {
				clientService.leaveLive(state.user.userId, state.liveId, null);
				state.clientInfo.liveId = '';
			}
			state.currentSessionId = id;
		},
		// 搜索
		SET_FILTER_KEY (state, value) {
			state.filterKey = value;
		},
		//注册客户端
		REGISTER_CLIENT(state){
			state.clientInfo = {
				userId: state.user.userId,
				name: state.user.name,
				isMobile: '0',
				isTestClient: '0',
				registerInfo: {pro1: '55', pro2: '66'}
			};
			// 建立连接并注册
			wsConn.connectServer(state.clientInfo, receiveData);
		}
	}
});

//接受消息
const receiveData = function (data) {
	if (data.messageType === 4) {
		//内容消息
		let sessionId;
		if (data.message.targetId === '直播间_1') {
			sessionId = data.message.targetId;
		} else {
			sessionId = data.message.from;
		}
		let session = store.state.sessions.find(item => item.id === sessionId);
		if (!(data.message.from === store.state.user.userId)) {
			session.messages.push({
				content: data.message.content,
				date: new Date(),
				self: false,
				from: data.message.from
			});
		}
	} else {
		let data_session = localStorage.getItem('vue-chat-session');

		let uSession = data_session ? JSON.parse(data_session).find(i => i.id === data.message.userId) : null;
		let session = store.state.sessions.find(item => item.id === data.message.userId);
		if (data.messageType === 0) {
			//上线
			if (!session) {
				if (!uSession) {
					uSession = {
						id: data.message.userId,
						user: {
							name: data.message.userId,
							img: 'dist/images/3.jpg'
						},
						isLive: false,
						messages: []
					};
				}
				store.state.sessions.push(uSession);
			} else {
				session.user.img = 'dist/images/3.jpg';
			}
		}
		if (data.messageType === 2) {
			//下线
			if (session) session.user.img = 'dist/images/offline.jpg';
		}
	}
}

store.watch(
	(state) => state.sessions,
	(state) => state.user,
	(val) => {
		console.log('CHANGE: ', val);
		localStorage.setItem('vue-chat-session', JSON.stringify(val));
	},
	{
		deep: true
	}
);

export default store;
export const actions = {
	initData: ({dispatch}) => dispatch('INIT_DATA'),
	sendMessage: ({dispatch}, content) => dispatch('SEND_MESSAGE', content),
	selectSession: ({dispatch}, id) => dispatch('SELECT_SESSION', id),
	search: ({dispatch}, value) => dispatch('SET_FILTER_KEY', value),
	REGISTER_CLIENT: ({dispatch}) => dispatch('REGISTER_CLIENT'),
};
