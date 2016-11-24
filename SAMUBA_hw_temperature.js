// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2005, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMUBA_equipment_hw_environment.js - Processes the inventory of equipment.HwEnvironment as metrics
//

//var schema_equipment_hw_temp = createSAMUBASchema("SAM_equipment_hw_temp", 900, 4);
// Precedence is 4 so it will be done right after the cpu metrics are processed
//schema_equipment_hw_temp = addSAMUBARecordSchema(schema_equipment_hw_temp, "HardwareTemperatureLogRecord", "equipment.HardwareTemperatureLogRecord", equipmentHwTempMetrics, standardAdditionalPolledMetricFields);


//
//   p r o c e s s _ e q u i p m e n t _ H w E n v i r o n m e n t
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_hw_temprature_stats(record)
{
    //var theMetric;
    var myId;
	var subelement;
	
	logP4Msg("process_equipment_hw_temprature_stats", "SAMUBA_equipment_hw_temprature_stats", "ENTERING");   	
	subelement = LOOKUP.get(record.monitoredObjectPointer);
	if(subelement == null)
	{
		logP4Msg("process_equipment_hw_temprature_stats", "SAMUBA_equipment_hw_temprature_stats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;    

	logP4Msg("process_equipment_hw_temprature_stats", "SAMUBA_equipment_hw_temprature_stats", "ENTERING for --> " + " with id == " + myId);
    for(var i = 0; i < equipmentHwTempMetrics.length; i++)
	{
//	    theMetric = OPERATOR.FloatMetric();
//	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~HardwareTemperature~" + equipmentHwTempMetrics[i];
//		logP4Msg("process_equipment_hw_temprature_stats", "SAMUBA_equipment_hw_temprature_stats", "Inside for --> "+ theMetric.name);
//	    theMetric.rid = myId;
//	    theMetric.value = record[equipmentHwTempMetrics[i]];
//	    OPERATOR.addMetric(theMetric);
    	
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~HardwareTemperature~", equipmentHwTempMetrics[i]);
    }
	
	logP4Msg("process_equipment_hw_temprature_stats", "SAMUBA_equipment_hw_temprature_stats", "LEAVING");
}
