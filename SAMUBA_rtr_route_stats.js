// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_rtr_route_stats = createSAMUBASchema("SAM_rtr_route_stats", 900, 3);
//schema_rtr_route_stats = addSAMUBARecordSchema(schema_rtr_route_stats, "RouteStatsLogRecord", "rtr.RouteStatsLogRecord", rtrRouteMetrics, standardAdditionalPolledMetricFields);

//
//        p r o c e s s _ r t r _ r o u t e_ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_rtr_route_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_rtr_route_stats", "SAMUBA_rtr_route", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_rtr_route_stats", "SAMUBA_rtr_route", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
    for(var i = 0; i < rtrRouteMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~rtr~RouteStats~" + rtrRouteMetrics[i];
	    theMetric.rid = myId; 
	    theMetric.value = record[rtrRouteMetrics[i]];
	    OERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~rtr~RouteStats~", rtrRouteMetrics[i]);
	}
	logP4Msg("process_rtr_route_stats", "SAMUBA_rtr_route", "LEAVING");
}
