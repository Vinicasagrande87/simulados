exports.up = function(knex) {
  return knex.schema.createTable('feedbacks', function(table) {
    table.increments('id').primary();
    
    // CORREÇÃO: Mudamos de .string() para .integer().unsigned()
    // para ser compatível com o ID da tabela 'usuarios'
    table.integer('usuario_id').unsigned().notNullable(); 
    
    table.string('tipo').notNullable(); // 'suporte' ou 'sugestao'
    table.string('assunto').notNullable();
    table.text('mensagem').notNullable();
    table.string('status').defaultTo('pendente'); // 'pendente', 'em_analise', 'resolvido'
    table.timestamp('criado_em').defaultTo(knex.fn.now());

    // Criando a chave estrangeira corretamente
    table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('feedbacks');
};