import { useCallback, useEffect, useState } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
  const [editTodoId, setEditTodoId] = useState([])
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setIsAddTaskFormOpen(true)
    setEditTodoId('')
  })
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
    setEditTodoId('')
  })

  // 入力値を受け取ってinputValuesに反映
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCreateTodoSubmit = useCallback((event) => {
    event.preventDefault()
    axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
      console.log(data)
      setIsAddTaskFormOpen(false)
      setInputValues('')
    })
  }, [inputValues])

  const handleEditButtonClick = useCallback((id) => {
    setIsAddTaskFormOpen(false)
    setEditTodoId(id)
    const targetTodo = todos.find((todo) => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])

  // レンダリング時にToDo一覧を取得
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      // console.log(data)
      setTodos(data)
    })
  }, [todos])

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
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleCreateTodoSubmit}
                />
              </li>
            )
          }
          return <ListItem
            key={todo.id}
            todo={todo}
            onEditButtonClick={handleEditButtonClick}
          />
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
