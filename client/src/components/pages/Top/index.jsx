import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  // State管理
  const [todos, setTodos] = useState([])
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  }) // 追加時のToDoを保持
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false) // 追加フォームの表示・非表示を管理

  // ToDo一覧表示機能
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    })
  }, [todos])

  // ToDo追加フォームの表示機能
  const handleAddTaskButtonClick = useCallback(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setIsAddTaskFormOpen(true)
    })
  }, [])

  // ToDo追加フォームの非表示機能
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
    setInputValues({ title: '', description: '' })
  }, [])

  // 入力した値をstateのinputValuesに反映する処理
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // ToDo追加機能
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(() => {
        setInputValues({ title: '', description: '' })
      })
    },
    [inputValues]
  )

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
