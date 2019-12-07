const initialState = {
  rectCount: 1,
};

function alignmentReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_RECT_COUNT':
      return Object.assign({}, state, {
        rectCount: action.payload.count,
      });
    default:
      return state;
  }
}

module.exports = alignmentReducer;
