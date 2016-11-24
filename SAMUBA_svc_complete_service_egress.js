// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var fileEgressMetrics = {};

//var schema_svc_complete_service_egress = createSAMUBASchema("SAM_svc_complete_service_egress", 900, 3, 2);
//schema_svc_complete_service_egress.multiFileJoin = true;
//schema_svc_complete_service_egress.noNewInputLimit = 2;
//schema_svc_complete_service_egress = addSAMUBARecordSchema(schema_svc_complete_service_egress, "CompleteServiceEgressPacketOctetsLogRecord", "service.CompleteServiceEgressPacketOctetsLogRecord", completeServiceEgressPacketOctetsMetrics, standardAdditionalAccountingMetricFields);
//schema_svc_complete_service_egress = addSAMUBARecordSchema(schema_svc_complete_service_egress, "ServiceEgressOctetsLogRecord", "service.ServiceEgressOctetsLogRecord", serviceEgressOctetMetrics, standardAdditionalAccountingMetricFields);
//schema_svc_complete_service_egress = addSAMUBARecordSchema(schema_svc_complete_service_egress, "ServiceEgressPacketsLogRecord", "service.ServiceEgressPacketsLogRecord", serviceEgressPacketMetrics, standardAdditionalAccountingMetricFields);

//
//   p r o c e s s _ s v c _ c o m p l e t e _ s e r v i c e _ e g r e s s _ p a c k e t _ o c t e t s
//...............................................................................................
// funtion to loop over the name defined above and create a metric object for each entry
//

//Function below is not used anywhere.
/*
function flushFileEgressMetrics(modelInterface)
{
    var theMetric;
    var answer;
    for( var i in fileEgressMetrics )
    {
            logP5Msg("flushEgressfileEgressMetrics", "SAMUBA_svc_complete_service_egress", i);
            theMetric = modelInterface.FloatMetric();
            logP5Msg("flushEgressfileEgressMetrics", "SAMUBA_svc_complete_service_egress",  fileEgressMetrics[i]["name"]);
            theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceEgressPacketOctets~" + fileEgressMetrics[i]["name"];
            theMetric.rid = fileEgressMetrics[i]["rid"];
            theMetric.timestamp = fileEgressMetrics[i]["timestamp"];
            answer = fileEgressMetrics[i]["value"].toString();
            logP5Msg("flushEgressfileEgressMetrics", "SAMUBA_svc_complete_service_egress", answer);
            theMetric.value = answer;
            modelInterface.addMetric(theMetric);
    }
}
*/

