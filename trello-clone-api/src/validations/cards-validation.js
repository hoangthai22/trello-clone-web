import Joi from "joi";
import { HttpStatusCode } from "../utils/constants.js";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().required().min(3).max(20).trim(),
    boardId: Joi.string().required(),
    columnId: Joi.string().required(),
  });
  try {
    await condition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

export const CardValidation = { createNew };
