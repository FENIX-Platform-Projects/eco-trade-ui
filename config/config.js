define({
	wds_config: {
        datasource: 'DEMO_FENIX',
		outputType: 'array'
	},
	queries: {
		test: 'SELECT year FROM ecotrade_region_trade',
//    "from country_stat where fertilizer = '{PRODUCT}' and country = '{COUNTRY}' and n_p = '{KIND}' ) c  join codes_elements on element = element_code WHERE value is not null ORDER BY element ASC, year ASC"
		// REGIONS QUERIES
		table_region : "select year, value from ecotrade.ecotrade_region_growth where year in (2004,2001,2002) and commodity_code = 'AGR' and trade_flow_code = 'EXP'",
		map_region :   "select partner_code, value from ecotrade.ecotrade_region_trade where commodity_code ='AGR' and trade_flow_code ='EXP' and year = '2002'",
		chart_within:  "select * from ecotrade.ecotrade_region_trade where year in (2001,2002) and partner_code in ('WTO', 'WTN') and  trade_flow_code = 'EXP' and commodity_code ='AGR'",
		chart_year :   "select * from ecotrade.ecotrade_region_trade where year in (2000,2001) and partner_code = '1' and trade_flow_code = 'EXP' and commodity_code = 'AGR'",

		// COUNTRY QUERIES

		// reporter o partner?
		trade_balance: "select year,commodity_label,value,um from ecotrade.ecotrade_country_tradebalance where year in (2001,2002,2003,2004) and partner_code = '19' and commodity_code = 'AGR'",
		bar_chart : "select year,commodity_label, value, um from ecotrade.ecotrade_country_trade where year in (2001,2002,2003,2004) and partner_code = '19' and commodity_code = 'AGR' and trade_flow_code = 'IMP'",
		map : "select * from ecotrade.ecotrade_country_trade where year = 2001 and partner_code = '19' and commodity_code = 'AGR' and trade_flow_code = 'IMP'"





	}
});
