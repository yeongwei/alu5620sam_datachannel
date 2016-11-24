// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// var schema_cfm_oneway_delay = createSAMUBASchema("SAM_cfm_oneway_delay", 900, 3, 2);
// schema_cfm_oneway_delay.multiFileJoin = true;
// schema_cfm_oneway_delay = addSAMUBARecordSchema(schema_cfm_oneway_delay, "CfmOneWayDelayTestResult", "ethernetoam.CfmOneWayDelayTestResult", cfmOneWayDelayMetrics, standardAdditionalOAMTestMetricFields);


//
//                p r o c e s s _ c f m _ o n e w a y _ d e l a y
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_cfm_oneway_delay_results_stats(record)
{
    //var theMetric;
    var myId;
    var idmapname;
    var subelement;

	logP5Msg("process_cfm_oneway_delay", "SAMUBA_cfm_oneway_delay", "RECORD: "+ record.test);
    idmapname = record.test.toString();
    
    subelement = LOOKUP.get(idmapname);
	if(subelement == null)	
	{
		logP5Msg("process_cfm_oneway_delay", "SAMUBA_cfm_oneway_delay", "Skipping null subelement for --> "+ idmapname);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_cfm_oneway_delay", "SAMUBA_cfm_oneway_delay", "ENTERING for --> "+ record.test + " with id == " + myId);
    
	for(var i = 0; i < cfmOneWayDelayMetrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmOneWayDelayTestResult~" + cfmOneWayDelayMetrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[cfmOneWayDelayMetrics[i]]);
        //logP4Msg("process_cfm_oneway_delay", "SAMUBA_cfm_oneway_delay", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
		     CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmOneWayDelayTestResult~", cfmOneWayDelayMetrics[i]);
		}
	}
	logP4Msg("process_cfm_oneway_delay", "SAMUBA_cfm_oneway_delay", "LEAVING");

}
