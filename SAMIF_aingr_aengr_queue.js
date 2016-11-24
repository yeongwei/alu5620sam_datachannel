// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

/*
This file handles all the queue-type objects in cases where you have a policy/fc/queue set of objects that are then triggered by another 
object (SAP, physical port) to create a SE made from the composite of the objects.  It doesn't just handle the aingr/aengr
objects; the file naming is an artifact of the earlier version which only handled the aingr/aengr objects.
*/


var reverse_aingr_aengr_queue_Name = {},
    aingr_aengr_queue_Name = {
	"samCir":"cir",
	"samContainingPolicyId":"containingPolicyId",		// used explicitly; need to track change?
	"samId":"id",						// used explicitly; need to track change?
	"samMulticast":"multicast",
	"samMultipoint":"multipoint",
	"samObjectFullName":"objectFullName",			// used explicitly; need to track change?
	"samPir":"pir",
	"samPolicyType":"policyType",				// used explicitly; need to track change?
	"samSiteId":"siteId",					// used explicitly; need to track change?
	"samContainingPolicyDisplayedName":"containingPolicyDisplayedName"					// used explicitly; need to track change?
    };


var perhaps_all_aingr_aengr_queue_Name = {
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



for( var i in aingr_aengr_queue_Name)
    {
	//	MasterPropertyMap[i] = aingr_aengr_queue_Name[i];
	MasterPropertyMap[aingr_aengr_queue_Name[i]] = i;
	ReverseMasterPropertyMap[aingr_aengr_queue_Name[i]] = i;
	reverse_aingr_aengr_queue_Name[aingr_aengr_queue_Name[i]] = i;
    }

function aingr_aengr_queue(samObject, modelInterface, classname)
{
    logP4Msg("process_aingr_aengr_queue", "SAMIF", "entered");

    var element;
    var subelement;
    var classkey;
    var def_fc;
    var policyField;

    policyField=queue_map_field(classname);//Return as "containingPolicyId"; "containingPolicyDisplayedName";
    if (isUndef(policyField)) 
    {
    	return;
    }
    
    if (isUndef(samObject.policyType) | isUndef(samObject[policyField]) | isUndef(samObject.siteId) | isUndef(samObject.id)) 
    {
    	//logP4Msg("process_aingr_aengr_queue", "SAMIF", "Queues Error: something not defined right");
    	logP4Msg("process_aingr_aengr_queue", "SAMIF", "Queues are not defined correctly.");
    	logStatus("samObject.policyType", samObject.policyType);
    	logStatus("samObject[policyField]", samObject[policyField]);
    	logStatus("samObject.siteId", samObject.siteId);
    	logStatus("samObject.id", samObject.id);
    }
    else 
    {
    	classkey = samObject.policyType+"-"+samObject[policyField]+"-"+samObject.siteId;
    	logP4Msg("process_aingr_aengr_queue", "SAMIF", "processing with classkey '"+classkey+"' and queue id '"+samObject.id+"'");
    	
    	if (samObject.siteId != "0.0.0.0") 
    	{
    		qentry = fcQByType.findHashArrayEntry(classkey, samObject.id);
    		
    		if (isUndef(qentry)) 
    		{
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "could not find queue entry "+classkey+" "+samObject.id);
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "inserting queue entry ");
    			qentry = fcQByType.insertOrFindHashArrayEntry(classkey, samObject.id);
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "inserted queue entry ");
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "inserting queue entry "+classkey+" "+samObject.id);

    			//This is a new queue entry, other than the default 1 or 11
    			if (isDef(samObject.mCast) || isDef(samObject.multicast)) 
    			{
    				//Ingress Queue
    				logP4Msg("process_aingr_aengr_queue", "SAMIF", "New ingress queue");
    				if (samObject.mCast == "true" || samObject.multicast == "true") 
    				{
    					logP4Msg("process_aingr_aengr_queue", "SAMIF", "Traffic type multicast set to true");
    					qentry.multicast = true;
    				}
    				else 
    				{
    					logP4Msg("process_aingr_aengr_queue", "SAMIF", "Traffic type unicast set to true");
    					qentry.unicast = true;
    				}
    			}
    			else// Egress Queue, because only have unicast queue id 
    			{
    				logP4Msg("process_aingr_aengr_queue", "SAMIF", "New egress queue");
    				logP4Msg("process_aingr_aengr_queue", "SAMIF", "Traffic type unicast set to true");
    				
    				qentry.unicast = true;
    			}
		
    			qentry.fc_set = true;
    		}  // is undef qentry
	       
    		//maybe we already had one, maybe we made one
    		if (isDef(qentry))
    		{
    			//logP4Msg("process_aingr_aengr_queue", "SAMIF", "in isDef qentry");
    			queue_key_map[samObject.objectFullName] = classkey;
    			//logP4Msg("process_aingr_aengr_queue", "SAMIF", "before queue_set");
    			qentry.queue_set = true;
    			//logP4Msg("process_aingr_aengr_queue", "SAMIF", "before properties");
		 
    			// These are being stored in the qentry so when we finally
    			// make the actual subelement, we can assign it these properties.
    			// More will also be added then (when we process the accessinterface).
		 
    			// find the default fc value
    			def_fc = policy_def_fc[classkey];
		
    			if (isDef(def_fc)) 
    			{
    				qentry.def_fc = def_fc;
    			} 
    			else 
    			{
    				logP4Msg("process_aingr_aengr_queue", "SAMIF", "default forwarding class UNDEFINED");
    			}

    			for( var i in aingr_aengr_queue_Name) 
    			{
    				//nilStatus("Checking i", i);
    				//nilStatus(i.toString(), aingr_aengr_queue_Name[i]);
			 
    				if ( samObject[ aingr_aengr_queue_Name[i] ] != undefined )
    				{
    					logP6Msg("process_aingr_aengr_queue", "SAMIF", aingr_aengr_queue_Name[i]+"->"+i.toString()+"("+samObject[aingr_aengr_queue_Name[i]]+")");
    					qentry[i] = samObject[ aingr_aengr_queue_Name[i] ].toString();
    				}
    			}

    			qentry.classname=classname;
    			qentry.policyField=policyField;

    			//logStatus("variable_bug", variable_bug);
    			logStatus("qentry.classname", qentry.classname);
    			logStatus("qentry.policyField", qentry.policyField);
    			logStatus("qentry[classname]", qentry["classname"]);
    			logStatus("qentry[policyField]", qentry["policyField"]);
		 
    			qentry["classname"]=classname;
    			qentry["policyField"]=policyField;
		 
    			//logStatus("variable_bug", variable_bug);
    			logStatus("qentry.classname", qentry.classname);
    			logStatus("qentry.policyField", qentry.policyField);
    			logStatus("qentry[classname]", qentry["classname"]);
    			logStatus("qentry[policyField]", qentry["policyField"]);

    			// create subelements for queues with fcs and access interfaces received earlier
    			//			logP4Msg("process_aingr_aengr_queue", "SAMIF", "checking for nil fc_set");
    			//			logStatus("fc_set", qentry.fc_set);
    			//			if (qentry.fc_set == true) {
    			//			logP4Msg("process_aingr_aengr_queue", "SAMIF", "checking for stored access interfaces (AccInt)");
    			//				logStatus("classkey", classkey);
    			//				nilStatus("modelInterface", modelInterface);
    			process_stored_AccInt(classkey, modelInterface);
    			//				}
		 
    		} // else isDef(qentry)
    		else 
    		{ 
    			// didn't find a queue entry, which should not happen.  We just created it if it didn't already exist
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "queue entry really not found!");
    			logP4Msg("process_aingr_aengr_queue", "SAMIF", "could not find queue entry, but we really should have: "+classkey+" "+samObject.id);
    		}
    	}//siteId is not 0.0.0.0
    }//the parameters needed for lookup are defined
	
    logP4Msg("process_aingr_aengr_queue", "SAMIF", "exited");
	
}//process_aingr_aengr_queue

