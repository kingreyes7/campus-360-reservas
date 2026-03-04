import React, { useState } from 'react';
import './Modal.css';

function Modal({ isOpen, title, children, onClose, onConfirm = null, confirmText = 'Confirmar', cancelText = 'Cancelar' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {onConfirm && (
          <div className="modal-footer">
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>{cancelText}</button>
            <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>{confirmText}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
