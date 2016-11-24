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

function process_lte_S5AgwPeer_stats(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_lte_S5AgwPeer_stats", "SAMUBA_lte_S5AgwPeerStats", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_lte_S5AgwPeer_stats", "SAMUBA_lte_S5AgwPeerStats", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in S5AgwPeerStatsMinMetrics)
	{
	    var value = parseInt(record[S5AgwPeerStatsMinMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~lteepc~AGW~S5PeerStats~", S5AgwPeerStatsMinMetrics[i]);  
         }
	}
	logP4Msg("process_lte_S5AgwPeer_stats", "SAMUBA_lte_S5AgwPeerStats", "LEAVING");
}
