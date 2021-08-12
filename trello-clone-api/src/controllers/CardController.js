import { CardService } from "../services/card-service.js";
import { HttpStatusCode } from "../utils/constants.js";

const createNew = async (req, res) => {
  try {
    const result = await CardService.createNew(req.body);
    console.log("result" + result);
    res.status(HttpStatusCode.SUCCESS).json(result);
  } catch (error) {
    console.log('errorController: ' + error);
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error
    });
  }
};

export const CardController = { createNew };
