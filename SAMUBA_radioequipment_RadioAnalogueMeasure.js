// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_Radio_Analogue_Measure = createSAMUBASchema("SAM_RADEQUIP_RADIO_ANALOGUE_MEASURE", 900, 3);
//schema_Radio_Analogue_Measure = addSAMUBARecordSchema(schema_Radio_Analogue_Measure, "RadioAnalogueMeasure", "radioequipment.RadioAnalogueMeasure", RadioAnalogueMeasureMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_Radio_Analogue_Measure(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_Radio_Analogue_Measure", "SAMUBA_Radio_Analogue_Measure", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_Radio_Analogue_Measure", "SAMUBA_Radio_Analogue_Measure", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in RadioAnalogueMeasureMetrics)
	{
	    var value = parseInt(record[RadioAnalogueMeasureMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~radioequipment~RadioAnalogueMeasure~", RadioAnalogueMeasureMetrics[i]);
         }
	}
	logP4Msg("process_Radio_Analogue_Measure", "SAMUBA_Radio_Analogue_Measure", "LEAVING");
}
