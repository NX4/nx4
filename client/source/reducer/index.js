import { combineReducers } from 'redux';
import contextReducer from './brush';
import focusReducer from './focus';

const reducer = combineReducers({
  context: contextReducer,
  focus: focusReducer,
});

export default reducer;
