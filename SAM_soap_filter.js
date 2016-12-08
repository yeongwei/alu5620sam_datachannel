// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var filter_table = {};

// global SOAP XML format
var no_children  = "<children/>";
var everything   = '<wildcard name="objectFullName" value="%"/>';
var nothing      = '<equal name="objectFullName" value="nothing"/>';
var no_zero      = '<not><equal name="siteId" value="0.0.0.0"/></not>';

// global filter regular expression
var filter_range_regexp         = new RegExp("range.([0-9]+)\.\.([0-9]+).",'gi');
var filter_with_property_regexp = new RegExp("(^[a-zA-Z]+)\\:");

function get_class_entry(dataType, className) {
    var filter_table = "";

    switch (dataType) {
    		case "M":
			filter_table = met_filter_table;
		break;
    		case "A":
			filter_table = jmsA_filter_table;
		break;
    		case "C":
			filter_table = inv_filter_table;
		break;
    		case "D":
			filter_table = jmsD_filter_table;
		break;
    		default:
	}; 

    	if (isDef(filter_table[className])){
        	return(filter_table[className]);
    	}
}


function get_soap_filter(filterEntry)
{

    if (isDef(filter_table[filterEntry]))
    {
        return(filter_table[filterEntry].soap_filter);
    }
}


function setup_inv_soap_filters()
{

    var param_array =
    {
        "include_hw_env":"siteId",
        "include_phys_port":"siteId",
        "include_ima_link":"siteId",
        
        "include_basecard":"siteId",
        "include_daughtercard":"siteId",
        "include_mcmcard":"siteId",
        "include_controlprocessor":"siteId",
        "include_isamda":"siteName",
        "include_isamember":"siteName",
        "include_dhcp6_add_prefix":"nodeId",
        "include_dhcp_subnet":"nodeId",
        
        "include_DS1E1PortSpecifics":"siteId",
        "include_shelf":"siteId",
        "include_lag":"siteId",
        "include_mpls_int":"nodeId",
        "include_mpls_lsp":"siteId", // don't really need this
        "include_mesh_sdp":"fromNodeId",
        "include_mirror_sdp":"fromNodeId",
        "include_spoke_sdp":"fromNodeId",
        "include_ies_accint":"nodeId",
        "include_mirror_accint":"nodeId",
        "include_vll_accint":"nodeId",
        "include_vpls_accint":"nodeId",
        "include_vprn_accint":"nodeId",
        "include_icmp_ping":"fromNodeId",
        "include_atm_ping":"fromNodeId",   // need to check this when this class is added
        "include_sdp_ping":"fromNodeId",   // need to check this when this class is added
        "include_mpls_ping":"fromNodeId",
        "include_mac_ping":"fromNodeId",   // need to check this when this class is added
        "include_vccv_ping":"fromNodeId",
        "include_tunnel_ping":"fromNodeId",
        "include_service_site_ping":"fromNodeId",
        "include_net_queue":"siteId",
        "include_channel_sts1":"siteId",
        "include_channel_sts3":"siteId",
        "include_channel_sts12":"siteId",
        "include_channel_sts48":"siteId",
        "include_channel_sts192":"siteId",
        "include_channel_ds1e1":"siteId",
        "include_channel_ds3e3":"siteId",
        "include_channel_trib":"siteId",
        "include_channel_tu3":"siteId",
        "include_channel_trib_group":"siteId",
        "include_channel_tug3_group":"siteId",
        "include_channel_ds0_group":"siteId",
        //  "include_ppp_protocol":"siteId",   // no IP address field
        "include_ppp_interface":"nodeId",
        "include_virtual_router":"siteId",
        "include_ipipe_l2accessinterface":"nodeId",
        "include_equipment_card_slot":"siteId",
        "include_cfm_loopback":"siteId",
        "include_cfm_oneway_delay":"siteId",
        "include_cfm_twoway_delay":"siteId",
        "include_cfm_ethernet":"siteId",
        "include_aosqos_policy":"siteId",
        "include_mpls_site":"siteId",
        "include_svq_aggregation_scheduler":"siteId",
		"include_vprn_service_access_point":"nodeId",
		"include_ies_service_access_point":"nodeId",
		"include_cfm_single_ended_loss":"siteId",
		"include_service_epipe":"objectFullName", // this won't actually be used for filter field
		"include_service_vpls":"objectFullName", // this won't actually be used for filter field
        "exclude_hw_env":"siteId",
        "exclude_phys_port":"siteId",
        "exclude_ima_link":"siteId",
        
        "exclude_basecard":"siteId",
        "exclude_daughtercard":"siteId",
        "exclude_mcmcard":"siteId",
        "exclude_controlprocessor":"siteId",
        "exclude_isamda":"siteName",
        "exclude_isamember":"siteName",
        "exclude_dhcp6_add_prefix":"nodeId",
        "exclude_dhcp_subnet":"nodeId",
        
        "exclude_DS1E1PortSpecifics":"siteId",
        "exclude_shelf":"siteId",
        "exclude_lag":"siteId",
        "exclude_mpls_int":"nodeId",
        "exclude_mpls_lsp":"siteId", // don't really need this
        "exclude_mesh_sdp":"fromNodeId",
        "exclude_mirror_sdp":"fromNodeId",
        "exclude_spoke_sdp":"fromNodeId",
        "exclude_ies_accint":"nodeId",
        "exclude_mirror_accint":"nodeId",
        "exclude_vll_accint":"nodeId",
        "exclude_vpls_accint":"nodeId",
        "exclude_vprn_accint":"nodeId",
        "exclude_icmp_ping":"fromNodeId",
        "exclude_atm_ping":"siteId",   // need to check this when this class is added
        "exclude_sdp_ping":"siteId",   // need to check this when this class is added
        "exclude_mpls_ping":"fromNodeId",
        "exclude_mac_ping":"siteId",   // need to check this when this class is added
        "exclude_vccv_ping":"fromNodeId",
        "exclude_tunnel_ping":"fromNodeId",
        "exclude_service_site_ping":"fromNodeId",
        "exclude_net_queue":"siteId",
        "exclude_channel_sts1":"siteId",
        "exclude_channel_sts3":"siteId",
        "exclude_channel_sts12":"siteId",
        "exclude_channel_sts48":"siteId",
        "exclude_channel_sts192":"siteId",
        "exclude_channel_ds1e1":"siteId",
        "exclude_channel_ds3e3":"siteId",
        "exclude_channel_trib":"siteId",
        "exclude_channel_tu3":"siteId",
        "exclude_channel_trib_group":"siteId",
        "exclude_channel_tug3_group":"siteId",
        "exclude_channel_ds0_group":"siteId",
        // "exclude_ppp_protocol":"siteId", // no IP address field
        "exclude_ppp_interface":"nodeId",
        "exclude_virtual_router":"siteId",
        "exclude_ipipe_l2accessinterface":"nodeId",
        "exclude_equipment_card_slot":"siteId",
        "exclude_cfm_loopback":"siteId",
        "exclude_cfm_oneway_delay":"siteId",
        "exclude_cfm_twoway_delay":"siteId",
        "exclude_cfm_ethernet":"siteId",
        "exclude_aosqos_policy":"siteId",
        "exclude_mpls_site":"siteId",
        "exclude_svq_aggregation_scheduler":"siteId",
		"exclude_vprn_service_access_point":"nodeId",
		"exclude_ies_service_access_point":"nodeId",
		"exclude_cfm_single_ended_loss":"siteId",
		"exclude_service_epipe":"objectFullName", // this won't actually be used for filter field
		"exclude_service_vpls":"objectFullName" // this won't actually be used for filter field
    };

    setup_soap_filters(param_array);
    setup_combined_inv_filters();
	setup_inv_result_filters();
}


