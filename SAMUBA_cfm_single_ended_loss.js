// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// var schema_cfm_single_ended_loss = createSAMUBASchema("SAM_cfm_single_ended_loss", 900, 3, 2);
// schema_cfm_single_ended_loss.multiFileJoin = true;
// schema_cfm_single_ended_loss = addSAMUBARecordSchema(schema_cfm_single_ended_loss, "CfmSingleEndedLossTestResult", "ethernetoam.CfmSingleEndedLossTestResult", cfm_single_ended_loss_metrics, standardAdditionalOAMTestMetricFields);


//
//                p r o c e s s_cfm_single_ended_loss
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_cfm_single_ended_loss_results_stats(record)
{
    //var theMetric;
    var myId;
    var idmapname;
    var subelement;

	logP5Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "RECORD: "+ record.test);
    idmapname = record.test;

    subelement = LOOKUP.get(idmapname);
    logP5Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "RECORD: "+ idmapname);
	if(subelement == null)	
	{
		logP5Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "Skipping null subelement for --> "+ idmapname);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "ENTERING for --> "+ idmapname + " with id == " + myId);
    
	for(var i = 0; i < cfm_single_ended_loss_metrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmSingleEndedLossTestResult~" + cfm_single_ended_loss_metrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[cfm_single_ended_loss_metrics[i]]);
        //logP4Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
		     CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmSingleEndedLossTestResult~", cfm_single_ended_loss_metrics[i]);
		}
	}
	logP4Msg("process_cfm_single_ended_loss", "SAMUBA_cfm_single_ended_loss", "LEAVING");

}
