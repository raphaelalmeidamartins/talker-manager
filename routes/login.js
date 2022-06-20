const express = require('express');
const crypto = require('crypto');

const loginRoutes = express.Router();

const validateData = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegExp = /[a-z]*@[a-z]*\.com/i;

  if (!email) {
    return next(new Error('O campo "email" é obrigatório'));
  }
  if (!email.match(emailRegExp)) {
    return next(new Error('O "email" deve ter o formato "email@email.com"'));
  }
  if (!password) {
    return next(new Error('O campo "password" é obrigatório'));
  }
  if (password.length < 6) {
    return next(new Error('O "password" deve ter pelo menos 6 caracteres'));
  }

  next();
};

const generateToken = (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(200).json({ token });
};

const errorHandler = (err, _req, res, _next) => {
  res.status(400).json({ message: err.message });
};

loginRoutes.post('/', validateData, generateToken, errorHandler);

module.exports = loginRoutes;
