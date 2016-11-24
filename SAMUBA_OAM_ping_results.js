// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
// var sam_server_version         = app_config_value("SAM_SERVER_VERSION");
// var sam_server_release_version = app_config_value("SAM_SERVER_RELEASE_VERSION");

// var load_sam_8_class_immediately = false;

// if (sam_server_version > 8)
// {
    // load_sam_8_class_immediately = true;
// }


// var schema_oam_ping = createSAMUBASchema("SAM_oam_ping_results", 900, 3);
// schema_oam_ping.multiFileJoin = true;
// schema_oam_ping.noNewInputLimit = 2;
// schema_oam_ping = addSAMUBARecordSchema(schema_oam_ping, "SamIcmpPingResults", "icmp.IcmpPingResult", oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields);
// schema_oam_ping = addSAMUBARecordSchema(schema_oam_ping, "SamMplsPingResults", "mpls.LspPingResult", oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields);
// schema_oam_ping = addSAMUBARecordSchema(schema_oam_ping, "SamTunnelPingResults", "svt.TunnelPingResult", oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields);
// schema_oam_ping = addSAMUBARecordSchema(schema_oam_ping, "SamVccvPingResults", "svt.VccvPingResult", oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields);
// schema_oam_ping = addSAMUBARecordSchema(schema_oam_ping, "SamSitePingResults", "service.SitePingResult", oamPingMetricsForFilter, standardAdditionalOAMTestMetricFields);



// if (sam_server_version >= 8)
// {
    // if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
    // {
		// schema_oam_ping = addSAMUBARecordSchema
		// (
			// schema_oam_ping,
			// "CfmLoopbackResult",
			// "ethernetoam.CfmLoopbackResult",
			// oamPingMetricsForFilter.concat(additional_ping_test_metrics),
			// standardAdditionalOAMTestMetricFields
		// );
		// schema_oam_ping = addSAMUBARecordSchema
		// (
			// schema_oam_ping,
			// "CfmTwoWayDelayTestResult",
			// "ethernetoam.CfmTwoWayDelayTestResult",
			// oamPingMetricsForFilter.concat(additional_ping_test_metrics).concat(cfmTwoWayDelayMetrics),
			// standardAdditionalOAMTestMetricFields
		// );
	// }
// }

// The various record schemas are all using the same inputs for metrics because all of the input records have basically the
// same standard metrics in each case. 


//
//                p r o c e s s _ o a m _ p i n g _ r e s u l t s _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//
function process_oam_ping_results_stats(record)
{
    var theMetric;
    var myId;
	//var cfm_loopback_resource;
    var subelement = LOOKUP.get(record.test);

    logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping", "ENTERING");

    if(subelement == null)	
    {
		logP5Msg("process_oam_ping_stats", "SAMUBA_oam_ping", "Skipping 0 rid for --> "+ record.test);
		return;
	}
	
	//Included additional ping test metric for cfm loopback
	//cfm_test_object_resource = subelement.split(':')[3].split('-')[1];
	cfm_test_object_resource = record.test.split(':')[3].split('-')[1];
	logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping_loopback", "ENTERING" + cfm_test_object_resource);

	if(cfm_test_object_resource == 'loopback')
	{ 
		process_additional_oam_ping_results_for_loopback(record);
	}
	else if(cfm_test_object_resource == 'twoWayDlyTest')
	{
		process_additional_oam_ping_results_for_two_way(record);
	}
	
	myId = subelement.id;  
    logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping", "ENTERING for --> "+ record.test + " with id == " + myId);
	
    for(var i in oamPingMetrics)
	{
		if (isDef(record[i])) 
		{
			logP5Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "adding metric " + i.toString() +" to SE " + record.test + " with id == " + myId);
			/*
			//Add responseTime as a metric only if no loss is indicated.  Otherwise it is the timeout time.
	  		if ((i == "responseTime") && (record["lossIndicator"] == 1))
	      	{
		  		logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping", "loss -- continuing: ");
		  		logStatus("lossIndicator", record["lossIndicator"]);
		  		logStatus("responseTime", record["lossIndicator"]);
		  		continue;
	      	}
			 */

			if (!isNaN(record[i]))  
			{
				theMetric = OPERATOR.FloatMetric();
				//Implement with timestamp lookup
				var _timestampName = null; 
				_timestampName = metricClassTimestampMapping[record["className"]];
				if(_timestampName != null)
				{
					logP5Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "FOUND _timestampName -> " + _timestampName);
					_timestampValue = record[_timestampName];
					logP5Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "FOUND _timestampValue -> " + _timestampValue);
					theMetric.timestamp = ParseTimestamp(_timestampValue);

				}
				else
				{	
					logP5Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "Using record.timestamp -> " + record.timestamp);
					theMetric.timestamp = record.timestamp;
				}
				
				theMetric.name = "AP~Generic~Latency~" + oamPingMetrics[i];
				theMetric.rid = myId;
				
				switch(oamPingMetrics[i])
				{
					case "One Way~Inbound (ms) (avg)":	
					case "One Way~Outbound (ms) (avg)":
					case "Round Trip~RTT (ms) (avg)":
					case "Jitter~Inbound Jitter (ms) (avg)":
					case "Jitter~Outbound Jitter (ms) (avg)":
					case "Jitter~Jitter (ms) (avg)":
						var value = record[i] / 1000;
						theMetric.value = value;
					break;
					
					default:
						theMetric.value = record[i];
				}
				
				
				//theMetric.value = record[i];//**
				OPERATOR.addMetric(theMetric);
				//logP4Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "added metric " + i.toString() +"to SE" + record.test + " with id == " + myId);
			} 
			else 
			{
				logP5Msg("process_OAM_ping_results_stats", "SAMUBA_OAM_ping_results", "Skipping field " + i.toString() + " -- NaN");
			}
		}
	}
}

