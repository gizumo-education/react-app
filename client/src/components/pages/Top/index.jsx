import { useEffect, useState } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])
  
  // レンダリング時にToDo一覧を取得
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      // console.log(data)
      setTodos(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          return <ListItem key={todo.id} todo={todo} />
        })}
        <li>
        <Button buttonStyle='indigo-blue' className={styles['add-task']}>
          <Icon
            iconName='plus'
            color='orange'
            size='medium'
            className={styles['plus-icon']}
          />
          タスクを追加
        </Button>
      </li>
      </ul>
    </Layout>
  )
}
