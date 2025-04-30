const createProduct = (req, res) => {
  try {
    const {
      product_name,
      description,
      category,
      images,
      details: { size = null, color = null, price = null, quantity = null },
      status,
      rating,
      sale,
    } = req.body;

    if (
      !product_name ||
      !category ||
      !images ||
      !details.price ||
      !details.quantity
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createProduct,
};
