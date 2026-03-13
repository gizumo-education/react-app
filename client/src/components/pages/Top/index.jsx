import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import { errorToast } from '../../../utils/errorToast'

import styles from './index.module.css'

export const Top = () => {
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)
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
          setTodos((prev) => [...prev, data])//Section15 問題1で追加。
          setIsAddTaskFormOpen(false)//Section15 問題2で追加。
          setInputValues({           //Section15 問題3で追加。
            title: '',
            description: '',
          })
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
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setTodos((prev) =>             //Section16　問題1で追加
            prev.map((todo) => (todo.id === editTodoId ? data : todo))
          )
          setEditTodoId('')         //Section16　問題2で追加

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
    [setTodos, editTodoId, inputValues]
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
    axios.delete(`http://localhost:3000/todo/${id}`)  //Section17で追加
      .then(() => {
        setTodos((prev) =>
          prev.filter((todo) => todo.id !== id)
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
  }, [setTodos])

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {

          setTodos(                   //Section18で追加
            todos.map((todo) => (todo.id === id ? data : todo))
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
    [todos, setTodos]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data)    //Section14で追加
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
