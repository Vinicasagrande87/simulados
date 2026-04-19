exports.up = function(knex) {
  return knex.schema.createTable('alternativas', table => {
    table.increments('id').primary();
    table.integer('questao_id').unsigned().notNullable()
      .references('id').inTable('questoes').onDelete('CASCADE');
    table.string('texto').notNullable();
    table.boolean('e_correta').notNullable().defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('alternativas');
};