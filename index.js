var KnexQuery = function(knex, main_table) {
  this.knex = knex;
  this.main_table = main_table;
  this.child_tables = [];
  this.fks = [];
  this.aliases = [];
  this.query = {};
  this.limit = 0;
};

KnexQuery.prototype.find = function (query) {
  this.query = query || {};
  return this;
};

KnexQuery.prototype.findById = function (id) {
  this.query = { id }
  return this;
};

KnexQuery.prototype.populate = function (child_table, fk, alias) {
  this.child_tables.push(child_table);
  this.fks.push(fk);
  alias ? this.aliases.push(alias) : this.aliases.push(child_table);
  return this;
};

KnexQuery.prototype.limitTo = function (num) {
  this.limit = num || this.limit;
  return this;
};

KnexQuery.prototype.orderBy = function (column, order) {
  if(!column || !order) {
    throw new Error('orderBy requires two arguments: the column you want to order by and either "asc" or "desc", respectively');
  }
  this.obcol = column;
  this.oborder = order;
  return this;
};

KnexQuery.prototype.exec = function () {
  let self = this;
  let thequery = this.knex(this.main_table).select();


  if(this.limit > 0) thequery = thequery.limit(this.limit);
  if(this.obcol) thequery = thequery.orderBy(this.obcol, this.oborder);

  if(Object.keys(this.query).length < 1) {
    return blah.call(this, thequery);
  } else {
    var keys = Array.from(Object.keys(this.query));
    var vals = keys.map(function(key) {
        return self.query[key];
    });
    keys.map((item, index) => {
      thequery = thequery.where(keys[index], vals[index]);
    });

    if(this.limit > 0) thequery = thequery.limit(this.limit);

    return blah.call(this, thequery);
  }
};

function blah(query) {
  var childQueries = this.child_tables.map(table => this.knex(table).select());
  return Promise
    .all([
      query,
      ...childQueries
    ])
    .then(data => {
      let [ main_table_results, ...othertables ] = data;
      main_table_results.forEach((mtres, mainindex) => {
        this.fks.map((fk, index) => {
          mtres[this.aliases[index]] = [];
          othertables[index].map(item => {
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
  if(!main_table || typeof knex !== 'function') {
    throw new Error('The initial instantiation requires two arguments: the instance of knex and the table which you are querying');
  }
  return new KnexQuery(knex, main_table);
};
