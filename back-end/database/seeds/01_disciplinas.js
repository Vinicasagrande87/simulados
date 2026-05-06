exports.seed = async function(knex) {
  // Limpa a tabela antes de inserir para evitar duplicados
  await knex('disciplinas').del();
  
  // Insere dados iniciais
  await knex('disciplinas').insert([
    { nome: 'Anatomia' },
    { nome: 'Embriologia' },
    { nome: 'Bioquímica' },
    { nome: 'Farmacologia' }
  ]);
};