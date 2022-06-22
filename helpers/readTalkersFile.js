const fs = require('fs');

function readTalkersFile() {
  let talkers = fs.readFileSync('./talker.json', 'utf-8');
  talkers = JSON.parse(talkers);
  return talkers;
}

module.exports = readTalkersFile;
