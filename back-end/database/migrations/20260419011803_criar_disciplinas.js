exports.up = function(knex) {
  return knex.schema.createTable('disciplinas', table => {
    table.increments('id').primary();
    table.string('nome').notNullable(); // Ex: Anatomia, Farmacologia, etc.
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('disciplinas');
};