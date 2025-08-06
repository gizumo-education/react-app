import { useState, useEffect, useCallback } from 'react' // useStateを追加
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 一覧表示追加

import { Button } from '../../ui/Button' // todo追加
import { Icon } from '../../ui/Icon' //todo追加
import { Form } from '../../ui/Form'//todo追加_表示非表示切り替え
import { errorToast } from '../../../utils/errorToast'//エラーハンドリング

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
  const [editTodoId, setEditTodoId] = useState('')
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
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

        // ★★★★★
        // ↓todoの追加_1追加したToDoを一覧に反映_2フォームを閉じる3_入力欄を空にする
        setTodos((prev) => [...prev, data])
        setIsAddTaskFormOpen(false)
        setInputValues({
          title: '',
          description: '',
        })

        console.log(data)
      })

        .catch((error) => {
          errorToast(error.message)
        })

    },
    [inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        //.patch(`http://localhost:3000/todo/editTodoId`, inputValues) エラー起こしたい時用
        .then(({ data }) => {
          // ★★★追加↓編集したToDoを一覧に反映
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === editTodoId ? { ...todo, ...data } : todo
            )
          )
          // ★★★追加↓編集フォームを閉じる
          setEditTodoId('')

          console.log('編集成功:', data)
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
    [editTodoId, inputValues]
  )

  const handleEditButtonClick = useCallback((id) => {
    setIsAddTaskFormOpen(false)
    setEditTodoId(id)
    const targetTodo = todos.find((todo) => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])

  const handleDeleteButtonClick = useCallback((id) => {//★★★↓todoの削除追加部分
    axios
      .delete(`http://localhost:3000/todo/${id}`)
      .then(() => {
        // ★★★ ここでtodosから削除した要素を除く
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
        console.log(`削除成功: ID=${id}`)
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
  }, [])

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {//★★★ToDoの状態変更（完了・未完了の切り替え）の追記
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === id ? { ...todo, isCompleted: data.isCompleted } : todo
            )
          )
          console.log(data)
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
    [todos]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data) //★★★★★←追加
      console.log(data)
    })

      .catch((error) => {
        errorToast(error.message)
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
                  editTodoId={editTodoId}
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleEditedTodoSubmit}
                />
              </li>
            )
          }
          return <ListItem key={todo.id} todo={todo} onEditButtonClick={handleEditButtonClick} onDeleteButtonClick={handleDeleteButtonClick} onToggleButtonClick={handleToggleButtonClick} /> //★質問する事★onEditButtonClick追加で元のやつ消えたけど問題ないか
        })}
        {/* ここまで一覧表示 */}
        <li>
          {isAddTaskFormOpen ? (
            <Form value={inputValues} onChange={handleInputChange} onCancelClick={handleCancelButtonClick} onSubmit={handleCreateTodoSubmit} />
          ) : (
            <Button buttonStyle='indigo-blue' onClick={handleAddTaskButtonClick} className={styles['add-task']}>
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