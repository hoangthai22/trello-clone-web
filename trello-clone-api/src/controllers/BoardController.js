import { BoardService } from "../services/board-service.js";
import { HttpStatusCode } from "./../utils/constants.js";

const createNew = async (req, res) => {
  try {
    const result = await BoardService.createNew(req.body);
    console.log("result" + result);
    res.status(HttpStatusCode.SUCCESS).json(result);
  } catch (error) {
    console.log("errorController: " + error);
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error,
    });
  }
};

const getAllBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BoardService.getAllBoard(id);
    console.log("result" + result);
    res.status(HttpStatusCode.SUCCESS).json(result);
  } catch (error) {
    console.log("errorController: " + error);
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error,
    });
  }
};

export const BoardController = { createNew, getAllBoard };
