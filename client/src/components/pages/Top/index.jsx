import { useCallback, useEffect, useState } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import styles from './index.module.css'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

export const Top = () => {
  const [todos, setTodos] = useState([])
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false) // タスクを追加のフォーム
  const [editTodoId, setEditTodoId] = useState('')

  // 「タスクを追加」ボタンをクリックしたときの処理
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  // 「キャンセル」ボタンをクリックしたときの処理
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])

  // ToDoを追加する処理
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setTodos((prevTodos) => [...prevTodos, data])
        setInputValues({ title: '', description: '' })
        setIsAddTaskFormOpen(false)
      })
    },
    [inputValues]
  )

  // 編集ボタンを押したときの処理
  const handleEditButtonClick = useCallback(
    (id) => {
      setIsAddTaskFormOpen(false)
      setEditTodoId(id)

      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    },
    [todos]
  )

  // 編集フォームで保存したら、更新する処理
  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === editTodoId ? data : todo))
          )
          setEditTodoId('')
          setIsAddTaskFormOpen(false)
        })
    },
    [editTodoId, inputValues]
  )

  // Todoを削除する処理
  const handleDeleteButtonClick = useCallback((id) => {
    axios
      .delete(`http://localhost:3000/todo/${id}`)
      .then(() => {
        console.log(id)
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
      })
      .catch((err) => {
        console.log(err, '削除に失敗しました。')
      })
  }, [])

  // 完了・未完了の切り替え処理
  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          setTodos(todos.map((todo) => (todo.id === data.id ? data : todo)))
        })
        .catch((err) => {
          console.log(err, '完了・未完了の更新に失敗しました')
        })
    },
    [todos, setTodos]
  )

  // マウント時にデータを取得する処理
  useEffect(() => {
    axios
      .get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data)
      })
      .catch((err) => {
        console.log(err, 'エラーが発生しました。')
      })
  }, [])

  return (
    <Layout>
      <>
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
                onEditButtonClick={handleEditedTodoSubmit}
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
      </>
    </Layout>
  )
}
