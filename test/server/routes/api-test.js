/* jshint expr:true */
/**
 * Module dependencies
 */
// var should = require('should');
// var request = require('supertest');
// var app = require('../../../lib/server');
// var _ = require('lodash');

// function findAnObjectThatHasKeyAndValue(array, key, value) {
//   return _.find(array, function(element) {
//     return element[key] === value;
//   });
// }

// //TODO: Add some indirect indicators to page, to distinguish pages
// describe('Condo Search ', function() {

//   it('should render condo-search page on GET /condo-search', function(done) {
//     request(app)
//       .get('/condo-search')
//       .expect(200)
//       .end(done);
//   });

//   it('should return json on GET /condo-search/search', function(done) {
//     request(app)
//       .post('/condo-search/search')
//       .set('Content-Type', 'application/json')
//       .send({
//         rent: [0, 5300],
//         bedroom: [1, 8]
//       })
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         var condos = res.body;
//         var expectedKeys = ['type', 'properties', 'geometry'];
//         var expectedProperties = [
//           'mrt_minutes',
//           'grocery_minutes',
//           'id',
//           'display_name',
//           'street',
//           'units',
//           'completion_year',
//           'average_leases',
//           'country_expensiveness',
//           'facilities'
//         ];
//         condos.forEach(function(condo) {
//           condo.should.have.properties(expectedKeys);
//           condo.properties.should.have.properties(expectedProperties);
//           condo.properties.facilities.should.be.instanceOf(Array, 'facilities isn\'t an array');
//         });
//         done();
//       });
//   });

//   it('should return json on GET /condo-search/completion with min and max completion value', function(done) {
//     request(app)
//       .get('/condo-search/completion')
//       .expect(200)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         var result = res.body;
//         result.should.have.properties(['min', 'max']);
//         result.min.should.be.above(0);
//         result.max.should.be.above(0);
//         result.max.should.be.above(result.min);
//         done();
//       });
//   });

//   it('should return at most 25 condos when no location/landmarks are specified', function(done) {
//     request(app)
//      .post('/condo-search/search')
//      .set('Content-Type', 'application/json')
//       .send({
//         rent: [0, 5300],
//         bedroom: [1, 8]
//       })
//       .expect(200)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         var results = res.body;
//         results.length.should.be.below(26);
//         results.length.should.be.above(1);
//         done();
//       });
//   });

//   it('should return condos sorted by # of leases when no location/landmarks are specified', function(done) {
//     request(app)
//      .post('/condo-search/search')
//      .set('Content-Type', 'application/json')
//       .send({
//         rent: [0, 5300],
//         bedroom: [1, 8]
//       })
//       .expect(200)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         var results = res.body;
//         results.length.should.be.above(2);
//         var mostLeases = +results[0].properties.average_leases;
//         var secondMostLeases = +results[1].properties.average_leases;
//         var thirdMostLeases = +results[2].properties.average_leases;
//         mostLeases.should.be.above(secondMostLeases, 'not sorted');
//         secondMostLeases.should.be.above(thirdMostLeases, 'not sorted');
//         done();
//       });
//   });

//   it('should not be limited by 25 or sorted when location/landmarks are specified', function(done) {
//     request(app)
//      .post('/condo-search/search')
//      .set('Content-Type', 'application/json')
//       .send({
//         rent: [0, 5300],
//         bedroom: [1, 8],
//         location: [103.80739599999993, 1.291142] // alexis
//       })
//       .expect(200)
//       .end(function(err, res) {
//         if (err) {
//           return done(err);
//         }
//         var results = res.body;
//         results.length.should.be.above(25);
//         done();
//       });
//   });

//   describe('multiple locations api', function() {
//     var testLocationsData = {
//       'locations': [{
//         'name': 'school1',
//         'school': 'anglo-chinese-school-international'
//       }, {
//         'label': 'Amenity',
//         'amenity': 'cb-ang-mo-kio',
//       }, {
//         'label': 'Some street address',
//         'name': 'location-id',
//         'minutes_max': 15,
//         'modes': 'WALK,CAR',
//         'coordinates': {
//           'longitude': 103.89711399999999,
//           'latitude': 1.298744
//         }
//       }]
//     };

//     it('an empty array should be returned if no locations were sought for', function(done) {
//       request(app)
//       .post('/condo-search/search')
//       .set('Content-Type', 'application/json')
//       .send({
//         /* EMPTY OBJECT */
//       })
//       .expect(200)
//       .end(function(err, res) {
//         var condos = res.body;
//         should.exist(condos);
//         condos.should.not.be.empty;
//         var firstResultLocations = condos[0].properties.locations;
//         should.exist(firstResultLocations);
//         firstResultLocations.should.be.an.Array;
//         firstResultLocations.should.be.empty;
//         done();
//       });
//     });

//     it('should allow for search with multiple locations', function(done) {
//       request(app)
//       .post('/condo-search/search')
//       .set('Content-Type', 'application/json')
//       .send(testLocationsData)
//       .expect(200)
//       .end(function(err, res) {
//         var condos = res.body;
//         should.exist(condos);
//         condos.should.be.an.Array;
//         condos.should.not.be.empty;
//         var firstResultLocations = condos[0].properties.locations;
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'label', ''));
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'label', 'Some street address'));
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'label', 'Amenity'));
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'name', 'school1'));
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'name', ''));
//         should.exist(findAnObjectThatHasKeyAndValue(firstResultLocations, 'name', 'location-id'));
//         done();
//       });
//     });
//   });
// });
