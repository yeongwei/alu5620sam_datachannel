// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_IMA_Link_Current_Stats = createSAMUBASchema("SAM_mpr_IMA_Link_Current", 900, 3);
//schema_IMA_Link_Current_Stats = addSAMUBARecordSchema(schema_IMA_Link_Current_Stats, "IMALinkCurrentStatsLogRecord", "mpr.IMALinkCurrentStatsLogRecord", IMALinkCurrentStatsMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ a g g r _ m a i n t _ r e c e i v e d_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_IMA_Link_Current_Stats(record)
{
	//logP3Msg("PRASHANT", "SAMUBA_IMA_Link_Current_Stats", "Entering process_IMA_Link_Current_Stats");
    //var theMetric;
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_IMA_Link_Current_Stats", "SAMUBA_IMA_Link_Current_Stats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_IMA_Link_Current_Stats", "SAMUBA_IMA_Link_Current_Stats", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in IMALinkCurrentStatsMetrics)
	{
	    var value = parseInt(record[IMALinkCurrentStatsMetrics[i]]);
	    if (!(value == null || isNaN(value))) {
	    	
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~mpr~IMALinkCurrentStats~", IMALinkCurrentStatsMetrics[i]);
		    
         }
         else{
                //logP4Msg("PRASHANTMetricelse", "theMetric.value ", value); 
         }     	
        }
	logP4Msg("process_IMA_Link_Current_Stats", "SAMUBA_IMA_Link_Current_Stats", "LEAVING");
}
