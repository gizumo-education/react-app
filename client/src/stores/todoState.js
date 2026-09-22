import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({get}) => {
    const list = get(todoState)
    return list.filter((todo) => todo.isCompleted)
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({get}) => {
    const list = get(todoState)
    return list.filter((item) => item.isCompleted === false)
  },
})