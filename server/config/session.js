const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const authdb = require('./database.js');

module.exports = {
	secret            : '@_df%o*topm$p&_',
	resave            : false,
	saveUninitialized : true,
	store             : new MySQLStore(authdb)
};
