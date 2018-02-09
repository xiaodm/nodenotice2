/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : nodenotice

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-02-09 16:42:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `online_client`
-- ----------------------------
DROP TABLE IF EXISTS `online_client`;
CREATE TABLE `online_client` (
  `userId` varchar(256) NOT NULL,
  `connKey` varchar(256) DEFAULT NULL,
  `tag1` varchar(256) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  `clientIp` varchar(15) DEFAULT NULL,
  `clientInsideIp` varchar(15) DEFAULT NULL,
  `clientPort` varchar(6) DEFAULT NULL,
  `wsIp` varchar(15) DEFAULT NULL,
  `wsPort` varchar(6) DEFAULT NULL,
  `wsPid` varchar(15) DEFAULT NULL,
  `wsPIndex` varchar(15) DEFAULT NULL,
  `liveId` varchar(256) DEFAULT NULL,
  `isMobile` varchar(1) DEFAULT NULL,
  `isTestClient` varchar(1) DEFAULT NULL,
  `registerInfo` json DEFAULT NULL,
  `heartTime` bigint(15) DEFAULT NULL COMMENT '心跳时间',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
