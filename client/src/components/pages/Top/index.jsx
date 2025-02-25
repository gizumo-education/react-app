// Topコンポーネントにほぼ全ての処理が書いてある
import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import { errorToast } from '../../../utils/errorToast'

import styles from './index.module.css'

export const Top = () => {
  // todosはRecoilの状態から読み取り専用のフックを使用して最新の状態を取得している
  // setTodosはRecoilの状態を更新するための書き込み専用フックを使用して状態を更新している
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)

  // Todoの追加フォームに入力された値を保持するstate
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  // Todoの編集フォームの表示非表示の切り替えをするためにTodoのIdを管理するためのstate
  const [editTodoId, setEditTodoId] = useState('') //ID

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

  // 新しいTodoを追加するためにはタイトルと説明の入力した値をstateに保持する必要がある
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // Todo追加フォームを送信した時に実行するAPI通信に関する処理
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .post('http://localhost:3000/todo', inputValues)
        .then(({ data }) => {
          setTodos((prevTodos) => [...prevTodos, data])
          setIsAddTaskFormOpen(false)
          setInputValues({ title: '', description: '' })
        })
        .catch((error) => {
          errorToast(error.message)
        })
    },
    [setTodos, inputValues] // inputValuesが変更された時だけ再レンダリングする
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
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '更新するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break

            default:
              errorToast(error.message)
              break
          }
        })
    },
    [setTodos, editTodoId, inputValues]
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

  const handleDeleteButtonClick = useCallback(
    (id) => {
      axios
        .delete(`http://localhost:3000/todo/${id}`)
        .then(({ data }) => {
          setTodos(data)
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '削除するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break

            default:
              errorToast(error.message)
              break
          }
        })
    },
    [setTodos]
  )

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          setTodos((prev) =>
            prev.map((todo) => (data.id === todo.id ? data : todo))
          )
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break

            default:
              errorToast(error.message)
              break
          }
        })
    },
    [todos, setTodos]
  )

  // Todoの一覧を取得することはレンダリング後に実行したい副作用にあたるためuseEffectを使用してAPI通信を行う
  // Todoの配列が含まれたオブジェクトが返ってくる
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
      setTodos(data)
      // setTodosは元々配列のため返ってきたオブジェクトの中の配列のdataをそのままセットする
    })
  }, [setTodos])

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
