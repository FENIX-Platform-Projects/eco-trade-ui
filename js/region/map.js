define([
    'jquery','underscore','bootstrap','handlebars','jstree','bootstrapslider',
    'Config',
    'WDSClient',
    'text!html/region/map.html',
    'text!fx-ui-table',    
    'fenix-ui-map'
], function (
    $, _, bootstrap, Handlebars, jstree, bootstrapslider,
    Config,
    WDSClient,
    tmplMap,
    tmplTable,
    FXMAP
) {
    'use strict';

    var tableGrowth = Handlebars.compile(tmplTable)

    var wdsClient = new WDSClient(Config.wds_config);

    function MAP(opts) {

        opts = opts || {};

        var self = this;

        self.o = _.defaults(opts, {
            selection: {
                year: null, //single year only for map
                year_list: '',
                commodity_code: null,
                trade_flow_code: null
            },
            selectedCountries: [],
            cl: {
                indicators: null
            },
            onChangeYear: $.noop
        });

        self.map = null;
        self.joinlayer = null;

        self.$container = (self.o.container instanceof jQuery) ? self.o.container : $(self.o.container);
        self.$container.append( Handlebars.compile(tmplMap)() );

        self.initMap('#map_partners_region');
        self.initYearSlider(this.o.selection);
        self.initGrowth(this.o.selection);
    };

    MAP.prototype.initGrowth = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.table_region,
                queryVars: selection
            },
            success: function (data) {
                $('#tab_growth', self.$container).html( tableGrowth({
                    headers: ['Period','Growth Rate'],
                    rows: data
                }) );
            }
        });
    };

    MAP.prototype.initYearSlider = function(selection) {

        var self = this;

        var years = selection.year_list.split(','),
            slideCfg = {
                value: parseInt(_.first(years)),
                min: parseInt(_.first(years)),
                max: parseInt(_.last(years)) + 1
            };

        if(self.$slider)
            self.$slider.slider('destroy');
        
        self.$slider = $('#filter_year_map', self.$container).slider(slideCfg);
        
        self.$slider.on('slide slideEnabled', _.debounce(function(e,sel) {
            $('#filter_year_map_label',self.container$).text('Year '+ sel.value );
            self.o.onChangeYear(sel.value);
            self.o.selection.year = sel.value;
            self.updateLayer(self.o.selection);
        }, 300));

        var label = 'Year '+_.first(years)+'-'+_.last(years);
        $('#filter_year_map_label',self.container$).text( label );
    };

    MAP.prototype.initMap = function(id) {

        var self = this;

        this.map = new FM.Map(id, Config.map_config);

        this.map.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: 'Country Boundaries',
            urlWMS: 'http://fenix.fao.org/geoserver',
            opacity: '0.9',
            zindex: '500',
            lang: 'en'
        }));

        this.map.createMap();
    };

    MAP.prototype.renderSelection = function(selection) {

        var self = this;

        self.o.selection = selection;

        if(self.o.selection.year == null)
            self.o.selection.year = selection.year_list.split(',')[0];

        self.initYearSlider(selection);
        self.initGrowth(selection);
        self.updateLayer(selection);
    };

    MAP.prototype.updateLayer = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.map_region,
                queryVars: selection
            },
            success: function(rawData) {

                var joinColumnlabel = 'areanamee',
                    joinColumn = 'adm0_code',
                    joinData = _.map(rawData, function(v) {
                        return _.object([v[0]], [v[1]]);
                    });
                
                if(self.joinlayer)
                    self.map.removeLayer(self.joinlayer);

                self.joinlayer = new FM.layer({
                    joindata: joinData,            
                    joincolumn: joinColumn,
                    joincolumnlabel: joinColumnlabel,
                    layers: 'fenix:gaul0_faostat_3857',
                    layertitle: "USD",
                    opacity: '0.8',            
                    mu: "USD",
                    legendsubtitle: "USD",
                    layertype: "JOIN",
                    jointype: "shaded",
                    openlegend: true,
                    defaultgfi: true,
                    colorramp: "Blues",
                    intervals: 7,
                    lang: "en",            
                    customgfi: {
                        showpopup: false,             
                        content: {
                            en: "{{"+joinColumn+"}}"
                        }
                        //TODO ,callback: _.bind(self.handleCountrySelection, self)
                    }
                });
                self.map.addLayer(self.joinlayer);
            }
        });        
    };

    MAP.prototype.zoomTo = function(codes) {
        this.map.zoomTo("country", "adm0_code", codes);
    };

    return MAP;
});