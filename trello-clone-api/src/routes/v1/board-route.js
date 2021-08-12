import express from "express";
import { BoardController } from "../../controllers/BoardController.js";
import { BoardValidation } from "../../validations/boards-validation.js";
const router = express.Router();

router
  .route("/")
  //.get((req, res) => {})
  .post(BoardValidation.createNew ,BoardController.createNew);
router
  .route("/:id")
  .get(BoardController.getAllBoard);
export const BoardsRoutes = router;
