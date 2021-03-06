// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_aggr_maint_tx_stats = createSAMUBASchema("SAM_eth_equipment_aggr_maint_tx", 900, 3);
//schema_aggr_maint_tx_stats = addSAMUBARecordSchema(schema_aggr_maint_tx_stats, "AggrMaintTxStatsLogRecord", "ethernetequipment.AggrMaintTxStatsLogRecord", AggrMaintTxStatsMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_aggr_maint_tx_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_aggr_maint_tx_stats", "SAMUBA_aggr_maint_tx_stats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_aggr_maint_tx_stats", "SAMUBA_aggr_maint_tx_stats", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in AggrMaintTxStatsMetrics)
	{
	    var value = parseInt(record[AggrMaintTxStatsMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetequipment~AggrMaintTxStats~", AggrMaintTxStatsMetrics[i]);
         }
	}
	logP4Msg("process_aggr_maint_tx_stats", "SAMUBA_aggr_maint_tx_stats", "LEAVING");
}
