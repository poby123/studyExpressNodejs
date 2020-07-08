// module.exports = {
//   host : 'localhost',
//   user : 'nodejs',
//   password : '12345678',
//   port : '3306',
//   database : 'opentutorials'
// }
 module.exports = {
   host : process.env.DB_HOST,
   user : process.env.DB_USER,
   password : process.env.DB_PASSWORD,
   port : '3306',
   database : process.env.DB_DATABASE
 }
