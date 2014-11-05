define(["common/collections/MultiMap"], function(MultiMap) {


    describe('MultiMap, pair = key/value', function() {
        var map = new MultiMap();

        describe('put()', function() {
            it('should insert three pairs, value is number', function() {
                map.put('key1', 1);
                map.put('key1', 0);
                map.put('second', 2);
            });

            it('Allows null and undefined values', function() {
                map.put('some', null);
                expect(map.get('some')).to.deep.equal([null]);
                map.put('some', undefined);
                expect(map.get('some')).to.deep.equal([null, undefined]);
            });

            it('Will allow duplicate values', function() {
                map.put('foo', 'bar');
                map.put('foo', 'bar');

                expect(map.get('foo')).to.deep.equal(['bar', 'bar']);
            });
        });

        describe('putIfAbsent', function() {
            it('Provides putIfAbsent to only allow for distinct values under a key', function() {
                map.put('foo', 'baz');
                map.putIfAbsent('foo', 'baz');

                expect(map.get('foo')).to.deep.equal(['bar', 'bar', 'baz']);
            });
        });

        describe('putAll()', function() {
            it('should insert an pair, value is number Array', function() {
                map.putAll('key1', [2, 3, 4, 5]);
            });
            it('should insert an pair, value is string Array', function() {
                map.putAll('cookies', ['oreo', 'peanut', 'sugar']);
            });
        });

        describe('get()', function() {
            it('gets number pair', function() {
                expect(map.get('second')).to.deep.equal([2]);
            });

            it('Returns an array of values or emptry array on get', function() {
                expect(map.get('key2')).to.deep.equal([]);
                expect(map.get('second')).to.be.instanceof(Array);
            });

            it('Allows multiple values to associate to a single key', function() {
                expect(map.get('key1')).to.deep.equal([1, 0, 2, 3, 4, 5]);
            });
        });

        describe('remove() & removeAll()', function() {
            it('Allows the removal of all values under a given key', function() {
                map.removeAll('key1');
                expect(map.get('key1')).to.deep.equal([]);
            });

            it('Removes the key when all its values are removed', function() {
                map.remove('second', 2);
                expect(map.get('second')).to.deep.equal([]);
            });

            it('Allows the removal of single values under a given key', function() {
                map.remove('cookies', 'peanut');
                expect(map.get('cookies')).to.deep.equal(['oreo', 'sugar']);
            });
        });


    });
});
