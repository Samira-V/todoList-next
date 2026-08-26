// utils/category.js

export const CATEGORY_CONFIG = {
  work: {
    label: 'کاری',
    color: '#3b82f6',
  },

  meet: {
    label: 'ملاقات',
    color: '#f97316',
  },

  personal: {
    label: 'شخصی',
    color: '#ec4899',
  },

  home: {
    label: 'خانه',
    color: '#22c55e',
  },
};


// گرفتن نام فارسی Category
export function getCategoryLabel(category) {
  return (
    CATEGORY_CONFIG[category]?.label ||
    'سایر'
  );
}


// گرفتن رنگ Category
export function getCategoryColor(category) {
  return (
    CATEGORY_CONFIG[category]?.color ||
    '#64748b'
  );
}


// بررسی معتبر بودن Category
export function isValidCategory(category) {
  return Object.prototype.hasOwnProperty.call(
    CATEGORY_CONFIG,
    category
  );
}