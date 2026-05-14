import { useRecoilValue } from 'recoil'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { todoState, completedTodoListState } from '../../../stores/todoState'

import styles from './index.module.css'

export const Completed = () => {
  const todos = useRecoilValue(completedTodoListState)

  return (
    <Layout>
      <h1 className={styles.heading}>完了済み一覧</h1>
      <ul className={styles.list}>

        {todos === 0 ? (
          <p>完了済みのTodoはありません</p>
        ):(
          todos.map((todo) => {
            return (
              <ListItem
                key={todo.id}
                todo={todo}
              />
            )}
          )
        )}
      </ul>
    </Layout>
  )
}