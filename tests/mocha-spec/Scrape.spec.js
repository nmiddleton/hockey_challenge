const expect = require('chai').expect,
    sinon = require('sinon'),
    request = require('request-promise'),
    Scrape = require('../../src/app/Scrape'),
    eml_table_html = require('./stub_responses/EMLTablesResponse.js'),
    eml_fixtures_html = require('./stub_responses/EMLFixturesResponse.js'),
    expected_league_as_json = require('./expectations/expected_league_as_json.js'),
    expected_fixtures_as_json = require('./expectations/expected_fixtures_as_json.js');

let sandbox;
describe('Scraping..', function () {
    describe('the EML Tables', function () {
        // it('stubbing works', function () {
        //     request.get('something').then(function (result) {
        //         expect(result).to.equal(eml_table_html());
        //     });
        // });

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
            sandbox.stub(request, 'get').resolves(eml_table_html());

        });
        afterEach(function () {
            sandbox.restore();
        });
        it('should parse the html into an object', function (done) {
            Scrape().EMLTables().then(function (result) {
                expect(result).to.deep.equal(expected_league_as_json());
            }).done(done);
        });
        it('should collect the divisions so that we can then query the fixtures for each division', function (done) {
            let expected_league_divisions = [ '3se', '4se', '5se', '6se', '7se', '8se', '9se', '10se' ];
            Scrape().EMLTables().then(function (result) {
                expect(Scrape().getLeagueDivisions(result)).to.deep.equal(expected_league_divisions);
            }).done(done);
        });
    });
});

