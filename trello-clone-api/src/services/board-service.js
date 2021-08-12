import { BoardModel } from "../models/board-model.js";
// import { cloneDeep } from "lodash";

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBoard = async (id) => {
  try {
    const board = await BoardModel.getAllBoard(id);
    if (!board || !board.columns) {
      throw new Error("Board not found");
    }
    const transformBoard = {
      ...board,
    };
    transformBoard.columns = transformBoard.columns.filter(
      (column) => !column._destroy
    );

    transformBoard.columns.forEach((column) => {
      column.cards = transformBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      );
    });

    //sort colmn by columnOrder, sort cart by cardOrder

    delete transformBoard.cards;
    return transformBoard;
  } catch (error) {
    console.log("errorService: " + error);
    throw new Error(error);
  }
};

export const BoardService = { createNew, getAllBoard };
