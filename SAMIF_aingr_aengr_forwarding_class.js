// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

/*
This file handles all the fcs in cases where you have a policy/fc/queue set of objects that are then triggered by another 
object (SAP, physical port) to create a SE made from the composite of the objects.  It doesn't just handle the aingr/aengr
objects; the file naming is an artifact of the earlier version which only handled the aingr/aengr objects.
*/


var aingr_forwarding_class_Name = {
"samCir":"cir",
"samCirAdaptation":"cirAdaptation",
"samCirLevel":"cirLevel",
"samCirWeight":"cirWeight",
"samCommittedBurstSize":"committedBurstSize",
"samContainingPolicyDisplayedName":"containingPolicyDisplayedName",
"samContainingPolicyId":"containingPolicyId",
"samDeploymentState":"deploymentState",
"samDescription":"description",
"samDisplayedName":"displayedName",
"samExpedite":"expedite",
"samGlobalPolicy":"globalPolicy",
"samHighPriorityReserved":"highPriorityReserved",
"samId":"id",
"samIsLocal":"isLocal",
"samLevel":"level",
"samMaximumBurstSize":"maximumBurstSize",
"samMode":"mode",
"samMulticast":"multicast",
"samMultipoint":"multipoint",
"samName":"name",
"samObjectFullName":"objectFullName",
"samPir":"pir",
"samPirAdaptation":"pirAdaptation",
"samPoliced":"policed",
"samPolicyType":"policyType",
"samScheduler":"scheduler",
"samSelfAlarmed":"selfAlarmed",
"samSiteId":"siteId",
"samSiteName":"siteName",
"samWeight":"weight"
};

// from service access interface:  var castarray = {1:"unicast", 2:"multicast", 3:"broadcast", 4:"othercast", 5:"defaultcast"};

var fc_queue_properties = {
		"queueId":"unicast", 
		"multicastQueueId":"multicast", 
		"broadcastQueueId":"broadcast", 
		"unknownQueueId":"othercast", 
		"meterId":"unicast", 
		"multicastMeterId":"multicast", 
		"broadcastMeterId":"broadcast", 
		"unknownMeterId":"othercast"};

//  We are not tracking changes in these properties except by explicit handling
//
//for( var i in aingr_forwarding_class_Name)
//{
//	MasterPropertyMap[i] = aingr_forwarding_class_Name[i];
//}

