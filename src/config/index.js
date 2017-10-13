/**
 * Created by deexiao on 2017/10/13.
 */

const env = process.env.NODE_ENV || 'dev';
const configs = require(`../../config_${env}.json`);

module.exports = configs;
