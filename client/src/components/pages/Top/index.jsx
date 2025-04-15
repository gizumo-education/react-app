import { useCallback, useEffect, useState } from 'react';
import { axios } from '../../../utils/axiosConfig';
import { Layout } from '../../ui/Layout';
import { ListItem } from '../../ui/ListItem';
import { Button } from '../../ui/Button';
import { Form } from '../../ui/Form';
import { Icon } from '../../ui/Icon'

import styles from './index.module.css'
import { errorToast } from '../../../utils/errorToast';

export const Top = () => {
  /** TODO 一覧 */
  const [todos, setTodos] = useState([]);
  /** Form 入力値 */
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  });
  /** 追加フォーム開閉状態 */
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
  /** 編集中TodoID */
  const [editTodoId, setEditTodoId] = useState('');

  /** 追加ボタンが押下時処理 */
  const handleAddTaskButtonClick = useCallback(() => {
    setInputValues({ title: '', description: '' })
    setEditTodoId('');
    setIsAddTaskFormOpen(true);
  }, []);

  /** キャンセルボタン押下時処理 */
  const handleCancelButtonClick = useCallback(() => {
    setEditTodoId('');
    setIsAddTaskFormOpen(false);
  }, []);

  /** 入力フォーム入力値変更時処理 */
  const handleInputChange = useCallback(() => {
    const {name, value} = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value}))
  }, []);

  /** TODO新規追加ボタン押下時処理　*/
  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios.post('http://localhost:3000/todo', inputValues).then(({data}) => {
        setTodos([...todos, data]);
        setIsAddTaskFormOpen(false);
        setInputValues({
          name: '',
          description: '',
        })
      })
      .catch((error) => {
        errorToast(error.message);
      })
    },
    [inputValues]
  )

  /** 編集保存ボタンクリック時処理 */
  const handleEditedTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
      axios
        .patch(`http://localhost:3000/todo/${editTodoId}`, inputValues)
        .then(({data}) => {
          // 編集後の値を該当のTODOに反映
          const newTodos = todos.map((todo) => {
            if (todo.id === editTodoId) {
              return (
                {
                  ...todo,
                  title: data.title,
                  description: data.description,
                }
              )
            }
            return todo;
          })
          setTodos(newTodos);
          // 編集フォーム非表示
          setEditTodoId('');
        })
        .catch((error) => {
          switch (error.statusCode) {
            case 404:
              errorToast(
                '更新するToDo見つかりませんでした。画面を更新して再度お試しください。'
              )
              break;
            default:
              errorToast(error.message);
              break;
          }
        })
    },
    [editTodoId, inputValues]
  );

  /** 編集ボタンクリック時処理 */
  const handleEditButtonClick = useCallback(
    (id) => {
      setIsAddTaskFormOpen(false);
      setEditTodoId(id);
      // 初期値に編集前の値を挿入
      const targetTodo = todos.find((todo) => todo.id === id)
      setInputValues({
        title: targetTodo.title,
        description: targetTodo.description,
      })
    },
  [todos]);

  /** 削除ボタンクリック時処理 */
  const handleDeleteButtonClick = useCallback(
    (id) => {
      axios.delete(`http://localhost:3000/todo/${id}`)
        .then(({data}) => {
          setTodos(data);
        })
        .catch((error) => {
          switch(error.statusCode) {
            case 404:
              errorToast(
                '削除するToDoが見つかりませんでした。画面を更新して再度お試しください。'
              );
              break;
            default:
              errorToast(error.message)
              break;
          }
        })
    },
    []
  )

  /** 完了・未完了切り替えボタンクリック時処理 */
  const handleToggleButtonClick = useCallback(
    (id) => {
      axios
        .patch(`http://localhost:3000/todo/${id}/completion-status`, {
          isCompleted: todos.find((todo) => todo.id === id).isCompleted,
        })
        .then(({data}) => {
          const newTodos = todos.map((todo) => {
            return todo.id === id ? data : todo
          })
          setTodos(newTodos);
        })
        .catch((error) => {
          switch(error.statusCode) {
            case 404:
              errorToast(
                '完了・未完了を切り替えるToDoが見つかりませんでした。画面を更新して再度お試しください。'
              );
              break;
            default:
              errorToast(error.message)
              break;
          }
        })
    },
    [todos]
  )

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data);
      })
  }, []);

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
                  onChange={handleInputChange}
                  onCancelClick={handleCancelButtonClick}
                  editTodoId={editTodoId}
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
              onToggleButtonClick={handleToggleButtonClick}
            />
          )
        })}
        <li>
          {isAddTaskFormOpen ? (
              <Form
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
        </li>
      </ul>
    </Layout> 
  );
}
