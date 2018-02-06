const initialState = {
  range: [],
  domain: [],
};

function brushReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPDATE_RECS':
      return Object.assign({}, state, {
        range: action.payload.range,
        domain: action.payload.domain,
      });
    default:
      return state;
  }
}

module.exports = brushReducer;