function propChange_aingr_aengr_queue(className, objectName, propColl)
{
    var classkey, qentry;
    var i, changed;
    var propName, propValue;
    var policyField;

    classkey = queue_key_map[objectName];
    if (classkey != undefined) {

	policyField=queue_map_field(className);
	if (isUndef(policyField)) {
	    return;
	}

	// Find the queue object

	qentry = findQueueByObjectFullName(classkey, objectName);	
	if (isDef(qentry)) {
	    for( i in propColl)
		{    propName = propColl[i].attributeName;
		    propValue = propColl[i].newvalue;

		    logP4Msg("jms_propChange", "SAMIF", "propName: "+propName);	
		    switch(propName) {
		    case 'policyId':
			classkey = qentry.policyType+"-"+propValue+"-"+qentry.siteId;
			logP4Msg("queue_propChange", "SAMIF", "policy: "+classkey+" to "+newclasskey);
			queue_switch_policy(classkey, newclasskey, qentry, propName, propValue);
			break;
		    case 'policyType':
			classkey = propValue+"-"+samObject[policyField]+"-"+samObject.siteId;
			logP4Msg("queue_propChange", "SAMIF", "policy: "+classkey+" to "+newclasskey);
			queue_switch_policy(classkey, newclasskey, qentry, propName, propValue);
			break;
		    default: 
			if (isDef(reverse_aingr_aengr_queue_Name[propName])) { // a property we care about
			    changed=1;
			    logP4Msg("jms_propChange", "SAMIF", objectName+"==>["+propName+"]::"+propValue);	
			    qentry[reverse_aingr_aengr_queue_Name[propName]]=propValue;
			    logP6Msg("jms_propChange", "SAMIF", propName+": changed to"+propValue);	
			}
			else {
			    logP6Msg("jms_propChange", "SAMIF", propName+": skipping");	
			}
		    } // switch
		} // for 
	    if (changed == 1) {
		process_stored_AccInt(classkey, modelInterface);
		//Not needed, it refers to a empty function in SAMIFAdaptor
		//definite_commit(modelInterface);
	    }
	} // isDef(qentry)
	else {
	    logP6Msg("jms_queue_propChange", "SAMIF", "Can't find queue:"+classkey+"  "+objectName);
	}
    } // if classkey
    else {
	logP6Msg("jms_queue_propChange", "SAMIF", "Can't find queue:"+classkey);
    }

}

