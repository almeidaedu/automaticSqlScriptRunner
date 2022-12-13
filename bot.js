const shell = require("shelljs");
const moment = require("moment");
moment.locale("pt-br");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const detectEncoding = require("detect-file-encoding-and-language");
const { ScriptLog } = require("./models/ScriptLog");
const { sequelize } = require("./db");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const repositoryName = "automaticSqlScriptRunner";
const branchName = process.env.GITBRANCH;
const yesterday = moment().subtract(1, "d").format("YYYYMMDD");

const bot = async () => {
  try {
    await sequelize.authenticate();

    if (!fs.existsSync(repositoryName)) {
      shell.exec(`git clone ${process.env.GITURL}`);
    }

    shell.exec(
      `cd ${repositoryName} && git checkout ${branchName} && git pull`
    );

    if (!fs.existsSync(`${repositoryName}/${yesterday}`)) {
      console.log("There is no script to run today.");
      const message = `There is no script to run on ${moment()
        .subtract(1, "d")
        .format("ll")} for the base ${branchName}`;
      //TODO
      //Use a webhook to send messages (discord or slack)
      process.exit();
    }

    const solicitationNames = fs.readdirSync(`${repositoryName}/${yesterday}`);

    for (let i = 0; i < solicitationNames.length; i++) {
      try {
        const fileInfo = await detectEncoding(
          `${repositoryName}/${yesterday}/${solicitationNames[i]}/deploy.sql`
        );

        const data = fs.readFileSync(
          `${repositoryName}/${yesterday}/${solicitationNames[i]}/deploy.sql`,
          {
            encoding: fileInfo.encoding,
          }
        );

        const outputPromise = await sequelize.query(data);
        Promise.resolve(outputPromise);

        //TODO
        //Use a webhook to send messages (discord or slack)

        const insertScriptLog = new ScriptLog({
          DayDeployed: moment().subtract(1, "d"),
          ScriptDeployed: solicitationNames[i],
          BaseDeployed: branchName,
          Status: true,
        });

        const mongoPromise = await insertScriptLog.save({});
        Promise.resolve(mongoPromise);
      } catch (error) {
        console.log(`catch Error: ${error}`);
        //TODO
        //Use a webhook to send messages (discord or slack)

        const insertScriptLog = new ScriptLog({
          DayDeployed: moment().subtract(1, "d"),
          ScriptDeployed: solicitationNames[i],
          BancoRodado: branchName,
          Status: false,
        });
        const mongoPromise = await insertScriptLog.save({});
        Promise.resolve(mongoPromise);

        fs.appendFileSync(
          `${repositoryName}/${yesterday}/${solicitationNames[i]}/deployError.log`,
          error.message
        );

        shell.exec(
          `cd ${repositoryName} && git add . && git commit -m 'error log' && git push origin ${branchName}`
        );
        continue;
      }
    }
    process.exit();
  } catch (error) {
    console.log(`Something went wrong: ${error}`);
  }
};

module.exports = {
  bot,
};
