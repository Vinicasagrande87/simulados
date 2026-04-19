exports.up = function(knex) {
  return knex.schema.createTable('simulado_questoes', table => {
    table.integer('simulado_id').unsigned().notNullable()
      .references('id').inTable('simulados').onDelete('CASCADE');
    table.integer('questao_id').unsigned().notNullable()
      .references('id').inTable('questoes').onDelete('CASCADE');
    table.primary(['simulado_id', 'questao_id']); 
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('simulado_questoes');
};