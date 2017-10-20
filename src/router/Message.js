/**
 * Created by deexiao on 2017/10/20.
 */

const Util = require('../utils/Util');

const MessageCore = require('../service/MessageProcessCore');
module.exports = function (router) {
	/**
	 * 消息发送
	 * post body为MessageInfo
	 */
	router.post('/sendMessage',async function (ctx, next) {
		ctx.body = Util.succeed(await MessageCore.sendMsg(ctx.request.body));
	});
}
