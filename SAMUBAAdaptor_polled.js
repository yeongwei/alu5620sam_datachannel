// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.
// Alcatel-Lucent 5620 SAM Pack

var accounting_uba = false;

PV.importScript("alcatel_5620_sam_log2file/AppLogger.js");
PV.importScript("alcatel_5620_sam_log2file/SAMCommon.js");
PV.importScript("alcatel_5620_sam_log2file/SAM_app_config.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_metrics.js");
PV.importScript('alcatel_5620_sam_log2file/SAM_soap_filter.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_property_storage.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_property_mapping.js');//To avoid stuffs getting replaced by PhysicalPort BUT enhanced by Service Access Interface

read_UBA_config();//Setting values from TE

var inv_filter_table, jmsA_filter_table,	jmsD_filter_table,	met_filter_table;
var ubaClassHandlers = {};//Classes to the Handler functions

var sam_server_version         = app_config_value("SAM_SERVER_VERSION");
var sam_server_release_version = app_config_value("SAM_SERVER_RELEASE_VERSION");
var load_sam_8_class_immediately = false;

var modelInterface = {};//Compatibility measures

if (sam_server_version > 8){	load_sam_8_class_immediately = true;	}

var uba_record_schema;
var temporaryHandlerLookup = {};

var MasterPropertyMap = {};
var ReverseMasterPropertyMap = {};
var hashArray;//You need this here so the reference to the class will work below.
var accounting_stats_collector, polled_stats_collector;

//modelInterface = PV.ModelInterface();
_pvConfiguration = PV.configuration;
for(i in _pvConfiguration){
	//logP6Msg("Polled UBA", "Looping PV.configuration", i + ' -> ' + _pvConfiguration[i]);
}

var my_collector = _pvConfiguration['COLLECTOR'];
logP5Msg("Polled UBA", "Current Collector Number", 'my_collector -> ' + my_collector);

accounting_stats_collector = my_collector;	polled_stats_collector = my_collector;

//Data structures for the service queue composition
var queue_key_map;		// maps queue objectFullName to hasharray classkey
var fc_key_map;			// maps forwarding class objectFullName to hasharray classkey
var fc_fc_map;			// maps forwarding class objectFullName to the actual forwarding class name
var accInt_ing_key_map;	// maps access interface objectFullName to hasharray classkey (ingress)
var accInt_eg_key_map;	// maps access interface objectFullName to hasharray classkey (egress)
var object_keymap;      // maps objectFullNames-like for access interfaces-to hasharray classkey; is an array of hashmaps
var accInt_storage;    	// used for sorting access interfaces for later use
var accInt_by_policy;	// accessInterfaces grouped by policy (grouped by classkey)
var policy_key_map;		// maps policy objectFullName to hasharray classkey
var policy_def_fc;		// stores the default fc for each policy (indexed by classkey)

PV.importScript('alcatel_5620_sam_log2file/SAMDomainModel.js');//03 April 2013: Refractored

PV.importScript('alcatel_5620_sam_log2file/SAMIF_lag_interface.js');//
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_physical_port.js');//
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_shelf.js');//
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_hw_environment.js');//
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_channel.js');//
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_sdp_binding.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_icmp_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_tunnel_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_vccv_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_site_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_control_protocol.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_rtr_virtual_router.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_channel.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_hw_environment.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_dynamic_lsp.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_interface.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_queue.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_forwarding_class.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_policy.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_icmp_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_tunnel_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_vccv_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_site_ping.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_control_protocol.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_rtr_virtual_router.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_cardSlot.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_ethernet.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_loopback.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_oneway_delay.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_twoway_delay.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aosqos_policy.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_site.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svq_aggregation_scheduler.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_point.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_single_ended_loss.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ethernetoam_mep.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_epipe.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_vpls.js');

//The new inventory classes which got inserted in 2.13 find2file pack are as below
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_IMA_Link.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_tdmequipment_DS1_E1_PortSpecific.js');


//inventory related new classes in sam 2.14 find2file pack
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_BaseCard.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_DaughterCard.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_MCMCard.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_ControlProcessor.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_nat_IsaMda.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_nat_IsaMember.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_dhcp_Dhcp6AddressPrefix.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_dhcp_subnet.js')

