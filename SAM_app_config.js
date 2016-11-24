// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var inv_metric_config_array={};


// This sets a value in the config array after retreiving it from the APP section of the component
// config information.  It returns a speficied default value if the specified pv_config_item does not
// exist or is unset.

function set_config_var_from_app_with_default(short_name, pv_config_item, defval) 
{
	var config_setting=defval;

	logP4Msg("set_config_var_from_app_with_default", "SAM", "short name: "+ short_name + "  pv_config_item: " +pv_config_item + " default value: "+defval);
	//nilStatus("PV.APP.INV", PV.configuration.APP["INV"]);
	//logStatus("PV-APP-shelf", PV.configuration.APP["INV_EQUIPMENT_SHELF"]);

	if (isDef(PV.configuration["APP"])) 
	{
		if (isDef(PV.configuration.APP[pv_config_item]))  
		{
			//nilStatus(pv_config_item, PV.configuration.APP[pv_config_item]);
			config_setting = PV.configuration.APP[pv_config_item];
		} 
		else 
		{
			config_setting = defval;
		}
	} // APP 


	if (config_setting == "TRUE") 
	{
	    config_setting = true;
	} 
	else 
	{
	    if (config_setting ==  "FALSE") 
	    {
	    	config_setting = false;
	    }
	}

	inv_metric_config_array[short_name]=config_setting;

	logP3Msg("set_config_var_from_app_with_default", "SAM", short_name + " set to "+config_setting);

}


// This retrieves a config item from the top level of the current DC component configuration data

function get_config_var_from_comp(pv_config_item) {

	var config_setting = undefined;

	logP3Msg("get_config_var_from_comp", "SAM", "pv_config_item: " +pv_config_item);

	if (isDef(PV.configuration[pv_config_item]))  
	{
		//nilStatus(pv_config_item, PV.configuration.APP[pv_config_item]);

	    config_setting = PV.configuration[pv_config_item];

	}

	return config_setting;
}


function set_config_var_from_comp_with_default(short_name, pv_config_item, defval) {

	var config_setting=defval;

	logP4Msg("set_config_var_from_comp_with_default", "SAM", "short name: "+ short_name + "  pv_config_item: " +pv_config_item + " default value: "+defval);
//	nilStatus("PV.APP.INV", PV.configuration.APP["INV"]);
//	logStatus("PV-APP-shelf", PV.configuration.APP["INV_EQUIPMENT_SHELF"]);

	if (isDef(PV.configuration[pv_config_item]))  {
//	nilStatus(pv_config_item, PV.configuration.APP[pv_config_item]);

	    config_setting = PV.configuration[pv_config_item];
	} else {
	    config_setting = defval;
	}



	if (config_setting == "TRUE") {
	    config_setting = true;
	} else {
	    if (config_setting ==  "FALSE") {
		config_setting = false;
	    }
	}
       

	inv_metric_config_array[short_name]=config_setting;

	logP3Msg("set_config_var_from_comp_with_default", "SAM", short_name + " set to "+config_setting);

}



function isDefAppConfig(pv_config_item) {
  if (isDef(PV.configuration["APP"])) {
    if (isDef(PV.configuration.APP[pv_config_item]))  {
      return true;
    }
  }
  return false;
}






function isConfig(name) {
	if (isDef(inv_metric_config_array[name])) {
		return inv_metric_config_array[name];
		}

	return false;

	}


function app_config_value(name) {
	if (isDef(inv_metric_config_array[name])) {
		return inv_metric_config_array[name];
		}
}


function set_app_config_array_value(name, value) {
    inv_metric_config_array[name]=value;
}


function make_sure_its_numeric(name) {
    inv_metric_config_array[name]=(+inv_metric_config_array[name]);
    /*
    if (isNaN(inv_metric_config_array[name])) {
	    logP4Msg("make_sure_its_numeric", "SAM_app_config", "Not a number!!");
	} else {
	    logP4Msg("make_sure_its_numeric", "SAM_app_config", "Seems to be a number!!");
    }
    */
}


