import { useEffect, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, completedTodoListState } from '../../../stores/todoState'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'

import { errorToast } from '../../../utils/errorToast'

import styles from './index.module.css'

export const Completed = () => {
  const todos = useRecoilValue(completedTodoListState)
  const setTodos = useSetRecoilState(todoState)

  const handleToggleButtonClick = useCallback(
    (id) => {
      axios //部分的な更新をする(.patch)
        .patch(`http://localhost:3000/todo/${id}/completion-status`,{
          isCompleted: todos.find((todo) => todo.id === id).isCompleted, //todo.idとidが正しいものを見つけて返す
        })
        .then(({ data }) => { //上記情報のdataの中身だけ取り込んでいる。
          setTodos((prev) =>
            prev.map((todo) => (todo.id === data.id ? data : todo))
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
    axios
      .get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data)
        // console.log(data)
      })
      .catch((error) => {
        errorToast(error.message)
      })
  }, [setTodos])

  return (
    <Layout>
      <h1 className={styles.heading}>完了済み一覧</h1>
      {todos.length ? ( //todosの配列内に要素があったら：の前の処理を行う
        <ul className={styles.list}>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              todo={todo}
              onToggleButtonClick={handleToggleButtonClick} //チェックするやつ完了済みに編集と削除はつけていない
            />
          ))}
        </ul>
      ) : ( //todosの配列に何もなかった場合は以下のテキストを表示する。
        <p className={styles['no-todo']}>完了済みのToDoはありません。</p>
      )}
    </Layout>
  )
}