function process_aingr_aengr_forwarding_class(samObject, modelInterface, classname)
{
    logP4Msg("aingr_aengr_forwarding_class", "SAMIF", "entered");

    //var element;
    //var subelement;

	var classkey;
	//var i;
	var obj;
	var someQueues = false;
	var policy_field;

	logStatus("samObject.policyType", samObject.policyType);
	logStatus("samObject.containingPolicyId", samObject.containingPolicyId);
	logStatus("samObject.siteId", samObject.siteId);
	logStatus("samObject.forwardingClass", samObject.forwardingClass);
	logStatus("classname", classname);

	nilStatus("fcQByType", fcQByType);

    policy_field=fc_map_field(classname);//05 April 2013: Return "containingPolicyId" or "containingPolicyDisplayedName"

	logStatus("policy_field", policy_field);

	if (isUndef(policy_field)) 
	{
	    return;
	}

	if (isUndef(samObject.policyType) | isUndef(samObject[policy_field]) | isUndef(samObject.forwardingClass) | isUndef(samObject.siteId)) 
	{
	    logP0Msg("aingr_aengr_forwarding_class", "SAMIF", "not defined");
	}
	else	
	{
	    if (samObject.siteId != "0.0.0.0")// checking for local FC, not global
	    {   
	    	classkey = samObject.policyType+"-"+samObject[policy_field]+"-"+samObject.siteId;
	    	fc = samObject.forwardingClass;
		
	    	logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "processing classkey "+classkey+" with forwardingclass '"+fc+"'");
	    	
	    	logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "before queueId");
	    	obj=checkFCTrafficType(samObject, "unicast", classkey);
	    	if (isDef(obj)) 
	    	{
	    		if (isUndef(fc_key_map[samObject.objectFullName])) 
	    		{
	    			//we have not processed this yet, so we should count it
	    			//obj[fc] = cIncr(obj[fc]);
	    			obj[fc] = 1;
	    		}
		    
	    		(// added this line to nest this function to get around 256 limit
	    				function () 
	    				{                                   
	    					logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "after forwarding class");
	    					obj.fc_id = samObject.id;
	    					obj.fc_objectFullName = samObject.objectFullName;
	    					obj.unicast = true;	
	    					obj.fc_set=true;
	    					logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "before queue_set test");
	    				}
	    		)();// This closes the unnamed nested function
		    
	    		if (obj.queue_set == true) 
	    		{
	    			someQueues = true;
	    		}
	    		logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "after queue_set test");
	    	}
		
	    	logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "before multicastQueueId");
	    	obj=checkFCTrafficType(samObject, "multicast", classkey);
	    	if (isDef(obj)) 
	    	{
	    		if (isUndef(fc_key_map[samObject.objectFullName])) 
	    		{
	    			//we have not processed this yet, so we should count it
	    			//obj[fc] = cIncr(obj[fc]);
	    			obj[fc] = 1;
	    		}
		    
	    		(//added this line to nest this function to get around 256 limit 
	    			function () 
	    			{                                  
	    				obj.fc_id = samObject.id;
	    				obj.fc_objectFullName = samObject.objectFullName;
	    				obj.multicast = true;
	    				obj.fc_set=true;
	    			}
	    		)();//This closes the unnamed nested function
		    
	    		if (obj.queue_set == true) 
	    		{
	    			someQueues = true;
	    		}
	    	}
		
	    	logP6Msg("aingr_forwarding_class", "SAMIF", "before broadcastqueueId");
	    	obj=checkFCTrafficType(samObject, "broadcast", classkey);
	    	if (isDef(obj)) 
	    	{
	    		if (isUndef(fc_key_map[samObject.objectFullName])) 
	    		{
	    			//we have not processed this yet, so we should count it
	    			//obj[fc] = cIncr(obj[fc]);
	    			obj[fc] = 1;
	    		}
	    		
	    		(// added this line to nest this function to get around 256 limit 
	    			function () 
	    			{                                   
	    				obj.fc_id = samObject.id;
	    				obj.fc_objectFullName = samObject.objectFullName;
	    				obj.broadcast = true;
	    				obj.fc_set=true;
	    			}
	    		)();// This closes the unnamed nested function
	    		
	    		if (obj.queue_set == true) 
	    		{
	    			someQueues = true;
	    		}
	    	}
		
	    	logP6Msg("aingr_forwarding_class", "SAMIF", "before unknownqueueId");
	    	obj=checkFCTrafficType(samObject, "unknown", classkey);
	    	if (isDef(obj)) 
	    	{
	    		if (isUndef(fc_key_map[samObject.objectFullName])) 
	    		{
	    			// we have not processed this yet, so we should count it
	    			//					obj[fc] = cIncr(obj[fc]);
	    			obj[fc] = 1;
	    		}
	    		
	    		(//added this line to nest this function to get around 256 limit 
	    			function () 
	    			{                                   
	    				obj.fc_id = samObject.id;
	    				obj.fc_objectFullName = samObject.objectFullName;
	    				obj.othercast = true;
	    				obj.fc_set=true;
	    			}
	    		)();//This closes the unnamed nested function
		    
	    		if (obj.queue_set == true) 
	    		{
	    			someQueues = true;
	    		}
	    	}
		
	    	logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "before fc_key_map");
	    	if (isUndef(fc_key_map[samObject.objectFullName])) 
	    	{
	    		logP6Msg("aingr_aengr_forwarding_class", "SAMIF", "setting fc '"+fc+"' for object "+samObject.objectFullName+" classkey "+classkey);
	    		fc_key_map[samObject.objectFullName] = classkey;
	    		fc_fc_map[samObject.objectFullName] = fc;
	    	}
		
	    	//create subelements for queues with queues objects and access interfaces received earlier
	    	if (someQueues == true) 
	    	{
	    		process_stored_AccInt(classkey, modelInterface);
	    	}
	    }
	    else 
	    {
	    	logP6Msg("aingr_forwarding_class", "SAMIF", "skipping forwardingClass -- siteId is 0.0.0.0");
	    }
	    
	}//everything needed was defined
}

