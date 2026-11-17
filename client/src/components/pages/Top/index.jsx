import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import styles from './index.module.css'

export const Top = () => {
  // todosをapiで取得してsetTodosでstateを更新する
  const [todos, setTodos] = useState([])
  // 編集したいtodoのidを取得して、適切にデータを更新する
  const [editTodoId, setEditTodoId] = useState('')

  // formの中のinputを取得してsetInputValuesで更新している
  // useCallbackは依存配列の値が更新されない限り同じ関数を使い続けるので
  // 今回は初回マウント時に設定された関数をそのまま使い続ける
  // この関数ではeventを引数として受け取り、nameとvalueを分割代入で受け取る
  // titleとdescriptionの棲み分けはここで行なっている。

  // 引数のprevはstateが保有している元のデータで
  // 更新があったvalueを上書きする処理がなされる
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  })
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  // trueなら入力フォームの中身を表示、falseなら"+タスクを追加"を表示
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)
  const handleAddTaskButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(true)
    setInputValues({ title: '', description: '' })
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('')
    setIsAddTaskFormOpen(false)
  }, [])

  // 対象のイベントを取得し、デフォルト動作をキャンセルする
  // 今回はFormに使われているので、送信時のリロード動作をキャンセルしている

  // 1.setTodosで既存の配列に更新データを追加
  // →{data}で取得データの分割代入をしてスプレッド構文で展開した以前のデータと配列を形成している
  // ここで注意すべき処理はsetTodosに配列でdataを渡すこと。mapでtodoを回しているため適切な処理が行なわれない
  // 2.setIsAddTaskFormOpenをfalseにして、タスク追加フォームを閉じる
  // 3.InputValuesを空にしたいので更新関数に空文字を渡す
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
        setTodos((prev) => [...prev, data])
        setIsAddTaskFormOpen(false)
        setInputValues({
          title: '',
          description: '',
        })
      })
    },
    [inputValues]
  )

  // 同時にタスク追加と編集のフォームが開かないようにしている
  // またfindで既存のtodos配列からidが一致する最初の項目を取り出して表示に使用している
  const handleEditButtonClick = useCallback(
    (id) => {
      setEditTodoId(id)
      setIsAddTaskFormOpen(false)
      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    },
    [todos]
  )

  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({ data }) => {
          setTodos((prev) => {
            return prev.map((todo) => {
              return todo.id === data.id ? data : todo
            })
          })
          setEditTodoId('')
          setIsAddTaskFormOpen(false)
        })
    },
    [editTodoId, inputValues]
  )

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`).then(({ data }) => {
      setTodos(data)
    })
  }, [])

  // 初回マウント時にapiをたたく
  useEffect(() => {
    axios.get('http://localhost:3000/todo').then(({ data }) => {
      setTodos(data)
    })
  }, [])

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {/* apiを叩いて返ってきた項目の1つをtodoとして */}
        {/* mapで既存配列に処理を加えて新たな配列を作成 */}
        {/* stateのidと取得配列のidの一致をみて編集機能の表示・非表示を切り替え */}
        {/* なのでeditTodoIdが空になると一致するidがないので、自動的にリスト一覧に戻る */}
        {todos.map((todo) => {
          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues}
                  editTodoId={editTodoId}
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  onSubmit={handleEditedTodoSubmit}
                />
              </li>
            )
          }
          return (
            <ListItem
              key={todo.id}
              todo={todo}
              onEditButtonClick={handleEditButtonClick}
              onDeleteButtonClick={handleDeleteButtonClick}
            />
          )
        })}
        {isAddTaskFormOpen ? (
          <Form
            // value：ToDoの追加フォームに入力された値を保持するstateを受け取る
            // onChange：ToDoの追加フォームに入力された値をstateに反映させる関数を受け取る
            // onCancelClick：ToDoの追加フォームを閉じる関数を受け取る
            // onSubmit：ToDoの追加フォームの送信処理を行う関数を受け取る
            value={inputValues}
            onChange={handleInputChange}
            onCancelClick={handleCancelButtonClick}
            onSubmit={handleCreateTodoSubmit}
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
      </ul>
    </Layout>
  )
}
