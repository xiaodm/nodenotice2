/**
 * Created by deexiao on 2017/10/13.
 */
"use strict";
let ClientInfo = (function () {
	function ClientInfo(userId,name, ip, port, registerInfo, isTestClient, connKey, externalIp,isMobile,tag1) {
		this.userId = userId;
		this.name = name;
		this.ip = ip;
		this.port = port;
		this.registerInfo = registerInfo;
		this.connKey = connKey;
		this.externalIp = externalIp;
		this.isMobile = isMobile;
		this.tag1 = tag1;
		if (isTestClient) {
			this.isTestClient = isTestClient;
		}
		else {
			this.isTestClient = false;
		}
	}
	return ClientInfo;
}());
exports.ClientInfo = ClientInfo;
