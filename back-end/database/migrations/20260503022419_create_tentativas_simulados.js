exports.up = function(knex) {
  return knex.schema.createTable('tentativas_simulados', function(table) {
    table.increments('id').primary();
    
    // Relacionamento com o usuário (aluno)
    table.integer('aluno_id').notNullable(); 
    
    // Relacionamento com o simulado
    table.integer('simulado_id').notNullable();
    table.foreign('simulado_id').references('id').inTable('simulados').onDelete('CASCADE');

    table.float('pontuacao').defaultTo(0);
    table.timestamp('data_conclusao').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tentativas_simulados');
};