//Inventory classes for LTE
PV.importScript("alcatel_5620_sam_log2file/SAMIF_ltemme_MmeServiceMemberMaf.js");
PV.importScript("alcatel_5620_sam_log2file/SAMIF_lte_S11Peer.js");
PV.importScript("alcatel_5620_sam_log2file/SAMIF_lte_S1uPeer.js");
PV.importScript("alcatel_5620_sam_log2file/SAMIF_lte_S5Peer.js");
PV.importScript("alcatel_5620_sam_log2file/SAMIF_lte_S8Peer.js");


PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_system_cpu.js");




PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_system_memory.js");
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_equipment_available_memory.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_equipment_allocated_memory.js');
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_svc_complete_service_ingress.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_interface.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_lsp.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_interface.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_interface_additional.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_hw_environment.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_media_independent.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_dynamic_lsp.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_svc_complete_service_egress.js"); 
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_sdp_binding_base_stats.js"); 
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_OAM_ping_results.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_nqueue_combined_network_ingress.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_nqueue_combined_network_egress.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_mss.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_svc_pppoe.js');
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ppp_interface.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ppp_control_protocol.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_rtr_route_stats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_extensions.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_schema.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_aggregator.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_operator.js");
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_selectJmsVersion.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_hash_array.js');

//The new metric classes which got inserted in 2.13 find2file pack are as below

PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ethernetequipment_AggrMaintRxStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ethernetequipment_AggrMaintTxStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpr_IMALinkCurrentStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_radioequipment_PdhFrameHopHistoryDataStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_radioequipment_PdhFrameLinkHistoryDataStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_radioequipment_RadioAnalogueMeasure.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_tdmequipment_E1HistoryStats15minInLogRecord.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_tdmequipment_E1HistoryStats15minOutLogRecord.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_tdmequipment_DS1HistoryStats15minInLogRecord.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_tdmequipment_DS1HistoryStats15minOutLogRecord.js");

//new metric class in 2.14 sam find2file pack
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_system_cpumonstats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_hw_temperature.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_IsaMemberUsageStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_NatIsaResourceStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_dhcp_LocalDhcp6ServerPrefixStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_dhcp_LocalDhcpServerSubnetStats.js");

//Metric classes for LTE
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ltegw_S11FailureCodeStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ltegw_S5AgwFailureCodeStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ltegw_S8AgwFailureCodeStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ltemme_MAFConnection.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_lte_S11AgwPeerStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_lte_S1uAgwPeerStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_lte_S5AgwPeerStats.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_lte_S8AgwPeerStats.js");

//Metric class for DDM for sam_server_version<10
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_digital_diagnostic_monitoring.js");

if (sam_server_version >= 10)
{
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_NatPoolLsnStatsLogRecord.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_NatPoolL2AwStatsLogRecord.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_L2TPSiteStatsLogRecord.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_flash_memory.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ethernetequipment_EthernetStatsLogRecord.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMIF_equipment_flash_memory.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMIF_l2tp_site.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMIF_nat_natpool.js");
	PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_DDMStatsLogRecord.js");		
	
}


if (sam_server_version >= 8)
{
    if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
    {
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_aosqos_policy.js");
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_cardSlot.js");
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_cfm_ethernet.js");
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_cfm_oneway_delay.js");
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_cardSlot.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_ethernet.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_loopback.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_oneway_delay.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_twoway_delay.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_aosqos_policy.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_ethernetoam_mep.js');
        //PV.importScript("alcatel_5620_sam_log2file/SAMUBA_cfm_twoway_delay.js");
    }
    if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    {
       
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_site.js");
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_ethernet_equipment_dot3_stats.js");
		PV.importScript("alcatel_5620_sam_log2file/SAMUBA_cfm_single_ended_loss.js");
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_site.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_svq_aggregation_scheduler.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_single_ended_loss.js');
    }
}

//These need to be after all the importScripts for the handler routines, because they are referenced
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_jms_handlers.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_handlers.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_schema.js');

//Compatibility measures
modelInterface.idForName=idForName;
newUBAInit();

