/**
 * Created by deexiao on 2017/10/13.
 */
"use strict";
var MessageBody = (function () {
	function MessageBody(messageType, message) {
		this.messageType = messageType;
		this.message = message;
	}
	MessageBody.prototype.messageJsonString = function () {
		return JSON.stringify(this);
	};
	return MessageBody;
}());
exports.MessageBody = MessageBody;
