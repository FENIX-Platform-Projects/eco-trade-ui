/*global requirejs*/
requirejs(['./paths'], function (paths) {

    paths.baseUrl = './';

    requirejs.config(paths);

    requirejs([
        'config/configContainer',
        'js/region/RegionController',
        'js/country/CountryController',

    ], function (containers,
        RegionController, CountryController) {

        var regionController = new RegionController(containers.region)
        regionController.init();
      /*  var countryController = new CountryController(containers.country)
        countryController.init();*/



        /*

         var wdsClient = new WDSClient(Config.wds_config);

         wdsClient.retrieve({
         payload: {
         query: Config.queries.test
         },
         success: function(resp) {
         console.log(resp);
         }
         });
         */
    });
});