// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//...............................................................................................
//        p r o c e s s _ l t e _ m e t r i c s 
//...............................................................................................
//

function process_lte_S8AgwPeer_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_lte_S8AgwPeer_stats", "SAMUBA_lte_S8AgwPeer_stats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_lte_S8AgwPeer_stats", "SAMUBA_lte_S8AgwPeer_stats", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in S8AgwPeerStatsMetrics)
	{
	    var value = parseInt(record[S8AgwPeerStatsMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~lteepc~AGW~S8PeerStats~", S8AgwPeerStatsMetrics[i]);  
         }
	}
	logP4Msg("process_lte_S8AgwPeer_stats", "SAMUBA_lte_S8AgwPeer_stats", "LEAVING");
}
