// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//var schema_ppp_interface = createSAMUBASchema("SAM_ppp_interface", 900, 3);
//schema_ppp_interface = addSAMUBARecordSchema(schema_ppp_interface, "PppStatsLogRecord", "ppp.PppStatsLogRecord", pppInterfaceStatMetrics, standardAdditionalPolledMetricFields);


//
//   p r o c e s s _ p p p _ I n t e r f a c e S t a t s
//...............................................................................................
//
// function to loop over the name defined above and create a metric object for each entry
//

function process_ppp_InterfaceStats(record)
{
    var myId;
    var subelement = LOOKUP.get(record.monitoredObjectPointer);	
	
    if(subelement == null)
    {
	    logP5Msg("ppp_InterfaceStats", "SAMUBA_ppp_interface", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
	    return;
    }

    myId = subelement.id;  
    logP4Msg("ppp_InterfaceStats", "SAMUBA_ppp_interface", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);

    for(var i = 0; i < pppInterfaceStatMetrics.length; i++)
    {
    	/*
	    theMetric = OPERATOR.FloatMetric();
		theMetric.timestamp = record.timestamp;
	    theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~ppp~PppInterfaceStats~" + pppInterfaceStatMetrics[i];
	    theMetric.rid = myId;
	    logP5Msg("ppp_InterfaceStats", "SAMUBA_ppp_interface", "Metric --> " + pppInterfaceStatMetrics[i] + "=" + record[pppInterfaceStatMetrics[i]]);
	    theMetric.value = record[pppInterfaceStatMetrics[i]];
	    OPERATOR.addMetric(theMetric);
	    */
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~ppp~PppInterfaceStats~", pppInterfaceStatMetrics[i]);
    }
    
    logP4Msg("process_ppp_InterfaceStats", "SAMUBA_ppp_interface", "LEAVING");
}
