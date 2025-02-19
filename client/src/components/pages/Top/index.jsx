// Topコンポーネントにほぼ全ての処理が書いてある
import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  // Todoの一覧を管理するためのstate[旧Todos、新Todos]
  const [todos, setTodos] = useState([])

  const [completedTodos, setCompletedTodos] = useState([])

  // Todoの追加フォームに入力された値を保持するstate
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  // Todoの編集フォームの表示非表示の切り替えをするためにTodoのIdを管理するためのstate
  const [editTodoId, setEditTodoId] = useState('')

  // Todo追加フォームの表示非表示を切り替えるためにTopコンポーネントにstateを追加
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  // タスクを追加ボタンをクリックした時に実行する
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  // Todo追加のキャンセルボタンをクリックした時に実行する
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])

  // 新しいTodoを追加するためにはタイトルと説明の入力した値をAPIに送信する
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Todo追加フォームを送信した時に実行するAPI通信に関する処理
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setTodos((prevTodos) => [...prevTodos, data])
        setIsAddTaskFormOpen(false)
        setInputValues({ title: '', description: '' })
      })
    },
    [inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) => (data.id === todo.id ? data : todo))
          )
          setEditTodoId('')
        })
    },
    [editTodoId, inputValues]
  )

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

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({ data }) => {
      // setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)
      data.id === setTodos.id ? setTodos(data) : console.log('error')
    })
  }, [])

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          setCompletedTodos = setTodos((completedTodos) =>
            completedTodos.map((todo) => (data.id === todo.id ? data : todo))
          )
        })
        .catch((error) => {
          console.log('更新に失敗しました', error)
        })
    },
    [todos]
  )

  // Todoの一覧を取得することはレンダリング後に実行したい副作用にあたるためuseEffectを使用してAPI通信を行う
  // Todoの配列が含まれたオブジェクトが返ってくる
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
      // setTodosは元々配列のため返ってきたオブジェクトの中の配列のdataをそのままセットする
    })
  }, [])
  return (
    <Layout>
      {/* /* // Layoutコンポーネントのchildrenにh1の見出しを渡している */}
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
            // ListItemコンポーネントにmapメソッドを使用して1つずつTodoのデータを渡して表示をしている
            <ListItem
              key={todo.id}
              todo={todo}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              onToggleButtonClick={handleToggleButtonClick}
            />
          )
        })}

        {/* trueならTodoフォームを表示し、falseならタスク追加ボタンを表示する */}
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
