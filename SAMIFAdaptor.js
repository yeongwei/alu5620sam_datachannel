// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var SAM={};
var modelInterface;
var MasterPropertyMap = {};
var ReverseMasterPropertyMap = {};
var hashArray;		// You need this here so the reference to the class will work below.

var accounting_stats_collector, polled_stats_collector;

// Data structures for the service queue composition
var queue_key_map;	// maps queue objectFullName to hasharray classkey
var fc_key_map;		// maps forwarding class objectFullName to hasharray classkey
var fc_fc_map;		// maps forwarding class objectFullName to the actual forwarding class name
var accInt_ing_key_map;	// maps access interface objectFullName to hasharray classkey (ingress)
var accInt_eg_key_map;	// maps access interface objectFullName to hasharray classkey (egress)
var object_keymap;      // maps objectFullNames-like for access interfaces-to hasharray classkey; is an array of hashmaps
var accInt_storage;    // used for sorting access interfaces for later use
var accInt_by_policy;	// accessInterfaces grouped by policy (grouped by classkey)
var policy_key_map;	// maps policy objectFullName to hasharray classkey
var policy_def_fc;	// stores the default fc for each policy (indexed by classkey)


PV.adaptor.modelInterface = PV.ModelInterface();
PV.adaptor.modelInterface.retainIdMap = true;
modelInterface = PV.adaptor.modelInterface;

modelInterface.idMapFunction=function(anObject)
{
	get_idmap_id(anObject);
};
modelInterface.onInsert=modelInterface.idMapFunction;

modelInterface.initializeForInventory();

PV.importScript('alcatel_5620_sam_log2file/AppLogger.js');
PV.importScript('alcatel_5620_sam_log2file/SAMDomainModel.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_selectJmsVersion.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_hash_array.js');
PV.importScript('alcatel_5620_sam_log2file/SAMCommon.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_app_config.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_soap_filter.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_property_storage.js');

PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_physical_port.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_channel.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_shelf.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_equipment_hw_environment.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svt_sdp_binding.js');
//PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_dynamic_lsp.js')
PV.importScript('alcatel_5620_sam_log2file/SAMIF_mpls_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_lag_interface.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_queue.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_forwarding_class.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_aingr_aengr_policy.js');
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
PV.importScript('alcatel_5620_sam_log2file/SAMIF_svq_aggregation_scheduler.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_access_point.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_cfm_single_ended_loss.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_ethernetoam_mep.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_epipe.js');
PV.importScript('alcatel_5620_sam_log2file/SAMIF_service_vpls.js');

var fcQByType;
fcQByType = new hashArray();

var commit_count = 0;     // Used to do inline commits every 500 or so subelements

// propList is a list of the properties we want to update on the subelements
// when they change.

var propList =
{
    "administrativeState" : "prop",
	"equipmentState"      : "prop",
	"isLinkUp"            : "prop",
	"operationalState"    : "prop",
	"temperature"         : "prop"
};


//*******************************************************************
//
// initializeSchemas
//
//*******************************************************************
PV.adaptor.initializeSchemas = function initializeSchemas()
{
    this.schemas.add
    (
        PV.PvSAMDeviceSchema
        (
            "SAM",
            {
		        jmsClasses:
                [
                    "equipment.PhysicalPort", "equipment.Shelf", "equipment.HwEnvironment", "mpls.Interface", "mpls.Lsp", "mpls.DynamicLsp", "mpls.StaticLsp", "lag.Interface", "vll.L2AccessInterface", "ipipe.L2AccessInterface", "vprn.L3AccessInterface", "ies.L3AccessInterface", "vpls.L2AccessInterface", "mirror.L2AccessInterface", "aengr.ForwardingClass", "aingr.ForwardingClass", "aengr.Queue", "aingr.Queue", "svt.MeshSdpBinding", "svt.MirrorSdpBinding", "svt.SpokeSdpBinding", "aingr.Policy", "aengr.Policy", "mpls.LspPing", "icmp.IcmpPing", "svt.TunnelPing", "svt.VccvPing", "service.SitePing", "nqueue.ForwardingClass", "nqueue.Policy", "nqueue.Entry", "ppp.Interface", "ppp.PppControlProtocol", "tdmequipment.DS1E1Channel","tdmequipment.DS3E3Channel","sonetequipment.Sts12Channel","sonetequipment.Sts192Channel","sonetequipment.Sts1Channel","sonetequipment.Sts3Channel","sonetequipment.Sts48Channel","sonetequipment.TributaryChannel","sonetequipment.Tu3Channel", "sonetequipment.TributaryGroup", "tdmequipment.DS0ChannelGroup", "sonetequipment.Tug3Group", "sasqos.Meter", "sasqos.AccessIngress", "sasqos.AccessIngressForwardingClass", "sasqos.PortAccessEgress", "sasqos.PortAccessEgressForwardingClass", "sasqos.PortAccessEgressQueue", "rtr.VirtualRouter", "equipment.CardSlot", "ethernetoam.CfmLoopback", "ethernetoam.CfmOneWayDelayTest", "ethernetoam.CfmTwoWayDelayTest", "ethernetoam.CfmEthTest", "aosqos.Policy", "svq.AggregationScheduler", "mpls.Site", "vprn.ServiceAccessPoint", "ies.ServiceAccessPoint", "ethernetoam.CfmSingleEndedLossTest", "ethernetoam.Mep", "epipe.Epipe", "vpls.Vpls"
                ],
 		        jmsProperties:
                {
                    "newValue/long"   : "newvalue",
                    "newValue/int"    : "newvalue",
                    "newValue/string" : "newvalue",
                    "oldValue/long"   : "oldvalue",
                    "oldValue/int"    : "oldvalue",
                    "oldValue/string" : "oldvalue"
                },
		        jmsEvents:
                {
	                "AttributeValueChange" : [[{xpath:XPathExp("//attribute")},[{xpath:XPathExp("attributeName")}, {xpath:XPathExp("newValue/long")}, {xpath:XPathExp("newValue/int")}, {xpath:XPathExp("newValue/string")}, {xpath:XPathExp("oldValue/long")}, {xpath:XPathExp("oldValue/int")}, {xpath:XPathExp("oldValue/string")}]]],
                	"ObjectCreation" : [[{xpath:XPathExp("//objectCreationEvent")},[{xpath:XPathExp("*/*")}]]],
                	"ObjectDeletion" : [[{xpath:XPathExp("//objectDeletionEvent")},[{xpath:XPathExp("objectFullName")}]]],
                	"generic.ObjectDeletion" : [[{xpath:XPathExp("//objectDeletionEvent")},[{xpath:XPathExp("objectFullName")}]]],
                	"KeepAliveEvent" : [],               
                	"SystemInfoEvent" : [[{xpath:XPathExp("//stateChangeEvent")},[{xpath:XPathExp("*")}]]]
				},
                onStartup: function() 
                {
                    // read_SAMIF_config();
                    read_inventory_config();
			 
                    accounting_stats_collector=app_config_value("accounting_stats_collector");
			        polled_stats_collector=app_config_value("polled_stats_collector");

			        logP3Msg("inventory_config", "SAM", "accounting stats collector: " + accounting_stats_collector);
                    logP3Msg("inventory_config", "SAM", "polled stats collector: " + polled_stats_collector);
			 
                    setup_inv_soap_filters();

                    initialize_service_structures();

                    return initializeDomainModel();
                },
                onJMSEvent: function(event)
                {
//debug                         logP0Msg("onJMSEvent", "SAMIF", "entered");
//                         logP0Msg("onJMSEvent", "SAMIF", event.join("::"));
// make these P5 or something
                    commit_if_needed(PV.adaptor.modelInterface);
                    handle_jms_msg(event);
                },                 
                onFullDump: function() 
                {
                    logP0Msg("onFullDump", "SAMIF", "**** Full Dump Started ****.");
					initialize_service_structures();
                    processInventory(initializeSamObjects(), modelInterface);
                    // modelInterface.commitAll();
                    modelInterface.commit();
                    logP0Msg("onFullDump", "SAMIF", "****************************.");
                    logP0Msg("onFullDump", "SAMIF", "**** Full Dump Complete ****.");
                    logP0Msg("onFullDump", "SAMIF", "****************************.");
                 },
                 onOpen: function()
                 {
                    logP4Msg("onOpen", "SAMIF", "Entered");                        
                 }
            }
        )
    );
};


