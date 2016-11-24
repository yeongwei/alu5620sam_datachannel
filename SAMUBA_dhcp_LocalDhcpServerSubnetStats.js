// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2005, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMUBA_equipment_hw_environment.js - Processes the inventory of equipment.HwEnvironment as metrics
//

//var schema_dhcp_localDhcpServerSubnetStats = createSAMUBASchema("SAM_dhcp_localDhcpServerSubnetStats", 900, 4);
//// Precedence is 4 so it will be done right after the cpu metrics are processed
//schema_dhcp_localDhcpServerSubnetStats = addSAMUBARecordSchema(schema_dhcp_localDhcpServerSubnetStats, "LocalDhcpServerSubnetStatsLogRecord", "dhcp.LocalDhcpServerSubnetStatsLogRecord", localDhcpServerSubnetStatsMetrics, standardAdditionalPolledMetricFields);


//
//   p r o c e s s _ e q u i p m e n t _ H w E n v i r o n m e n t
//...............................................................................................
// function to loop over the name defined above and create a metric object for each entry
//

function process_dhcp_localDhcpServerSubnetStats(record)
{
    var myId;
	var subelement;
	
	var temp = record.monitoredObjectPointer;
    if (temp.length > 140 ){
		record.monitoredObjectPointer = temp.slice(8);
	}
	
	logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats", "ENTERING");   	
	logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats ---> ",  record.monitoredObjectPointer);
	subelement = LOOKUP.get(record.monitoredObjectPointer.toString());
	if(subelement == null)
	{
		logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats", "SUBELEMENT is Identified --> " );
	myId = subelement.id;    

	logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats", "ENTERING for --> " + " with id == " + myId);
    for(var i = 0; i < localDhcpServerSubnetStatsMetrics.length; i++)
	{
    	CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~dhcp~LocalDhcpServerSubnetStats~", localDhcpServerSubnetStatsMetrics[i]);
    	
    }
	
	logP4Msg("process_dhcp_localDhcpServerSubnetStats", "SAMUBA_dhcp_localDhcpServerSubnetStats", "LEAVING");
}
