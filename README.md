## knex-populate

So many times, I wanted a way to populate things easily in KnexJS and there just wasn't any packages/tools to do that, so I wrote my own. This is 100% open source and open to the community for anyone who wants to help!

### Getting Started:
```
npm install --save knex-populate
```

### Definition
```
populate(
  knex_instance,
  parent_table,
  child_table,
  foreign_key_in_child_table,
  alias_for_field_in_resolved_object
  )
  .then(posts => res.send(posts));
```

### Usage (in Express):
```
var knex = require('../db/knex');
var populate = require('knex-populate');
...
router.get('/api/posts', function(req, res, next) {
  populate(knex, 'posts', 'comments', 'post_id', 'comments')
    .then(posts => res.send(posts));
});
```
