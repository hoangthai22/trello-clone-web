import { ColumnService } from "../services/column-service.js";
import { HttpStatusCode } from "../utils/constants.js";

const createNew = async (req, res) => {
  try {
    const result = await ColumnService.createNew(req.body);
    res.status(HttpStatusCode.SUCCESS).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ColumnService.update(id, req.body);
    res.status(HttpStatusCode.SUCCESS).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    });
  }
};

export const ColumnController = { createNew, update };
