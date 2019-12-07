const initialState = {
  name: '',
  all: []
};

function sequenceReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_CURRENT_SEQUENCE':
      return Object.assign({}, state, {
        name: action.payload.name,
        all: action.payload.sequence,
      });
    default:
      return state;
  }
}

module.exports = sequenceReducer;
