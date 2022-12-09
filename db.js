const { default: mongoose } = require("mongoose");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSERNAME,
  process.env.DBPASSWORD,
  {
    dialect: "mssql",
    host: process.env.DBHOST,
    define: {
      timestamps: false,
      freezeTableName: true,
    },
    dialectOptions: {
      options: {
        useUTC: false,
        encrypt: false,
      },
    },
  }
);

const mongodb = () => {
  mongoose.connection
    .on("error", () => console.log("Houve um Erro ao conectar no Mongo"))
    .on("disconnected", mongodb)
    .once("open", () => console.log("Conectado no Mongo!"));

  return mongoose.connect(process.env.MONGOCONNSTRING, {
    keepAlive: true,
    useUnifiedTopology: true,
  });
};

mongodb();

module.exports = {
  sequelize,
};
