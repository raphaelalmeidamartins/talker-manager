const express = require('express');
const crypto = require('crypto');
const errorHandler = require('../helpers/erroHandler');

const loginRoutes = express.Router();

const validateData = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegExp = /[a-z]*@[a-z]*\.com/i;

  if (!email) {
    return next({ message: 'O campo "email" é obrigatório', status: 400 });
  }
  if (!email.match(emailRegExp)) {
    return next({ message: 'O "email" deve ter o formato "email@email.com"', status: 400 });
  }
  if (!password) {
    return next({ message: 'O campo "password" é obrigatório', status: 400 });
  }
  if (password.length < 6) {
    return next({ message: 'O "password" deve ter pelo menos 6 caracteres', status: 400 });
  }

  next();
};

const generateToken = (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
};

loginRoutes.post('/', validateData, generateToken, errorHandler);

module.exports = loginRoutes;
