import { useState, useEffect } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  const [todos, setTodos] = useState([])

  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
    })
  }, [])

  const listItems = [
    { id: '1', title: 'React Hooks勉強', description: 'useState、useEffectについて', isCompleted: false },
    { id: '2', title: 'React Router勉強', description: 'useHistory、useLocationについて', isCompleted: false },
    { id: '3', title: 'Recoil勉強', description: 'atom、selectorについて', isCompleted: false },
  ]

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {listItems.map((todo) => {
          return <ListItem key={todo.id} todo={todo} />
        })}
        <li>
          {isAddTaskFormOpen ? (
            <Form value={inputValues} />
          ) : (
            <Button buttonStyle='indigo-blue' className={styles['add-task']}>
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
