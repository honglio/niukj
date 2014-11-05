define(["common/collections/LinkedList"], function(LinkedList) {


    describe('LinkedList', function() {
        var list = new LinkedList();

        describe('push()', function() {
            it('push three numbers, should be push to the end in sequence', function() {
                list.push(1);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(1);
                list.push(0);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(0);
                list.push(-1);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(-1);
            });

            it('push two Arrays, should be push to the end in sequence', function() {
                list.push([2, 3, 4, 5]);
                expect(list.last()).to.deep.equal([2, 3, 4, 5]);
                list.push(['oreo', 'peanut', 'sugar']);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });

            it('Returns an undefined on empty push', function() {
                list.push();
                expect(list.last()).to.deep.equal(undefined);
            });

            it('Returns null values on null push', function() {
                list.push(null);
                expect(list.last()).to.deep.equal(null);
                list.push(undefined);
                expect(list.last()).to.deep.equal(undefined);
            });
        });


        describe('pop()', function() {
            it('should pop an element from the end', function() {
                list.pop();
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(null);
            });
            it('should pop two element from the end', function() {
                list.pop();
                list.pop();
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });
        });

        describe('shift()', function() {
            it('should delete an element from beginning of the list', function() {
                list.shift();
                expect(list.first()).to.deep.equal(0);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });
            it('should delete two elements from beginning of the list', function() {
                list.shift();
                list.shift();
                expect(list.first()).to.deep.equal([2, 3, 4, 5]);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });
        });

        describe('unshift()', function() {
            it('should insert an Array in the beginning', function() {
                list.unshift([2, 4, 5]);
                expect(list.first()).to.deep.equal([2, 4, 5]);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });

            it('should insert an string in the beginning', function() {
                list.unshift('zhang');
                expect(list.first()).to.deep.equal('zhang');
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });

            it('should insert an null in the beginning', function() {
                list.unshift(null);
                expect(list.first()).to.deep.equal(null);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });
        });

        describe('forEach()', function() {
            var list2 = new LinkedList();

            it("copy each element from list to list2", function() {
                // parameters: element, idx, array
                list.forEach(function(element) {
                    list2.push(element);
                });

                expect(list2.first()).to.deep.equal(null);
                expect(list2.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
            });
        });

    });
});
