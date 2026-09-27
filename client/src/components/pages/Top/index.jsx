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

  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true);
  }, []);
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false);
    setInputValues(INPUT_CLEAR);
  }, []);
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, []);

  const handleSubmit = useCallback((event) => {
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
  }, [inputValues, handleCancelButtonClick]);

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
        {todos.map((todo) => (
          <ListItem key={todo.id} todo={todo} />
        ))}
        <li>
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues}
              onCancelClick={handleCancelButtonClick}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
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
