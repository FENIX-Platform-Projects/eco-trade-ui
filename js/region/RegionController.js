define([
    'jquery', 'underscore', 'bootstrap', 'handlebars',
    'Config',
    'WDSClient',
    './filter',
    './map',
    '../common/ChartsHandler'
], function ($, _, bootstrap, Handlebars,
             Config,
             WDSClient,
             Filter,
             regionMap,
             ChartsHandler) {

    'use strict'

    function RegionController(container){
        this.$container = container;
    };

    RegionController.prototype.init = function(){

        var self = this;

        var rmap, chartsHandler

        var filter = new Filter({
            container: self.$container,
            onSubmit: function (selection) {
                rmap.renderSelection(selection);
                chartsHandler.renderCharts(selection, Config.wds_config, true);
                $(self.$container+' section').show();
            }
        });

        rmap = new regionMap({
            container: self.$container,
            selection: {
                year_list: _.range(Config.filter_region.defaultValues.min, Config.filter_region.defaultValues.max).join()
            },
            onChangeYear: function (year) {
                console.log('MAP onChangeYear', year);
            }
        });

        chartsHandler = new ChartsHandler({
            container: self.$container,
            queries: Config.queries
        });

        $('section').not('#filter').hide();
    };

    return RegionController;
})
