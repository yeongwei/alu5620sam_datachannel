// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_equipment_interface = createSAMUBASchema("SAM_equipment_interface", 900, 3);
//schema_equipment_interface = addSAMUBARecordSchema(schema_equipment_interface, "InterfaceStatsLogRecord", "equipment.InterfaceStatsLogRecord", equipmentInterfaceMetrics, standardAdditionalPolledMetricFields);
// repeat for multiple record schema (i.e. multifile join)
 

//
//                p r o c e s s _ e q u i p m e n t _ i n t e r f a c e _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_equipment_interface_stats(record)
{
    var myId;
    
  //code change start for PMR 16450 
    var suspectFlagVal=1;
    var _timestampName = null;     
	var subelement = LOOKUP.get(record.monitoredObjectPointer);
	
	if(subelement == null)	
	{
		logP5Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
  //code change end for PMR 16450
    
	if (record.suspect == 'true')
	{
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "Suspect:" + record.suspect);
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "Discarding all interface stats metrics");
	//code change start for PMR 16450
		suspectFlagVal=0;		 
		theMetric = OPERATOR.FloatMetric();		
		_timestampName = metricClassTimestampMapping[record["className"]];
		theMetric.timestamp = ParseTimestamp(record[_timestampName]);
		theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceStats~suspect";
		theMetric.rid = myId;
		theMetric.value = suspectFlagVal;
		OPERATOR.addMetric(theMetric);	
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "suspectFlagVal:" + suspectFlagVal);
	//code change end for PMR 16450 
		return;
	}
	else if (record.suspect == 'false')
	{
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "Suspect:" + record.suspect);
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "Process all interface stats metrics");
		suspectFlagVal=1;
		logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "suspectFlagVal:" + suspectFlagVal);
	}
	
	
	
	
    for(var i = 0; i < equipmentInterfaceMetrics.length; i++)
	{
		/*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp / 1000;//This is just temporary
		theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceStats~" + equipmentInterfaceMetrics[i];
		theMetric.rid = myId;
		theMetric.value = record[equipmentInterfaceMetrics[i]];
		OPERATOR.addMetric(theMetric);*/
    	if(equipmentInterfaceMetrics[i] != 'suspect'){
    		CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceStats~", equipmentInterfaceMetrics[i]);
    	}else{
    	//code change start for PMR 16450    				 
    		theMetric = OPERATOR.FloatMetric();		
    		_timestampName = metricClassTimestampMapping[record["className"]];
    		theMetric.timestamp = ParseTimestamp(record[_timestampName]);
    		theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceStats~suspect";
    		theMetric.rid = myId;
    		theMetric.value = suspectFlagVal;
    		OPERATOR.addMetric(theMetric);		
    		//logP4Msg("Suspect Value set 21");
    	//code change end for PMR 16450 
    	}
	}
    
	logP4Msg("process_equipment_interface_stats", "SAMUBA_equipment_interface", "LEAVING");
}
