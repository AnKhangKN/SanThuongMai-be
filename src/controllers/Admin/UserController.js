const createUser = (req, res) => {
    try {
        console.log(res.body);
    } catch (e) {
        return res.status(404).json({
            message: e
        })   
    }
}

module.exports = {
    createUser
}