function findQueueByObjectFullName(classkey, fullname)
{

    // qarray is a hash array, as obtained from findHashArray();

    var i;
    var qarray, qentry;

    logP6Msg("findQueueByObjectFullname", "SAMIF", "entered with "+classkey+"  "+fullname);

    qarray=fcQByType.findHashArray(classkey);

    //	logStatus("qarray", qarray);		
    if (isDef(qarray)) {   // found hash array
	for (i=0; i<qarray.length; i++) {
	    qentry=qarray[i];
	    //	logStatus("qentry", qentry);		
	    //			logP6Msg("findQueueByObjectFullname", "SAMIF", "comparing with: "+qentry.objectFullName);
	    //			logP6Msg("findQueueByObjectFullname", "SAMIF", "also known as: "+qentry["objectFullName"]);
	    //			logP6Msg("findQueueByObjectFullname", "SAMIF", "queue number: "+qentry.entryId);
	    //			dump_queue_properties(qentry);
	    if (isDef(qentry.samObjectFullName)) {
		if ((qentry.samObjectFullName.toString()) == (fullname.toString())) {
		    return qentry;
		}
	    } // isDef
	} // for
    }

    return nil;
}

function turn_off_queue_SE(record) 
{
	logP4Msg("delete_queue_SE", "SAMIF", "Entered");
	//logP4Msg("delete_queue_SE", "SAMIF", "record.objectFullNameOrAltIdMap -> " + record.objectFullNameOrAltIdMap);
	//subelement = LOOKUP.get(record.objectFullNameOrAltIdMap);//This object reference might not be working correctly.
	subelement = OPERATOR.subelementNamed(record.seName);
	logP4Msg("delete_queue_SE", "SAMIF", "subelement -> " + subelement);
	if(subelement == null)
	{
		logP4Msg("delete_queue_SE", "SAMIF", "No PvSubelement object found with Subelement Name of " + record.seName);
		return;
	}
	else
	{
		subelement = OPERATOR.subelementNamedOrNew(record.seName);//subelementManager <---
		logP4Msg("delete_queue_SE", "SAMIF", "By NamedOrNew subelement -> " + subelement);
		
		logP4Msg("delete_queue_SE", "SAMIF", "Current subelement.state -> " + subelement.state);
		subelement.state = false;
		logP4Msg("delete_queue_SE", "SAMIF", "record.timestamp -> " + record.timestamp);
		//subelement.timestamp = parseInt(record.timestamp);
		
		logP4Msg("delete_queue_SE", "SAMIF", "Exiting");
	}
}	

