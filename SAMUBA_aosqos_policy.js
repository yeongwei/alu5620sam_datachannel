// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_aosqos_policy = createSAMUBASchema("SAM_aosqos_policy", 900, 3, 2);
//schema_aosqos_policy.multiFileJoin = true;
//schema_aosqos_policy = addSAMUBARecordSchema(schema_aosqos_policy, "QoSIngressPolicyStatsLogRecord", "aosqos.QoSIngressPolicyStatsLogRecord", aosqosIngressPolicyMetrics, standardAdditionalPolledMetricFields);


//
//                p r o c e s s _ a o s q o s _ p o l i c y _ m e t r i c
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_aosqos_policy_metric(record)
{
    var subelement;

    subelement = LOOKUP.get(record.monitoredObjectPointer.toString());
	if(subelement == null)	
	{
		logP5Msg("process_aosqos_policy_metric", "SAMUBA_aosqos_policy", "Skipping null subelement for --> "+ record.monitoredObjectPointer.toString());
		return;
	}

    logP4Msg("process_aosqos_policy_metric", "SAMUBA_aosqos_policy", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + subelement.id);
    
	for(var i = 0; i < aosqosIngressPolicyMetrics.length; i++)
	{
		/*
		theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
		theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~aosqos~QosIngressPolicyStats~" + aosqosIngressPolicyMetrics[i];
		theMetric.rid = myId;
                var value = parseInt(record[aosqosIngressPolicyMetrics[i]]);

                logP4Msg("process_aosqos_policy_metric", "SAMUBA_aosqos_policy", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) {
		     theMetric.value = value;
		     OPERATOR.addMetric(theMetric);
		}
		*/
		CreateSimpleMetricObject(subelement.id, record, "AP~Specific~Alcatel~5620 SAM~Bulk~aosqos~QosIngressPolicyStats~", aosqosIngressPolicyMetrics[i]);		
	}
	logP4Msg("process_aosqos_policy_metric", "SAMUBA_aosqos_policy", "LEAVING");

}
