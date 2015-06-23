define([
    'jquery', 'underscore', 'bootstrap', 'handlebars',
    'Config',
    'WDSClient',
    './../common/filter',
    './map',
    '../common/ChartsHandler'
], function ($, _, bootstrap, Handlebars,
             Config,
             WDSClient,
             Filter,
             regionMap,
             ChartsHandler) {

    'use strict'

    function RegionController(regionContainers){
        this.$containers = regionContainers;
    };

    RegionController.prototype.init = function(){

        var self = this;

        var rmap, chartsHandler
        $(self.$containers.container).show()
        console.log(self.$containers.container);

        var filter = new Filter({
            container: self.$containers.container,
            filters: self.$containers.filters,
            isCountry: false,
            onSubmit: function (selection) {
                rmap.renderSelection(selection);
                chartsHandler.renderCharts(selection, Config.wds_config, false);
            }
        });

        rmap = new regionMap({
            container: self.$containers.container,
            selection: {
                year_list: _.range(Config.rangeslider_config.defaultValues.min, Config.rangeslider_config.defaultValues.max).join()
            },
            onChangeYear: function (year) {
                console.log('MAP onChangeYear', year);
            }
        });

        chartsHandler = new ChartsHandler({
            container: self.$containers.container,
            queries: Config.queries
        });



    };

    return RegionController;
})
