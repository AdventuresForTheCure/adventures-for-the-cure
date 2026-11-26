var fs = require('fs/promises');
var path = require('path');

exports.listFiles = async function(directory, extension) {
  try {
    var entries = await fs.readdir(directory, {withFileTypes: true});
    return entries
      .filter(function(entry) {
        return entry.isFile() && (!extension || path.extname(entry.name).toLowerCase() === extension);
      })
      .map(function(entry) { return entry.name; })
      .sort(function(a, b) { return a.localeCompare(b); });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

exports.readContent = async function(directory, name, extension) {
  if (typeof name !== 'string' || !name || path.basename(name) !== name || name.indexOf('\0') !== -1) {
    var invalidName = new Error('Content not found');
    invalidName.status = 404;
    throw invalidName;
  }

  var root = path.resolve(directory);
  var filePath = path.resolve(root, name + extension);
  if (path.dirname(filePath) !== root) {
    var invalidPath = new Error('Content not found');
    invalidPath.status = 404;
    throw invalidPath;
  }

  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') error.status = 404;
    throw error;
  }
};
