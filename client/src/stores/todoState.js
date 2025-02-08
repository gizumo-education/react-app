import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: () => {
    return []
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: () => {
    return []
  },
})