function read_inventory_config() 
{

    //var collector_list, collectors, n, j, jstr;
    //var my_collector;

    var filter_array = {
	"include_hw_env":"INC_FILTER_EQUIPMENT_HW_ENVIRONMENT",
	"include_phys_port":"INC_FILTER_EQUIPMENT_PHYSICAL_PORT",
	"include_shelf":"INC_FILTER_EQUIPMENT_SHELF",
	"include_lag":"INC_FILTER_LAG_INTERFACE",
	"include_mpls_int":"INC_FILTER_MPLS_INTERFACE",
	"include_mpls_lsp":"INC_FILTER_MPLS_DYNAMIC_LSP",
	"include_mesh_sdp":"INC_FILTER_SVT_MESH_SDP_BINDING",
	"include_mirror_sdp":"INC_FILTER_SVT_MIRROR_SDP_BINDING",
	"include_spoke_sdp":"INC_FILTER_SVT_SPOKE_SDP_BINDING",
	"include_ies_accint":"INC_FILTER_IES_L3_ACCESS_INTERFACE",
	"include_mirror_accint":"INC_FILTER_MIRROR_L2_ACCESS_INTERFACE",
	"include_vll_accint":"INC_FILTER_VLL_L2_ACCESS_INTERFACE",
	"include_vpls_accint":"INC_FILTER_VPLS_L2_ACCESS_INTERFACE",
	"include_vprn_accint":"INC_FILTER_VPRN_L3_ACCESS_INTERFACE",
	"include_icmp_ping":"INC_FILTER_ICMP_PING",
	"include_atm_ping":"INC_FILTER_ATM_PING",
	"include_sdp_ping":"INC_FILTER_SDP_PING",
	"include_mpls_ping":"INC_FILTER_MPLS_PING",
	"include_mac_ping":"INC_FILTER_MAC_PING",
	"include_vccv_ping":"INC_FILTER_VCCV_PING",
	"include_tunnel_ping":"INC_FILTER_TUNNEL_PING",
	"include_service_site_ping":"INC_FILTER_SERVICE_SITE_PING",
	"include_net_queue":"INC_FILTER_NETWORK_QUEUE",
	"include_channel_sts1":"INC_FILTER_CHANNEL_STS1",
	"include_channel_sts3":"INC_FILTER_CHANNEL_STS3",
	"include_channel_sts12":"INC_FILTER_CHANNEL_STS12",
	"include_channel_sts48":"INC_FILTER_CHANNEL_STS48",
	"include_channel_sts192":"INC_FILTER_CHANNEL_STS192",
	"include_channel_ds1e1":"INC_FILTER_CHANNEL_DS1E1",
	"include_channel_ds3e3":"INC_FILTER_CHANNEL_DS3E3",
	"include_channel_trib":"INC_FILTER_CHANNEL_TRIB",
	"include_channel_tu3":"INC_FILTER_CHANNEL_TU3",
	"include_channel_trib_group":"INC_FILTER_CHANNEL_TRIB_GROUP",
	"include_channel_tug3_group":"INC_FILTER_CHANNEL_TUG3_GROUP",
	"include_channel_ds0_group":"INC_FILTER_CHANNEL_DS0_GROUP",
	"include_ppp_protocol":"INC_FILTER_PPP_CONTROL_PROTOCOL",
	"include_ppp_interface":"INC_FILTER_PPP_INTERFACE",
	"include_virtual_router":"INC_FILTER_VIRTUAL_ROUTER",
	"include_ipipe_l2accessinterface":"INC_FILTER_IPIPE_L2_ACCESS_INTERFACE",
	"include_equipment_card_slot":"INC_FILTER_EQUIPMENT_CARD_SLOT",
	"include_cfm_loopback":"INC_FILTER_CFM_LOOPBACK",
	"include_cfm_oneway_delay":"INC_FILTER_CFM_ONEWAY_DELAY",
	"include_cfm_twoway_delay":"INC_FILTER_CFM_TWOWAY_DELAY",
	"include_cfm_ethernet":"INC_FILTER_CFM_ETHERNET",
	"include_aosqos_policy":"INC_FILTER_AOSQOS_POLICY",
	"include_mpls_site":"INC_FILTER_MPLS_SITE",
	"include_svq_aggregation_scheduler":"INC_FILTER_SVQ_AGGREGATION_SCHEDULER",
	"include_vprn_service_access_point":"INC_FILTER_VPRN_SERVICE_ACCESS_POINT",
	"include_ies_service_access_point":"INC_FILTER_IES_SERVICE_ACCESS_POINT",
	"include_cfm_single_ended_loss":"INC_FILTER_CFM_SINGLE_ENDED_LOSS",
	"exclude_hw_env":"EXC_FILTER_EQUIPMENT_HW_ENVIRONMENT",
	"exclude_phys_port":"EXC_FILTER_EQUIPMENT_PHYSICAL_PORT",
	"exclude_shelf":"EXC_FILTER_EQUIPMENT_SHELF",
	"exclude_lag":"EXC_FILTER_LAG_INTERFACE",
	"exclude_mpls_int":"EXC_FILTER_MPLS_INTERFACE",
	"exclude_mpls_lsp":"EXC_FILTER_MPLS_DYNAMIC_LSP",
	"exclude_mesh_sdp":"EXC_FILTER_SVT_MESH_SDP_BINDING",
	"exclude_mirror_sdp":"EXC_FILTER_SVT_MIRROR_SDP_BINDING",
	"exclude_spoke_sdp":"EXC_FILTER_SVT_SPOKE_SDP_BINDING",
	"exclude_ies_accint":"EXC_FILTER_IES_L3_ACCESS_INTERFACE",
	"exclude_mirror_accint":"EXC_FILTER_MIRROR_L2_ACCESS_INTERFACE",
	"exclude_vll_accint":"EXC_FILTER_VLL_L2_ACCESS_INTERFACE",
	"exclude_vpls_accint":"EXC_FILTER_VPLS_L2_ACCESS_INTERFACE",
	"exclude_vprn_accint":"EXC_FILTER_VPRN_L3_ACCESS_INTERFACE",
	"exclude_icmp_ping":"EXC_FILTER_ICMP_PING",
	"exclude_atm_ping":"EXC_FILTER_ATM_PING",
	"exclude_sdp_ping":"EXC_FILTER_SDP_PING",
	"exclude_mpls_ping":"EXC_FILTER_MPLS_PING",
	"exclude_mac_ping":"EXC_FILTER_MAC_PING",
	"exclude_vccv_ping":"EXC_FILTER_VCCV_PING",
	"exclude_tunnel_ping":"EXC_FILTER_TUNNEL_PING",
	"exclude_service_site_ping":"EXC_FILTER_SERVICE_SITE_PING",
	"exclude_net_queue":"EXC_FILTER_NETWORK_QUEUE",
	"exclude_channel_sts1":"EXC_FILTER_CHANNEL_STS1",
	"exclude_channel_sts3":"EXC_FILTER_CHANNEL_STS3",
	"exclude_channel_sts12":"EXC_FILTER_CHANNEL_STS12",
	"exclude_channel_sts48":"EXC_FILTER_CHANNEL_STS48",
	"exclude_channel_sts192":"EXC_FILTER_CHANNEL_STS192",
	"exclude_channel_ds1e1":"EXC_FILTER_CHANNEL_DS1E1",
	"exclude_channel_ds3e3":"EXC_FILTER_CHANNEL_DS3E3",
	"exclude_channel_trib":"EXC_FILTER_CHANNEL_TRIB",
	"exclude_channel_tu3":"EXC_FILTER_CHANNEL_TU3",
	"exclude_channel_trib_group":"EXC_FILTER_CHANNEL_TRIB_GROUP",
	"exclude_channel_tug3_group":"EXC_FILTER_CHANNEL_TUG3_GROUP",
	"exclude_channel_ds0_group":"EXC_FILTER_CHANNEL_DS0_GROUP",
	"exclude_ppp_protocol":"EXC_FILTER_PPP_CONTROL_PROTOCOL",
	"exclude_ppp_interface":"EXC_FILTER_PPP_INTERFACE",
	"exclude_virtual_router":"EXC_FILTER_VIRTUAL_ROUTER",
	"exclude_ipipe_l2accessinterface":"EXC_FILTER_IPIPE_L2_ACCESS_INTERFACE",
	"exclude_equipment_card_slot":"EXC_FILTER_EQUIPMENT_CARD_SLOT",
	"exclude_cfm_loopback":"EXC_FILTER_CFM_LOOPBACK",
	"exclude_cfm_oneway_delay":"EXC_FILTER_CFM_ONEWAY_DELAY",
	"exclude_cfm_twoway_delay":"EXC_FILTER_CFM_TWOWAY_DELAY",
	"exclude_cfm_ethernet":"EXC_FILTER_CFM_ETHERNET",
	"exclude_aosqos_policy":"EXC_FILTER_AOSQOS_POLICY",
	"exclude_mpls_site":"EXC_FILTER_MPLS_SITE",
	"exclude_svq_aggregation_scheduler":"EXC_FILTER_SVQ_AGGREGATION_SCHEDULER",
	"exclude_vprn_service_access_point":"EXC_FILTER_VPRN_SERVICE_ACCESS_POINT",
	"exclude_ies_service_access_point":"EXC_FILTER_IES_SERVICE_ACCESS_POINT",
	"exclude_cfm_single_ended_loss":"EXC_FILTER_CFM_SINGLE_ENDED_LOSS"
    };

    /*

	if (isConfig("inv_ies_accint") || isConfig("inv_mirror_accint") || isConfig("inv_vll_accint") || isConfig("inv_vpls_accint") || isConfig("inv_vprn_accint")) {
		inv_metric_config_array["inv_accint"] = true;
	} else {
		inv_metric_config_array["inv_accint"] = false;
		logP3Msg("set_config_var_from_app", "SAM", "No AccessInterface types configured for inventory");
		}
    */


	// filtering by IP address config items
	for (var i in filter_array) {
	logP3Msg("set_config_var_from_app", "SAM", "filter "+ i + " " + filter_array[i]);

	    set_config_var_from_app_with_default(i, filter_array[i], nil);
	}

	//set_config_var_from_app_with_default("file_policy_period", "FILE_POLICY_PERIOD", "901");
	set_config_var_from_app_with_default("file_period", "FILE_PERIOD", "900");

	set_config_var_from_app_with_default("inv_uses_names","INV_USES_NAMES",true);

	set_config_var_from_app_with_default("SAM_SERVER_VERSION", "SAM_SERVER_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_VERSION");

	if (app_config_value("SAM_SERVER_VERSION") == 0) {
	    	logP1Msg("inventory_config", "SAM", "sam server version (APP.SAM_SERVER_VERSION) needs to be set -- FATAL error");
		PV.halt();
	}

	set_config_var_from_app_with_default("SAM_SERVER_RELEASE_VERSION", "SAM_SERVER_RELEASE_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_RELEASE_VERSION");

	if (app_config_value("SAM_SERVER_RELEASE_VERSION") == 0)
	{
        logP1Msg("inventory_config", "SAM", "sam server release version (APP.SAM_SERVER_RELEASE_VERSION) needs to be set -- FATAL error");
        PV.halt();
    }
	
	//Parameter below should be obsolete
	//set_config_var_from_comp_with_default("collector", "COLLECTOR");

	set_samif_availability_status_config("do_access_interface_inventory");

	//COLLECTOR_LIST will only be 1 value, unlike find2file which will have 2 consistently
	//collector_list = get_config_var_from_comp("COLLECTOR_LIST");

	//These logs should be irrelevant
	/*
	logP3Msg("inventory_config", "SAM", "collector: " + app_config_value("collector"));
	logP3Msg("inventory_config", "SAM", "SAM_SERVER_VERSION: " + app_config_value("SAM_SERVER_VERSION"));
	logP3Msg("inventory_config", "SAM", "SAM_SERVER_RELEASE_VERSION: " + app_config_value("SAM_SERVER_RELEASE_VERSION"));
	logP3Msg("inventory_config", "SAM", "collector list: " + collector_list);
	*/
	/*
	if (isUndef(collector_list)) {
	    	logP1Msg("inventory_config", "SAM", "collector list undefined -- needs to be set -- FATAL error");
		PV.halt();
	}
	*/

	//	collector_list = collector_list.replace(/\s/g, "");   // remove any spaces that might be in there -- does not work!
	
	//Collector list no longer important
	/*
	logP3Msg("inventory_config", "SAM", "collector list: " + collector_list);

	n=collector_list.indexOf(",");
	// no comma means 1 collector listed at most
	if (n>0) {
	    collectors = collector_list.split(",");
	} else {
	    // degenerate 1-collector case, maybe OK for testing?
	    collectors=[collector_list];
	}
	
	my_collector = parseInt(app_config_value("collector"));

	n=0;
	for (var i in collectors) {
	    jstr= collectors[i];
	    j= parseInt(jstr);


	    if (!isNaN(j)) {
	    n++;
	    if (j == my_collector){
		    logP3Msg("inventory_config", "SAM", "my collector (polled collector) set to: _" +j+"_");
			    set_app_config_array_value("polled_stats_collector", j);
	    } else {
		if (isUndef(app_config_value("accounting_stats_collector"))) {
		    logP3Msg("inventory_config", "SAM", "accounting collector set to: _" +j+"_");
			    set_app_config_array_value("accounting_stats_collector", j);
		} else {
		    logP3Msg("inventory_config", "SAM", "Too many collectors in collector list!  Should be set to two, not any more! Extra collector:_"+j+"_");
		}
	    } // if my collector

	    } else {
		logP3Msg("inventory_config", "SAM", "this is not a number: _" +jstr+"_");
	    } // NaN
			    
	}
	*/

	
}