function process_inventory_class(samRecordObj, procFunc, modelInterface, classname)
{
    if (isDef(samRecordObj))
    {
    	samRecordObj.enumerate(
            function(aSamObject)
            {
                if (aSamObject!= undefined)
                {
                    procFunc(aSamObject, modelInterface, classname);
                }
            }
        );
	    logP4Msg("processInventory", "SAMIF", classname + " is about to be committed.");
    	definite_commit(modelInterface);
	    samRecordObj.drop();
    	logP4Msg("processInventory", "SAMIF", classname + " has committed.");
	}
    else
    {
	    logP4Msg("processInventory", "SAMIF", classname + " -- none; skipping");
	}
}


//*******************************************************************
//
// processInventory -- iterate through the list of objects and its
//                     properties, and then commit them.
// 
// Inputs:
//         theSamObjects   -- an initialized list of objects
//         modelInterface  -- the foreign domain model for SAM
//
// Output: nothing.
//
//*******************************************************************
function processInventory(theSamObjects, modelInterface)
{
    logP3Msg("processInventory", "SAMIF", "processInventory is starting.");
    


    //...................................................................
    //
    //                       P o l i c i e s
    //
    //...................................................................

	process_inventory_class(theSamObjects.aingr_policy, process_aingr_policy, modelInterface, "aingr.Policy");//
	process_inventory_class(theSamObjects.aengr_policy, process_aengr_policy, modelInterface, "aengr.Policy");//

	process_inventory_class(theSamObjects.sasqos_ingress_policy, process_aingr_policy, modelInterface, "sasqos.AccessIngress");//
	process_inventory_class(theSamObjects.sasqos_port_access_policy, process_generic_policy, modelInterface, "sasqos.PortAccessEgress");//

	process_inventory_class(theSamObjects.nqueue_policy, process_generic_policy, modelInterface, "nqueue.Policy");//


    //...................................................................
    //
    //                       Q u e u e s
    //
    //...................................................................
    // We accumulate properties for the queues from the forwarding classes
    // so make sure to do those first.


	process_inventory_class(theSamObjects.aingr_queue, aingr_aengr_queue, modelInterface, "aingr.Queue");//
	process_inventory_class(theSamObjects.aengr_queue, aingr_aengr_queue, modelInterface, "aengr.Queue");//

	process_inventory_class(theSamObjects.sasqos_meter, aingr_aengr_queue, modelInterface, "sasqos.Meter");//
	process_inventory_class(theSamObjects.sasqos_access_egress_queue, aingr_aengr_queue, modelInterface, "sasqos.PortAccessEgressQueue");//

	process_inventory_class(theSamObjects.nqueue_entry, aingr_aengr_queue, modelInterface, "nqueue.Entry");//




    //...................................................................
    //
    //               F o r w a r d i n g   C l a s s e s
    //
    //...................................................................

    // There is a dependency because we accumulate data for setting up    
    // the Queue subelements.  We need to process the forwarding classes
    // then the access interfaces, then the queues.

	process_inventory_class(theSamObjects.aingr_forwarding_class, process_aingr_aengr_forwarding_class, modelInterface, "aingr.ForwardingClass");//
	process_inventory_class(theSamObjects.aengr_forwarding_class, process_aingr_aengr_forwarding_class, modelInterface, "aengr.ForwardingClass");//

	process_inventory_class(theSamObjects.sasqos_access_ingress_fc, process_aingr_aengr_forwarding_class, modelInterface, "sasqos.AccessIngressForwardingClass");//
	process_inventory_class(theSamObjects.sasqos_access_egress_fc, process_aingr_aengr_forwarding_class, modelInterface, "sasqos.PortAccessEgressForwardingClass");//

	process_inventory_class(theSamObjects.nqueue_forwarding_class, process_aingr_aengr_forwarding_class, modelInterface, "nqueue.ForwardingClass");//



    //...................................................................
    //
    //               A c c e s s I n t e r f a c e
    //
    //...................................................................

    // We need to process these after the forwarding classes and the
    // queues, because this is where we really create the queue
    // subelements, and we collect properties from the other two
    // SAM object classes.

	process_inventory_class(theSamObjects.vll_l2_access_interfaces, process_access_interface, modelInterface, "vll.L2AccessInterface");//
	process_inventory_class(theSamObjects.ipipe_l2_access_interfaces, process_access_interface, modelInterface, "ipipe.L2AccessInterface");//
	process_inventory_class(theSamObjects.vprn_l3_access_interfaces, process_access_interface, modelInterface, "vprn.L3AccessInterface");//
	process_inventory_class(theSamObjects.vpls_l2_access_interfaces, process_access_interface, modelInterface, "vpls.L2AccessInterface");//
	process_inventory_class(theSamObjects.mirror_l2_access_interfaces, process_access_interface, modelInterface, "mirror.L2AccessInterface");//
	process_inventory_class(theSamObjects.ies_l3_access_interfaces, process_access_interface, modelInterface, "ies.L3AccessInterface");//




    //...................................................................
    //
    //               m p l s . I n t e r f a c e
    //
    //...................................................................

	process_inventory_class(theSamObjects.mpls_interfaces, mpls_interface, modelInterface, "mpls_interface");//



    //...................................................................
    //
    //               m p l s . L s p 
    //
    //...................................................................

	//	process_inventory_class(theSamObjects.mpls_dynamic_lsp, mpls_dynamic_lsp, modelInterface, "mpls_dynamic_lsp");


    //...................................................................
    //
    //               s v t . S d p B i n d i n g
    //
    //...................................................................

	process_inventory_class(theSamObjects.mesh_sdp_binding, svt_sdp_binding, modelInterface, "svt_mesh_sdp_binding");//
	process_inventory_class(theSamObjects.mirror_sdp_binding, svt_sdp_binding, modelInterface, "svt_mirror_sdp_binding");//
	process_inventory_class(theSamObjects.spoke_sdp_binding, svt_sdp_binding, modelInterface, "svt_spoke_sdp_binding");//


    //...................................................................
    //
    //               l a g . I n t e r f a c e
    //
    //...................................................................

	process_inventory_class(theSamObjects.lag_interfaces, lag_interface, modelInterface, "lag_interface");//

    
    //...................................................................
    //
    //               e q u i p m e n t . H w E n v i r o n m e n t
    //
    //...................................................................

	process_inventory_class(theSamObjects.hw_environment, equipment_hw_environment, modelInterface, "equipment_hw_environment");//


    //...................................................................
    //
    //               e q u i p m e n t . P h y s i c a l P o r t s
    //
    //...................................................................

	// This needs to be after the network queue policy, fc, etc. because this is the object they apply to

	process_inventory_class(theSamObjects.physical_ports, equipment_physical_port, modelInterface, "equipment.PhysicalPort");//



    //...................................................................
    //
    //               e q u i p m e n t . C h a n n e l
    //
    //...................................................................

	process_inventory_class(theSamObjects.ds1e1channel, process_equipment_channel, modelInterface, "tdmequipment_ds1e1channel");
	process_inventory_class(theSamObjects.ds3e3channel, process_equipment_channel, modelInterface, "tdmequipment_ds3e3channel");
	process_inventory_class(theSamObjects.sts12channel, process_equipment_channel, modelInterface, "sonetequipment_sts12channel");
	process_inventory_class(theSamObjects.sts192channel, process_equipment_channel, modelInterface, "sonetequipment_sts192channel");
	process_inventory_class(theSamObjects.sts1channel, process_equipment_channel, modelInterface, "sonetequipment_sts1channel");
	process_inventory_class(theSamObjects.sts3channel, process_equipment_channel, modelInterface, "sonetequipment_sts3channel");
	process_inventory_class(theSamObjects.sts48channel, process_equipment_channel, modelInterface, "sonetequipment_sts48channel");
	process_inventory_class(theSamObjects.tributarychannel, process_equipment_channel, modelInterface, "sonetequipment_tributarychannel");
	process_inventory_class(theSamObjects.tu3channel, process_equipment_channel, modelInterface, "sonetequipment_tu3channel");

	process_inventory_class(theSamObjects.sonet_tributarygroup, process_equipment_channel, modelInterface, "sonet_tributarygroup");
	process_inventory_class(theSamObjects.sonet_tug3group, process_equipment_channel, modelInterface, "sonet_tug3group");
	process_inventory_class(theSamObjects.tdm_ds0channelgroup, process_equipment_channel, modelInterface, "tdm_ds0channelgroup");


    //...................................................................
    //
    //               p p p . I n t e r f a c e
    //
    //...................................................................

    process_inventory_class(theSamObjects.ppp_interface_class, ppp_interface, modelInterface, "ppp_interface");
    

    //...................................................................
    //
    //               p p p . P p p C o n t r o l C o n t r o l
    //
    //...................................................................

    // This must come after the ppp.Interface  because we rely on the ppp.Interface to build a lookup table for the 
    // ppp protocol element name.
    process_inventory_class(theSamObjects.ppp_control_protocol_class, ppp_control_protocol, modelInterface, "ppp_control_protocol");
    ppp_interface_object_cleanup();

    //...................................................................
    //
    //               e q u i p m e n t . S h e l f
    //
    //...................................................................

	process_inventory_class(theSamObjects.shelfs, equipment_shelf, modelInterface, "equipment_shelf");//

	//................................................................
	//
	//           OAM Tests
	//
	//................................................................

	process_inventory_class(theSamObjects.icmp_ping, process_icmp_ping, modelInterface, "icmp_ping");
	process_inventory_class(theSamObjects.mpls_ping, process_mpls_ping, modelInterface, "mpls_ping");
	process_inventory_class(theSamObjects.tunnel_ping, process_svt_tunnel_ping, modelInterface, "tunnel_ping");
	// Need to do VCCV ping after sdp binding and SAPs because it uses properties from them
	process_inventory_class(theSamObjects.vccv_ping, process_svt_vccv_ping, modelInterface, "vccv_ping");
	process_inventory_class(theSamObjects.site_ping, process_service_site_ping, modelInterface, "site_ping");



    //...................................................................
    //
    //               r t r . V i r t u a l R o u t e r
    //
    //...................................................................

	process_inventory_class(theSamObjects.virtual_router, process_rtr_virtual_router, modelInterface, "virtual_router");
						
	process_inventory_class(theSamObjects.equipment_card_slot, process_equipment_card_slot, modelInterface, "card_slot");//
	process_inventory_class(theSamObjects.aosqos_policy, process_aosqos_policy, modelInterface, "aosqos_policy");
	process_inventory_class(theSamObjects.mpls_site, process_mpls_site, modelInterface, "mpls_site"); 
	process_inventory_class(theSamObjects.svq_aggregation_schedular, process_svq_aggregation_schedular, modelInterface, "svq_aggregation_schedular"); 

	//..............................................................................
	//
	//			Service Epipe, VPLS
	//
	//..............................................................................
	process_inventory_class(theSamObjects.service_epipe, process_service_epipe, modelInterface, "service_epipe");
	process_inventory_class(theSamObjects.service_vpls, process_service_vpls, modelInterface, "service_vpls");
		
	//...........................................................................
	//
	//				Ethernet OAM Test
	//ethernetoam_mep must process before cfm loopback in order to enable cfm loopback to include sdp and sap properties
	process_inventory_class(theSamObjects.ethernetoam_mep, process_ethernetoam_mep, modelInterface, "ethernetoam_mep");
	process_inventory_class(theSamObjects.cfm_loopback, process_cfm_loopback, modelInterface, "cfm_loopback");//
	process_inventory_class(theSamObjects.cfm_oneway_delay, process_cfm_oneway_delay, modelInterface, "cfm_oneway_delay");//
	process_inventory_class(theSamObjects.cfm_twoway_delay, process_cfm_twoway_delay, modelInterface, "cfm_twoway_delay");//
	process_inventory_class(theSamObjects.cfm_ethernet, process_cfm_ethernet, modelInterface, "cfm_ethernet");//
	process_inventory_class(theSamObjects.cfm_single_ended_loss, process_cfm_single_ended_loss, modelInterface, "cfm_single_ended_loss");//
	
	//..............................................................................
	//
	//			Service Access Point
	//
	//..............................................................................			
	process_inventory_class(theSamObjects.vprn_service_access_point, process_service_access_point, modelInterface, "vprn_service_access_point");
	process_inventory_class(theSamObjects.ies_service_access_point, process_service_access_point, modelInterface, "ies_service_access_point");

    logP3Msg("processInventory", "SAMIF", "processInventory is finished.");


} // processInventory


