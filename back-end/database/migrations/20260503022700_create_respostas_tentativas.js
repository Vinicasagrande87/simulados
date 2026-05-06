exports.up = function(knex) {
  return knex.schema.createTable('respostas_tentativas', function(table) {
    table.increments('id').primary();

    // FK para a tentativa pai
    table.integer('tentativa_id').notNullable();
    table.foreign('tentativa_id').references('id').inTable('tentativas_simulados').onDelete('CASCADE');

    // FK para a questão respondida
    table.integer('questao_id').notNullable();
    table.foreign('questao_id').references('id').inTable('questoes');

    // FK para a alternativa que o aluno marcou
    table.integer('alternativa_escolhida_id').notNullable();
    table.foreign('alternativa_escolhida_id').references('id').inTable('alternativas');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('respostas_tentativas');
};