// import { useState,useEffect,useCallback } from 'react' // useStateを追加
// import { axios } from '../../../utils/axiosConfig' // 追加

// import { Layout } from '../../ui/Layout'
// import { ListItem } from '../../ui/ListItem' // 追加

// import { Button } from '../../ui/Button' // 追加
// import { Icon } from '../../ui/Icon' // 追加
// import { Form } from '../../ui/Form' // 追加

// import styles from './index.module.css'

// export const Top = () => {
//   const [inputValues, setInputValues] = useState({
//     title: '',
//     description: '',
//   })
//   const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false) // 追加
//   const [todos, setTodos] = useState([]) // 追加
//   const handleAddTaskButtonClick = useCallback(() => {
//     setIsAddTaskFormOpen(true)
//   }, [])
//   const handleCancelButtonClick = useCallback(() => {
//     setIsAddTaskFormOpen(false)
//   }, [])
//   const handleInputChange = useCallback((event) => {
//     const { name, value } = event.target
//     setInputValues((prev) => ({ ...prev, [name]: value }))
//   }, [])
//   const handleCreateTodoSubmit = useCallback(
//     (event) => {
//       event.preventDefault()
//       axios.post('http://localhost:3000/todo', inputValues).then(({ data }) => {
//         console.log(data)
//       })
//     },
//     [inputValues]
//   )
//   useEffect(() => {
//     axios.get('http://localhost:3000/todo').then(({ data }) => {
//       console.log(data)
//       setTodos(data); // データをtodosに設定
//     })
//     .catch((error) => {
//       console.error('データの取得に失敗しました:', error);
//     })
//   }, [])

//   return (
//     <Layout>
//       <h1 className={styles.heading}>ToDo一覧</h1>
//       <ul className={styles.list}>
//         {todos.map((todo) => {
//           return <ListItem key={todo.id} todo={todo} />
//         })}
//          {/* ↓ 追加 */}
//       <li>
//       {isAddTaskFormOpen ? (
//   <Form
//     value={inputValues}
//     onChange={handleInputChange}
//     onCancelClick={handleCancelButtonClick}
//     onSubmit={handleCreateTodoSubmit} // onSubmitを追加
//   />
//         ) : (
//           <Button
//           buttonStyle='indigo-blue'
//           onClick={handleAddTaskButtonClick} //追加
//           className={styles['add-task']}>
//             <Icon
//               iconName='plus'
//               color='orange'
//               size='medium'
//               className={styles['plus-icon']}
//             />
//             タスクを追加
//           </Button>
//         )}
//       </li>
//       </ul>
//     </Layout>
//   )
// }

import { useState, useEffect, useCallback } from 'react';
import { axios } from '../../../utils/axiosConfig';

import { Layout } from '../../ui/Layout';
import { ListItem } from '../../ui/ListItem';
import { Button } from '../../ui/Button';
import { Icon } from '../../ui/Icon';
import { Form } from '../../ui/Form';

import styles from './index.module.css';

export const Top = () => {
  const [inputValues, setInputValues] = useState({
    title: '',
    description: '',
  });
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
  const [todos, setTodos] = useState([]);

  const handleAddTaskButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(true);
  }, []);

  const handleCancelButtonClick = useCallback(() => {
    setIsAddTaskFormOpen(false);
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCreateTodoSubmit = useCallback(
    (event) => {
      event.preventDefault();
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

  useEffect(() => {
    axios.get('http://localhost:3000/todo')
      .then(({ data }) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error('データの取得に失敗しました:', error);
      });
  }, []);

  return (
    <Layout>
      <h1 className={styles.heading}>ToDo一覧</h1>
      <ul className={styles.list}>
        {todos.map((todo) => (
          <ListItem key={todo.id} todo={todo} />
        ))}
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
              buttonStyle="indigo-blue"
              onClick={handleAddTaskButtonClick}
              className={styles['add-task']}
            >
              <Icon
                iconName="plus"
                color="orange"
                size="medium"
                className={styles['plus-icon']}
              />
              タスクを追加
            </Button>
          )}
        </li>
      </ul>
    </Layout>
  );
};
