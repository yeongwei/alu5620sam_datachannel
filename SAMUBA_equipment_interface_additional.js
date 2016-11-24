// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_equipment_interface_additional = createSAMUBASchema("SAM_equipment_interface_additional", 900, 3);
//schema_equipment_interface_additional = addSAMUBARecordSchema(schema_equipment_interface_additional, "InterfaceAdditionalStatsLogRecord", "equipment.InterfaceAdditionalStatsLogRecord", equipmentInterfaceAdditionalMetrics, standardAdditionalPolledMetricFields);



//
//       p r o c e s s _ e q u i p m e n t _ i n t e r f a c e _ a d d i t i o n a l _ s t a t s
//...............................................................................................
// funtion to loop over the name defined above and create a metric object for each entry
//
function process_equipment_interface_additional_stats(record)
{
	logP5Msg("process_equipment_interface_additional_stats", "SAMUBA_equipment_interface_additional", "record.className -> "+ record.className);

    var myId;  
    var subelement = LOOKUP.get(record.monitoredObjectPointer);
 
	if(subelement == null)	
	{
		logP5Msg("process_equipment_interface_additional_stats", "SAMUBA_equipment_interface_additional", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_equipment_interface_additional_stats", "SAMUBA_equipment_interface_additional", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    for(var i = 0; i < equipmentInterfaceAdditionalMetrics.length; i++)
	{
	    /*theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp / 1000;//This is just temporary
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceAdditionalStats~" + equipmentInterfaceAdditionalMetrics[i];
	    theMetric.rid = myId;	    
	    theMetric.value = record[equipmentInterfaceAdditionalMetrics[i]];
	    OPERATOR.addMetric(theMetric);*/
	    //CreateSimpleMetricObject(mRid, mRecord, mPath, mTargetMetric)
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceAdditionalStats~", equipmentInterfaceAdditionalMetrics[i]);
	}
	logP4Msg("process_equipment_interface_additional_stats", "SAMUBA_equipment_interface_additional", "LEAVING");
}
