import { useRecoilValue, useSetRecoilState } from "recoil";
import { completedTodoListState, todoState } from "../../../stores/todoState";
import { Layout } from "../../ui/Layout"
import { useCallback, useEffect } from "react";
import axios from "axios";
import { errorToast } from "../../../utils/errorToast";

import styles from './index.module.css'
import { ListItem } from "../../ui/ListItem";

export const Completed = () => {
  /** TODO 一覧 */
  const todos = useRecoilValue(completedTodoListState);
  const setTodos = useSetRecoilState(todoState);

  /** 完了・未完了切り替えボタンクリック時処理 */
  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({data}) => {
          setTodos((prev) => 
            prev.map((todo) => (todo.id === data.id ? data : todo))
          );
        })
        .catch((error) => {
          switch(error.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              );
              break;
            default:
              errorToast(error.message)
              break;
          }
        })
    },
    [todos, setTodos]
  )
  
  /** 初期表示処理 */
  useEffect(() => {
    axios
      .get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data);
      })
      .catch((error) => {
        errorToast(error.message);
      })
  }, [setTodos])

  return (
    <Layout>
      <h1 className={StyleSheet.heading}>完了済み一覧</h1>
      {todos.length ? (
        <ul className={styles.list}>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              todo={todo}
              onToggleButtonClick={handleToggleButtonClick}
            />
          ))}
        </ul>
      ) : (
        <p className={styles['no-todo']}>完了済みのToDoはありません。</p>
      )}
    </Layout>
  )
}