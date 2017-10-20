/**
 * Created by deexiao on 2017/10/17.
 */
module.exports = function (router) {
	router.get('/',async function (ctx, next) {
		ctx.body = 'chat test!';
	});
}
