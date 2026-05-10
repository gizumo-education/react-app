import { useEffect, useState, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig.js'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'

import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form/index.jsx'

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
      axios.post('http://localhost:3000/todo', inputValues)
        .then(({ data }) => {
          setTodos((prev) => [...prev, data])
          setIsAddTaskFormOpen(false)
          setInputValues({
            title: '',
            description: '',
          })
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
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === editTodoId ? data : todo
            )
          )
          setEditTodoId('')
        })
    },
    [editTodoId, inputValues]
  )

  const handleEditButtonClick = useCallback(
    (id) => {
      setIsAddTaskFormOpen(false)
      setEditTodoId(id)

      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    }, [todos])

  const handleDeleteButtonClick = useCallback
    ((id) => {
      axios.delete(`http://localhost:3000/todo/${id}`)
      .then(()=>{
        const removeTodos = todos.filter((todo) =>todo.id !== id)
      setTodos(removeTodos)
    })
    }, [todos])
  
  const handleToggleButtonClick = useCallback(
  (id) => {
    axios
      .patch(`http://localhost:3000/todo/${id}/completion-status`, {
        isCompleted: todos.find((todo) => todo.id === id).isCompleted,
      })
      .then(() => {
        const updateTodo = todos.map((todo)=>{
          if(todo.id === id){
            return{
              ...todo, isCompleted: !todo.isCompleted,
            }
          } 
          return todo
        })
        setTodos(updateTodo)
      })
  },[todos])

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data)
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
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  editTodoId={editTodoId}
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
              onSubmit={handleCreateTodoSubmit}
            />
          ) : (
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
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