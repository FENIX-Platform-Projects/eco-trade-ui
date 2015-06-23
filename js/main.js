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

        var countryController,regionController;



        $('#trade_tabs').find('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

            switch($(e.target).attr('href'))
            {
                case '#page_region':
                    if(!regionController) {
                        regionController = new RegionController(containers.region)
                        regionController.init();
                    }else{
                        regionController.reinitFilterValues();

                    }
                    break;
                case '#page_countries':

                    if(!countryController) {
                        countryController = new CountryController(containers.country)
                        countryController.init();
                    }else{
                        countryController.reinitFilterValues();
                    }
                break;
            }
        });
        regionController = new RegionController(containers.region)
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