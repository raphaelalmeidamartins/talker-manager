const express = require('express');
const crypto = require('crypto');
const errorHandler = require('../helpers/erroHandler');
const validateMandatoryFields = require('../helpers/validateMandatoryFields');

const loginRoutes = express.Router();

function validateLoginData(req, res, next) {
  const { email, password } = req.body;
  const emailRegExp = /[a-z]*@[a-z]*\.com/i;

  if (!email.match(emailRegExp)) {
    return next({ message: 'O "email" deve ter o formato "email@email.com"', status: 400 });
  }
  if (password.length < 6) {
    return next({ message: 'O "password" deve ter pelo menos 6 caracteres', status: 400 });
  }

  next();
}

function generateToken(req, res) {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
}

loginRoutes.post(
  '/',
  (req, _res, next) => {
    const { email, password } = req.body;
    req.mandatoryFields = { email, password };
    next();
  },
  validateMandatoryFields,
  validateLoginData,
  generateToken,
  errorHandler,
);

module.exports = loginRoutes;
