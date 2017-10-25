/**
 * Created by deexiao on 2017/10/20.
 */
const Util = require('../utils/Util');
const Client_Service = require("../service/ClientService");
const MessageCore = require('../service/MessageProcessCore');

module.exports = function (router) {
	/**
	 * 获取所有席位状态数据
	 */
	router.get('/clients', async function (ctx, next) {
		ctx.body = Util.succeed(await Client_Service.list());
	});


	/**
	 * 根据条件获取席位状态数据
	 */
	router.get('/clients/:proName/:proValue/:isRegisterPro',async function (ctx, next) {
		ctx.body = Util.succeed(await MessageCore.getClientByCondition(ctx.params.proName, ctx.params.proValues, ctx.params.isRegisterPro));
	});


	/**
	 * 返回所有连接信息的注册信息registerInfo
	 */
	router.get('/clients/registerInfos',async function (ctx, next) {
		ctx.body = Util.succeed(await MessageCore.getAllRegisterInfos());
	});

	/**
	 * 根据条件获取席位状态数据
	 */
	router.get('/registerInfos/:proName/:proValues/:isRegisterPro',async function (ctx, next) {
		let clients = await MessageCore.getClientByCondition(ctx.params.proName.split(";"), ctx.params.proValues.split(";"), ctx.params.isRegisterPro);
		let registerInfos = clients.map(function (item) {
			return item.registerInfo;
		});
		ctx.body =  Util.succeed(registerInfos);
	});
}
