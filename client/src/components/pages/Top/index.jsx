import { useRecoilValue, useSetRecoilState } from 'recoil'
import { todoState, incompleteTodoListState, completedTodoListState } from '../../../stores/todoState'
import { useEffect, useState, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig.js'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'

import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form/index.jsx'
import { errorToast } from '../../../utils/errorToast'

import styles from './index.module.css'

export const Top = () => {
  const done = useRecoilValue(completedTodoListState)
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)

  const [inputValues, setInputValues] = useState({    
  //タスクのタイトルと内容を管理するstate
    title: '',
    description: '',
  })

  const [editTodoId, setEditTodoId] = useState('')
  //編集formの表示・非表示を管理するstate
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  //タスク追加のフォームが開いているかどうかを管理するstate
  
  const handleAddTaskButtonClick = useCallback(() => {
    //タスク追加のボタンがクリックされたときの処理を行う関数
    setInputValues({ title: '', description: '' })
    setEditTodoId('')//空を格納し編集formを閉じる
    setIsAddTaskFormOpen(true)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
  //タスク追加のキャンセルボタンがクリックされたときの処理を行う関数
    setEditTodoId('')//空を格納し編集formを閉じる
    setIsAddTaskFormOpen(false)
  }, [])

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues)
      //入力されたタスクのタイトルと内容(inputValues)をサーバーに送信して、新しいタスクを作成する(post)ためのURL
        .then(({ data }) => {
          setTodos((prev) => [...prev, data])//前のtodo(prev)に新しいtodo(data)を追加する
          setIsAddTaskFormOpen(false)//フォームを閉じる
          setInputValues({
            title: '',
            description: '',
          })
        })
        .catch((error) => {
          errorToast(error.message)
        })
    },
    [setTodos, inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()//フォームの送信を防止するためのコード
      axios
        .put(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        //editTodoIdで指定されたタスクのタイトルと内容(inputValues)をサーバーに送信して、タスクを更新するためのURL
        .then(({ data }) => {
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === editTodoId ? data : todo
          //idが一致するtodoを新しいdataに置き換え、一致しないtodoはそのままにする
            )
          )
          setEditTodoId('')//空を格納し編集formを閉じる
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
      //todosに格納されたToDoの中から、編集するToDoのidと一致するToDoを探す
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    }, [todos])

  const handleDeleteButtonClick = useCallback
    ((id) => {//削除したいtodoのid
      axios.delete(`http://localhost:3000/todo/${id}`)
        .then(() => {
          const stateTodos = todos.filter((todo) => todo.id !== id)
          //idが一致しないtodoだけを残す
          setTodos(stateTodos)
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
    }, [setTodos])

  const handleToggleButtonClick = useCallback(
    (id) => {//idを受け取る:id=,,,
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        //axios.patch(URL, 更新したいデータ) 
        //完了状態を更新するAPI, todosからidが一致するtodoを探し、そのisCompletedを送信する
        .then(() => {
          const updateTodo = todos.map((todo) => {
            if (todo.id === id) {
              return {
                ...todo, isCompleted: !todo.isCompleted,
                //todoをfalseからtrueに切り替え
              }
            }
            return todo
          })
          setTodos(updateTodo)
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
    }, [todos, setTodos])

  useEffect(() => {
    axios.get('http://localhost:3000/todo')   //todoのdataを取得するためのURL(Reack hooks, React Recoll...)
      .then(({ data }) => {                   //response.deta
        setTodos(data)                        //取得したdetaをsetTodoにセット/todosに反映
      })
      .catch((error) => {
        errorToast(error.message)
      })
  }, [setTodos])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {               
          if (editTodoId === todo.id) {
            return (                        //todoはLayoutコンポーネントに帰り値として渡される。
                <Form
                  value={inputValues}
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  editTodoId={editTodoId}   //編集するToDoのidをeditTodoIdにセット
                  onSubmit={handleEditedTodoSubmit}
                />
            )
          }

          return (
            <ListItem                        //ListItem：rodoのタイトルと内容を表示するコンポーネント
              key={todo.id}
              todo={todo}
              onToggleButtonClick={handleToggleButtonClick}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
            />
          )
        })}
        <li>
          {/*条件 ? trueのとき : falseのとき */}
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues}
              onChange={handleInputChange}
              onCancelClick={handleCancelButtonClick}
              //handleCancelButtonClicが呼び出される.isAddTaskFormOpenがfalseになり、フォームが閉じる。
              onSubmit={handleCreateTodoSubmit}
              //フォームが送信されると、handleCreateTodoSubmitが呼び出される。新しいタスクが作成され、フォームが閉じる。
            />
          ) : (
            <Button                          //タスク追加のボタン
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
              //追加フォームがクリックされると、handleAddTaskButtonClickが呼び出される.isAddTaskFormOpenがtrueになり、フォームが表示される。
              className={styles['add-task']}>
              <Icon
                iconName="plus"
                color='orange'
                size='medium'
                className={styles['plus-icon']}/*文字列と認識させるため[],大体.が多い */
              />
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  )
}