// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// SAMUBAAdaptor.js - Metrics file main driver for SAM
//
//

var accounting_uba = true;

PV.importScript("alcatel_5620_sam_log2file/AppLogger.js");
PV.importScript("alcatel_5620_sam_log2file/SAMCommon.js");
PV.importScript("alcatel_5620_sam_log2file/SAM_app_config.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_metrics.js");
PV.importScript('alcatel_5620_sam_log2file/SAM_soap_filter.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_property_storage.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_hash_array.js');

var fcQByType;	fcQByType = new hashArray();

read_UBA_config();

var inv_filter_table, jmsA_filter_table, jmsD_filter_table, met_filter_table;
// This is the mapping of classes to the handler functions
var ubaClassHandlers = {};

var sam_server_version         = app_config_value("SAM_SERVER_VERSION");
var sam_server_release_version = app_config_value("SAM_SERVER_RELEASE_VERSION");
var load_sam_8_class_immediately = false;

if (sam_server_version > 8)
{
    load_sam_8_class_immediately = true;
}


var uba_record_schema;
var temporaryHandlerLookup = {};

var MasterPropertyMap = {};
var ReverseMasterPropertyMap = {};
var hashArray;		// You need this here so the reference to the class will work below.

var accounting_stats_collector, polled_stats_collector;

//modelInterface = PV.ModelInterface();

//Temporary  !!! ???
//my_collector= parseInt(app_config_value("collector"));
_pvConfiguration = PV.configuration;
my_collector = _pvConfiguration['COLLECTOR'];

accounting_stats_collector = my_collector;
polled_stats_collector = my_collector;

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

PV.importScript('alcatel_5620_sam_log2file/SAMDomainModel.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_lag_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_physical_port.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_shelf.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_hw_environment.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_channel.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_sdp_binding.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_interface.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_icmp_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_tunnel_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_vccv_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_site_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_control_protocol.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_interface.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_rtr_virtual_router.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_interface.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_channel.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_hw_environment.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_dynamic_lsp.js')
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_queue.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_forwarding_class.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_policy.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_icmp_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_tunnel_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_vccv_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_site_ping.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_control_protocol.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_ppp_interface.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_rtr_virtual_router.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_cardSlot.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_ethernet.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_loopback.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_oneway_delay.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_twoway_delay.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_aosqos_policy.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_site.js');

//PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_single_ended_loss.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_ethernetoam_mep.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_epipe.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_vpls.js');

//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_system_cpu.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_system_memory.js");
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_equipment_available_memory.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_equipment_allocated_memory.js');
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_svc_complete_service_ingress.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_interface.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_lsp.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_interface.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_interface_additional.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_hw_environment.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_equipment_media_independent.js");
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mpls_dynamic_lsp.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_svc_complete_service_egress.js"); 
//PV.importScript("alcatel_5620_sam_log2file/SAMUBA_sdp_binding_base_stats.js"); 
//PV.importScript('alcatel_5620_sam_log2file/SAMUBA_OAM_ping_results.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_nqueue_combined_network_ingress.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_nqueue_combined_network_egress.js');

PV.importScript('alcatel_5620_sam_log2file/SAM_property_mapping.js');

PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_extensions.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_schema.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_aggregator.js");
PV.importScript("alcatel_5620_sam_log2file/SAMUBA_avail_operator.js");

//From SAMIF
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_selectJmsVersion.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_hash_array.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_property_storage.js');

if (sam_server_version >= 8)
{
	
	//For network queue policy added in L2F 2.5.0.0 
	if (sam_server_version >= 10)
	{
		PV.importScript("alcatel_5620_sam_log2file/SAMUBA_complete_network_egress_packet_octets.js");
		PV.importScript("alcatel_5620_sam_log2file/SAMUBA_complete_network_ingress_packet_octets.js");
		
	}
	
	if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    {
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_svq_aggregation_scheduler.js');
		PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_point.js');
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_mss.js");
        PV.importScript("alcatel_5620_sam_log2file/SAMUBA_svc_pppoe.js");
    }
}

// These need to be after all the importScripts for the handler routines, because they are referenced
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_jms_handlers.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_handlers.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_schema.js');

newUBAInit();

var OPERATOR, OPERATOR2, LOOKUP, SUBELEMENT, SAM_SCHEMA;
/* 
 * Mapping from physical port and LAG to monitored object pointer.
   Used to support network queues that are part of a LAG 
*/
var ppToMOP, lagToMOP, sapLagMop;
ppToMOP=PV.UBACache(1);
lagToMOP=PV.UBACache(1);
sapLagMop=PV.UBACache(1);

