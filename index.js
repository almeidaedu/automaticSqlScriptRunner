const { bot } = require("./bot");

bot()
  .then(() => console.log("Deu tudo certo!"))
  .catch(error => console.log(`Houve algum erro: ${error}`));
