
exports.seed = async function (knex) {
  return knex('users')
    .truncate()
    .then(function () {
      return knex('users').insert([
        { usermae: 'test', password: "test2" },
      ]);
    });
};
