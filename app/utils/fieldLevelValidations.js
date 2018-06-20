import { isAlphanumeric, isEmpty, isEmail } from 'validator';

export const required = (value) => (value ? undefined : 'Required');

export const maxLength = (max) => (v) =>
  (v && v.length > max ? 'Must have $ {max} characters or less' : undefined);

export const minLength = (min) => (v) =>
  (v && v.length < min ? 'Must have $ {min} characters or more' : undefined);

export const number = (v) => (v && isNaN(Number(v)) ? 'Must be a number' : undefined);

export const minv = (min) => (v) =>
  (v && v < min ? 'Must be greater than or equal to $ {min}' : undefined);

export const email = (v) => (isEmail(v) ? undefined : 'Invalid email address');

export const alphaNumeric = (v) => (v && isAlphanumeric(v) ? undefined : 'Must only contain alphanumeric characters');
