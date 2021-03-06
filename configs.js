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
  port: 4646, // prod
  // port: 8080, // test
  wsConfigs: {
    grant_type: "client_credential",
    appid: "wx6bc5dd0a21e6908d", // prod
    secret: "9631afe2fd59b02a05be1fa3f976e80b", // prod
    // appid: "wx9c4366c3f03742d6", // test
    // secret: "85084c4341575bf69bf31bc873ba4f24", // test
  },
  verifyToken:{
    token:"dison0727"
  }
}