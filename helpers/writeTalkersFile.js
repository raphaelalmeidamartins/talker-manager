const fs = require('fs');

function writeTalkersFile(updatedTalkers) {
  fs.writeFileSync('./talker.json', JSON.stringify(updatedTalkers), { encoding: 'utf8' });
}

module.exports = writeTalkersFile;
