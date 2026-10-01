import { useEffect, useState, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import { errorToast } from '../../../utils/errorToast'
import styles from './index.module.css'

const TODO_URL = 'http://localhost:3000/todo';
const INPUT_CLEAR = { title: '', description: '' };

export const Top = () => {
  const todos = useRecoilValue(incompleteTodoListState);
  const setTodos = useSetRecoilState(todoState);
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
          setTodos((prev) => [...prev, data]);
          handleCancelButtonClick();
        })
        .catch((error) => {
          errorToast(error.message);
        });
    },
    [setTodos, inputValues, handleCancelButtonClick]
  );

  const handleDeleteButtonClick = useCallback(
    (id) => {
      axios
        .delete(`${TODO_URL}/${id}`)
        .then(() => {
          setTodos((prev) => prev.filter((todo) => todo.id !== id));
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '削除するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break;
            default:
              errorToast(error.message);
              break;
          }
        });
    },
    [setTodos]
  );

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`${TODO_URL}/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          setTodos((prev) =>
            prev.map((todo) => todo.id === id ? data : todo)
          )
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break;
            default:
              errorToast(error.message);
              break;
          }
        })
    },
    [todos, setTodos]
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

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios
        .patch(`${TODO_URL}/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setTodos((prev) => prev.map((todo) =>
            todo.id === editTodoId ? data : todo)
          );
          handleCancelButtonClick();
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '更新するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break;
            default:
              errorToast(error.message);
              break;
          }
        });
    },
    [editTodoId, inputValues]
  )

  useEffect(() => {
    axios
      .get(TODO_URL)
      .then(({ data }) => {
        setTodos(data);
      })
      .catch((error) => {
        errorToast(error.message);
      });
  }, [setTodos]);

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.filter(Boolean).map((todo) => {

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
              onToggleButtonClick={handleToggleButtonClick}
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
