import React from 'react';
import styles from './MobileFrame.module.css';

export const MobileFrame = ({ children }) => {
  return (
    <div className={styles.frame}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};