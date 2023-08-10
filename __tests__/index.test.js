const createKnexQuery = require('../index');

describe('KnexQuery', () => {
  // Mock knex and other dependencies here if needed
  let knexMock;
  const mainTable = 'main_table';

  beforeEach(() => {
    knexMock = jest.fn(); // Mock knex functions as needed
  });

  describe('constructor', () => {
    it('should instantiate KnexQuery with correct properties', () => {
      const query = createKnexQuery(knexMock, mainTable);

      expect(query.knex).toBe(knexMock);
      expect(query.main_table).toBe(mainTable);
      expect(query.child_tables).toEqual([]);
      expect(query.fks).toEqual([]);
      expect(query.aliases).toEqual([]);
      expect(query.query).toEqual({});
      expect(query.limit).toBe(0);
    });
  });

  describe('find', () => {
    it('should set the query property', () => {
      const query = createKnexQuery(knexMock, mainTable);
      const conditions = { column: 'value' };

      const result = query.find(conditions);

      expect(query.query).toEqual(conditions);
      expect(result).toBe(query);
    });
  });

  describe('findById', () => {
    it('should set the query property with id condition', () => {
      const query = createKnexQuery(knexMock, mainTable);
      const id = 123;

      const result = query.findById(id);

      expect(query.query).toEqual({ id });
      expect(result).toBe(query);
    });
  });

  describe('populate', () => {
    it('should add child table and foreign key information', () => {
      const query = createKnexQuery(knexMock, mainTable);
      const childTable = 'child_table';
      const fkColumn = 'fk_column';
      const alias = 'alias';

      const result = query.populate(childTable, fkColumn, alias);

      expect(query.child_tables).toEqual([childTable]);
      expect(query.fks).toEqual([fkColumn]);
      expect(query.aliases).toEqual([alias]);
      expect(result).toBe(query);
    });
  });

  describe('limitTo', () => {
    it('should set the limit property', () => {
      const query = createKnexQuery(knexMock, mainTable);
      const limit = 10;

      const result = query.limitTo(limit);

      expect(query.limit).toBe(limit);
      expect(result).toBe(query);
    });
  });

  describe('orderBy', () => {
    it('should set the orderBy properties', () => {
      const query = createKnexQuery(knexMock, mainTable);
      const column = 'column_name';
      const order = 'asc';

      const result = query.orderBy(column, order);

      expect(query.obcol).toBe(column);
      expect(query.oborder).toBe(order);
      expect(result).toBe(query);
    });

    it('should throw an error if column or order is missing', () => {
      const query = createKnexQuery(knexMock, mainTable);

      expect(() => {
        query.orderBy('column_name');
      }).toThrow('orderBy requires two arguments: the column you want to order by and either "asc" or "desc", respectively');
    });
  });
  
  describe('exec', () => {
    it('should execute the query and populate results correctly', async () => {
      // You need to mock the knex.select and Promise.all functions to test this properly
      const knexSelectMock = jest.fn(() => Promise.resolve([]));
      knexMock.mockReturnValue({ select: knexSelectMock });

      const query = createKnexQuery(knexMock, mainTable);
      query.populate('child_table', 'fk_column', 'alias');

      const result = await query.exec();
      console.log('result', result)

      // Write assertions to check if results are populated correctly
      // For example, check if aliases are correctly populated with child table data
      expect(result).toEqual([]);
      expect(knexMock).toHaveBeenCalledWith('child_table');
    });
  });
});