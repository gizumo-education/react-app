import { useEffect, useState, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig.js'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'

import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form/index.jsx'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true)
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
  }, [])

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setTodos((prev) => [...prev, data])
        setIsAddTaskFormOpen(false)
        setInputValues(true)
      })
    },
    [inputValues]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data)//追加
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
          {/*条件 ? trueのとき : falseのとき */}
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
              className={styles['add-task']}>
              <Icon
                iconName="plus"
                color='orange'
                size='medium'
                className={styles['plus-icon']}/*文字列と認識させるため[],大体.が多い */
              />
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  )
}