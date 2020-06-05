const validate = (value, ref) => {
  if (ref === void 0) ref = [];
  var invalidateFalse = ref[0];
  if (invalidateFalse === void 0) invalidateFalse = false;

  if (Array.isArray(value)) {
    return !(!value.length);
  }
  if (value === false && invalidateFalse) {
    return false;
  }
  if (value === undefined || value === null) {
    return false;
  }
  return !(!String(value).trim().length);
};

export {
  validate
};

export default {
  validate
};
