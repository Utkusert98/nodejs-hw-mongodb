function errorHandler(err, req, res) {
  console.error(err); // Hatanın server loglarında görünmesi için

  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,  // Hata nesnesinden gelen mesaj
  });
}

export default errorHandler;
