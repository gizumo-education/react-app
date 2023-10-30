import { useCallback, useEffect, useState } from 'react'
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
  const [isAddTasksFormOpen, setIsAddTasksFormOpen] = useState(false)



  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTasksFormOpen(true)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTasksFormOpen(false)
  }, [])

  const handleInputChange = useCallback( event => {
    const { name, value } = event.target
    setInputValues( prev => ({ ...prev, [name]: value }))
  }, [])
  
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setIsAddTasksFormOpen(false)
        setInputValues('')
        setTodos([ ...todos, data ])
      }).catch(error => {
        errorToast(error.message)
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
          const updateTodos = todos.map(todo => todo.id === editTodoId ? { ...data } : { ...todo })
          setTodos(updateTodos)
          setEditTodoId('')
        }).catch(error => {
          switch(error.statusCode) {
            case 404:
              errorToast(
                '更新するToDoが見つかりませんでした。画面を更新して再度お試しください'
              )
              break

            default :
              errorToast(error.message)
              break
          }
        })
    },
    [editTodoId, inputValues]
  )

  const handleDeleteButtonClick = useCallback( id => {
    axios
      .delete(`http://localhost:3000/todo/${id}`)
      .then(data => {
        setTodos(data.data)
      }).catch(error => {
        switch(error.statusCode) {
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
  }, [todos])

  const handleToggleButtonClick = useCallback(id => {
    axios
      .patch(`http://localhost:3000/todo/${id}/completion-status`, {
        isCompleted: todos.find(todo => todo.id === id).isCompleted,
      })
      .then(({ data }) => {
        const updateTodos = todos.map(todo => {
          if(todo.id === data.id) {
            todo.isCompleted = !todo.isCompleted
          }
          return todo
        })
        setTodos(updateTodos)
      }).catch(error => {
        switch(error.statusCode) {
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
  },[todos])

  const handleEditButtonClick = useCallback( id => {
    setIsAddTasksFormOpen(false)
    setEditTodoId(id)

    const targetTodo = todos.find((todo) => todo.id === id)
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])



  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    }).catch(error => {
      errorToast(error.message)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          if(editTodoId === todo.id) {
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
              onToggleButtonClick={handleToggleButtonClick}
            />
          )
        })}
        <li>
          {isAddTasksFormOpen ? (
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
