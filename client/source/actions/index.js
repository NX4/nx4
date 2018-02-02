
function setNombre(nombre) {
  return {
    type: 'SET_NOMBRE',
    payload: nombre,
  };
}

export default {
  setNombre,
};
