// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//   p r o c e s s _ n a t _ p o o l _ l s n s t a t s _ l o g _ r e c o r d
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_nat_pool_lsnstats_log_record(record)
{
    var myId;
	var subelement;
		
	subelement = LOOKUP.get(record.monitoredObjectPointer.toString()); 
 logP3Msg("****************", "***********", subelement);
	if(subelement == null)
	{
		logP4Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "Skipping 0 rid for --> "+ record.monitoredObjectPointer.toString());
		return;
	}
	
	
	
	myId = subelement.id;    
	logP3Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "ENTERING for --> " + " with id == " + myId);
	
	
	subelement.addProperty("samSiteName", record.monitoredObjectSiteName);
	//subelement.addProperty("samSiteId", record.monitoredObjectSiteId);
	if (isConfig("inv_uses_names")) 
	{
		subelement.label = record.monitoredObjectSiteName +"_"+ record.monitoredObjectPointer;
	}
	
    for(var i = 0; i < natPoolLsnStatsLogRecordMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~nat~" + natPoolLsnStatsLogRecordMetrics[i];
		logP4Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[natPoolLsnStatsLogRecordMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	*/
   
    	
    		metric=natPoolLsnStatsLogRecordMetrics[i];
    		className="NatPoolLsnStats";
    	
    	logP3Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "********Class Of Metric: "+className);
		logP3Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "********Metric to insert: "+metric);
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~"+className+"~", metric); 
	}
}
