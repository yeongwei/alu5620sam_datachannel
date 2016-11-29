// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


//   p r o c e s s _ n a t _ p o o l _ l s n s t a t s _ l o g _ r e c o r d
//...............................................................................................
//

function process_nat_pool_lsnstats_log_record(record) {
	var subelement = LOOKUP.get(record.monitoredObjectPointer.toString()); 
	if(subelement == null) {
		logP3Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "Skipping 0 rid for --> "+ record.monitoredObjectPointer.toString());
		return;
	}
	
	var myId = subelement.id;    
	logP4Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "ENTERING for --> " + " with id == " + myId);
	
	subelement.addProperty("samSiteName", record.monitoredObjectSiteName);
	if (isConfig("inv_uses_names")) {
		subelement.label = record.monitoredObjectSiteName +"_"+ record.monitoredObjectPointer;
	}
	
    	for (var i = 0; i < natPoolLsnStatsLogRecordMetrics.length; i++) {
    		metric=natPoolLsnStatsLogRecordMetrics[i];
    		className="NatPoolLsnStats";
    		logP4Msg("process_nat_pool_lsnstats_log_record", "SAMUBA_NatPoolLsnStatsLogRecord", "className: " + className + "metric: " + metric);
    		CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~nat~"+className+"~", metric); 
	}
	subelement.timestamp = ParseTimestamp(record.timeCaptured);
	OPERATOR.addSubelement(subelement);
}
