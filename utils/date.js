// utils/date.js

// تبدیل Date به تاریخ میلادی برای استفاده در Database
export const formatDateForDB = (date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


// نمایش تاریخ شمسی برای کاربر
export const formatPersianDate = (date) => {
  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);
};


// فقط سال شمسی
export const getPersianYear = (date) => {
  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      year: "numeric",
    }
  ).format(date);
};


// فقط ماه شمسی
export const getPersianMonth = (date) => {
  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      month: "long",
    }
  ).format(date);
};


// فقط روز شمسی
export const getPersianDay = (date) => {
  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      day: "numeric",
    }
  ).format(date);
};