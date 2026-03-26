// Top/index.jsx

import { useState, useEffect, useCallback } from 'react' // useStateを追加
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 追加
import { Button } from '../../ui/Button' // 追加
import { Icon } from '../../ui/Icon' // 追加
import { Form } from '../../ui/Form' // 追加

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
  const [editTodoId, setEditTodoId] = useState('') // 追加

  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false) // 追加

  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' }) // 追加
    setEditTodoId('') // 追加
    setIsAddTaskFormOpen(true)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('') // 追加
    setIsAddTaskFormOpen(false)
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()

      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)

        // ① 追加したToDoが一覧に表示される
        setTodos((prev) => [...prev, data])

        // ② ToDoの追加フォームを非表示
        setIsAddTaskFormOpen(false)

        // ③ ToDoの追加フォームの入力欄を空にする
        setInputValues({
          title: '',
          description: '',
        })
      })
    },
    [inputValues]
  )
  // ↑ 追加

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()

      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          console.log(data)

          // ① 編集したToDoを一覧に反映
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === editTodoId ? data : todo
            )
          )

          // ② 編集フォームを非表示にする
          setEditTodoId('')

        })
    },
    [editTodoId, inputValues]
  )

  const handleEditButtonClick = useCallback((id) => {
    setIsAddTaskFormOpen(false) // 追加
    setEditTodoId(id)

    const targetTodo = todos.find((todo) => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })

  },
    [todos]
  )

  // ↓ 追加
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])
  // ↑ 追加

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

          // ↓ 追加
          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues}
                  editTodoId={editTodoId} // 追加
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleEditedTodoSubmit} // 追加
                />
              </li>
            )
          }
          // ↑ 追加

          return <ListItem key={todo.id} todo={todo}
            onEditButtonClick={handleEditButtonClick} // 追加
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
              onClick={handleAddTaskButtonClick} // 追加
              className={styles['add-task']}>
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
