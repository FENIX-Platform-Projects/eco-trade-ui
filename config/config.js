define({
	wds_config: {
        datasource: 'DEMO_FENIX',
		outputType: 'array'
	},
	filter_region: {
		bounds: {
			min: 2000,
			max: 2015
		},
		step: 1,
		defaultValues: {
			min: 2002,
			max: 2010
		}
	},
	queries: {
		test: 'SELECT year FROM ecotrade_region_trade',
//    "from country_stat where fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c  join codes_elements on element = element_code WHERE value is not null ORDER BY element ASC, year ASC"
		// REGIONS QUERIES
		table_region : "select year, value from ecotrade.ecotrade_region_growth where year in ({year_list}) and commodity_code = '{commodity_code}}' and trade_flow_code = '{trade_flow_code}'",
		map_region :   "select partner_code, value from ecotrade.ecotrade_region_trade where commodity_code ='{commodity_code}}' and trade_flow_code ='{trade_flow_code}' and year = '{year}' order by year",
		region_within:  "select year,partner_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code in ('WTO', 'WTN') and  trade_flow_code = '{trade_flow_code}' and commodity_code ='{commodity_code}'",
		region_year : "select year,trade_flow_label,value,um from ecotrade.ecotrade_region_trade where year in ({year_list}) and partner_code = 'WLD'  and trade_flow_code ='{trade_flow_code}' and commodity_code = '{commodity_code}' order by year",

		// COUNTRY QUERIES

		// reporter o partner?
		country_balance: "select year,commodity_label,value,um from ecotrade.ecotrade_country_tradebalance where year in ({year_list}) and partner_code = '{partner_code}' and commodity_code = '{commodity_code}'",
		country_bar : "select year,partner_label, value, um from ecotrade.ecotrade_country_trade where year in ({year_list}) and partner_code = '{partner_code}' and commodity_code = '{commodity_code}'",
		map : "select * from ecotrade.ecotrade_country_trade where year = {year} and partner_code = '{partner_code}' and commodity_code = '{commodity_code}' and trade_flow_code = '{trade_flow_code}' "

	}
});
