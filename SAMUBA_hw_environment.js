// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMUBA_equipment_hw_environment.js - Processes the inventory of equipment.HwEnvironment as metrics
//

//var schema_equipment_hw_environment = createSAMUBASchema("SAM_equipment_hw_environment", 900, 4);
// Precedence is 4 so it will be done right after the cpu metrics are processed
//schema_equipment_hw_environment = addSAMUBARecordSchema(schema_equipment_hw_environment, "HwEnvironment", "equipment.HwEnvironment", //equipmentHwEnvironmentPseudoMetrics, standardAdditionalPseudoMetricFields);


//
//   p r o c e s s _ e q u i p m e n t _ H w E n v i r o n m e n t
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_hw_environment_stats(record)
{
    var myId;
	var subelement;
		
	subelement = LOOKUP.get(record.objectFullName);
	if(subelement == null)
	{
		logP4Msg("process_equipment_hw_environment_stats", "SAMUBA_equipment_hw_environment_stats", "Skipping 0 rid for --> "+ record.objectFullName);
		return;
	}
	
	myId = subelement.id;    
	logP4Msg("process_equipment_hw_environment_stats", "SAMUBA_equipment_hw_environment_stats", "ENTERING for --> " + " with id == " + myId);
	
    for(var i = 0; i < equipmentHwEnvironmentPseudoMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~HwEnvironment~" + equipmentHwEnvironmentPseudoMetrics[i];
		logP4Msg("process_equipment_hw_environment_stats", "SAMUBA_equipment_hw_environment_stats", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[equipmentHwEnvironmentPseudoMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~HwEnvironment~", equipmentHwEnvironmentPseudoMetrics[i]);
    }
}