/*
 * 05 April 2013:
 * x[<class_key>].queueId = y;
 * x[<class_key>].multicastQueueId = z;
 * x[<class_key>].broadcastQueueId = w;
 */
function checkFCTrafficType(samObject, type, classkey) 
{
    var obj;

    switch(type) 
    {
    	case "unicast":
    		
    		if (isDef(samObject.queueId) && samObject.queueId != "0" && samObject.queueId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.queueId -> "+ samObject.queueId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.queueId);
    		}
    		
    		if (isDef(samObject.meterId) && samObject.meterId != "0" && samObject.meterId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.meterId"+ samObject.meterId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.meterId);
    		}
    		
    	break;
    	
    	case "multicast":
	
    		if (isDef(samObject.multicastQueueId) && samObject.multicastQueueId != "0" && samObject.multicastQueueId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.multicastQueueId"+ samObject.multicastQueueId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.multicastQueueId);
    		}
    		
    		if (isDef(samObject.multicastMeterId) && samObject.multicastMeterId != "0" && samObject.multicastMeterId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.multicastMeterId"+ samObject.multicastMeterId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.multicastMeterId);
    		}
    	
    	break;
    	
    	case "broadcast":
	
    		if (isDef(samObject.broadcastQueueId) && samObject.broadcastQueueId != "0" && samObject.broadcastQueueId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.broadcastQueueId"+ samObject.broadcastQueueId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.broadcastQueueId);
    		}
    		
    		if (isDef(samObject.broadcastMeterId) && samObject.broadcastMeterId != "0" && samObject.broadcastMeterId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.broadcastMeterId"+ samObject.broadcastMeterId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.broadcastMeterId);
    		}
    	
    	break;
    	
    	case "unknown":
    		
    		if (isDef(samObject.unknownQueueId) && samObject.unknownQueueId != "0" && samObject.unknownQueueId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.unknownQueueId"+ samObject.unknownQueueId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.unknownQueueId);
    		}
	
    		if (isDef(samObject.unknownMeterId) && samObject.unknownMeterId != "0" && samObject.unknownMeterId != "") 
    		{
    			logP4Msg("aingr_aengr_forwarding_class (checkFCTrafficType)", "SAMIF", "samObject.unknownMeterId"+ samObject.unknownMeterId);
    			obj=fcQByType.insertOrFindHashArrayEntry(classkey, samObject.unknownMeterId);
    		}
    	
    	break;
    	
    	default:
    		//Do nothing
    	break;
    }
    
    return obj;
}
    
function addDefaultFCQueue(policyType, policyId, nodeId, queueId) 
{
	var classkey = policyType.toString()+"-"+policyId.toString()+"-"+nodeId.toString();
	var obj;

	logP6Msg("addDefaultFCQueue", "SAMIF", "entered");
	logP6Msg("addDefaultFCQueue", "SAMIF", "adding default fc entry for "+classkey+" "+"for queue "+queueId);

	obj=fcQByType.insertOrFindHashArrayEntry(classkey, queueId.toString());
//	if (isDef(obj)) {
//		obj[fc]=cIncr(obj[fc]);
//		obj.defaultcast = true;
//		obj.fc_set=true;
//	logP6Msg("addDefaultFCQueue", "SAMIF", "isDef(obj)");
//		}
	logP6Msg("addDefaultFCQueue", "SAMIF", "exiting");
	return obj;
}

