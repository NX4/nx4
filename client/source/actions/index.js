
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

function coordinateDetail(position) {
  return {
    type: 'COORD_DETAIL',
    payload: {
      position,
    },
  };
}

function alignmentDetail(position) {
  return {
    type: 'COORD_ALIGN',
    payload: {
      position,
    },
  };
}

export default {
  setRectCount,
  updateRecs,
  updateFocus,
  coordinateDetail,
  alignmentDetail,
};
