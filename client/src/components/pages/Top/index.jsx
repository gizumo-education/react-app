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
  console.log(todos);

  



  //追加フォームに入力された値を保持
  const [inputValues, setInputValues] = useState({title: '',
    description: '',
  })


  //表示・非表示を管理するstate
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  //タスク追加押下時に実行する関数
  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true)
  }, [])

  //キャンセルボタンクリック時に実行する関数
  const handleCancelButtonClick = useCallback(() => {
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
        //postすることでフォームで入力したdataを受け取り、下記の処理を行う
        //展開と追加
        setTodos(prevTodos => [...prevTodos,data])
        //フォームを閉じる
        setIsAddTaskFormOpen(false)
        setInputValues({title: '',
          description: '',
        })
      })
    },
    [inputValues, setTodos]
  )



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
    </Layout>
  )
}
