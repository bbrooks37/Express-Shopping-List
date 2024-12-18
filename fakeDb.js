const fs = require('fs');
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, 'items.json');

function readData() {
  const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

module.exports = {
  readData,
  writeData,
};
