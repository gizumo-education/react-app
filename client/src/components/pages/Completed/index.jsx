import { useCallback, useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { errorToast } from '../../../utils/errorToast'
import { todoState, completedTodoListState } from '../../../stores/todoState'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'

import styles from './index.module.css'

export const Completed = () => {
  const todos = useRecoilValue(completedTodoListState)
  const setTodos = useSetRecoilState(todoState)

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({ data }) => {
          setTodos((prevDatas) =>
            prevDatas.map((prevData) =>
              prevData.id === data.id ? data : prevData
            )
          )
        })
        .catch((e) => {
          switch (e.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break
            default:
              errorToast(e.message)
              break
          }
        })
    },
    [todos, setTodos]
  )

  useEffect(() => {
      axios
        .get('http://localhost:3000/todo')
        .then(({ data }) => {
          setTodos(data.filter((todo) => todo.isCompleted))
        })
        .catch((e) => {
          errorToast(e.message)
        })
    }, [setTodos])

  return (
    <Layout>
      <h1 className={styles.heading}>完了済み一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          return (
            <ListItem
              key={todo.id}
              todo={todo}
              onToggleButtonClick={handleToggleButtonClick}
              
            />
          )
        })}
      </ul>
    </Layout>
  )
}
