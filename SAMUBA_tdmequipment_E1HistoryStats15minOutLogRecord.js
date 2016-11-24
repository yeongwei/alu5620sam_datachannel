// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_E1_History_Stats_15min_Out_Log_Record = createSAMUBASchema("SAM_TDMEQUIP_E1_HIS_STA_15M_OUT_LOG_REC", 900, 3);
//schema_E1_History_Stats_15min_Out_Log_Record = addSAMUBARecordSchema(schema_E1_History_Stats_15min_Out_Log_Record, "E1HistoryStats15minOutLogRecord", "tdmequipment.E1HistoryStats15minOutLogRecord", E1HistoryStats15minOutLogRecordMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_E1_History_Stats_15min_Out_Log_Record(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_E1_History_Stats_15min_Out_Log_Record", "SAMUBA_E1_History_Stats_15min_Out_Log_Record", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_E1_History_Stats_15min_Out_Log_Record", "SAMUBA_E1_History_Stats_15min_Out_Log_Record", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in E1HistoryStats15minOutLogRecordMetrics)
	{
	    var value = parseInt(record[E1HistoryStats15minOutLogRecordMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
	    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~tdmequipment~E1HistoryStats15minOut~", E1HistoryStats15minOutLogRecordMetrics[i]);
                }
	}
	logP4Msg("process_E1_History_Stats_15min_Out_Log_Record", "SAMUBA_E1_History_Stats_15min_Out_Log_Record", "LEAVING");
}
