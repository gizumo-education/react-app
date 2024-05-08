import PropTypes from 'prop-types'
import { memo } from 'react'
import { Button } from '../Button'

import styles from './index.module.css'

export const Form = memo(({ value, editTodoId, onChange, onCancelClick, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles['input-field']}>
        <input //ToDoのタイトルを入力するinput要素
          type='text'
          name='title'
          placeholder='タスク名'
          autoFocus
          value={value.title}
          onChange={onChange}
          className={styles['input-title']}
        />
        <textarea //ToDoの説明を入力するtextarea要素
          name='description'
          placeholder='説明'
          value={value.description}
          onChange={onChange}
          className={styles['input-description']}
        />
      </div>
      <div className={styles['button-area']}>
        <Button //ToDoの追加フォームのキャンセルボタン
          buttonStyle='cancel'
          className={styles['cancel-button']}
          onClick={onCancelClick}
        >
          キャンセル
        </Button>
        <Button //ToDoの追加フォームの送信ボタン
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