//*******************************************************************
//
//          i n i t i a l i z e S a m O b j e c t s
//
//*******************************************************************
function initializeSamObjects_part3(samObjects)
{

		samObjects.icmp_ping = requestInventoryOnMinServerVersion(5, 0, SAM.icmp.IcmpPing,"icmp.IcmpPing",get_soap_filter("icmp.IcmpPing"),no_children,"proviso-ping-icmpIcmpPing-");

		samObjects.mpls_ping = requestInventoryOnMinServerVersion(5, 0, SAM.mpls.LspPing,"mpls.LspPing",get_soap_filter("mpls.LspPing"), no_children,"proviso-ping-mplsLspPing-");

		samObjects.tunnel_ping = requestInventoryOnMinServerVersion(5, 0, SAM.svt.TunnelPing,"svt.TunnelPing",get_soap_filter("svt.TunnelPing"), no_children, "proviso-ping-svtTunnelPing-");

		samObjects.vccv_ping = requestInventoryOnMinServerVersion(5, 0, SAM.svt.VccvPing,"svt.VccvPing",get_soap_filter("svt.VccvPing"), no_children, "proviso-ping-svtVccvPing-");

		samObjects.site_ping = requestInventoryOnMinServerVersion(5, 0, SAM.service.SitePing,"service.SitePing",get_soap_filter("service.SitePing"), no_children, "proviso-ping-serviceSitePing-");

		samObjects.ds1e1channel = requestInventoryOnMinServerVersion(5, 0, SAM.tdmequipment.DS1E1Channel,"tdmequipment.DS1E1Channel",get_soap_filter("tdmequipment.DS1E1Channel"), no_children, "proviso-tdmequipment.DS1E1Channel-");
		samObjects.ds3e3channel = requestInventoryOnMinServerVersion(5, 0, SAM.tdmequipment.DS3E3Channel,"tdmequipment.DS3E3Channel",get_soap_filter("tdmequipment.DS3E3Channel"), no_children, "proviso-tdmequipment.DS3E3Channel-");
		samObjects.sts12channel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Sts12Channel,"sonetequipment.Sts12Channel",get_soap_filter("sonetequipment.Sts12Channel"), no_children, "proviso-sonetequipment.Sts12Channel-");
		samObjects.sts192channel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Sts192Channel,"sonetequipment.Sts192Channel",get_soap_filter("sonetequipment.Sts192Channel"), no_children, "proviso-sonetequipment.Sts192Channel-");
		samObjects.sts1channel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Sts1Channel,"sonetequipment.Sts1Channel",get_soap_filter("sonetequipment.Sts1Channel"), no_children, "proviso-sonetequipment.Sts1Channel-");
		samObjects.sts3channel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Sts3Channel,"sonetequipment.Sts3Channel",get_soap_filter("sonetequipment.Sts3Channel"), no_children, "proviso-sonetequipment.Sts3Channel-");
		samObjects.sts48channel = requestInventoryOnMinServerVersion(5, 0,SAM.sonetequipment.Sts48Channel,"sonetequipment.Sts48Channel",get_soap_filter("sonetequipment.Sts48Channel"), no_children, "proviso-sonetequipment.Sts48Channel-");
		samObjects.tributarychannel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.TributaryChannel,"sonetequipment.TributaryChannel",get_soap_filter("sonetequipment.TributaryChannel"), no_children, "proviso-sonetequipment.TributaryChannel-");
		samObjects.tu3channel = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Tu3Channel,"sonetequipment.Tu3Channel",get_soap_filter("sonetequipment.Tu3Channel"), no_children, "proviso-sonetequipment.Tu3Channel-");

		samObjects.tdm_ds0channelgroup = requestInventoryOnMinServerVersion(5, 0, SAM.tdmequipment.DS0ChannelGroup,"tdmequipment.DS0ChannelGroup",get_soap_filter("tdmequipment.DS0ChannelGroup"), no_children, "proviso-tdmequipment.DS0ChannelGroup-");
		samObjects.sonet_tug3group = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.Tu3Channel,"sonetequipment.Tug3Group",get_soap_filter("sonetequipment.Tug3Group"), no_children, "proviso-sonetequipment.Tug3Group-");
		samObjects.sonet_tributarygroup = requestInventoryOnMinServerVersion(5, 0, SAM.sonetequipment.TributaryGroup,"sonetequipment.TributaryGroup",get_soap_filter("sonetequipment.TributaryGroup"), no_children, "proviso-sonetequipment.TributaryGroup-");


}


