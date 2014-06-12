module.exports = function sendPaginated(req, res, responseData, total) {
  if (req.pageData) {
    responseData._pageData = {
      page: req.pageData.page,
      count: req.pageData.count,
      total: total
    };
  }

  return res.send(200, responseData); 
}
