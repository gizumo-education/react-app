import PropTypes from 'prop-types'
import { memo } from 'react'

import { Header } from '../Header'
import { Sidebar } from '../Sidebar'

import styles from './index.module.css'

// memo()でコンポーネントを囲むと、親が再レンダリングされても
// 子のpropsが変わっていなければ再レンダリングをスキップできる。
// 今回ならmainのchildrenは再レンダリングされない
export const Layout = memo(({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
})

// displayNameを使用することでDevToolsでの発見が楽になるらしい
Layout.displayName = 'Layout'
// propTypesはReactコンポーネントが受け取るpropsの型や構造をチェックするための仕組み
Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
