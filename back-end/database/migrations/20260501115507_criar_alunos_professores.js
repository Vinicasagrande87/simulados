exports.up = function(knex) {
  return knex.schema
    // Tabela de Alunos
    .createTable('alunos', table => {
      table.increments('id').primary();
      table.string('curso').notNullable();
      table.integer('semestre').defaultTo(1);
      
      // Chave Estrangeira: liga o Aluno ao Usuário base
      table.integer('usuario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE'); 
    })
    // Tabela de Professores
    .createTable('professores', table => {
      table.increments('id').primary();
      table.string('especialidade').notNullable();
      
      // Chave Estrangeira: liga o Professor ao Usuário base
      table.integer('usuario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable('professores').dropTable('alunos');
};