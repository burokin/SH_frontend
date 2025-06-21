import type { Rule } from 'antd/lib/form';

interface IFormInputRule {
  [ruleName: string]: Rule;
}

// TODO: Вынести в компонент формы
export const FormInputRule: IFormInputRule = {
  USERNAME_NOT_EMPTY: { required: true, message: 'Введите имя!', whitespace: false },
  PASSWORD_NOT_EMPTY: { required: true, message: 'Введите пароль!' },
  EMAIL_NOT_EMPTY: {
    required: true,
    message: 'Ввведите E-mail!',
  },
  EMAIL_TYPE_VALID: {
    type: 'email',
    message: 'Некорректный E-mail!',
  },
  PASSWORD_MATCHED: ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Пароли не совпадают!'));
    },
  }),
};
