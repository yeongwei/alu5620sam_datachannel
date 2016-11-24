// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//ubaInventoryHandlers
var ubaInventoryHandlers = { 
	// *** Inventory classes ***
	"equipment.PhysicalPort": equipment_physical_port,		//found
		
	"equipment.Shelf": equipment_shelf,						//found
	"equipment.HwEnvironment": equipment_hw_environment,	//found
	"equipment.CardSlot": process_equipment_card_slot,		//found
	"lag.Interface": lag_interface,							//found
	"mpls.Interface": mpls_interface,						//found
	"svt.MeshSdpBinding": svt_sdp_binding,					//found
	"svt.MirrorSdpBinding": svt_sdp_binding,				//found
	"svt.SpokeSdpBinding": svt_sdp_binding,					//found
	
	//added at 3-01-2014
	"mpr.IMALink": equipment_ima_Link,
	"tdmequipment.DS1E1PortSpecifics": tdmequipment_DS1E1_PortSpecific,
	
	//********New Inventory Classes in SAM 2.14 : 7th January

	"equipment.BaseCard": equipment_basecard,
	"equipment.DaughterCard": equipment_daughtercard,
	"equipment.MCMCard": equipment_mcmcard,
	"equipment.ControlProcessor": equipment_controlprocessor,
	"nat.IsaMda": nat_IsaMda,
	"nat.IsaMember": nat_IsaMember,
	"dhcp.Dhcp6AddressPrefix": process_dhcp_dhcp6addressprefix,
	"dhcp.Subnet": process_dhcp_subnet,
	
	//DDM
	"equipment.DigitalDiagnosticMonitoring": process_digital_diagnostic_monitoring,
	
	//Nat Pool
	"nat.NatPool": nat_natpool,
	
	//L2TP
	"l2tp.Site":l2tp_site,
	
	//Flash Memory
	"equipment.FlashMemory":equipment_flash_memory,
	
	//***LTE related inventory classes
	"lte.S1uPeer":lte_S1uPeer,
	"lte.S5Peer":lte_S5Peer,
	"lte.S8Peer":lte_S8Peer,
	"lte.S11Peer":lte_S11Peer,
	"ltemme.MmeServiceMemberMaf":ltemme_MmeServiceMemberMaf,
	
	//Added at 7-12-2012
	"svt.VccvPing":process_svt_vccv_ping,

	//OAM Ping
	"ethernetoam.CfmLoopback": process_cfm_loopback,		//found
    "ethernetoam.CfmOneWayDelayTest": process_cfm_oneway_delay,//found
    "ethernetoam.CfmTwoWayDelayTest": process_cfm_twoway_delay,//found
    "ethernetoam.CfmEthTest": process_cfm_ethernet,			//found
	"ethernetoam.CfmSingleEndedLossTest": process_cfm_single_ended_loss,//found
	"ethernetoam.Mep": process_ethernetoam_mep,
	
	
	// Policies
	"aingr.Policy": process_aingr_policy,					//found
	//Mistake!!!
	//"aengr.Policy": process_aingr_policy,
	"aengr.Policy": process_aengr_policy,					//found
	"sasqos.AccessIngress": process_aingr_policy,			//found
	"sasqos.PortAccessEgress": process_generic_policy,		//found
	"nqueue.Policy": process_generic_policy,				//found
		
	// Forwarding classes
	"aengr.ForwardingClass": process_aingr_aengr_forwarding_class,	//found
	"aingr.ForwardingClass": process_aingr_aengr_forwarding_class,	//found
	"sasqos.AccessIngressForwardingClass": process_aingr_aengr_forwarding_class,	//found
	"sasqos.PortAccessEgressForwardingClass": process_aingr_aengr_forwarding_class,//found
	"nqueue.ForwardingClass": process_aingr_aengr_forwarding_class,	//found

	// Queues
	"aengr.Queue": aingr_aengr_queue,						//found
	"aingr.Queue": aingr_aengr_queue,						//found
	"sasqos.Meter": aingr_aengr_queue,						//found
	"sasqos.PortAccessEgressQueue": aingr_aengr_queue,		//found
	"nqueue.Entry": aingr_aengr_queue,						//found

	// Access interfaces (SAPs)
	"vll.L2AccessInterface": process_access_interface,		//found
	"ipipe.L2AccessInterface": process_access_interface,	//found
	"vprn.L3AccessInterface": process_access_interface,		//found
	"ies.L3AccessInterface": process_access_interface,		//found
	"vpls.L2AccessInterface": process_access_interface,		//found
	"mirror.L2AccessInterface": process_access_interface,	//found
	//Added on 8 Nov 2012
	"service.AccessInterface": process_access_interface,
	"svq.AggregationScheduler": process_svq_aggregation_schedular,//MSS	//found
	//Potentially missing inventory class
	//vprn_service_access_point -> vprn.ServiceAccessPoint -> no process?
	"vprn.ServiceAccessPoint": process_service_access_point,//found
	//ies_service_access_point -> ies.ServiceAccessPoint
	"ies.ServiceAccessPoint": process_service_access_point,	//found
	//ethernetoam_mep -> Ok, only cache
	"ethernetoam.Mep": process_ethernetoam_mep,
	//service_vpls -> Ok, only cache
	"vpls.Vpls": process_service_vpls,
	//service_epipe -> Ok, only cache
	"epipe.Epipe": process_service_epipe,
	//svq_aggregation_schedular -> not in soap_filter and domain_model
	//mpls_site -> mpls.Site
	"mpls.Site": process_mpls_site,									//found
	//aosqos_policy -> aosqos.Policy
	"aosqos.Policy": process_aosqos_policy,							//found
	//virtual_router -> rtr.VirtualRouter
	"rtr.VirtualRouter": process_rtr_virtual_router,				//found
	//site_ping -> service.SitePing
	"service.SitePing": process_service_site_ping,					//found
	//vccv_ping -> svt.VccvPing
	"svt.VccvPing": process_svt_vccv_ping,							//found
	//tunnel_ping -> svt.TunnelPingResult
	"svt.TunnelPing": process_svt_tunnel_ping,						//found
	//icmp_ping -> icmp.IcmpPingResult
	//"icmp.IcmpPingResult": process_icmp_ping,						
	"icmp.IcmpPing": process_icmp_ping,								//found
	//mpls_ping -> mpls.LspPingResult
	//"mpls.LspPingResult": process_mpls_ping,
	"mpls.LspPing": process_mpls_ping,								//found
	//ppp_control_protocol -> soap_filter commented
	"ppp.PppControlProtocol": ppp_control_protocol,					//found
	//ppp_interface -> ppp.Interface
	"ppp.Interface": ppp_interface,									//found
	//tdmequipment.DS0ChannelGroup -> tdm_ds0channelgroup
	"tdmequipment.DS0ChannelGroup": process_equipment_channel,		//found
	//sonetequipment.Tug3Group -> sonet_tug3group
	"sonetequipment.Tug3Group": process_equipment_channel,			//found
	//sonetequipment.TributaryGroup -> sonet_tributarygroup
	"onetequipment.TributaryGroup": process_equipment_channel,		//found
	//sonetequipment.Tu3Channel -> sonetequipment_tributarychannel
	"sonetequipment.Tu3Channel": process_equipment_channel,			//found
	//sonetequipment.Sts48Channel -> sonetequipment_sts48channel
	"sonetequipment.Sts48Channel": process_equipment_channel,		//found
	//sonetequipment.Sts3Channel -> sonetequipment_sts3channel
	"sonetequipment.Sts3Channel": process_equipment_channel,		//found
	//sonetequipment.Sts1Channel  -> sonetequipment_sts1channel
	"sonetequipment.Sts1Channel": process_equipment_channel,		//found
	//sonetequipment.Sts192Channel -> sonetequipment_sts192channel
	"sonetequipment.Sts192Channel": process_equipment_channel,		//found
	//sonetequipment.Sts12Channel -> sonetequipment_sts12channel
	"sonetequipment.Sts12Channel": process_equipment_channel,		//found
	//tdmequipment.DS3E3Channel -> tdmequipment_ds3e3channel
	"tdmequipment.DS3E3Channel": process_equipment_channel,			//found
	//tdmequipment.DS1E1Channel -> tdmequipment_ds1e1channel
	"tdmequipment.DS1E1Channel": process_equipment_channel,			//found
	//Added at 26 December 2012
	"mpls.DynamicLsp": mpls_dynamic_lsp,
	"sonetequipment.TributaryChannel": process_equipment_channel

	// *** End of inventory classes ***
};//End //ubaInventoryHandlers

