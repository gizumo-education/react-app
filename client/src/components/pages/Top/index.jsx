
import { useState, useEffect } from 'react' // useStateを追加
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 追加

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([]) // 追加

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
      setTodos(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      {/* // ↓ 追加 */}
      <ul className={styles.list}>
        {todos.map((data) => {
          return <ListItem key={data.id} todo={data} />
        })}
      </ul>
      {/* // ↑ 追加 */}
    </Layout>
  )
}