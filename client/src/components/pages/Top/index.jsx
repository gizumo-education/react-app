import { useEffect, useState, useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { axios } from '../../../utils/axiosConfig'
import { todoState, incompleteTodoListState } from '../../../stores/todoState'

import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'

import styles from './index.module.css'

import { errorToast } from '../../../utils/errorToast'

export const Top = () => {
  // ↓ useStateを削除し、Recoilの使用に変更
  const todos = useRecoilValue(incompleteTodoListState)
  const setTodos = useSetRecoilState(todoState)
  // ↑ useStateを削除し、Recoilの使用に変更
  const [editTodoId, setEditTodoId] = useState('') // 編集する際のID格納場。
  const [inputValues, setInputValues] = useState({ //追加フォームに入力したIDの格納場所
    title: '',
    description: '',
  })


  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)//ToDoの追加フォームの表示・非表示を切り替えるため。

  //タスク追加ボタンの処理内容
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' }) // 入力フォームを初期状態にリセット
    setEditTodoId('') //入力フォームを初期状態にリセット
    setIsAddTaskFormOpen(true) // タスク追加フォームを表示
  }, [])

  //タスクなどに文字を反映できるようにする処理。
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target; // イベントのターゲットから name と value を取得
    setInputValues((prev) => ({ ...prev, [name]: value })) // 状態を更新
  }, [])

  //キャンセルボタン用の処理
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('') //入力フォームを初期状態にリセット
    setIsAddTaskFormOpen(false) //開いているフォームを非表示
  }, [])

  //追加ボタンを完了した際の処理。
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()// フォームのデフォルト動作（ページリロードなど）を防止
      axios.post('http://localhost:3000/todo', inputValues) // サーバーにデータを送信
        .then(({ data }) => {
          setTodos((prevTodos) => {
            console.log('prevTodos', [...prevTodos, data]);
            return [...prevTodos, data]
          });// ToDoリストに追加した新しいアイテムを入れて更新

          setIsAddTaskFormOpen(false);// フォームを非表示にする
          setInputValues({ title: '', description: '' });// 入力欄をリセットする
        })
        .catch((error) => {
          errorToast(error.message)
        })
    },
    [setTodos, inputValues]
  );

  //編集ボタンを押した際の処理。
  const handleEditButtonClick = useCallback((id) => {
    setIsAddTaskFormOpen(false)//開いているフォームを非表示にする。
    setEditTodoId(id)// 編集対象のToDoのIDを設定する。
    const targetTodo = todos.find((todo) => todo.id === id)//todos配列の中から編集ボタンの押されたToDoアイテム（IDが一致するもの）を探す
    setInputValues({
      title: targetTodo.title,
      description: targetTodo.description,
    }) //見つけたtargetTodoのtitleとdescriptionを、フォームの入力欄に反映させることで編集フォームに表示する初期値に設定。
  },
    [todos] // 依存配列にtodosを追加
  )

  //編集ボタンを完了した際の処理。
  const handleEditedTodoSubmit = useCallback((event) => {
    event.preventDefault();// フォームのデフォルト動作（ページリロードなど）を防止
    axios.patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)//編集ボタンが押したIDのデータをサーバーに送信
      .then(({ data }) => {
        setTodos((prevTodos) => prevTodos.map(todo =>//編集中のToDoのIDのみ更新してそれ以外を維持
          todo.id === editTodoId ? { ...todo, ...data } : todo
        )); //編集フォームで書き換えられたIDへ変更して保存をする。
        setEditTodoId('');//編集対象のIDをリセット
        setInputValues({ title: '', description: '' });//入力欄の初期化
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
  }, [setTodos, editTodoId, inputValues]);


  //削除ボタンを押した際の処理。
  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`) //削除ボタンを押されたIDのデータをサーバーに送信
      .then(() => {
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id)); //削除ボタンの押されたIDだけを削除してToDoリストへ反映。
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

  // ToDoの完了・未完了切り替えボタンを押した際の処理。
    const handleToggleButtonClick = useCallback(
      (id) => {
        const targetTodo = todos.find((todo) => todo.id === id)//現在の完了状態を取得
        const updatedStatus = targetTodo.isCompleted; // 現在の完了状態を反映

        axios.patch(`http://localhost:3000/todo/${id}/completion-status`, { isCompleted: updatedStatus })
          .then(() => {
            // ローカルの状態を更新して反映
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo.id === id ? { ...todo, isCompleted: !updatedStatus } : todo
              )//該当のToDo　id === todo.idのisCompletedをupdatedStatusに反転して更新します。
            );
          })
          // APIの仕様上反転して反映されてしまうため、一度押した際の完了状態を受け取り反映して、その後にメソッド内で反映された完了状態をさらに反転して反映する。

        //処理が失敗した際の表示処理。
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
    },
    [todos, setTodos]
  );


  //初期表示データの表示処理。
  useEffect(() => {
    axios.get(`http://localhost:3000/todo`)
      .then(({ data }) => {
        console.log('data', data)
        setTodos(data); // ToDoリストを状態に設定
      })
      .catch((error) => {
        errorToast(error.message)
      })
  }, [setTodos]);

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => {
          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues}
                  editTodoId={editTodoId}//編集フォームのボタンの文言の設定
                  onChange={handleInputChange}//フォーム内の文言を設定
                  onCancelClick={handleCancelButtonClick}//キャンセルフォームのボタンの設定
                  onSubmit={handleEditedTodoSubmit}//追加フォームのボタンの文言を設定
                />
              </li>
            )
          }
          return (
            <ListItem
              key={todo.id}
              todo={todo}
              onEditButtonClick={handleEditButtonClick} //編集ボタンが押された際に呼ばれる関数
              onDeleteButtonClick={handleDeleteButtonClick}//削除ボタンが押された際に呼ばれる関数
              onToggleButtonClick={handleToggleButtonClick}//完了・未完了ボタンが押された際に呼ばれる関数
            />
          )
        })}

        <li>
          {isAddTaskFormOpen ? ( //trueの時にフォームを表示する。
            <Form
              value={inputValues}//フォームの入力フィールドの初期値
              onChange={handleInputChange}//入力値が変更された際に呼ばれる関数。
              onCancelClick={handleCancelButtonClick}//フォームをキャンセルするボタンがクリックされたときに呼ばれる関数
              onSubmit={handleCreateTodoSubmit}//フォームが送信されたときに呼ばれる関数
            />
          ) : (
            <Button
              buttonStyle='indigo-blue'
              onClick={handleAddTaskButtonClick}
              className={styles['add-task']}
            >
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