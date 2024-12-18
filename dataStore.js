const fs = require('fs');
const path = require('path');

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
  }

  readData() {
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data || '[]');
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  getAll() {
    return this.readData();
  }

  addItem(item) {
    const data = this.readData();
    data.push(item);
    this.writeData(data);
    return item;
  }

  getItem(name) {
    const data = this.readData();
    return data.find(item => item.name === name);
  }

  updateItem(name, updatedItem) {
    const data = this.readData();
    const itemIndex = data.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      data[itemIndex] = updatedItem;
      this.writeData(data);
      return data[itemIndex];
    }
    return null;
  }

  deleteItem(name) {
    const data = this.readData();
    const index = data.findIndex(item => item.name === name);
    if (index !== -1) {
      const deletedItem = data.splice(index, 1);
      this.writeData(data);
      return deletedItem[0];
    }
    return null;
  }
}

module.exports = new DataStore(path.join(__dirname, 'items.json'));
