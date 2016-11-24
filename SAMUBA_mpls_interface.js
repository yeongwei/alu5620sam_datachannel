// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//var schema_mpls_interface = createSAMUBASchema("SAM_mpls_interface", 900, 3);
//schema_mpls_interface = addSAMUBARecordSchema(schema_mpls_interface, "MplsInterfaceStatsLogRecord", "mpls.MplsInterfaceStatsLogRecord", mplsInterfaceMetrics, standardAdditionalPolledMetricFields);


//
//        p r o c e s s _ m p l s _ m p l s _ i n t e r f a c e _ s t a t s
//...............................................................................................
// funtion to loop over the name defined above and create a metric object for each entry
//
function process_mpls_interface_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_mpls_mpls_interface_stats", "SAMUBA_mpls_mpls_interface", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_mpls_mpls_interface_stats", "SAMUBA_mpls_interface", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
    for(var i = 0; i < mplsInterfaceMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~mpls~MplsInterfaceStats~" + mplsInterfaceMetrics[i];
	    theMetric.rid = myId;	    
	    theMetric.value = record[mplsInterfaceMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
	    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~mpls~MplsInterfaceStats~", mplsInterfaceMetrics[i]);
	}
    
	logP4Msg("process_mpls_mpls_interface_stats", "SAMUBA_mpls_interface", "LEAVING");
}
