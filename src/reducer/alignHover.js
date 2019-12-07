const initialState = {
  position: 0,
};

function alginlHoverReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'COORD_ALIGN':
      return Object.assign({}, state, {
        position: action.payload.position,
      });
    default:
      return state;
  }
}

module.exports = alginlHoverReducer;
