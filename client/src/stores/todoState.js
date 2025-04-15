import { atom, selector } from "recoil";

export const todoState = atom({
  key: 'todoState',
  default: [],
});

export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({get}) => get(todoState).filter((todo) => {
      return todo.isCompleted
    })
});

export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({get}) => get(todoState).filter((todo) => !todo.isCompleted),
});