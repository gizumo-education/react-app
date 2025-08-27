import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'
import { Form } from '../../ui/Form'
import { BiEdit } from 'react-icons/bi'

export const Top = () => {
  const [todos, setTodos] = useState([])

  const [editTodoId, setEditTodoId] = useState('')

  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
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
        // 1 追加したtodoを一覧に表示
        setTodos((prevTodos) => [...prevTodos, data])

        // 2 フォームを非表示
        setIsAddTaskFormOpen(false)

        // 3 入力欄を空にする
        setInputValues({ title: '', description: ''})
      })
      .catch((error) => {
        console.error('ToDoの追加に失敗しました', error)
      })
    },
    [inputValues]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({data}) => {
          // 1 更新されたtodoを一覧に表示
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === editTodoId ? data : todo
            )
          )

          // 2 編集フォームを非表示
          setEditTodoId('')
        }).catch((error) => {
          console.log('Todoの編集に失敗しました')
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

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({data}) => {
      // stateから該当todoを除外、反映
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id)) // このtodoのidが、削除対象のidと違う場合
    }).catch((error) => {
      console.log('削除できませんでした', error)
    })
  }, [])
  // prevState が「直前の todos 配列」

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
    }).catch((error) => {
      console.log('完了の切り替えに失敗しました', error)
    })
  }, [todos]
  )

    useEffect(() => {
      axios.get('http://localhost:3000/todo').then(({data}) => {
        // console.log(data)
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
