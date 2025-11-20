
import { useState, useEffect , useCallback } from 'react' 
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' 
import { Button } from '../../ui/Button' 
import { Icon } from '../../ui/Icon' 
import { Form } from '../../ui/Form' 

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]) 
  // ToDoの追加フォームに入力された値を保持
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)
        setTodos((newData) => [...newData, data])
        handleCancelButtonClick()//グローバル関数
        setInputValues('')
        // setInputValues({title: '',description: '',})
      })
    },
    [inputValues]
  )
  // ToDoの追加フォームの表示・非表示の管理
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true)
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
  }, [])

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
      setTodos(data)
    })
  }, [])
  

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {/* リストの情報を表示する繰り返し処理 */}
        {todos.map((data) => {
          return <ListItem key={data.id} todo={data} />
        })}
        {/* ToDoの追加フォームの表示・非表示 */}
        <li>
          {isAddTaskFormOpen ? (
            <Form 
            value={inputValues} 
            onChange={handleInputChange}// 追加機能の実装
            onCancelClick={handleCancelButtonClick}
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