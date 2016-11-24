// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_equipment_system_cpumonstats = createSAMUBASchema("SAM_equipment_system_cpumonstats", 900, 5);
//// This schema is set to precedence 5 so it is done first, and the HW environment one is set to 4 so it will be done next
//schema_equipment_system_cpumonstats = addSAMUBARecordSchema(schema_equipment_system_cpumonstats, "SystemCpuMonStatsLogRecord", "equipment.SystemCpuMonStatsLogRecord", equipmentSystemCpuMonStatsMetrics, cpuAdditionalFields);



//
//   p r o c e s s _ e q u i p m e n t _ S y s t e m C p u M o n S t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_SystemCpuMonStats(record)
{
    //var theMetric;
	var myId;
	var subelement
	var monOb = record.monitoredObjectPointer.toString() ;
    var len = monOb.length;
logP4Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstats", "monOb:"+monOb);
    // This is done to get the shelf object name from the monitoredObjectPointer and is not needed for other types
    // of inventory reference.
    var elementName = monOb.substring(0,len-18);
logP4Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstats", "elementName:"+elementName);
    subelement = LOOKUP.get(elementName);
	logP4Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstats", "elementName.toString():"+elementName.toString());
    //myId = PV.adaptor.schemas.idmap.idForName(elementName);
	if(subelement == null)
	{
		logP5Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstats", "Skipping 0 rid for --> "+ elementName);
		return;
	}
	myId = subelement.id;
	logP4Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstatsmonstats", "ENTERING for --> "+ elementName + " with id == " + myId);
    for(var i = 0; i < equipmentSystemCpuMonStatsMetrics.length; i++)
	{
//	    theMetric = OPERATOR.FloatMetric();
//	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemCpuMonStats~" + equipmentSystemCpuMonStatsMetrics[i];
//	    theMetric.resource=subelement;	    
//	    theMetric.value = record[equipmentSystemCpuMonStatsMetrics[i]];
//	    OPERATOR.addMetric(theMetric);    	
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemCpuMonStats~", equipmentSystemCpuMonStatsMetrics[i]);
	}
	logP4Msg("process_equipment_SystemCpuMonStats", "SAMUBA_equipment_system_cpumonstats", "LEAVING");
}
