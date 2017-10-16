/**
 * Created by deexiao on 2017/9/18.
 *  数据访问对象
 */
"use strict";
const
	config = require('../config'),
	redis = require('redis'),
	redisWrapper = require('co-redis'),
	mysql = require('mysql'),
	Sequelize = require('sequelize'),
	co = require('co'),
	log = require('../config/logger');

const
	redisClient = redis.createClient(config.redisOptions.port, config.redisOptions.host);

redisClient.on("error", function (err) {
	log.error(err);
});

//redis权限设置
if (config.redisOptions.auth.length) {
	redisClient.auth(config.redisOptions.auth);
}

const
	redisCo = redisWrapper(redisClient);

co(function*() {
	let redis_db = config.redisOptions.redis_db || 2;
	yield redisCo.select(redis_db);
});


const live_sequelize = new Sequelize(
	config.db.database,
	config.db.user,
	config.db.password, {
		timezone: "+08:00",
		host: config.db.host,
		dialect: 'mysql',
		define: {
			timestamps: false,
			underscored: true
		},
		logging: false
	});

let service = {
	redis: redisCo,
	sequelize: live_sequelize,
	mysql: {
		query: (sql, replacements) => {
			return co(function*() {
				var result = yield live_sequelize.query(sql, {
					raw: true,
					replacements: Array.isArray(replacements) ? replacements : [replacements]
				});
				return result[0];
			})
		}
	}
};

module.exports = service;
