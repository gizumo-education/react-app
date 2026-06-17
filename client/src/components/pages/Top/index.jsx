import { useEffect } from 'react'
import { axios } from '../../../utils/axiosConfig'

import { Layout } from '../../ui/Layout'

import styles from './index.module.css'

export const Top = () => {
  // レンダリング時にToDo一覧を取得
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      console.log(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
    </Layout>
  )
}
