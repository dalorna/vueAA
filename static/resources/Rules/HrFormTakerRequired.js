const validate = (value, obj) => {
  return new Promise(resolve => {
    let retValid = obj[0].isNullable;
    if (!retValid) {
      retValid = (value === undefined || value === null) ? false : !(!String(value).trim().length);
    }
    resolve({
      valid: retValid
    });
  });
};

export {
  validate
};

export default {
  validate
};
