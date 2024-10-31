import {atom, selector } from 'recoil'

// ToDo一覧管理
export const todoState = atom({
  key: 'todoState', //Atomを一意に識別するための文字列
  default: [], //初期値を設定
})

// 完了済みToDo
export const completedTodoListState = selector({
  key: 'completedTodoListState',
  get: ({get}) => {
    const complete = get(todoState)
    return complete.filter(num => num.isCompleted === true)
  },
})

// 未完了ToDo
export const incompleteTodoListState = selector({
  key: 'incompleteTodoListState',
  get: ({get}) => {
    const incomplete = get(todoState)
    return incomplete.filter(num =>num.isCompleted === false)
  },
})