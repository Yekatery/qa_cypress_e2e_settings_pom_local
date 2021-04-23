const path = require('path')

const Sequelize = require('sequelize')

const config = require('../config')

// sequelize
const sequelizeParams = {
  operatorsAliases: false,
  logging: config.verbose ? console.log : false
};
if (config.isProduction) {
  sequelizeParams.dialect = 'postgres';
  sequelizeParams.dialectOptions = {
    // https://stackoverflow.com/questions/27687546/cant-connect-to-heroku-postgresql-database-from-local-node-app-with-sequelize
    // https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
    // https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
  sequelizeParams.host = process.env.DATABASE_URL;
} else {
  sequelizeParams.dialect = 'sqlite';
  sequelizeParams.storage = path.join(__dirname, '../db.sqlite3');
}
const sequelize = new Sequelize(sequelizeParams);

// db
const db = {}
db.Article = sequelize.import('./article')
db.Comment = sequelize.import('./comment')
db.User = sequelize.import('./user')
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate()
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize
sequelize.sync()
module.exports = db
