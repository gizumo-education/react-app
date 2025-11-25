import PropTypes from 'prop-types'
import { memo } from 'react'

import { Button } from '../Button'
import { Icon } from '../Icon'

import styles from './index.module.css'

export const ListItem = memo (({ todo,  onEditButtonClick, onDeleteButtonClick, onToggleButtonClick}) => {
  return (
    <li className={styles['list-item']}>
         {todo.isCompleted ? (
          <Button
            buttonStyle='icon-only'
            className={styles['complete-button']}
            onClick={() => onToggleButtonClick(todo.id)}
          >
            <Icon iconName='check' size='large' color='orange' />
          </Button>
        ) : (
          <Button
            buttonStyle='icon-only'
            className={styles['complete-button']}
            onClick={() => onToggleButtonClick(todo.id)}
          >
            <Icon
              iconName='circle'
              size='medium'
              className={styles['circle-icon']}
            />
          </Button>
        )}
      <div className={styles.task}>
        <div 
          className={`${styles.title} ${todo.isCompleted ? styles['task-completed'] : ''
          }`}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div 
            className={`${styles.description} ${todo.isCompleted ? styles['task-completed'] : ''
            }`}
          >
            {todo.description}
          </div>
        )}
      </div>
        {/*  完了済みの場合は編集と削除を非表示 */}
      <div className={styles['task-action']}>
      {!todo.isCompleted && (
          <>
            <Button
              buttonStyle='icon-only'
              onClick={() => onEditButtonClick(todo.id)}
            >
              <Icon iconName='edit' color='indigo-blue' size='medium' />
            </Button>
            <Button
              buttonStyle='icon-only'
              onClick={() => onDeleteButtonClick(todo.id)}
            >
              <Icon iconName='trash' color='indigo-blue' size='medium' />
            </Button>
          </>
        )}
    </div>
    </li>
  )
})

ListItem.displayName = 'ListItem'
ListItem.prototype = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description:PropTypes.string,
    isCompleted: PropTypes.bool.isRequired,
  }).isRequired,
  onEditButtonClick: PropTypes.func,
  onDeleteButtonClick: PropTypes.func,
  onToggleButtonClick: PropTypes.func.isRequired,
}

ListItem.defaultProps = {
  onEditButtonClick: () => {},
  onDeleteButtonClick: () => {},
}