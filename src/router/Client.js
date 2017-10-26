/**
 * Created by deexiao on 2017/10/20.
 */
const Util = require('../utils/Util');

const Client_Service = require("../service/ClientService");


module.exports = function (router) {
	/**
	 * 获取所有席位状态数据
	 */
	router.get('/client/onlines', async function (ctx, next) {
		ctx.body = Util.succeed(await Client_Service.list());
	});


	/**
	 * 根据条件获取席位状态数据
	 */
	router.get('/client/onlines/:proName/:proValue/:isRegisterPro', async function (ctx, next) {
		ctx.body = Util.succeed(await Client_Service.getByJsonProp(ctx.params.proName, ctx.params.proValues, ctx.params.isRegisterPro));
	});


	/**
	 * 根据条件获取席位状态数据
	 */
	router.get('/client/onlines/registerInfos/:proName/:proValues/:isRegisterPro', async function (ctx, next) {
		let clients = await Client_Service.getByJsonProp(ctx.params.proName.split(";"), ctx.params.proValues.split(";"), ctx.params.isRegisterPro);
		let registerInfos = clients.map(function (item) {
			return item.registerInfo;
		});
		ctx.body = Util.succeed(registerInfos);
	});

	/**
	 * 获取当前直播间所有席位状态数据
	 */
	router.get('/client/live/onlines/:liveId', async function (ctx, next) {
		if (!ctx.params.liveId) {
			ctx.body = Util.error('1001');
		}
		ctx.body = Util.succeed(await Client_Service.getByLiveId(ctx.params.liveId));
	});

	/**
	 * 加入直播间
	 */
	router.post('/client/live/user/join', async function (ctx, next) {
		let {userId,liveId} = ctx.request.body;
		if (!userId || !liveId) {
			ctx.body = Util.error('1001');
		}
		ctx.body = Util.succeed(await Client_Service.joinLive(userId,liveId));
	});

	/**
	 * 离开直播间
	 */
	router.post('/client/live/user/leave', async function (ctx, next) {
		let {userId,liveId} = ctx.request.body;
		if (!userId || !liveId) {
			ctx.body = Util.error('1001');
		}
		ctx.body = Util.succeed(await Client_Service.leaveLive(userId,liveId));
	});
}
