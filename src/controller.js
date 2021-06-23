const ENV = process.env.NODE_ENV;
const {
    generateSign,
    generateQrcode,
} = require('./service')

async function getSignatureCtl(req, res) {
    const _result  = await generateSign(req.body)
    res.send(_result)
}

async function getQrcodeCtl(req, res) {
    const _result  = await generateQrcode(req.body)
    res.send(_result)
}
exports = module.exports = {
    getSignatureCtl,
    getQrcodeCtl
}