// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_equipment_system_memory = createSAMUBASchema("SAM_equipment_system_memory", 900, 3);
//schema_equipment_system_memory = addSAMUBARecordSchema(schema_equipment_system_memory, "SystemMemoryStatsLogRecord", "equipment.SystemMemoryStatsLogRecord", equipmentSystemMemoryMetrics, standardAdditionalPolledMetricFields);


//   p r o c e s s _ e q u i p m e n t _ S y s t e m M e m o r y S t a t s
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_SystemMemoryStats(record)
{
	logP4Msg("process_equipment_SystemMemoryStats", "SAMUBA_equipment_system_memory", "LEAVING");
    var myId;
    var monOb = record.monitoredObjectPointer ;
    var len = monOb.length;

    // This is done to get the shelf object name from the monitoredObjectPointer and is not needed for other types
    // of inventory reference.
    var elementName = monOb.substring(0,len-18);
    var subelement = LOOKUP.get(elementName);	
	
	if(subelement == null)
	{
		logP5Msg("process_equipment_SystemMemoryStats", "SAMUBA_equipment_system_memory", "Skipping 0 rid for --> "+ elementName);
		return;
	}
	
	myId = subelement.id;	
	logP4Msg("process_equipment_SystemMemoryStats", "SAMUBA_equipment_system_memory", "ENTERING for --> "+ elementName + " with id == " + myId);	

    for(var i = 0; i < equipmentSystemMemoryMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemMemoryStats~" + equipmentSystemMemoryMetrics[i];
	    theMetric.rid = myId;	    
	    theMetric.value = record[equipmentSystemMemoryMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemMemoryStats~", equipmentSystemMemoryMetrics[i]);
	}
	logP4Msg("process_equipment_SystemMemoryStats", "SAMUBA_equipment_system_memory", "LEAVING");
}
