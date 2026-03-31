import PropTypes from 'prop-types'
import { memo } from 'react'
import styles from './index.module.css'

export const Button = memo(({ className, buttonStyle, children, ...props }) => {
  return (
    <button
      type={props.type}
      className={`${styles.button} ${styles[`${buttonStyle}`]} ${className}`}
      {...props}
    >
      {children}
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
