// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_sdp_binding_base = createSAMUBASchema("SAM_sdp_binding_base", 900, 3);
//schema_sdp_binding_base = addSAMUBARecordSchema(schema_sdp_binding_base, "SdpBindingBaseStatsLogRecord", "svt.SdpBindingBaseStatsLogRecord", sdpBindingMetrics, standardAdditionalPolledMetricFields);



//
//         p r o c e s s _ s d p _ b i n d i n g _ b a s e _ s t a t s
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

  function process_sdp_binding_base(record)
  {
	var myId;	
	var subelement = LOOKUP.get(record.monitoredObjectPointer);
	if(subelement == null)
	{
		logP5Msg("process_sdp_binding_base_stats", "SAMUBA_sdp_binding_base", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	
	myId = subelement.id;	
	logP4Msg("process_sdp_binding_base_stats", "SAMUBA_sdp_binding_base", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
	
	for(var i = 0; i < sdpBindingMetrics.length; i++)
	{
		/*
		theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
		theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~svt~SdpBindingBaseStats~" + sdpBindingMetrics[i];
		theMetric.rid = myId;		
		theMetric.value = record[sdpBindingMetrics[i]];
		OPERATOR.addMetric(theMetric);
		*/
		CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~svt~SdpBindingBaseStats~", sdpBindingMetrics[i]);
	}
  }

