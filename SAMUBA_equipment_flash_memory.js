// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//   p r o c e s s _ e q u i p m e n t _ f l a s h _ m e m o r y _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_equipment_flash_memory_stats(record)
{
    var myId;
	var subelement;
		
	subelement = LOOKUP.get(record.objectFullName.toString());
	logP4Msg("process_equipment_flash_memory_stats", "SAMUBA_equipment_flash_memory", "subelement:" +subelement);
	if(subelement == null)
	{
		logP4Msg("process_equipment_flash_memory_stats", "SAMUBA_equipment_flash_memory", "Skipping 0 rid for --> "+ record.objectFullName.toString());
		return;
	}
	
	myId = subelement.id;    
	logP4Msg("process_equipment_flash_memory_stats", "SAMUBA_equipment_flash_memory", "ENTERING for --> " + " with id == " + myId);
	
    for(var i = 0; i < equipmentFlashMemoryMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~FlashMemory~" + equipmentFlashMemoryMetrics[i];
		logP4Msg("process_equipment_flash_memory_stats", "SAMUBA_equipment_flash_memory", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[equipmentFlashMemoryMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~FlashMemory~", equipmentFlashMemoryMetrics[i]);
    }
}