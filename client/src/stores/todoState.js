import { atom, selector } from 'recoil'



export const todoState = atom({
  key: 'todoState',
  default: [],
})

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get:({get}) => {
    const todoStates= get(todoState)
    return todoStates.filter((todo) => todo.isCompleted)
  },
})

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({get}) => {
    const todosState= get(todoState)
    return todosState.filter((todo) => !todo.isCompleted)
  },

})



