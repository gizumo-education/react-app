import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoStore'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'
import { Form } from '../../ui/Form'
import { errorToast } from '../../../utils/errorToast'

export const Top = () => {
  const [inputValues, setInputValues] = useState({ title: '', description: '' })
  const [editTodoId, setEditTodoId] = useState('')

  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)

  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({title: '', description: ''})
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
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setTodos((prevTodos) => [...prevTodos, data])
        setIsAddTaskFormOpen(false)
        setInputValues({ title: '', description: ''})
      })
      .catch((error) => {
        errorToast(error.message)
      })
    },
    [setTodos ,inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({data}) => {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === editTodoId ? data : todo
            )
          )

          setEditTodoId('')
        })

      .catch((error) => {
        switch (error.statusCode) {
          case 404:
            errorToast(
              '更新するToDoが見つかりませんでした。画面を更新して再度お試し下さい。'
            )
            break
            default:
              errorToast(error.message)
              break
        }
      })
    },
    [setTodos ,editTodoId, inputValues]
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

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({data}) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
    })
    .catch((error) => {
      switch (error.statusCode) {
        case 404:
          errorToast(
            '削除するToDoが見つかりませんでした。画面を更新して再度お試し下さい。'
          )
          break
          default:
            errorToast(error.message)
            break
      }
    })
  }, [setTodos])

  const handleToggleButtonClick = useCallback((id) => {
    axios.patch(`http://localhost:3000/todo/${id}/completion-status`, {
      isCompleted: todos.find((todo) => todo.id === id).isCompleted,
    })
    .then(({data}) => {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? {...todo, isCompleted: data.isCompleted} : todo
      )
    )
    })
    .catch((error) => {
      switch (error.statusCode) {
        case 404:
          errorToast(
            '完了・未完了を切り替えるToDoが見つかりません。画面を更新して再度お試し下さい。'
          )
          break
          default:
            errorToast(error.message)
            break
      }
    })
  }, [todos, setTodos]
  )

    useEffect(() => {
      axios.get('http://localhost:3000/todo').then(({data}) => {
        setTodos(data)
      })
      .catch((error) => {
        errorToast(error.message)
      })
    }, [setTodos])

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
                onEditButtonClick={handleEditButtonClick}
                onDeleteButtonClick={handleDeleteButtonClick}
                onToggleButtonClick={handleToggleButtonClick}
              />
            )
          })}

          <li>
            {isAddTaskFormOpen ? (
              <Form value={inputValues}
                    onCancelClick={handleCancelButtonClick}
                    onChange={handleInputChange}
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