// This reads the config settings for the BLB
function read_metric_config() {

var metric_filter_array = {
	"include_hw_env":"INC_FILTER_EQUIPMENT_HW_ENVIRONMENT",
	"include_intf":"INC_FILTER_EQUIPMENT_INTERFACE",
	"include_intf_add":"INC_FILTER_EQUIPMENT_INTERFACE_ADD",
	"include_media_indep":"INC_FILTER_EQUIPMENT_MEDIA_INDEPENDENT",
	"include_cpu":"INC_FILTER_EQUIPMENT_CPU",
	"include_mem":"INC_FILTER_EQUIPMENT_MEMORY",
	"include_mpls_lsp_dyn":"INC_FILTER_MPLS_DYNAMIC_LSP",
	"include_mpls_int":"INC_FILTER_MPLS_INTERFACE",
	"include_mpls_lsp":"INC_FILTER_MPLS_LSP",
	"include_serv_eg":"INC_FILTER_COMPLETE_SERVICE_EGRESS",
	"include_serv_ing":"INC_FILTER_COMPLETE_SERVICE_INGRESS",
	"include_serv2_eg":"INC_FILTER_SERVICE_EGRESS",    // used for both octets & packets
	"include_serv2_ing":"INC_FILTER_SERVICE_INGRESS",  // used for both octets & packets
	"include_sdp_bind":"INC_FILTER_SVT_SDP_BINDING_BASE",
	"include_atm_ping":"INC_FILTER_ATM_PING",
	"include_icmp_ping":"INC_FILTER_ICMP_PING",
	"include_mac_ping":"INC_FILTER_MAC_PING",
	"include_mpls_ping":"INC_FILTER_MPLS_PING",
	"include_sdp_ping":"INC_FILTER_SDP_PING",
	"include_vccv_ping":"INC_FILTER_VCCV_PING",
	"include_tunnel_ping":"INC_FILTER_TUNNEL_PING",
	"include_service_site_ping":"INC_FILTER_SERVICE_SITE_PING",
	"include_nqueue_ing":"INC_FILTER_COMBINED_NETWORK_INGRESS",
	"include_nqueue_eg":"INC_FILTER_COMBINED_NETWORK_EGRESS",
	"include_nqueue2_ing":"INC_FILTER_NETWORK_INGRESS",
	"include_nqueue2_eg":"INC_FILTER_NETWORK_EGRESS",
	"include_ppp_interface":"INC_FILTER_PPP_INTERFACE",
	"include_ppp_protocol":"INC_FILTER_PPP_CONTROL_PROTOCOL",
	"include_route_stats":"INC_FILTER_ROUTE_STATS",
	"include_equipment_card_slot":"INC_FILTER_EQUIPMENT_CARD_SLOT",
	"include_cfm_loopback":"INC_FILTER_CFM_LOOPBACK",
	"include_cfm_oneway_delay":"INC_FILTER_CFM_ONEWAY_DELAY",
	"include_cfm_twoway_delay":"INC_FILTER_CFM_TWOWAY_DELAY",
	"include_cfm_ethernet":"INC_FILTER_CFM_ETHERNET",
	"include_aosqos_policy":"INC_FILTER_AOSQOS_POLICY",
	"include_equipment_digital_diagnostic_monitoring":"INC_FILTER_EQUIPMENT_DDM",
	"include_mpls_site":"INC_FILTER_MPLS_SITE",
	"include_mss_ingress":"INC_FILTER_MSS_INGRESS",
	"include_mss_egress":"INC_FILTER_MSS_EGRESS",
	"include_svc_pppoe":"INC_FILTER_SVC_PPPOE",
	"include_ethernet_equipment_dot3_stats":"INC_FILTER_ETHERNET_EQUIPMENT_DOT3_STATS",
	"include_cfm_single_ended_loss":"INC_FILTER_CFM_SINGLE_ENDED_LOSS",
	"exclude_hw_env":"EXC_FILTER_EQUIPMENT_HW_ENVIRONMENT",
	"exclude_intf":"EXC_FILTER_EQUIPMENT_INTERFACE",
	"exclude_intf_add":"EXC_FILTER_EQUIPMENT_INTERFACE_ADD",
	"exclude_media_indep":"EXC_FILTER_EQUIPMENT_MEDIA_INDEPENDENT",
	"exclude_cpu":"EXC_FILTER_EQUIPMENT_CPU",
	"exclude_mem":"EXC_FILTER_EQUIPMENT_MEMORY",
	"exclude_mpls_lsp_dyn":"EXC_FILTER_MPLS_DYNAMIC_LSP",
	"exclude_mpls_int":"EXC_FILTER_MPLS_INTERFACE",
	"exclude_mpls_lsp":"EXC_FILTER_MPLS_LSP",
	"exclude_serv_eg":"EXC_FILTER_COMPLETE_SERVICE_EGRESS",
	"exclude_serv_ing":"EXC_FILTER_COMPLETE_SERVICE_INGRESS",
	"exclude_serv2_eg":"EXC_FILTER_SERVICE_EGRESS",          // used for both octets & packets
	"exclude_serv2_ing":"EXC_FILTER_SERVICE_INGRESS",        // used for both octets & packets
	"exclude_sdp_bind":"EXC_FILTER_SVT_SDP_BINDING_BASE",
	"exclude_atm_ping":"EXC_FILTER_ATM_PING",
	"exclude_icmp_ping":"EXC_FILTER_ICMP_PING",
	"exclude_mac_ping":"EXC_FILTER_MAC_PING",
	"exclude_mpls_ping":"EXC_SAM_FILTER_MPLS_PING",
	"exclude_sdp_ping":"EXC_FILTER_SDP_PING",
	"exclude_vccv_ping":"EXC_FILTER_VCCV_PING",
	"exclude_tunnel_ping":"EXC_FILTER_TUNNEL_PING",
	"exclude_service_site_ping":"EXC_FILTER_SERVICE_SITE_PING",
	"exclude_nqueue_ing":"EXC_FILTER_COMBINED_NETWORK_INGRESS",
	"exclude_nqueue_eg":"EXC_FILTER_COMBINED_NETWORK_EGRESS",
	"exclude_nqueue2_ing":"EXC_FILTER_NETWORK_INGRESS",
	"exclude_nqueue2_eg":"EXC_FILTER_NETWORK_EGRESS",
	"exclude_ppp_interface":"EXC_FILTER_PPP_INTERFACE",
	"exclude_ppp_protocol":"EXC_FILTER_PPP_CONTROL_PROTOCOL",
	"exclude_route_stats":"EXC_FILTER_ROUTE_STATS",
	"exclude_equipment_card_slot":"EXC_FILTER_EQUIPMENT_CARD_SLOT",
	"exclude_cfm_loopback":"EXC_FILTER_CFM_LOOPBACK",
	"exclude_cfm_oneway_delay":"EXC_FILTER_CFM_ONEWAY_DELAY",
	"exclude_cfm_twoway_delay":"EXC_FILTER_CFM_TWOWAY_DELAY",
	"exclude_cfm_ethernet":"EXC_FILTER_CFM_ETHERNET",
	"exclude_aosqos_policy":"EXC_FILTER_AOSQOS_POLICY",
	"exclude_equipment_digital_diagnostic_monitoring":"EXC_FILTER_EQUIPMENT_DDM",
	"exclude_mpls_site":"EXC_FILTER_MPLS_SITE",
	"exclude_mss_ingress":"EXC_FILTER_MSS_INGRESS",
	"exclude_mss_egress":"EXC_FILTER_MSS_EGRESS",
	"exclude_svc_pppoe":"EXC_FILTER_SVC_PPPOE",
	"exclude_mss_egress":"EXC_FILTER_MSS_EGRESS",
	"exclude_ethernet_equipment_dot3_stats":"EXC_FILTER_ETHERNET_EQUIPMENT_DOT3_STATS",
	"exclude_cfm_single_ended_loss":"EXC_FILTER_CFM_SINGLE_ENDED_LOSS"
};


	PV.Logger.logInfo("AppLogger", "All",  "SAMBLB read_metric_config");
	logP0Msg("set_config_var_from_app", "SAMBLB", "Entered");


	// filtering by IP address config items
	for (var i in metric_filter_array) {
	logP3Msg("set_config_var_from_app", "SAM", "filter "+ i + " " + metric_filter_array[i]);

	    set_config_var_from_app_with_default(i, metric_filter_array[i], nil);
	}



	set_config_var_from_app_with_default("file_policy_period", "FILE_POLICY_PERIOD", "900");
	set_config_var_from_app_with_default("SAM_SERVER_VERSION", "SAM_SERVER_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_VERSION");

	if (app_config_value("SAM_SERVER_VERSION") == 0) {
	    logP1Msg("inventory_config", "SAM", "sam server version (APP.SAM_SERVER_VERSION) needs to be set -- FATAL error");
		PV.halt();
	}

	set_config_var_from_app_with_default("SAM_SERVER_RELEASE_VERSION", "SAM_SERVER_RELEASE_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_RELEASE_VERSION");

    if (app_config_value("SAM_SERVER_RELEASE_VERSION") == 0)
    {
        logP1Msg("inventory_config", "SAM", "sam server release version (APP.SAM_SERVER_RELEASE_VERSION) needs to be set -- FATAL error");
        PV.halt();
    }
}





