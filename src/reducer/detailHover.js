const initialState = {
  position: 0,
};

function detailHoverReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'COORD_DETAIL':
      return Object.assign({}, state, {
        position: action.payload.position,
      });
    default:
      return state;
  }
}

module.exports = detailHoverReducer;
