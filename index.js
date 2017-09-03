var KnexQuery = function(knex, main_table) {
  this.knex = knex;
  this.main_table = main_table;
  this.child_tables = [];
  this.fks = [];
  this.aliases = [];
};

KnexQuery.prototype.populate = function (child_table, fk, alias) {
  this.child_tables.push(child_table);
  this.fks.push(fk);
  alias ? this.aliases.push(alias) : this.aliases.push(child_table);
  return this;
};

KnexQuery.prototype.exec = function () {
  var childQueries = this.child_tables.map(table => this.knex(table).select());
  return Promise
    .all([
      this.knex(this.main_table).select(),
      ...childQueries
    ])
    .then(data => {
      let [ main_table_results, ...othertables ] = data;
      main_table_results.forEach((mtres, mainindex) => {
        this.fks.map((fk, index) => {
          mtres[this.aliases[index]] = [];
          othertables[index].map(item => {
            console.log('mtres', item);
            if(item.id === mtres[fk] || item[fk] === mtres.id) {
              mtres[this.aliases[index]].push(item);
            }
          });
        });
      });
      return main_table_results;

    });
};

module.exports = function(knex, main_table) {
  return new KnexQuery(knex, main_table);
};
