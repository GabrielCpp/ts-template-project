const { DataSource } =  require("typeorm");
const { config } = require('dotenv')

config()
const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env['DB_HOST'],
  port: 5432,
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  synchronize: true,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [__dirname + "/*.ts"]
})



module.exports.AppDataSource = AppDataSource