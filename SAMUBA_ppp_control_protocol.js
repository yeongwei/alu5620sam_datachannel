// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMUBA_ppp_control_protocol.js - Processes the inventory of ppp.pppControlProtocol as metrics
//


// var schema_ppp_control_protocol = createSAMUBASchema("SAM_ppp_control_protocol", 900, 4);
// schema_ppp_control_protocol = addSAMUBARecordSchema(schema_ppp_control_protocol, "pppControlProtocol", "ppp.PppControlProtocol", pppControlProtocolPseudoMetrics, standardAdditionalPseudoMetricFields);

// function to loop over the name defined above and create a metric object for each entry
//

function process_ppp_control_protocol_stats(record)
{
    var myId;
	var subelement;
	//var timestamp = lastCpuTime[record.siteId];
	
	logP4Msg("process_ppp_control_protocol_stats", "SAMUBA_ppp_control_protocol_stats", "ENTERING");  
	
	subelement = LOOKUP.get(record.objectFullName);
	if(subelement == null)
	{
		logP4Msg("process_ppp_control_protocol_stats", "SAMUBA_ppp_control_protocol_stats", "Skipping 0 rid for --> "+ record.objectFullName);
		return;
	}
	myId = subelement.id;    

	logP4Msg("process_ppp_control_protocol_stats", "SAMUBA_ppp_control_protocol_stats", "ENTERING for --> " + " with id == " + myId);
    for(var i = 0; i < pppControlProtocolPseudoMetrics.length; i++)
	{
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ppp~PppControlProtocol~" + pppControlProtocolPseudoMetrics[i];
		logP4Msg("process_ppp_control_protocol_stats", "SAMUBA_ppp_control_protocol_stats", "Inside for --> "+ theMetric.name);
	    theMetric.rid = myId;
	    theMetric.value = record[pppControlProtocolPseudoMetrics[i]];
	    OPERATOR.addMetric(theMetric);
    	 */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ppp~PppControlProtocol~", pppControlProtocolPseudoMetrics[i]);
	}
		
	logP4Msg("process_ppp_control_protocol_stats", "SAMUBA_ppp_control_protocol_stats", "LEAVING");
}
