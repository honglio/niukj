define(["common/collections/LinkedList"], function(LinkedList) {


    describe('LinkedList', function() {
        var list = new LinkedList();

        describe('push()', function() {
            it('push three numbers, should be push to the end in sequence', function() {
                list.push(1);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(1);
                expect(list.length).to.deep.equal(1);
                list.push(0);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(0);
                expect(list.length).to.deep.equal(2);
                list.push(-1);
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal(-1);
                expect(list.length).to.deep.equal(3);
            });

            it('push two Arrays, should be push to the end in sequence', function() {
                list.push([2, 3, 4, 5]);
                expect(list.last()).to.deep.equal([2, 3, 4, 5]);
                expect(list.length).to.deep.equal(4);
                list.push(['oreo', 'peanut', 'sugar']);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
                expect(list.length).to.deep.equal(5);
            });

            it('push an undefined', function() {
                list.push();
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
                expect(list.length).to.deep.equal(5);
            });

            it('push an null values', function() {
                list.push(null);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
                expect(list.length).to.deep.equal(5);
                list.push(undefined);
                expect(list.last()).to.deep.equal(['oreo', 'peanut', 'sugar']);
                expect(list.length).to.deep.equal(5);
            });
        });


        describe('pop()', function() {
            it('should pop an element from the end', function() {
                list.pop();
                expect(list.first()).to.deep.equal(1);
                expect(list.last()).to.deep.equal([2, 3, 4, 5]);
                expect(list.length).to.deep.equal(4);
            });
            it('should pop two element from the end', function() {
                list.pop();
                list.pop();
                expect(list.last()).to.deep.equal(0);
                expect(list.length).to.deep.equal(2);
            });
            it('should pop two element from the end', function() {
                list.pop();
                list.pop();
                expect(list.first()).to.deep.equal(null);
                expect(list.last()).to.deep.equal(null);
                expect(list.length).to.deep.equal(0);
            });
            it('should not pop element from the end', function() {
                list.pop();
                list.pop();
                expect(list.first()).to.deep.equal(null);
                expect(list.last()).to.deep.equal(null);
                expect(list.length).to.deep.equal(0);
            });
        });

        describe('shift()', function() {
            it('should delete an element from beginning of the list', function() {
                list.push(1);
                list.push(2);
                list.push(3);
                list.shift();
                expect(list.first()).to.deep.equal(2);
                expect(list.last()).to.deep.equal(3);
                expect(list.length).to.deep.equal(2);
            });
            it('should delete two elements from beginning of the list', function() {
                list.shift();
                list.shift();
                expect(list.first()).to.deep.equal(null);
                expect(list.last()).to.deep.equal(null);
                expect(list.length).to.deep.equal(0);
            });
            it('should not delete two elements from beginning of the list', function() {
                list.shift();
                list.shift();
                expect(list.first()).to.deep.equal(null);
                expect(list.last()).to.deep.equal(null);
                expect(list.length).to.deep.equal(0);
            });
        });

        describe('unshift()', function() {
            it('should insert an Array in the beginning', function() {
                list.unshift([2, 4, 5]);
                expect(list.first()).to.deep.equal([2, 4, 5]);
                expect(list.last()).to.deep.equal([2, 4, 5]);
                expect(list.length).to.deep.equal(1);
            });

            it('should insert an string in the beginning', function() {
                list.unshift('zhang');
                expect(list.first()).to.deep.equal('zhang');
                expect(list.last()).to.deep.equal([2, 4, 5]);
                expect(list.length).to.deep.equal(2);
            });

            it('should not insert an null in the beginning', function() {
                list.unshift(null);
                expect(list.first()).to.deep.equal('zhang');
                expect(list.last()).to.deep.equal([2, 4, 5]);
                expect(list.length).to.deep.equal(2);
            });
        });

        describe('forEach()', function() {
            var list2 = new LinkedList();

            it("copy each element from list to list2", function() {
                // parameters: element, idx, array
                list.forEach(function(element) {
                    list2.push(element);
                });

                expect(list2.first()).to.deep.equal('zhang');
                expect(list2.last()).to.deep.equal([2, 4, 5]);
                expect(list2.length).to.deep.equal(2);
            });
        });

    });
});
