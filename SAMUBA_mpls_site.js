// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//var schema_mpls_site = createSAMUBASchema("SAM_mpls_site", 900, 3);
//schema_mpls_site = addSAMUBARecordSchema(schema_mpls_site, "MplsSiteStatsLogRecord", "mpls.SiteStatsLogRecord", mplsSiteStatsMetrics, standardAdditionalPolledMetricFields);


//
//        p r o c e s s _ m p l s _ m p l s _ i n t e r f a c e _ s t a t s
//...............................................................................................
// funtion to loop over the name defined above and create a metric object for each entry
//
function process_mpls_site_stats(record)
{	
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_mpls_sitce_stats", "SAMUBA_mpls_sitce", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;
    logP4Msg("process_mpls_sitce_stats", "SAMUBA_mpls_site", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i = 0; i < mplsSiteStatsMetrics.length; i++)
	{
		/*
    	theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~mpls~SiteStats~" + mplsSiteStatsMetrics[i];
	    theMetric.rid = myId;	    
	    theMetric.value = record[mplsSiteStatsMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
		CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~mpls~SiteStats~", mplsSiteStatsMetrics[i]);
	}
    
	logP4Msg("process_mpls_site_stats", "SAMUBA_mpls_site", "LEAVING");
}
