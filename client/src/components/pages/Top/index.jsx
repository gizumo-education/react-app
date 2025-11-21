import { Layout } from '../../ui/Layout'
import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form' 



import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
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
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)
        //練習問題 postすることでフォームで入力したdataを受け取り、下記の処理を行う
        //展開と追加
        setTodos(prevTodos => [...prevTodos,data])
        //フォームを閉じる
        setIsAddTaskFormOpen(false)
        //フォームの中身を初期値に戻す
        setInputValues({title: '',
          description: '',
        })
        
      })
    },
    [inputValues, setTodos]
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

    // section17 練習問題 
    //API通信
    axios.delete(`http://localhost:3000/todo/${id}`).then(() => {
      console.log(`http://localhost:3000/todo/${id}`)
      //idが一致しない要素だけで新しい配列作成
      setTodos(prevTodos =>
        prevTodos.filter((todo) => todo.id !== id)
      )
    })
  }, [])




  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data);
      //API通信が成功した場合、追加したToDoが一覧に表示
      setTodos(data);

    })
  }, [])

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
