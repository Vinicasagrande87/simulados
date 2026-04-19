exports.up = function(knex) {
  return knex.schema.createTable('usuarios', table => {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('email').unique().notNullable();
    table.string('senha').notNullable();
    table.string('tipo').notNullable(); // Aqui você define se é 'professor' ou 'aluno'
    table.integer('semestre_atual'); // Campo importante para filtrar os simulados do aluno
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('usuarios');
};