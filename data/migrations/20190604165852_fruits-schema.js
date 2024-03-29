
exports.up = function (knex) {
  return knex.schema.createTable('fruits', tbl => {
    tbl.increments();
    tbl.text('name', 128).unique().notNullable();
    tbl.decimal('avgWeightOz').notNullable();
    tbl.boolean('delicious');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('fruits');
};