//ubaMetricHandlers
var ubaMetricHandlers = {
	// *** Metric classes ***
	// Physical Port	
	"equipment.SystemCpuStatsLogRecord": process_equipment_SystemCpuStats, //28 March 2013
	"equipment.SystemMemoryStatsLogRecord": process_equipment_SystemMemoryStats, //28 March 2013
	"equipment.AllocatedMemoryStatsLogRecord": process_equipment_AllocatedMemoryStats, //28 March 2013
	"equipment.AvailableMemoryStatsLogRecord": process_equipment_AvailableMemoryStats, //28 March 2013
	"equipment.InterfaceStatsLogRecord": process_equipment_interface_stats,	//28 March 2013
	"equipment.InterfaceAdditionalStatsLogRecord": process_equipment_interface_additional_stats, //28 March 2013
	"equipment.DigitalDiagnosticMonitoring": process_digital_diagnostic_monitoring, //28 March 2013
	"equipment.MediaIndependentStatsLogRecord": process_equipment_media_independent_stats, //28 March 2013
	
	// Service Queue And Network Queue
	"service.NetworkEgressPacketsLogRecord" : process_combined_network_egress_stats,//10 April 2013
	"service.NetworkIngressPacketsLogRecord": process_combined_network_ingress_stats,//10 April 2013
	
	"service.CombinedNetworkIngressOctetsLogRecord": process_combined_network_ingress_stats,//10 April 2013
	"service.CombinedNetworkEgressOctetsLogRecord": process_combined_network_egress_stats,//10 April 2013
	
	"service.CompleteServiceEgressPacketOctetsLogRecord": process_svc_complete_service_egress_packet_octets,//10 April 2013
	"service.CompleteServiceIngressPacketOctetsLogRecord": process_svc_complete_service_ingress_packet_octets,//10 April 2013
	
	"service.ServiceEgressOctetsLogRecord": process_svc_complete_service_egress_packet_octets,//10 April 2013
	"service.ServiceEgressPacketsLogRecord": process_svc_complete_service_egress_packet_octets,//10 April 2013
	
	"service.ServiceIngressOctetsLogRecord": process_svc_complete_service_ingress_packet_octets,//10 April 2013
	"service.ServiceIngressPacketsLogRecord": process_svc_complete_service_ingress_packet_octets,//10 April 2013
	
	// SDP Binding
	"svt.SdpBindingBaseStatsLogRecord": process_sdp_binding_base,
	
	//MPLS
	"mpls.MplsInterfaceStatsLogRecord": process_mpls_interface_stats,	//01 April 2013
	"mpls.SiteStatsLogRecord": process_mpls_site_stats,	//01 April 2013
	
	//OAM Ping Test
	"icmp.IcmpPingResult": process_oam_ping_results_stats,
	"mpls.LspPingResult": process_oam_ping_results_stats,
	"svt.TunnelPingResult": process_oam_ping_results_stats,
	"svt.VccvPingResult": process_oam_ping_results_stats,
	"service.SitePingResult": process_oam_ping_results_stats,
	"ethernetoam.CfmLoopbackResult": process_oam_ping_results_stats,
	"ethernetoam.CfmTwoWayDelayTestResult": process_oam_ping_results_stats,
	
	"ethernetoam.CfmOneWayDelayTestResult": process_cfm_oneway_delay_results_stats,
	"ethernetoam.CfmEthTestResult": process_cfm_ethernet_results_stats,
	"ethernetoam.CfmSingleEndedLossTestResult": process_cfm_single_ended_loss_results_stats,
		
	//PPP
	"ppp.PppControlProtocol": process_ppp_control_protocol_stats,//01 April 2013
	"ppp.PppStatsLogRecord": process_ppp_InterfaceStats,	//01 April 2013
	
	//Virtual Router
	"rtr.RouteStatsLogRecord": process_rtr_route_stats,	//01 April 2013
	
	//OmniSwitch Policy and Card Health
	//"aosqos.QoSIngressPolicyStatsLogRecord": process_aosqos_policy,
	"aosqos.QoSIngressPolicyStatsLogRecord": process_aosqos_policy_metric,	//01 April 2013
	"equipment.CardHealthStatsLogRecord": process_card_slot_stats, //28 March 2013
		
	//Dot 3 Stats
	"ethernetequipment.Dot3StatsLogRecord": process_ethernet_equipment_dot3_stats, //28 March 2013
	
	//DDM
	"equipment.DDMStatsLogRecord": process_ddm_stats_log_record,
	
	//NAT Pool
	"nat.NatPoolLsnStatsLogRecord": process_nat_pool_lsnstats_log_record,
	"nat.NatPoolL2AwStatsLogRecord": process_nat_pool_l2awstats_log_record,
	//L2TP
	"l2tp.SiteStatsLogRecord": process_l2tp_site_stats_log_record,
	
	//Flash Memory
	"equipment.FlashMemory":process_equipment_flash_memory_stats,
	
	//Cpu MonStats
	"equipment.SystemCpuMonStats":process_equipment_SystemCpuMonStats,
	
	//EthernetStatslogRecord
	"ethernetequipment.EthernetStatsLogRecord":process_ethernet_stats_log_record,
	
	//Complete Network Egress
	"service.CompleteNetworkEgressPacketOctetsLogRecord":process_complete_network_egress_packet_octets_log_record,
	
	//Complete Network Ingress
	"service.CompleteNetworkIngressPacketOctetsLogRecord":process_complete_network_ingress_packet_octets_log_record,
	
	//MSS
	"svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord": process_mss_egress,//
	"svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord": process_mss_ingress,//
	
	//PPPoE
	"service.PppoeSapStatsLogRecord": process_svc_pppoe,//

	
	//3rd January 2014 new in SAM 2.13 find2file pack
	"ethernetequipment.AggrMaintRxStatsLogRecord": process_aggr_maint_rx_stats,//3rd January 2014
	"ethernetequipment.AggrMaintTxStatsLogRecord": process_aggr_maint_tx_stats,//3rd January 2014
	
	//6th January 2014 new in SAM 2.13 find2file pack
	"mpr.IMALinkCurrentStatsLogRecord": process_IMA_Link_Current_Stats,
	"radioequipment.PdhFrameHopHistoryDataStats15MinLogRecord": process_Pdh_Frame_Hop_History_Data_Stats,
	"radioequipment.PdhFrameLinkHistoryDataStats15MinLogRecord": process_Pdh_Frame_Link_History_Data_Stats,
	"radioequipment.RadioAnalogueMeasureLogRecord": process_Radio_Analogue_Measure,
	"tdmequipment.DS1HistoryStats15minInLogRecord": process_DS1_History_Stats_15min_In_Log_Record,
	"tdmequipment.DS1HistoryStats15minOutLogRecord": process_DS1_History_Stats_15min_Out_Log_Record,
	"tdmequipment.E1HistoryStats15minInLogRecord": process_E1_History_Stats_15min_In_Log_Record,
	"tdmequipment.E1HistoryStats15minOutLogRecord": process_E1_History_Stats_15min_Out_Log_Record,
	
	//7th January 2014 new in SAM 2.14 find2file pack
	"dhcp.LocalDhcp6ServerPrefixStatsLogRecord": process_dhcp_localDhcp6ServerPrefixStats,
	"dhcp.LocalDhcpServerSubnetStatsLogRecord": process_dhcp_localDhcpServerSubnetStats,
	"equipment.SystemCpuMonStatsLogRecord": process_equipment_SystemCpuMonStats,
	"equipment.HardwareTemperatureLogRecord": process_equipment_hw_temprature_stats,
	"nat.IsaMemberUsageStatsLogRecord": process_nat_IsaMemberUsageStats,
	
	//HW Environment
	"equipment.HwEnvironment": process_equipment_hw_environment_stats, //01 April 2013
	
	//lte metric classes
	"lte.S1uAgwPeerStatsLogRecord": process_lte_S1uAgwPeer_stats,
	"lte.S5AgwPeerStatsLogRecord": process_lte_S5AgwPeer_stats,
	"ltegw.S5AgwFailureCodeStatsLogRecord": process_ltegw_S5AgwFailureCode_stats,
	"lte.S8AgwPeerStatsLogRecord": process_lte_S8AgwPeer_stats,
	"ltegw.S8AgwFailureCodeStatsLogRecord": process_ltegw_S8AgwFailureCode_stats,
	"lte.S11AgwPeerStatsLogRecord": process_lte_S11AgwPeer_stats,
	"ltegw.S11FailureCodeStatsLogRecord": process_ltegw_S11FailureCode_stats,
	"ltemme.MAFConnectionLogRecord": process_ltemme_MAFConnection
	
	
	
};//End ubaMetricHandlers

