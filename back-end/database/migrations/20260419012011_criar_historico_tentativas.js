exports.up = function(knex) {
  return knex.schema.createTable('historico_tentativas', table => {
    table.increments('id').primary();
    table.integer('aluno_id').unsigned().notNullable()
      .references('id').inTable('usuarios');
    table.integer('simulado_id').unsigned().notNullable()
      .references('id').inTable('simulados');
    table.decimal('nota', 5, 2); 
    table.timestamp('data_realizacao').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('historico_tentativas');
};