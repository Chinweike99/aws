import validator from 'validator';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

export const validateTodoTitle = (title: string): boolean => {
  return title.length >= 1 && title.length <= 255;
};