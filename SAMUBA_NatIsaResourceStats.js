// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2005, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

function process_nat_isa_resource_stats(record) {
	var functionName = "process_nat_isa_resource_stats";
	var fileName = "SAMUBA_NatIsaResourceStats";
	var myId;
	var subelement;
	
	logP4Msg(functionName, fileName, "ENTERING");   	
	subelement = LOOKUP.get(record.monitoredObjectPointer);
	if (subelement == null) {
		logP4Msg(functionName, fileName, "Skipping 0 rid for --> " + record.monitoredObjectPointer);
		return;
	}

	myId = subelement.id;    
	logP4Msg(functionName, fileName, "ENTERING for --> " + " with id == " + myId);
	for (var i = 0; i < natIsaResourceStatsMetrics.length; i++) {
		if (record[natIsaResourceStatsMetrics[i]]) {
			if (natIsaResourceStatsMetrics[i] == "statsName") {
				subelement.addProperty("samStatsName", record[natIsaResourceStatsMetrics[i]]);
			} else {
				CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~IsaResources~", natIsaResourceStatsMetrics[i]);
			}
		} else {
			logP4Msg(functionName, fileName, "Metrics not found: " + natIsaResourceStatsMetrics[i]);
		}
 	}
	
	logP4Msg(functionName, fileName, "LEAVING");
}
