// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_card_slot_stats = createSAMUBASchema("SAM_equipment_card_slot_stats", 900, 3);
//schema_card_slot_stats = addSAMUBARecordSchema(schema_card_slot_stats, "CardHealthStatsLogRecord", "equipment.CardHealthStatsLogRecord", cardSlotMetricsFilter, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ c a r d _ h e a l t h _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_card_slot_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_card_slot_stats", "SAMUBA_card_slot", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_card_slot_stats", "SAMUBA_card_slot", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in cardSlotMetrics)
	{
	    var theMetric = OPERATOR.FloatMetric();
	    
	    var _timestampName = null; 
		_timestampName = metricClassTimestampMapping[record["className"]];
		logP4Msg("process_card_slot_stats", "SAMUBA_card_slot", "_timestampName -> " + _timestampName);
		if(isDef(record[_timestampName]) == true)
		{
			theMetric.timestamp = ParseTimestamp(record[_timestampName]);
		}
		else
		{
			theMetric.timestamp = record.timestamp;
		}
		logP4Msg("process_card_slot_stats", "SAMUBA_card_slot", "theMetric.timestamp -> " + theMetric.timestamp);
	    theMetric.name = "AP~Generic~Universal~Utilization~" + cardSlotMetrics[i];
	    theMetric.rid = myId; 
	    theMetric.value = record[i];
	    OPERATOR.addMetric(theMetric);
		//CreateSimpleMetricObject(myId, record, "AP~Generic~Universal~Utilization~", cardSlotMetrics[i]);
	}
	//logP4Msg("process_card_slot_stats", "SAMUBA_card_slot", "LEAVING");
}
