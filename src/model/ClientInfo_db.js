/**
 * Created by deexiao on 2017/10/16.
 */
'use strict'
const Sequelize = require('sequelize');
const sequelize = require('../db').sequelize;
exports.online_client_db = sequelize.define(
	'online_client',
	{
		userId: {
			field: 'userId',
			type: Sequelize.STRING,
			allowNull: true,
			primaryKey: true
		},
		connKey: {
			field: 'connKey',
			type: Sequelize.STRING,
			allowNull: true
		},
		name: {
			field: 'name',
			type: Sequelize.STRING,
			allowNull: true
		},
		tag1: {
			field: 'tag1',
			type: Sequelize.STRING,
			allowNull: true
		},
		clientIp: {
			field: 'clientIp',
			type: Sequelize.STRING,
			allowNull: true
		},
		clientInsideIp: {
			field: 'clientInsideIp',
			type: Sequelize.STRING,
			allowNull: true
		},
		clientPort: {
			field: 'clientPort',
			type: Sequelize.STRING,
			allowNull: true
		},
		wsIp: {
			field: 'wsIp',
			type: Sequelize.STRING,
			allowNull: true
		},
		wsPort: {
			field: 'wsPort',
			type: Sequelize.STRING,
			allowNull: true
		},
		wsPid: {
			field: 'wsPid',
			type: Sequelize.STRING,
			allowNull: true
		},
		wsPIndex: {
			field: 'wsPIndex',
			type: Sequelize.STRING,
			allowNull: true
		},
		liveId: {
			field: 'liveId',
			type: Sequelize.STRING,
			allowNull: true
		},
		isMobile: {
			field: 'isMobile',
			type: Sequelize.STRING,
			allowNull: true
		},
		isTestClient: {
			field: 'isTestClient',
			type: Sequelize.STRING,
			allowNull: true
		},
		/*create_time: {
			field: 'create_time',
			type: Sequelize.BIGINT,
			allowNull: true
		},
		update_time: {
			field: 'update_time',
			type: Sequelize.BIGINT,
			allowNull: true
		},*/
		heartTime: {
			field: 'heartTime',
			type: Sequelize.BIGINT,
			allowNull: false
		},
		registerInfo: {
			field: 'registerInfo',
			type: Sequelize.JSON,
			allowNull: true
		}
	},
	{
		tableName: 'online_client',
		freezeTableName: true,
		timestamps: true,
	}
);
