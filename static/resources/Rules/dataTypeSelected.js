const validate = function (value, options) {
  if (Array.isArray(value)) {
    return value.every(function (val) { return validate(val, options); });
  }
  return !(!options.filter(function (option) { return option === value; }).length);
};

export {
  validate
};

export default {
  validate
};
