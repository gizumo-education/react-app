import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'
import { Form } from '../../ui/Form'

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
        // 1 追加したtodoを一覧に表示
        setTodos((prevTodos) => [...prevTodos, data])

        // 2 フォームを非表示
        setIsAddTaskFormOpen(false)

        // 3 入力欄を空にする
        setInputValues({ title: '', description: ''})
      })
      .catch((error) => {
        console.error('ToDoの追加に失敗しました', error)
      })
    },
    [inputValues]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({data}) => {
      // console.log(data)
      setTodos(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          return <ListItem key={todo.id} todo={todo}/>
        })}

        <li>
          {isAddTaskFormOpen ? (
            <Form value={inputValues}
                  onCancelClick={handleCancelButtonClick}
                  onChange={handleInputChange}
                  onSubmit={handleCreateTodoSubmit}
            />
          ) : (
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
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
