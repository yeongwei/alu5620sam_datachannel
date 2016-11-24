// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//var schema_combined_network_ingress = createSAMUBASchema("SAM_combined_network_ingress", 900, 3, 2);
//schema_combined_network_ingress.multiFileJoin = true;
//schema_combined_network_ingress = addSAMUBARecordSchema(schema_combined_network_ingress, "CombinedNetworkIngressOctetsLogRecord", "service.CombinedNetworkIngressOctetsLogRecord", nqueueIngressOctetMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields));
//schema_combined_network_ingress = addSAMUBARecordSchema(schema_combined_network_ingress, "NetworkIngressPacketsLogRecord", "service.NetworkIngressPacketsLogRecord", nqueueIngressPacketMetrics, standardAdditionalAccountingMetricFields.concat(lagNetworkQueueFields));


//
//                p r o c e s s _ e q u i p m e n t _ i n t e r f a c e _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_combined_network_ingress_stats(record)
{
	logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "Entered !!!");
	logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "Record -> " + record);
	
    var myId;
    var idmapname;
    var subelement;

    //On 7210 device, queueId will be null as it did not have any value on queueId. If queueId is undefined then it will skipped
    //idmapname = record.monitoredObjectPointer.toString()+"_"+record.queueId.toString();
    var ingressNetworkQueueId = record.queueId;
    if(isUndef(ingressNetworkQueueId))
    {
	    logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "Skipping null queueId");
	    return;
    }
    else
    {
    	logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "Queue Id is FOUND !!!");
    	idmapname = record.monitoredObjectPointer.toString()+"_"+record.queueId.toString();
    	logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "idmapname -> " + idmapname);
    }

    subelement = LOOKUP.get(idmapname);
    if(subelement == null)	
    {	
    	logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "Potentially this queue is part of a LAG !!!");
    	if (isDef(record.lagPort)) 
    	{
    	
    	// Lookup is different if the queue is part of a LAG
	    // lagQueueLookup() returns the equivalent to the idmapname for the appropriate port
    		if (record.lagPort != '') 
    		{
    			logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "lagPort is FOUND!!!");
    			logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "lagPort -> " + record.lagPort);
    			//logStatus("nqueue_lookup lagPort ingress", record.lagPort);
    			idmapname = lagQueueLookup(record, idmapname);
    			logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "RETURNING from function lagQueueLookup");
    			logP4Msg("process_combined_network_egress_stats", "SAMUBA_combined_network_ingress", "idmapnam -> " + idmapname);
    			subelement = LOOKUP.get(idmapname);
	    	}
    	}
    }
    
    if(subelement == null)	
    {
    	logP5Msg("process_combined_network_ingress_stats", "SAMUBA_combined_network_ingress", "Skipping null subelement for --> "+ idmapname);
    	return;
    }
    
    myId = subelement.id;  
    logP4Msg("process_combined_network_ingress_stats", "SAMUBA_combined_network_ingress", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    for(var i = 0; i < nqueueCombinedNetworkIngressMetrics.length; i++)
	{
	    //theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
	    //theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Ingress~" + nqueueCombinedNetworkIngressMetrics[i];
	    //theMetric.rid = myId;
	    var value = parseInt(record[nqueueCombinedNetworkIngressMetrics[i]]);
	    //logP4Msg("process_combined_network_ingress_stats", "SAMUBA_combined_network_ingress", "Metric value " + theMetric.name + " = " + value);
 		if (!(value == null || isNaN(value))) 
 		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
		     CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~NetworkQueues~Ingress~", nqueueCombinedNetworkIngressMetrics[i]);
		}
	}
	logP4Msg("process_combined_network_ingress_stats", "SAMUBA_combined_network_ingress", "LEAVING");

}

//03 April 2013: Excecute when a lag port is found
//E.g. idmap = <physical_port_objectfullname> + <queueId>
function lagQueueLookup(record, idmap)
{
    var port;
    var portMOP; //The monitored object pointer of the physical port involved here
    var subelement;

    //    logP5Msg("SAMUBA_nqueue_lookup", "UBA", "Lookup of " + idmap  + " in lagToMOP");
    subelement = lagToMOP.get(idmap);
    if (subelelement == null)//Need to look in the physical port table
    { 
    	if (isDef(record.monitoredObjectSiteId) && (isDef(record.portId))) 
    	{
    		port = record.monitoredObjectSiteId + "_" + record.portId;
    		portMOP = ppToMOP.get(port);//ppToMOP populated during onResync
    		if (isDef(portMOP))//A port that exists 
    		{ 
    			//logP5Msg("SAMUBA_nqueue_lookup", "UBA", "Lookup of " + port  + " in ppToMOP: " + portMOP);
    			subelement = portMOP.toString() + "_" + record.queueId.toString();
    			//logP5Msg("SAMUBA_nqueue_lookup", "UBA", "Subelement: " + subelement);
    			lagToMOP.put(idmap, subelement);  // Cache this here for future lookups (until the next resync)
    		}  // portMOP
    	} // isDef fields
    }

    return subelement;
}
