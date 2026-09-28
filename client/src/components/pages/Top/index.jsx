import { useEffect, useState, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import styles from './index.module.css'

const TODO_URL = 'http://localhost:3000/todo';
const INPUT_CLEAR = { title: '', description: '' };

export const Top = () => {
  const [todos, setToDos] = useState([]);
  const [inputValues, setInputValues] = useState(INPUT_CLEAR);
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
  const [editTodoId, setEditTodoId] = useState('');

  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true);
    setInputValues(INPUT_CLEAR);
    setEditTodoId('');
  }, []);
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false);
    setInputValues(INPUT_CLEAR);
    setEditTodoId('');
  }, []);
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, []);

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios
        .post(TODO_URL, inputValues)
        .then(({ data }) => {
          setToDos((prev) => [...prev, data]);
          handleCancelButtonClick();
        })
        .catch((error) => {
          console.error('ToDoの追加に失敗：', error);
        });
    },
    [inputValues, handleCancelButtonClick]
  );

  const handleDeleteButtonClick = useCallback(
    (id) => {
      axios
        .delete(`${TODO_URL}/${id}`)
        .then(() => {
          setToDos((prev) => prev.filter((todo) => todo.id !== id));
        })
        .catch((error) => {
          console.error('Todoの削除に失敗：', error);
        });
    },
    []
  );

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios
        .patch(`${TODO_URL}/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setToDos((prev) => {
            return prev.map((todo) =>
              todo.id === editTodoId ? data : todo
            );
          }
          );
          handleCancelButtonClick();
        })
        .catch((error) => {
          console.error('Todoの編集に失敗：', error);
        });
    },
    [editTodoId, inputValues]
  )

  const handleEditButtonClick = useCallback(
    (id) => {
      setIsAddTaskFormOpen(false);
      setEditTodoId(id);

      const targetTodo = todos.find((todo) => todo.id === id);
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    },
    [todos]
  );

  useEffect(() => {
    axios
      .get(TODO_URL)
      .then(({ data }) => {
        setToDos(data);
      })
      .catch((error) => {
        console.error('ToDoの取得に失敗：', error);
      });
  }, []);

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {

          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues}
                  editTodoId={editTodoId}
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleEditedTodoSubmit}
                >
                </Form>
              </li>
            )
          }
          return (
            <ListItem
              key={todo.id}
              todo={todo}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
            />
          )
        })}
        <li>
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues}
              onCancelClick={handleCancelButtonClick}
              onChange={handleInputChange}
              onSubmit={handleCreateTodoSubmit}
            />
          ) : (
            <Button
              buttonStyle='indigo-blue'
              className={styles['add-task']}
              onClick={handleAddTaskButtonClick}
            >
              <Icon
                iconName='plus'
                color='orange'
                size='medium'
                className={styles['plus-icon']}
              />
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  )
}