function setup_metric_soap_filters()
{
    var param_array =
    {
        "include_hw_env":"siteId",
        "include_intf":"monitoredObjectSiteId",
        "include_intf_add":"monitoredObjectSiteId",
        "include_media_indep":"monitoredObjectSiteId",
        "include_cpu":"monitoredObjectSiteId",
        "include_cpumonstats":"monitoredObjectSiteId",
        "include_mem":"monitoredObjectSiteId",
        "include_mpls_lsp_dyn":"monitoredObjectSiteId",
        "include_mpls_int":"monitoredObjectSiteId",
        "include_mpls_lsp":"monitoredObjectSiteId",
        "include_serv_eg":"monitoredObjectSiteId",
        "include_serv_ing":"monitoredObjectSiteId",
        "include_serv2_eg":"monitoredObjectSiteId",
        "include_serv2_ing":"monitoredObjectSiteId",
        "include_sdp_bind":"monitoredObjectSiteId",
        "include_atm_ping":"fromNodeId",
        "include_icmp_ping":"fromNodeId",
        "include_mac_ping":"fromNodeId",
        "include_mpls_ping":"fromNodeId",
        "include_sdp_ping":"fromNodeId",
        "include_vccv_ping":"fromNodeId",
        "include_tunnel_ping":"fromNodeId",
        "include_service_site_ping":"fromNodeId",
        "include_nqueue_ing":"monitoredObjectSiteId",
        "include_nqueue_eg":"monitoredObjectSiteId",
        "include_nqueue2_ing":"monitoredObjectSiteId",
        "include_nqueue2_eg":"monitoredObjectSiteId",
        "include_ppp_interface":"monitoredObjectSiteId",
        "include_ppp_protocol":"siteId",
        "include_route_stats":"monitoredObjectSiteId",
        "include_equipment_card_slot":"monitoredObjectSiteId",
        "include_cfm_loopback":"fromNodeId",
        "include_cfm_oneway_delay":"fromNodeId",
        "include_cfm_twoway_delay":"fromNodeId",
        "include_cfm_ethernet":"fromNodeId",
        "include_aosqos_policy":"monitoredObjectSiteId",
        "include_equipment_digital_diagnostic_monitoring":"siteId",
        "include_mpls_site":"monitoredObjectSiteId",
	    "include_mss_ingress":"monitoredObjectSiteId",
    	"include_mss_egress":"monitoredObjectSiteId",
		"include_svc_pppoe":"monitoredObjectSiteId",
	    "include_ethernet_equipment_dot3_stats":"monitoredObjectSiteId",
		"include_cfm_single_ended_loss":"fromNodeId",
		
		
		"include_AggrMaintRxStats":"siteId",
		"include_AggrMaintTxStats":"siteId",
		"include_IMALinkCurrentStats":"siteId",
		
		"include_hw_temp":"siteId",
		"include_isa_mem_usg_stats":"siteId",
		"include_local_dhcp6_serverprefixstats":"nodeId",
		"include_local_dhcp_serversubnetstats":"nodeId",
		
		"include_PdhFrameHopHistoryDataStats15MinLog":"siteId",
		"include_PdhFrameLinkHistoryDataStats15MinLog":"siteId",
		"include_RadioAnalogueMeasure":"siteId",
		"include_DS1HistoryStats15minInLog":"siteId",
		"include_DS1HistoryStats15minOutLog":"siteId",
		"include_E1HistoryStats15minInLog":"siteId",
		"include_E1HistoryStats15minOutLog":"siteId",
		
		"exclude_AggrMaintRxStats":"siteId",
		"exclude_AggrMaintTxStats":"siteId",
		"exclude_IMALinkCurrentStats":"siteId",
		
		"exclude_hw_temp":"siteId",
		"exclude_isa_mem_usg_stats":"siteId",
		"exclude_local_dhcp6_serverprefixstats":"nodeId",
		"exclude_local_dhcp_serversubnetstats":"nodeId",
		
		"exclude_PdhFrameHopHistoryDataStats15MinLog":"siteId",
		"exclude_PdhFrameLinkHistoryDataStats15MinLog":"siteId",
		"exclude_RadioAnalogueMeasure":"siteId",
		"exclude_DS1HistoryStats15minInLog":"siteId",
		"exclude_DS1HistoryStats15minOutLog":"siteId",
		"exclude_E1HistoryStats15minInLog":"siteId",
		"exclude_E1HistoryStats15minOutLog":"siteId",
		
		
        "exclude_hw_env":"siteId",
        "exclude_intf":"monitoredObjectSiteId",
        "exclude_intf_add":"monitoredObjectSiteId",
        "exclude_media_indep":"monitoredObjectSiteId",
        "exclude_cpu":"monitoredObjectSiteId",
        "exclude_cpumonstats":"monitoredObjectSiteId",
        "exclude_mem":"monitoredObjectSiteId",
        "exclude_mpls_lsp_dyn":"monitoredObjectSiteId",
        "exclude_mpls_int":"monitoredObjectSiteId",
        "exclude_mpls_lsp":"monitoredObjectSiteId",
        "exclude_serv_eg":"monitoredObjectSiteId",
        "exclude_serv_ing":"monitoredObjectSiteId",
        "exclude_serv2_eg":"monitoredObjectSiteId",
        "exclude_serv2_ing":"monitoredObjectSiteId",
        "exclude_sdp_bind":"monitoredObjectSiteId",
        "exclude_atm_ping":"fromNodeId",
        "exclude_icmp_ping":"fromNodeId",
        "exclude_mac_ping":"fromNodeId",
        "exclude_mpls_ping":"fromNodeId",
        "exclude_sdp_ping":"fromNodeId",
        "exclude_vccv_ping":"fromNodeId",
        "exclude_tunnel_ping":"fromNodeId",
        "exclude_service_site_ping":"fromNodeId",
        "exclude_nqueue_ing":"monitoredObjectSiteId",
        "exclude_nqueue_eg":"monitoredObjectSiteId",
        "exclude_nqueue2_ing":"monitoredObjectSiteId",
        "exclude_nqueue2_eg":"monitoredObjectSiteId",
        "exclude_ppp_interface":"monitoredObjectSiteId",
        "exclude_ppp_protocol":"siteId",
        "exclude_route_stats":"monitoredObjectSiteId",
        "exclude_equipment_card_slot":"monitoredObjectSiteId",
        "exclude_cfm_loopback":"fromNodeId",
        "exclude_cfm_oneway_delay":"fromNodeId",
        "exclude_cfm_twoway_delay":"fromNodeId",
        "exclude_cfm_ethernet":"fromNodeId",
        "exclude_aosqos_policy":"monitoredObjectSiteId",
        "exclude_equipment_digital_diagnostic_monitoring":"siteId",
        "exclude_mpls_site":"monitoredObjectSiteId",
        "exclude_mss_ingress":"monitoredObjectSiteId",
    	"exclude_mss_egress":"monitoredObjectSiteId",
	    "exclude_svc_pppoe":"monitoredObjectSiteId",
    	"exclude_mss_egress":"monitoredObjectSiteId",
        "exclude_ethernet_equipment_dot3_stats":"monitoredObjectSiteId",
		"exclude_cfm_single_ended_loss":"fromNodeId"
    };

    setup_soap_filters(param_array);
    setup_combined_metric_filters();
    setup_metric_result_filters();

}

function setup_soap_filters(param_array)
{
    var flist,dcitem;
    var item,idx,tmp,filter_prop,value;

    logP3Msg("setup_soap_filter", "SAM", "entering");

    dcitem = "fromNodeId:10.1.241.74;administrativeState:enabled up 2";

    for (var i in param_array)
    {
        dcitem = app_config_value(i);
    
        if (isDef(dcitem))
        {
            // From the value of the dcitem, decide the filter functionality.
            // In 4.3Y, new filter functionality was implemented. The previous
            // filter functionality (pre 4.3Y) remains supported.

            if (is_new_filter(dcitem))
            {
                // New filter functionality
                // property:value1 value2; property: value3 value4
                // value* or value?more (unix * and ? usage)
                // i.e. siteId:10.1.10.* 10.2.10.45; nodeId:100.1.1?.10

                logP4Msg("setup_soap_filters", "SAM", "dcitem: "+dcitem);

                // Split filtering from dc configuration
                flist = filter_list_from_dc_param(dcitem, "new filter");
                logP4Msg("setup_soap_filters", "SAM", "flist: "+flist);

                // Create the filter table
                if (isUndef(filter_table[i]))
                {
                    filter_table[i] = {};
                }

                filter_table[i].dcitem = dcitem;
                filter_table[i].list   = flist;

                if (flist.length > 1)
                {
                    if (i.match(/include/))
                    {
                        // Logical AND between include filters
                        // adminstate: 4 up AND siteId:10.1.10.* 10.2.10.45
                        filter_table[i].soap_filter="<and>";
                    }
                    else
                    {
                        // Logical OR between exclude filters
                        // adminstate: 4 up OR siteId:10.1.10.* 10.2.10.45
                        filter_table[i].soap_filter="<or>";
                    }
                }

                for (var num=0; num<flist.length; num++)
                {
                    item = remove_leading_trailing_white_space(flist[num]);
            
                    logP4Msg("setup_soap_filters", "SAM", "flist item: "+item);

                    if (filter_with_property_regexp.test(item))
                    {
                        idx         = item.indexOf(":");
                        tmp         = item.substring(0,idx);
                        filter_prop = remove_leading_trailing_white_space(tmp);
                        tmp         = item.substring(idx+1);
                    }
                    else
                    {
                        // Handle the case where just an IP addr or addr range
                        // is used, like the old style (pre 4.3Y), without a
                        // property prefix. We lookup the correct property using
                        // the param_array setting
                        filter_prop = param_array[i];
                        tmp         = item;
                    }

                    value=remove_leading_trailing_white_space(tmp);

                    // Used later in record_filter_match function
                    if (isUndef(filter_table[i].filterprop))
                    {
                        filter_table[i].filterprop=filter_prop;
                    } 
                    else
                    {
                        filter_table[i].filterprop+=" "+filter_prop;
                    }
            
                    logP4Msg("setup_soap_filters", "SAM", "filter_table[i].filterprop: "+filter_table[i].filterprop);
                    logP4Msg("setup_soap_filters", "SAM", "filter prop: "+filter_prop);
                    logP4Msg("setup_soap_filters", "SAM", "filter value: "+value);

                    if (isUndef(filter_table[i].soap_filter))
                    {
                        filter_table[i].soap_filter=soap_filter_from_list(filter_list_from_dc_param(value), filter_prop, "new filter");
                    }
                    else
                    {
                        filter_table[i].soap_filter+=soap_filter_from_list(filter_list_from_dc_param(value), filter_prop, "new filter");
                    }
                    logP4Msg("setup_soap_filters", "SAM", "soap filter: "+filter_table[i].soap_filter);
                }

                // close the filter xml
                if (flist.length > 1)
                {
                    if (i.match(/include/))
                    {
                        filter_table[i].soap_filter+="</and>";
                    }
                    else
                    {
                        filter_table[i].soap_filter+="</or>";
                    }
                }

                logP4Msg("setup_soap_filters", "SAM", i + " soap filter: "+filter_table[i].soap_filter);
            }
            else 
            {       
                // Old filter functionality (pre 4.3Y)
                // ipaddr* or ipaddr? (unix * and ? usage)
                // i.e. 10.1.10.* or 10.?.10.10
                flist=filter_list_from_dc_param(dcitem);
        
                if (isUndef(filter_table[i]))
                {
                    filter_table[i]={};
                }
                filter_table[i].dcitem=dcitem;
                filter_table[i].list=flist;
                filter_table[i].filterprop=param_array[i];
                filter_table[i].soap_filter=soap_filter_from_list(flist, param_array[i]);
        
                logP3Msg("setup_soap_filters", "SAM", i + " soap filter: "+filter_table[i].soap_filter);
            }
        }
    }
}


function remove_leading_trailing_white_space(str) {
    return str.replace(/^\s+|\s+$/g,'');
}


