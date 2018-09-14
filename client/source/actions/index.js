
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

function setCurrentSequence(name, sequence) {
  return {
    type: 'SET_CURRENT_SEQUENCE',
    payload: {
      name,
      sequence
    }
  }
}

export default {
  setCurrentSequence,
  setRectCount,
  updateRecs,
  updateFocus,
  coordinateDetail,
  alignmentDetail,
};
