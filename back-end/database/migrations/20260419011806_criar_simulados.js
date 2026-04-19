  exports.up = function(knex) {
    return knex.schema.createTable('simulados', table => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table.integer('professor_id').unsigned().notNullable()
        .references('id').inTable('usuarios');
      table.integer('semestre_referencia').notNullable();
    });
  };

  exports.down = function(knex) {
    return knex.schema.dropTable('simulados');
  };