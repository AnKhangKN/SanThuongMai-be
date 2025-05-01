const PlatformFeesServices = require("../../services/Admin/PlatformFeesServices");

const getAllFees = async (req, res) => {
    try {
        const result = await PlatformFeesServices.getAllFees();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

const createPlatformFee = async (req, res) => {
    try {
        const { fee_type, fee_name, value, description } = req.body;

        // Kiểm tra field có trống hay không
        if (!fee_type || !fee_name || !value || !description) {
            return res.status(400).json({
                status: "ERROR",
                message: "Có thuộc tính trống",
            });
        }

        const result = await PlatformFeesServices.createPlatformFee(req.body);

        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({
            message: e.message || "Internal Server Error",
        });
    }
};

const updatePlatformFee = async (req, res) => {
    try {
        const { id } = req.params;
        const { fee_type, fee_name, value, description, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Missing fee ID in URL." });
        }

        const result = await PlatformFeesServices.updatePlatformFee(id, {
            fee_type,
            fee_name,
            value,
            description,
            status
        });

        return res.status(200).json({
            message: "Platform fee updated successfully.",
            data: result
        });

    } catch (e) {
        return res.status(500).json({
            message: e.message || "Internal Server Error",
        });
    }
};

module.exports = { getAllFees, createPlatformFee, updatePlatformFee };
