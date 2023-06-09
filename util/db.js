const fs = require('fs');

const saveTable = (table, data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync('./data/'+table+'.json', stringifyData)
}

const loadTable = (table) => {
  const jsonData = fs.readFileSync('./data/'+table+'.json')
  return JSON.parse(jsonData)    
}

module.exports = {
  saveTable,
  loadTable
}