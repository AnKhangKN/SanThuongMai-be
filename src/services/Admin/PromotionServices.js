const Banner = require('../../models/Banner')

const createBanner = () => {
    return new Promise( async (resolve, reject) => {
        try {
            const checkProgram = await Banner.findOne({programName});

            if (checkProgram) {
                return reject({
                      message: `Chương trình đã tồn tại hãy đổi chương trình mới!`,
                });
            }

            const program = await Banner.create({

            })

            resolve(
                {
                    message: "Tạo banner thành công",
                    program
                }
            )


        } catch (error) {
            return reject(error);
        }
    })
}

const getAllBannerByProgram = async (req, res) => {
    return new Promise( async (resolve, reject) => {
        try {

            const banner = await Banner.find();

            resolve({
                message: "Lấy banner thành công",
                banner
            })

        } catch (error) {
            return reject({
                message: error.message,
            })
        }
    })
}

module.exports = {
    createBanner,
    getAllBannerByProgram
};