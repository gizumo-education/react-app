import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})
// Atomはアプリ全体で共有する状態の単位です
// 今回ではtodoStateがその役割で配列が格納されどこからでも更新可能

// Selectorはatomから新しい情報を算出するもの
// 今回はTodo一覧から完了と未完了を分けるために使用している

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({ get }) => {
    const todos = get(todoState)
    return todos.filter((todo) => todo.isCompleted)
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({ get }) => {
    const todos = get(todoState)
    return todos.filter((todo) => !todo.isCompleted)
  },
})
