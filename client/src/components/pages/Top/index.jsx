import { useEffect, useState, useCallback } from 'react' // useStateを追加
import { axios } from '../../../utils/axiosConfig' // 追加

import { Layout } from '../../ui/Layout'
import {ListItem} from '../../ui/ListItem'
import {Button} from '../../ui/Button'//追加
import {Icon} from '../../ui/Icon'//追加
import {Form} from '../../ui/Form'

import styles from './index.module.css'

export const Top = () => {
  const [todos,setTodos]= useState([])//追加
  const [editTodoId, setEditTodoId] = useState('') // 編集する際のID格納場。
  const [inputValues, setInputValues] = useState({ //追加フォーム用
    title: '',
    description: '',
  })
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false)//ToDoの追加フォームの表示・非表示を切り替えるため
  
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' }) // 追加
    setEditTodoId('') // 追加
    setIsAddTaskFormOpen(true)
  }, []) //タスクを追加ボタンを押した後の処理内容

  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('') // 追加
    setIsAddTaskFormOpen(false)
  }, [])//キャンセルボタン用の処理

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }, [])//タスクなどに文字を反映できるようにする処理。

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault()
      axios.post('http://localhost:3000/todo', inputValues)
        .then(({ data }) => {
          // ToDoリストを新しいアイテムで更新
          setTodos((prevTodos) => [...prevTodos, data]);
          // フォームを非表示にする
          setIsAddTaskFormOpen(false);
          // 入力欄をリセットする
          setInputValues({ title: '', description: '' });
        })
        .catch((error) => {
          console.error('ToDoの作成に失敗しました:', error);
        });
    },
    [inputValues]
  );

  const handleEditedTodoSubmit = useCallback((event) => {
    event.preventDefault();
    axios.patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
      .then(({ data }) => {
        setTodos((prevTodos) => prevTodos.map(todo =>
          todo.id === editTodoId ? { ...todo, ...data } : todo
        )); //編集フォームで書き換えられたIDへ変更して保存をする。
        setEditTodoId('');
        setInputValues({ title: '', description: '' });
      })
      .catch((error) => {
        console.error('ToDoの編集に失敗しました:', error);
      });
  }, [editTodoId, inputValues]);

  const handleEditButtonClick = useCallback((id) => {
      setIsAddTaskFormOpen(false)
      setEditTodoId(id)
      // ↓ 追加
      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
      // ↑ 追加
    },
    [todos] // 依存配列にtodosを追加
  )

  const handleDeleteButtonClick = useCallback((id) => {
    axios.delete(`http://localhost:3000/todo/${id}`)
    .then(() => {
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    })
    .catch((error) => {
      console.error('ToDoの削除に失敗しました:', error);
    });
  }, [])


  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data); // ToDoリストを状態に設定
      })
      .catch((error) => {
        console.error('ToDoの取得に失敗しました:', error);
      });
  }, []);

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
    {/* // ↓ 追加 */}
      <ul className={styles.list}>
        {todos.map((todo) => {
          //もしエディットIDがtodoIDと同じだったときに実行する処理。
          if (editTodoId === todo.id) {
            return (
              <li key={todo.id}>
                <Form
                  value={inputValues}
                  editTodoId={editTodoId} // 追加
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
          onEditButtonClick={handleEditButtonClick} //編集ボタンの指定先
          onDeleteButtonClick={() => handleDeleteButtonClick(todo.id)} //削除ボタン押した際の指定先
          />
          )
        })}

        <li>
        {isAddTaskFormOpen ? (
          <Form
          value={inputValues}
          onChange={handleInputChange} // onChangeを追加
          onCancelClick={handleCancelButtonClick}
          onSubmit={handleCreateTodoSubmit}/> // 確定された後の内容の表記
        ) : (
          <Button
          buttonStyle='indigo-blue'
          onClick={handleAddTaskButtonClick} // ボタンを押した時の動作
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
      {/* ↑ 追加 */}
    </Layout>
  )
};