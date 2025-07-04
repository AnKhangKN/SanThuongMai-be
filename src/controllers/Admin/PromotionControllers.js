const createBanner = async (req, res) => {
    try {

        const {} = req.body;

        const result = await createBanner(req.body);

    } catch (error) {
        return res.status(500).json({
            message: error || "Internal Server Error",
        })
    }
}

const getAllBanner = async (req, res) => {
    try {

        const result = await getAllBanner();
        
    } catch (error) {
        return res.status(500).json({
            message: error || "Internal Server Error",
        })
    }
}

module.exports = {
    createBanner
};