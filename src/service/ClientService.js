/**
 * Created by deexiao on 2017/10/16.
 */
"use strict";
const client_db = require('../model/ClientInfo_db').online_client_db;
const mysqlSelf = require('../db').mysql;

module.exports = {
	async list(){
		return await client_db.findAll({
			raw: true,
			order: [['created_at', 'desc']]
		});
	},
	async getByUserId(userId) {
		let ret = client_db.findByPrimary(userId);
		return ret;
	},
	async getByConnKey(connKey) {
		return await client_db.all({
			raw: true,
			where: {
				connKey: connKey
			}
		});
	},
	async getByTag1(tag1) {
		return await client_db.all({
			raw: true,
			order: "created_at desc",
			where: {
				tag1: tag1
			}
		});
	},
	async getByJsonProp(proName, proValue,isRegisterProp) {
		let sqlStr = '';
		if(isRegisterProp){
		  sqlStr = `SELECT * FROM online_client where JSON_EXTRACT(registerInfo,'$.${proName}') = ${proValue}`;
		} else {
			sqlStr = `SELECT * FROM online_client where ${proName} = '${proValue}'`;
		}
		return await mysqlSelf.query(sqlStr);
	},
	async upsert(client_info){
		return await client_db.upsert(client_info);
	},
	async remove(connKey){
		return await  client_db.destroy({
			where: {
				connKey: connKey
			}
		})
	},
	async removeByUserId(userId){
		return await  client_db.destroy({
			where: {
				userId: userId
			}
		})
	},

};
