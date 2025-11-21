
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
  // 編集するToDoのidを管理
  const [editTodoId, setEditTodoId] = useState('')

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
        setTodos((oldData) => [...oldData, data])
        handleCancelButtonClick()//グローバル関数
        setInputValues('')
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
          console.log(data)
          setTodos((todos) => //更新前の現時点で最新のTodo
            todos.map((todo) => //↑のうちのリストひとつにおける処理
            todo.id === editTodoId ? data : todo
          ))
          setEditTodoId('')
          console.log(todos)
        })
    },
    [editTodoId, inputValues]
  )

  const handleEditButtonClick = useCallback(
    (id) => {
      setIsAddTaskFormOpen(false)
      setEditTodoId(id)//一つのリストしか編集ができない状態
      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    }, 
    [todos]
  )

  // 削除機能の関数
  const handleDeleteButtonClick = useCallback(
    (id) => {//axios.delete()の関数の呼び出しのみのためevent.preventDefault()は未記載
    axios.delete(`http://localhost:3000/todo/${id}`)
    .then(data => {
      console.log(data)
      setTodos(data.data)
    })
  }, [todos])

  // ToDoの追加フォームの表示・非表示の管理
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
        {todos.map((todo) => {
          // 編集アイコン実行時のidとリストのidが一致するか評価
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
          />)
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