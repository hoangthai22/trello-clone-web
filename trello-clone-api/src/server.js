import express from "express";
import { connectDB, getDB } from "./config/mongodb.js";
import { BoardModel } from "./models/board-model.js";
import { apiV1 } from "./routes/v1/index.js";
import cors from "cors";
const port = 5000;

connectDB()
  .then(() => {
    console.log("Connected successfully to database server");
  })
  .then(() => bootServer())
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const bootServer = () => {
  const app = express();
  const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
  //Enable req.body.data
  app.use(express.json());

  //Use Apis v1
  app.use("/v1", apiV1);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};
