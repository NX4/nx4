import { combineReducers } from 'redux';
import contextReducer from './brush';
import focusReducer from './focus';
import alignmentReducer from './alignment';
import detailHoverReducer from './detailHover';
import alginlHoverReducer from './alignHover';
import sequenceReducer from './sequence';

const reducer = combineReducers({
  context: contextReducer,
  focus: focusReducer,
  alignment: alignmentReducer,
  detailHover: detailHoverReducer,
  alignHover: alginlHoverReducer,
  sequence: sequenceReducer
});

export default reducer;
