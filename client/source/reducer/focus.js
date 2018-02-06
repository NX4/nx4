const initialState = {
  range: [],
  domain: [],
};

function focusReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPDATE_FOCUS':
      return Object.assign({}, state, {
        range: action.payload.range,
        domain: action.payload.domain,
      });
    default:
      return state;
  }
}

module.exports = focusReducer;
