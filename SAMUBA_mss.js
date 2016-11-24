// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// Create schema for svq.CustMultiSvcSiteEgrSchedPlcyPortStats
// var schema_mss_egress = createSAMUBASchema("SAM_mss_egress", 900, 3);
// schema_mss_egress     = addSAMUBARecordSchema
// (
    // schema_mss_egress,
    // "CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord",
    // "svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord",
    // svq_cust_multi_svc_site_egr_sched_plcy_port_stats,
    // standardAdditionalPolledMetricFields
// );

// Create schema for svq.CustMultiSvcSiteIngSchedPlcyPortStats
// var schema_mss_ingress = createSAMUBASchema("SAM_mss_ingress", 900, 3);
// schema_mss_ingress     = addSAMUBARecordSchema
// (
    // schema_mss_ingress,
    // "CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord",
    // "svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord",
    // svq_cust_multi_svc_site_ing_sched_plcy_port_stats,
    // standardAdditionalPolledMetricFields
// );

function process_mss_egress(record)
{
	var myId;

    var subelement = LOOKUP.get(record.monitoredObjectPointer);
    if(subelement == null)
    {
        logP5Msg("process_mss_egress", "SAMUBA_mss_egress", "Skipping 0 RID for --> "+ subelement);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_mss_egress", "SAMUBA_mss_egress", "ENTERING for --> "+ subelement + " with id == " + myId);

    for(var i in svq_cust_multi_svc_site_egr_sched_plcy_port_stats)
    {
    	/*
        theMetric       = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
        theMetric.name  = 'AP~Specific~Alcatel~5620 SAM~Bulk~svq~CustMultiSvcSiteEgrSchedPlcyPortStats~' + svq_cust_multi_svc_site_egr_sched_plcy_port_stats[i];
        theMetric.rid   = myId; 
        theMetric.value = record[svq_cust_multi_svc_site_egr_sched_plcy_port_stats[i]];
        OPERATOR.addMetric(theMetric);
        */
        CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svq~CustMultiSvcSiteEgrSchedPlcyPortStats~", svq_cust_multi_svc_site_egr_sched_plcy_port_stats[i]);
    }

    logP4Msg("process_mss_egress", "SAMUBA_mss_egress", "LEAVING");
}

function process_mss_ingress(record)
{
    var myId;

    var subelement = LOOKUP.get(record.monitoredObjectPointer);
    if(subelement == null)
    {
    	logP5Msg("process_mss_ingress", "SAMUBA_mss_ingress", "Skipping 0 RID for --> "+ subelement);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_mss_ingress", "SAMUBA_mss_ingress", "ENTERING for --> "+ subelement + " with id == " + myId);

    for(var i in svq_cust_multi_svc_site_ing_sched_plcy_port_stats)
    {
    	/*
        theMetric       = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
        theMetric.name  = 'AP~Specific~Alcatel~5620 SAM~Bulk~svq~CustMultiSvcSiteIngrSchedPlcyPortStats~' + svq_cust_multi_svc_site_ing_sched_plcy_port_stats[i];
        theMetric.rid   = myId; 
        theMetric.value = record[svq_cust_multi_svc_site_ing_sched_plcy_port_stats[i]];
        OPERATOR.addMetric(theMetric);
        */
        CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svq~CustMultiSvcSiteIngrSchedPlcyPortStats~", svq_cust_multi_svc_site_ing_sched_plcy_port_stats[i]);
    }

    logP4Msg("process_mss_ingress", "SAMUBA_mss_ingress", "LEAVING");
}
