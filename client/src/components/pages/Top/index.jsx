import { useEffect, useState, useCallback } from 'react'
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
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)

  // ToDoの編集フォームの表示・非表示を切り替え
  const [editTodoId, setEditTodoId] = useState('')

  // ToDoの追加フォームに入力された値を保持
  const [inputValues, setInputValues] = useState({
    title: '', // タスク名
    description: '', // タスク説明
  })

  // ToDoの追加フォームの表示・非表示を切り替え
  // True:「タスクを追加」ボタン押下時、False:キャンセルボタン押下時
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  // 「タスクを追加」ボタン押下時、setIsAddTaskFormOpenをtrueに更新する関数
  const handleAddTaskButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  // 「タスクを追加」ボタン押下時、falseに更新する関数
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])

  // 追加フォーム内の入力値を更新
  const handleInputChange = useCallback(event => {
    const { name, value } = event.target
    setInputValues(prev => ({ ...prev, [name]: value }))
  }, [])

  // タスク追加処理
  const handleCreateTodoSubmit = useCallback(event => {
    event.preventDefault()
    axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
      console.log(todos)
      // todosのみ使うなら、todosは配列のため[]がいらないが、dataは配列じゃないから[]で囲んであげないといけない
      setTodos([...todos, data])
      setIsAddTaskFormOpen(false) // 2.追加フォームの非表示
      setInputValues({ // 3.追加フォームの入力欄を空
        title: '',
        description: '',
      })
    })
      .catch(error => {
        errorToast(error.message)
      })
  }, [setTodos, inputValues])

  // タスク編集処理
  const handleEditedTodoSubmit = useCallback((event) => {
    event.preventDefault()
    axios.patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
      .then(({ data }) => {
        setTodos(todos.map(value => data.id === value.id ? data : value))
        setEditTodoId('')
      })
      .catch(error => {
        switch (error.statusCode) {
          case 404:
            errorToast('更新するToDoが見つかりませんでした。画面を更新して再度お試しください。')
            break
          default:
            errorToast(error.message)
            break
        }
      })
  },
    [setTodos, editTodoId, inputValues]
  )

  // 編集フォーム
  const handleEditButtonClick = useCallback(id => {
    setIsAddTaskFormOpen(false)
    setEditTodoId(id)
    const targetTodo = todos.find(todo => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])

  // タスク削除処理
  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`)
      .then(({ data }) => {
        setTodos(data)
      })
      .catch(error => {
        switch (error.statusCode) {
          case 404:
            errorToast('削除するToDoが見つかりませんでした。画面を更新して再度お試しください。')
            break
          default:
            errorToast(error.message)
            break
        }
      })
  }, [setTodos])

  // Todo処理
  const handleToggleButtonClick = useCallback((id) => {
    axios.patch(`http://localhost:3000/todo/${id}/completion-status`, {
      isCompleted: todos.find((todo) => todo.id === id).isCompleted,
    })
      .then(({ data }) => {
        setTodos(todos.map(value => value.id === data.id ? data : value))
      })
      .catch(error => {
        switch (error.statusCode) {
          case 404:
            errorToast('完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。')
            break
          default:
            errorToast(error.message)
            break
        }
      })
  },
    [todos, setTodos]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    })
      .catch(error => {
        errorToast(error.message)
      })
  }, [setTodos])

  return (
    // メインコンテンツに表示する内容を↓Layoutタグ内に書いてく
    <Layout>
      {/*  */}
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map(todo => {

          // Trueの場合、編集フォームを表示
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
            />)
        })}


        <li>
          {/*三項演算子：trueの場合ToDoの追加フォームを表示*/}
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues} // 追加フォームに入力した値を保持する
              onChange={handleInputChange} // 入力フォームを更新
              onCancelClick={handleCancelButtonClick} // 「キャンセル」押下で追加フォーム非表示(setIsAddTaskFormOpenをFalse)
              onSubmit={handleCreateTodoSubmit} // 送信処理を行う
            />
          ) : (
            // *三項演算子：falseの場合「タスクを追加」ボタンを表示
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick} // 「タスクを追加」押下で追加フォーム表示(setIsAddTaskFormOpenをFalse)
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