function initializeSamObjects_part4(samObjects)
{

    samObjects.equipment_card_slot = requestInventoryOnMinServerVersion(8,5,SAM.equipment.CardSlot,"equipment.CardSlot",get_soap_filter("equipment.CardSlot"),no_children,"proviso-CardSlot-");
	
	samObjects.ethernetoam_mep = requestInventoryOnMinServerVersion(8,5,SAM.ethernetoam.Mep,"ethernetoam.Mep",no_zero,no_children,"proviso-ethernetoam-mep-");
		
    samObjects.cfm_loopback = requestInventoryOnMinServerVersion(8,5,SAM.ethernetoam.CfmLoopback,"ethernetoam.CfmLoopback",get_soap_filter("ethernetoam.CfmLoopback"),no_children,"proviso-cfm_loopback-");

    samObjects.cfm_oneway_delay = requestInventoryOnMinServerVersion(8,5,SAM.ethernetoam.CfmOneWayDelayTest,"ethernetoam.CfmOneWayDelayTest",get_soap_filter("ethernetoam.CfmOneWayDelayTest"),no_children,"proviso-cfm_oneway_delay-");
		
    samObjects.cfm_twoway_delay = requestInventoryOnMinServerVersion(8,5,SAM.ethernetoam.CfmTwoWayDelayTest,"ethernetoam.CfmTwoWayDelayTest",get_soap_filter("ethernetoam.CfmTwoWayDelayTest"),no_children,"proviso-cfm_twoway_delay-");
						
    samObjects.cfm_ethernet = requestInventoryOnMinServerVersion(8,5,SAM.ethernetoam.CfmEthTest,"ethernetoam.CfmEthTest",get_soap_filter("ethernetoam.CfmEthTest"),no_children,"proviso-cfm_ethernet-");

    samObjects.aosqos_policy = requestInventoryOnMinServerVersion(8,5,SAM.aosqos.Policy,"aosqos.Policy",get_soap_filter("aosqos.Policy"),no_children,"proviso-aosqos_policy-");

    samObjects.mpls_site = requestInventoryOnMinServerVersion(8,7,SAM.mpls.Site,"mpls.Site",get_soap_filter("mpls.Site"),no_children,"proviso-mpls_site-");

    samObjects.svq_aggregation_schedular = requestInventoryOnMinServerVersion(8,7,SAM.svq.AggregationScheduler,"svq.AggregationScheduler",get_soap_filter("svq.AggregationScheduler"),no_children,"proviso-svq_aggregation_scheduler-");

    samObjects.vprn_service_access_point = requestInventoryOnMinServerVersion(8,7,SAM.vprn.ServiceAccessPoint,"vprn.ServiceAccessPoint",get_soap_filter("vprn.ServiceAccessPoint"), no_children, "proviso-vprn_service_access_point-");

    samObjects.ies_service_access_point = requestInventoryOnMinServerVersion(8,7,SAM.ies.ServiceAccessPoint,"ies.ServiceAccessPoint",get_soap_filter("ies.ServiceAccessPoint"), no_children, "proviso-ies_service_access_point-");
	
	samObjects.cfm_single_ended_loss = requestInventoryOnMinServerVersion(8,7,SAM.ethernetoam.CfmSingleEndedLossTest,"ethernetoam.CfmSingleEndedLossTest",get_soap_filter("ethernetoam.CfmSingleEndedLossTest"),no_children,"proviso-cfm_single_ended_loss-");
	
}

function initializeSamObjects_part5(samObjects)
{
	/*CFM TwoWay Destination*/
	samObjects.service_epipe = requestInventoryOnMinServerVersion(8,5,SAM.epipe.Epipe,"epipe.Epipe",everything,no_children,"proviso-service_epipe-");
	samObjects.service_vpls = requestInventoryOnMinServerVersion(8,5,SAM.vpls.Vpls,"vpls.Vpls",everything,no_children,"proviso-service_vpls-");
}