/*
 * 26 March 2013: Mapping metric class to timestamp attribute
 */
//metricClassTimestampMapping
var metricClassTimestampMapping = {
	// Physical Port	
	"equipment.SystemCpuStatsLogRecord": "timeCaptured",//
	"equipment.SystemMemoryStatsLogRecord": "timeCaptured",
	"equipment.AllocatedMemoryStatsLogRecord": "timeCaptured",//
	"equipment.AvailableMemoryStatsLogRecord": "timeCaptured",//
	"equipment.InterfaceStatsLogRecord": "timeCaptured",//
	"equipment.InterfaceAdditionalStatsLogRecord": "timeCaptured",//
	"equipment.DigitalDiagnosticMonitoring": "mtosiTime",//Special case
	"equipment.MediaIndependentStatsLogRecord": "timeCaptured",//
		
	// Service Queue And Network Queue
	"service.NetworkEgressPacketsLogRecord" : "timeRecorded",
	"service.NetworkIngressPacketsLogRecord": "timeRecorded",
	
	"service.CombinedNetworkIngressOctetsLogRecord": "timeRecorded",
	"service.CombinedNetworkEgressOctetsLogRecord": "timeRecorded",
	
	"service.CompleteServiceEgressPacketOctetsLogRecord": "timeRecorded",
	"service.CompleteServiceIngressPacketOctetsLogRecord": "timeRecorded",
	
	"service.ServiceEgressOctetsLogRecord": "timeRecorded",
	"service.ServiceEgressPacketsLogRecord": "timeRecorded",
	
	"service.ServiceIngressOctetsLogRecord": "timeRecorded",
	"service.ServiceIngressPacketsLogRecord": "timeRecorded",
		
	// SDP Binding
	"svt.SdpBindingBaseStatsLogRecord": "timeCaptured",//
	
	
	//DDM
	"equipment.DDMStatsLogRecord": "timeCaptured",
	
	
	//NAT Pool
	"nat.NatPoolLsnStatsLogRecord": "timeCaptured",
	"nat.NatPoolL2AwStatsLogRecord": "timeCaptured",
	
	//L2TP
	"l2tp.SiteStatsLogRecord": "timeCaptured",
		
	//Flash Memory
	"equipment.FlashMemory":"mtosiTime", //Special Case
		
	//EthernetStatslogRecord
	"ethernetequipment.EthernetStatsLogRecord":"timeCaptured",
	
	//Cpu MonStats
	"equipment.SystemCpuMonStats":"timeCaptured",
	
	//Complete Network Egress
	"service.CompleteNetworkEgressPacketOctetsLogRecord":"timeCaptured",
	
	//Complete Network Ingress
	"service.CompleteNetworkIngressPacketOctetsLogRecord":"timeCaptured",
		
	//MPLS
	"mpls.MplsInterfaceStatsLogRecord": "timeCaptured",//
	"mpls.SiteStatsLogRecord": "timeCaptured",//
		
	//OAM Ping Test
	"icmp.IcmpPingResult": "scheduledTime",//
	"mpls.LspPingResult": "scheduledTime",//
	"svt.TunnelPingResult": "scheduledTime",//
	"svt.VccvPingResult": "scheduledTime",//
	"service.SitePingResult": "scheduledTime",//
	"ethernetoam.CfmLoopbackResult": "scheduledTime",//
	"ethernetoam.CfmTwoWayDelayTestResult": "scheduledTime",//
		
	"ethernetoam.CfmOneWayDelayTestResult": "scheduledTime",//
		
	"ethernetoam.CfmEthTestResult": "scheduledTime",//
	"ethernetoam.CfmSingleEndedLossTestResult": "scheduledTime",//
			
	//PPP
	"ppp.PppControlProtocol": "mtosiTime",//Special case
	"ppp.PppStatsLogRecord": "timeCaptured",//
	
	//Virtual Router
	"rtr.RouteStatsLogRecord": "timeCaptured",//
	
	//OmniSwitch Policy and Card Health
	//"aosqos.QoSIngressPolicyStatsLogRecord": process_aosqos_policy,
	"aosqos.QoSIngressPolicyStatsLogRecord": "timeCaptured",//
	"equipment.CardHealthStatsLogRecord": "timeCaptured",//
			
	//Dot 3 Stats
	"ethernetequipment.Dot3StatsLogRecord": "timeCaptured",//
		
	//MSS
	"svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord": "timeCaptured",//
	"svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord": "timeCaptured",//
		
	//PPPoE//Depending on SAP inv
	"service.PppoeSapStatsLogRecord": "timeCaptured",//
	
	//3rd January 2014
	"ethernetequipment.AggrMaintRxStatsLogRecord": "timeCaptured",//3rd January 2014
	"ethernetequipment.AggrMaintTxStatsLogRecord": "timeCaptured",
	
	//6th January 2014
	"mpr.IMALinkCurrentStatsLogRecord": "timeCaptured",
	"radioequipment.PdhFrameHopHistoryDataStats15MinLogRecord": "timeCaptured",
	"radioequipment.PdhFrameLinkHistoryDataStats15MinLogRecord": "timeCaptured",
	"radioequipment.RadioAnalogueMeasureLogRecord": "timeCaptured",
	"tdmequipment.DS1HistoryStats15minInLogRecord": "timeCaptured",
	"tdmequipment.DS1HistoryStats15minOutLogRecord": "timeCaptured",
	"tdmequipment.E1HistoryStats15minInLogRecord": "timeCaptured",
	"tdmequipment.E1HistoryStats15minOutLogRecord": "timeCaptured",
	
	
	//7th January 2014 new in sam 2.14 find2file pack
	"dhcp.LocalDhcp6ServerPrefixStatsLogRecord": "timeCaptured",
	"dhcp.LocalDhcpServerSubnetStatsLogRecord": "timeCaptured",
	"equipment.SystemCpuMonStatsLogRecord": "timeCaptured",
	"equipment.HardwareTemperatureLogRecord": "timeCaptured",
	"nat.IsaMemberUsageStatsLogRecord": "timeCaptured",
	
	//HW Environment
	"equipment.HwEnvironment": "mtosiTime",//Special case
		
	//lte metric classes
	"lte.S1uAgwPeerStatsLogRecord": "timeCaptured",
	"lte.S5AgwPeerStatsLogRecord": "timeCaptured",
	"ltegw.S5AgwFailureCodeStatsLogRecord": "timeCaptured",
	"lte.S8AgwPeerStatsLogRecord": "timeCaptured",
	"ltegw.S8AgwFailureCodeStatsLogRecord": "timeCaptured",
	"lte.S11AgwPeerStatsLogRecord": "timeCaptured",
	"ltegw.S11FailureCodeStatsLogRecord": "timeCaptured",
	"ltemme.MAFConnectionLogRecord": "timeCaptured"

};//End metricClassTimestampMapping

