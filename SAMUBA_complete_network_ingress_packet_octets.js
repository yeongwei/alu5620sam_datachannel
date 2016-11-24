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
//                p r o c e s s _ c o m p l e t e _ n e t w o r k _ i n g r e s s _ p a c k e t _ o c t e t s _ l o g _ r e c o r d
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_complete_network_ingress_packet_octets_log_record(record)
{
    var myId;
    var idmapname;
    var subelement;
	var monObjPointer;
	var index;
    //On 7210 device, queueId will be null as it did not have any value on queueId. If queueId is undefined then it will skipped
    //idmapname = record.monitoredObjectPointer.toString()+"_"+record.queueId.toString();
    var ingressNetworkQueueId = record.queueId;
    if(isUndef(ingressNetworkQueueId))
    {
	    logP4Msg("process_complete_network_ingress_packet_octets_log_record", "SAMUBA_complete_network_ingress_packet_octets", "Skipping null queueId");
	    return;
    }
    else
    {
	   index =  record.monitoredObjectPointer.toString().lastIndexOf(":");
	monObjPointer = record.monitoredObjectPointer.toString().substring(0,index);
	logP4Msg("process_complete_network_ingress_packet_octets_log_record", "monitoredObjectPointer", monObjPointer);

	    idmapname = monObjPointer+ "_" + record.queueId.toString();
    }
logP4Msg("process_complete_network_egress_packet_octets_log_record", "idmapname", +idmapname);
    subelement = LOOKUP.get(idmapname);
	if(subelement == null)	
	{
		if (isDef(record.lagPort)) 
		{
			//Lookup is different if the queue is part of a LAG
			//lagQueueLookup() returns the equivalent to the idmapname for the appropriate port
			if (record.lagPort != '') 
			{
				//logStatus("nqueue_lookup lagPort ingress", record.lagPort);
				idmapname = lagQueueLookup(record, idmapname);
				subelement = LOOKUP.get(idmapname);
			}
		}
    }
	if (subelement == null)// still null	
	{ 
		logP5Msg("process_complete_network_ingress_packet_octets_log_record", "SAMUBA_complete_network_ingress_packet_octets", "Skipping null subelement for --> "+ idmapname);
		return;
	}

	myId = subelement.id;  
    logP4Msg("process_complete_network_ingress_packet_octets_log_record", "SAMUBA_complete_network_ingress_packet_octets", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
	
    for(var i = 0; i < nqueueCombinedNetworkIngressMetrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Egress~" + nqueueCombinedNetworkEgressMetrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[nqueueCombinedNetworkIngressMetrics[i]]);
        //logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_egress", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
			//nqueueCombinedNetworkIngressMetrics is used here as it contains
			//the same metric names as required by this metric class
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Ingress~", nqueueCombinedNetworkIngressMetrics[i]);
		}
	}
}
