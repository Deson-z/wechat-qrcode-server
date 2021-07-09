const ENV = process.env.NODE_ENV;
const INITSQLS = [
    "CREATE TABLE IF NOT EXISTS `doc` (`id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增id',`create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',`division` longtext COLLATE utf8_unicode_ci COMMENT '事业部',`factory` longtext COLLATE utf8_unicode_ci COMMENT '工厂',`client_type` longtext COLLATE utf8_unicode_ci COMMENT '客户端类型',`title` longtext COLLATE utf8_unicode_ci COMMENT '客户端名称',`developer` longtext COLLATE utf8_unicode_ci COMMENT '开发/维护',`pm` longtext COLLATE utf8_unicode_ci COMMENT '产品/对接人',`flows` longtext COLLATE utf8_unicode_ci COMMENT '其他内容，保存json字符串',`kafka` longtext COLLATE utf8_unicode_ci COMMENT 'kafka配置内容',`device_manager` longtext COLLATE utf8_unicode_ci COMMENT '硬件维护人',`oss` longtext COLLATE utf8_unicode_ci COMMENT 'oss配置',`mes` longtext COLLATE utf8_unicode_ci COMMENT 'mes描述', `devices` longtext COLLATE utf8_unicode_ci COMMENT '设备列表', PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;",
]
const CREATEDBSQL = "create database if not exists `autodoc`;"
// const {
//     connectDB,
//     closeDB,
//     queryPromise,
//     mysqlPromise
// } = require('./mysql')
const crypto = require('crypto');
const fs = require('fs')
const schedule = require('node-schedule');
const path = require('path')
const fetch = require('node-fetch');
const {
    prodDatabase,
    localDatabase,
    wsConfigs
} = require('../configs')
const LOGFOLDER = 'logs'
const opts = {
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS',
    errorEventName:'error',
    logDirectory: path.resolve(LOGFOLDER), // NOTE: folder must exist and be writable...
    fileNamePattern:'<DATE>.log',
    dateFormat:'YYYY-MM-DD'
};
const logger = require('simple-node-logger').createRollingFileLogger( opts );
let scheduleJobs = []
let oldAccessTokenTime = undefined;
let tmpSignatureObj = undefined;

function createKey(strval) {
    return crypto.createHash('sha1').update(strval).digest('hex')
}
const initAction = async function() {
    if (!fs.existsSync(path.resolve('logs'))) {
        fs.mkdirSync(path.resolve('logs'))
    }
    
    // console.log('连接数据库')
    //     const _dbset = ENV === 'production' ? prodDatabase : localDatabase
    //     const _fdbset = {
    //         host: _dbset.host,
    //         user: _dbset.user,
    //         password: _dbset.password,
    //         port: _dbset.port
    //     };
    //     await connectDB(_fdbset)
    //     const _cdbres = await queryPromise(CREATEDBSQL)
    //     logger.info(`执行自动创建数据库${_cdbres.success?'成功':'失败:'+JSON.stringify(_cdbres)}`)
    //     await closeDB()
    //     await connectDB()
    //     for (let i = 0; i < INITSQLS.length; i++) {
    //         const _res = await queryPromise(INITSQLS[i])
    //         logger.info(`执行自动创建${i}表${_res.success?'成功':'失败:'+JSON.stringify(_res)}`)
    //     }
    //     await closeDB()
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function sleep(time=5000) {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve()
        }, time)
    })
}

function generateSign(params) {
    return new Promise(async resolve => {
        const {url} = params
        if (!url) {
            resolve({
                success: false,
                message: 'miss url'
            })
        }
        const _ctime = new Date().getTime()
        if (oldAccessTokenTime && (_ctime - oldAccessTokenTime) < 7200*1000 && tmpSignatureObj) {
            resolve({
                success: true,
                data: tmpSignatureObj
            })
        }
        const _res1 = await fetch(`https://api.weixin.qq.com/cgi-bin/token?grant_type=${wsConfigs.grant_type}&appid=${wsConfigs.appid}&secret=${wsConfigs.secret}`, { method: 'GET' }).then(res=>res.json())
        if (_res1.access_token) {
            oldAccessTokenTime = new Date().getTime()
            const _res2 = await fetch(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${_res1.access_token}&type=jsapi`, { method: 'GET' }).then(res=>res.json())
            if (_res2.ticket) {
                const _timestamp = Math.floor(new Date().getTime()/1000)
                const _noncestr = Math.random().toString(36).substr(2, 15);
                const _signature = createKey(`jsapi_ticket=${_res2.ticket}&noncestr=${_noncestr}&timestamp=${_timestamp}&url=${url}`)
                tmpSignatureObj = {
                    ...wsConfigs,
                    url: url,
                    ticket: _res2.ticket,
                    timestamp: _timestamp,
                    noncestr: _noncestr,
                    signature: _signature
                }
                resolve({
                    success: true,
                    data: tmpSignatureObj
                })
            } else {
                logger.info(JSON.stringify(_res2))
                resolve(_res2)
            }
        } else {
            logger.info(JSON.stringify(_res1))
            resolve(_res1)
        }
    })
}

function verifyWxConfig(params) {
    return new Promise(resolve => {
        resolve(params.echostr)
    })
}

exports = module.exports = {
    // 初始化
    initAction,
    getRandomIntInclusive,
    sleep,
    generateSign,
    verifyWxConfig
}