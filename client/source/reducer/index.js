
const initialState = {
  nombre: '',
};

function thingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_NOMBRE':
      return Object.assign({}, state, {
        nombre: action.payload,
      });
    default:
      return state;
  }
}

module.exports = thingsReducer;
