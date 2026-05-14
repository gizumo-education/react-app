import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({ get }) => {
    return get(todoState).filter((todo) => (
      todo.isCompleted === true
    ))
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({ get }) => {
    return get(todoState).filter((todo) => (
      todo.isCompleted === false
    ))
  },
})