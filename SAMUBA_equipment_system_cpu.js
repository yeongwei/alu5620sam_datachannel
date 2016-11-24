// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var lastCpuTime = {};
// This is set here and used for the temperature "metrics"

//var schema_equipment_system_cpu = createSAMUBASchema("SAM_equipment_system_cpu", 900, 5);
// This schema is set to precedence 5 so it is done first, and the HW environment one is set to 4 so it will be done next
//schema_equipment_system_cpu = addSAMUBARecordSchema(schema_equipment_system_cpu, "SystemCpuStatsLogRecord", "equipment.SystemCpuStatsLogRecord", equipmentSystemCpuMetrics, cpuAdditionalFields);



//
//   p r o c e s s _ e q u i p m e n t _ S y s t e m C p u S t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_SystemCpuStats(record)
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
		logP5Msg("process_equipment_SystemCpuStats", "SAMUBA_equipment_system_cpu", "Skipping 0 rid for --> "+ elementName);
		return;
	}
	//timestamp = Math.floor(record.timeCaptured/1000);
	if (isDef(record.monitoredObjectSiteId)) 
	{
		lastCpuTime[record.monitoredObjectSiteId] = record.timeCaptured;
	}	

	logP4Msg("process_equipment_SystemCpuStats", "SAMUBA_equipment_system_cpu", "ENTERING for --> "+ elementName + " with object --> " + subelement);
    for(var i = 0; i < equipmentSystemCpuMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemCpuStats~" + equipmentSystemCpuMetrics[i];
	    theMetric.resource=subelement;	    
	    theMetric.value = record[equipmentSystemCpuMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
    	CreateSimpleMetricObject(subelement.id, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~SystemCpuStats~", equipmentSystemCpuMetrics[i]);
	}
	//logP4Msg("process_equipment_SystemCpuStats", "SAMUBA_equipment_system_cpu", "LEAVING");
}