function setup_combined_inv_filters() {


    //  setup_combined_filter_entry("atm.AtmPing", "include_atm_ping", "exclude_atm_ping");
    setup_combined_filter_entry("icmp.IcmpPing", "include_icmp_ping", "exclude_icmp_ping");
    //  setup_combined_filter_entry("service.MacPing", "include_mac_ping", "exclude_mac_ping");
    setup_combined_filter_entry("mpls.LspPing", "include_mpls_ping", "exclude_mpls_ping");
    setup_combined_filter_entry("svt.VccvPing", "include_vccv_ping", "exclude_vccv_ping");
    setup_combined_filter_entry("svt.TunnelPing", "include_tunnel_ping", "exclude_tunnel_ping");
    setup_combined_filter_entry("service.SitePing", "include_service_site_ping", "exclude_service_site_ping");
    setup_combined_filter_entry("mirror.L2AccessInterface", "include_mirror_accint", "exclude_mirror_accint");
    setup_combined_filter_entry("svt.MeshSdpBinding", "include_mesh_sdp", "exclude_mesh_sdp");
    setup_combined_filter_entry("svt.MirrorSdpBinding", "include_mirror_sdp", "exclude_mirror_sdp");
    setup_combined_filter_entry("svt.SpokeSdpBinding", "include_spoke_sdp", "exclude_spoke_sdp");
    setup_combined_filter_entry("equipment.PhysicalPort", "include_phys_port", "exclude_phys_port");
    setup_combined_filter_entry("mpr.IMALink", "include_ima_link", "exclude_ima_link");

    setup_combined_filter_entry("equipment.BaseCard", "include_basecard", "exclude_basecard");
    setup_combined_filter_entry("equipment.DaughterCard", "include_daughtercard", "exclude_daughtercard");
    setup_combined_filter_entry("equipment.MCMCard", "include_mcmcard", "exclude_mcmcard");
    setup_combined_filter_entry("equipment.ControlProcessor", "include_controlprocessor", "exclude_controlprocessor");
    setup_combined_filter_entry("nat.IsaMda", "include_isamda", "exclude_isamda");
    setup_combined_filter_entry("nat.IsaMember", "include_isamember", "exclude_isamember");
    setup_combined_filter_entry("dhcp.Dhcp6AddressPrefix", "include_dhcp6_add_prefix", "exclude_dhcp6_add_prefix");
    setup_combined_filter_entry("dhcp.Subnet", "include_dhcp_subnet", "exclude_dhcp_subnet");
    
    //L2F 2.5.0.0 related inventory combined filters
    setup_combined_filter_entry("nat.NatPool", "include_nat_natpool", "exclude_nat_natpool");
    setup_combined_filter_entry("l2tp.Site", "include_l2tp_site", "exclude_l2tp_site");
    setup_combined_filter_entry("equipment.FlashMemory", "include_flash_memory", "exclude_flash_memory");
	setup_combined_filter_entry("equipment.DigitalDiagnosticMonitoring", "include_digital_diagnostic_monitoring", "exclude_digital_diagnostic_monitoring");
    
    //LTE related combined filters
    setup_combined_filter_entry("lte.S1uPeer","include_s1upeer", "exclude_s1upeer");
    setup_combined_filter_entry("lte.S5Peer","include_s5peer", "exclude_s5peer");
    setup_combined_filter_entry("lte.S8Peer","include_s8peer", "exclude_s8peer");
    setup_combined_filter_entry("lte.S11Peer","include_s11peer", "exclude_s11peer");
    setup_combined_filter_entry("ltemme.MmeServiceMemberMaf","include_MmeServiceMemberMaf", "exclude_mmeservicemembermaf");
    
    setup_combined_filter_entry("tdmequipment.DS1E1PortSpecifics", "include_DS1E1PortSpecifics", "exclude_DS1E1PortSpecifics");
    setup_combined_filter_entry("equipment.Shelf", "include_shelf", "exclude_shelf");
    setup_combined_filter_entry("equipment.HwEnvironment", "include_hw_env", "exclude_hw_env");
    setup_combined_filter_entry("lag.Interface", "include_lag", "exclude_lag");
    setup_combined_filter_entry("mpls.Interface", "include_mpls_int", "exclude_mpls_int");
    setup_combined_filter_entry("mpls.DynamicLsp", "include_mpls_lsp", "exclude_mpls_lsp");
    setup_combined_filter_entry("vprn.L3AccessInterface", "include_vprn_accint", "exclude_vprn_accint");
    setup_combined_filter_entry("ies.L3AccessInterface", "include_ies_accint", "exclude_ies_accint");
    setup_combined_filter_entry("vpls.L2AccessInterface", "include_vpls_accint", "exclude_vpls_accint");
    setup_combined_filter_entry("vll.L2AccessInterface", "include_vll_accint", "exclude_vll_accint");
    setup_combined_filter_entry("nqueue.Entry", "include_net_queue", "exclude_net_queue");
    setup_combined_filter_entry("sonetequipment.Sts1Channel", "include_channel_sts1", "exclude_channel_sts1");
    setup_combined_filter_entry("sonetequipment.Sts3Channel", "include_channel_sts3", "exclude_channel_sts3");
    setup_combined_filter_entry("sonetequipment.Sts12Channel", "include_channel_sts12", "exclude_channel_sts12");
    setup_combined_filter_entry("sonetequipment.Sts48Channel", "include_channel_sts48", "exclude_channel_sts48");
    setup_combined_filter_entry("sonetequipment.Sts192Channel", "include_channel_sts192", "exclude_channel_sts192");
    setup_combined_filter_entry("tdmequipment.DS1E1Channel", "include_channel_ds1e1", "exclude_channel_ds1e1");
    setup_combined_filter_entry("tdmequipment.DS3E3Channel", "include_channel_ds3e3", "exclude_channel_ds3e3");
    setup_combined_filter_entry("sonetequipment.TributaryChannel", "include_channel_trib", "exclude_channel_trib");
    setup_combined_filter_entry("sonetequipment.Tu3Channel", "include_channel_tu3", "exclude_channel_tu3");
    setup_combined_filter_entry("tdmequipment.DS0ChannelGroup", "include_channel_ds0_group", "exclude_channel_ds0_group");
    setup_combined_filter_entry("sonetequipment.TributaryGroup", "include_channel_trib_group", "exclude_channel_trib_group");
    setup_combined_filter_entry("sonetequipment.Tug3Group", "include_channel_tug3_group", "exclude_channel_tug3_group");
    // setup_combined_filter_entry("ppp.PppControlProtocol", "include_ppp_protocol", "exclude_ppp_protocol");
    setup_combined_filter_entry("ppp.Interface", "include_ppp_interface", "exclude_ppp_interface");
    setup_combined_filter_entry("rtr.VirtualRouter", "include_virtual_router", "exclude_virtual_router");
    setup_combined_filter_entry("ipipe.L2AccessInterface", "include_ipipe_l2accessinterface", "exclude_ipipe_l2accessinterface");
    setup_combined_filter_entry( "equipment.CardSlot", "include_equipment_card_slot", "exclude_equipment_card_slot");
    setup_combined_filter_entry("ethernetoam.CfmLoopback", "include_cfm_loopback", "exclude_cfm_loopback");
    setup_combined_filter_entry("ethernetoam.CfmOneWayDelayTest", "include_cfm_oneway_delay", "exclude_cfm_oneway_delay");
    setup_combined_filter_entry("ethernetoam.CfmTwoWayDelayTest", "include_cfm_twoway_delay", "exclude_cfm_twoway_delay");
    setup_combined_filter_entry("ethernetoam.CfmEthTest", "include_cfm_ethernet", "exclude_cfm_ethernet");
    setup_combined_filter_entry("aosqos.Policy", "include_aosqos_policy", "exclude_aosqos_policy");
    setup_combined_filter_entry("mpls.Site", "include_mpls_site", "exclude_mpls_site");
    setup_combined_filter_entry("svq.AggregationScheduler", "include_svq_aggregation_scheduler", "exclude_svq_aggregation_scheduler");
    setup_combined_filter_entry("vprn.ServiceAccessPoint", "include_vprn_service_access_point", "exclude_vprn_service_access_point");
    setup_combined_filter_entry("ies.ServiceAccessPoint", "include_ies_service_access_point", "exclude_ies_service_access_point");
    setup_combined_filter_entry("ethernetoam.CfmSingleEndedLossTest", "include_cfm_single_ended_loss", "exclude_cfm_single_ended_loss");
}


// This is used to create class/filter entries for the inventory classes that do not have filters.
// These are primarily classes that do not have inventory directly associated with them.
// It is used for the 0-record dispatch and not the older SAM pack.
function setup_inv_additional_class_entries() {

    var additional_classes = [
	"aingr.Policy",
	"aengr.Policy",
	"sasqos.AccessIngress",
	"sasqos.PortAccessEgress",
	"nqueue.Policy",
	"aengr.ForwardingClass",
	"aingr.ForwardingClass",
	"sasqos.AccessIngressForwardingClass",
	"sasqos.PortAccessEgressForwardingClass",
	"nqueue.ForwardingClass",
	"aengr.Queue",
	"aingr.Queue",
	"sasqos.Meter",
	"sasqos.PortAccessEgressQueue",
	"nqueue.Entry",
	"ppp.PppControlProtocol",
	//Added on 21 december 2012//Missing somthing here???
	"onetequipment.TributaryGroup",
	"service.AccessInterface",
	"epipe.Epipe",
	"ethernetoam.Mep",
	"vpls.Vpls"
    ];


    var className;

    for(var i in additional_classes) 
    {
    	className = additional_classes[i];
    	if (isUndef(filter_table[i]))
	    {
    		filter_table[className] = {};
    		filter_table[className].className=i;
    		logP3Msg("setup_inv_additional_class_entries", "SAM", "Created entry for " + className);
	    }
    	else 
    	{
    		logP3Msg("setup_inv_additional_class_entries", "SAM", "Entry already exists for " + className);
    	}
    }

}


