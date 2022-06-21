const fs = require('fs').promises;

const readTalkersFile = async () => {
  let talkers = await fs.readFile('./talker.json', 'utf-8');
  talkers = JSON.parse(talkers);
  return talkers;
};

module.exports = readTalkersFile;
