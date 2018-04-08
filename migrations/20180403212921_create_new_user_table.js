exports.up = function(knex, Promise) {
    return knex.schema.createTable('user', function (t) {
      t.increments('id').primary()
      t.string('uploader').notNullable()
      t.string('email').notNullable()
      t.string('file_name').notNullable()
      t.string('transaction').notNullable()
      t.string('blockNumber').notNullable()
      t.integer('year').notNullable()
      t.timestamps(false, true)
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('user')
  }; 