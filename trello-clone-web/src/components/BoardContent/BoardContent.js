import React, { useState, useEffect, useRef, useCallback } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import Column from "../Column/Column";
import "./BoardContent.scss";
import { mapOrder } from "../../utils";
import { applyDrag } from "./../../utils/dragDrop.js";
import { fetchBoardDetails, createNewColumn } from "../../actions/CallApi";
import {
  Row,
  Container as BootstrapContainer,
  Col,
  Button,
  Form,
} from "react-bootstrap";

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardId = "610ca4885cd2821f337fd594";
    fetchBoardDetails(boardId)
      .then((board) => {
        console.log(board);
        setBoard(board);
        setColumns(mapOrder(board.columns, board.columnOrder, "_id"));
      })
      .catch((error) => console.log("error: " + error));
  }, []);

  //khi openNewColumnForm thay đổi thì sẽ chạy useEffect này
  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);
    let newBoards = { ...board };
    newBoards.columnOrder = newColumns.map((c) => c._id);
    newBoards.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoards);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];
      let currentColumn = newColumns.find((c) => c._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map((i) => i._id);
      setColumns(newColumns);
    }
  };

  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(true);
  };

  const toggleCloseNewColumnForm = () => {
    setOpenNewColumnForm(false);
  };

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }

    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim(),
    };
    createNewColumn(newColumnToAdd).then((data) => {
      let newColumns = [...columns];
      newColumns.push(data);
      let newBoards = { ...board };
      newBoards.columnOrder = newColumns.map((c) => c._id);
      newBoards.columns = newColumns;
      setColumns(newColumns);
      setBoard(newBoards);
      setNewColumnTitle("");
      toggleCloseNewColumnForm();
    });
  };

  const onNewColumnTitleChange = (e) => setNewColumnTitle(e.target.value);

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;

    let newColumns = [...columns];

    const columnIndexToUpdate = newColumns.findIndex(
      (i) => i._id === columnIdToUpdate
    );

    if (newColumnToUpdate._destroy) {
      newColumns.splice(columnIndexToUpdate, 1);
    } else {
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
    }
    let newBoards = { ...board };
    newBoards.columnOrder = newColumns.map((c) => c._id);
    console.log("newColumns: " + JSON.stringify(newBoards.columnOrder));
    newBoards.columns = newColumns;
    setColumns(newColumns);
    setBoard(newBoards);
  };
  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        getChildPayload={(index) => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "columns-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column
              column={column}
              onCardDrop={onCardDrop}
              onUpdateColumn={onUpdateColumn}
            />
          </Draggable>
        ))}
      </Container>

      <BootstrapContainer className="trello-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon"></i> Add another column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                type="text"
                placeholder="Enter column title..."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={(event) => event.key === "Enter" && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>
                Add column
              </Button>
              <span className="cancel-icon" onClick={toggleCloseNewColumnForm}>
                <i className="fa fa-trash icon"></i>
              </span>
            </Col>
          </Row>
        )}
      </BootstrapContainer>
    </div>
  );
}

export default BoardContent;
