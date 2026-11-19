import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})

// { get }でRecoilからget関数を取得して実行することでAtomやSelectorのstate(現在の値)を取得している
// 現在のAtomを取得して処理を加える
export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({ get }) => {
    const todos = get(todoState)
    return todos.filter((todo) => {
      return todo.isCompleted
    })
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({ get }) => {
    const todos = get(todoState)
    return todos.filter((todo) => !todo.isCompleted)
  },
})
