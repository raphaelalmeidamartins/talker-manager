const express = require('express');
const fs = require('fs').promises;
const errorHandler = require('../helpers/erroHandler');

const readTalkersFile = async () => {
  let talkers = await fs.readFile('./talker.json', 'utf-8');
  talkers = JSON.parse(talkers);
  return talkers;
};

const talkerRoutes = express.Router();

const verifyAuthorization = (req, _res, next) => {
  const { authorization } = req;
  const tokenRegExp = /[a-z0-9]{16}/i;
  if (!authorization || !authorization.match(tokenRegExp)) {
    return next({ message: 'Token não encontrado', status: 401 });
  }
  next();
};

const verifyTalkerFields = () => {};

talkerRoutes
  .route('/')
  .get(async (req, res) => {
    const talkers = await readTalkersFile();
    res.status(200).json(talkers);
  })
  .post(verifyAuthorization, verifyTalkerFields, errorHandler);

talkerRoutes.get(
  '/:id',
  async (req, res, next) => {
    const { id } = req.params;
    const talkers = await readTalkersFile();
    const selectedTalker = talkers.find((talker) => talker.id === +id);
    if (!selectedTalker) {
      return next({ message: 'Pessoa palestrante não encontrada', status: 404 });
    }
    res.status(200).json(selectedTalker);
  },
  errorHandler,
);

module.exports = talkerRoutes;
