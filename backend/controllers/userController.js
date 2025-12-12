exports.getUser = (req, res) => {
  res.send(`User data for ID: ${req.params.id}`);
};