/*
 * 08 April 2013: This is only for LoopBack
 */
function process_additional_oam_ping_results_for_loopback(record)
{
	//var theMetric;
	var myId;
	var subelement = LOOKUP.get(record.test);

	myId = subelement.id;  
    logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping_loopback", "ENTERING for --> "+ record.test + " with id == " + myId);
	
	for(var i = 0; i < additional_ping_test_metrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~PingTests~" + additional_ping_test_metrics[i];;
		//theMetric.rid = myId;
		//logP4Msg("process_OAM_ping_results_stats", "SAMUBA_oam_ping_loopback", "Metric value " + theMetric.name + " = " + value);
		var value = parseInt(record[additional_ping_test_metrics[i]]);
		
		if (!(value == null || isNaN(value))) 
		{
			//theMetric.value = value;
			//OPERATOR.addMetric(theMetric);
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~PingTests~", additional_ping_test_metrics[i]);
		}
	}

}

/*
 * 08 April 2013: This is only for TwoWay
 */
function process_additional_oam_ping_results_for_two_way(record)
{
	//var theMetric;
	var myId;
	var subelement = LOOKUP.get(record.test);

	myId = subelement.id;  
    logP4Msg("process_oam_ping_stats", "SAMUBA_oam_ping_two_way", "ENTERING for --> "+ record.test + " with id == " + myId);
	
	for(var i = 0; i < additional_ping_test_metrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~PingTests~" + additional_ping_test_metrics[i];
		//theMetric.rid = myId;
		var value = parseInt(record[additional_ping_test_metrics[i]]);
		//logP4Msg("process_OAM_ping_results_stats", "SAMUBA_oam_ping_two_way", "Metric value " + theMetric.name + " = " + value);
		
		if (!(value == null || isNaN(value))) 
		{
			//theMetric.value = value;
			//OPERATOR.addMetric(theMetric);
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~PingTests~", additional_ping_test_metrics[i]);
		}
	}
	
	for(var i = 0; i < cfmTwoWayDelayMetrics.length; i++)
	{
		//theMetric = OPERATOR.FloatMetric();
		//theMetric.timestamp = record.timestamp;
		//theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmTwoWayDelayTestResult~" + cfmTwoWayDelayMetrics[i];
		//theMetric.rid = myId;
        var value = parseInt(record[cfmTwoWayDelayMetrics[i]]);
        //logP4Msg("process_OAM_ping_results_stats", "SAMUBA_oam_ping_two_way", "Metric value " + theMetric.name + " = " + value);

		if (!(value == null || isNaN(value))) 
		{
		     //theMetric.value = value;
		     //OPERATOR.addMetric(theMetric);
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ethernetoam~CfmTwoWayDelayTestResult~", cfmTwoWayDelayMetrics[i]);
		}
	}
}

