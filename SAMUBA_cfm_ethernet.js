// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// var schema_cfm_ethernet = createSAMUBASchema("SAM_cfm_ethernet", 900, 3, 2);
// schema_cfm_ethernet.multiFileJoin = true;
// schema_cfm_ethernet = addSAMUBARecordSchema(schema_cfm_ethernet, "CfmEthTestResult", "ethernetoam.CfmEthTestResult", cfmEthernetMetrics, standardAdditionalOAMTestMetricFields);


//
//                p r o c e s s _ c f m _ e t h e r n e t
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_cfm_ethernet_results_stats(record)
{
    //var theMetric;
    var myId;
    var idmapname;
    var subelement;

	logP5Msg("process_cfm_ethernet", "SAMUBA_cfm_ethernet", "RECORD: "+ record.test);
    idmapname = record.test;

    subelement = LOOKUP.get(idmapname);
	if(subelement == null)	
	{
		logP5Msg("process_cfm_ethernet", "SAMUBA_cfm_ethernet", "Skipping null subelement for --> "+ idmapname);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_cfm_ethernet", "SAMUBA_cfm_ethernet", "ENTERING for --> "+ record.test + " with id == " + myId);
	
    for(var i = 0; i < cfmEthernetMetrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmEthTestResult~" + cfmEthernetMetrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[cfmEthernetMetrics[i]]);
        //logP4Msg("process_cfm_ethernet", "SAMUBA_cfm_ethernet", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
		     CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmEthTestResult~", cfmEthernetMetrics[i]);
		}
	}
	logP4Msg("process_cfm_ethernet", "SAMUBA_cfm_ethernet", "LEAVING");

}
