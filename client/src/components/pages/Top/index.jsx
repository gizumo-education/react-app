import { Layout } from '../../ui/Layout'
import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form' 
import { errorToast  } from '../../../utils/errorToast'



import styles from './index.module.css'

export const Top = () => {
  //ToDoを管理
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)



  //編集フォーム
  //編集するidが格納
  const [editTodoId, setEditTodoId] = useState('')
  
  console.log(todos);

  



  //追加フォームに入力された値を保持
  const [inputValues, setInputValues] = useState({title: '',
    description: '',
  })


  //表示・非表示を管理するstate
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  //タスク追加押下時に実行する関数
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  //キャンセルボタンクリック時に実行する関数
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])


  //inputValuesに反映させる処理
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])


  //fromタグのデフォルトイベント（ページ遷移）をキャンセルする関数
  const handleCreateTodoSubmit = useCallback(
    //eventオブジェクト
    (event) => {
      event.preventDefault()
      //非同期処理 リロードなし
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)
        //section15 練習問題 postすることでフォームで入力したdataを受け取り、下記の処理を行う
        //展開と追加
        setTodos(prevTodos => [...prevTodos,data])
        //フォームを閉じる
        setIsAddTaskFormOpen(false)
        //フォームの中身を初期値に戻す
        setInputValues({title: '',
          description: '',
        })
        
      })
      .catch((error) => {
        errorToast(error.message)
      })
    },
    [inputValues, setTodos, editTodoId]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          console.log(data)

          //section16 練習問題
          //最新のデータを取得し、mapメソッドで一つ一つのオブジェクト展開、現在のidと編集中のidが一致していれば情報を更新、一致していなければ現在の情報を表示
          setTodos((prevTodos) => 
            prevTodos.map((todo) => todo.id === editTodoId ?
             data : todo)
          )
          //非表示にする
          setEditTodoId('')
        
        })
        .catch((error) => {
          switch(error.statusCode) {
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

    //編集フォーム開いたらtodoタイトルと説明を表示
  //todosに格納されたToDoから編集するidと一致するTodoを取得
  const targetTodo = todos.find((todo) => todo.id === id)
  //取得したものをinputValuesに格納
  setInputValues({
    title: targetTodo.title,
    description: targetTodo.description,
  })
  },[todos])


  //削除するTodoのidを受け取る
  const handleDeleteButtonClick = useCallback((id) => {

    // section17 練習問題 削除機能の実施
    //API通信
    axios.delete(`http://localhost:3000/todo/${id}`).then(() => {
      console.log(`http://localhost:3000/todo/${id}`)
      //idが一致しない要素だけで新しい配列作成
      setTodos(prevTodos =>
        prevTodos.filter((todo) => todo.id !== id)
      )
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


  //完了・未完了切り替え機能の実装
  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          console.log(data)

          //section18 練習問題 切り替え実装
          setTodos(prevTodos => prevTodos.map(todo => 
            todo.id === id ? {...todo, isCompleted:data.isCompleted} : todo
          ))
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



  //ToDo一覧取得
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data);

      //section14 練習問題
      //API通信が成功した場合、追加したToDoが一覧に表示
      setTodos(data);

    })
  }, [setTodos])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map(( todo ) => {
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
            onEditButtonClick={handleEditButtonClick}onDeleteButtonClick={handleDeleteButtonClick}
            onToggleButtonClick={handleToggleButtonClick}
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
