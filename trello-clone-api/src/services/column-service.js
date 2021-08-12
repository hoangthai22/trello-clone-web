import { ColumnModel } from "../models/column-model.js";
import { BoardModel } from "../models/board-model.js";
import { CardModel } from "../models/card-model.js";
import { ObjectId } from "mongodb";

const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data);
    newColumn.cards = [];
    //update columnOrder in Board collection
    await BoardModel.pushColumnOrder(
      newColumn.boardId.toString(),
      newColumn._id.toString()
    );
    return newColumn;
  } catch (error) {
    console.log("errorService: " + error);
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };

    if (updateData._id) delete updateData._id;
    if (updateData.cards) delete updateData.cards;
    const result = await ColumnModel.update(id, updateData);
    if (result._destroy) {
      await CardModel.deleteMany(result.cardOrder);
    }

    return result;
  } catch (error) {
    console.log("errorService: " + error);
    throw new Error(error);
  }
};

export const ColumnService = { createNew, update };
