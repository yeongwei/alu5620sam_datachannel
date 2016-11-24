// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// Create schema for service.PppoeSapStatsLogRecord
// var schema_svc_pppoe = createSAMUBASchema("SAM_svc_pppoe", 900, 3);
// schema_svc_pppoe = addSAMUBARecordSchema
// (
    // schema_svc_pppoe,
    // "PppoeSapStatsLogRecord",
    // "service.PppoeSapStatsLogRecord",
    // servicePppoeSapMetrics,
    // standardAdditionalPolledMetricFields
// );


function process_svc_pppoe(record)
{
    var myId;
    var subelement = LOOKUP.get(record.monitoredObjectPointer);
    
    if(subelement == null)
    {
    	logP5Msg("process_svc_pppoe", "SAMUBA_svc_pppoe", "Skipping 0 RID for --> "+ subelement);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_svc_pppoe", "SAMUBA_svc_pppoe", "ENTERING for --> "+ subelement + " with id == " + myId);

    for(var i in servicePppoeSapMetrics)
    {
    	/*
        theMetric       = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
        theMetric.name  = 'AP~Specific~Alcatel~5620 SAM~Bulk~svc~PPPoESapStats~' + servicePppoeSapMetrics[i];
        theMetric.rid   = myId; 
        theMetric.value = record[servicePppoeSapMetrics[i]];
        OPERATOR.addMetric(theMetric);
        */
    	 CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svc~PPPoESapStats~", servicePppoeSapMetrics[i]);
    }

    logP4Msg("process_", "SAMUBA_svc_pppoe", "LEAVING");
}
