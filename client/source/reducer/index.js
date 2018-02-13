import { combineReducers } from 'redux';
import contextReducer from './brush';
import focusReducer from './focus';
import alignmentReducer from './alignment';

const reducer = combineReducers({
  context: contextReducer,
  focus: focusReducer,
  alignment: alignmentReducer,
});

export default reducer;
