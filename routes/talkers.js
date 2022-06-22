const express = require('express');
const errorHandler = require('../helpers/erroHandler');
const readTalkersFile = require('../helpers/readTalkersFile');
const writeTalkersFile = require('../helpers/writeTalkersFile');
const validateMandatoryFields = require('../helpers/validateMandatoryFields');
const validateDateFormat = require('../helpers/validateDateFormat');

const talkerRoutes = express.Router();

function getAllTalkers(req, res, next) {
  try {
    const talkers = readTalkersFile();
    res.status(200).json(talkers);    
  } catch ({ message }) {
    next({ message, status: 500 });
  }
}

function findTalker(req, _res, next) {
  const { id } = req.params;
  const talkers = readTalkersFile();
  const selectedTalker = talkers.find((talker) => talker.id === +id);
  if (!selectedTalker) {
    return next({ message: 'Pessoa palestrante não encontrada', status: 404 });
  }

  req.selectedTalker = selectedTalker;

  next();
}

function returnSelectedTalker(req, res) {
  res.status(200).json(req.selectedTalker);
}

function verifyAuthorization(req, res, next) {
  const { authorization } = req.headers;
  const tokenRegExp = /[a-z0-9]{16}/i;

  if (!authorization) {
    return next({ message: 'Token não encontrado', status: 401 });
  }
  if (!authorization.match(tokenRegExp)) {
    return next({ message: 'Token inválido', status: 401 });
  }

  next();
}

function verifyTalkerFields(req, res, next) {
  const { name, age, talk } = req.body;

  if (name.length < 3) {
    return next({ message: 'O "name" deve ter pelo menos 3 caracteres', status: 400 });
  }
  if (age < 18) {
    return next({ message: 'A pessoa palestrante deve ser maior de idade', status: 400 });
  }
  if (!validateDateFormat(talk.watchedAt)) {
    return next({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"', status: 400 });
  }
  if (![1, 2, 3, 4, 5].includes(talk.rate)) {
    return next({ message: 'O campo "rate" deve ser um inteiro de 1 à 5', status: 400 });
  }

  req.selectedTalker = { name, age, talk };

  next();
}

function defineTalkerMandatoryFields(req, _res, next) {
  const { name, age, talk } = req.body;

  // Recebi ajuda de Danillo Gonçalves, Lais Namatela e Leo Araujo
  // Minha aplicação estava dando erro de "não é possível ler as propriedades de undefined"
  // Porém, essa mensagem de erro não aparecia no console, nem no retorno da API, o que dificultou a identificação

  req.mandatoryFields = {
    name,
    age,
    talk,
    watchedAt: talk && talk.watchedAt,
    rate: talk && talk.rate,
  };
  next();
}

function registerTalker(req, res, next) {
  const { selectedTalker } = req;

  try {
    const talkers = readTalkersFile();
    selectedTalker.id = talkers[talkers.length - 1].id + 1;
    writeTalkersFile([...talkers, selectedTalker]);  
    res.status(201).json(selectedTalker);
  } catch ({ message }) {
    next({ message, status: 500 });
  }
}

function editTalker(req, res, next) {
  const { name, age, talk } = req.body;
  const { id } = req.params;

  const selectedTalker = { id: +id, name, age, talk };

  try {
    const talkers = readTalkersFile();
    const index = talkers.findIndex((talker) => talker.id === +id);
    talkers[index] = selectedTalker;

    writeTalkersFile(talkers);  
    res.status(200).json(selectedTalker);
  } catch ({ message }) {
    next({ message, status: 500 });
  }
}

function deleteTalker(req, res, next) {
  const { id } = req.params;

  try {
    const talkers = readTalkersFile();
    const index = talkers.findIndex((talker) => talker.id === +id);
    talkers.splice(index, 1);

    writeTalkersFile(talkers);  
    res.status(204).json();
  } catch ({ message }) {
    next({ message, status: 500 });
  }
}

talkerRoutes
  .route('/')
  .get(
    getAllTalkers,
    errorHandler,
  )
  .post(
    verifyAuthorization,
    defineTalkerMandatoryFields,
    validateMandatoryFields,
    verifyTalkerFields,
    registerTalker,
    errorHandler,
  );

talkerRoutes
  .route(
    '/:id',
  )
  .get(
    findTalker,
    returnSelectedTalker,
    errorHandler,
  )
  .put(
    verifyAuthorization,
    findTalker,
    defineTalkerMandatoryFields,
    validateMandatoryFields,
    verifyTalkerFields,
    editTalker,
    errorHandler,
  )
  .delete(
    verifyAuthorization,
    findTalker,
    deleteTalker,
    errorHandler,
  );

module.exports = talkerRoutes;
