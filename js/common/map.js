define([
    'jquery','underscore','bootstrap','handlebars','jstree','bootstrapslider',
    'Config',
    'Codelists',
    'WDSClient',
    'text!html/region/map.html',
    'text!fx-ui-table',    
    'fenix-ui-map'
], function (
    $, _, bootstrap, Handlebars, jstree, bootstrapslider,
    Config,
    Codelists,
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
                year: Config.rangeslider_config.defaultValues.min, //single year only for map
                year_list: _.range(
                    Config.rangeslider_config.defaultValues.min,
                    Config.rangeslider_config.defaultValues.max+1
                ).join(','),
                commodity_code: null,
                trade_flow_code:'EXP'
            },
            selectedCountries: [],
            cl: {
                indicators: null
            },
            onChangeYear: $.noop
        });

        self.map = null;
        self.joinlayer = null;
        self.slider = null;

        self.$container = (self.o.container instanceof jQuery) ? self.o.container : $(self.o.container);
        self.$container.append( Handlebars.compile(tmplMap)() );

        self.initMap('#map_partners');
        self.initYearSlider(self.o.selection);        
        self.initGrowth(self.o.selection);
    };

    MAP.prototype.initPartners = function(selection) {

        var self = this;

        wdsClient.retrieve({
            payload: {
                query: Config.queries.region_partners,
                queryVars: selection
            },
            success: function (data) {

                data = _.map(data, function(v) {
                    return v;
                });

                $('#filter_partner_code', self.$container).html( tableGrowth({
                    headers: ['Partner', selection.year+' (USD)'],
                    rows: data
                }) );
            }
        });
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
                id: 'filter_year_map',
                tooltip: 'always',
                value: parseInt(_.first(years)),
                min: parseInt(_.first(years)),
                max: parseInt(_.last(years))
            };

        if(!self.slider)
        {
            self.slider = $('#filter_year_map', self.$container).bootstrapSlider(slideCfg);
            self.slider.on('slideStop', function(sel) {
                self.o.onChangeYear( sel.value );
                self.o.selection.year = sel.value;
                self.updateLayer(self.o.selection);
                self.initPartners(self.o.selection);
            });
        }
        else {
            self.slider.bootstrapSlider('setAttribute','min', slideCfg.min);
            self.slider.bootstrapSlider('setAttribute','max', slideCfg.max);
            self.slider.bootstrapSlider('setValue', slideCfg.min);
        }
        selection.year = slideCfg.value;
        self.updateLayer(selection);
        self.initPartners(selection);        
    };

    MAP.prototype.initMap = function(id) {

        this.map = new FM.Map(id, Config.map_config);
        this.map.addLayer(new FM.layer({
            layers: 'fenix:gaul0_line_3857',
            layertitle: 'Country Boundaries',
            urlWMS: 'http://fenix.fao.org/geoserver',
            opacity: 1,
            zindex: '500',
            lang: 'en'
        }));
        this.map.createMap(40,0);
    };

    MAP.prototype.renderSelection = function(selection) {

        var self = this;

        self.o.selection = selection;

        if(!self.o.selection.year)
            self.o.selection.year = selection.year_list.split(',')[0];
        if(!self.o.selection.trade_flow_code)
            self.o.selection.trade_flow_code = 'EXP';

        self.initYearSlider(self.o.selection);
        self.initGrowth(self.o.selection);
        self.updateLayer(self.o.selection);
    };

    MAP.prototype.updateLayer = function(selection) {

        var self = this;

        console.log(selection);

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
                    ranges: Config.legend_config[ selection.trade_flow_code ].ranges,
                    joindata: joinData,            
                    joincolumn: joinColumn,
                    joincolumnlabel: joinColumnlabel,
                    layers: 'fenix:gaul0_faostat_3857',
                    layertitle: Config.legend_config[ selection.trade_flow_code ].title,
                    opacity: 1,            
                    mu: "US$",
                    legendsubtitle: "",
                    layertype: "JOIN",
                    jointype: "shaded",
                    openlegend: true,
                    defaultgfi: true,
                    colorramp: Config.legend_config[ selection.trade_flow_code ].colors,
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