// Setting the period over which an input file contains data.
// This value is configured in dc.cfg
// See also the setPeriodDuration below.
// schema_svc_complete_service_ingress.filePeriod=app_config_value("FILE_PERIOD");
// schema_svc_complete_service_egress.filePeriod=app_config_value("FILE_PERIOD");
// schema_combined_network_ingress.filePeriod=app_config_value("FILE_PERIOD");
// schema_combined_network_egress.filePeriod=app_config_value("FILE_PERIOD");

// if (sam_server_version >= 8)
// {
    // if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    // {
        // schema_mss_egress.filePeriod=app_config_value("FILE_PERIOD");
        // schema_mss_ingress.filePeriod=app_config_value("FILE_PERIOD");
        // schema_svc_pppoe.filePeriod=app_config_value("FILE_PERIOD");
    // }
// }

// logP4Msg("UBA", "UBA", "FILE_PERIOD is " +app_config_value("FILE_PERIOD"));

// var INPUT_SCHEMAS=[schema_svc_complete_service_ingress,schema_svc_complete_service_egress,schema_combined_network_ingress,schema_combined_network_egress];

// if (sam_server_version >= 8)
// {
    // if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    // {
        // INPUT_SCHEMAS.push(schema_mss_egress);
        // INPUT_SCHEMAS.push(schema_mss_ingress);
        // INPUT_SCHEMAS.push(schema_svc_pppoe);
    // }
// }

// var AVAIL_NAME = AVAIL_NAME_SPACES[PV.configuration["AVAIL_NAME_SPACE"]];
// if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
// {
    // var AVAIL_SCHEMA=createAvailInputSchema(AVAIL_NAME);
    // INPUT_SCHEMAS.push(AVAIL_SCHEMA);
// }


var AVAIL_NAME = AVAIL_NAME_SPACES["ACCESS_INTERFACE"];


// OPERATOR=PV.StreamMerge("main", INPUT_SCHEMAS);
// OPERATOR.periodDuration=app_config_value("FILE_PERIOD");

// OPERATOR.addHandler("SAM_svc_complete_service_ingress",process_svc_complete_service_ingress_packet_octets);
// OPERATOR.addHandler("SAM_svc_complete_service_egress",process_svc_complete_service_egress_packet_octets);
// OPERATOR.addHandler("SAM_combined_network_ingress",process_combined_network_ingress_stats);
// OPERATOR.addHandler("SAM_combined_network_egress",process_combined_network_egress_stats);

// if (sam_server_version >= 8)
// {
    // if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    // {
        // OPERATOR.addHandler("SAM_mss_egress", process_mss_egress);
        // OPERATOR.addHandler("SAM_mss_ingress", process_mss_ingress);
        // OPERATOR.addHandler("SAM_svc_pppoe", process_svc_pppoe);
    // }
