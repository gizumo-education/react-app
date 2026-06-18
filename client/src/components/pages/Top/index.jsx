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
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
    setEditTodoId('')
  } ,[])

  // 入力値を受け取ってinputValuesに反映
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // 新規作成処理
  const handleCreateTodoSubmit = useCallback((event) => {
    event.preventDefault()
    axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
      setIsAddTaskFormOpen(false)
      setInputValues('')
      setTodos((prevTodos) => [...prevTodos, data])
    })
  }, [inputValues])
  
  // 編集画面の表示
  const handleEditButtonClick = useCallback((id) => {
    setIsAddTaskFormOpen(false)
    setEditTodoId(id)
    const targetTodo = todos.find((todo) => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])
  
    // 更新処理
    const handleEditedTodoSubmit = useCallback((event) => {
      event.preventDefault()
      axios.patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
      .then(({ data }) => {
        setTodos(todos.map((todo) =>
          todo.id === data.id ? data : todo
        ))
      })
      setEditTodoId('')
    }, [editTodoId, inputValues, todos])

  // 削除処理
  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({ data }) => {
      setTodos(data)
    })
  }, [])

  // 完了・未完了切り替え
  const handleToggleButtonClick = useCallback((id) => {
    axios.patch(`http://localhost:3000/todo/${id}/completion-status`, {
      isCompleted: todos.find((todo) => todo.id === id).isCompleted,
    })
    .then(({ data }) => {
      setTodos(todos.map((todo) =>
        todo.id === data.id ? data : todo
      ))
    })
  }, [todos])

  // 一覧取得表示
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    })
  }, [])

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
                  editTodoId={editTodoId}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleEditedTodoSubmit}
                />
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
