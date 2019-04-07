// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const browserstack = require('browserstack-local');
const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  // seleniumAddress: 'http://localhost:4444/wd/hub'
  'seleniumAddress': 'http://hub-cloud.browserstack.com/wd/hub',
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserstack.user': 'annmensah1',
    'browserstack.key': 'tJzJsAdBFM4kFvnqXfFH',
    'browserstack.local': true,
    'browserName': 'chrome'
  },
  plugins: [{
    package: 'protractor-browserstack-reporter'
  }],
  // directConnect: true,
  // baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  // Code to start browserstack local before start of test
  beforeLaunch: function(){
    console.log("Connecting local");
    return new Promise(function(resolve, reject){
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.capabilities['browserstack.key'] }, function(error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function(){
    return new Promise(function(resolve, reject){
      exports.bs_local.stop(resolve);
    });
  }
};
