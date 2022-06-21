function validateMandatoryFields(req, _res, next) {
  const mandatoryFields = Object.entries(req.mandatoryFields);

  for (let index = 0; index < mandatoryFields.length; index += 1) {
    const [fieldName, fieldValue] = mandatoryFields[index];
    if (fieldValue === undefined) {
      return next({ message: `O campo "${fieldName}" é obrigatório`, status: 400 });
    }
  }

  next();
}

module.exports = validateMandatoryFields;
