// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_equipment_available_memory = createSAMUBASchema("SAM_equipment_available_memory", 900, 3);
//schema_equipment_available_memory = addSAMUBARecordSchema(schema_equipment_available_memory, "AvailableMemoryStatsLogRecord", "equipment.AvailableMemoryStatsLogRecord", equipmentAvailableMemoryMetrics, standardAdditionalPolledMetricFields);

//
//   p r o c e s s _ e q u i p m e n t _ A l l o c a t e d M e m o r y S t a t s
//...............................................................................................
//
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_AvailableMemoryStats(record)
{
    var monOb = record.monitoredObjectPointer ;
    var len = monOb.length;

    // This is done to get the shelf object name from the monitoredObjectPointer and is not needed for other types
    // of inventory reference.
    var elementName = monOb.substring(0,len-18);
    var subelement = LOOKUP.get(elementName);	
	
    //myId = PV.adaptor.schemas.idmap.idForName(elementName);
	if(subelement == null)
	{
		logP5Msg("process_equipment_AvailableMemoryStats", "SAMUBA_equipment_available_memory", "Skipping 0 rid for --> "+ elementName);
		return;
	}

	logP4Msg("process_equipment_AvailableMemoryStats", "SAMUBA_equipment_available_memory", "ENTERING for --> "+ elementName + " with object -> " + subelement);
	for(var i = 0; i < equipmentAvailableMemoryMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~AvailableMemoryStats~" + equipmentAvailableMemoryMetrics[i];
	    theMetric.resource=subelement;	    
	    theMetric.value = record[equipmentAvailableMemoryMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
		CreateSimpleMetricObject(subelement.id, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~AvailableMemoryStats~", equipmentAvailableMemoryMetrics[i]);
	}
	//logP4Msg("process_equipment_AvailableMemoryStats", "SAMUBA_equipment_available_memory", "LEAVING");
}
