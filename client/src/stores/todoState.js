import { atom, selector } from 'recoil'

export const todoState = atom({
  key: 'todoState',
  default: [],
})
console.log(todoState);


export const completedTodoListState = selector({ //完了したToDoリスト
  key: 'completedTodoListState',
  get: ({get}) => {
    const todos = get(todoState)
    return todos.filter(todo => todo.isCompleted);
  },
})

export const incompleteTodoListState = selector({ //不完全なToDoリスト
  key: 'incompleteTodoListState',
  get: ({get}) => {
    // console.log({get});
    
    const todos = get(todoState);
    // console.log(todos)
    return todos.filter(todo => !todo.isCompleted);
  },
})