/*
    "icmp.IcmpPing", "fromNodeId"
    "mpls.LspPing", "fromNodeId"
    "svt.VccvPing", "fromNodeId"
    "svt.TunnelPing", "fromNodeId"
    "service.SitePing", "fromNodeId"
    "mirror.L2AccessInterface", "nodeId"
    "svt.MeshSdpBinding", "fromNodeId"
    "svt.MirrorSdpBinding", "fromNodeId"
    "svt.SpokeSdpBinding", "fromNodeId"
    "equipment.Shelf", "siteId"
    "equipment.HwEnvironment", "siteId"
    "lag.Interface", "siteId"
    "mpls.Interface", "nodeId"
    "mpls.DynamicLsp", "siteId"
    "vprn.L3AccessInterface", "nodeId"
    "ies.L3AccessInterface", "nodeId"
    "vpls.L2AccessInterface", "nodeId"
    "vll.L2AccessInterface", "nodeId"
    "nqueue.Entry", "siteId"
    "sonetequipment.Sts1Channel", "siteId"
    "sonetequipment.Sts3Channel", "siteId"
    "sonetequipment.Sts12Channel", "siteId"
    "sonetequipment.Sts48Channel", "siteId"
    "sonetequipment.Sts192Channel", "siteId"
    "tdmequipment.DS1E1Channel", "siteId"
    "tdmequipment.DS3E3Channel", "siteId"
    "sonetequipment.TributaryChannel", "siteId"
    "sonetequipment.Tu3Channel", "siteId"
    "tdmequipment.DS0ChannelGroup", "siteId"
    "sonetequipment.TributaryGroup", "siteId"
    "sonetequipment.Tug3Group", "siteId"
    "ppp.Interface", "nodeId"
    "rtr.VirtualRouter", "siteId"
    "ipipe.L2AccessInterface", "nodeId"
    "equipment.CardSlot", "siteId"
    "ethernetoam.CfmLoopback", "siteId"
    "ethernetoam.CfmOneWayDelayTest", "siteId"
    "ethernetoam.CfmTwoWayDelayTest", "siteId"
    "ethernetoam.CfmEthTest", "siteId"
    "aosqos.Policy", "siteId"
    "mpls.Site", "siteId"
    "svq.AggregationScheduler", "siteId"
    "vprn.ServiceAccessPoint", "nodeId"
    "ies.ServiceAccessPoint", "nodeId"
*/