function read_UBA_config() {
	PV.Logger.logInfo("AppLogger", "All",  "SAMUBA read_metric_config");
	logP0Msg("set_config_var_from_app", "SAMUBA", "Entered");

	set_config_var_from_app_with_default("FILE_PERIOD", "FILE_PERIOD", "900");
	make_sure_its_numeric("FILE_PERIOD");
	set_config_var_from_app_with_default("SAM_SERVER_VERSION", "SAM_SERVER_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_VERSION");

	if (app_config_value("SAM_SERVER_VERSION") == 0) {
	    logP1Msg("inventory_config", "SAM", "sam server version (APP.SAM_SERVER_VERSION) needs to be set -- FATAL error");
		PV.halt();
	}
	
	set_config_var_from_app_with_default("SAM_SERVER_RELEASE_VERSION", "SAM_SERVER_RELEASE_VERSION", 0);
	make_sure_its_numeric("SAM_SERVER_RELEASE_VERSION");

    if (app_config_value("SAM_SERVER_RELEASE_VERSION") == 0)
    {
        logP1Msg("inventory_config", "SAM", "sam server release version (APP.SAM_SERVER_RELEASE_VERSION) needs to be set -- FATAL error");
        PV.halt();
    }
}

function set_samif_availability_status_config(short_name)
{
    var config_setting = 'TRUE';
    //Logics below are somewhat redundant
    //BUT do_access_interface_inventory has to be true, which is the default behavior
    /*
	logP4Msg("set_samif_availability_status_config", "SAM", "short name: " + short_name);

    if (short_name == 'do_access_interface_inventory')
    {
        if (isDef(PV.configuration.SAM.JMS_FILE_OUTPUT['ACCESS_INTERFACE']) && isDef(PV.configuration.SAM.JMS_FILE_OUTPUT['ACCESS_INTERFACE']['ACTIVE']))
        {
            config_setting = PV.configuration.SAM.JMS_FILE_OUTPUT['ACCESS_INTERFACE']['ACTIVE'];
        }        
    }

    if (config_setting.toUpperCase() == "TRUE")
    {
        config_setting = true;
	    logP3Msg("set_samif_availability_status_config", "SAM", short_name + " set to [true]");
    }
    else if (config_setting.toUpperCase() == "FALSE")
    {
        config_setting = false;
	    logP3Msg("set_samif_availability_status_config", "SAM", short_name + " set to [false]");
    }
	*/
	inv_metric_config_array[short_name] = config_setting;

	logP3Msg("set_samif_availability_status_config", "SAM", short_name + " set to [" + config_setting + ']');

}

function is_uba_available_schema_active(available_name_space_active)
{
    if (!available_name_space_active || available_name_space_active == null)
    {
        return false;
    }

    var config_available_name_space_active = 'config_' + available_name_space_active.toLowerCase();

    if (!isDef(inv_metric_config_array[config_available_name_space_active]))
    {
        // default to false initially
	    inv_metric_config_array[config_available_name_space_active] = false;

        var config_value = undefined;
	    logP4Msg("available schema", "UBA", available_name_space_active + ' is not set');
        if (isDef(PV.configuration[available_name_space_active]))
        {
            config_value = PV.configuration[available_name_space_active].toUpperCase();
        }
        
        config_value = (config_value == "TRUE") ? true : false;
 
	    inv_metric_config_array[config_available_name_space_active] = config_value;
	    logP4Msg("available schema", "UBA", available_name_space_active + ' is set to' + config_value.toString());
    }
    
    return app_config_value(config_available_name_space_active);
}
