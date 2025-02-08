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
import { toFormData } from 'axios'

export const Top = () => {
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)
  // 元々設定していた変数と更新関数にRecoilで使用できる内容を定義している
  console.log(todos)

  const [editTodoId, setEditTodoId] = useState('')

  const [inputValues, setInputValues] = useState({
        title: '',
    description: '',
  })
  console.log(inputValues)
  
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
    setInputValues("")
  }, [])

  const handleInputChange = useCallback((event) => {
    console.log(event)
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value}))
  }, [])

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        console.log(data)
        console.log(todos)
        setTodos([...todos, data])
        //更新はかかるが.mapの処理でエラーになる→データの形が配列じゃないからエラーになる→配列型にしてみたけどもともと入っていたものが消えちゃう
        setIsAddTaskFormOpen(false)
        //追加後フォームの値をfalseにすることでフォームが閉じるようにする
        setInputValues("")
      })
      .catch((error) => {
        errorToast(error.message)
      })
    },
    [setTodos, inputValues]
    // Atomの値が変更されたら更新する
  )
  
  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
      .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
      .then(({data}) => {
        console.log(data)
        setTodos(todos.map((todo) => {
            return editTodoId === todo.id ? data : todo}
          )
        )
        setEditTodoId(false)
      })

      .catch((error) => {
        switch (error.statusCode) {
          case 404:
            errorToast(
              '更新するTodoが見つかりませんでした。画面を更新して再度お試しください。'
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
    console.log(id)
    axios.delete(`http://localhost:3000/todo/${id}`).then(({ data }) => {
      console.log(data)
      setTodos(data)

      .catch((error) => {
        switch (error.statusCode) {
          case 404:
            errorToast(
              '削除するTodoが見つかりませんでした。画面を更新して再度お試しください。'
            )
            break
          default:
            errorToast(error.message)
            break
        }
      })
    })
  },
  [setTodos]
)

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
      .patch(`http://localhost:3000/todo/${id}/completion-status`,{
        isCompleted: todos.find((todo) => todo.id === id).isCompleted,
      })
      .then(({data}) => {
        console.log(data)
        setTodos(todos.map((todo) => {
          return id === todo.id ? data : todo}
          )
        )
      })

      .catch((error) => {
        switch (error.statusCode) {
          case 404:
            errorToast(
              '完了・未完了を切り替えるTodoが見つかりませんでした。画面を更新して再度お試しください。'
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
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
      setTodos(data)
    })
    .catch((error) => {
      errorToast(error.message)
    })
  },[setTodos])
  
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
