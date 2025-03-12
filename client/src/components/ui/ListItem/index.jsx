import PropTypes from 'prop-types'
import { memo } from 'react'

import { Button } from '../Button' // 追加
import { Icon } from '../Icon' // 追加


import styles from './index.module.css'

export const ListItem = memo(
  ({ todo, onEditButtonClick, onDeleteButtonClick, onToggleButtonClick }) => {
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
            // ↓ classNameに'task-completed'を追加
            className={`${styles.title} ${todo.isCompleted ? styles['task-completed'] : ''
              }`}
          >
            {todo.title}
          </div>
          {todo.description && (
            <div
              // ↓ classNameに'task-completed'を追加
              className={`${styles.description} ${todo.isCompleted ? styles['task-completed'] : ''
                }`}
            >
              {todo.description}
            </div>
          )}
        </div>

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
  }
)

ListItem.displayName = 'ListItem'
ListItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    isCompleted: PropTypes.bool,
  }).isRequired,
  onEditButtonClick: PropTypes.func,
  onDeleteButtonClick: PropTypes.func, // 追加
  onToggleButtonClick: PropTypes.func.isRequired,
}
ListItem.defaultProps = {
  onEditButtonClick: () => { },
  onDeleteButtonClick: () => { },
}
