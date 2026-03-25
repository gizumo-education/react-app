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

  // ↓ 追加
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
