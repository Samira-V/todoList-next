import React from 'react';
import styles from './Input.module.css';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`${styles.container} ${error ? styles.hasError : ''}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={`${styles.input} ${className}`} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};