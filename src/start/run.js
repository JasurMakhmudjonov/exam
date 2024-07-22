const config = require("../../config");

const runner = async (app) => {
  app.listen(config.port, () => {
    console.log(`Server lintening on port ${config.port}`);
  });
};

module.exports = runner;
