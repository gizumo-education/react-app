import propTypes from 'prop-types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { memo } from 'react'

import styles from './index.module.css'

export const ListItem = memo(({ todo, onEditButtonClick }) => {
  return (
    <li className={styles['list-item']}>
      <div className={styles.task}>
        <div className={styles.title}>{todo.title}</div>
        {todo.description && (
          <div className={styles.description}>{todo.description}</div>
        )}
      </div>

      <div className={styles['task-action']}>
        <Button
          buttonStyle='icon-only'
          onClick={() => onEditButtonClick(todo.id)}
        >
          <Icon iconName='edit' color='indigo-blue' size='medium' />
        </Button>
      </div>
    </li>
  )
})

ListItem.displayName = 'ListItem'
ListItem.propTypes = {
  todo: propTypes.shape({
    id: propTypes.string.isRequired,
    title: propTypes.string.isRequired,
    description: propTypes.string,
    isCompleted: propTypes.bool.isRequired,
  }).isRequired,
  onEditButtonClick: propTypes.func.isRequired,
}
