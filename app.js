const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs')
const path = require('path')

Date.prototype.format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
}
  
// const lineReader = require('line-reader');
// const multer = require('multer')
// const upload = multer({
//     dest: 'uploads/'
// })

// app.use(express.static(path.join(__dirname,'uploadsImg')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}));

const {
    port
} = require('./configs')
const {
    getSignatureCtl,
    getQrcodeCtl
} = require('./src/controller')
const {
    initAction
} = require('./src/service')
const PROJECTNAME = '/wechat-qrcode'

initAction();

app.post(`${PROJECTNAME}/getSignature`, getSignatureCtl)
app.post(`${PROJECTNAME}/getQrcode`, getQrcodeCtl)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))