exports.up = function(knex) {
  return knex.schema.createTable('questoes', table => {
    table.increments('id').primary();
    
    // NOME CORRIGIDO: de disciplina_id para id_disciplina
    table.integer('id_disciplina').unsigned().notNullable()
      .references('id').inTable('disciplinas').onDelete('CASCADE');
    
    // NOME SUGERIDO: id_professor (para manter o padrão id_algumaCoisa)
    table.integer('id_professor').unsigned().notNullable()
      .references('id').inTable('usuarios');
      
    table.text('enunciado').notNullable();
    table.text('explicacao'); // Adicionei esse campo pois ele está no seu Controller
    table.integer('semestre_alvo').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('questoes');
};