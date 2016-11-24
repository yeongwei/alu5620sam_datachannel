// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// Create schema for svq.CustMultiSvcSiteEgrSchedPlcyPortStats
// var schema_ethernet_equipment_dot3_stats = createSAMUBASchema("SAM_ethernet_equipment_dot3_stats", 900, 3);
// schema_ethernet_equipment_dot3_stats     = addSAMUBARecordSchema
// (
    // schema_ethernet_equipment_dot3_stats,
    // "Dot3Stats",
    // "ethernetequipment.Dot3StatsLogRecord",
    // ethernet_equipment_dot3_stats,
    // standardAdditionalPolledMetricFields
// );

function process_ethernet_equipment_dot3_stats(record)
{
    var myId;

    var subelement = LOOKUP.get(record.monitoredObjectPointer);
    
    if(subelement == null)
    {
    	logP5Msg("process_ethernet_equipment_dot3_stats", "SAMUBA_ethernet_equipment_dot3_stats", "Skipping 0 RID for --> "+ subelement);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_ethernet_equipment_dot3_stats", "SAMUBA_ethernet_equipment_dot3_stats", "ENTERING for --> "+ subelement + " with id == " + myId);

    for(var i in ethernet_equipment_dot3_stats)
    {
    	/*theMetric       = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
        theMetric.name  = 'AP~Specific~Alcatel~5620 SAM~Bulk~ethernetequipment~Dot3Stats~' + ethernet_equipment_dot3_stats[i];
        theMetric.rid   = myId; 
        theMetric.value = record[ethernet_equipment_dot3_stats[i]];
        OPERATOR.addMetric(theMetric);*/
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetequipment~Dot3Stats~", ethernet_equipment_dot3_stats[i]);
    }

    logP4Msg("process_ethernet_equipment_dot3_stats", "SAMUBA_ethernet_equipment_dot3_stats", "LEAVING");
}
