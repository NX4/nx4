
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

function setRectCount(count) {
  return {
    type: 'SET_RECT_COUNT',
    payload: {
      count,
    },
  };
}

export default {
  setRectCount,
  updateRecs,
  updateFocus,
};
