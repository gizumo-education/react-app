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
  get: ({get}) => {
    const todos = get(todoState)
    // const result = todo.filter(todo => todo.iscompleted === false)
    console.log(todoState)
    return todos.filter(todo => !todo.isCompleted)
  }
})