//16 January 2013: Use record instead of fullname
//function delete_SEs_by_queue_fullname(fullname, classname){
function delete_SEs_by_queue_fullname(record, classname){

    // This function turns off the SEs that are composed with this queue, plus it removes the
    // qentry from the hash array.  This is for the case where you get a JMS delete element
    // message for a queue, so it should be really gone.
	var fullname = record.objectFullName;
	
    var classkey = queue_key_map[fullname];

    if (isUndef(classkey)) {
	logP4Msg("turn_off_queue_by_fullname", "SAMIF", "Unable to find classkey entry for "+fullname);
	return;
    }

    qentry = findQueueByObjectFullName(classkey, fullname);

    if (isUndef(qentry)) {
	logP4Msg("turn_off_queue_by_fullname", "SAMIF", "Unable to find qentry for "+fullname);
	return;
    }

    turn_off_SEs_by_qentry(qentry, classkey, classname);
    fcQByType.deleteEntryFromHashArray(classkey, qentry);
    logP6Msg("turn_off_SEs_by_queue", "SAMIF", "after deletehashentry ");
    delete queue_key_map[fullname];
    //	queue_key_map[fullname] = undefined;
    logP6Msg("turn_off_SEs_by_queue", "SAMIF", "exiting");
}

function turn_off_SEs_by_qentry(qentry, classkey, classname) {

    // This will look in the repositories and turn off the subelements that are composed using a certain queue object
    // qentry is the pointer to the qentry object representing the queue.  classkey is the classkey for that access interface

    var i;
    var kentry;
    var fullname;
    var samObject;
    var subelementname;
    var kentry;
    var policyField;

    logP5Msg("turn_off_SEs_by_queue", "SAMIF", "entering turn_off_SEs_by_queue: "+classkey);

    policyField=queue_map_field(classname);
    if (isUndef(policyField)) {
	return;
    }


    kentry = accInt_by_policy[classkey];
    if(kentry == null) {
	//debug	nilstatus("kentry", kentry);
	return;
    }

    for (i=0; i<kentry.length; i++) {
	fullname = kentry[i].toString();
	samObject = accInt_storage[fullname];
	if (isUndef(samObject)) {
	    logP2Msg("turn_off_SEs_by_queue", "SAMIF", "Unable to find stored accInt for: "+fullname);
	    continue;
	}
	logP5Msg("turn_off_SEs_by_queue", "SAMIF", "Processing stored AccInt: "+classkey+" "+fullname);
	subelementname = SEname_from_qentry_accInt(qentry, samObject, classname, qentry.samSiteId);
	turn_off_queue_SE(subelementname);
    } // for

    logP5Msg("turn_off_SEs_by_queue", "SAMIF", "Finished turn_off_SEs_by_qentry");

}

//Added extra parameter pName to support fixpack 2.12.2 in SAM find2file pack.

