/*global requirejs*/
requirejs(['./paths'], function (paths) {

    paths.baseUrl = './';

    requirejs.config(paths);

    requirejs([
        'jquery','underscore',
        'config/configContainer',
        'js/region/RegionController',
        'js/country/CountryController',

    ], function ($, _, 
        containers,
        RegionController, CountryController) {

        var region = _.once(function() {
            var regionController = new RegionController(containers.region)
            regionController.init();                    
        });

        var country = _.once(function() {
            var countryController = new CountryController(containers.country)
            countryController.init();                    
        });

        $('#trade_tabs').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

            switch($(e.target).attr('href'))
            {
                case '#page_region':
                    region();
                break;
                case '#page_countries':
                    country();
                break;
            }
        });
        region();

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