const fileUpload = require("express-fileupload");
const errorHandler = require("../middlewares/error-handler");

const routes = require("../routes");
const modules = async (app, express) => {
  app.use(express.json());
  app.use(express.static("uploads"));
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());

  app.use(errorHandler);
  app.use("/api", routes);
};

module.exports = modules;
