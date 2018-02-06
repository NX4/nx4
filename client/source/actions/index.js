
function updateRecs(range, domain) {
  return {
    type: 'UPDATE_RECS',
    payload: {
      range,
      domain,
    },
  };
}

export default {
  updateRecs,
};
