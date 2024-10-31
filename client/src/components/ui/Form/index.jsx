import PropTypes from 'prop-types'
import { memo } from 'react'
import { Button } from '../Button'

import styles from './index.module.css'

// ToDoの追加フォーム
export const Form = memo(({ value, editTodoId, onChange, onCancelClick, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles['input-field']}>
        {/* input要素:ToDoのタイトルを入力 */}
        <input
          type='text'
          name='title'
          placeholder='タスク名'
          autoFocus
          value={value.title}
          onChange={onChange}
          className={styles['input-title']}
        />
        {/* textarea:ToDoの説明を入力 */}
        <textarea
          name='description'
          placeholder='説明'
          value={value.description}
          onChange={onChange}
          className={styles['input-description']}
        />
      </div>
      <div className={styles['button-area']}>
        {/* Button:ToDoの追加フォームのキャンセルボタン */}
        <Button
          buttonStyle='cancel'
          className={styles['cancel-button']}
          onClick={onCancelClick}
        >
          キャンセル
        </Button>
        {/* Button:ToDoの追加フォームの送信ボタン */}
        <Button
          type='submit'
          disabled={!value.title}
          className={styles['submit-button']}
        >
          {editTodoId ? '保存' : 'タスクを追加'}
        </Button>
      </div>
    </form>
  )
})

Form.displayName = 'Form'
Form.propTypes = {
  // value:ToDo追加フォームに入力した値を保持するstateを受け取る
  // editTodoId:idがセットされている場合「保存」を,idがセットされていない場合は「タスクを追加」を表示
  // onChange:ToDo追加フォームに入力した値をstateに反映させる関数を受け取る
  // onCancelClick:ToDoの追加フォームを閉じる関数を受け取る
  // onSubmit:ToDoの追加フォームの送信処理を行う関数を受け取る
  value: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  editTodoId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
Form.defaultProps = {
  editTodoId: '',
}