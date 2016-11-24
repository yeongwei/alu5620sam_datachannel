// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_combined_network_egress = createSAMUBASchema("SAM_combined_network_egress", 900, 3, 2);
//schema_combined_network_egress.multiFileJoin = true;
//schema_combined_network_egress = addSAMUBARecordSchema(schema_combined_network_egress, "CombinedNetworkEgressOctetsLogRecord", "service.CombinedNetworkEgressOctetsLogRecord", nqueueEgressOctetMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields));
//schema_combined_network_egress = addSAMUBARecordSchema(schema_combined_network_egress, "NetworkEgressPacketsLogRecord", "service.NetworkEgressPacketsLogRecord", nqueueEgressPacketMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields));


//
//                p r o c e s s _ e q u i p m e n t _ i n t e r f a c e _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_combined_network_egress_stats(record)
{
    var myId;
    var idmapname;
    var subelement;

    //On 7210 device, queueId will be null as it did not have any value on queueId. If queueId is undefined then it will skipped
    //idmapname = record.monitoredObjectPointer.toString()+"_"+record.queueId.toString();
    var egressNetworkQueueId = record.queueId;
    if(isUndef(egressNetworkQueueId))
    {
	    logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_egress", "Skipping null queueId");
	    return;
    }
    else
    {
	    idmapname = record.monitoredObjectPointer.toString()+"_"+record.queueId.toString();
    }

    subelement = LOOKUP.get(idmapname);
	if(subelement == null)	
	{
		if (isDef(record.lagPort)) 
		{
			//Lookup is different if the queue is part of a LAG
			//lagQueueLookup() returns the equivalent to the idmapname for the appropriate port
			if (record.lagPort != '') 
			{
				//logStatus("nqueue_lookup lagPort egress", record.lagPort);
				idmapname = lagQueueLookup(record, idmapname);
				subelement = LOOKUP.get(idmapname);
			}
		}
    }
	if (subelement == null)// still null	
	{ 
		logP5Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_egress", "Skipping null subelement for --> "+ idmapname);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_egress", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
	
    for(var i = 0; i < nqueueCombinedNetworkEgressMetrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Egress~" + nqueueCombinedNetworkEgressMetrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[nqueueCombinedNetworkEgressMetrics[i]]);
        //logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_egress", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Egress~", nqueueCombinedNetworkEgressMetrics[i]);
		}
	}
}