var OPERATOR, OPERATOR2, LOOKUP, SUBELEMENT, SAM_SCHEMA;
/*
// Setting the period over which an input file contains data.
// This value is configured in dc.cfg
// See also the setPeriodDuration below.
schema_equipment_system_cpu.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_system_memory.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_allocated_memory.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_available_memory.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_interface.filePeriod=app_config_value("FILE_PERIOD");
schema_mpls_interface.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_interface_additional.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_media_independent.filePeriod=app_config_value("FILE_PERIOD");
schema_equipment_hw_environment.filePeriod=app_config_value("FILE_PERIOD");
schema_sdp_binding_base.filePeriod=app_config_value("FILE_PERIOD");
schema_oam_ping.filePeriod=app_config_value("FILE_PERIOD");
schema_ppp_interface.filePeriod=app_config_value("FILE_PERIOD");
schema_ppp_control_protocol.filePeriod=app_config_value("FILE_PERIOD");
schema_rtr_route_stats.filePeriod=app_config_value("FILE_PERIOD");
if (sam_server_version >= 8)
{
    if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
    {
        schema_card_slot_stats.filePeriod=app_config_value("FILE_PERIOD");
        schema_cfm_ethernet.filePeriod=app_config_value("FILE_PERIOD");
        schema_cfm_oneway_delay.filePeriod=app_config_value("FILE_PERIOD");
        //schema_cfm_twoway_delay.filePeriod=app_config_value("FILE_PERIOD");
        schema_aosqos_policy.filePeriod=app_config_value("FILE_PERIOD");
    }
    if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    {
        schema_digital_diagnostic_monitoring.filePeriod=app_config_value("FILE_PERIOD");
        schema_mpls_site.filePeriod=app_config_value("FILE_PERIOD");
        schema_ethernet_equipment_dot3_stats.filePeriod=app_config_value("FILE_PERIOD");
		schema_cfm_single_ended_loss.filePeriod=app_config_value("FILE_PERIOD");
    }
}

*/	
logP4Msg("UBA", "UBA", "FILE_PERIOD is " + app_config_value("FILE_PERIOD"));
/*
INPUT_SCHEMAS = [schema_equipment_system_cpu, schema_equipment_system_memory,schema_equipment_allocated_memory,schema_equipment_available_memory,schema_equipment_interface,schema_mpls_interface,schema_equipment_interface_additional,schema_equipment_media_independent,schema_equipment_hw_environment,schema_sdp_binding_base,schema_oam_ping,schema_ppp_interface, schema_ppp_control_protocol, schema_rtr_route_stats ];

if (sam_server_version >= 8)
{
    if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
    {
        INPUT_SCHEMAS.push(schema_card_slot_stats);
        INPUT_SCHEMAS.push(schema_cfm_ethernet);
        INPUT_SCHEMAS.push(schema_cfm_oneway_delay);
        //INPUT_SCHEMAS.push(schema_cfm_twoway_delay);
        INPUT_SCHEMAS.push(schema_aosqos_policy);
    }
    if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    {
        INPUT_SCHEMAS.push(schema_digital_diagnostic_monitoring);
        INPUT_SCHEMAS.push(schema_mpls_site);
        INPUT_SCHEMAS.push(schema_ethernet_equipment_dot3_stats);
		INPUT_SCHEMAS.push(schema_cfm_single_ended_loss);
    }
}

/*
???
Need to fix this, add it back in, at least the config part
var AVAIL_NAME = AVAIL_NAME_SPACES[PV.configuration["AVAIL_NAME_SPACE"]];
if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
{
    var AVAIL_SCHEMA=createAvailInputSchema(AVAIL_NAME);
    INPUT_SCHEMAS.push(AVAIL_SCHEMA);
}
*/
var AVAIL_NAME = AVAIL_NAME_SPACES["PHYSICAL_PORT"];

SAM_SCHEMA = createSAMCSVUBASchema("SAM_csv_performance", 900, 3);
OPERATOR = PV.StreamQuery("MAIN", SAM_SCHEMA, temporaryDispatchRoutine);
//logP4Msg("Adaptor", "OPERATOR", OPERATOR.dbInserter);	

//Input period
OPERATOR.periodDuration=app_config_value("FILE_PERIOD");
//Output period
OPERATOR.metricWriter.setPeriodDuration(app_config_value("FILE_PERIOD"));
OPERATOR.initializeForInbandInventory();//This will make UBA inventory capable
//OPERATOR.traceAll = true;
/*
if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
{
	OPERATOR2 = PV.StreamQuery("AVAILABILTY", OPERATOR, performanceAvailabilityHandler);
	OPERATOR.connectPushPushClient(OPERATOR2);

	// Input period
	OPERATOR2.periodDuration=app_config_value("FILE_PERIOD");

	// Output period
	OPERATOR2.metricWriter.setPeriodDuration(app_config_value("FILE_PERIOD"));

	OPERATOR2.initializeForMetrics();
}
*/
OPERATOR2 = PV.StreamQuery("WORKER", OPERATOR, function(record){
	//logP6Msg("UBA", "WORKER", "record -> " + record);
});
OPERATOR2.periodDuration=app_config_value("FILE_PERIOD");
OPERATOR.connectPushPushClient(OPERATOR2);
OPERATOR2.addModelImporter();//Must have!!! Probably this guy is causing it?!
//OPERATOR2.traceAll = true;

