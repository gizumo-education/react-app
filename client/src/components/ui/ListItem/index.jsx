import PropTypes from 'prop-types'
import styles from './index.module.css'
import { memo } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'

export const ListItem = memo(({ todo, onEditButtonClick, onDeleteButtonClick, onToggleButtonClick }) => {
  return (
    <li className={styles['list-item']}>
      {todo.isCompleted ? (//todoが完了している場合、チェックアイコンを表示する
        <Button
          buttonStyle='icon-only'
          className={styles['complete-button']}
          onClick={() => onToggleButtonClick(todo.id)}
        >
          <Icon
            iconName='check'//chekアイコン
            size='large'
            color='orange'
          />
        </Button>
      ) : (//todoが完了していない場合、空の丸アイコンを表示する
        <Button
          buttonStyle='icon-only'
          className={styles['complete-button']}
          onClick={() => onToggleButtonClick(todo.id)}
        >
          <Icon
            iconName='circle'//circleアイコン
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
            className={`${styles.title} ${todo.isCompleted ? styles['task-completed'] : ''
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
})

ListItem.displayName = 'ListItem'
ListItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isCompleted: PropTypes.bool.isRequired,
  }).isRequired,
  onToggleButtonClick: PropTypes.func.isRequired,
}
ListItem.defaultProps = {
  onEditButtonClick: () => { },
  onDeleteButtonClick: () => { },
}