function setup_combined_metric_filters() {

	//L2F 2.5.0.0 Related Metric combined filter entry
	setup_combined_filter_entry( "nat.NatPoolLsnStatsLogRecord", "include_nat_nat_pool_lsn", "exclude_nat_nat_pool_lsn");
	setup_combined_filter_entry( "nat.NatPoolL2AwStatsLogRecord", "include_nat_nat_pool_l2Aw", "exclude_nat_nat_pool_l2Aw");
	setup_combined_filter_entry( "l2tp.SiteStatsLogRecord", "include_l2tp_site", "exclude_l2tp_site");
	setup_combined_filter_entry( "ethernetequipment.EthernetStatsLogRecord", "include_ethernet_equipment_ethernet_stats_log_record", "exclude_ethernet_equipment_ethernet_stats_log_record");
	setup_combined_filter_entry( "equipment.FlashMemory", "include_flash_memory", "exclude_flash_memory");
	setup_combined_filter_entry( "equipment.DDMStatsLogRecord", "include_digital_diagnostic_monitoring", "exclude_digital_diagnostic_monitoring");
	setup_combined_filter_entry( "service.CompleteNetworkEgressPacketOctetsLogRecord", "include_service_complete_network_egress_packet_octets_log_record", "exclude_service_complete_network_egress_packet_octets_log_record");
	setup_combined_filter_entry( "service.CompleteNetworkIngressPacketOctetsLogRecord", "include_service_complete_network_ingress_packet_octets_log_record", "exclude_service_complete_network_ingress_packet_octets_log_record");

	
	
    setup_combined_filter_entry( "equipment.HwEnvironment", "include_hw_env", "exclude_hw_env");
    setup_combined_filter_entry( "equipment.InterfaceStatsLogRecord", "include_intf", "exclude_intf");
    setup_combined_filter_entry( "equipment.InterfaceAdditionalStatsLogRecord", "include_intf_add", "exclude_intf_add");
    setup_combined_filter_entry( "equipment.MediaIndependentStatsLogRecord", "include_media_indep", "exclude_media_indep");
    setup_combined_filter_entry( "equipment.SystemCpuStatsLogRecord", "include_cpu", "exclude_cpu");
    setup_combined_filter_entry( "equipment.SystemCpuMonStatsLogRecord", "include_cpumonstats", "exclude_cpumonstats");
    setup_combined_filter_entry( "equipment.SystemMemoryStatsLogRecord", "include_mem", "exclude_mem");
    setup_combined_filter_entry( "equipment.AllocatedMemoryStatsLogRecord", 'include_mem', 'exclude_mem');
    setup_combined_filter_entry( "equipment.AvailableMemoryStatsLogRecord", 'include_mem', 'exclude_mem');
    setup_combined_filter_entry( "mpls.DynamicLspStatsLogRecord", "include_mpls_lsp_dyn", "exclude_mpls_lsp_dyn");
    setup_combined_filter_entry( "mpls.MplsInterfaceStatsLogRecord", "include_mpls_int", "exclude_mpls_int");
    setup_combined_filter_entry( "mpls.LspStatsLogRecord", "include_mpls_lsp", "exclude_mpls_lsp");
    setup_combined_filter_entry( "service.CompleteServiceEgressPacketOctetsLogRecord", "include_serv_eg", "exclude_serv_eg");
    setup_combined_filter_entry( "service.CompleteServiceIngressPacketOctetsLogRecord", "include_serv_ing", "exclude_serv_ing");
    setup_combined_filter_entry( "service.ServiceEgressOctetsLogRecord", "include_serv2_eg", "exclude_serv2_eg");
    setup_combined_filter_entry( "service.ServiceIngressOctetsLogRecord", "include_serv2_ing", "exclude_serv2_ing");
    setup_combined_filter_entry( "service.ServiceEgressPacketsLogRecord", "include_serv2_eg", "exclude_serv2_eg");
    setup_combined_filter_entry( "service.ServiceIngressPacketsLogRecord", "include_serv2_ing", "exclude_serv2_ing");
    setup_combined_filter_entry( "svt.SdpBindingBaseStatsLogRecord", "include_sdp_bind", "exclude_sdp_bind");
    //setup_combined_filter_entry( "atm.AtmPingResults", "include_atm_ping", "exclude_atm_ping");
    setup_combined_filter_entry( "icmp.IcmpPingResult", "include_icmp_ping", "exclude_icmp_ping");
    //setup_combined_filter_entry( "service.MacPingResults","include_mac_ping", "exclude_mac_ping");
    setup_combined_filter_entry( "mpls.LspPingResult", "include_mpls_ping", "exclude_mpls_ping");
    setup_combined_filter_entry( "svt.VccvPingResult", "include_vccv_ping", "exclude_vccv_ping");
    setup_combined_filter_entry( "svt.TunnelPingResult", "include_tunnel_ping", "exclude_tunnel_ping");
    setup_combined_filter_entry( "service.SitePingResult", "include_service_site_ping", "exclude_service_site_ping");
    setup_combined_filter_entry( "service.CombinedNetworkIngressOctetsLogRecord", "include_nqueue_ing", "exclude_nqueue_ing");
    setup_combined_filter_entry( "service.CombinedNetworkEgressOctetsLogRecord", "include_nqueue_eg", "exclude_nqueue_eg");
    setup_combined_filter_entry( "service.NetworkIngressPacketsLogRecord", "include_nqueue2_ing", "exclude_nqueue2_ing");
    setup_combined_filter_entry( "service.NetworkEgressPacketsLogRecord", "include_nqueue2_eg", "exclude_nqueue2_eg");
    setup_combined_filter_entry( "ppp.PppStatsLogRecord", "include_ppp_interface", "exclude_ppp_interface");
    setup_combined_filter_entry( "ppp.PppControlProtocol", "include_ppp_protocol", "exclude_ppp_protocol");
    setup_combined_filter_entry( "rtr.RouteStatsLogRecord", "include_route_stats", "exclude_route_stats");
    setup_combined_filter_entry( "equipment.CardHealthStatsLogRecord", "include_equipment_card_slot", "exclude_equipment_card_slot");
    setup_combined_filter_entry("ethernetoam.CfmLoopbackResult", "include_cfm_loopback", "exclude_cfm_loopback");
    setup_combined_filter_entry("ethernetoam.CfmOneWayDelayTestResult", "include_cfm_oneway_delay", "exclude_cfm_oneway_delay");
    setup_combined_filter_entry("ethernetoam.CfmTwoWayDelayTestResult", "include_cfm_twoway_delay", "exclude_cfm_twoway_delay");
    setup_combined_filter_entry("ethernetoam.CfmEthTestResult", "include_cfm_ethernet", "exclude_cfm_ethernet");
    setup_combined_filter_entry("aosqos.QoSIngressPolicyStatsLogRecord", "include_aosqos_policy", "exclude_aosqos_policy");
    setup_combined_filter_entry("equipment.DigitalDiagnosticMonitoring", "include_equipment_digital_diagnostic_monitoring", "exclude_equipment_digital_diagnostic_monitoring");
	setup_combined_filter_entry("mpls.SiteStatsLogRecord", "include_mpls_site", "exclude_mpls_site");
    setup_combined_filter_entry("svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord", "include_mss_egress", "exclude_mss_egress");
    setup_combined_filter_entry("svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord", "include_mss_ingress", "exclude_mss_ingress");
    setup_combined_filter_entry("service.PppoeSapStatsLogRecord", "include_svc_pppoe", "exclude_svc_pppoe");
    setup_combined_filter_entry("ethernetequipment.Dot3StatsLogRecord", "include_ethernet_equipment_dot3_stats", "exclude_ethernet_equipment_dot3_stats");
	setup_combined_filter_entry("ethernetoam.CfmSingleEndedLossTestResult", "include_cfm_single_ended_loss", "exclude_cfm_single_ended_loss");
	
	setup_combined_filter_entry("ethernetequipment.AggrMaintRxStatsLogRecord", "include_AggrMaintRxStats", "exclude_AggrMaintRxStats");
	setup_combined_filter_entry("ethernetequipment.AggrMaintTxStatsLogRecord", "include_AggrMaintTxStats", "exclude_AggrMaintTxStats");
	setup_combined_filter_entry("mpr.IMALinkCurrentStatsLogRecord", "include_IMALinkCurrentStats", "exclude_IMALinkCurrentStats");

	setup_combined_filter_entry("equipment.HardwareTemperatureLogRecord", "include_hw_temp", "exclude_hw_temp");
	setup_combined_filter_entry("nat.IsaMemberUsageStatsLogRecord", "include_isa_mem_usg_stats", "exclude_isa_mem_usg_stats");
	setup_combined_filter_entry("dhcp.LocalDhcp6ServerPrefixStatsLogRecord", "include_local_dhcp6_serverprefixstats", "exclude_local_dhcp6_serverprefixstats");
	setup_combined_filter_entry("dhcp.LocalDhcpServerSubnetStatsLogRecord", "include_local_dhcp_serversubnetstats", "exclude_local_dhcp_serversubnetstats");
	
	setup_combined_filter_entry("radioequipment.PdhFrameHopHistoryDataStats15MinLogRecord", "include_PdhFrameHopHistoryDataStats15MinLog", "exclude_PdhFrameHopHistoryDataStats15MinLog");
	setup_combined_filter_entry("radioequipment.PdhFrameLinkHistoryDataStats15MinLogRecord", "include_PdhFrameLinkHistoryDataStats15MinLog", "exclude_PdhFrameLinkHistoryDataStats15MinLog");
	setup_combined_filter_entry("radioequipment.RadioAnalogueMeasureLogRecord", "include_RadioAnalogueMeasure", "exclude_RadioAnalogueMeasure");
	setup_combined_filter_entry("tdmequipment.DS1HistoryStats15minInLogRecord", "include_DS1HistoryStats15minInLog", "exclude_DS1HistoryStats15minInLog");
	setup_combined_filter_entry("tdmequipment.DS1HistoryStats15minOutLogRecord", "include_DS1HistoryStats15minOutLog", "exclude_DS1HistoryStats15minOutLog");
	setup_combined_filter_entry("tdmequipment.E1HistoryStats15minInLogRecord", "include_E1HistoryStats15minInLog", "exclude_E1HistoryStats15minInLog");
	setup_combined_filter_entry("tdmequipment.E1HistoryStats15minOutLogRecord", "include_E1HistoryStats15minOutLog", "exclude_E1HistoryStats15minOutLog");
	
}


