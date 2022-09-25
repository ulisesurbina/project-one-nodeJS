const { app } = require("./app");

const { db } = require("./utils/database.util.js");

const { initModels } = require("./models/init.model.js");

const serverStart = async () => {
    try {
        await db.authenticate();
        initModels();
        await db.sync();
        PORT = 4000;
        app.listen(PORT, () => {
            console.log("Express running!");
        });
    } catch (error) {
        console.log(error);
    }
};

serverStart();
