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

  // Section15 練習問題
  //ユーザーが「タスクを追加」フォームで入力を済ませて、「追加する」ボタンを押したとき
  const handleCreateTodoSubmit = useCallback(
    (event) => { 
      event.preventDefault() 
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {   
        setTodos((prev) => [...prev, data]) 
        setIsAddTaskFormOpen(false)         
        setInputValues({ title: '', description: '' })  
      })
      .catch((error) => {
        errorToast(error.message)
      })
    },
    [inputValues]  
  )

  // Section16 練習問題
  // ユーザーが「タスクを編集して保存」ボタンを押したとき
  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues) 
        .then(({ data }) => {
          setTodos((prevTodos) =>  
            prevTodos.map((todo) =>  
              todo.id === data.id ? data : todo 
            )
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
    }, 
    [todos]
  )

  // Section17 練習問題
  //「削除」ボタンをクリックした時＝削除したいタスクのIDを引数でもらう
  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`)  
      .then(({data}) => {
        setTodos((prevTodos) => 
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
  }, [])

  //Section18 練習問題
  //ユーザーが完了ボタンか未完了に戻すボタンをクリックした時=対象のタスクの id を受け取る。
  const handleToggleButtonClick = useCallback(
    (id) => {
      const targetTodo = todos.find((todo) => todo.id === id)
      const updatedStatus = !targetTodo.isCompleted

      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {  
           isCompleted: targetTodo.isCompleted,   
        })
        .then(({ data }) => {
          setTodos(  
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
    axios.get('http://localhost:3000/todo').then(({ data }) => {  
      setTodos(data)  
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
