// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_svc_complete_service_ingress = createSAMUBASchema("SAM_svc_complete_service_ingress", 900, 3, 2);
//schema_svc_complete_service_ingress.multiFileJoin = true;
//logP4Msg("SAM_svc_complete_service_ingress", "Adding to the New Schema", "Multi File Join: " + schema_svc_complete_service_ingress.multiFileJoin);
//schema_svc_complete_service_ingress.noNewInputLimit = 2;
//schema_svc_complete_service_ingress = addSAMUBARecordSchema(schema_svc_complete_service_ingress, "CompleteServiceIngressPacketOctetsLogRecord", "service.CompleteServiceIngressPacketOctetsLogRecord", completeServiceIngressPacketOctetsMetrics, standardAdditionalAccountingMetricFields);
//schema_svc_complete_service_ingress = addSAMUBARecordSchema(schema_svc_complete_service_ingress, "ServiceIngressOctetsLogRecord", "service.ServiceIngressOctetsLogRecord", serviceIngressOctetMetrics, standardAdditionalAccountingMetricFields);
//schema_svc_complete_service_ingress = addSAMUBARecordSchema(schema_svc_complete_service_ingress, "ServiceIngressPacketsLogRecord", "service.ServiceIngressPacketsLogRecord", serviceIngressPacketMetrics, standardAdditionalAccountingMetricFields);
// Note that there are several record schemas added here that use different sets of metrics for inputs.  This is because in some cases
//  the input records have different sets of metrics, though in other cases they do not.


//
//   p r o c e s s _ s v c _ c o m p l e t e _ s e r v i c e _ i n g r e s s _ p a c k e t _ o c t e t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//


function process_svc_complete_service_ingress_packet_octets(record)
{
	if (sam_server_version >= 8)
    {
		if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
        {
			process_complete_service_ingress_for_mss(record);
        }
    }

	var subelement;
	var myId ;	
	var _key ;
	
	//We are processing the metrics on a per-queue basis, though they come in for access interfaces

	//set_app_logging(true, 4);
	
	//On 7210 device, queueId will be null as it did not have any value on queueId. If queueId is undefined then it will skipped
	//service.ServiceIngressOctetsLogRecord and service.ServiceIngressPacketsLogRecord returning 7210 queueId as null
	//logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "before myId");

	//subelement = LOOKUP.get(record.monitoredObjectPointer.toString()+"-accessIngress-"+record.queueId);
	//logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "after myId");
	
	var ingressServiceQueueId = record.queueId;
    if(isUndef(ingressServiceQueueId))
    {
    	logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "Skipping null queueId");
	    return;
    }
    else
    {
    	
        logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "before myId");

	    var tmp = record.monitoredObjectPointer.toString();  
	    //logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress array :: ", sapLagMop[1]);
	    logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress tmp value :: ", tmp);
	    
	    var lagId = sapLagMop.get(tmp);
	    logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress lagId value :: ", lagId);
	    
	    if(isDef(lagId)){
	    	_key = record.monitoredObjectPointer.toString()+"-accessIngress-"+record.portId+"-"+record.queueId;
	    }else{
	    	_key = record.monitoredObjectPointer.toString()+"-accessIngress-"+record.queueId;
	    }
    	
	    logP4Msg("process_svc_complete_service_ingress_packet_octets", "DEBUG", "_key -> " + _key);
		//subelement = LOOKUP.get(record.monitoredObjectPointer.toString()+"-accessIngress-"+record.queueId);
	    subelement = LOOKUP.get(_key);
		logP4Msg("process_svc_complete_service_ingress_packet_octets", "DEBUG", "subelement -> " + subelement);
    }	


	if(subelement == null)
	{
		logP5Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "Skipping 0 rid for --> "+ _key);
		return;
	}
	
	myId = subelement.id;
	logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "ENTERING for --> "+ _key + " with id == " + myId + " and timestamp " + record.timestamp);
	
	for(var i = 0; i < svcCompleteServiceIngressMetrics.length; i++)
	{
		//var key = svcCompleteServiceIngressMetrics[i]+"  "+record[svcCompleteServiceIngressMetrics[i]];
		//logP5Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "key = "+ key);
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceIngressPacketOctets~" + svcCompleteServiceIngressMetrics[i];
		//theMetric.rid = myId;		
		var value = parseInt(record[svcCompleteServiceIngressMetrics[i]]);

		// Check for null/undefined is in case we don't get one of the metrics we expect.  This can 
		// happen specifically in the case of a HSMDA interface, as they do not support all the regular 
		// accounting metrics.
		if (!(value == null || isNaN(value))) 
		{
            //theMetric.value = value;
		    //OPERATOR.addMetric(theMetric);
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceIngressPacketOctets~", svcCompleteServiceIngressMetrics[i]);
        }
	}
	logP4Msg("process_svc_complete_service_ingress_packet_octets", "SAMUBA_svc_complete_service_ingress", "LEAVING");
}

function process_complete_service_ingress_for_mss(record)
{
    //var theMetric;
    var myId;    

    /*
     * sample for record.monitoredObjectPointer
     * svc-mgr:service-55:10.1.241.75:interface-1/1/6-inner-tag-626-outer-tag-626
     */
    
    var port                = 'Port '+record.monitoredObjectPointer.split('-')[3];
    var mss_complete_map_id = 'mss-'+record.monitoredObjectSiteName+'-'+record.monitoredObjectSiteId+'-'+port;
    logP5Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "mss_complete_map_id --> "+ mss_complete_map_id);
    
    var subelement          = LOOKUP.get(mss_complete_map_id);
    if(subelement == null)
    {
        logP5Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "Skipping 0 rid for --> "+ mss_complete_map_id);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "ENTERING for --> "+ mss_complete_map_id + " with id == " + myId + " and timestamp " + record.timestamp);

    for(var i = 0; i < svc_complete_service_ingress_metrics_for_mss.length; i++)
    {
        //logP4Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "going to add metric "+svc_complete_service_ingress_metrics_for_mss[i]);

        //theMetric      = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
        //theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceIngressPacketOctets~" + svc_complete_service_ingress_metrics_for_mss[i];
        //theMetric.rid  = myId;

        var value = parseInt(record[svc_complete_service_ingress_metrics_for_mss[i]]);

        //logP4Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "add metric "+svc_complete_service_ingress_metrics_for_mss[i]+" value " + value);

        if (!(value == null || isNaN(value)))
        {
            //theMetric.value = value;
            //OPERATOR.addMetric(theMetric);
            //logP4Msg("process_complete_service_ingress_for_mss", "SAMUBA_svc_complete_service_ingress", "add metric "+svc_complete_service_ingress_metrics_for_mss[i]+" value " + value);
            CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceIngressPacketOctets~", svc_complete_service_ingress_metrics_for_mss[i]);
        }
    }
}
