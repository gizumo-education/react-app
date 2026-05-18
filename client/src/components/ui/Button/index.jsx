import PropTypes from 'prop-types'
import styles from './index.module.css'
import { memo } from 'react'

export const Button = memo(({ className, buttonStyle, children, ...props }) => {
  return (
    <button
      type={props.type}
      className={`${styles.button} ${styles[`${buttonStyle}`]} ${className}`}
      {...props}
    >
      {children} {/*Iconコンポーネントや、タスク追加のテキストなどが入る*/}
    </button>
  )
})

Button.displayName = 'Button'
Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  buttonStyle: PropTypes.oneOf([
    'orange',
    'cancel',
    'indigo-blue',
    'icon-only',
  ]),
}

Button.defaultProps = {
  type: 'button',
  className: '',
  buttonStyle: 'orange',
}
