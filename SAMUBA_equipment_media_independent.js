// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//var schema_equipment_media_independent = createSAMUBASchema("SAM_equipment_media_independent", 900, 3);
//schema_equipment_media_independent = addSAMUBARecordSchema(schema_equipment_media_independent, "InterfaceMediaIndependentStatsLogRecord", "equipment.MediaIndependentStatsLogRecord", equipmentMediaIndependentMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ e q u i p m e n t _ m e d i a _ i n d e p e n d e n t _ s t a t s
//...............................................................................................
// funtion to loop over the name defined above and create a metric object for each entry
//
function process_equipment_media_independent_stats(record)
{
    var myId;
    var subelement = LOOKUP.get(record.monitoredObjectPointer);

	if(subelement == null)
	{
		logP5Msg("process_equipment_media_independent_stats", "SAMUBA_equipment_media_independent", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_equipment_media_independent_stats", "SAMUBA_equipment_media_independent", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
    for(var i = 0; i < equipmentMediaIndependentMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~MediaIndependentStats~" + equipmentMediaIndependentMetrics[i];
	    theMetric.rid = myId;	   
	    theMetric.value = record[equipmentMediaIndependentMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~MediaIndependentStats~", equipmentMediaIndependentMetrics[i]);
	}
    
	logP4Msg("process_equipment_media_independent_stats", "SAMUBA_equipment_media_independent", "LEAVING");
}
