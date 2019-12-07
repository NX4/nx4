import { createStore } from 'redux';
import reducer from './reducer';
/* eslint-disable no-underscore-dangle */
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

export const observe = (select, onChange) => {
  let currentSelectedState;
  function handleChange() {
    const nextState = store.getState();
    const nextSelectedState = select(nextState);
    if (nextSelectedState !== currentSelectedState) {
      currentSelectedState = nextSelectedState;
      onChange(currentSelectedState, nextState);
    }
  }
  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
};

export const { dispatch, getState } = store;

// module.exports = {
//   dispatch,
//   getState,
//   observe,
// };