function dump_samObject(samObject) 
{
    logP6Msg("dump_samObject", "SAMIF", "beginning");

    nilStatus("samObject", samObject);

    if (isUndef(samObject)) 
    {
    	logP6Msg("dump_samObject", "SAMIF", "samObject input is undefined");
    } 
    else 
    {
    	for(var i in samObject) 
    	{
    		/*
	      	logP6Msg("dump_samObject", "SAMIF", "i is "+i);
	      	logP6Msg("dump_samObject", "SAMIF", "samObject[i] is "+samObject[i]);
    		 */
    		logStatus(i.toString(), samObject[i]);
    	}
    }

    logP6Msg("dump_samObject", "SAMIF", "ending");
}

function initUbaClassHandlers()
{
    logP3Msg("initUbaClassHandlers", classname, "Entering");

    /*  ???
    logStatus("ubaClassHandlers", ubaClassHandlers);

    dump_samObject(ubaClassHandlers);

    logStatus("ubaInventoryHandlers", ubaInventoryHandlers);
    dump_samObject(ubaInventoryHandlers);
    logStatus("ubaMetricHandlers", ubaMetricHandlers);
    dump_samObject(ubaMetricHandlers);

    */

    ubaClassHandlers["C"]=ubaInventoryHandlers;
    ubaClassHandlers["M"]=ubaMetricHandlers;
    /*
    ubaClassHandlers["JMS_C"]=jmsObjectCreateHandlers;
    ubaClassHandlers["JMS_D"]=jmsObjectDeleteHandlers;
    ubaClassHandlers["JMS_A"]=jmsAttributeValueChangeHandlers;
    */
    //DEBUG: Are these supposed to be enabled?
    //ubaClassHandlers["A"]=jmsAttributeValueChangeHandlers;
}

function get_class_handler(dataType, classname) 
{
    var handlerSet = ubaClassHandlers[dataType];

    if (isUndef(handlerSet)) 
    {
    	logP3Msg("get_class_handler", "SAMUBA", "No known handlerSet of dataType: " + dataType);
    	return;
    }
	
	logP3Msg("get_class_handler", "SAMUBA", "Type of dataType: " + typeof handlerSet);
	//dump_samObject(handlerSet);

    return ubaClassHandlers[dataType][classname];
}

// Sets up the class objects with the handlers and the associated data the handlers need
function initClassObjects() 
{
    var /*dataType, className,*/ classObject, handler;

    //logP3Msg("addClassHandler", "SAMUBA", "Entering");
    
    for (var dataType in ubaClassHandlers)//x["M"] = {"a": "b"} 
    {
    	for (var className in ubaClassHandlers[dataType]) 
    	{

    		logP4Msg("addClassHandler", "Debug", "Looking for handler for datatype: " + dataType + " and class: " + className);

    		classObject = get_class_entry(dataType, className);
    		
    		logP4Msg("addClassHandler", "Debug", "Look into classObject");
    		dump_samObject(classObject);
    		
	    	if (isUndef(classObject)) 
	    	{
	    		logP4Msg("addClassHandler", "SAMUBA", "Can't find object for datatype: " + dataType + " and class: " + className);
	    		continue;
	    	}

	    	handler = get_class_handler(dataType, className);
	    	
	    	logP4Msg("addClassHandler", "Debug", "Look into handler");
    		dump_samObject(handler);
    		
	    	if (isUndef(handler)) 
	    	{
	    		logP3Msg("addClassHandler", "SAMUBA", "No known handler function for class: " + className);
	    		// If you can't find a handler, make sure you have imported the script in the main file
	    		continue;
	    	}
	    
	    	//logP3Msg("addClassHandler", "SAMUBA", "Initializing handler for datatype: " + dataType + " and class: " + className);
			//logP3Msg("addClassHandler", "SAMUBA", "Initializing handler for handler: " + handler);

	    	classObject.dataType = dataType;
	    	classObject.className = className;  // for debug purposes
	    	classObject.handler = handler;

	    	if (dataType == "C") 
	    	{
	    		classObject.timestampHack = true;
	    	}
    	} // className
    } // dataType
}

