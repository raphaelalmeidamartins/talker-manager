const fs = require('fs').promises;

async function writeTalkersFile(updatedTalkers) {
  fs.writeFile('./talker.json', JSON.stringify(updatedTalkers), { encoding: 'utf8' });
}

module.exports = writeTalkersFile;
