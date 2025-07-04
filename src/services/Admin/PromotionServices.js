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

module.exports = {
    createBanner
};