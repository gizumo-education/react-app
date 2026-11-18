import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '../Icon'
import styles from './index.module.css'

// NavLinkはリロードを挟まないaタグのようなもので
// 今どのページを表示しているか」に応じて見た目を変えられるLink。
// 今回ならURLが/completedに変わる
// ReactRouterがURLに対応するコンポーネントを探す
// Completedコンポーネントを表示する

const NaviList = [
  {
    id: 1,
    lineName: 'すべて',
    path: '/',
    iconName: 'todoList',
  },
  {
    id: 2,
    lineName: '完了済み',
    path: '/completed',
    iconName: 'completeList',
  },
]

export const Sidebar = memo(() => {
  return (
    <ul className={styles.sidebar}>
      <li className={['sidebar-list']}>
        <p className={styles.category}>ToDo</p>
        <ul className={styles.list}>
          {NaviList.map((list) => {
            return (
              <li className={styles['list-item']} key={list.id}>
                <NavLink
                  // to=""：遷移先のURL
                  // end：URLが最後まで一致した場合だけisActiveをtrueにする
                  // isActive：現在のURLと一致しているかを表すboolean
                  // className：一致していれば active クラスを付ける
                  to={list.path}
                  end
                  className={({ isActive }) => {
                    return isActive
                      ? `${styles['navi-item']} ${styles.active}`
                      : [styles['navi-item']]
                  }}
                >
                  {/* ① NavLinkが現在のURLと/todosを比較する
                      ② NavLinkが関数を呼び出す。その際、isActiveを含むオブジェクトを渡す
                      ③ ({ isActive })で値を受け取る（分割代入）
                      ④ isActiveを使ってcolorの適用を決める */}
                  {({ isActive }) => (
                    <>
                      <Icon
                        iconName={list.iconName}
                        color={isActive ? 'dark-blue' : 'indigo-blue'}
                        size='medium'
                        className={styles.icon}
                      />
                      <span className={styles.text}>{list.lineName}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </li>
    </ul>
  )
})

Sidebar.displayName = 'Sidebar'