// }
SAM_SCHEMA = createSAMCSVUBASchema("SAM_csv_accounting", 900, 3);
OPERATOR = PV.StreamQuery("MAIN", SAM_SCHEMA, temporaryDispatchRoutine);
// Input period
OPERATOR.periodDuration=app_config_value("FILE_PERIOD");
// Output period
// This sets the period for the output BOF files from the UBA.  If it is set to the
// input file period, then you keep the latency to a minimum, which is presumably
// what the user would expect.
OPERATOR.metricWriter.setPeriodDuration(app_config_value("FILE_PERIOD"));
OPERATOR.initializeForInbandInventory();
//OPERATOR.traceAll = true;
/*
if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
{
	OPERATOR2 = PV.StreamQuery("AVAILABILTY", OPERATOR, accountingAvailabilityHandler);
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

//var key_reg_exp = new RegExp('^mss-');

var mainOnResync=function() 
{
	logP6Msg("mainOnResync", "Debug", "Within function mainOnResync");
				
    ppToMOP = PV.UBACache(10000);
    lagToMOP = PV.UBACache(10000);
    sapLagMop = PV.UBACache(10000);

    SUBELEMENTS=OPERATOR.allSubelements;
	SUBELEMENTS.iterate(function(eachSubelement) 
			{
	    		var each = eachSubelement ;
	    		var keyString ;
	    		if(each == undefined)
	    		{
	    			//logP6Msg("on function mainOnResync", "Debug", "SUBELEMENTS is undefined.");
	    		}
	    		else
	    		{
	    			if (each.alt_idmap != undefined) 
	    			{
	    				keyString="alt_idmap";
	    			} 
	    			else 
	    			{
	    				keyString="samObjectFullName";
	    			};
            
	    			//logP6Msg("Lookup with keyString ", "Resync", "value is" + keyString);

	    			var key = each.propertyNamed(keyString);

	    			if (key != null)
	    			{
	    				LOOKUP.put(key , each);

	    				
	                    
	    		         /*Introduced for sam 2.12.2.0 find2file fix pack
	    		          * Processing of creation of an Array which will hold all the samObjectFullNames of the sub-elements that have portName as Lag, This is require to identify 
	    		          * LAG-SAP sub-elements that has samObjectFullName not containing LAG word. in this case this array will be used to identify the SAP-LAG resource.
	    		          */       
	    		         if (each.family == "5620_SAM_AingrAengrQueue") {    
	    		        	 logP3Msg("sapLagMop ", "Resync", "found a AingrAengrQueue"); 
	    		        	 addSapLagMapping(each);
	    		            
	    		          }
	    				//logP6Msg("Lookup value: ", "Resync", key);

	    				/* Special processing for physical ports in order to set up a lookup table for network queue mapping in the case
		   				where the port the queues are associated with are part of a LAG.
		    		 	*/

	    				if (each.family == "5620_SAM_NQueue") 
	    				{
	    					//logP6Msg("Lookup with keyString ", "Resync", "found a network queue");
		    				addPhysicalPortMapping(each);
	    				}

		    		/*
		    		 * MSS needs different handling during the Resync because it is taking metrics from 2 different classes but no identical
		    		 * mapping for samObjectFullName
		    		 * For svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord && svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord
		    		 * Lookup key is samObjectFullName
		    		 * For service.CompleteServiceIngressPacketOctetsLogRecord && service.CompleteServiceEgressPacketOctetsLogRecord
		    		 * Lookup key is samMSSCompleteServiceMapId
		    		 */
	    				if (keyString == 'samObjectFullName' && isDef(each.propertyNamed('samMSSCompleteServiceMapId')) && each.propertyNamed('samScope') == 'port')
	    				{
	    					var mss_key = each.propertyNamed('samMSSCompleteServiceMapId');
	    					if (mss_key != null)
	    					{
	    						//logP6Msg("setup MSS map Id : ", "Resync", 'value is ' + mss_key);
	    						LOOKUP.put(mss_key , each);
	    					}
	    				}
	    			}
	    		}
			}
		);

	logP6Msg("Subelements size: ", "Resync", SUBELEMENTS.length.toString());				
};
//Availability not being calculated, when AVAIL_NAME_SPACE_ACTIVE is set true and it need to do the calculation
//if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
//{
//    OPERATOR.onResync(mainOnResync);
//} else {
//    addAggregatorsToOperator(OPERATOR, AVAIL_NAME, mainOnResync);
//}
if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
{	
	logP4Msg("UBA_INIT", "Resync", "Initializing with PvAggregator");
	addAggregatorsToOperator(OPERATOR, AVAIL_NAME, mainOnResync); 
}
else
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

//03 April 2013: E.g. <Physical_port_simple_port_name> -> <N_Queue_objectfullname>
function addPhysicalPortMapping(each)
{
	//logP6Msg("function addPhysicalPortMapping", "DEBUG", "Entered !!!");
	
    var port;
    var mop; // monitored object pointer used for metric lookup
    
    if ((isDef(each.samSiteId)) && (isDef(each.samPortName)) && (isDef(each.samObjectFullName))) 
    {
    	//logP6Msg("function addPhysicalPortMapping", "DEBUG", "Physical Port mapping criterion satisfied !!!");
    	
    	port = each.propertyNamed("samSiteId") + "_" + each.propertyNamed("samPortName");//AKA simplePortName
    	//03 April 2013: E.g. <portName>2/1/51</portName>
    	
    	//logP6Msg("function addPhysicalPortMapping", "DEBUG", "port -> " + port);
    	
    	mop = each.propertyNamed("samObjectFullName");
    	//logP6Msg("function addPhysicalPortMapping", "DEBUG", "mop -> " + mop);
    	
    	//logP6Msg("function addPhysicalPortMapping", "DEBUG", "Adding 'port' and 'mop' into cache !!!");
    	ppToMOP.put(port, mop);
    }
    
    //logP6Msg("function addPhysicalPortMapping", "DEBUG", "Exiting !!!");
}  
    //Below function is developed for sam 2.12.2.0 pack
    function addSapLagMapping(each)
    {
    	var mop;
    	var lagId;
    	
    	if ((isDef(each.samPortName)) && (isDef(each.samObjectFullName)))
        {
            lagId = each.propertyNamed('samPortName');
            mop = each.propertyNamed('samObjectFullName');
            if (lagId.toLowerCase().indexOf("lag") != -1)
            {
               logP4Msg("sapLagMop : ", "Resync", 'value for '  + temp +' is ' + lagSamFullName);
               sapLagMop.put(mop,lagId);     
            }
        }
    }	

