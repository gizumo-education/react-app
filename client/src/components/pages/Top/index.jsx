import { useCallback, useEffect, useState } from 'react';
import { axios } from '../../../utils/axiosConfig';
import { Layout } from '../../ui/Layout';
import { ListItem } from '../../ui/ListItem';
import { Button } from '../../ui/Button';
import { Form } from '../../ui/Form';
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]);
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  });
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);

  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true);
  }, []);

  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false);
  }, [])

  const handleInputChange = useCallback(() => {
    const {name, value} = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value}))
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios.post('http://localhost:3000/todo', inputValues).then(({data}) => {
        setTodos([...todos, data]);
        setIsAddTaskFormOpen(false);
        setInputValues({
          name: '',
          description: '',
        })
      })
    },
    [inputValues]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data);
      })
  }, []);
  
  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map(todo => (
          <ListItem key={todo.id} todo={todo} />
        ))
        }
        <li>
          {isAddTaskFormOpen ? (
              <Form
                value={inputValues}
                onChange={handleInputChange}
                onCancelClick={handleCancelButtonClick}
                onSubmit={handleCreateTodoSubmit}
              />
            ) : (
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
              className={styles['add-task']}
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
  );
}
