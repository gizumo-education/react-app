import { useState, useEffect, useCallback } from 'react'
import { axios } from '../../../utils/axiosConfig'
import { Layout } from '../../ui/Layout'
import { ListItem } from '../../ui/ListItem'
import { Button } from '../../ui/Button'
import { Icon } from '../../ui/Icon'
import { Form } from '../../ui/Form'
import styles from './index.module.css'

export const Top = () => {
  // todosをapiで取得してsetTodosでstateを更新
  const [todos, setTodos] = useState([])

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
    setIsAddTaskFormOpen(true)
  }, [])
  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false)
  }, [])

  // 対象のイベントを取得し、デフォルト動作をキャンセルする
  // 今回はFormに使われているので、送信時のリロード動作をキャンセルしている

  // 1.setTodosで既存の配列に更新データを追加
  // →{data}で取得データの分割代入をしてスプレッド構文で展開した以前のデータと配列を形成している
  // ここで注意すべき処理はsetTodosに配列でdataを渡すこと。mapでtodoを回しているため適切な処理が行なわれない
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
        {todos.map((todo) => {
          return <ListItem key={todo.id} todo={todo} />
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