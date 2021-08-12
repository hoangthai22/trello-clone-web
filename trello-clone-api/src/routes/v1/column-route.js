import express from "express";
import { ColumnController } from "../../controllers/ColumnController.js";
import { ColumnValidation } from "../../validations/column-validation.js";
const router = express.Router();

router.route("/").post(ColumnValidation.createNew, ColumnController.createNew);
router.route("/:id").put(ColumnValidation.update, ColumnController.update);
export const ColumnsRoutes = router;
