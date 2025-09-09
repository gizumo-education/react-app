import { useState, useEffect, useCallback } from 'react' // useStateを追加
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem' // 一覧表示追加

import { Button } from '../../ui/Button' // todo追加
import { Icon } from '../../ui/Icon' //todo追加
import { Form } from '../../ui/Form'//todo追加_表示非表示切り替え
import { errorToast } from '../../../utils/errorToast'//エラーハンドリング

import styles from './index.module.css'

export const Top = () => {
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })

  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  const [editTodoId, setEditTodoId] = useState('')




  const handleAddTaskButtonClick = useCallback(() => {//タスクの追加ボタン押下時、入力欄は空にして、開いていたら編集モードは終わらせて、追加フォームを開く
    setInputValues({ title: '', description: '' })
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
  }, [])

  const handleInputChange = useCallback((event) => {//どの項目（name）に何が入ったか取得、既存値を保ちつつ、その項目だけ上書、
    const { name, value } = event.target//event.target は「どの入力欄が変更されたか」を示すDOM要素。event.target.name と event.target.value で「どの入力欄か」「値」を取得
    setInputValues((prev) => ({ ...prev, [name]: value }))//setInputValues で状態更新
  }, [])

  const handleCreateTodoSubmit = useCallback(//追加フォーム送信時、ページ遷移をやめ、APIへ新規作成をPOST
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {

        setTodos((prev) => [...prev, data])//既存配列をコピー＋末尾に追加、追加フォームを閉じる、入力欄を空にする
        setIsAddTaskFormOpen(false)
        setInputValues({
          title: '',
          description: '',
        })

        console.log(data)
      })

        .catch((error) => {
          errorToast(error.message)
        })

    },
    [setTodos,inputValues]//入力値が変わるたびに最新の関数に作り直す
  )






  const handleEditButtonClick = useCallback((id) => {//編集ボタンで呼び出し、新規追加は閉じ、このidを編集中にする、
    setIsAddTaskFormOpen(false)
    setEditTodoId(id)
    const targetTodo = todos.find((todo) => todo.id === id)//idで対象todoを検索
    setInputValues({//今入っている値をフォームに表示する
      title: targetTodo.title,
      description: targetTodo.description,
    })
  }, [todos])//todosに依存、一覧が変わったときに検索結果も変わるため

  const handleEditedTodoSubmit = useCallback(//編集フォームの送信、画面推移をキャンセル
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)// ← APIへ更新をパッチ
        //.patch(`http://localhost:3000/todo/editTodoId`, inputValues) エラー起こしたい時用
        .then(({ data }) => {
          // ★★★追加↓編集したToDoを一覧に反映
          setTodos((prev) =>
            prev.map((todo) =>
              // #### ? #### : ####
              todo.id === editTodoId ? { ...todo, ...data } : todo
                // if (todo.id === editTodoId) {
                //   return { ...todo, ...data };
                // } else {
                //   return todo;
                // }
                //idが一致したもののみ差し替え
            )
          )
          // ★★★追加↓編集フォームを閉じる・ListItem表示に戻る
          setEditTodoId('')

          console.log('編集成功:', data)
        })

        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '更新するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break

            default:
              errorToast(error.message)
              break
          }
        })
    },
    [setTodos,editTodoId, inputValues]
  )






  const handleDeleteButtonClick = useCallback((id) => {//★★★↓todoの削除追加部分
    axios
      .delete(`http://localhost:3000/todo/${id}`)//apiに削除リクエスト/サーバーの話
      .then((res) => {
        setTodos(res.data)
        // setTodos((prev) => prev.filter((todo) => todo.id !== id))//対象ID以外を残す・画面表示から消す
        console.log(`削除成功: ID=${id}`)
      })
      .catch((error) => {
        switch (error.statusCode) {
          case 404:
            errorToast(
              '削除するToDoが見つかりませんでした。画面を更新して再度お試しください。'
            )
            break

          default:
            errorToast(error.message)
            break
        }
      })
  }, [setTodos])







  const handleToggleButtonClick = useCallback(//ListItemの完了ボタンから呼ばれる
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {//完了状態を更新・パッチは一部を更新するときに使う .getや.putの仲間
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,//現在の状態を送っている
        })
        .then(({ data }) => {//★★★ToDoの状態変更（完了・未完了の切り替え）の追記/返ってきたisCompletedを採用
          setTodos((prev) =>
            prev.map((todo) =>
              todo.id === id ? { ...todo, isCompleted: data.isCompleted } : todo//該当要素だけisCompletedを更新　data.isCompletedが返ってきた状態
            )
          )
          console.log(data)
        })

        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              )
              break

            default:
              errorToast(error.message)
              break
          }
        })
    },
    [todos, setTodos]
  )








  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])



  //一覧表示はuseEffectのToDoの一覧を取得するand,Layoutの取得したToDoの一覧を表示する
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data) //★★★★★←追加
      console.log(data)
    })

      .catch((error) => {
        errorToast(error.message)
      })
  }, [setTodos])

  //編集中のid(editTodoID)とidが一致したら編集フォーム、それ以外は普通のListItem表示
  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues} //既存値がセット済み
                  editTodoId={editTodoId} //ラベル切り替え（保存/追加）に使う
                  onChange={handleInputChange} //入力の都度、親のstateを更新
                  onCancelClick={handleCancelButtonClick} //キャンセルで編集モード解除
                  onSubmit={handleEditedTodoSubmit} //送信でPATCH
                />
              </li>
            )
          }
          return <ListItem key={todo.id} todo={todo} onEditButtonClick={handleEditButtonClick} onDeleteButtonClick={handleDeleteButtonClick} onToggleButtonClick={handleToggleButtonClick} />
        })}
        {/* ここまで一覧表示・ここからタスクの追加ボタン */}

        <li>
          {isAddTaskFormOpen ? (//trueなら入力フォーム、falseならタスクの追加ボタン
            <Form value={inputValues} onChange={handleInputChange} onCancelClick={handleCancelButtonClick} onSubmit={handleCreateTodoSubmit} />
          ) : (
            <Button buttonStyle='indigo-blue' onClick={handleAddTaskButtonClick} className={styles['add-task']}>
              <Icon
                iconName='plus'
                color='orange'
                size='medium'
                className={styles['plus-icon']}
              />
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  )
}