function initializeSamObjects_part2(samObjects)
{

		samObjects.mirror_l2_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.mirror.L2AccessInterface,"mirror.L2AccessInterface",get_soap_filter("mirror.L2AccessInterface"), no_children, "proviso-mirrorL2AccessInterface-");

		samObjects.mesh_sdp_binding = requestInventoryOnMinServerVersion(5,0,SAM.svt.MeshSdpBinding,"svt.MeshSdpBinding",get_soap_filter("svt.MeshSdpBinding"), no_children, "proviso-meshSDPBinding-");
		
		samObjects.mirror_sdp_binding = requestInventoryOnMinServerVersion(5,0,SAM.svt.MirrorSdpBinding,"svt.MirrorSdpBinding",get_soap_filter("svt.MirrorSdpBinding"), no_children, "proviso-mirrorSDPBinding-");
	
		samObjects.spoke_sdp_binding = requestInventoryOnMinServerVersion(5,0,SAM.svt.SpokeSdpBinding,"svt.SpokeSdpBinding",get_soap_filter("svt.SpokeSdpBinding"), no_children, "proviso-spokeSDPBinding-");
	
		samObjects.physical_ports = requestInventoryOnMinServerVersion(5, 0,SAM.equipment.PhysicalPort,"equipment.PhysicalPort",get_soap_filter("equipment.PhysicalPort"), no_children, "proviso-physicalPort-");
	    
		samObjects.shelfs = requestInventoryOnMinServerVersion(5,0,SAM.equipment.Shelf,"equipment.Shelf",get_soap_filter("equipment.Shelf"),no_children,"proviso-shelf-");
	
		samObjects.hw_environment = requestInventoryOnMinServerVersion(5,0,SAM.equipment.HwEnvironment,"equipment.HwEnvironment",get_soap_filter("equipment.HwEnvironment"),no_children, "proviso-HWEnvironment-");
	
		samObjects.lag_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.lag.Interface,"lag.Interface",get_soap_filter("lag.Interface"),no_children, "proviso-lagInterface-");
	
		samObjects.mpls_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.mpls.Interface,"mpls.Interface",get_soap_filter("mpls.Interface"), no_children, "proviso-mplsInterface-");
	
		samObjects.virtual_router = requestInventoryOnMinServerVersion(5,0,SAM.rtr.VirtualRouter,"rtr.VirtualRouter",get_soap_filter("rtr.VirtualRouter"),no_children,"proviso-rtr-virtualRouter");

        
		initializeSamObjects_part3(samObjects);
		initializeSamObjects_part4(samObjects);
		initializeSamObjects_part5(samObjects);
	
    logP3Msg("initializeSamObjects", "SAMIF", "complete" );
    return samObjects;
}





function initializeSamObjects()
{
    var samObjects = {};
    //var ppp_filter;

    logP3Msg("initializeSamObjects", "SAMIF", "entered" );


    // 7210 ingress policies and meters


    samObjects.sasqos_ingress_policy = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.AccessIngress,"sasqos.AccessIngress", no_zero, no_children, "proviso-sasqosAccessIngress-");

		samObjects.sasqos_access_ingress_fc = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.AccessIngressForwardingClass,"sasqos.AccessIngressForwardingClass", no_zero, no_children, "proviso-sasqosAccessIngressForwardingClass-");

		samObjects.sasqos_meter = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.Meter,"sasqos.Meter", no_zero, no_children, "proviso-sasqosMeter-");


		// 7210 egress policies and queues

		samObjects.sasqos_port_access_policy = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.PortAccessEgress,"sasqos.PortAccessEgress", no_zero, no_children, "proviso-sasqosPortAccessEgress-");

		samObjects.sasqos_access_egress_fc = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.PortAccessEgressForwardingClass,"sasqos.PortAccessEgressForwardingClass", no_zero, no_children, "proviso-sasqosPortAccessEgressForwardingClass-");

		samObjects.sasqos_access_egress_queue = requestInventoryOnMinServerVersion(7,0,SAM.sasqos.PortAccessEgressQueue,"sasqos.PortAccessEgressQueue", no_zero, no_children, "proviso-sasqosPortAccessEgressQueue-");

		// Network Queues

	samObjects.nqueue_forwarding_class = requestInventoryOnMinServerVersion(5,0,SAM.nqueue.ForwardingClass,"nqueue.ForwardingClass",no_zero,no_children, "proviso-nqueueForwardingClass-");


	samObjects.nqueue_policy = requestInventoryOnMinServerVersion(5,0,SAM.nqueue.Policy,"nqueue.Policy",no_zero,no_children, "proviso-nqueuePolicy-");

	samObjects.nqueue_entry = requestInventoryOnMinServerVersion(5,0,SAM.nqueue.Entry,"nqueue.Entry",get_soap_filter("nqueue.Entry"),no_children, "proviso-nqueueEntry-");



		samObjects.ppp_interface_class = requestInventoryOnMinServerVersion(5,0,SAM.ppp.Interface,"ppp.Interface", get_soap_filter("ppp.Interface"), no_children, "proviso-pppInterfaceClass-");

		if (isExcludeAll("ppp.Interface")) {
		    logP3Msg("initializeSamObjects", "SAMIF", "ppp.PppControlProtocol skipped because ppp.Interface excluded" );
		    // Skip the request
		} else {
		samObjects.ppp_control_protocol_class = requestInventoryOnMinServerVersion(5,0,SAM.ppp.PppControlProtocol,"ppp.PppControlProtocol", everything, no_children, "proviso-pppControlProtocolClass-");
		}

		samObjects.aengr_forwarding_class = requestInventoryOnMinServerVersion(5,0,SAM.aengr.ForwardingClass,"aengr.ForwardingClass", no_zero, no_children, "proviso-aengrForwardingClass-");

		samObjects.aengr_policy = requestInventoryOnMinServerVersion(5,0,SAM.aengr.Policy,"aengr.Policy", no_zero, no_children, "proviso-aengrPolicy-");
	
		samObjects.aengr_queue = requestInventoryOnMinServerVersion(5,0,SAM.aengr.Queue,"aengr.Queue", no_zero, no_children, "proviso-aengrQueue-");
	
		samObjects.aingr_forwarding_class = requestInventoryOnMinServerVersion(5,0,SAM.aingr.ForwardingClass,"aingr.ForwardingClass", no_zero, no_children, "proviso-aingrForwardingClass-");
	
		samObjects.aingr_policy = requestInventoryOnMinServerVersion(5,0,SAM.aingr.Policy,"aingr.Policy", no_zero, no_children, "proviso-aingrPolicy-");
	
		samObjects.aingr_queue = requestInventoryOnMinServerVersion(5,0,SAM.aingr.Queue,"aingr.Queue", no_zero, no_children, "proviso-aingrQueue-");
	
		samObjects.vprn_l3_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.vprn.L3AccessInterface,"vprn.L3AccessInterface",get_soap_filter("vprn.L3AccessInterface"), no_children, "proviso-vprnL3AccessInterface-");
	
		samObjects.ies_l3_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.ies.L3AccessInterface,"ies.L3AccessInterface",get_soap_filter("ies.L3AccessInterface"), no_children, "proviso-iesL3AccessInterface-");

		samObjects.vpls_l2_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.vpls.L2AccessInterface,"vpls.L2AccessInterface",get_soap_filter("vpls.L2AccessInterface"), no_children, "proviso-vplsL2AccessInterface-");

		samObjects.vll_l2_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.vll.L2AccessInterface,"vll.L2AccessInterface",get_soap_filter("vll.L2AccessInterface"), no_children, "proviso-vllL2AccessInterface-");

		samObjects.ipipe_l2_access_interfaces = requestInventoryOnMinServerVersion(5,0,SAM.ipipe.L2AccessInterface,"ipipe.L2AccessInterface",get_soap_filter("ipipe.L2AccessInterface"), no_children, "proviso-ipipeL2AccessInterface-");
        
		return initializeSamObjects_part2(samObjects);

}