LOOKUP = PV.UBACache(10000);
SUBELEMENTS;
    
var mainOnResync=function() 
{
	SUBELEMENTS = OPERATOR.allSubelements;
    SUBELEMENTS.iterate(function(each) 
    {
    	var keyString ;
	    if (each.alt_idmap != undefined) 
	    {
	    	keyString="alt_idmap";
	    } 
	    else 
	    {
	    	keyString="samObjectFullName";
	    };
	    
	    var key = each.propertyNamed(keyString);
	    if (key != null) 
	    {
	    	LOOKUP.put(key , each);
	    	//logP4Msg("Lookup value: ", "Resync", key);
	    	//logP4Msg("LOOKUP hash entry ", "DEBUG", key + " -> " + each);
	    }
	});
    
    logP4Msg("Subelements size: ", "Resync", SUBELEMENTS.length.toString());				
};
	

    //Debug resync issues
	/*
    var mainOnResync=function() {
       	logP4Msg("on function mainOnResync", "Debug", "Within function mainOnResync");
       	var _this = this;
    	//logP4Msg("on function mainOnResync", "Debug", "typeof _this['OPERATOR'] -> " + typeof _this['OPERATOR']);
	    //SUBELEMENTS=this.allSubelements;
    	SUBELEMENTS=_this['OPERATOR'].allSubelements;
	    //logP4Msg("on function mainOnResync", "Debug", "typeof this.allSubelements -> " + typeof this.allSubelements);
    	//logP4Msg("on function mainOnResync", "Debug", "typeof OPERATOR -> " + typeof OPERATOR);
    	//logP4Msg("on function mainOnResync", "Debug", "typeof OPERATOR.allSubelements -> " + typeof OPERATOR.allSubelements);
    	//logP4Msg("on function mainOnResync", "Debug", "typeof OPERATOR -> " + typeof SUBELEMENTS);
    	//SUBELEMENTS=OPERATOR.allSubelements;//Resolve back to use this instead, where this == OPERATOR
    	//dump_samObject(SUBELEMENTS);
	    for(var i in SUBELEMENTS)
	    {
	    	if(SUBELEMENTS[i] == undefined || SUBELEMENTS[i] == null)
	    	{
	    		logP4Msg("on function mainOnResync", "Debug", "SUBELEMENTS is undefined / null");
	    	}
	    	else
	    	{
	    		logP4Msg("on function mainOnResync", "Debug", i + " -> " + SUBELEMENTS[i]);
	    	
	    		_SUBELEMENTS = SUBELEMENTS[i];
	    		for(k in _SUBELEMENTS)
	    		{
	    			logP4Msg("on function mainOnResync", "Debug", "_SUBELEMENTS: " +  k + " -> " + _SUBELEMENTS[k]);
	    		}
	    	
	    		var keyString = '';
	    		
	    		if(SUBELEMENTS[i] == undefined || SUBELEMENTS[i] == null)
	    		{
	    			logP4Msg("on function mainOnResync", "Debug", "[CRITICAL]: SUBELEMENTS is undefined / null");
	    			continue;
	    		}
	    		
	    		if (SUBELEMENTS[i]['alt_idmap'] != undefined) 
	    		{
	    			keyString="alt_idmap";
	    		} 
	    		else 
	    		{
	    			keyString="samObjectFullName";
	    		};
	    		logP4Msg("Key: ", "Resync", keyString);	
	    		
	    		if(SUBELEMENTS[i] == undefined || SUBELEMENTS[i] == null)
	    		{
	    			logP4Msg("on function mainOnResync", "Debug", "[CRITICAL]: SUBELEMENTS is undefined / null");
	    			continue;
	    		}
	    		
	    		var key = SUBELEMENTS[i].propertyNamed(keyString);//key aka objectfullname
	    		logP4Msg("on function mainOnResync", "Debug", "key -> " + key);
	    		if (key != undefined) 
	    		{	
	    			if(key != null)
	    			{
	    				LOOKUP.put(key , SUBELEMENTS[i]);
	    				logP4Msg("Lookup value: ", "Resync", key);
	    			}
	    		};
	    		logP4Msg("on function mainOnResync", "Debug", "Before moving to another subelement");
	    	}
	    }
	    logP4Msg("Subelements size: ", "Resync", SUBELEMENTS.length.toString());				
	};
	*/

