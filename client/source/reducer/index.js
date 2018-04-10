import { combineReducers } from 'redux';
import contextReducer from './brush';
import focusReducer from './focus';
import alignmentReducer from './alignment';
import detailHoverReducer from './detailHover';

const reducer = combineReducers({
  context: contextReducer,
  focus: focusReducer,
  alignment: alignmentReducer,
  detailHover: detailHoverReducer,
});

export default reducer;
