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

function process_ltemme_MAFConnection(record)
{
	var myId;		
	var subelement = LOOKUP.get(record.monitoredObjectPointer);  
	
	if(subelement == null)
	{
		logP5Msg("process_ltemme_MAFConnection", "SAMUBA_ltemme_MAFConnection", "Skipping 0 rid for --> "+ record.monitoredObjectPointer);
		return;
	}
	myId = subelement.id;
    logP4Msg("process_ltemme_MAFConnection", "SAMUBA_ltemme_MAFConnection", "ENTERING for --> "+ record.monitoredObjectPointer + " with id == " + myId);
    
	for(var i in MAFConnectionMetrics)
	{
	    var value = parseInt(record[MAFConnectionMetrics[i]]);	
	    if (!(value == null || isNaN(value))) {
		    CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~lteepc~MME~MMEFunction~", MAFConnectionMetrics[i]);  
         }
	}
	logP4Msg("process_ltemme_MAFConnection", "SAMUBA_ltemme_MAFConnection", "LEAVING");
}
