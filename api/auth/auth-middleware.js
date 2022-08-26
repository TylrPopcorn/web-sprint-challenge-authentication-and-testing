const authmodel = require("./auth-model")

module.exports = {

    async checkNameExists(req, res, next) {
        try {
            const [user] = await authmodel.findBy({
                username: req.body.username
            })
            if (!user) {
                console.log("ALL GOOD?", user)
                next()

            } else {
                next({
                    status: 422,
                    message: "Username taken. Please try a new name."
                })
            }
        } catch (err) {
            next(err)
        }
    },

}


