const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getFiles('./public/Images');
const relativePaths = allFiles.map(f => f.replace(/\\/g, '/').replace('public/', '/'));
fs.writeFileSync('images.json', JSON.stringify(relativePaths, null, 2));
