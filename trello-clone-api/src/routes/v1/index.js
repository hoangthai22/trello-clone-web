import express from "express";
import { HttpStatusCode } from "./../../utils/constants.js";
import { BoardsRoutes } from "./board-route.js";
import { ColumnsRoutes } from "./column-route.js";
import { CardsRoutes } from "./card-route.js";
const router = express.Router();

//Get v1/status
router.get("/status", (req, res) =>
  res.status(HttpStatusCode.Success).json({
    status: "OK Nha!",
  })
);

router.use("/boards", BoardsRoutes);
router.use("/columns", ColumnsRoutes);
router.use("/cards", CardsRoutes);

export const apiV1 = router;
