import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage as VeeErrorMessage, configure
} from 'vee-validate';
import {
  required, min, max, alpha_spaces as alphaSpaces, email, min_value as minValue,
  max_value as maxValue, confirmed
} from '@vee-validate/rules';

export default {
  install(app) {
    // Add the field components to each page

    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('VeeErrorMessage', VeeErrorMessage);

    // Register validation rules globally

    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('password_mismatch', confirmed);

    // Register custom error messages

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required`,
          min: `The field ${ctx.field} is too short`,
          max: `The field ${ctx.field} is too long`,
          alpha_spaces: `The field ${ctx.field} may only contain alfabetical characters and spaces`,
          email: `The field ${ctx.field} must be a valid email`,
          min_value: `The field ${ctx.field} is too low`,
          max_value: `The field ${ctx.field} is too high`,
          password_mismatch: 'The passwords do not match'
        };

        const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `The field ${ctx.field} is invalid`;
        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false
    });
  }
};