function jmsAttributeValueChangeAddHandlerInfo(className, func, propArray, mapArray) 
{
    // propArray and mapArray are optional, used only if you want to map property enumeration values to English values
	logP4Msg("jmsAttributeValueChangeAddHandlerInfo", "Debug", "className -> " + className);
    var classObject = get_class_entry("A", className);
    logP4Msg("jmsAttributeValueChangeAddHandlerInfo", "Debug", "typeOf classObject -> " + typeof classObject);
    logP4Msg("jmsAttributeValueChangeAddHandlerInfo", "Debug", "Look into classObject");
    dump_samObject(classObject);
    
    if (isUndef(classObject)) 
    {
    	logP3Msg("jmsAttributeValueChangeAddHandlerInfo", "SAMUBA", "ClassObject not found for " + className);
    	return;
    }

    if (isUndef(func)) 
    {
    	logP3Msg("jmsAttributeValueChangeAddHandlerInfo", "SAMUBA", "JMS attribute value change function not found for " + className);
    	return;
    }
    
    classObject.dataType = "A";
    classObject.handler = jmsAtrributeValueChangeDispatchHandler;//General callback function for all JMS events to invoke func
    classObject.className = className; // for debug
    classObject.jmsAttributeValueChangeFunc = func;//This function will be invoked by jmsAtrributeValueChangeDispatchHandler();
    classObject.jmsPropArray = propArray;
    classObject.jmsMapArray = mapArray;
    classObject.timestampHack = true;
	
	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Attribute Change " + classObject.dataType);
	
	//logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Attribute Change " + classObject.handler);
	//logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Attribute Change " + classObject.className);
}

function jmsDeleteAddHandlerInfo(className, func) 
{
    // propArray and mapArray are optional, used only if you want to map property enumeration values to English values

    var classObject = get_class_entry("D", className);

    if (isUndef(classObject)) {
	logP3Msg("jmsDeleteAddHandlerInfo", "SAMUBA", "ClassObject not found for " + className);
	return;
    }

    if (isUndef(func)) {
	logP3Msg("jmsDeleteAddHandlerInfo", "SAMUBA", "JMS delete function not found for " + className);
	return;
    }
    classObject.dataType = "D";
    classObject.handler = jmsDeleteDispatchHandler;
    classObject.className = className; // for debug
    classObject.jmsDeleteFunc = func;
    classObject.timestampHack = true;
}

