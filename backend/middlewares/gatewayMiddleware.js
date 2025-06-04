const fs = require('fs');

module.exports = (req, res, next) => {
  const log = `${req.method} ${req.url} - ${new Date().toISOString()}\n`;
  fs.appendFileSync('log.txt', log);

  // Only check title for POST and PUT requests with body
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    req.body &&
    req.body.title &&
    req.body.title.toLowerCase().includes('test')
  ) {
    return res.status(400).json({ error: 'Title cannot contain the word "test"' });
  }

  next();
};
