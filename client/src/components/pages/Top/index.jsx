import {  useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button' 
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import { errorToast } from '../../../utils/errorToast'

import styles from './index.module.css'

export const Top = () => {  
  const [todos, setTodos] = useState([])  // 書き込んだ内容todosを使って画面に表示する。setTodos()を使って＝データを書き込むuseState([])空の状態
  const [editTodoId, setEditTodoId] = useState('') //「どのToDoを今編集してるか」を覚えておくための状態
  const [inputValues, setInputValues] = useState({ //タスクを追加・編集するフォームの入力内容を保存する状態。
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)  //「追加フォームを表示するかどうか」のON/OFFスイッチ。→ ＋追加ボタンを押す

  const handleAddTaskButtonClick = useCallback(() => {  //「＋タスク追加」ボタンをクリックしたとき
    setInputValues({ title: '', description: '' }) // 入力欄を空にする
    setEditTodoId('')  // 編集モードを解除
    setIsAddTaskFormOpen(true)  // フォームを表示する
  }, [])

  const handleCancelButtonClick = useCallback(() => { 
    setEditTodoId('')  // 編集中状態を解除（IDを空に）
    setIsAddTaskFormOpen(false)  // フォームを非表示にする
  }, [])
  
  const handleInputChange = useCallback((event) => {  // フォームの入力欄に文字を入力したとき
    const { name, value } = event.target   // 入力欄の名前とその時の入力内容（value）を取り出しどの入力欄かを特定しる
      setInputValues((prev) => ({ ...prev, [name]: value })) //入力された内容をinputValuesに反映する。
  }, [])

  // Section15 練習問題
  //ユーザーが「タスクを追加」フォームで入力を済ませて、「追加する」ボタンを押したとき
  const handleCreateTodoSubmit = useCallback(
    (event) => { 
      event.preventDefault() 
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)  // サーバーが返した更新済みのデータを表示  
        setTodos((prev) => [...prev, data]) // // 今のToDoリストに新しいToDo（data）を追加して、画面に反映
        setIsAddTaskFormOpen(false)         // フォームを非表示して、リスト状態に戻す
        setInputValues({ title: '', description: '' })  // 入力欄を空にする
      })
      .catch((error) => {
        errorToast(error.message)
      })
    },
    [inputValues]  // フォームに入力された値
  )

  // Section16 練習問題
  // ユーザーが「タスクを編集して保存」ボタンを押したとき
  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues) // 入力された新しい内容を使って、IDに対応するサーバーデータを更新依頼する
        .then(({ data }) => {
          console.log(data)
          setTodos((prevTodos) =>  // 今のToDo一覧を取得して、次の状態を作るための関数を渡す
            prevTodos.map((todo) =>  // 一覧の中の各タスクを1つずつ取り出してループ
              todo.id === data.id ? data : todo // 編集されたタスクのIDと一致するなら、新しいデータに置き換える。それ以外はそのまま残す
            )
          )
          setEditTodoId('') // 編集が終わったときの処理を行う
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
    [editTodoId, inputValues] //編集内容が変わったら処理も最新になる
  )

  const handleEditButtonClick = useCallback((id) => {
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

  // Section17 練習問題
  //「削除」ボタンをクリックした時＝削除したいタスクのIDを引数でもらう
  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`)  // 削除ボタンを押したToDoのIDを使って、サーバーに削除のリクエストを送る
      .then(({data}) => {
        console.log(data)
          setTodos((prevTodos) => // ← 現在のタスク一覧（prevTodos）から
            prevTodos.filter((todo) => todo.id !== id)  // 削除したタスク（指定されたID）だけを除外して新しい一覧を作る
          ) 
      })
      .catch((error) => {
        switch (error.statusCode) { 
          case 404:
            errorToast(
              '削除するToDoが見つかりませんでした。画面を更新して再度お試しください。'
            )
            break

          default:  // それ以外のエラー
            errorToast(error.message)
            break
        }
      })
  }, [])

  //Section18 練習問題
  //ユーザーが完了ボタンか未完了に戻すボタンをクリックした時=対象のタスクの id を受け取る。
  const handleToggleButtonClick = useCallback(
    (id) => {
      const targetTodo = todos.find((todo) => todo.id === id); // 
      const updatedStatus = !targetTodo.isCompleted;  //今の状態（完了/未完了）を逆にする。

      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {  //完了状態を変更してくれとリクエストする。
           isCompleted: targetTodo.isCompleted,   //targetTodoで中身を省略
        })
        .then(({ data }) => {
          console.log(data)
          setTodos(  // 画面側のリストも最新の状態にする。
          todos.map((todo) =>
            todo.id === id
              ? { ...todo, isCompleted: updatedStatus } 
              : todo
          )
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
    [todos]  
  )

  // Section14 練習問題
  // ToDoアプリの画面を開いた時に今のタスクリストが表示される
  useEffect(() => {  
    axios.get('http://localhost:3000/todo').then(({ data }) => {  // このURLに対してGETリクエストを送り、今登録されているToDo一覧を取得する。
      console.log(data)
      setTodos(data)  //  取得したリストのデータ＝dataを、todosという状態に保存するための処理。
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
          return (
            <ListItem
              key={todo.id}
              todo={todo}
              onEditButtonClick={() => handleEditButtonClick(todo.id)}
              onDeleteButtonClick={() => handleDeleteButtonClick(todo.id)}
              onToggleButtonClick={() => handleToggleButtonClick(todo.id)}
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