import { useEffect, useState, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig' //
import { todoState, incompleteTodoListState } from '../../../stores/todoState'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Icon } from '../../ui/Icon'
import { Button } from '../../ui/Button'
import { Form } from '../../ui/Form'

import { errorToast } from '../../../utils/errorToast'


import styles from './index.module.css'

export const Top = () => {
  // const [todos, setTodos] = useState([])
  const [editTodoId, setEditTodoId] = useState('')
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)

  const handleAddTaskButtonClick = useCallback(()=>{
    setInputValues({ title:'', description:''})
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  },[])

  useEffect(()=>{
      axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    })
    .catch((error) => {
      errorToast(error.message)
    })
  },[setTodos])

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)},
  [])

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  },[])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .post('http://localhost:3000/todo', inputValues)
        .then(({data}) => {
          setTodos(prev=> [...prev, data])
          setInputValues({title: '', description: ''})
          setIsAddTaskFormOpen(false)
        })
        .catch((error) => {
          errorToast(error.message)
        })
    },
    [setTodos, inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`,inputValues)
        .then(({data}) => {
          setTodos((prev) =>
          prev.map((todo) => (todo.id === data.id ? data : todo))
        );
          setInputValues({title: '', description: ''})
          setEditTodoId('')
        })
        .catch((error) => {
         errorToast(error.message)
        })
    },
    [setTodos,editTodoId, inputValues]
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
  [todos])

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`)
    .then(() => {
       setTodos(todo => todo.filter(todo => (todo.id !== id)));
    })
    .catch((error) => {
      errorToast(error.message)
    });
  },[setTodos])

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`,{
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
            setTodos((prev) =>
            prev.map((todo) => (todo.id === data.id ? data : todo))
          );
        })
        .catch((error) => {
          errorToast(error.message)
        })
    },
    [todos,setTodos]
  )


  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          if(editTodoId === todo.id){
            return(
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
              onToggleButtonClick={handleToggleButtonClick}
          />)
        })}
        <li>
          {isAddTaskFormOpen ? (
            <Form
              value={inputValues}
              onChange={handleInputChange}
              onCancelClick={handleCancelButtonClick}
              onSubmit={handleCreateTodoSubmit}
            />
          ):(
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
              className={styles['add-task']}>
              <Icon
              iconName='plus'
              color='orange'
              size='medium'
              className={styles['plus-icon']}/>
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  )
}
