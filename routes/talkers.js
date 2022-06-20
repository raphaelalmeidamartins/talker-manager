const express = require('express');
const fs = require('fs');

let talkers = fs.readFileSync('./talker.json', 'utf-8');
talkers = JSON.parse(talkers);

const talkerRoutes = express.Router();

talkerRoutes.get('/', (_req, res) => {
  res.status(200).json(talkers);
});

talkerRoutes.get('/:id', (req, res) => {
  const { id } = req.params;
  const selectedTalker = talkers.find((talker) => talker.id === +id);
  if (!selectedTalker) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  res.status(200).json(selectedTalker);
});

module.exports = talkerRoutes;
