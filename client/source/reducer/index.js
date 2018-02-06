import { combineReducers } from 'redux';
import contextReducer from './brush';

const reducer = combineReducers({
  context: contextReducer,
});

export default reducer;
