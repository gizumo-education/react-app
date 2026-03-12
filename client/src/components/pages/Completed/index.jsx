import { Layout } from "../../ui/Layout";
import { completedTodoListState, todoState } from "../../../stores/todoState";
import { ListItem } from "../../ui/ListItem";

import styles from './index.module.css'

import { axios } from '../../../utils/axiosConfig'
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { errorToast } from "../../../utils/errorToast";

export const Completed = () => {
  const todos = useRecoilValue(completedTodoListState)
  const setTodos = useSetRecoilState(todoState)
  const handleToggleButtonClick = (id) => {
    axios
      .patch(`http://localhost:3000/todo/${id}/completion-status`, {
        isCompleted: todos.find((todo) => todo.id === id).isCompleted,
      })
      .then(({ data }) => {
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? data : todo))
        )
      })
      .catch((error) => {
        errorToast(error.message)
      })
  }


  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)    //Section14で追加
    })
      .catch((error) => {
        errorToast(error.message)
      })
  }, [setTodos])

  return (
    <Layout>
      <h1 className={styles.heading}>完了済み一覧</h1>
      <ul>
        {todos.length === 0 ? (
          <li>完了済みのToDoはありません。</li>
        ) : (
          todos.map((todo) => (
            <ListItem key={todo.id}
              todo={todo}
              onToggleButtonClick={handleToggleButtonClick}
            />
          ))
        )}
      </ul>
    </Layout>
  )
}