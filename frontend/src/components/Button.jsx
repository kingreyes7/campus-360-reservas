import React from 'react';
import './Button.css';

function Button({
  children,
  type = 'button',
  onClick = null,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = ''
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size} ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
