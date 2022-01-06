
exports.up = function (knex) {
  return knex.schema.table('fruits', tbl => {
    tbl.string('color', 128).defaultTo('green');
  });
};

exports.down = function (knex) {
  return knex.schema.table('fruits', tbl => {
    tbl.dropColumn('color');
  });
};