function process_svc_complete_service_egress_packet_octets(record)
{
	if (sam_server_version >= 8)//Defined within SAMUBAAccounting.js
	{
    	if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
    	{
    		process_complete_service_egress_for_mss(record);
    	}
	}

    var myId;    
    var subelement;
    var _idMap;

    //On 7210 device, queueId will be null as it did not have any value on queueId. If queueId is undefined then it will skipped
    //service.ServiceIngressOctetsLogRecord and service.ServiceIngressPacketsLogRecord returning 7210 queueId as null
    //var subelement = LOOKUP.get(record.monitoredObjectPointer.toString()+"-accessEgress-"+record.queueId);
	

    var egressServiceQueueId = record.queueId;
    if(isUndef(egressServiceQueueId))
    {
	    logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "Skipping null queueId");
	    return;
    }
    else
    {
	    logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "before myId");

	    //Below are the changes needed for SAM find2file 2.12.2.0 pack
	    var tmp = record.monitoredObjectPointer.toString(); 
	    //logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress array :: ", sapLagMop[tmp]);
	    logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress tmp value :: ", tmp);
	    
	    var lagId = sapLagMop.get(tmp);  	
	    logP4Msg("sapLagMopTest", "SAMUBA_svc_complete_service_ingress lagId value :: ", lagId);
	    
	    if(isDef(lagId)){
	    	_idMap = record.monitoredObjectPointer.toString()+"-accessEgress-"+record.portId+"-"+record.queueId;
	    }else{
	    	_idMap = record.monitoredObjectPointer.toString()+"-accessEgress-"+record.queueId;
	    }
    	    	
    	//_idMap = record.monitoredObjectPointer.toString()+"-accessEgress-"+record.queueId;
	    logP4Msg("process_svc_complete_service_egress_packet_octets", "DEBUG", "_idMap -> " + _idMap);
	    subelement = LOOKUP.get(_idMap);
	    logP4Msg("process_svc_complete_service_egress_packet_octets", "DEBUG", "subelement -> " + subelement);
    }	
    

    // We are processing the metrics on a per-queue basis, though they come in for access interfaces
    //record.monitoredObjectPointer
    //logP5Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "record.monitoredObjectPointer --> "+ record.monitoredObjectPointer);
    if(subelement == null)
    {
        logP5Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "Skipping 0 rid for --> "+ _idMap);
        return;
    }
    
    myId = subelement.id;
    logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "ENTERING for --> "+ _idMap + " with id == " + myId + " and timestamp " + record.timestamp);

    for(var i = 0; i < svcCompleteServiceEgressMetrics.length; i++)
    {
        //theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "before name");
        //theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceEgressPacketOctets~" + svcCompleteServiceEgressMetrics[i];
        //logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "before rid");
        //theMetric.rid = myId;
        var value = parseInt(record[svcCompleteServiceEgressMetrics[i]]);
        //logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "before timestamp");      
        //logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "before value");

        // Check for null/undefined is in case we don't get one of the metrics we expect.  This can 
        // happen specifically in the case of a HSMDA interface, as they do not support all the regular 
        // accounting metrics.
        if (!(value == null || isNaN(value))) 
        {
        	//theMetric.value = value;
            //OPERATOR.addMetric(theMetric);
        	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceEgressPacketOctets~", svcCompleteServiceEgressMetrics[i]);
        }
    }
    
    logP4Msg("process_svc_complete_service_egress_packet_octets", "SAMUBA_svc_complete_service_egress", "LEAVING");
}

function process_complete_service_egress_for_mss(record)
{
    var myId;    

    /*
     * sample for record.monitoredObjectPointer
     * svc-mgr:service-55:10.1.241.75:interface-(1/1/6)-inner-tag-626-outer-tag-626
     */
    
    var port                = 'Port '+record.monitoredObjectPointer.split('-')[3];
    var mss_complete_map_id = 'mss-'+record.monitoredObjectSiteName+'-'+record.monitoredObjectSiteId+'-'+port;
    logP5Msg("process_complete_service_egress_for_mss", "SAMUBA_svc_complete_service_egress", "mss_complete_map_id --> "+ mss_complete_map_id);
   
    var subelement          = LOOKUP.get(mss_complete_map_id);
    if(subelement == null)
    {
       logP5Msg("process_complete_service_egress_for_mss", "SAMUBA_svc_complete_service_egress", "Skipping 0 rid for --> "+ mss_complete_map_id);
        return;
    }

    myId = subelement.id;
    logP4Msg("process_complete_service_egress_for_mss", "SAMUBA_svc_complete_service_egress", "ENTERING for --> "+ mss_complete_map_id + " with id == " + myId + " and timestamp " + record.timestamp);

    for(var i = 0; i < svc_complete_service_egress_metrics_for_mss.length; i++)
    {
        //theMetric      = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
        //theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceEgressPacketOctets~" + svc_complete_service_egress_metrics_for_mss[i];
        //theMetric.rid  = myId;

        var value = parseInt(record[svc_complete_service_egress_metrics_for_mss[i]]);

        if (!(value == null || isNaN(value)))
        {
            //theMetric.value = value;
            //OPERATOR.addMetric(theMetric);
            //logP4Msg("process_complete_service_egress_for_mss", "SAMUBA_svc_complete_service_egress", "add metric "+svc_complete_service_egress_metrics_for_mss[i]+" value " + value);
        	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svc~CompleteServiceEgressPacketOctets~", svc_complete_service_egress_metrics_for_mss[i]);
        }
    }
}

