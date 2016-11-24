// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_aggr_maint_rx_stats = createSAMUBASchema("SAM_eth_equipment_aggr_maint_rx", 900, 3);
//schema_aggr_maint_rx_stats = addSAMUBARecordSchema(schema_aggr_maint_rx_stats, "AggrMaintRxStatsLogRecord", "ethernetequipment.AggrMaintRxStatsLogRecord", AggrMaintRxStatsMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ e t h e r n e t _ s t a t s _ l o g _ r e c o r d
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_ethernet_stats_log_record(record)
{
	var myId;
	var subelement;
		
	subelement = LOOKUP.get(record.monitoredObjectPointer.toString());
	if(subelement == null)
	{
		logP4Msg("process_ethernet_stats_log_record", "SAMUBA_etehrnetequipment_ethernet_stats_log_record", "Skipping 0 rid for --> "+ record.monitoredObjectPointer.toString());
		return;
	}
	
	myId = subelement.id;    
	logP4Msg("process_ethernet_stats_log_record", "SAMUBA_etehrnetequipment_ethernet_stats_log_record", "ENTERING for --> " + " with id == " + myId);
	
    for(var i = 0; i < ethernetequipmentEthernetStatsLogRecord.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetequipment~EthernetStats~" + ethernetequipmentEthernetStatsLogRecord[i];
		logP4Msg("process_ethernet_stats_log_record", "SAMUBA_etehrnetequipment_ethernet_stats_log_record", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[ethernetequipmentEthernetStatsLogRecord[i]];
	    OPERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetequipment~EthernetStats~", ethernetequipmentEthernetStatsLogRecord[i]);
    }
}
