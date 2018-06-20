import { push } from 'react-router-redux';
// Forces logout if token is expired
export default function authMiddleware(store) {
  return (next) => (action) => {
    const { payload: { error = {} } = {} } = action;
    if (error.token === 'expired') {
      store.dispatch(push('/logout'));
    }
    return next(action);
  };
}
