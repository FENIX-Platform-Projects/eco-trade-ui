/*global requirejs*/
requirejs(['./paths'], function (paths) {

    paths.baseUrl = './';

    requirejs.config(paths);

    requirejs([
        'jquery', 'underscore', 'bootstrap', 'handlebars',
        'Config',
        'WDSClient',
        'js/region/filter',
        'js/region/map',
        'chartsHandler'
    ], function ($, _, bootstrap, Handlebars,
                 Config,
                 WDSClient,
                 Filter,
                 regionMap,
                 ChartsHandler) {

        var rmap, chartsHandler

        var filter = new Filter({
            container: '#page_region',
            onSubmit: function (selection) {
                rmap.renderSelection(selection);
                chartsHandler.renderCharts(selection, Config.wds_config, true);
            }
        });

        rmap = new regionMap({
            container: '#page_region',
            selection: {
                year_list: _.range(Config.filter_region.defaultValues.min, Config.filter_region.defaultValues.max).join()
            },
            onChangeYear: function (year) {
                console.log('MAP onChangeYear', year);
            }
        });

        chartsHandler = new ChartsHandler({
            container: '#page_region',
            queries: Config.queries
        });
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