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

  // 「タスクを追加」ボタンをクリックしたときの処理
  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true)
  }, [])

  // 「キャンセル」ボタンをクリックしたときの処理
  const handleCancelButtonClick = useCallback(() => {
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
      </>
    </Layout>
  )
}
