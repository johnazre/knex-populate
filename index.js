module.exports = function(knex, table_one, table_two, fr_key, alias) {
  return Promise
    .all([
      knex(table_one).select(),
      knex(table_two).select()
    ])
    .then(data => {
      let [ ones, twos ] = data;
      ones.forEach(one => {
        one[alias] = [];
        twos.map(two => {
          if(two[fr_key] === one.id) one[alias].push(two);
        });
      });

      return ones;

    });
};
