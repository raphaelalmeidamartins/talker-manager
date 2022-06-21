function validateDateFormat(date) {
  return date.match(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}$/);
}

module.exports = validateDateFormat;
