## knex-populate

This tool/plugin/add-on allows you to populate foreign key fields in the JSON response. You can get the same information from a JOIN, however, the amount of code that it takes to put that together could be large, depending on the tables involved any any aliases you want to add. This is an alternative method of doing that for "cleaner" response objects. Mimics the structure of responses from Mongoose/MongoDB and SailsJS/Waterline.

#### Example:

##### Without populate:
```
Post:
{
  id: 1,
  post_title: 'some clever title',
  post_body: 'some interesting content'
}

Comment:
{
  id: 1,
  comment_text: 'hello world',
  post_id: 1
},
{
  id: 2,
  comment_text: 'hello world again',
  post_id: 1
},
{
  id: 2,
  comment_text: 'hello world yet again',
  post_id: 2
}
```

##### With populate:
```
{
  id: 1,
  post_title: 'some clever title',
  post_body: 'some interesting content',
  comments: [{
      id: 1,
      text: 'hello world',
      post_id: 1
    },
    {
      id: 2,
      text: 'hello world again',
      post_id: 1
    }]
}
```

## Getting Started:
```
npm install --save knex
npm install --save knex-populate

# Then add one of the following (adding a --save) flag:
$ npm install pg
$ npm install sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install mariasql
$ npm install strong-oracle
$ npm install oracle
$ npm install mssql
```

### Definition
```
knex_populate(knex_instance, main_table)
  .find(object_with_query_params(if any))
  .populate(referenced_table, foreign_key, [ alias ])
  .exec()
  .then(results => res.send(results));
```

NOTE: You can chain more than one of the `populate` methods together if you have more than one foreign key that you want to populate!

### Usage (in Express):
```
var knex = require('../db/knex');
var knex_populate = require('knex-populate');
...
router.get('/api/posts', function(req, res, next) {
  knex_populate(knex, 'posts')
    .find()
    .populate('comments', 'post_id', 'comments')
    .limitTo(5)
    .exec()
    .then(results => res.send(results));
});
```

### Chainable methods:

* `find({})` - **(required as first chained method)** - Takes an argument of an object containing any search criteria. Example: `find({name: "David"})`

* `limitTo(number)` - Takes a number as an argument. Will limit the results to that number of results.

* `orderBy(columnName, order)` - Takes two arguments. First argument is the column to be ordered by and the second argument is either "asc" or "desc".

* `.populate(referenced_table, foreign_key, [ alias ])` - Takes three arguments. First argument is the table to be referenced regarding the foreign key. Second argument is the foreign key in the referenced table. Third argument is optional, but if you want the populated foreign key to be called something specific, you can do that there.

* `exec` - **(required as the last chained method before .then)** Takes no arguments, but is required to execute the query.
