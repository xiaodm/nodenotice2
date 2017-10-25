/**
 * Created by deexiao on 2017/10/24.
 */
"use strict";
/**
 * 消息发送体
 */
var MessageInfo = (function () {
    function MessageInfo(targetProName, targetProValues, isRegisterInfoPro, messageType, message) {
        this.targetProName = targetProName;
        this.targetProValues = targetProValues;
        this.isRegisterInfoPro = isRegisterInfoPro;
        this.messageType = messageType;
        this.message = message;
    }
    MessageInfo.prototype.messageJsonString = function () {
        return JSON.stringify(this);
    };
    return MessageInfo;
}());
export default MessageInfo;