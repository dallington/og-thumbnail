function httpToVercelRequest (req, body) {
  setLazyProp(req, 'cookies', getCookieParser(req))
  setLazyProp(req, 'query', getQueryParser(req))
  setLazyProp(req, 'body', getBodyParser(req, body))
  return req
}

function httpToVercelResponse (req, res) {
  res.status = statusCode => status(res, statusCode)
  res.redirect = (statusOrUrl, url) => redirect(res, statusOrUrl, url)
  res.send = body => send(req, res, body)
  res.json = jsonBody => json(req, res, jsonBody)
  return res
}

exports.httpToVercelRequest = httpToVercelRequest
exports.httpToVercelResponse = httpToVercelResponse
