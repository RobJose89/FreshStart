/**
 * Create the Redux store with dynamic reducers
 */
import { createStore, applyMiddleware } from 'redux';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import mapsListScreenSaga from 'containers/MapsListScreen/saga';
import authMiddleware from 'utils/authMiddleware';
import createReducer from './reducers';
import composeEnhancers from './utils/composeEnhancers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState = {}, history) {
  // Create the store with three middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  // 2. authMiddleware: Forces logout if token is expired
  const middlewares = [
    sagaMiddleware,
    routerMiddleware(history),
    authMiddleware,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  const sagas = [
    mapsListScreenSaga,
  ];

  sagas.forEach(sagaMiddleware.run);

  // Extensions
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  return store;
}
