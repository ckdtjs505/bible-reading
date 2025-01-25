export const setLocalStorage = (key, value) => {
  if (!window.localStorage) {
    return false;
  }
  localStorage.setItem(key, JSON.stringify(value));
  return true;
};

export const setLocalStorage = (key) => {
  if (!window.localStorage) {
  }
  return JSON.parse(localStorage.getItem(key));
};
