// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
                                                                       
//var schema_DS1_History_Stats_15min_In_Log_Record = createSAMUBASchema("SAM_TDMEQUIP_DS1_HIS_STA_15M_IN_LOG_REC", 900, 3);
//schema_DS1_History_Stats_15min_In_Log_Record = addSAMUBARecordSchema(schema_DS1_History_Stats_15min_In_Log_Record, "DS1HistoryStats15minInLogRecord", "tdmequipment.DS1HistoryStats15minInLogRecord", DS1HistoryStats15minInLogRecordMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_DS1_History_Stats_15min_In_Log_Record(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_DS1_History_Stats_15min_In_Log_Record", "SAMUBA_DS1_History_Stats_15min_In_Log_Record", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_DS1_History_Stats_15min_In_Log_Record", "SAMUBA_DS1_History_Stats_15min_In_Log_Record", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in DS1HistoryStats15minInLogRecordMetrics)
	{
	    var value = parseInt(record[DS1HistoryStats15minInLogRecordMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
	    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~tdmequipment~DS1HistoryStats15minIn~", DS1HistoryStats15minInLogRecordMetrics[i]);
                }
	}
	logP4Msg("process_DS1_History_Stats_15min_In_Log_Record", "SAMUBA_DS1_History_Stats_15min_In_Log_Record", "LEAVING");
}
