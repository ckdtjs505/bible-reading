export const setLocalStorage = (key: string, value: unknown): boolean => {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error setting localStorage:", error);
    return false;
  }
};

export const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  try {
    const item = localStorage.getItem(key);
    if (item === "true" || item === "false") {
      return (item === "true") as T;
    }
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error("Error parsing localStorage item:", error);
    return null;
  }
};
