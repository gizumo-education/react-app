
import { useState, useEffect } from 'react' // 追加
import { axios } from '../../../utils/axiosConfig' // 追加

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 追加

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]) // 追加

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(date);
      
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧
              // ↓ 追加
      <ul className={styles.list}>
        {todos.map((todo) => {
          return <ListItem key={todo.id} todo={todo} />
        })}
      </ul>
      // ↑ 追加
      </h1>
    </Layout>
  )
}
