import { useEffect, useState, useCallback } from 'react' // 追加
import { axios } from '../../../utils/axiosConfig' // 追加

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 追加
import { Button } from '../../ui/Button' // 追加
import { Icon } from '../../ui/Icon' // 追加
import { Form } from '../../ui/Form' // 追加

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]) // 追加
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false) // 追加
  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true)
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
  }, [])
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => {
      console.log(prev)
      return { ...prev, [name]: value }
    })
  }, [])
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)
        setTodos((prev) => [...prev, data])
        setIsAddTaskFormOpen(false)
        setInputValues({
          title: '',
          description: '',
        })
      })
    },
    [inputValues]
  )
  // 以下のuseEffectの処理を追加
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
      setTodos(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          return <ListItem key={todo.id} todo={todo} />
        })}
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
  )
}