/*
 * ???? need to add availability in; see below for earlier code 
 * Since Avail has no subelement, resync on global variable OPERATOR is sufficient
*/

/*
OPERATOR.addHandler("SAM_equipment_system_cpu",process_equipment_SystemCpuStats);
OPERATOR.addHandler("SAM_equipment_system_memory",process_equipment_SystemMemoryStats);
OPERATOR.addHandler("SAM_equipment_allocated_memory",process_equipment_AllocatedMemoryStats);
OPERATOR.addHandler("SAM_equipment_available_memory",process_equipment_AvailableMemoryStats);
OPERATOR.addHandler("SAM_equipment_interface",process_equipment_interface_stats);
OPERATOR.addHandler("SAM_mpls_interface",process_mpls_interface_stats);
OPERATOR.addHandler("SAM_equipment_interface_additional",process_equipment_interface_additional_stats);
OPERATOR.addHandler("SAM_equipment_hw_environment",process_equipment_hw_environment_stats); 
OPERATOR.addHandler("SAM_equipment_media_independent",process_equipment_media_independent_stats);
OPERATOR.addHandler("SAM_sdp_binding_base",process_sdp_binding_base);
OPERATOR.addHandler("SAM_oam_ping_results",process_oam_ping_results_stats);
OPERATOR.addHandler("SAM_ppp_interface",process_ppp_InterfaceStats);
OPERATOR.addHandler("SAM_ppp_control_protocol",process_ppp_control_protocol_stats);
OPERATOR.addHandler("SAM_rtr_route_stats",process_rtr_route_stats);

if (sam_server_version >= 8)
{
    if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
    {
        OPERATOR.addHandler("SAM_aosqos_policy",process_aosqos_policy);
        OPERATOR.addHandler("SAM_cfm_ethernet",process_cfm_ethernet);
        OPERATOR.addHandler("SAM_equipment_card_slot_stats",process_card_slot_stats);
        OPERATOR.addHandler("SAM_cfm_oneway_delay",process_cfm_oneway_delay);
        //OPERATOR.addHandler("SAM_cfm_twoway_delay",process_cfm_twoway_delay);
    }
    if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    {
        OPERATOR.addHandler("SAM_equipment_ddm", process_digital_diagnostic_monitoring);
        OPERATOR.addHandler("SAM_mpls_site", process_mpls_site_stats);
        OPERATOR.addHandler("SAM_ethernet_equipment_dot3_stats", process_ethernet_equipment_dot3_stats);
		OPERATOR.addHandler("SAM_cfm_single_ended_loss", process_cfm_single_ended_loss);
    }
}


    // This sets the period for the output BOF files from the UBA.  If it is set to the
    // input file period, then you keep the latency to a minimum, which is presumably
    // what the user would expect.
    OPERATOR.metricWriter.setPeriodDuration(app_config_value("FILE_PERIOD"));

    OPERATOR.initializeForMetrics(); 
    
*/

//Availability not being calculated, when AVAIL_NAME_SPACE_ACTIVE is set true and it need to do the calculation
//if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
//{
//    OPERATOR.onResync(mainOnResync);
//} else {
//    addAggregatorsToOperator(OPERATOR, AVAIL_NAME, mainOnResync);
//}

if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))//Avail Turn On
{
	logP4Msg("UBA_INIT", "Resync", "Initializing with PvAggregator");
	addAggregatorsToOperator(OPERATOR, AVAIL_NAME, mainOnResync); 
}
else//Avail Turn Off
{
	logP4Msg("UBA_INIT", "Resync", "Initializing without PvAggregator");
	OPERATOR.onResync(function(){//inband
			logP4Msg("UBA", "Resync", "Within MAIN");
			mainOnResync();	
		});
	
	logP4Msg("UBA_INIT", "Resync", "Initializing WORKER for Model Importer");
	OPERATOR2.onResync(function(){//outband
			logP4Msg("UBA", "Resync", "Within WORKER");
			mainOnResync();
		});
}