function setup_metric_result_filters() {

	// Polled metric resultfilters
	setup_resultfilter_entry( "ethernetequipment.AggrMaintRxStatsLogRecord", null, AggrMaintRxStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "ethernetequipment.AggrMaintTxStatsLogRecord", null, AggrMaintTxStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "mpr.IMALinkCurrentStatsLogRecord", null, IMALinkCurrentStatsMetrics, standardAdditionalPolledMetricFields, false);
	
	setup_resultfilter_entry( "equipment.HardwareTemperatureLogRecord", null, equipmentHwTempMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "nat.IsaMemberUsageStatsLogRecord", null, natIsaMemberUsageStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "dhcp.LocalDhcp6ServerPrefixStatsLogRecord", null, localDhcp6ServerPrefixStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "dhcp.LocalDhcpServerSubnetStatsLogRecord", null, localDhcpServerSubnetStatsMetrics, standardAdditionalPolledMetricFields, false);
	
	setup_resultfilter_entry( "radioequipment.PdhFrameHopHistoryDataStats15MinLogRecord", null, PdhFrameHopHistoryDataStats15MinMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "radioequipment.PdhFrameLinkHistoryDataStats15MinLogRecord", null, PdhFrameLinkHistoryDataStats15MinMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "radioequipment.RadioAnalogueMeasureLogRecord", null, RadioAnalogueMeasureMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "tdmequipment.DS1HistoryStats15minInLogRecord", null, DS1HistoryStats15minInLogRecordMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "tdmequipment.DS1HistoryStats15minOutLogRecord", null, DS1HistoryStats15minOutLogRecordMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "tdmequipment.E1HistoryStats15minInLogRecord", null, E1HistoryStats15minInLogRecordMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "tdmequipment.E1HistoryStats15minOutLogRecord", null, E1HistoryStats15minOutLogRecordMetrics, standardAdditionalPolledMetricFields, false);
	
	//LTE metric result filters
	setup_resultfilter_entry("lte.S1uAgwPeerStatsLogRecord", null, S1uAgwPeerStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("lte.S5AgwPeerStatsLogRecord", null, S5AgwPeerStatsMinMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("ltegw.S5AgwFailureCodeStatsLogRecord", null, S5AgwFailureCodeStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("lte.S8AgwPeerStatsLogRecord", null, S8AgwPeerStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("ltegw.S8AgwFailureCodeStatsLogRecord", null, S8AgwFailureCodeStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("lte.S11AgwPeerStatsLogRecord", null, S11AgwPeerStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("ltegw.S11FailureCodeStatsLogRecord", null, S11FailureCodeStatsMetrics, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry("ltemme.MAFConnectionLogRecord", null, MAFConnectionMetrics, standardAdditionalPolledMetricFields, false);
	
    setup_resultfilter_entry( "equipment.InterfaceStatsLogRecord", null, equipmentInterfaceMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "equipment.InterfaceAdditionalStatsLogRecord", null, equipmentInterfaceAdditionalMetrics, standardAdditionalPolledMetricFields, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "equipment.MediaIndependentStatsLogRecord", null, equipmentMediaIndependentMetrics, standardAdditionalPolledMetricFields, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "equipment.SystemCpuStatsLogRecord", null, equipmentSystemCpuMetrics, cpuAdditionalFields, null);
    setup_resultfilter_entry( "equipment.SystemCpuMonStatsLogRecord", null, equipmentSystemCpuMonStatsMetrics, cpuAdditionalFields, null);
    
    setup_resultfilter_entry( "equipment.SystemMemoryStatsLogRecord", null, equipmentSystemMemoryMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "equipment.AllocatedMemoryStatsLogRecord", null, equipmentAllocatedMemoryMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "equipment.AvailableMemoryStatsLogRecord", null, equipmentAvailableMemoryMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "mpls.MplsInterfaceStatsLogRecord", null, mplsInterfaceMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry("ppp.PppStatsLogRecord", null, pppInterfaceStatMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "svt.SdpBindingBaseStatsLogRecord", null, sdpBindingMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "rtr.RouteStatsLogRecord", null, rtrRouteMetrics, standardAdditionalPolledMetricFields, false);
    
    setup_resultfilter_entry( "equipment.CardHealthStatsLogRecord", null, cardSlotMetricsFilter, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "ethernetoam.CfmLoopbackResult", null, oamPingMetricsForFilter.concat(additional_ping_test_metrics), standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "ethernetoam.CfmOneWayDelayTestResult", null, cfmOneWayDelayMetrics, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "ethernetoam.CfmTwoWayDelayTestResult", null, oamPingMetricsForFilter.concat(additional_ping_test_metrics).concat(cfmTwoWayDelayMetrics), standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "ethernetoam.CfmEthTestResult", null, cfmEthernetMetrics, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "aosqos.QoSIngressPolicyStatsLogRecord", null, aosqosIngressPolicyMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "mpls.SiteStatsLogRecord", null, mplsSiteStatsMetrics, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord", null, svq_cust_multi_svc_site_egr_sched_plcy_port_stats, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord", null, svq_cust_multi_svc_site_ing_sched_plcy_port_stats, standardAdditionalPolledMetricFields, false);
    setup_resultfilter_entry( "ethernetequipment.Dot3StatsLogRecord", null, ethernet_equipment_dot3_stats, standardAdditionalPolledMetricFields, false);
	setup_resultfilter_entry( "ethernetoam.CfmSingleEndedLossTestResult", null, cfm_single_ended_loss_metrics, standardAdditionalOAMTestMetricFields, false);
	
	
	
    // Pseudo-metric resultfilters
    setup_resultfilter_entry("equipment.HwEnvironment", null, equipmentHwEnvironmentPseudoMetrics, standardAdditionalPseudoMetricFields, false);
    setup_resultfilter_entry("ppp.PppControlProtocol", null, pppControlProtocolPseudoMetrics, standardAdditionalPseudoMetricFields, false);
    setup_resultfilter_entry("equipment.DigitalDiagnosticMonitoring", equipment_digital_diagnostic_monitoring_metrics, standardAdditionalPseudoMetricFields);
    
    

    // Accounting metric resultfilters
    setup_resultfilter_entry( "icmp.IcmpPingResult", null, oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "mpls.LspPingResult", null, oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "svt.VccvPingResult", null, oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "svt.TunnelPingResult", null, oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields, false);
    setup_resultfilter_entry( "service.SitePingResult", null, oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields, false);


    setup_resultfilter_entry( "service.CombinedNetworkIngressOctetsLogRecord", null, nqueueIngressOctetMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields), false);
    setup_resultfilter_entry( "service.NetworkIngressPacketsLogRecord", null, nqueueIngressPacketMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields), false);
    setup_resultfilter_entry( "service.CombinedNetworkEgressOctetsLogRecord", null, nqueueEgressOctetMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields), false);
    setup_resultfilter_entry( "service.NetworkEgressPacketsLogRecord", null, nqueueEgressPacketMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields), false);

    setup_resultfilter_entry( "service.CompleteServiceEgressPacketOctetsLogRecord", null, completeServiceEgressPacketOctetsMetrics, standardAdditionalAccountingMetricFields, false);
    setup_resultfilter_entry( "service.CompleteServiceIngressPacketOctetsLogRecord", null, completeServiceIngressPacketOctetsMetrics, standardAdditionalAccountingMetricFields, false);
    setup_resultfilter_entry( "service.ServiceEgressOctetsLogRecord", null, serviceEgressOctetMetrics, standardAdditionalAccountingMetricFields, false);
    setup_resultfilter_entry( "service.ServiceIngressOctetsLogRecord", null, serviceIngressOctetMetrics, standardAdditionalAccountingMetricFields, false);
    setup_resultfilter_entry( "service.ServiceEgressPacketsLogRecord", null, serviceEgressPacketMetrics, standardAdditionalAccountingMetricFields, false);
    setup_resultfilter_entry( "service.ServiceIngressPacketsLogRecord", null, serviceIngressPacketMetrics, standardAdditionalAccountingMetricFields, false);

    setup_resultfilter_entry( "service.PppoeSapStatsLogRecord", null, servicePppoeSapMetrics, standardAdditionalAccountingMetricFields, false);

    /*
    setup_resultfilter_entry( "mpls.DynamicLspStatsLogRecord", "include_mpls_lsp_dyn", "exclude_mpls_lsp_dyn");
    setup_resultfilter_entry( "mpls.LspStatsLogRecord", "include_mpls_lsp", "exclude_mpls_lsp");

    */
}


function setup_inv_result_filters() {

    // Currently this is only used for the classes where we only use a small number of the fields,
    // though it would be good to have it utilized for all the inventory classes

    // Polled metric resultfilters
    setup_resultfilter_entry( "epipe.Epipe", service_epipe_Name, null, null, false);
    setup_resultfilter_entry( "vpls.Vpls", service_vpls_Name, null, null, false);

}

function filter_list_from_dc_param(param, type)
{

    if (type == "new filter")
    {
        // This handles the new filter in 4.3Y
        return param.split(";");
    } 
    else
    {
        return param.split(" ");
    }
}

    

// filters is a list of ip addresses to match, like 10.16.0.4 or 10.16.0.*
// filterparam is the SAM property you are using to compare this to, like siteId or nodeId

function soap_filter_from_list(filters, filterparam, type) {

    var filterStr="",i,n;
    var wildcard=0;
    var range=0;

    logP4Msg("setup_soap_filters", "SAM", "filters: "+filters+" length: "+filters.length);
    
    if (type == "new filter") {
    // This handles the new filter in 4.3Y
    if (filters.length > 1) {
        filterStr = "<or>";
    }

    for (i=0; i<filters.length; i++) {
        range=0;
        wildcard=0;

        if (filters[i].indexOf("*") >= 0 || filters[i].indexOf("?") >= 0) wildcard=1;

        logP4Msg("setup_soap_filters", "SAM", "filters[i] value: "+filters[i]);
        logP4Msg("setup_soap_filters", "SAM", "filter range regexp value: "+filters[i].match(filter_range_regexp));
        if (filters[i].match(filter_range_regexp) != "") range=1;

        if (range) {
        var num_range = filters[i].substring(6,filters[i].indexOf(")"));
        var greater = num_range.split("..")[0];
        var less = num_range.split("..")[1];

        filterStr+='<and> <greaterOrEqual name="'+filterparam+'" value="'+greater+'"/>';
        filterStr+='<lessOrEqual name="'+filterparam+'" value="'+less+'"/> </and>';    
        }
        else if (wildcard) {
        filterStr+='<wildcard name="'+filterparam+'" value="'+ipaddr_to_soap_string(filters[i])+'"/>';
        }
        else {
        filterStr+='<equal name="'+filterparam+'" value="'+ipaddr_to_soap_string(filters[i])+'"/>';
        }
    }

    if (filters.length > 1) {
        filterStr += "</or>";
    }

    }
    else {
    
    if (filters.length > 1) {
        filterStr = "<or>";
    }
    
    for (i=0; i<filters.length; i++) {
        n=filters[i].indexOf("*");
        if (n==(-1)) {
        n=filters[i].indexOf("?");
        }
        // This check should be expanded to check to exclude "%_"

        if (n==(-1)) {
        // no wildcard
        filterStr=filterStr+'<equal name="'+filterparam+'" value="'+ipaddr_to_soap_string(filters[i])+'"/>';
        } else {
        // wildcard in use
        filterStr=filterStr+'<wildcard name="'+filterparam+'" value="'+ipaddr_to_soap_string(filters[i])+'"/>';
        }
        if ((i+2)<filters.length) {
        filterStr=filterStr+'<or>';
        }
    }
    
    for (i=filters.length; i>1; i--) {
        filterStr=filterStr+'</or>';
    }
    }
    return(filterStr);
}



function combine_soap_filters(incEntry, excEntry) {

    var filterStr="",incFilter,excFilter;//,both;
    var both = false;

    incFilter = get_soap_filter(incEntry);
    excFilter = get_soap_filter(excEntry);

    if (isDef(incFilter) && isDef(excFilter))
    {
    	both=true;
    }

    if (both==true)
    {
        filterStr = '<and>';
    }

    if (isDef(incFilter))
    {
        filterStr = filterStr+incFilter;
    }

    if (isDef(excFilter))
    {
        filterStr = filterStr+'<not>'+excFilter+'</not>';
    }

    if (both==true)
    {
        filterStr = filterStr+'</and>';
    }

    return(filterStr);

}

// Returns the soap filter that is the AND of the two input filters

function soap_filter_and(filter1, filter2) {
    
    return("<and>"+filter1+filter2+"</and>");

}

function soap_filter_not(filter) {
    
    return("<not>"+filter+"</not>");

}

function soap_filter_or(filter1, filter2) {
    
    return("<or>"+filter1+filter2+"</or>");

}

function soap_filter_unary(type, property, value) {

    var filter = '<'+type+' name="'+property+'" value="'+value.toString()+'" />';

    return(filter);
}

function soap_attribute(name) {

    return("<attribute>"+name+"</attribute>");
}

function setup_combined_filter_entry(comEntry, incEntry, excEntry) {

    var filter="";

    // This is used because there was a bug in the earlier versions of the SAM 5.0 server
    // Where it would not return anything if you didn't have a filter
    var defaultFilter = '<wildcard name="objectFullName" value="%"/>';
    
    var inarray, exarray, inentry, exentry, inregex, exregex;
    
    filter = combine_soap_filters(incEntry, excEntry);

    if (isUndef(filter_table[comEntry]))
    {
        filter_table[comEntry] = {};
    }


    if (filter == "")
    {
        filter_table[comEntry].soap_filter=defaultFilter;
    }
    else
    {
        filter_table[comEntry].soap_filter=filter;
    }

    logP4Msg("setup_combined_filter_entry", "SAM", "user filter(for "+comEntry+"):"+filter);
    logP4Msg("setup_combined_filter_entry", "SAM", "soap filter(for "+comEntry+"):"+filter_table[comEntry].soap_filter);
    
    inentry=filter_table[incEntry];
    exentry=filter_table[excEntry];
    
    if (isDef(inentry)) {
    inarray=inentry.list;
    if (isDef(inarray)) {
        inregex = regexp_string_from_list(inarray);
        // logStatus("inarray", inarray);
        // logStatus("inregex", inregex);
        filter_table[comEntry].inc_regexp=new RegExp(inregex);
        logP4Msg("setup_combined_filter_entry", "SAM", "filter_table[comEntry].inc_regexp: " + filter_table[comEntry].inc_regexp);
        if (isDef(inentry.filterprop)) {
        filter_table[comEntry].inc_filterprop=inentry.filterprop;
        filter_table[comEntry].filterprop=inentry.filterprop;
        logP4Msg("setup_combined_filter_entry", "SAM", "inc filter set");
        logP4Msg("setup_combined_filter_entry", "SAM", "inc_regexp filter(for "+comEntry+"):"+inregex);
        }
    }
    }
    
    if (isDef(exentry)) {
    exarray=exentry.list;
    if(isDef(exarray)) {
        exregex = regexp_string_from_list(exarray);
        filter_table[comEntry].exc_regexp=new RegExp(exregex);
        if (isDef(exentry.filterprop)) {
        filter_table[comEntry].exc_filterprop=exentry.filterprop;
        filter_table[comEntry].filterprop=exentry.filterprop;
        logP4Msg("setup_combined_filter_entry", "SAM", "exc filter set");
        logP4Msg("setup_combined_filter_entry", "SAM", "exc_regexp filter(for "+comEntry+"):"+exregex);
        }
        filter_table[comEntry].exclude_all=false;       
        if (isDef(exentry.dcitem)) {
        if (remove_leading_trailing_white_space(exentry.dcitem) == "*") {
            filter_table[comEntry].exclude_all=true;
            logP4Msg("setup_combined_filter_entry", "SAM", "exclude all specified for "+comEntry);
        } // if remove
        } // isDef
    } // isDef exarray
    } // isDef exentry
    
    logP4Msg("setup_combined_filter_entry", "SAM", "exiting");
    
}

function setup_resultfilter_entry(comEntry, propmap, additional, standard, children) {

    var filter;

    if (isUndef(filter_table[comEntry])) {
        filter_table[comEntry]={};
    }

    filter = combined_resultfilter_attributes(propmap, additional, standard, children);
    if (filter=="") {
        logP4Msg("SAM", "setup_resultfilter_entry", "comEntry resultfilter: none");
    } else {
        logP4Msg("SAM", "setup_resultfilter_entry", "comEntry resultfilter: " + filter);
        filter_table[comEntry].resultfilter=filter;
    }

    // Do more with this?
    if (isDef(propmap)) {
        filter_table[comEntry].propmap=propmap;
    }

}


function get_resultfilter(filterEntry){

    if (isDef(filter_table[filterEntry])) {
        return(filter_table[filterEntry].resultfilter);
    }
}


function combined_resultfilter_attributes(propmap, additional, standard, children) {
    /*
      propmap is a property mapping for inventory
      additional and standard are arrays of property names
      children is true or false to include children
    */

    var comb=new Array();
    var i, n = 0;
    var result = "";
    //var prop;

    if (isDef(propmap)) 
    {
    	for(var prop in propmap) 
    	{
    		comb[n] = propmap[prop];
    		n++;
    	}
    }

    if (isDef(additional)) 
    {
    	comb = comb.concat(additional);
    }

    if (isDef(standard)) 
    {
    	comb = comb.concat(standard);
    }

    dump_array(comb);

    for(i = 0; i < comb.length; i++) 
    {
    	result = result + soap_attribute(comb[i]);
    }

    if (children != true) 
    {
    	result = result + "<children/>";
    }

    return(result);

}

function logStatus3(name, obj) {
    if (obj == undefined) {
        logP3Msg("SAM", "SAMlib", name+" is UNDEFINED");
    }
    else {
        logP3Msg("SAM", "SAMlib", name+" is "+obj.toString());
        }
    }

function dump_properties(proplist) {

    //var i;

    for (var i in proplist) 
    {
    	logP3Msg("dump_proplist", "SAM", i+" : "+proplist[i]);
    }
}

function dump_array(arr) {

    var i;

    if (enable_log_base_on_level(6)) 
	{
		for (i=0; i<arr.length; i++) 
		{
			logP6Msg("dump_list", "SAM", arr[i]);
		}
    }
}

    
function dump_soap_filters() {

    //var i;
    var filter;

    for (var i in filter_table) {
    logP3Msg("dump_soap_filters", "SAM", "soap filter(for "+i+"):"+filter_table[i].soap_filter);
    filter=get_soap_filter(i);
    logStatus3("get_soap_filter:", filter);
    filter=get_ppp_soap_filter(i);
    logStatus3("get_ppp_soap_filter:", filter);
    }

}


// Translates a wildcard specification of an IP address (can contain * and ?) into the
// SQL-style specification the SAM server uses.
function ipaddr_to_soap_string(ipaddr) {

    var i,c,tr,restr="";

    // Translation for special characters.
    var trarray = {"?":"_",
           "*":"%" };

    for (i=0; i<ipaddr.length; i++) {
    c=ipaddr.charAt(i);
    tr=trarray[c];
    if (isDef(tr)) {
        restr=restr+tr;
    } else {
        restr=restr+c;
    }
    }

    return(restr);

}





// Translates a wildcard specification of an IP address (can contain * and ?) into a
// regular expression string
function ipaddr_to_regexp_string(ipaddr) {

    var i,c,tr,restr="";

    // Translation for special characters.  Note that \\. comes out as \.
    var trarray = {":":"\\:",
           ".":"\\.",
           "?":".",
           "*":".*" };

    for (i=0; i<ipaddr.length; i++) {
    c=ipaddr.charAt(i);
    tr=trarray[c];
    if (isDef(tr)) {
        restr=restr+tr;
    } else {
        restr=restr+c;
    }
    }

    return(restr);

}




// filters is a list of ip addresses to match, like 10.16.0.4 or 10.16.0.*

function regexp_string_from_list(filters) {

    var filterStr="^(",i;//,n;

    logP3Msg("regexp_string_from_list", "SAM", "input: "+filters);

    for (i=0; i<filters.length; i++) {
    filterStr=filterStr+ipaddr_to_regexp_string(filters[i]);
    if ((i+1)<filters.length) {
        filterStr=filterStr+'|';
    }
    }
    
    filterStr=filterStr+")";

    logP3Msg("regexp_string_from_list", "SAM", "regexp: "+filterStr);
    
    return(filterStr);
}


function boolean_string(bool) {

    if (bool == true) {
    return("true");
    } else {
    if (bool == false) {
        return("false");
    } else {
        logStatus("bool", bool);
        logStatus("null", null);
        return("garbage");
    }
    }
}

function isExcludeAll(filterEntry) {
    if (isDef(filter_table[filterEntry])) {
    if (filter_table[filterEntry].exclude_all == true) {
        return true;
    }
    }

    return false;
}


// Returns true or false whether the submitted ip address passes the combined filters
// defined for the submitted class.
// Any match to the exclude filter will cause the combined match to fail, even
// if the include filter matches (i.e. the exclude overrides the include).
// An include match alone will succeed, and an exclude match alone will fail.
//
// No specified include filter will include everything (like an include filter of *).
// No specified exclude filter will exclude nothing.
// (The parenthetical items refer to the unspecified filter cases in the below table.)
//
// inc            exc          comb
//  T (none)       T             F
//  F              T             F
//  T (none)       F (none)      T
//  F              F (none)      F
//
//   so the combined result is:  inc AND (NOT exc)
//
function class_filter_match(samClass, propvalue) {
    
    var inc_regexp, exc_regexp;
    var temp;
    
    // default results of undefined filters
    var inc_match=true, exc_match=false;
    
    logP4Msg("class_filter_match", "SAM", "Entering");
    logP4Msg("class_filter_match", "SAM", "samClass "+ samClass);
    logP4Msg("class_filter_match", "SAM", "propvalue "+ propvalue);
    
    if (isDef(filter_table[samClass])) {
    logP4Msg("class_filter_match", "SAM", "EXC filter entry is defined");
    exc_regexp=filter_table[samClass].exc_regexp;
    if (isDef(exc_regexp)) {
        logP4Msg("class_filter_match", "SAM", "EXC is defined");
        logP4Msg("class_filter_match", "SAM", "filter_table[samClass].exc_regexp="+ filter_table[samClass].exc_regexp);
        logP4Msg("class_filter_match", "SAM", "exc_regexp="+ exc_regexp);
        exc_match = exc_regexp.test(propvalue);
        logP4Msg("class_filter_match", "SAM", "exc_match="+ exc_match);
    }
    }
    
    if (isDef(filter_table[samClass])) {
    logP4Msg("class_filter_match", "SAM", "INC filter entry is defined");
    inc_regexp=filter_table[samClass].inc_regexp;
    if (isDef(inc_regexp)) {
        logP4Msg("class_filter_match", "SAM", "INC is defined");
        logP4Msg("class_filter_match", "SAM", "filter_table[samClass].inc_regexp="+ filter_table[samClass].inc_regexp);
        logP4Msg("class_filter_match", "SAM", "inc_regexp="+ inc_regexp);
        inc_match = inc_regexp.test(propvalue);
        logP4Msg("class_filter_match", "SAM", "inc_match="+ inc_match);
    }
    }

    log_class_filter(samClass);
    logP4Msg("class_filter_match", "SAM", "After eval");
    logP4Msg("class_filter_match", "SAM", "inc_match= "+inc_match);
    logP4Msg("class_filter_match", "SAM", "exc_match= "+exc_match);
    
    temp=(inc_match && (!exc_match));
    if (temp == true) {
    logP4Msg("class_filter_match", "SAM", "Result is true");
    } else {
    logP4Msg("class_filter_match", "SAM", "Result is false");
    }
    
    logP4Msg("class_filter_match", "SAM", "Exiting");
    
    return (inc_match && (!exc_match));

}

function regexp_trim(regexp) {
    // i.e. regexp=/^(testSuiteId: 1 2 3 | packetSize: 88 | routerId: 1)//

    var temp=regexp.toString();
    return temp.substring(3,(temp.length -3));
}

function regexp_new_filter(regexp, propname) {

    // New 4.3Y filter functionality
    // i.e. propname=testSuiteId
    // i.e. regexp=/^(testSuiteId: 1 2 3 | packetSize: 88 | routerId: 1)//

    // The new testSuiteId regexp is /^(1|2|3)/. This will get compared with
    // the value of the testSuiteId propery in the record. Notice this function
    // is called in a for loop. It loops through all of the properties and values.

    var temp, items, item;

    temp=regexp_trim(regexp);
    
    if (filter_with_property_regexp.test(temp)) {

    logP4Msg("regexp_new_filter", "SAM", "new string to parse=" + temp);
    logP4Msg("regexp_new_filter", "SAM", "property name=" + propname);
      
    if (temp.search(propname) >= 0) {
        items=temp.split("|");
        var new_regexp;
        for (var i=0; i<items.length; i++) 
        {
        	item=items[i];
        	if (item.search(propname) >= 0) 
        	{
        		logP4Msg("regexp_new_filter", "SAM", "item before parse=" + item);
        		item=remove_leading_trailing_white_space(item.replace(propname+":",""));
        		item=item.replace(/\s/g,"|");
        		logP4Msg("regexp_new_filter", "SAM", "item after parse=" + item);
        		new_regexp=new RegExp("^("+item+")");
        		i=items.length;
        	}
        }
        if (!isDef(new_regexp) ) {
        logP4Msg("regexp_new_filter", "SAM", "new regexp defined with no value");
        var new_regexp=new RegExp();
        }
        logP4Msg("regexp_new_filter", "SAM", "new regexp=" + new_regexp);
        return new_regexp;
    }
    return regexp;
    }
    else {
    return regexp;
    }
}

function is_new_filter(str) {

    if (str.indexOf(";") >= 0) {
    return 1;
    }
    else {
    return filter_with_property_regexp.test(str);
    }
}

function is_regexp_new_filter(regexp) {

    // New 4.3Y filter functionality
    // i.e. regexp=/^(testSuiteId: 1 2 3 | packetSize: 88 | routerId: 1)//

    var temp;

    if (isDef(regexp)) {
    temp=regexp_trim(regexp);
    if (filter_with_property_regexp.test(temp)) {
        return 1;
    }
    }

    return 0;
}

function get_regexp_new_filter_properties(regexp) {

    // New 4.3Y filter functionality
    // i.e. regexp=/^(testSuiteId: 1 2 3 | packetSize: 88 | routerId: 1)//

    var temp, item, items;
    var proparray=new Array();

    temp=regexp_trim(regexp);
    items=temp.split("|");

    for (var i=0; i<items.length; i++) {
    item=items[i].split(":")[0];
    logP4Msg("get_regexp_new_filter_properties", "SAM", "item before parse=" + item);
    item=remove_leading_trailing_white_space(item);
    logP4Msg("get_regexp_new_filter_properties", "SAM", "item after parse=" + item);
    proparray.push(item);
    }

    return proparray;
}

function is_record_to_be_processed(samClass, fentry, record, type) {
    
    var filterprop, filtervalue, temp;
    var filterproplist=new Array();
    var regexp=(type == "include") ? fentry.inc_regexp : fentry.exc_regexp;

    // If filter is undefined, then do not filter anything 
    if (! isDef(regexp) ) return true;

    temp=regexp_trim(regexp);
    if (filter_with_property_regexp.test(temp)) {
    filterproplist=get_regexp_new_filter_properties(regexp);
    }
    else {
    // This is an IP addr without a property (old filter)
    if (type == "include") filterproplist.push(fentry.inc_filterprop);
    if (type == "exclude") filterproplist.push(fentry.exc_filterprop);
    }

    for (var i=0; i<filterproplist.length; i++) {
    filterprop=filterproplist[i];
    logP4Msg("is_record_to_be_processed", "SAM", "Filterprop: "+filterprop);
    filtervalue=record[filterprop];

    if (type == "include") {
        if (isDef(filtervalue)) {
        logP4Msg("is_record_to_be_processed", "SAM", "Filtervalue: "+filtervalue);

        // Notice the return is false if the match is false. In other words, if every property
        // reports a match, then we process the record. The include filter is a logical AND.
        if (! class_filter_match_properties(samClass, filtervalue, filterprop, regexp) ) {
            return(false);
        }
        }
        else {
        logP4Msg("is_record_to_be_processed", "SAM", "INCLUDE No property found for field "+filterprop);
        return(false);
        }
    }
    else {
        if (isDef(filtervalue)) {
        logP4Msg("is_record_to_be_processed", "SAM", "Filtervalue: "+filtervalue);

        // Notice the return is false if the match is true. In other words, if one property
        // reports a match, then we do not process the record. The exclude filter is a logical OR.
        if (class_filter_match_properties(samClass, filtervalue, filterprop, regexp) ) {
            return(false);
        }
        }
        else {
        logP4Msg("is_record_to_be_processed", "SAM", "EXCLUDE No property found for field "+filterprop);
        return(false);
        }
    }
    }
    return(true);
}

function class_filter_match_properties(samClass, propvalue, propname, regexp) {
    
    var new_regexp;
    var temp;
    // default result of filters
    var match=false;
    
    logP4Msg("class_filter_match_properties", "SAM", "Entering");
    logP4Msg("class_filter_match_properties", "SAM", "Before eval match= "+ match);
    logP4Msg("class_filter_match_properties", "SAM", "samClass "+ samClass);
    logP4Msg("class_filter_match_properties", "SAM", "propvalue "+ propvalue);
    
    if (isDef(filter_table[samClass])) {
    logP4Msg("class_filter_match_properties", "SAM", "filter entry is defined");
    new_regexp=regexp_new_filter(regexp, propname);
    if (isDef(new_regexp)) {
        logP4Msg("class_filter_match_properties", "SAM", "filter_table[samClas] regexp="+ regexp);
        logP4Msg("class_filter_match_properties", "SAM", "new_regexp="+ new_regexp);
        match = new_regexp.test(propvalue);
        logP4Msg("class_filter_match_properties", "SAM", "match="+ match);
    }
    }
    
    logP4Msg("class_filter_match_properties", "SAM", "After eval match= "+ match);
    logP4Msg("class_filter_match_properties", "SAM", "Exiting");
    
    return match;
}

function record_filter_match(samClass, record) {

    var filterprop, ipaddr, fentry;
    var inc_regexp, exc_regexp;

    logP4Msg("record_filter_match", "SAM", "samClass: "+samClass);

    fentry=filter_table[samClass];
    
    if (isDef(fentry)) {

    if (is_regexp_new_filter(fentry.inc_regexp) || is_regexp_new_filter(fentry.exc_regexp)) {
        // New 4.3Y filter functionality

        if (! is_record_to_be_processed(samClass, fentry, record, "include") ) {
        return(false);
        }
        
        // Exclude is checked after include for a reason. Any value matching the 
        // exclude filter will be excluded, even if the value matched the include filter.
        if (! is_record_to_be_processed(samClass, fentry, record, "exclude") ) {
        return(false);
        }

        return(true);
    }
    else {
        // Old IP address filter functionality (pre 4.3Y)
        filterprop=fentry.filterprop;
        if (isDef(filterprop)) {
        ipaddr=record[filterprop];
        if (isDef(ipaddr)) {
            logP4Msg("record_filter_match", "SAM", "Got ipaddr; return class_filter_match result");
            logP4Msg("record_filter_match", "SAM", "ipaddr: "+ ipaddr);
            logP4Msg("record_filter_match", "SAM", "Filterprop: "+filterprop);
            return(class_filter_match(samClass, ipaddr));
        } else {
            // Filtering field not found -- this is either a failure to properly configure entries 
            // for filtering in setup_soap_filters() or else we are just not receiving a value 
            // for the property we filter on in the record
            logP4Msg("record_filter_match", "SAM", "No ipaddr found for field "+filterprop+" returning false");
            return(false);
        } // isDef(ipaddr)
        }
    }
     
    logP4Msg("record_filter_match", "SAM", "Can't find the field we are testing on or it is not set in the filter(i.e. no filters are set for this class); true");
    // No field is configured in the filter entry; 
    // this can be the case if we don't actually configure any filters (in dc.cfg) for this class
    return(true);

    } // isDef(fentry)
    
    logP4Msg("record_filter_match", "SAM", "No filtering value set up for this class; true");
    // No filtering value set up for this class
    return(true);
    
}


function log_class_filter(samClass) {

    var inc_regexp, exc_regexp;

    if (isDef(filter_table[samClass])) {
    exc_regexp=filter_table[samClass].exc_regexp;
    }


    if (isDef(filter_table[samClass])) {
    inc_regexp=filter_table[samClass].inc_regexp;
    }

    logP4Msg("log_class_filter", "SAM", "Class: "+samClass+" include: "+inc_regexp+" exclude: "+exc_regexp);

}




function test_regexp_match(regexp, string) {

    logP3Msg("regexp_tests", "SAM", "");
    
}

function test_regexp_class_match(samClass, string) {

    var result, rstring="neither";

    //    logP3Msg("test_regexp_class_match", "SAM", "Entering test_regexp_class_match");

    result=class_filter_match(samClass, string);
    if (result == true) {
    rstring="true";
    } else {
    if (result == false) {
        rstring="false";
    }
    }

    logP3Msg("test_regexp_class_match", "SAM", "Comparing class: "+samClass+" to "+string+": "+rstring);
    
}


function regexp_tests() {

    var tstrings= ["10.16.0.4", "10.17.0.1", "10.17.3.1", "10.1.242.16", "10.1.242.25", "10.1.241.62", "10.1.242.61", "9.10.1.2", "10.10.10.10", "10124225", "10.99.0.1", "10.1.61.1", "10.25.0.1", "10.10.25.1"];

    var classstrings=["equipment.HwEnvironment", "svt.MeshSdpBinding", "svt.MirrorSdpBinding", "equipment.PhysicalPort","mpr.IMALink","nat.IsaMda","nat.IsaMember","dhcp.Dhcp6AddressPrefix","dhcp.Subnet","equipment.BaseCard","equipment.ControlProcessor","equipment.DaughterCard","equipment.MCMCard", "equipment.Shelf" ,"lte.S1uPeer", "lte.S5Peer", "lte.S8Peer", "lte.S11Peer", "ltemme.MmeServiceMemberMaf", "lag.Interface", "mpls.Interface","vprn.L3AccessInterface", "vpls.L2AccessInterface"];
    var i,j;

    //    logP3Msg("test_regexp_class_match", "SAM", "Entering regexp_tests");

    for (j=0; j<classstrings.length; j++) {
    log_class_filter(classstrings[j]);
    for (i=0; i<tstrings.length; i++) {
        //      logP3Msg("test_regexp_class_match", "SAM", "i:"+i+" j:"+j);
        test_regexp_class_match(classstrings[j], tstrings[i]);
    }
    }
    

}


function regexp_tests2() {

    var tstrings= ["10.1.241.74", "10.1.241.75", "10.1.241.25", "10.1.202.167"];

    var classstrings=["equipment.HwEnvironment", "svt.MeshSdpBinding", "svt.MirrorSdpBinding", "equipment.PhysicalPort","mpr.IMALink","nat.IsaMda","nat.IsaMember","dhcp.Dhcp6AddressPrefix","dhcp.Subnet","equipment.BaseCard","equipment.ControlProcessor","equipment.DaughterCard","equipment.MCMCard", "equipment.Shelf" ,"lte.S1uPeer", "lte.S5Peer", "lte.S8Peer", "lte.S11Peer", "ltemme.MmeServiceMemberMaf" ,"lag.Interface", "mpls.Interface","vprn.L3AccessInterface", "vpls.L2AccessInterface", "ies.L3AccessInterface", "equipment.PhysicalPort" ];
    var i,j;

    //    logP3Msg("test_regexp_class_match", "SAM", "Entering regexp_tests");

    for (j=0; j<classstrings.length; j++) {
    log_class_filter(classstrings[j]);
    for (i=0; i<tstrings.length; i++) {
        //      logP3Msg("test_regexp_class_match", "SAM", "i:"+i+" j:"+j);
        test_regexp_class_match(classstrings[j], tstrings[i]);
    }
    }


}


function regexp_tests3()
{
    var ipaddr, regstr, regex, out;

    ipaddr = "10.1.241.75";
    regstr = ipaddr_to_regexp_string(ipaddr);
    regex  = new RegExp(regstr);
    out    = ipaddr.match(regex);

    logStatus("ipaddr", ipaddr);
    logStatus("regstr", regstr);
    logStatus("regex", regex);
    logStatus("out", out);

    ipaddr = "10.1.241.75";
    regstr = regexp_string_from_list(ipaddr.split(" "));
    regex  = new RegExp(regstr);
    out    = ipaddr.match(regex);

    logStatus("ipaddr", ipaddr);
    logStatus("regstr", regstr);
    logStatus("regex", regex);
    logStatus("out", out);
}


function resultfilter_test()
{
    var rfa;

    var testequipmentInterfaceMetrics =
    [
        "receivedOctetsPeriodic",
        "receivedUnicastPacketsPeriodic",
        "receivedPacketsDiscardedPeriodic",
        "receivedBadPacketsPeriodic",
        "receivedUnknownProtocolPacketsPeriodic",
        "transmittedOctetsPeriodic",
        "transmittedUnicastPacketsPeriodic",
        "outboundPacketsDiscardedPeriodic",
        "outboundBadPacketsPeriodic",
        "periodicTime"
    ];

    var piggy=["guineaPig"];

    logP3Msg("resultfilter_test", "SAM", "entered");

    logP3Msg("resultfilter_test", "SAM", "before combine");
    //    rfa=combined_resultfilter_attributes(equipment_shelf_Name, testequipmentInterfaceMetrics, piggy, true);
    //    rfa=combined_resultfilter_attributes(equipment_shelf_Name, null, piggy, true);
    rfa=combined_resultfilter_attributes(null, testequipmentInterfaceMetrics, piggy, true);
    logP3Msg("resultfilter_test", "SAM", "after combine");

    logStatus3("rfa", rfa);
}

function get_soap_filter_property_type_metric_filter_all_or_nothing(request_class, file_name)
{
    // default to everything
    var class_filter = everything;

    if (! request_property_type_metric_within_time_frame(file_name))
    {
        if (enable_log_base_on_level(4))
        {
            logP4Msg('SAMBLB', 'timestamp check', 'filter nothing for ' + request_class + ' due to not within the time frame');
        }
        class_filter = nothing;
    }
    else
    {
        if (isExcludeAll(request_class))
        {
            if (enable_log_base_on_level(4))
            {
                logP4Msg('SAMBLB', 'filtering check', 'filter nothing for ' + request_class + ' due to exclude all');
            }
            class_filter = nothing;
        }
        else
        {
            if (enable_log_base_on_level(4))
            {
                logP4Msg('SAMBLB', 'filtering check', 'filter everything for ' + request_class);
            }
            class_filter = everything;
        }
    }

    return class_filter;
}
