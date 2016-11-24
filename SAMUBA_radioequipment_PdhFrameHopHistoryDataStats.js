// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_Pdh_Frame_Hop_History_Data_Stats = createSAMUBASchema("SAM_RADEQUIP_PDH_FRAME_HOP_HIS_DATA", 900, 3);
//schema_Pdh_Frame_Hop_History_Data_Stats = addSAMUBARecordSchema(schema_Pdh_Frame_Hop_History_Data_Stats, "PdhFrameHopHistoryDataStats15MinLogRecord", "radioequipment.PdhFrameHopHistoryDataStats15MinLogRecord", PdhFrameHopHistoryDataStats15MinMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_Pdh_Frame_Hop_History_Data_Stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_Pdh_Frame_Hop_History_Data_Stats", "SAMUBA_Pdh_Frame_Hop_History_Data_Stats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_Pdh_Frame_Hop_History_Data_Stats", "SAMUBA_Pdh_Frame_Hop_History_Data_Stats", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in PdhFrameHopHistoryDataStats15MinMetrics)
	{
	    var value = parseInt(record[PdhFrameHopHistoryDataStats15MinMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~radioequipment~PdhFrameHopHistoryDataStats15Min~", PdhFrameHopHistoryDataStats15MinMetrics[i]);  
         }
	}
	logP4Msg("process_Pdh_Frame_Hop_History_Data_Stats", "SAMUBA_Pdh_Frame_Hop_History_Data_Stats", "LEAVING");
}
