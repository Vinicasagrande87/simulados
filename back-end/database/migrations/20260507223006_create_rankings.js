exports.up = function(knex) {
  return knex.schema.createTable('rankings', function(table) {
    table.increments('id').primary();
    
    // Mudamos de string para integer para bater com o padrão de IDs numéricos
    // .unsigned() é importante se o seu id de usuário for um increments padrão
    table.integer('usuario_id').unsigned().notNullable(); 
    
    table.integer('pontos_totais').defaultTo(0);
    table.integer('simulados_concluidos').defaultTo(0);
    table.integer('total_acertos').defaultTo(0);

    // Criando a chave estrangeira corretamente
    table.foreign('usuario_id').references('id').inTable('usuarios').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rankings');
};