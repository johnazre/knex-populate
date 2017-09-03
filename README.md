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
```

### Definition
```
knex_populate(knex_instance, main_table)
  .populate(child_table, foreign_key, [ alias ])
  .then(results => res.send(results));
```

### Usage (in Express):
```
var knex = require('../db/knex');
var knex_populate = require('knex-populate');
...
router.get('/api/posts', function(req, res, next) {
  knex_populate(knex, 'posts')
    .populate('comments', 'post_id', 'comments')
    .then(results => res.send(results));
});
```
