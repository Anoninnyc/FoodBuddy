// require('dotenv').config();

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    charset: 'utf8'
  },
  pool: { min: 0, max: 6 }
});

const db = require('bookshelf')(knex);
//
db.knex.schema.hasTable('movies').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('movies', movie => {
      movie.integer('id').primary();
      movie.string('title', 255);
      movie.string('genre', 255);
      movie.string('poster', 255);
      movie.string('release_date', 255);
      movie.string('description', 255);
      movie.integer('imdbRating');
    })
    .raw(`ALTER TABLE movies ADD FULLTEXT (title)`)
    .then(table => {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('ratings').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('ratings', rating => {
      rating.increments('id').primary();
      rating.integer('score');
      rating.integer('movieid');
      rating.integer('userid');
      rating.string('review', 255);
      rating.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('users', user => {
      user.increments('id').primary();
      user.string('username', 255).unique();
      user.string('password', 255);
      user.string('email', 255);
      user.string('firstName', 255);
      user.string('lastName', 255);
      user.string('profilePicture', 255);
    }).then(table => {
      console.log('Created Table', table);
    });
  }//
});

db.knex.schema.hasTable('relations').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('relations', relation => {
      relation.increments('id').primary();
      relation.integer('user1id');
      relation.integer('user2id');
    }).then(table => {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('allRequests').then(exists => {
  if (!exists) {
    db.knex.schema.createTable('allRequests', request => {
      request.increments('id').primary();
      request.string('requestor', 255);
      request.string('requestee', 255);
      request.string('requestTyp', 255);
      request.string('movie', 255);
      request.string('message', 255);
      request.string('response', 255);
      request.timestamps();
    }).then(table => {
      console.log('Created Table', table);
    });
  }
});

module.exports = db;
