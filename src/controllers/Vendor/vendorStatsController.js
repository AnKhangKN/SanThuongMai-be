const vendorStatsService = require("../../services/Vendor/vendorStatsService");

const getSummary = async (req, res) => {
  try {
    const { shopId, days } = req.query;
    const data = await vendorStatsService.getSummary(shopId, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRevenueTrend = async (req, res) => {
  try {
    const { shopId, days } = req.query;
    const data = await vendorStatsService.getRevenueTrend(shopId, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    const { shopId } = req.query;
    const data = await vendorStatsService.getOrdersByStatus(shopId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const { shopId, limit } = req.query;
    const data = await vendorStatsService.getTopProducts(shopId, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStock = async (req, res) => {
  try {
    const { shopId, threshold } = req.query;
    const data = await vendorStatsService.getLowStock(shopId, threshold);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWarnings = async (req, res) => {
  try {
    const { shopId } = req.query;
    const data = await vendorStatsService.getWarnings(shopId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  getRevenueTrend,
  getOrdersByStatus,
  getTopProducts,
  getLowStock,
  getWarnings,
};
