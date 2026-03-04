import React from 'react';
import './FormGroup.css';

function FormGroup({ label, type = 'text', value, onChange, placeholder = '', required = false, error = null, name = '', rows = null, children }) {
  // Si se proporciona `children`, los renderizamos (p. ej. un <select>)
  // y les aplicamos la clase `form-control` para mantener estilo.
  const renderChildren = () => {
    if (!children) return null;
    // Si es un elemento React, clonarlo para añadir clases sin romper props existentes
    if (React.isValidElement(children)) {
      const existingClass = children.props.className || '';
      return React.cloneElement(children, {
        className: `form-control ${existingClass}`.trim()
      });
    }
    return children;
  };

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}

      {children ? (
        renderChildren()
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 4}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
      )}

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default FormGroup;
