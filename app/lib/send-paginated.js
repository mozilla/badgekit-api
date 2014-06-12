module.exports = function sendPaginated(req, res, responseData, arrayName) {
  const page = parseInt(req.query.page, 10);
  const count = parseInt(req.query.count, 10);

  if (page > 0 && count > 0) {
    const begin = (page-1) * count;
    const end = page * count;
    const total = responseData[arrayName].length;

    responseData[arrayName] = responseData[arrayName].slice(begin, end);
    responseData._pageData = {
      page: page,
      count: count,
      total: total
    };
  }

  return res.send(200, responseData); 
}