//*******************************************************************
//
//             g e t _ i d m a p _ i d
//
//*******************************************************************
function get_idmap_id(sourceObject)
{
//debug    logP4Msg("get_idmap_id", "SAMIF", sourceObject.samObjectFullName );
//	logStatus("sourceObject.alt_idmap", sourceObject.alt_idmap);

// Invariant length check

//debug if (sourceObject.invariant != undefined) {
//debug	logP4Msg("get_idmap_id", "SAMIF", "invariant length is " + sourceObject.invariant.length + " for " + sourceObject.invariant);
//debug	}


	if (sourceObject.alt_idmap != undefined) {
//debug		logP4Msg("get_idmap_id", "SAMIF", "Using alternate idmap function");
    		PV.adaptor.modelInterface.addIdMap(sourceObject.alt_idmap.value.toString().concat(",").concat(sourceObject.id.toString()).concat(",").concat(sourceObject.element.collectorNumber.toString()));
//    		PV.adaptor.modelInterface.addIdMap(sourceObject.alt_idmap.toString().concat(",").concat(sourceObject.id.toString()).concat(",").concat(sourceObject.element.collectorNumber.toString()));
		} else {
		if (sourceObject.samObjectFullName != undefined) {
//debug		logP4Msg("get_idmap_id", "SAMIF", "Using regular idmap function");
    		PV.adaptor.modelInterface.addIdMap(sourceObject.samObjectFullName.value.toString().concat(",").concat(sourceObject.id.toString()).concat(",").concat(sourceObject.element.collectorNumber.toString()));
		}
		    else
		    	logP0Msg("get_idmap_id", "SAMIF", "objectFullName undefined");
	}
}


//*******************************************************************
//
//             j m s - e v e n t s
//
//*******************************************************************
function jms_newElement(className, objectName, elements)
{
	logP4Msg("jms_newElement", "SAMIF", className+" :: "+objectName);
	//var filter = '<equal name="objectFullName" value="'+objectName+'" />';
	//PV.Logger.logInfo("jms_newElement", "SAMIF", "querying SAM with filter ==>"+filter );
	//var elements = SAM.generic.GenericObject.classFind(className,filter);
	//for ( var i = 0; i < elements.length; i++ )
	for (var i in elements)
	{
	    if (record_filter_match(className, elements[i])) {

        switch(className)
        {
	     	case "vll.L2AccessInterface":
	     	case "ipipe.L2AccessInterface":
		    case "vprn.L3AccessInterface":
		    case "ies.L3AccessInterface":
		    case "vpls.L2AccessInterface":
		    case "mirror.L2AccessInterface":
		        process_access_interface(elements[i], modelInterface, className);
        		break;
        	case "mpls.Interface":
        		mpls_interface(elements[i], modelInterface);
        		break;
			//        	case "mpls.DynamicLsp":
			//        		mpls_dynamic_lsp(elements[i], modelInterface);
			//        		break;
        	case "equipment.PhysicalPort":
		    equipment_physical_port(elements[i], modelInterface, className);
        		break;
        	case "equipment.Shelf":
        		equipment_shelf(elements[i], modelInterface);
        		break;
        	case "equipment.HwEnvironment":
        		equipment_hw_environment(elements[i], modelInterface);
        		break;
		case "aingr.ForwardingClass":
		case "aengr.ForwardingClass":
		case "sasqos.AccessIngressForwardingClass":
		case "sasqos.PortAccessEgressForwardingClass":
		case "nqueue.ForwardingClass":
		    process_aingr_aengr_forwarding_class(elements[i], modelInterface, className);
			break;
		case "aingr.Queue":
		case "aengr.Queue":
		case "sasqos.Meter":
		case "sasqos.PortAccessEgressQueue":
		case "nqueue.Entry":
		    aingr_aengr_queue(elements[i], modelInterface, className);
			break;
		case "aingr.Policy":
		case "aengr.Policy":
		case "sasqos.AccessIngress":
		case "sasqos.AccessEgress":
		case "nqueue.Policy":
		    process_aingr_policy(elements[i], modelInterface, className);
			break;
		case "svt.MeshSdpBinding":
		case "svt.MirrorSdpBinding":
		case "svt.SpokeSdpBinding":
        		svt_sdp_binding(elements[i], modelInterface);
			break;
		case "lag.Interface":
        		lag_interface(elements[i], modelInterface);
			break;
	        case "icmp.IcmpPing":
		        process_icmp_ping(elements[i], modelInterface);
		        break;
	        case "mpls.LspPing":
	                process_mpls_ping(elements[i], modelInterface);
	                break;
	        case "svt.TunnelPing":
		        	process_svt_tunnel_ping(elements[i], modelInterface);
		        	break;
	        case "svt.VccvPing":
	                process_svt_vccv_ping(elements[i], modelInterface);
		        	break;
	        case "service.SitePing":
	                process_service_site_ping(elements[i], modelInterface);
	                break;
	        case "tdmequipment.DS1E1Channel":
	        case "tdmequipment.DS3E3Channel":
	        case "sonetequipment.Sts12Channel":
        	case "sonetequipment.Sts192Channel":
	        case "sonetequipment.Sts1Channel":
        	case "sonetequipment.Sts3Channel":
        	case "sonetequipment.Sts48Channel":
        	case "sonetequipment.TributaryChannel":
        	case "sonetequipment.Tu3Channel":
	        case "sonetequipment.TributaryGroup":
        	case "sonetequipment.Tug3Group":
	        case "tdmequipment.DS0ChannelGroup":
		        process_equipment_channel(elements[i], modelInterface);
			break;
	        case "ppp.Interface":
	                ppp_interface(elements[i], modelInterface);
	                break;
	        case "ppp.PppControlProtocol":
	                ppp_control_protocol(elements[i], modelInterface);
	                break;
	        case "rtr.VirtualRouter":
	                process_rtr_virtual_router(elements[i], modelInterface);
	                break;
			case "equipment.CardSlot":
	                equipment_card_slot(elements[i], modelInterface);
	                break;
			case "ethernetoam.Mep":
					process_ethernetoam_mep(elements[i], modelInterface);
					break;
			case "ethernetoam.CfmLoopback":
	                process_cfm_loopback(elements[i], modelInterface);
	                break;	
			case "ethernetoam.CfmOneWayDelayTest":
	                process_cfm_oneway_delay(elements[i], modelInterface);
	                break;	
			case "ethernetoam.CfmTwoWayDelayTest":
	                process_cfm_twoway_delay(elements[i], modelInterface);
	                break;	
			case "ethernetoam.CfmEthTest":
	                process_cfm_ethernet(elements[i], modelInterface);
	                break;	
			case "aosqos.Policy":
	                process_aosqos_policy(elements[i], modelInterface);
	                break;
			case "mpls.Site":
    	    		process_mpls_site(elements[i], modelInterface);						
                    break;
			case "svq.AggregationScheduler":
	                process_svq_aggregation_schedular(elements[i], modelInterface);
	                break;		
			case "vprn.ServiceAccessPoint":
			case "ies.ServiceAccessPoint":
					process_service_access_point(elements[i], modelInterface);
					break;			
			case "ethernetoam.CfmSingleEndedLossTest":
	                process_cfm_single_ended_loss(elements[i], modelInterface);
	                break;
			case "epipe.Epipe":
					process_service_epipe(elements[i], modelInterface);
					break;
			case "vpls.Vpls":
					process_service_vpls(elements[i], modelInterface);
					break;
	        default:
        		logP4Msg("jms_newElement", "SAMIF", "Skipping unexpected className "+className);
        } // switch
	    } // matches the filter
	    else {
		// Maybe take this out for shipping
		logP4Msg("jms_newElement", "SAMIF", "Filtered - skipping className "+className);
	    }
	}
    definite_commit(modelInterface);
}


