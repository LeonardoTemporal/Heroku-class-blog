const dotenv = require("dotenv");

const { app } = require("./app");
const { db } = require("./utils/database.util");
const { initModels } = require("./models/initModels");

dotenv.config({ path: "./config.env" });

const startServer = async () => {
  try {
    await db.authenticate();
    initModels();
    await db.sync(); // sincronizar modelos con sql

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Express app runnung at port ${PORT}! :D`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
