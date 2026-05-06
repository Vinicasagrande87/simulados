/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('simulados', table => {
    // Adiciona a coluna 'curso' que estava faltando na image_6df671.png
    table.string('curso').notNullable().defaultTo('Medicina');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('simulados', table => {
    // Remove a coluna caso precise desfazer a migration
    table.dropColumn('curso');
  });
};