// const ENV = process.env.NODE_ENV;
exports = module.exports = {
  prodDatabase: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : '',
    port : 3306
  },
  localDatabase: {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : '',
    port : 3306
  },
  port: 4646,
  wsConfigs: {
    grant_type: "client_credential",
    appid: "wx10c32b38d3f414bb",
    secret: "d83941ef147b15319581de70574c12be",
  }
}