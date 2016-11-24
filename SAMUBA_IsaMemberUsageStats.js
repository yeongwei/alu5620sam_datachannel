// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2005, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMUBA_IsaMemberUsageStats.js - Processes the inventory of equipment.HwEnvironment as metrics
//

//var schema_nat_IsaMemberUsageStats = createSAMUBASchema("SAM_nat_IsaMemberUsageStats", 900, 4);
//// Precedence is 4 so it will be done right after the cpu metrics are processed
//schema_nat_IsaMemberUsageStats = addSAMUBARecordSchema(schema_nat_IsaMemberUsageStats, "IsaMemberUsageStatsLogRecord", "nat.IsaMemberUsageStatsLogRecord", natIsaMemberUsageStatsMetrics, standardAdditionalPolledMetricFields);


//
//   p r o c e s s _ nat.IsaMemberUsageStats
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_nat_IsaMemberUsageStats(record)
{
    //var theMetric;
    var myId;
	var subelement;
	
	logP4Msg("process_nat_IsaMemberUsageStats", "SAMUBA_nat_IsaMemberUsageStats", "ENTERING");   	
	subelement = LOOKUP.get(record.monitoredObjectPointer);
	if(subelement == null)
	{
		logP4Msg("process_nat_IsaMemberUsageStats", "SAMUBA_nat_IsaMemberUsageStats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;    

	logP4Msg("process_nat_IsaMemberUsageStats", "SAMUBA_nat_IsaMemberUsageStats", "ENTERING for --> " + " with id == " + myId);
    for(var i = 0; i < natIsaMemberUsageStatsMetrics.length; i++)
	{
//	    theMetric = OPERATOR.FloatMetric();
//	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaMemberUsageStats~" + natIsaMemberUsageStatsMetrics[i];
//		logP4Msg("process_nat_IsaMemberUsageStats", "SAMUBA_nat_IsaMemberUsageStats", "Inside for --> "+ theMetric.name);
//	    theMetric.rid = myId;
	    if (natIsaMemberUsageStatsMetrics[i] == "sessionUsageHi")
	    {
		    if ( record[natIsaMemberUsageStatsMetrics[i]] == "false")
		    {
		    	record[natIsaMemberUsageStatsMetrics[i]]=2;
		    	//theMetric.value = 2;
		    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaMemberUsageStats~", natIsaMemberUsageStatsMetrics[i]);
		    }
		    else if (record[natIsaMemberUsageStatsMetrics[i]] == "true")
		    {
		    	record[natIsaMemberUsageStatsMetrics[i]]=1;
		    	//theMetric.value = 1;
		    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaMemberUsageStats~", natIsaMemberUsageStatsMetrics[i]);
		    	
		    }
		    else
		    {
		    	//theMetric.value = record[natIsaMemberUsageStatsMetrics[i]];
		    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaMemberUsageStats~", natIsaMemberUsageStatsMetrics[i]);
		    }
	    }else{
	    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaMemberUsageStats~", natIsaMemberUsageStatsMetrics[i]);
	    	//theMetric.value = record[natIsaMemberUsageStatsMetrics[i]];
	    }
	    //OPERATOR.addMetric(theMetric);
    }
	
	logP4Msg("process_nat_IsaMemberUsageStats", "SAMUBA_nat_IsaMemberUsageStats", "LEAVING");
}
