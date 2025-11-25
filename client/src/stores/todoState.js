import { atom, selector } from 'recoil'

//atom関数
export const todoState = atom({
  key: 'todoState',
  default: [],
})


//完了済みToDo一覧を返す
//練習問題2
export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({ get }) => {
    const completeTodo = get(todoState)
    return completeTodo.filter(todo => todo.isCompleted)
  },
})

//未完了のToDo一覧を返す
//練習問題１
export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({ get }) => {
    const todos = get(todoState)
    return todos.filter(todo => !todo.isCompleted)
  },
})