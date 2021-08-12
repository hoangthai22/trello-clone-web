import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import Card from "../Card/Card.js";
import "./Column.scss";
import { mapOrder } from "../../utils";
import { Button, Dropdown, Form } from "react-bootstrap";
import ConfirmModal from "../Common/ConfirmModal.js";
import { MODAL_ACTION_CONFIRM } from "./../../constants";
import { cloneDeep } from "lodash";
import { createNewCard, updateColumn } from "../../actions/CallApi";
import {
  saveContentAfterEnter,
  selectAllInlineText,
} from "./../../utils/contentEditable.js";

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOrder, "_id");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [columnTitle, setColumnTitle] = useState(false);
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const newCardInputRef = useRef(null);
  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);

  useEffect(() => {
    if (newCardInputRef && newCardInputRef.current) {
      newCardInputRef.current.focus();
      newCardInputRef.current.select();
    }
  }, [openNewCardForm]);

  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  const onNewCardTitleChange = (e) => setNewCardTitle(e.target.value);

  const handleColumnTitleChange = (e) => {
    setColumnTitle(e.target.value);
  };

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    if (column.title !== columnTitle) {
      updateColumn(column._id, newColumn)
        .then((data) => {
          console.log(JSON.stringify(data));
          data.cards = newColumn.cards;
          onUpdateColumn(data);
        })
        .catch((error) => console.log(error));
    }
  };

  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true,
      };
      updateColumn(column._id, newColumn)
        .then((data) => {
          data.cards = newColumn.cards;
          console.log('data: ' + data);
          onUpdateColumn(data);
        })
        .catch((error) => console.log(error));
    }

    toggleShowConfirmModal();
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardInputRef.current.focus();
      return;
    }

    const newCardToAdd = {
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
      // cover: null,
    };
    createNewCard(newCardToAdd)
      .then((data) => {
        let newColumn = cloneDeep(column);
        newColumn.cards.push(data);
        newColumn.cardOrder.push(data._id);

        onUpdateColumn(newColumn);
        setNewCardTitle("");
        toggleOpenNewCardForm();
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            type="email"
            placeholder="Enter column title..."
            className="input-edit-title-column"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineText}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterEnter}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="column-dropdown-actions">
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              className="dropdown-btn"
              size="sm"
            />
            <Dropdown.Menu>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>
                Remove column...
              </Dropdown.Item>
              <Dropdown.Item>
                Move all cards in this column (beta) ...
              </Dropdown.Item>
              <Dropdown.Item>
                Archive all cards in this column (beta) ...
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="trello-col"
          onDrop={(e) => onCardDrop(column._id, e)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          draggable="false"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: "drop-preview",
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        {openNewCardForm && (
          <div className="add-new-card-area">
            <Form.Control
              as="textarea"
              placeholder="Enter card title..."
              className="input-enter-new-card"
              rows="3"
              ref={newCardInputRef}
              value={newCardTitle}
              onChange={onNewCardTitleChange}
              onKeyDown={(event) => event.key === "Enter" && addNewCard()}
            />
          </div>
        )}
      </div>

      <footer>
        {openNewCardForm && (
          <div className="add-new-card-actions">
            <Button
              variant="success"
              size="sm"
              onClick={addNewCard}
              className="add-card-btn"
            >
              Add card
            </Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-trash icon"></i>
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-ations" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon"></i> Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content={`Are you sure you want to remove ${column.title}! All related cards will also be removed`}
      />
    </div>
  );
}

export default Column;
