// components/ui/BottomNav/BottomNav.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {/* Categories / Dashboard */}
      <Link href="/tasks" className={`${styles.item} ${pathname === '/tasks' ? styles.active : ''}`}>
        <span>☰</span>
        <span>دسته بندی ها</span>
      </Link>

      {/* Task List Only View */}
      <Link href="/task-list" className={`${styles.item} ${pathname === '/task-list' ? styles.active : ''}`}>
        <span>☑</span>
        <span>کارها</span>
      </Link>
      
      {/* Add Task FAB Button */}
      <Link href="/add-task" className={styles.fab}>
        +
      </Link>

      {/* Calendar Page */}
      <Link href="/calendar" className={`${styles.item} ${pathname === '/calendar' ? styles.active : ''}`}>
        <span>📅</span>
        <span>تقویم</span>
      </Link>

      {/* Profile Page */}
      <Link href="/profile" className={`${styles.item} ${pathname === '/profile' ? styles.active : ''}`}>
        <span>👤</span>
        <span>جساب کاربری</span>
      </Link>
    </nav>
  );
};