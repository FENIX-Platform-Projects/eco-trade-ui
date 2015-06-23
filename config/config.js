define({
    wds_config: {
        datasource: 'DEMO_FENIX',
        outputType: 'array'
    },
    map_config: {
        plugins: {
            zoomcontrol: 'topleft',
            zoomResetControl: false,
            controlloading: false,
            mouseposition: false,
            disclaimerfao: false,
            fullscreen: false,
            geosearch: false
        },
        guiController: {
            overlay: false,
            baselayer: false,
            wmsLoader: false
        }
    },
    filter_region: {
        bounds: {
            min: 2000,
            max: 2014
        },
        step: 1,
        defaultValues: {
            min: 2004,
            max: 2010
        }
    },
    queries: {
        test: 'SELECT year FROM ecotrade_region_trade',
        // REGIONS QUERIES
        table_region : "select year-1 || '/'|| year as season, coalesce(round(value,2)|| ' %', '-') as value from ecotrade.ecotrade_region_growth where year in ({year_list}) and commodity_code = '{commodity_code}' and trade_flow_code = '{trade_flow_code}'",
        map_region :   "select partner_code, value from ecotrade.ecotrade_region_trade where partner_code not in('WLD', 'WTN', 'WTO') and commodity_code ='{commodity_code}' and trade_flow_code ='{trade_flow_code}' and year = {year} order by year",
        region_within:  "select year,partner_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code in ('WTO', 'WTN') and  trade_flow_code = '{trade_flow_code}' and commodity_code ='{commodity_code}'",
        region_year : "select year,trade_flow_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code = 'WLD'  and trade_flow_code ='{trade_flow_code}' and commodity_code = '{commodity_code}' order by year",
        // COUNTRY QUERIES
        country_balance: "select year,commodity_label,value,um from ecotrade.ecotrade_country_tradebalance where year in ({year_list}) and reporter_code = '{reporter_code}' and commodity_code = '{commodity_code}'",
        country_bar: "select year,partner_label, value, um from ecotrade.ecotrade_country_trade where year in ({year_list}) and reporter_code = '{reporter_code}' and commodity_code = '{commodity_code}' and partner_code = 'WLD'",
        map_country: "select partner_code, value from ecotrade.ecotrade_country_trade where year = {year} and partner_code = '{partner_code}' and commodity_code = '{commodity_code}' and trade_flow_code = '{trade_flow_code}' ",
        map_partner:
        "select reporter_code, reporter_label, value from (" +
        "select distinct on(reporter_code, reporter_label)reporter_code, reporter_label, value from(" +
        "select reporter_code,reporter_label,  value" +
        "from ecotrade.ecotrade_country_trade" +
        "where year in ({year_list})" +
        "and partner_code = '{partner_code}'" +
        "and commodity_code = '{commodity_code}'" +
        "and trade_flow_code = '{trade_flow_code}'"+
        "group by value, reporter_code,reporter_label" +
        "order by reporter_code,value DESC) as v) as g" +
        "order by g.value desc ",
        map_subcommodities:"select reporter_label, value from ecotrade.ecotrade_country_subelements where year= {year} and partner_code ='{partner_code}' and reporter_code = '{reporter_code}' and " +
        "commodity_code = '{commodity_code}' and trade_flow_code = '{trade_flow_code}' order by value"
    }
});