function propChange_aingr_aengr_forwarding_class(className, objectName, propColl)
{

	var classkey, qarray, fc;
	var i,j;
	var propName, oldvalue, newvalue;

	logP6Msg("propChange_forwarding_class", "SAMIF", "entering");
	logStatus("className", className);
	logStatus("objectName", objectName);

	fc = fc_fc_map[objectName];
	if (isUndef(fc)) {
		logP6Msg("propChange_forwarding_class", "SAMIF", "No FC found for objectName "+objectName);
		return;
	}

	classkey = fc_key_map[objectName];
	if ((classkey != undefined) && (fc != undefined)) {

		// Find the queue hash array
	
		qarray=fcQByType.findHashArray(classkey);
		if (isDef(qarray)) {   // found hash array
			for (i=0; i<qarray.length; i++) {
				qentry=qarray[i];
				for(j in propColl)
				    {    propName = propColl[j].attributeName.toString();
					newvalue = propColl[j].newvalue.toString();
					oldvalue = propColl[j].oldvalue.toString();
					
					logP4Msg("propChange_forwarding_class", "SAMIF", "propName: "+propName);	
					logStatus("propChange_forwarding_class fc_queue_properties[propName]", fc_queue_properties[propName]);
					logStatus("propChange_forwarding_class fc_queue_properties[queueId]", fc_queue_properties["queueId"]);
					logStatus("propChange_forwarding_class fc_queue_properties[unicast]", fc_queue_properties["unicast"]);
					if (isDef(fc_queue_properties[propName])) { // one of the queues
					    if (qentry.entryId == oldvalue) {
						logP6Msg("propChange_forwarding_class", "SAMIF", "queue: "+oldvalue+" no longer ass. w/fc: "+fc+" (cast: "+fc_queue_properties[propName]+")");	
						qentry[fc]=cDecr(qentry[fc]);
						changed=1;
					    }
					    if (qentry.entryId == newvalue) {
						qentry[fc]=cIncr(qentry[fc]);
						qentry[fc_queue_properties[propName]]=true;  // cast of traffic
						changed=1;
						logP6Msg("propChange_forwarding_class", "SAMIF", "queue: "+newvalue+" now ass. w/fc: "+fc+" (cast: "+fc_queue_properties[propName]+")");	
					    }
					}
					else {
					    logP6Msg("propChange_forwarding_class", "SAMIF", propName+": skipping");	
					}
					
				    } // for in propColl
			}  // for all the queues
		}  // found qarray
		//new stuff
		else {
		    logP6Msg("propChange_forwarding_class", "SAMIF", "unable to find qarray for "+classkey+" "+objectName);	
		}
		if (changed == 1) {		
		    process_stored_AccInt(classkey, modelInterface);
		}
	} // if classkey
	else {
	    logP4Msg("propChange_forwarding_class", "SAMIF", "classkey or fc not found for FC object: "+objectName);	
	}
}

/*
 * 05 April 2013: It appears that the forwardingClass has either "containingPolicyId" or "containingPolicyDisplayedName"
 */
function fc_map_field(classname) 
{
    var field_name;

    switch(classname) 
    {
    	case "aingr.ForwardingClass":
    	case "aengr.ForwardingClass":
    	case "sasqos.AccessIngressForwardingClass":
    	case "sasqos.PortAccessIngressForwardingClass":
    		field_name="containingPolicyId";
    	break;
    	case "nqueue.ForwardingClass":
    		//field_name="policyId";
    		field_name="containingPolicyDisplayedName";
    	break;
    	default:
    		logP6Msg("fc_map_field", "SAMIF", "Don't recognize class "+classname);
    }

    return(field_name);
}