function jms_delElement(className, objectName, delColl)
{
	//var myId=0, myId2=0;
	//var currentObject;
	//var qmap;
	var delName;
	//var i;

	logP4Msg("jms_delElement", "SAMIF", "entered");
	logP4Msg("jms_delElement", "SAMIF", objectName);
	for(var i in delColl)
	    {

	logStatus("i", i);
	nilStatus("dellColl[i]", delColl[i]);
	nilStatus("dellColl[i].objectFullName", delColl[i].objectFullName);

	delName = delColl[i].objectFullName;
	logP4Msg("jms_delElement", "SAMIF", "delete "+className+": "+delName);

//	PV.Logger.logInfo("jms_delElement", "SAMIF", delName);	
//	if ((className == "aingr.Queue") || (classname == "aengr.Queue")) {
//		qmap = queue_map[delName];
//		if (qmap != undefined) {
//				myId = modelInterface.idForName(qmap.alt_idmap);
//			}
//		}
//	else 


	switch (className) {
	        case "aingr.Queue":
	        case "aengr.Queue":
		case "sasqos.Meter":
		case "sasqos.PortAccessEgressQueue":
		case "nqueue.Entry":
		    delete_SEs_by_queue_fullname(delName.toString(), className);
			break;
		case "aingr.ForwardingClass":
		case "aengr.ForwardingClass":
		case "sasqos.AccessIngressForwardingClass":
		case "sasqos.PortAccessEgressForwardingClass":
		case "nqueue.ForwardingClass":
			// can these be deleted?
			break;
        	case "vll.L2AccessInterface":
        	case "ipipe.L2AccessInterface":
		case "vprn.L3AccessInterface":
		case "ies.L3AccessInterface":
		case "vpls.L2AccessInterface":
		case "mirror.L2AccessInterface":
		    // This turns off the service access interface SE
		    turn_off_SE(delName);
		    // This turns off the queues
		    delete_access_interface(delName.toString());
			break;
		case "aingr.Policy":
		case "aengr.Policy":
		case "sasqos.AccessIngress":
		case "sasqos.AccessEgress":
		case "nqueue.Policy":
			// Need something here?
			break;
        case "lag.Interface":
            jms_delete_lag_interface(delName.toString(), modelInterface);
            break;
        case "equipment.PhysicalPort":
		    jms_delete_equipment_physical_port(delName.toString(), modelInterface);
		    // For network queues
		    delete_access_interface(delName.toString());
        	break;
		default:
		    turn_off_SE(delName, modelInterface);

		} // switch


	} // for loop 
	definite_commit(modelInterface);

}

function jms_infoEvent(eventType, eventStateColl)
{
for (var i in eventStateColl)
{
	if(eventStateColl[i].state == "jmsMissedEvents")
	{ 
		logP3Msg("jms_infoEvent", "SAMIF", "MISSED_EVENT"+eventType );
//		PV.Logger.logInfo("jms_infoEvent", "SAMIF", "MISSED_EVENT"+eventType );
	}
}
}


// propName and propValue are arrays/collections.  propName has the names of the properties
// that are being changed, and propValue has the corresponding values they have changed to.


function jms_propChange(className, objectName, propColl)
{
	logP4Msg("jms_propChange", "SAMIF", "entered");	
	logStatus("className", className);
	logStatus("objectName", objectName);
	logP4Msg("jms_propChange", "SAMIF", "propChange "+className+": "+objectName);

        switch(className)
        {
        	case "vll.L2AccessInterface":
        	case "ipipe.L2AccessInterface":
		case "vprn.L3AccessInterface":
		case "ies.L3AccessInterface":
		case "vpls.L2AccessInterface":
		case "mirror.L2AccessInterface":
		    propChange_service_access_interface(className, objectName, propColl, reverse_svc_access_interface_Name, serviceMapFunctions);
        		break;
		case "aingr.ForwardingClass":
		case "aengr.ForwardingClass":
		case "sasqos.AccessIngressForwardingClass":
		case "sasqos.PortAccessEgressForwardingClass":
		case "nqueue.ForwardingClass":
			propChange_aingr_aengr_forwarding_class(className, objectName, propColl);
			break;
		case "aingr.Queue":
		case "aengr.Queue":
		case "sasqos.Meter":
		case "sasqos.PortAccessEgressQueue":
		case "nqueue.Entry":
		    propChange_aingr_aengr_queue(className, objectName, propColl);
			break;
		case "aingr.Policy":
		case "sasqos.AccessIngress":
		case "sasqos.AccessEgress":
		case "nqueue.Policy":
		    propChange_aingr_policy(className, objectName, propColl);
			break;
		case "aengr.Policy":
			// we don't do anything with this one for propChange
			break;
        	case "mpls.Interface":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_mpls_interface_Name, mplsInterfaceMapFunctions);
			break;
			//        	case "mpls.DynamicLsp":
			//			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_mpls_dynamic_lsp_Name, lspMapFunctions);
			//			break;
        	case "equipment.PhysicalPort":
		        jms_lag_update(className, objectName, propColl);
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_equipment_physical_port_Name, physicalMapFunctions);
			propChange_service_access_interface(className, objectName, propColl, reverse_equipment_physical_port_Name, physicalMapFunctions);

        		break;
	        // These are the same as physical port, but don't update the lag.
	        case "tdmequipment.DS1E1Channel":
	        case "tdmequipment.DS3E3Channel":
	        case "sonetequipment.Sts12Channel":
        	case "sonetequipment.Sts192Channel":
	        case "sonetequipment.Sts1Channel":
        	case "sonetequipment.Sts3Channel":
        	case "sonetequipment.Sts48Channel":
        	case "sonetequipment.TributaryChannel":
        	case "sonetequipment.Tu3Channel":
	        case "sonetequipment.TributaryGroup":
        	case "sonetequipment.Tug3Group":
	        case "tdmequipment.DS0ChannelGroup":
			ppp_channel_simple_propChange_with_mapping(className, objectName, propColl, reverse_equipment_physical_port_Name, physicalMapFunctions);
			break;
        	case "equipment.Shelf":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_equipment_shelf_Name, shelfMapFunctions);
			break;
        	case "equipment.HwEnvironment":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_equipment_hwEnvironment_Name);
			break;
		case "svt.MeshSdpBinding":
		case "svt.MirrorSdpBinding":
		case "svt.SpokeSdpBinding":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_svt_sdp_binding_Name, sdpMapFunctions);
			break;
		case "lag.Interface":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_lag_interface_Name, physicalMapFunctions);
			break;
		case "ppp.Interface":
		    jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_ppp_interface_Name, physicalMapFunctions);
		    ppp_control_protocol_propChange_with_mapping(objectName, propColl);
			break;
	    case "ppp.PppControlProtocol":
            jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_ppp_control_protocol_Name, physicalMapFunctions);
	        break;
        case "icmp.IcmpPing":
       	    jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_icmp_ping_Name, oamMapFunctions);
	        break;
	    case "mpls.LspPing":
	        jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_mpls_ping_Name, oamMapFunctions);
	        break;
		case "svt.TunnelPing":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_svt_tunnel_ping_Name, oamMapFunctions);
			break;
		case "svt.VccvPing":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_svt_vccv_ping_Name, oamMapFunctions);
			break;
		case "service.SitePing":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_service_site_ping_Name, oamMapFunctions);
			break;
		case "rtr.VirtualRouter":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_rtr_virtual_router_Name, vRtrMapFunctions);
			break;
		case "equipment.CardSlot":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_equipment_card_slot_Name, cardSlotMapFunctions);
			break;
		case "ethernetoam.CfmLoopback":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_cfm_loopback_Name, oamMapFunctions);
			break;
		case "ethernetoam.CfmEthTest":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_cfm_ethernet_Name, cfmTestMapFunctions);
			break;
		case "ethernetoam.CfmOneWayDelayTest":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_cfm_oneway_delay_Name, cfmTestMapFunctions);
			break;
		case "ethernetoam.CfmTwoWayDelayTest":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_cfm_twoway_delay_Name, cfmTestMapFunctions);
			break;
		case "aosqos.Policy":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_aosqos_policy_Name, aosqosMapFunctions);
			break;
		case "mpls.Site":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_mpls_site_Name, mplsSiteMapFunctions);
			break;
		case "svq.AggregationScheduler":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_svq_aggregation_schedular_name, svq_aggregation_schedular_map_functions);
			break;
		case "vprn.ServiceAccessPoint":
		case "ies.ServiceAccessPoint":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_service_access_point_Name, service_access_point_map_functions);
			break;
		case "ethernetoam.CfmSingleEndedLossTest":
			jms_simple_propChange_with_mapping(className, objectName, propColl, reverse_cfm_single_ended_loss_Name, cfmTestMapFunctions);
			break;
        	default:
        		logP4Msg("jms_propChange", "SAMIF", "Skipping unexpected className "+className);
        }

	definite_commit(modelInterface);

}


