import express from "express";
import { CardController } from "../../controllers/CardController.js";
import { CardValidation } from "../../validations/cards-validation.js";
const router = express.Router();

router
  .route("/")
  //.get((req, res) => {})
  .post(CardValidation.createNew ,CardController.createNew);
export const CardsRoutes = router;
