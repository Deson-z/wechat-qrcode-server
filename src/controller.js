const ENV = process.env.NODE_ENV;
const {
    generateSign,
    verifyWxConfig,
} = require('./service')

async function getSignatureCtl(req, res) {
    const _result  = await generateSign(req.body)
    res.send(_result)
}

async function verifyWxConfigCtl(req, res) {
    const _result  = await verifyWxConfig(req.query)
    res.set('Content-Type', 'text/plain');
    res.send(_result)
}
exports = module.exports = {
    getSignatureCtl,
    verifyWxConfigCtl
}