function possible_inline_commit(modelInterface)
{

	commit_count = commit_count+1;
	if (commit_count >=500) {
		logP4Msg("possible_inline_commit", "SAMIF",  "Doing inline commit after "+commit_count+" sublements.");
		modelInterface.inlineCommit();
		commit_count = 0;
		}
}


function commit_if_needed(modelInterface)
{
    var lastCommit = arguments.callee.lastCommitTime;
    var currentTime = modelInterface.currentDate;
    arguments.callee.lastCommitTime = currentTime;
	logP6Msg(arguments.callee.name, "SAMIF",  "commit_if_needed: entered");
	logStatus("lastCommit", lastCommit);
	logStatus("currentTime", currentTime);
    if (undefined == lastCommit)
    {
        lastCommit = currentTime;
    }
    if (currentTime > lastCommit)
    {
        logP6Msg(arguments.callee.name, "SAMIF",  "Committing model interface.");
        modelInterface.commit();
        commit_count = 0;
    }
}


function definite_commit(modelInterface)
{
    //do nothing commit_if_needed will commit
}


// This sets up the data structures used to keep track of the "Service" inventory.  More accurately these
// are used to keep track of composing the subelements that are made up of policy-fc-queue sets.

function initialize_service_structures()
{

    var i, g;

    fc_key_map = new Array();
    fc_fc_map = new Array();
    queue_key_map = new Array();
    accInt_ing_key_map = new Array();
    accInt_eg_key_map = new Array();
    accInt_storage = new Array();
    accInt_by_policy = new Array();
    policy_def_fc = new Array();
    policy_key_map = new Array();

    object_keymap = new Array();

    for (i=0; i<policy_list.length; i++) {
	g=policy_list[i];
	object_keymap[g] = new Array();
    }

}




function array_test() {

//var i, j;

for (var i in MasterPropertyMap) {
//	 logP6Msg("array_test", "SAMIF", "MasterPropertyMap index: "+i);
	 logP6Msg("array_test", "SAMIF", "MasterPropertyMap["+i+"] = "+MasterPropertyMap[i]);
	}


for (var i in ReverseMasterPropertyMap) {
//	 logP6Msg("array_test", "SAMIF", "ReverseMasterPropertyMap index: "+i);
	 logP6Msg("array_test", "SAMIF", "ReverseMasterPropertyMap["+i+"] = "+ReverseMasterPropertyMap[i]);
	}


for (var i in svc_access_interface_Name) {
//	 logP6Msg("array_test", "SAMIF", "svc_access_interface_Name index: "+i);
	 logP6Msg("array_test", "SAMIF", "svc_access_interface_Name["+i+"] = "+svc_access_interface_Name[i]);
	}

for (var i in reverse_svc_access_interface_Name) {
//	 logP6Msg("array_test", "SAMIF", "reverse_svc_access_interface_Name index: "+i);
	 logP6Msg("array_test", "SAMIF", "reverse_svc_access_interface_Name["+i+"] = "+reverse_svc_access_interface_Name[i]);
	}


}

function requestInventoryOnMinServerVersion(version, release_version, samObj, samClass, soapFilter, resultFilter, filePrefix) {

    var server_version;
    var server_release_version;
    //var inventory_request;

    server_version = app_config_value("SAM_SERVER_VERSION");
    server_release_version = app_config_value("SAM_SERVER_RELEASE_VERSION");

    for (var a_function in samObj)
    {
	    logP3Msg("checking sam object function", "SAMIF", "function in SamObject " + a_function );
    }
    /*if (server_version >= version) {

	logP3Msg("initializeSamObjects", "SAMIF", "initialize SamObject " + samClass );


	return(samObj.findToFile(samClass, soapFilter, resultFilter, filePrefix));
    } else {

	logP3Msg("requestInventoryOnMinServerVersion", "SAM", "Skipping inventory request for " + samClass + "; SAM server version is " + server_version + ", SAM version required for this class is " + version + " or greater.");
    }*/

    if (server_version == version)
    {
	    if (server_release_version >= release_version)
        {
		    logP3Msg("initializeSamObjects", "SAMIF", "initialize SamObject for Current SAM Server Version" + samClass );
    		return(samObj.findToFile(samClass, soapFilter, resultFilter, filePrefix));
	    }
	    else
        {
		    logP3Msg("requestInventoryOnMinServerVersion", "SAM", "Skipping inventory request for " + samClass + "; SAM release version is " + server_release_version + ", SAM release version required for this class is " + release_version + " or greater.");
	    }
    }
    else if ((server_version - 1) >= version)
    {
	    logP3Msg("initializeSamObjects", "SAMIF", "initialize SamObject for Other SAM Server Version " + samClass );
    	return(samObj.findToFile(samClass, soapFilter, resultFilter, filePrefix));
    } 
    else
    {
	    logP3Msg("requestInventoryOnMinServerVersion", "SAM", "Skipping inventory request for " + samClass + "; SAM server version is " + server_version + ", SAM version required for this class is " + version + " or greater.");
    }
}
	
