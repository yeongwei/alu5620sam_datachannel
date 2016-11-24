// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//var schema_equipment_allocated_memory = createSAMUBASchema("SAM_equipment_allocated_memory", 900, 3);
//schema_equipment_allocated_memory = addSAMUBARecordSchema(schema_equipment_allocated_memory, "AllocatedMemoryStatsLogRecord", "equipment.AllocatedMemoryStatsLogRecord", equipmentAllocatedMemoryMetrics, standardAdditionalPolledMetricFields);


//
//   p r o c e s s _ e q u i p m e n t _ A l l o c a t e d M e m o r y S t a t s
//...............................................................................................
//
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_AllocatedMemoryStats(record)
{
	logP4Msg("process_equipment_AllocatedMemoryStats", "SAMUBA_equipment_allocated_memory", "ENTERED");
	
    var monOb = record.monitoredObjectPointer ;
    var len = monOb.length;

    // This is done to get the shelf object name from the monitoredObjectPointer and is not needed for other types
    // of inventory reference.
    var elementName = monOb.substring(0,len-18);
    var subelement = LOOKUP.get(elementName);	
	
    //myId = PV.adaptor.schemas.idmap.idForName(elementName);
	if(subelement == null)
	{
		logP5Msg("process_equipment_AllocatedMemoryStats", "SAMUBA_equipment_allocated_memory", "Skipping 0 rid for --> "+ elementName);
		return;
	}

	logP4Msg("process_equipment_AllocatedMemoryStats", "SAMUBA_equipment_allocated_memory", "ENTERING for --> "+ elementName + " with object -> " + subelement);
    for(var i = 0; i < equipmentAllocatedMemoryMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~AllocatedMemoryStats~" + equipmentAllocatedMemoryMetrics[i];
	    theMetric.resource=subelement;	    
	    theMetric.value = record[equipmentAllocatedMemoryMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
    	CreateSimpleMetricObject(subelement.id, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~AllocatedMemoryStats~", equipmentAllocatedMemoryMetrics[i]);
	}
	
    logP4Msg("process_equipment_AllocatedMemoryStats", "SAMUBA_equipment_allocated_memory", "LEAVING");
}
