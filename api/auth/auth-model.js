const db = require("../../data/dbConfig");

module.exports = {

    findBy(filter) {
        if (filter.type) {
            if (filter.type == "id") {
                return db('users').where("id", filter.id).first()
            } else if (filter.type == "name") {
                return db("users").where("username", filter.username).first()
            }
        } else {
            return db("users").select('username').where(filter)
        }
    },

    async add(user) {
        const [id] = await db('users').insert(user)
        return this.findBy({ type: "id", id: id })
    }

}