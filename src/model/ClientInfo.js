/**
 * Created by deexiao on 2017/10/13.
 */
"use strict";
let ClientInfo = (function () {
	function ClientInfo(name, ip, port, registerInfo, isTestClient, connKey, externalIp,isMobile) {
		this.name = name;
		this.ip = ip;
		this.port = port;
		this.registerInfo = registerInfo;
		this.connKey = connKey;
		this.externalIp = externalIp;
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
