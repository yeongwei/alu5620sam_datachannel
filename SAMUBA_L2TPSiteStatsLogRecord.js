// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//   p r o c e s s _ l 2 t p _ s i t e _ s t a t s _ l o g _ r e c o r d
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_l2tp_site_stats_log_record(record)
{
    var myId;
	var subelement;
		
	subelement = LOOKUP.get(record.monitoredObjectPointer.toString());
	if(subelement == null)
	{
		logP4Msg("process_l2tp_site_stats_log_record", "SAMUBA_L2TPSiteStatsLogRecord", "Skipping 0 rid for --> "+ record.monitoredObjectPointer.toString());
		return;
	}
	
	myId = subelement.id;    
	logP4Msg("process_l2tp_site_stats_log_record", "SAMUBA_L2TPSiteStatsLogRecord", "ENTERING for --> " + " with id == " + myId);
	
    for(var i = 0; i < l2tpSiteStatsLogRecordMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~l2tp~SiteStats~" + l2tpSiteStatsLogRecordMetrics[i];
		logP4Msg("process_l2tp_site_stats_log_record", "SAMUBA_L2TPSiteStatsLogRecord", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[l2tpSiteStatsLogRecordMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~l2tp~SiteStats~", l2tpSiteStatsLogRecordMetrics[i]);
    }
}