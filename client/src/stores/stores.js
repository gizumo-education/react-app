
import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({ get }) => {

  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({ get }) => {
    // return get
  const todos = get(todoState)
  return (
    todos.filter((todo) => 
    todo.isCompleted ? '' : todo)
  )
    // const todos = get(todoState.filter((todo) => ))
  },
})