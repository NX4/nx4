
function updateRecs(range, domain) {
  return {
    type: 'UPDATE_RECS',
    payload: {
      range,
      domain,
    },
  };
}

function updateFocus(range, domain) {
  return {
    type: 'UPDATE_FOCUS',
    payload: {
      range,
      domain,
    },
  };
}

export default {
  updateRecs,
  updateFocus,
};
