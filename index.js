/*
  DEPENDENCIES:

  npm install
  npm i knex
  npm i -D nodemon
  npm i express
  npm i knex
  npx eslint --init
  npm i bcryptjs
  npm i -D cross-env
  npm i supertest
  npm i express-session

  Helpful Reminders:
  ------
  npx knex init -> will create ur knex init
  
  npx knex migrate:make [name-here] -> will create ur migrations
  
  npx knex seed:make [00-name-here] -> will make your seeds

  npx knex migrate:latest -> update to the lastest info.

*/

const server = require('./api/server.js');

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`\n=== Server listening on port ${PORT} ===\n`);
});
