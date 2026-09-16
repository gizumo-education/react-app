import { useState, useEffect, useCallback } from 'react' // useStateを追加
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]) // 追加
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
  },[])
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
    axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
      console.log(data)
      //追加(練習問題)
      setIsAddTaskFormOpen(false);
      setInputValues({  //titleと説明を初期化
        title: "",
        description: "",
      })
      setTodos((prev) => [...prev, data])//現在のTodoを受け取り、dataを追加する
      //ここまで
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
    },
    [todos]
  )

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({data}) =>{
      console.log(data)
      setTodos((prev) =>{
        return prev.filter((todo) => todo.id !== id)
      })
    })
  },[])

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      //console.log(data)
      setTodos(data)
    })
  }, [])//inputValues追加

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          if(editTodoId === todo.id){
            return(
              <li key = {todo.id}>
                <Form
                  value = {inputValues}
                  editTodoId = {editTodoId}
                  onChange = {handleInputChange}
                  onCancelClick = {handleCancelButtonClick}
                  onSubmit = {handleEditedTodoSubmit}
                />
              </li>
            )
          }

          return <ListItem 
            key={todo.id}
            todo={todo} 
            onEditButtonClick = {handleEditButtonClick}
            onDeleteButtonClick = {handleDeleteButtonClick}
          />
        })}
        <li>
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues}
              onChange = {handleInputChange}
              onCancelClick = {handleCancelButtonClick} 
              onSubmit = {handleCreateTodoSubmit}
            />
          ) : (
          <Button 
            buttonStyle='indigo-blue'
            onClick = {handleAddTaskButtonClick}
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
