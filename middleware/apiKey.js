const authorize = async (req, res, next) => {
  const apiKey = process.env.API_KEY;
  const apiKeyHeader = req.headers['x-api-key'];

  if (apiKeyHeader !== apiKey) {
    res.status(403).send();
    return;
  }

  next();
};

module.exports = authorize;