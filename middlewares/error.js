module.exports = (err, req, res, next) => {
  let { status, message } = err
  console.log({err})
  if (status !== undefined) {
    res.status(status).json({ message })
  } else {
    err = err.toString()
    res.status(500).json({ message: err })
  }
}