function initJmsAttributeValueChangeHandlers() 
{
	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Attribute Change");
    //access interfaces aka SAPs
    jmsAttributeValueChangeAddHandlerInfo("vll.L2AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ipipe.L2AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("vpls.L2AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("mirror.L2AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    
    jmsAttributeValueChangeAddHandlerInfo("vprn.L3AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ies.L3AccessInterface", propChange_service_access_interface, reverse_svc_access_interface_Name, serviceMapFunctions);
    //access interfaces aka SAPs
    
    // forwarding classes
    jmsAttributeValueChangeAddHandlerInfo("aingr.ForwardingClass", propChange_aingr_aengr_forwarding_class);
    jmsAttributeValueChangeAddHandlerInfo("aengr.ForwardingClass", propChange_aingr_aengr_forwarding_class);
    jmsAttributeValueChangeAddHandlerInfo("sasqos.AccessIngressForwardingClass", propChange_aingr_aengr_forwarding_class);
    jmsAttributeValueChangeAddHandlerInfo("sasqos.PortAccessEgressForwardingClass", propChange_aingr_aengr_forwarding_class);
    jmsAttributeValueChangeAddHandlerInfo("nqueue.ForwardingClass", propChange_aingr_aengr_forwarding_class);

    // queues
    jmsAttributeValueChangeAddHandlerInfo("aingr.Queue", propChange_aingr_aengr_queue);
    jmsAttributeValueChangeAddHandlerInfo("aengr.Queue", propChange_aingr_aengr_queue);
    jmsAttributeValueChangeAddHandlerInfo("sasqos.Meter", propChange_aingr_aengr_queue);
    jmsAttributeValueChangeAddHandlerInfo("sasqos.PortAccessEgressQueue", propChange_aingr_aengr_queue);
    jmsAttributeValueChangeAddHandlerInfo("nqueue.Entry", propChange_aingr_aengr_queue);

    // policies
    jmsAttributeValueChangeAddHandlerInfo("aingr.Policy", propChange_aingr_policy);
    //14 Janaury 2013: Missing
    jmsAttributeValueChangeAddHandlerInfo("aengr.Policy", propChange_aingr_policy);
    jmsAttributeValueChangeAddHandlerInfo("sasqos.AccessIngress", propChange_aingr_policy);
    //    jmsAttributeValueChangeAddHandlerInfo("sasqos.AccessEgress", propChange_aingr_policy);
    jmsAttributeValueChangeAddHandlerInfo("nqueue.Policy", propChange_aingr_policy);
    // aengr.Policy -- we don't need to do anything with this one for property changes

    jmsAttributeValueChangeAddHandlerInfo("mpls.Interface", jms_simple_propChange_with_mapping, reverse_mpls_interface_Name, mplsInterfaceMapFunctions);

    jmsAttributeValueChangeAddHandlerInfo("equipment.PhysicalPort", physicalPortJmsUpdate, reverse_equipment_physical_port_Name, physicalMapFunctions);
    // These are similar to physical port, but don't update the LAG
    jmsAttributeValueChangeAddHandlerInfo("tdmequipment.DS1E1Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("tdmequipment.DS3E3Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Sts12Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Sts192Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Sts1Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Sts3Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Sts48Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.TributaryChannel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Tu3Channel", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.TributaryGroup", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("sonetequipment.Tug3Group", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("tdmequipment.DS0ChannelGroup", ppp_channel_simple_propChange_with_mapping, reverse_equipment_physical_port_Name, physicalMapFunctions);

    
    jmsAttributeValueChangeAddHandlerInfo("equipment.Shelf", jms_simple_propChange_with_mapping, reverse_equipment_shelf_Name, shelfMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("equipment.HwEnvironment", jms_simple_propChange_with_mapping, reverse_equipment_hwEnvironment_Name);

    //*************New in SAM 2.13 
    jmsAttributeValueChangeAddHandlerInfo("mpr.IMALink", jms_simple_propChange_with_mapping, reverse_equipment_ima_Link_Name);
    jmsAttributeValueChangeAddHandlerInfo("tdmequipment.DS1E1PortSpecifics", jms_simple_propChange_with_mapping, reverse_tdmequipment_DS1E1_PortSpecific_Name);
    
    //**************New in SAM 2.14 Updated on 7th January
    
    jmsAttributeValueChangeAddHandlerInfo("equipment.BaseCard", jms_simple_propChange_with_mapping, reverse_equipment_basecard_Name);
    jmsAttributeValueChangeAddHandlerInfo("equipment.DaughterCard", jms_simple_propChange_with_mapping, reverse_equipment_daughtercard_Name);
    jmsAttributeValueChangeAddHandlerInfo("equipment.MCMCard", jms_simple_propChange_with_mapping, reverse_equipment_mcmcard_Name);
    jmsAttributeValueChangeAddHandlerInfo("equipment.ControlProcessor", jms_simple_propChange_with_mapping, reverse_equipment_controlprocessor_Name);
    jmsAttributeValueChangeAddHandlerInfo("nat.IsaMda", jms_simple_propChange_with_mapping, reverse_nat_IsaMda_Name);
    jmsAttributeValueChangeAddHandlerInfo("nat.IsaMember", jms_simple_propChange_with_mapping, reverse_nat_IsaMember_Name);
    jmsAttributeValueChangeAddHandlerInfo("dhcp.Dhcp6AddressPrefix", jms_simple_propChange_with_mapping, reverse_dhcp_dhcp6AddressPrefix_Name);
    jmsAttributeValueChangeAddHandlerInfo("dhcp.Subnet", jms_simple_propChange_with_mapping, reverse_dhcp_subnet_Name);
    
    //*********************LTE related classes**********
    jmsAttributeValueChangeAddHandlerInfo("lte.S1uPeer",jms_simple_propChange_with_mapping,reverse_lte_S1uPeer_Name);
    jmsAttributeValueChangeAddHandlerInfo("lte.S5Peer",jms_simple_propChange_with_mapping,reverse_lte_S5Peer_Name);
    jmsAttributeValueChangeAddHandlerInfo("lte.S8Peer",jms_simple_propChange_with_mapping,reverse_lte_S8Peer_Name);
    jmsAttributeValueChangeAddHandlerInfo("lte.S11Peer",jms_simple_propChange_with_mapping,reverse_lte_S11Peer_Name);
    jmsAttributeValueChangeAddHandlerInfo("ltemme.MmeServiceMemberMaf",jms_simple_propChange_with_mapping,reverse_ltemme_MmeServiceMemberMaf_Name);
    
    
    // SDP bindings
    jmsAttributeValueChangeAddHandlerInfo("svt.MeshSdpBinding", jms_simple_propChange_with_mapping, reverse_svt_sdp_binding_Name, sdpMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("svt.MirrorSdpBinding", jms_simple_propChange_with_mapping, reverse_svt_sdp_binding_Name, sdpMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("svt.SpokeSdpBinding", jms_simple_propChange_with_mapping, reverse_svt_sdp_binding_Name, sdpMapFunctions);

    jmsAttributeValueChangeAddHandlerInfo("lag.Interface", jms_simple_propChange_with_mapping, reverse_lag_interface_Name, physicalMapFunctions);

    jmsAttributeValueChangeAddHandlerInfo("ppp.Interface", pppInterfaceJmsUpdate, reverse_ppp_interface_Name, physicalMapFunctions);

    jmsAttributeValueChangeAddHandlerInfo("ppp.PppControlProtocol", jms_simple_propChange_with_mapping, reverse_ppp_control_protocol_Name, physicalMapFunctions);

    // OAM pings
    jmsAttributeValueChangeAddHandlerInfo("icmp.IcmpPing", jms_simple_propChange_with_mapping, reverse_icmp_ping_Name, oamMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("mpls.LspPing", jms_simple_propChange_with_mapping, reverse_mpls_ping_Name, oamMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("svt.TunnelPing", jms_simple_propChange_with_mapping, reverse_svt_tunnel_ping_Name, oamMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("svt.VccvPing", jms_simple_propChange_with_mapping, reverse_svt_vccv_ping_Name, oamMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("service.SitePing", jms_simple_propChange_with_mapping, reverse_service_site_ping_Name, oamMapFunctions);

    jmsAttributeValueChangeAddHandlerInfo("rtr.VirtualRouter", jms_simple_propChange_with_mapping, reverse_rtr_virtual_router_Name, vRtrMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("equipment.CardSlot", jms_simple_propChange_with_mapping, reverse_equipment_card_slot_Name, cardSlotMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ethernetoam.CfmLoopback", jms_simple_propChange_with_mapping, reverse_cfm_loopback_Name, oamMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ethernetoam.CfmEthTest", jms_simple_propChange_with_mapping, reverse_cfm_ethernet_Name, cfmTestMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ethernetoam.CfmOneWayDelayTest", jms_simple_propChange_with_mapping, reverse_cfm_oneway_delay_Name, cfmTestMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("ethernetoam.CfmTwoWayDelayTest", jms_simple_propChange_with_mapping, reverse_cfm_twoway_delay_Name, cfmTestMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("aosqos.Policy", jms_simple_propChange_with_mapping, reverse_aosqos_policy_Name, aosqosMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("mpls.Site", jms_simple_propChange_with_mapping, reverse_mpls_site_Name, mplsSiteMapFunctions);
    jmsAttributeValueChangeAddHandlerInfo("svq.AggregationScheduler", jms_simple_propChange_with_mapping, reverse_svq_aggregation_schedular_name, svq_aggregation_schedular_map_functions);
    jmsAttributeValueChangeAddHandlerInfo("vprn.ServiceAccessPoint", jms_simple_propChange_with_mapping, reverse_service_access_point_Name, service_access_point_map_functions);
    jmsAttributeValueChangeAddHandlerInfo("ethernetoam.CfmSingleEndedLossTest", jms_simple_propChange_with_mapping, reverse_cfm_single_ended_loss_Name, cfmTestMapFunctions);
}


function initJmsDeleteHandlers() 
{
    for (var className in jmsD_filter_table) 
    {
    	logP3Msg("initJmsDeleteHandlers", "SAMUBA", "Setting delete handler for " + className);

    	switch (className) 
    	{
	        case "aingr.Queue":
	        case "aengr.Queue":
	        case "sasqos.Meter":
	        case "sasqos.PortAccessEgressQueue":
	        case "nqueue.Entry":
	        	jmsDeleteAddHandlerInfo(className, delete_SEs_by_queue_fullname);
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
        		jmsDeleteAddHandlerInfo(className, accessInterfaceJmsDelete);
			break;
        	case "aingr.Policy":
        	case "aengr.Policy":
        	case "sasqos.AccessIngress":
        	case "sasqos.AccessEgress":
        	case "nqueue.Policy":
			// Need something here?
			break;
        	case "lag.Interface":
        		jmsDeleteAddHandlerInfo(className, jms_delete_lag_interface);
            break;
        	case "equipment.PhysicalPort":
        		//jmsDeleteAddHandlerInfo(className, physicalPortJmsUpdate);//Is this not triggered???
        		jmsDeleteAddHandlerInfo(className, physicalPortJmsDelete);
        	break;
        	
        	//added to support sam 2.13.0.0 and 2.14.0.0 sam pack
            case "mpr.IMALink":
            	jmsDeleteAddHandlerInfo(className,jms_delete_equipment_ima_Link);
            	//jms_delete_equipment_ima_Link(delName.toString(), modelInterface);
            	break;
            	
            case "equipment.BaseCard":
            	jmsDeleteAddHandlerInfo(className,jms_delete_equipment_basecard);
            	//jms_delete_equipment_basecard(delName.toString(), modelInterface);
            	break;
            	
            case "equipment.DaughterCard":
            	jmsDeleteAddHandlerInfo(className, jms_delete_equipment_daughtercard);
            	//jms_delete_equipment_daughtercard(delName.toString(), modelInterface);
            	break;
            	
            case "equipment.MCMCard":
            	jmsDeleteAddHandlerInfo(className, jms_delete_equipment_mcmcard);
            	//jms_delete_equipment_mcmcard(delName.toString(), modelInterface);
            	break;
            	
            case "equipment.ControlProcessor":
            	jmsDeleteAddHandlerInfo(className, jms_delete_equipment_controlprocessor);
            	//jms_delete_equipment_controlprocessor(delName.toString(), modelInterface);
            	break;	
            	
        	case "nat.IsaMember":
        		jmsDeleteAddHandlerInfo(className, jms_delete_nat_IsaMember);
        		//jms_delete_nat_IsaMember(delName.toString(), modelInterface);
                break;    	
                    	
            case "nat.IsaMda":
            	jmsDeleteAddHandlerInfo(className, jms_delete_nat_IsaMda);
            	//jms_delete_nat_IsaMda(delName.toString(), modelInterface);
                break;	
            	
            case "tdmequipment.DS1E1PortSpecifics":
            	jmsDeleteAddHandlerInfo(className, jms_delete_tdmequipment_DS1E1_PortSpecific);
            	//jms_delete_tdmequipment_DS1E1_PortSpecific(delName.toString(), modelInterface);
               	break;
               	
            case "dhcp.Dhcp6AddressPrefix":
            	jmsDeleteAddHandlerInfo(className, jms_delete_dhcp_dhcp6AddressPrefix);
            	//jms_delete_dhcp_dhcp6AddressPrefix(delName.toString(), modelInterface);
                break;
            case "dhcp.Subnet":
            	jmsDeleteAddHandlerInfo(className, jms_delete_dhcp_subnet);
            	//jms_delete_dhcp_subnet(delName.toString(), modelInterface);
                break;
                
        	//LTE related updates
            case "lte.S1uPeer":
            	jmsDeleteAddHandlerInfo(className, jms_delete_lte_S1uPeer);
            	break;
            case "lte.S5Peer":
            	jmsDeleteAddHandlerInfo(className, jms_delete_lte_S5Peer);
            	break;
            case "lte.S8Peer":
            	jmsDeleteAddHandlerInfo(className, jms_delete_lte_S8Peer);
            	break;
            case "lte.S11Peer":
            	jmsDeleteAddHandlerInfo(className, jms_delete_lte_S11Peer);
            	break;
            case "ltemme.MmeServiceMemberMaf":
            	jmsDeleteAddHandlerInfo(className, jms_delete_ltemme_MmeServiceMemberMaf);
            	break;
        	
        	default:
        		jmsDeleteAddHandlerInfo(className, turn_off_SE);//

		} // switch
    }
}

/*
initUbaClassHandlers();
initJmsAttributeValueChangeHandlers();
*/
