import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: []
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({get}) => {
    const completed = get(todoState);
    return completed.filter((todo) => todo.isCompleted)
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({get}) => {
    const incomplete = get(todoState);
    return incomplete.filter((todo) => !todo.isCompleted)
  },
})