/*global requirejs*/
requirejs(['./paths'], function (paths) {

    paths.baseUrl = './';

    requirejs.config(paths);

    requirejs([
        'js/region/RegionController',
        'js/country/CountryController'

    ], function (RegionController, CountryController) {

        var regionController = new RegionController('#page_region')
        regionController.init();


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