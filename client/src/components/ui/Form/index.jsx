import PropTypes from 'prop-types'
import { memo } from 'react'
import { Button } from '../Button'

import styles from './index.module.css'

export const Form = memo(({ value, editTodoId, onChange, onCancelClick, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles['input-field']}>
        <input
          type='text'
          name='title'
          placeholder='タスク名'
          autoFocus
          value={value.title}
          onChange={onChange}
          className={styles['input-title']}
        />
        <textarea
          name='description'
          placeholder='説明'
          value={value.description}
          onChange={onChange}
          className={styles['input-description']}
        />
      </div>
      <div className={styles['button-area']}>
        <Button
          buttonStyle='cancel'
          className={styles['cancel-button']}
          onClick={onCancelClick}
        >
          キャンセル
        </Button>
        <Button
          type='submit'
          disabled={!value.title}
          className={styles['submit-button']}
        >
           {editTodoId ? '保存' : 'タスクを追加'}
           {/*条件 ? trueのとき : falseのとき*/}
        </Button>
      </div>
    </form>
  )
})

Form.displayName = 'Form'
Form.propTypes = {
  value: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  editTodoId: PropTypes.string,
  onChange: PropTypes.func.isRequired,//ToDoの追加フォームに入力された値をstateに反映させる関数を受け取る
  onCancelClick: PropTypes.func.isRequired,//キャンセルボタンがクリックされたときの処理を行う関数を受け取る
  onSubmit: PropTypes.func.isRequired,//フォームが送信されたときの処理を行う関数を受け取る
}

Form.defaultProps = {
      editTodoId: '',
    }