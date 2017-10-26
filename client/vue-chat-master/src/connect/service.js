/**
 * Created by deexiao on 2017/10/25.
 * 人员信息操作服务
 */
import axios from 'axios';

const axiosGet = function (url, callback) {
	axios.get(url)
		.then(function (response) {
			console.log(response);
			if(callback)callback(response.data);
		})
		.catch(function (err) {
			console.log(err);
			if(callback)callback(null, err);
		});
};

const axiosPost = function (url, data, callback) {
	axios.post(url, data)
		.then(function (response) {
			console.log(response);
			if(callback)callback(response.data);
		})
		.catch(function (err) {
			console.log(err);
			if(callback)callback(null, err);
		});
};
module.exports =
	function (url) {
		axios.defaults.baseURL = url;
		return {
			/**
			 * 获取所有在线人员列表 (测试使用，实际只会取好友)
			 */
			getAllOnlines: function (callback) {
				axiosGet('/client/onlines', callback);
			},
			/**
			 * 获取所在直播间在线人员
			 * @param liveId
			 */
			getLiveOnlines: function (liveId, callback) {
				axiosGet('/client/live/onlines/' + liveId, callback);
			},
			/**
			 * 进入直播间
			 * @param userId
			 * @param liveId
			 */
			joinLive: function (userId, liveId, callback) {
				axiosPost('/client/live/user/join', {userId: userId, liveId: liveId}, callback);
			},
			/**
			 * 退出直播间
			 * @param userId
			 * @param liveId
			 */
			leaveLive: function (userId, liveId, callback) {
				axiosPost('/client/live/user/leave', {userId: userId, liveId: liveId}, callback);
			}
		};
	};

