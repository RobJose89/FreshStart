import { fromJS } from 'immutable';

import { LOGIN_SUCCESS } from '../LoginPage/constants';
import { LOGOUT } from '../LogoutPage/constants';

const initialState = fromJS({
  token: null,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return state.set('token', action.payload.token);
    case LOGOUT:
      return state.set('token', null);
    default:
      return state;
  }
}

export default appReducer;
