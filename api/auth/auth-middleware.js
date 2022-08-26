const authmodel = require("./auth-model")

module.exports = {

    async checkNameAvailable(req, res, next) {
        try {
            const [user] = await authmodel.findBy({
                username: req.body.username.trim()
            })
            if (!user) {
                //All good. Username is NOT taken.
                next()

            } else {
                next({
                    status: 422,
                    message: "username taken"
                })
            }
        } catch (err) {
            next(err)
        }
    },

    async checkNameExists(req, res, next) {
        try {
            if (!req.body || !req.body.username || !req.body.password || req.body.username.trim().length <= 0 || req.body.password.trim().length <= 0 || typeof (req.body.username) != "string") {
                next({
                    status: 400,
                    message: "username and password required"
                })
            }

            const [user] = await authmodel.findBy({
                username: req.body.username
            })
            if (user) {
                //All good. Username is found.
                next()

            } else {
                next({
                    status: 422,
                    message: "invalid credentials"
                })
            }

        } catch (err) {
            next(err)
        }
    },

}


