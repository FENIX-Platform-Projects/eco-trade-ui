/*global requirejs*/
requirejs(['./paths'], function (paths) {

	requirejs.config(paths);

	requirejs([
		'jquery','underscore','bootstrap','handlebars',
		'WDSClient',
		'../config/config'
	], function ($, _, bootstrap, Handlebars,
		WDSClient,
		Config
	) {

		var wdsClient = new WDSClient(Config.wds_config);

		wdsClient.retrieve({
			payload: {
			    query: Config.queries.test
			},
			success: function(resp) {
			    console.log(resp);
			}
		});

	});
});