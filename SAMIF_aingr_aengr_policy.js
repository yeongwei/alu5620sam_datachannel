// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

/*
This file handles all the policies in cases where you have a policy/fc/queue set of objects that are then triggered by another 
object (SAP, physical port) to create a SE made from the composite of the objects.  It doesn't just handle the aingr/aengr 
objects; the file naming is an artifact of the earlier version which only handled the aingr/aengr objects.
*/

 
var aingr_policy_Name = {
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

// We are not tracking changes in these properties except by explicit handling
//
//for( var i in aingr_policy_Name)
//{
//	MasterPropertyMap[i] = aingr_policy_Name[i];
//}

var fc_strings_rev = {"be":"1", "l2":"2", "af":"4", "l1":"8", "h2":"16", "ef":"32", "h1":"64", "nc":"128"};
var fc_strings = {"1":"be", "2":"l2", "4":"af", "8":"l1", "16":"h2", "32":"ef", "64":"h1", "128":"nc"};

function process_aingr_policy(samObject, modelInterface, classname)
{
   // var id;
    var classkey;
    var objectFullName = samObject.objectFullName;

	logP4Msg("process_aingr_policy", "SAMIF", "entered for classname "+classname);

	if (isDef(samObject.siteId) && (samObject.siteId != "0.0.0.0")) {
		classkey = samObject.policyType+"-"+samObject.id+"-"+samObject.siteId;
		logP4Msg("process_aingr_policy", "SAMIF", "processing policy: "+objectFullName+" classkey: "+classkey);
		policy_key_map[objectFullName]=classkey;
		policy_def_fc[classkey]=samObject.defaultFc;

		qentry = addDefaultFCQueue(samObject.policyType, samObject.id, samObject.siteId, "1");
		if (isDef(qentry)) {
			qentry.fc_set = true;
			qentry.def_fc = samObject.defaultFc;
			qentry.unicast = true;
			logP4Msg("process_aingr_policy", "SAMIF", "added accessIngress queue 1 as unicast");
			}

		qentry = addDefaultFCQueue(samObject.policyType, samObject.id, samObject.siteId, "11");
		if (isDef(qentry)) {
			qentry.fc_set = true;
			qentry.def_fc = samObject.defaultFc;
			qentry.multicast = true;
			logP4Msg("process_aingr_policy", "SAMIF", "added accessIngress queue 11 as multicast");
			}

	}
}

function process_aengr_policy(samObject, modelInterface, classname)
{

 	var classkey;
	var objectFullName = samObject.objectFullName;

	logP4Msg("process_aengr_policy", "SAMIF", "entered for class "+classname);
	logStatus("siteId", samObject.siteId);

	if (isDef(samObject.siteId) && (samObject.siteId != "0.0.0.0")) 
	{
		classkey = samObject.policyType+"-"+samObject.id+"-"+samObject.siteId;
		logP4Msg("process_aengr_policy", "SAMIF", "processing policy: "+objectFullName+" classkey: "+classkey);
		policy_key_map[objectFullName]=classkey;

		qentry = addDefaultFCQueue(samObject.policyType, samObject.id, samObject.siteId, "1");
		if (isDef(qentry)) 
		{
			qentry.fc_set = true;
			qentry.unicast = true;
			logP4Msg("process_aengr_policy", "SAMIF", "added accessEgress queue 1");
		}


	}
}

// This function adds the policy to the map, but does not add any default queues
function process_generic_policy(samObject, modelInterface, classname) 
{
    var idfield;
    var classkey;
    var objectFullName = samObject.objectFullName;

	logP4Msg("process_generic_policy", "SAMIF", "entered for classname "+classname);

	logStatus("ingressPolicyId", samObject.ingressPolicyId);
	logStatus("egressPolicyId", samObject.egressPolicyId);
	logStatus("sasIngressPolicyId", samObject.sasIngressPolicyId);
	logStatus("containingPolicyId", samObject.containingPolicyId);
	logStatus("networkQueuePolicyName", samObject.networkQueuePolicyName);
	logStatus("siteId", samObject.siteId);
	logStatus("nodeId", samObject.nodeId);
	nilStatus("ingressPolicyId", samObject.ingressPolicyId);
	logStatus("classname", classname);


	if (isDef(samObject.siteId) && (samObject.siteId != "0.0.0.0")) 
	{
		idfield = policy_map_field(classname);
		logStatus("idfield", idfield);
		if (isDef(idfield)) 
		{
		    classkey = samObject.policyType+"-"+samObject[idfield]+"-"+samObject.siteId;
		    logP4Msg("process_generic_policy", "SAMIF", "processing policy: "+objectFullName+" classkey: "+classkey);
		    policy_key_map[objectFullName]=classkey;
		}
	}

}

// This one is used for aingr.Policy and sasquos.AccessIngress
function propChange_aingr_policy(className, objectName, propColl)
{

	var classkey, qarray;//, fc;
	var i,j;
	var propName, /*oldvalue,*/ newvalue;

	logP6Msg("propChange_aingr_policy", "SAMIF", "entering");

	classkey = policy_key_map[objectName];
	if (isUndef(classkey)) {
		logP5Msg("propChange_aingr_policy", "SAMIF", "Exiting - no Policy found in keymap for objectName "+objectName);
		return;
	}

	logStatus("classkey", classkey);

	for (var j in propColl) {
		propName = propColl[j].attributeName.toString();
		newvalue = propColl[j].newvalue.toString();
	logP6Msg("propChange_aingr_policy", "SAMIF", "before if check");
		if ((propName == "defaultFc") && (isDef(fc_strings[newvalue]))) {
			// defaultFc change -- all we handle for policy
			logP5Msg("propChange_aingr_policy", "SAMIF", "Changing def_fc for classkey "+classkey);
			qarray=fcQByType.findHashArray(classkey);
			if (isDef(qarray)) {   // found hash array
				for (i=0; i<qarray.length; i++) {
					qentry=qarray[i];
					logP5Msg("propChange_aingr_policy", "SAMIF", "Changing def_fc to "+fc_strings[newvalue]+" for queue "+qentry.entryId);
					qentry.def_fc = fc_strings[newvalue];
					}
				process_stored_AccInt(classkey, modelInterface);
				}
			} // defaultFc
		} // propColl

}

function policy_map_field(classname) {

    var policy_field;

    switch(classname) {
    case "aingr.Policy":
    case "aengr.Policy":
    case "sasqos.AccessIngress":
    case "sasqos.PortAccessEgress":
	policy_field="id";
	break;
    case "nqueue.Policy":
	policy_field="displayedName";
	break;

    default:

	logP6Msg("policy_map_field", "SAMIF", "Don't recognize class "+classname);
    }

    return(policy_field);
}