function SEname_from_qentry_accInt(qentry, accInt, classname, siteId, pName) 
{
    var subelementname;
    var policyField;

    policyField=reverse_aingr_aengr_queue_Name[qentry.policyField];

    logStatus("classname", classname);
    logStatus("policyField", policyField);
    logStatus("qentry.policyField", qentry.policyField);

    if (isUndef(qentry)) 
    {
    	logP5Msg("SEname_from_qentry", "SAMIF", "qentry is UNDEFINED");
    	return;
    }

    if (isUndef(accInt)) 
    {
    	logP5Msg("SEname_from_qentry", "SAMIF", "accInt is UNDEFINED");
    	return;
    }

    if (isUndef(qentry[policyField]))
    {
    	logP5Msg("SEname_from_qentry", "SAMIF", "policy field "+policyField+" is undefined");
    	//dump_queue_properties(qentry);
    	return;
    }

    if (isUndef(qentry.samId)) 
    {
    	logP5Msg("SEname_from_qentry", "SAMIF", "samId is undefined");
    	//dump_queue_properties(qentry);
    	return;
    }

    if (isUndef(qentry.samPolicyType)) 
    {
    	logP5Msg("SEname_from_qentry", "SAMIF", "samPolicyType is undefined");
    	//dump_queue_properties(qentry);
    	return;
    }

    //subelementname = "5620SAM_queue_"+accInt.nodeId+"_"+qentry.samPolicyType+"_"+qentry[policyField].toString()+"_"+accInt.portIdentifyingName+"-"+qentry.samId;
    //subelementname = "5620SAM_queue_" + siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField].toString()+"_"+accInt.portIdentifyingName+"-"+qentry.samId;
    
    if(isDef(pName)){  
   	 //subelementname = "5620SAM_queue_"+siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField].toString()+"_"+accInt.portIdentifyingName+"_"+ pName +"-"+qentry.samId;
   	 
	     subelementname =  "5620SAM_queue_";
	     subelementname += siteId + "_";
	     subelementname += qentry.samPolicyType + "_";
	     subelementname += qentry[policyField].toString()+"_";
	     subelementname += accInt.portIdentifyingName + "-";
	     subelementname += pName + "_";
	     subelementname += qentry.samId; 	
	     logP6Msg("SE_name_from_qentry", "SAMIF", "SEname: " + subelementname);
   	 
    }else{
     //  	 subelementname = "5620SAM_queue_"+siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField].toString()+"_"+accInt.portIdentifyingName+"-"+qentry.samId;
       	 
         subelementname =  "5620SAM_queue_";
         subelementname += siteId + "_";
         subelementname += qentry.samPolicyType + "_";
         subelementname += qentry[policyField].toString()+"_";
         subelementname += accInt.portIdentifyingName + "-";
         subelementname += qentry.samId; 	
         logP6Msg("SE_name_from_qentry", "SAMIF", "SEname: " + subelementname);
    }
    
    return(subelementname);
}

function queue_switch_policy(classkey, newclasskey, qentry, propName, propValue) {

    var oldhash;
    var objectName;
    var removed;

    logP6Msg("queue_switch_policy", "SAMIF", "Entering queue_switch_policy");


    objectName = qentry.objectFullName;

    oldhash = fcQByType.findHashArray(oldclasskey);

    if (isUndef(oldhash)) {
	logP3Msg("queue_switch_policy", "SAMIF", "Unable to find hash array for "+objectName);
	return;
    }

    removed = fcQByType.deleteEntryFromHashArray(oldclasskey, qentry);

    if (isUndef(removed)) {
	logP3Msg("queue_switch_policy", "SAMIF", "Unable find hash array for "+objectName+" under classkey "+oldclasskey);
	return;
    }

    turn_off_SEs_by_qentry(qentry, classkey);
    qentry.propName=propValue;
    fcByType.insertEntryIntoHashArray(newclasskey, qentry);
    process_stored_AccInt(classkey, modelInterface);

    logP6Msg("queue_switch_policy", "SAMIF", "Exiting queue_switch_policy");

}

function dump_queue_properties(qentry) {

    var i;

    for(i in qentry) {
	logP6Msg("dump_queue_properties", "SAMIF", "prop: "+i+" "+qentry[i]);
    }

}

function queue_map_field(classname) {

    var field_name;

    switch(classname) 
    {
    	case "aingr.Queue":
    	case "aengr.Queue":
    	case "sasqos.Meter":
    	case "sasqos.PortAccessEgressQueue":
    		field_name="containingPolicyId";
    	break;
    	case "nqueue.Entry":
    		//field_name="policyId";
    		field_name="containingPolicyDisplayedName";
    	break;
    	default:
    		logP6Msg("queue_map_field", "SAMIF", "Don't recognize class "+classname);
    }

    return(field_name);
}
