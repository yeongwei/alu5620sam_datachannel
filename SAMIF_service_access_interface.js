// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var repos_count_policy=0, repos_count_storage=0;
var accint_count=0;
//The sapflag is introduced to support 2.12.2.0 findfile fixpack
var sapflag = "FALSE";

var policy_list=["accessIngress", "accessEgress", "sasAccessIngress", "sasPortAccessEgress", "networkQueue"];
var policy_fields=["ingressPolicyId", "egressPolicyId", "sasIngressPolicyId", "containingPolicyId", "networkQueuePolicyName"];
var handled_access_interfaces={"vll.L2AccessInterface":true, "vprn.L3AccessInterface":true, "ies.L3AccessInterface":true, "vpls.L2AccessInterface":true, "mirror.L2AccessInterface":true, "ipipe.L2AccessInterface":true}; 
var network_queue_significant={"networkQueuePolicyCapable":true, "mode":true};
var policy_fields_hash={};
//Future property update list goes here!!!
var reverse_svc_access_interface_Name =
{
    "objectFullName"                 : "samObjectFullName",		// need this one
    "administrativeState"            : "samAdministrativeState",    
    "l3InterfaceAdministrativeState" : "samAdministrativeState",     // special case for L3 interfaces
    "description"                    : "samDescription",
    "displayedName"                  : "samDisplayedName",
    "mode"                           : "samMode",
    //    "networkQueuePolicyCapable":"samNetworkQueuePolicyCapable",   // need this one in the record but not the SE
    "nodeId"                         : "samNodeId",				// need this one
    "nodeName"                       : "samNodeName",
    "operationalState"               : "samOperationalState",
    "l3InterfaceOperationalState"    : "samOperationalState", // special case for L3 interface
    "portIdentifyingName"            : "samPortIdentifyingName",    // need this one
    "portId"                         : "samPortId",
    "portName"                       : "samPortName",
    "serviceId"                      : "samServiceId",				// need this one
    "serviceName"                    : "samServiceName",
    "serviceType"                    : "samServiceType",			// need this one
    "siteName"                       : "samSiteName",                           // need this one for grouping
    "subscriberId"                   : "samSubscriberId",			// need this one
    "subscriberName"                 : "samSubscriberName"		// need this one
},
    svc_access_interface_Name = {};
/*

  "samObjectFullName":"objectFullName",		// need this one
  "samAdministrativeState":"administrativeState",    
  "samAdministrativeState":"l3InterfaceAdministrativeState",     // special case for L3 interfaces
  "samDescription":"description",
  "samDisplayedName":"displayedName",
  "samNodeId":"nodeId",				// need this one
  "samNodeName":"nodeName",
  "samOperationalState":"operationalState",
  "samOperationalState":"l3InterfaceOperationalState", // special case for L3 interface
  "samPortIdentifyingName":"portIdentifyingName",    // need this one
  "samPortId":"portId",
  "samPortName":"portName",
  "samServiceId":"serviceId",				// need this one
  "samServiceName":"serviceName",
  "samServiceType":"serviceType",			// need this one
  "samSubscriberId":"subscriberId",			// need this one
  "samSubscriberName":"subscriberName"		// need this one
  };
*/

var larger_list_of_svc_access_interface_Name = {
    "samObjectFullName":"objectFullName",
    "samAccountingOn":"accountingOn",
    "samAccountingPolicyId":"accountingPolicyId",
    "samAccountingPolicyName":"accountingPolicyName",    
    "samAdministrativeState":"administrativeState",    
    "samCtpPointer":"ctpPointer",
    "samDescription":"description",
    "samDisplayedName":"displayedName",
    "samEncapType":"encapType",
    "samHighestIngressFc":"highestIngressFc",
    "samIngressWeightedBandwidthRequirement":"ingressWeightedBandwidthRequirement",    
    "samNodeId":"nodeId",
    "samNodeName":"nodeName",
    "samOperationalState":"operationalState",
    "samPortIdentifyingName":"portIdentifyingName",    
    "samPortId":"portId",
    "samPortName":"portName",
    "samRouterName":"routerName",
    "samServiceId":"serviceId",
    "samServiceName":"serviceName",
    "samServiceType":"serviceType",
    "samSubscriberId":"subscriberId",
    "samSubscriberName":"subscriberName",
    "samTerminatedObjectName":"terminatedObjectName",
    "samTerminatedPortClassName":"terminatedPortClassName"   
};

var _svcQueuesToBeDeleted = new Array();

for( var i in reverse_svc_access_interface_Name)
    {
	//	MasterPropertyMap[i] = svc_access_interface_Name[i];
	svc_access_interface_Name[reverse_svc_access_interface_Name[i]] = i;
	//debug	logP6Msg("service_access_interface_Name", "SAMIF", "index: " +reverse_svc_access_interface_Name[i].toString() + " value: "+ i);


    }

// For policy field lookup
for(var i in policy_fields)
    {
	var name=policy_fields[i];
	policy_fields_hash[name]=true;
    }

// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.

var serviceMapFunctions = { "operationalState": getServiceMappedPropString,
			    "administrativeState": getServiceMappedPropString,
			    "l3InterfaceOperationalState": getServiceMappedPropString,
			    "l3InterfaceAdministrativeState": getServiceMappedPropString,
			    "mode":getServiceMappedPropString };

var mapServiceOperationalState = { "0":"serviceUnknown",
				   "1":"serviceUp",
				   "2":"serviceDown",
				   "3":"serviceIngressQosMismatch",
				   "4":"serviceEgressQosMismatch",
				   "5":"servicePortMtuTooSmall",
				   "6":"serviceAdminDown",
				   "7":"servicIesIfAdminDown",
				   "8":"blocking",
				   "9":"forwarding",
				   "10":"filtering"};

var mapServiceAdministrativeState = { "0":"serviceUnknown",
				      "1":"serviceUp",
				      "2":"serviceDown" };

var mapServiceMode = { "0":"Undefined",
		       "1":"access",
		       "2":"network",
		       "3":"hybrid" };

    var mapForServiceProp = {"operationalState": mapServiceOperationalState, 
			     "administrativeState": mapServiceAdministrativeState,
			     "l3InterfaceOperationalState": mapServiceOperationalState, 
			     "l3InterfaceAdministrativeState": mapServiceAdministrativeState,
			     "mode": mapServiceMode };

function getServiceMappedPropString(objectName, propName, sp) {
    var spMap = mapForServiceProp[propName];	
    logStatus("propName", propName);
    nilStatus("spMap", spMap);
    if (isDef(spMap)) {
	return(getMappedPropString(spMap, objectName, propName, sp));
    }
    else return;
}

// Thus ends the code used to map the status values

function process_access_interface(samObject, modelInterface, classname)
{
    //debug	//logP4Msg("process_access_interface", "SAMIF", "entered");
	logP6Msg("process_access_interface", "DEBUG", "from samObject.timestamp -> " + samObject.timestamp);
	//samObject.timestamp = PV.currentInputDescriptor.timestamp.asUTCSeconds();
	logP6Msg("process_access_interface", "DEBUG", "to samObject.timestamp -> " + samObject.timestamp);
	
	logP6Msg("process_access_interface", "DEBUG", "Start Looking into samObject");
	dump_samObject(samObject);
	logP6Msg("process_access_interface", "DEBUG", "Finished Looking into samObject");
	
    var classkey;
    var qarray;
    var qentry;
    var i,j;
    var obj_copy = undefined;
    var def_fc = undefined;
    var policyprop, policytype;
    var the_classname;
    var siteid;


    /*
      logStatus("objectFullName", samObject.objectFullName);
      logStatus("ingressPolicyId", samObject.ingressPolicyId);
      logStatus("egressPolicyId", samObject.egressPolicyId);
      logStatus("sasIngressPolicyId", samObject.sasIngressPolicyId);
      logStatus("containingPolicyId", samObject.containingPolicyId);
      logStatus("networkQueuePolicyName", samObject.networkQueuePolicyName);
      logStatus("siteId", samObject.siteId);
      logStatus("nodeId", samObject.nodeId);
      nilStatus("ingressPolicyId", samObject.ingressPolicyId);
      logStatus("classname", classname);
    */

    //Coming in from a full dump or JMS create
    //Records are coming from fullDump. E.g from documentation fullDump properties of any class do not have the property "classname"
    if (isUndef(samObject.classname)) 
    { 
    	
    	samObject.classname=classname;
    	the_classname = classname;
    	
    	//equipment.PhysicalPort will skip this section
    	//Include SAPs into Performance
    	if (isDef(handled_access_interfaces[classname])) 
    	{
    		//storePropertiesForVccvPingEnrichment(samObject, modelInterface, classname);//04 April 2013: If this is required for the Accounting UBA???
    		if(accounting_uba == false)
    		{
    			logP6Msg("process_access_interface", "SAMIF", "Within Performance UBA, storing SAP properties for CFM enrichments");
    			storePropertiesForVccvPingEnrichment(samObject, modelInterface, classname);
    			logP6Msg("process_access_interface", "SAMIF", "Within Performance UBA, do not proceed with SAPs inventory creation");
    			return false;
    		}
    	}

    } 
    else 
    {	//Does this mean processing access interface???
    	if (isUndef(classname))// Stored accInt case 
    	{       
    		the_classname = samObject.classname;
    	}
    }

    //logP6Msg("process_access_interface", "SAMIF", "Classname: "+the_classname);
    /*
    if (isUndef(the_classname))// This should never happen
    { 
    	logP3Msg("process_access_interface", "SAMIF", "Classname is undefined!!! and...");
    	logP3Msg("process_access_interface", "SAMIF", "...objectFullName is "+samObject[objectFullName]);
    }
     */
    //vll.L2AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    //vprn.L3AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    //ies.L3AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    //vpls.L2AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    //mirror.L2AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    //ipipe.L2AccessInterface -> ingressPolicyId, egressPolicyId, sasIngressPolicyId
    for (j=0; j<policy_fields.length; j++) 
    {
    	policyprop=policy_fields[j];

    	logP6Msg("process_access_interface", "SAMIF", "Policyprop: "+policyprop);
    	logP6Msg("process_access_interface", "SAMIF", "Classname: "+the_classname);
    	//equipment.PhysicalPort should qualify for field networkQueuePolicyName
    	if (isDef(samObject[policyprop]) & ( isDef(samObject.siteId) | isDef(samObject.nodeId))) 
    	{
	    
    		logP6Msg("process_access_interface", "SAMIF", "Processing policy from "+policyprop);
    		logP6Msg("process_access_interface", "SAMIF", "Classname: "+the_classname);
	    
    		//ies.L3AccessInterface --> ingressPolicyId
    		//ies.L3AccessInterface --> egressPolicyId
    		//Could equipment.PhysicalPort qualify the function call below???
    		//Yes!Physical port will return as "NetworkQueue" policy type
    		policytype=lookup_policy_type(the_classname, policyprop);
    		// This indicates this is a valid policy field for this class, as well as returning the policyType
    		if (isDef(policytype)) 
    		{ 
    			logP6Msg("process_access_interface", "SAMIF", "Policytype "+policytype);
		
    			siteid=samObject.siteId;
    			if (isUndef(siteid)) 
    			{
    				siteid=samObject.nodeId;
    			}
		
    			classkey = get_classkey(policytype, samObject[policyprop], siteid);
    			logP6Msg("process_access_interface", "SAMIF", "processing for classkey -> "+classkey);
		
    			// save it for later
    			if (samObject.madeCopy != true) 
    			{
    				accint_count = accint_count + 1;
    				if ((accint_count % 500) == 0) 
    				{
    					//debug//logP6Msg("accInt", "SAMIF", "New items processed: "+accint_count);
    				}
    				
    				if (isUndef(samObject.portIdentifyingName )) 
    				{
    					samObject.portIdentifyingName = samObject.portName;
    				}
    				obj_copy = accInt_to_copy(samObject);
    				store_accInt(classkey, obj_copy, policytype);
    			}
		
    			logP6Msg("process_access_interface", "SAMIF", "after storing ("+policytype+")");
		
    			qarray=fcQByType.findHashArray(classkey);
    			
    			if (isUndef(qarray))// Not found
    			{   
    				logP6Msg("process_access_interface", "SAMIF", "no queues found for "+classkey);
    			}
    			else 
    			{
    				// Fall through to here if we find a queue array (and don't end method)
		    
    				//	accInt_key_map[samObject.objectFullName] = classkey;
    				//equipment.PhysicalPort will not come into here
    				if (the_classname != "equipment.PhysicalPort") 
    				{
    					// Physical ports are created with the simple inventory routine and then
    					// this is called, because they are somewhat independent, rather than there
    					// being a strict requirement for the physical port (like for policies, etc.)
    					// before the object is created (unlike with access interfaces).
    					logP4Msg("process_access_interface", "SAMIF", "app_config_value('do_access_interface_inventory') -> " + app_config_value('do_access_interface_inventory'));
    					if (app_config_value('do_access_interface_inventory'))//Dependent on AVAIL_ACTIVE
                        {
    						accIntSubelement(samObject, modelInterface);
                        }

    				}
    				
    				//This is new implementation in 2.12.2 fixpack
    				var temp, flag;
    				sapflag = PV.configuration.APP.SAPLAGLOOKUP;
    				logP6Msg("process_access_interface", "SAMIF", " sapflag :: "+sapflag )
    			    	if(isDef (samObject.portName)){
    			    		temp = samObject.portName;
    				    	logP6Msg("process_access_interface", "SAMIF", "portName :: "+temp);
    				    	logP6Msg("process_access_interface", "SAMIF", "portName :: "+samObject.objectFullName);
    				    	flag = false; //PP-LAG
    				    	//if (temp.toLowerCase().indexOf("lag") != -1 && sapflag == "TRUE") {
    				    	if (temp.toLowerCase().indexOf("lag") != -1 ) {
    						logP6Msg("process_access_interface", "SAMIF", "portName :: "+temp + "setting flag true.......");
    						logP6Msg("process_access_interface", "SAMIF", "portName :: "+samObject.objectFullName);

    				    		//lag element found sap : lag  		
    				    		flag = true;		    		
    				    	}
    			    	}
    				

    				//obj[classKey][n - m] ={}
    				logP6Msg("process_access_interface", "SAMIF", "Need to process " + qarray.length + "queues");
    				for (i=0; i<qarray.length; i++) 
    				{
    					qentry=qarray[i];
    					logP6Msg("process_access_interface", "SAMIF", "Looking into qentry");
    					dump_samObject(qentry);
    					
//    					//if ((qentry.queue_set == true) && (qentry.fc_set == true)) {
//    					if ((qentry.queue_set == true)) 
//    					{
//    						logP6Msg("process_access_interface", "SAMIF", "queue -> " + qentry.entryId);
//    						//05 April 2013: entryId is created upon findHashArrayEntry call
//    						qentrySubelement(qentry, samObject, modelInterface, the_classname, siteid);
//    					} 
//    					else 
//    					{
//    						logP6Msg("process_access_interface", "SAMIF", "skipping queue -> " + qentry.entryId);
//    					}
    					
    					if ((qentry.queue_set == true)) {
    						logP6Msg("prashant123", "SAMIF", "Policy Type in service interface before flag check ::: " + qentry.samPolicyType);
    						if (flag == true){
    							var temp_key, key;
    							var Str1 = samObject.portName.toLowerCase();
    							var Str2 = samObject.siteId;		
    							if (isUndef(Str2)) {
    								Str2=samObject.nodeId;
    							}					
    							if (Str1.indexOf("-") != -1){
    							   key = Str2 + "-" + Str1.substring(Str1.indexOf("-"),(Str1.length)); 
    							}else{
    								temp_key = Str1.match(/\d+/);
    								key = Str2 + "-" + parseInt(temp_key[0], 10);
    							}
    							logP6Msg("Prashant54321", "SAMIF", "key --->>> "+key);
    							var lags = LAG_LOOKUP[key];
    							logP6Msg("Prashant54321", "SAMIF", "lags --->>> "+lags);
    							if(isDef(lags)){ 
    								for (k=0; k< lags.length; k++ ){
    									logP6Msg("process_access_interface", "SAMIF", "queue for ingress egress"+qentry.entryId);
    								    logP6Msg("prashant223", "SAMIF", "Policy Type in service interface before call to qentry subele flag is true ::: " + qentry.samPolicyType);
    								    logP3Msg("prashant223", "SAMIF", "ports for portarray in for loop:: "+  lags[k]);
    								    qentrySubelement(qentry, samObject, modelInterface, the_classname, siteid, lags[k]);
    								}
    							} 
    							    //qentrySubelement(qentry, samObject, modelInterface, the_classname, siteid);
    						} // end of flag=true
    						else{
    							logP6Msg("process_access_interface", "SAMIF", "queue "+qentry.entryId);
    						    logP6Msg("prashant223", "SAMIF", "Policy Type in service interface before call to qentry subele flag is false ::: " + qentry.samPolicyType);
    							qentrySubelement(qentry, samObject, modelInterface, the_classname, siteid);
    						}
    					} else {
    					    logP6Msg("process_access_interface", "SAMIF", "skipping queue "+qentry.entryId);
    					    logP6Msg("Prashant123", "SAMIF", "skipping queue "+qentry.samPolicyType);
    					    
    					}
    					
    					
    				} // for all queues
    			} // else found
    		} // isDef(policytype)
    	} 
    	else
    	{
    		//policyprop
    		logP6Msg("process_access_interface", "SAMIF", policyprop + " is no found in current Access Interface Data Object.");
    	}// isDef (policyprop && siteId)
    	logP6Msg("process_access_interface", "SAMIF", "end of Policyprop loop for "+policyprop);
    } // for (policyprop)
    
    
}  // process_access_interface 

//03 April 2013: Responsible for Service and Netw Queues creation after SAP creation
function qentrySubelement(qentry, samObject, modelInterface, classname, siteId, pName) {

    var i, j;
    var subelement;
    var element;
    var trafstring;
    var physical_port;
    var policyField;
    var name, sename;

    /*
      logP6Msg("process_access_interface", "SAMIF", "entering qentry subelement");
      logP6Msg("process_access_interface", "SAMIF", "classname is "+classname);
    */

    if (classname == "equipment.PhysicalPort") 
    {
    	physical_port = true;

    	if (samObject.networkQueuePolicyCapable == false) 
    	{
    		logP6Msg("process_aingr_aengr_queue", "SAMIF", "no network queue creation - port not networkQueuePolicytCapable");
    		return;
    	}

    	if ((samObject.mode != "network") && (samObject.mode != "hybrid")) 
    	{
    		logP6Msg("process_aingr_aengr_queue", "SAMIF", "no network queue creation - not a network port");
    		return;
    	}

    } 
    else 
    {
    	//therefore it is a SAP
    	if (isUndef(samObject.portIdentifyingName))//E.g. 1/1/7. portName -> Port 1/1/7
    	{
    		logP6Msg("process_aingr_aengr_queue", "SAMIF", "deferring queue creation - port unassigned for"+samObject.objectFullName);
    		return;
    	}
		
    	if (samObject.portIdentifyingName == "N/A") 
    	{
    		logP6Msg("process_aingr_aengr_queue", "SAMIF", "deferring queue creation - port N/A (unassigned) for"+samObject.objectFullName);
    		return;
    	}
    }

    //debug nilStatus("qentry", qentry);
    //debug logStatus("qentry.samPolicyType", qentry.samPolicyType);
    //debug logStatus("qentry.samContainingPolicyId", qentry.samContainingPolicyId);
    //debug logStatus("qentry.samId", qentry.samId);

    /*
      logStatus("physical_port", physical_port);
      logStatus("nodeId", samObject.nodeId);
      logStatus("qentry.policyField", qentry.policyField);

      logStatus("samObject.portIdentifyingName", samObject.portIdentifyingName);

      dump_queue_properties(qentry);
    */
    policyField=reverse_aingr_aengr_queue_Name[qentry.policyField];//E.g. policyField -> containingPolicyId / containingPolicyName
    //E.g. policyField -> samContainingPolicyId
    //debug	logP4Msg("service_access_interface", "SAMIF", "before subelement");

	if(isDef(pName)){
		logP6Msg("PRA221", "SAMIF", "before subname call samPolicyType... :: " + qentry.samPolicyType);
		sename = SEname_from_qentry_accInt(qentry, samObject, classname, siteId, pName);
	}else{
		logP6Msg("PRA221", "SAMIF", "before subname call samPolicyType else... :: " + qentry.samPolicyType);
		sename = SEname_from_qentry_accInt(qentry, samObject, classname, siteId);
	}
    
    //sename = SEname_from_qentry_accInt(qentry, samObject, classname, siteId);
    //subelement.name = "5620SAM_queue_"+samObject.nodeId+"_"+qentry.samPolicyType+"_"+qentry.samContainingPolicyId.toString()+"_"+samObject.portIdentifyingName+"-"+qentry.samId;
    subelement = OPERATOR.subelementNamedOrNew(sename);
    //logP4Msg("process_aingr_aengr_queue", "DEBUG", "Subelement of interest -> " + subelement);

    // This part is the class-specific variation
    if (physical_port == true) 
    {
    	//logP4Msg("process_aingr_aengr_queue", "DEBUG", "Within NQueue");
    	name = "5620SAM_NQueue_node_"+siteId;//Element name!!!
    	subelement.family = "5620_SAM_NQueue";

    	var simplePortName = samObject.siteId + "_" + samObject.shelfId + "/" + samObject.cardSlotId + "/" + samObject.daughterCardSlotId + "/" + samObject.portId;
    	//var simplePortName = samObject.siteId + "_" + samObject.shelfId.toString() + "/" + samObject.cardSlotId.toString() + "/" + samObject.daughterCardSlotId.toString() + "/" + samObject.portId.toString();

    	if (isConfig("inv_uses_names")) 
    	{
    		subelement.label = samObject.siteName+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"-"+qentry.samId;
    	} 
    	else 
    	{
    		subelement.label = siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"-"+qentry.samId;
    	}

    	// This is the monitoredObjectPointer used in the network queue stats files
	
    	//subelement.alt_idmap = samObject.objectFullName+"_"+qentry.samId.toString();
    	_alt_idmap = samObject.objectFullName+"_"+qentry.samId.toString();
    	//03 April 2013: <physical_port_objectfullname> + <queueId>
    	//logP4Msg("process_aingr_aengr_queue", "DEBUG", "_alt_idmap -> " + _alt_idmap);
    	//subelement.addProperty("alt_idmap", subelement.alt_idmap);
    	subelement.addProperty("alt_idmap", _alt_idmap.toString());
    	//logP4Msg("process_aingr_aengr_queue", "DEBUG", "After subelement.addProperty('alt_idmap', subelement.alt_idmap); -> " + subelement.alt_idmap);
	
    	subelement.addProperty("samProvisoPortName", simplePortName);
    	//03 April 2013: E.g. <portName>2/1/51</portName>
    	
    	//This property added for TCR enablement, it will be use for Cognos resource grouping
    	subelement.addProperty("samFamilyName", "5620_SAM_NQueue");

    } 
    else 
    {
    	//access interfaces //aka Service Queues	    
    	//Maybe the element should be more of a service element instead of the network node.  But we would need to construct it, probably to make it the same as the service element used by the Accessinterfaces
    	//element.name = "5620SAM_aingr_queue_"+samObject.samNodeId+"_"+samObject.policyType+"_"+samObject.containingPolicyId+"_"+samObject.id;

    	logP4Msg("process_aingr_aengr_queue", "DEBUG", "Within AingrAengrQueue");
    	
    	name = "5620SAM_Service_node_"+siteId;//Element name!!!
    	subelement.family = "5620_SAM_AingrAengrQueue";
    	if (isConfig("inv_uses_names")) 
    	{
    		if (isDef(pName)){
    			subelement.label = samObject.nodeName+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"_"+pName+"-"+qentry.samId;
    		}else{
    			subelement.label = samObject.nodeName+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"-"+qentry.samId;
    		}
    		
    	} 
    	else 
    	{
    		if (isDef(pName)){
    			subelement.label = siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"_"+pName+"-"+qentry.samId;
    		}else{
    			subelement.label = siteId+"_"+qentry.samPolicyType+"_"+qentry[policyField]+"_"+samObject.portIdentifyingName+"-"+qentry.samId;
    		}
    		
    	}
    	
    	if (isDef(pName)){
    		logP6Msg("PRA222", "SAMIF", " samSAPBased :: " + pName);
    		subelement.addProperty("samSAPBased", "lag.Interface");
    		logP6Msg("prashant123", "SAMIF", "Policy Type in samSAPBased loop ::: " + qentry.samPolicyType);
    	}else{
    		logP6Msg("PRA222", "SAMIF", " samSAPBased else :: " + pName);
    		logP6Msg("prashant123", "SAMIF", "Policy Type in samSAPBased loop ::: " + qentry.samPolicyType);
    		subelement.addProperty("samSAPBased", "equipment.Physicalport");
    	}
    	

    	if (isDef(pName)){
    		logP6Msg("PRA224", "SAMIF", "in idmap :: " + pName);
    		logP6Msg("PRA224", "SAMIF", "in idmap samPolicyType:: " + qentry.samPolicyType);
    		_alt_idmap = samObject.objectFullName+"-"+qentry.samPolicyType+"-"+pName+"-"+qentry.samId.toString();
    	}else{
    		logP6Msg("PRA224", "SAMIF", "in idmap else :: " + pName);
    		logP6Msg("PRA224", "SAMIF", "in idmap samPolicyType else:: " + qentry.samPolicyType);
    		_alt_idmap = samObject.objectFullName+"-"+qentry.samPolicyType+"-"+qentry.samId.toString();
    	}
    	
    	
    	// This is the data available in the metric file for the access interfaces
	
    	//subelement.alt_idmap = samObject.objectFullName+"-"+qentry.samPolicyType+"-"+qentry.samId.toString();
    	//_alt_idmap = samObject.objectFullName+"-"+qentry.samPolicyType+"-"+qentry.samId.toString();
    	//logP4Msg("process_aingr_aengr_queue", "DEBUG", "_alt_idmap -> " + _alt_idmap);
    	//subelement.addProperty("alt_idmap", subelement.alt_idmap);
    	subelement.addProperty("alt_idmap", _alt_idmap.toString());
    	//logP4Msg("process_aingr_aengr_queue", "DEBUG", "After subelement.addProperty('alt_idmap', subelement.alt_idmap); -> " + subelement.alt_idmap);
	
    	//This property added for TCR enablement, it will be use for Cognos resource grouping
    	subelement.addProperty("samFamilyName", "5620_SAM_AingrAengrQueue");
    }

    //dump_samObject(samObject);
    /*
      logP4Msg("service_access_interface", "SAMIF", "label is: "+subelement.label);
      logP4Msg("service_access_interface", "SAMIF", "name is: "+subelement.name);
    */
        
    element = OPERATOR.elementNamedOrNew(name);
    //logP4Msg("service_access_interface", "SAMIF", "Element of interest -> "+element);
    
    element.state = true;
    element.origin = "SAM";

    // Because we have the service stats on the second collector
    element.collectorNumber = accounting_stats_collector;


    //debug	logP4Msg("service_access_interface", "SAMIF", "after name");

    subelement.state = true;
    subelement.origin = "SAM";
    //	subelement.invariant = qentry.samObjectFullName;  // this is the name of the SAM queue object
    //	subelement.instance = qentry.samObjectFullName;

    //	subelement.invariant = subelement.alt_idmap;  // this is the name of the SAM queue object
    // Took this out because it was problematic with switching policies.
    //	subelement.instance = subelement.alt_idmap;

    subelement.instance = subelement.name;
    logP4Msg("service_access_interface", "DEBUG", "[Within qentrySubelement]samObject.timestamp -> "+samObject.timestamp);
    //subelement.timestamp = samObject.timestamp;
    
	subelement.addProperty("nmVendor", "Alcatel5620SAM");

    var castarray = {1:"unicast", 2:"multicast", 3:"broadcast", 4:"othercast", 5:"defaultcast"};
    var castabbrev = {1:"U", 2:"M", 3:"B", 4:"O", 5:"D"};
    var fcarray = ["be", "l2", "af", "l1", "h2", "ef", "h1", "nc"];

    trafstring = "";
    j=0;
    for (i in fcarray) 
    {
    	//debug		logP4Msg("service_access_interface", "SAMIF", "forwarding class "+fcarray[i]);
    	if (isDef(qentry[fcarray[i]])) 
    	{
    		//debug		logP4Msg("service_access_interface", "SAMIF", "forwarding class "+fcarray[i]+" is defined.");
    		//debug		logP4Msg("service_access_interface", "SAMIF", "forwarding class "+fcarray[i]+" is "+qentry[fcarray[i]]);
    		if (qentry[fcarray[i]] > 0) 
    		{
    			if (j == 0) 
    			{
    				trafstring = fcarray[i];
    				j = 1;
    			}
    			else 
    			{
    				trafstring = trafstring + " " + fcarray[i];
    			}
    		}  // > 0
    	} // isDef
    } // for

    if (j==0) 
    {
    	// nothing found
    	trafstring = qentry.def_fc;
    	//debug		logP4Msg("service_access_interface", "SAMIF", "using default forwarding class");
    	//debug		logP4Msg("service_access_interface", "SAMIF", "using default forwarding class: "+qentry.def_fc);
    }
    
    subelement.addProperty("samForwardingClass", trafstring);

    trafstring = "";

    for (i in castarray) 
    {
    	//debug		logP4Msg("service_access_interface", "SAMIF", "traffic");
    	//debug		logP4Msg("service_access_interface", "SAMIF", "traffic "+i);
    	//debug 		logStatus(castarray[i], qentry[castarray[i]]);
    	if (isDef(qentry[castarray[i]])) 
    	{
    		if (qentry[castarray[i]] == true) 
    		{
    			//debug				logP4Msg("service_access_interface", "SAMIF", "traffic i is:" + i);
    			//debug				logP4Msg("service_access_interface", "SAMIF", "traffic: found " + castarray[i]);
    			trafstring = trafstring + castabbrev[i];
    		} // true
    	} // isDef
    }

    subelement.addProperty("samTrafficTypes", trafstring);

    //debug	logP4Msg("service_access_interface", "SAMIF", "traffictypes:"+trafstring);

    var aingr_aengr_queue_new_property_first_level  = '';
    var aingr_aengr_queue_new_property_second_level = '';
    var containing_policy_id = '';
    var policy_type = '';

    // Get the properties from the SAM queue object (stored earlier)
    for( var i in aingr_aengr_queue_Name) 
	{
	    if ( qentry[i] != undefined )
		{
		    subelement.addProperty( i.toString(), qentry[i].toString() );
		    logP6Msg("service_access_interface", "SAMIF", "(queue) property: " +i.toString() + " value: " +qentry[i].toString());

            if (i == 'samPolicyType')
            {
                policy_type = qentry[i].toString();
            }
            if (i == 'samContainingPolicyId')
            {
                containing_policy_id = qentry[i].toString();
            }
		}
	}


    if (policy_type.toLowerCase() == 'accessingress' || policy_type.toLowerCase() == 'accessegress')
    {
        aingr_aengr_queue_new_property_first_level  = policy_type + '_' + containing_policy_id;
        aingr_aengr_queue_new_property_second_level = policy_type + '_' + containing_policy_id;
    }

    var node_id               = '';
    var port_name             = '';
    var port_identifying_name = '';

    // Get the properties from the access interface object
    for( var i in reverse_svc_access_interface_Name) 
	{
	    logP6Msg("service_access_interface", "SAMIF", "(sap) i is: " + i.toString());
	    if ( samObject[i] != undefined )
		{
		    if (qentry[i] == undefined) {   // If we didn't use the same name for the queue property
			subelement.addProperty( reverse_svc_access_interface_Name[i].toString(), samObject[i].toString() );
			logP6Msg("service_access_interface", "SAMIF", "(sap) property: " +reverse_svc_access_interface_Name[i].toString() + " value: " +samObject[i].toString());
                if (i == 'nodeId')
                {
                    node_id = samObject[i].toString();
                }
                if (i == 'portName')
                {
                    port_name = samObject[i].toString();
                }
                if (i == 'portIdentifyingName')
                {
                    port_identifying_name = samObject[i].toString();
                }
		    } else 
		    {
		    	logP6Msg("service_access_interface", "SAMIF", "(sap) property: " +i.toString() + " already in queue");
		    }
		} else 
		{
			logP6Msg("service_access_interface", "SAMIF", "(sap) property: " +i.toString() + " unrepresented");
	    }
	}

    if (
    		aingr_aengr_queue_new_property_first_level != '' && 
    		aingr_aengr_queue_new_property_second_level != ''
    )
    {
        aingr_aengr_queue_new_property_first_level = node_id + '_' + aingr_aengr_queue_new_property_first_level + '_' + port_name;//Port 1/1/4
        aingr_aengr_queue_new_property_second_level = node_id + '_' + aingr_aengr_queue_new_property_second_level + '_' + port_identifying_name;//1/1/4:6
	    subelement.addProperty( "samPN", aingr_aengr_queue_new_property_first_level);
	    subelement.addProperty( "samPIN", aingr_aengr_queue_new_property_second_level);
    }

    // Get the properties from the equipment physical interface object
   if (physical_port == true) 
   {
        for( var i in reverse_equipment_physical_port_Name)
        {
            logP6Msg("service_access_interface", "SAMIF", "physical port (sap) i is: " + i.toString());
            if ( samObject[i] != undefined )
            {
                if (qentry[i] == undefined)// If we didn't use the same name for the queue property 
                {   
                    subelement.addProperty( reverse_equipment_physical_port_Name[i].toString(), samObject[i].toString() );
                    logP6Msg("service_access_interface", "SAMIF", "physical port (sap) property: " + reverse_equipment_physical_port_Name[i].toString() + " value: " + samObject[i].toString());
                } 
                else 
                {
                    logP6Msg("service_access_interface", "SAMIF", "physical port (sap) property: " +i.toString() + " already in queue");
                }
            } 
            else 
            {
            	logP6Msg("service_access_interface", "SAMIF", "physical port (sap) property: " +i.toString() + " unrepresented");
            }
        }
    }

    // These are treated separately since they take priority over the administrativeState and
    // operationalState

    if(isDef(samObject.l3InterfaceAdministrativeState)) 
    {
    	subelement.addProperty( "samAdministrativeState", samObject.l3InterfaceAdministrativeState);
    }
	    
    if(isDef(samObject.l3InterfaceOperationalState)) 
    {
    	subelement.addProperty( "samOperationalState", samObject.l3InterfaceOperationalState);
    }
	    

    if(isDef(samObject.subscriberName)) 
    {
    	var subname;
    	if (samObject.subscriberName.toString() == "N/A") 
    	{
    		if (isDef(samObject.subscriberId)) 
    		{
    			subname = "Subscriber #"+samObject.subscriberId.toString()+" (unnamed)";
    		} 
    		else 
    		{
    			subname = "unnamed subscriber";
    		}
    	} 
    	else 
    	{
    		subname = samObject.subscriberName.toString();
    	}
    	
    	subelement.addProperty("samSubscriberName", subname);
    } 
    else 
    {
    	subelement.addProperty("samSubscriberName", "Unnamed Subscriber");
    }

    /*
      logP4Msg("service_access_interface", "SAMIF", "adding subelement");
      logStatus("subelement.name", subelement.name);
      logStatus("subelement.instance", subelement.instance);
      logStatus("subelement.invariant", subelement.invariant);
    */

    //subelement.timestamp = modelInterface.currentDate;
    logP4Msg("service_access_interface", "DEBUG", "[Within qentrySubelement 2]samObject.timestamp -> "+samObject.timestamp);
    //subelement.timestamp = samObject.timestamp;
    subelement.element = element;

    //element.addSubelement(subelement);				
    //subelement.commit();
    //possible_inline_commit(modelInterface);

    //logP4Msg("service_access_interface", "SAMIF", "qentry subelement exiting");
}

function accIntSubelement(samObject, modelInterface) {

    var i, j;
    var subelement;
    var element;
    var trafstring;
    var accountingPolicyId;
    var name, sename;
 
    name = "5620SAM_Service_node_"+samObject.nodeId;
    element = OPERATOR.elementNamedOrNew(name);

    //logP4Msg("service_access_interface", "SAMIF", "Element of interest -> " + element);
    
    element.state = true;
    element.origin = "SAM";

    // Because we have the service stats on the second collector
    element.collectorNumber = accounting_stats_collector;


    //	subelement.name = "5620SAM_service_"+samObject.nodeId+"_"+samObject.accountingPolicyName+"_"+samObject.accountingPolicyId.toString()+"_"+samObject.portIdentifyingName;

    sename = "5620SAM_accInt_"+samObject.objectFullName;
    subelement = OPERATOR.subelementNamedOrNew(sename);
    //logP4Msg("service_access_interface", "SAMIF", "Subelement of interest -> " + subelement);
    
    subelement.addProperty("samObjectFullName", samObject.objectFullName);

    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_ServiceAccessInterface";
    subelement.instance = subelement.name;
    logP4Msg("service_access_interface", "DEBUG", "[Within accIntSubelement]samObject.timestamp -> "+samObject.timestamp);
    //subelement.timestamp = samObject.timestamp;
    
    /*
    nilStatus("samObject", samObject);
    nilStatus("samObject.nodeName", samObject.nodeName);
    nilStatus("samObject.nodeId", samObject.nodeId);
    nilStatus("samObject.accountingPolicyId", samObject.accountingPolicyId);
    nilStatus("samObject.portIdentifyingName", samObject.portIdentifyingName);
    */

    //debug	dump_samObject(samObject);

    if (isConfig("inv_uses_names")) 
    {
    	//logP4Msg("service_access_interface", "SAMIF", "inv uses names");
    	subelement.label = "SAP_"+samObject.serviceId+"_"+samObject.nodeName+"_"+samObject.nodeId+"_"+samObject.portIdentifyingName;
    } 
    else 
    {
    	//logP4Msg("service_access_interface", "SAMIF", "inv_doesn't use names");
    	subelement.label = "SAP_"+samObject.serviceId+"_"+samObject.nodeId+"_"+samObject.portIdentifyingName;
    }
    //logP4Msg("service_access_interface", "SAMIF", "label is: "+subelement.label);


    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_ServiceAccessInterface");

    //Get the properties from the access interface object
    for( var i in reverse_svc_access_interface_Name) 
	{
	    if ( samObject[i] != undefined )
		{
		    subelement.addProperty( reverse_svc_access_interface_Name[i].toString(), samObject[i].toString() );
		}
	}


    //These are treated separately since they take priority over the administrativeState and
    //operationalState

    if(isDef(samObject.l3InterfaceAdministrativeState)) 
    {
    	subelement.addProperty( "samAdministrativeState", samObject.l3InterfaceAdministrativeState);
    }
	    
    if(isDef(samObject.l3InterfaceOperationalState)) 
    {
    	subelement.addProperty( "samOperationalState", samObject.l3InterfaceOperationalState);
    }
	    
    if(isDef(samObject.subscriberName)) 
    {
    	var subname;
    	if (samObject.subscriberName.toString() == "N/A") 
    	{
    		if (isDef(samObject.subscriberId)) 
    		{
    			subname = "Subscriber #"+samObject.subscriberId.toString()+" (unnamed)";
    		} 
    		else 
    		{
    			subname = "Unnamed Subscriber";
    		}
    	} 
    	else 
    	{
    		subname = samObject.subscriberName.toString();
    	}
    	
		subelement.addProperty("samSubscriberName", subname);
    } 
    else 
    {
    	subelement.addProperty("samSubscriberName", "Unnamed Subscriber");
    }

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);				
    //subelement.commit();
    //possible_inline_commit(modelInterface);
    //logP4Msg("service_access_interface", "SAMIF", "exiting");
}

function store_accInt(classkey, samObject, policy_type) 
{
    var objectFullName = samObject.objectFullName.toString();
    var i;
    var kentry;
    var found=false;
    var len;
    var grepos;

    //debug nilStatus("samObject", samObject);
    //debug logStatus("classkey", classkey);
    //debug logStatus("objectFullName", objectFullName);
    //debug //logStatus("accInt_by_policy[classkey]", accInt_by_policy[classkey]);

    if (isUndef(accInt_by_policy[classkey])) 
    {
    	accInt_by_policy[classkey] = new Array();//E.g. <classkey>:[ <SAP ObjFN>, <SAP ObjFN>, ... ]
    }

    kentry=accInt_by_policy[classkey];
    grepos=object_keymap[policy_type];

    if (isUndef(grepos)) 
    {
    	logP3Msg("store_accInt", "SAMIF","Unknown policy : " + policy_type);
    	return;
    }

    if (isUndef(grepos[objectFullName]))//not stored by policy in the appropriate repository 
    { 
    	i = kentry.length;//E.g. 0
    } 
    else 
    {
    	len = kentry.length;
    	for (i=0; i<len; i++) 
    	{
    		//debug//logP6Msg("accInt", "SAMIF","entry "+i);
    		if ((kentry[i].toString()) == (objectFullName.toString())) 
    		{
    			//debug//logP6Msg("accInt", "SAMIF","found the entry: "+i);
    			found = true;
    			break;
    		} 
    		else 
    		{
    			//debug//logP6Msg("accInt", "SAMIF", "first : *"+kentry[i]+"*"+" length: "+kentry[i].length);
    			//debug//logP6Msg("accInt", "SAMIF", "second: *"+objectFullName+"*"+" length: "+objectFullName.length);
    			//debug//logP6Msg("accInt", "SAMIF", "no match: index "+i+" classkey "+classkey+" wrong objectFullName: "+kentry[i]);
    		}
    	}//for 
    }//else it is stored
	
    //debug		logP6Msg("accInt", "SAMIF", "setting entry as index "+i+" for classkey "+classkey+" objectFullName "+objectFullName);
    //debug//	logP6Msg("accInt", "SAMIF","before kentry set");
    kentry[i] = objectFullName;
    //debug//	logP6Msg("accInt", "SAMIF","before acciInt_by_Policy set");
    accInt_by_policy[classkey]=kentry;
    //	nilStatus("accInt_storage[objectFullName]", accInt_storage[objectFullName]);
    //debug//	logP6Msg("accInt", "SAMIF","before accInt_storage set");
    logP6Msg("accInt", "SAMIF","samObject.timestamp -> " + samObject.timestamp);
    accInt_storage[objectFullName] = samObject;
    //debug//	logP6Msg("accInt", "SAMIF","after accInt_storage set");
    grepos[samObject.objectFullName] = classkey;//<objFN> = <classkey>//classKey <ip>-<policyId>-<policyType>


    /*
     repos_count_policy = repos_count_policy + len;
     if (accInt_by_policy.logCount > 6) {
     //debug		logP6Msg("accInt", "SAMIF","Consolidating accInt_by_policy array elements: "+repos_count_policy);
     accInt_by_policy.consolidate();
     repos_count_policy = 0;
     }

     repos_count_storage = repos_count_storage + len;
     if (accInt_storage.logCount > 6) {
     //debug		logP6Msg("accInt", "SAMIF","Consolidating accInt_storage elements: "+repos_count_storage);
     accInt_storage.consolidate();
     repos_count_storage = 0;
     }
    */

    //debug	logP6Msg("accInt", "SAMIF","end of store");
}




function accInt_isStored(objectfullname) 
{
    return(isDef(accInt_storage[objectfullname.toString()]));
}

//05 April 2013: Wrapper function to call process_access_interface
function process_stored_AccInt(classkey, modelInterface) {

    var i;
    var kentry;
    var fullname;

    //debug	logP5Msg("service_access_interface", "SAMIF", "entering process_stored_AccInt: "+classkey);
    if (isUndef(accInt_by_policy[classkey])) 
    {
    	//debug		
    	logP5Msg("service_access_interface", "SAMIF", "No stored AccInts found for: "+classkey);
    }
    else 
    {	//accInt_by_policy should be populated from service_access_interface
    	kentry = accInt_by_policy[classkey];
    	for (i=0; i<kentry.length; i++) 
    	{
    		fullname = kentry[i].toString();
    		//debug			
    		//logP5Msg("service_access_interface", "SAMIF", "Processing stored AccInt: "+classkey+" "+fullname);
    		if (accInt_isStored(fullname)) 
    		{
    			process_access_interface(accInt_storage[fullname], modelInterface);
    		}
    		else
    		{
    			//debug				
    			logP4Msg("service_access_interface", "SAMIF", "Unable to find!! AccInts: "+i);
    		}
    	}
    }
    //debug		logP5Msg("service_access_interface", "SAMIF", "Finished process_stored_AccInt");
}

function accInt_to_copy(samObject) {

    var obj = new Object();
    var i;
    var j=0;
    var additional_fields=["siteId", "networkQueuePolicyCapable"];

    logP6Msg("accInt_to_copy", "SAMIF", "Entered");

    //dump_samObject(samObject);


    obj.madeCopy=true;

    //	obj.ingressPolicyId = samObject.ingressPolicyId;
    //	obj.egressPolicyId = samObject.egressPolicyId;

    obj.classname = samObject.classname;
    logP4Msg("accint_to_copy", "DEBUG", "samObject.timestamp -> " + samObject.timestamp);
    obj.timestamp = samObject.timestamp;
    logP4Msg("accint_to_copy", "DEBUG", "obj.timestamp -> " + obj.timestamp);
    
	for( var i in reverse_equipment_physical_port_Name) 
	{
	    if ( samObject[i] != undefined )
		{
		    j=j+1;
		    obj[i.toString()]=samObject[i.toString()];
		}
			
	}
	
    for( var i in reverse_svc_access_interface_Name) 
	{
	    if ( samObject[i] != undefined )
		{
		    j=j+1;
		    obj[i.toString()]=samObject[i.toString()];
		}
			
	}

    for (k=0; k<policy_fields.length; k++)
	{
	    i=policy_fields[k];
	    //debug		logP4Msg("accint_to_copy", "SAMIF", "Policy field: "+i);
	    if ( samObject[i] != undefined )
		{
		    //debug			logP4Msg("accint_to_copy", "SAMIF", "Copying field: "+i);
		    j=j+1;
		    obj[i.toString()]=samObject[i.toString()];
		}
			
	}

    for (k=0; k<additional_fields.length; k++)
	{
	    i=additional_fields[k];
	    //debug		logP4Msg("accint_to_copy", "SAMIF", "Additional field: "+i);
	    if ( samObject[i] != undefined )
		{
		    //debug			logP4Msg("accint_to_copy", "SAMIF", "Copying field: "+i);
		    j=j+1;
		    obj[i.toString()]=samObject[i.toString()];
		}
			
	}


    //dump_samObject(obj);
	return obj;
}

// This doesnt work because you can't iterate over the objects/properties in a repository
function dump_accInt_storage() {

    var i,j,kentry;

    for (i in accInt_by_policy) {
	//debug		logP5Msg("dump_accInt_storage", "SAMIF", "classkey: "+i.toString());
	if (isUndef(accInt_by_policy[i])) {
	    //debug		logP5Msg("dump_accInt_storage", "SAMIF", "classkey: "+i.toString()+" is undefined!!!");
	} else
	    kentry=accInt_by_policy[i];
	for (j=0; j<kentry.length; j++) {
	    //debug			logP5Msg("dump_accInt_storage", "SAMIF", "classkey: "+i.toString()+" "+j.toString()+" "+kentry[j].toString());
	}
    }
}

function propChange_service_access_interface(className, objectName, propColl, propArray, mapArray) {

    var classkey, newclasskey;
    var ing_change, eg_change;
    var j;
    var changed, mapped;
    var propName, newvalue, oldvalue;
    var accInt;	
    var policy_change, changed_hash;
    var policy_type, nqueue_sig;

    accInt = accInt_storage[objectName];
    if (isUndef(accInt)) 
    {
    	logP6Msg("propChange_service_access_interface", "SAMIF", "Exiting: Unable to find stored accInt " + objectName);
    	return;
    }//debug	dump_samObject(accInt);
    
    //Update timestamp
    logP6Msg("propChange_service_access_interface", "SAMIF", "FROM accInt.timestamp -> " + accInt.timestamp);
    accInt.timestamp = ParseTimestamp(propColl[0]["mtosiTime"]);
    logP6Msg("propChange_service_access_interface", "SAMIF", "TO accInt.timestamp -> " + accInt.timestamp);
    
    for( j in propColl)
	{    
    	propName = propColl[j].attributeName;
	    if (isDef(propName)) 
	    {
	    	propName=propName.toString();
	    }

	    //debug logP6Msg("propChange_service_access_interface", "SAMIF", "Checking for: "+propName);	
	    //policy_type = lookup_policy_type(className, propName);
	    
	    if (isPolicyField(propName))//a policy ID property aka ingressPolicyId, egressPolicyId, sasIngressPolicyId, containingPolicyId, networkQueuePolicyName
	    //E.g. Policy change like ingress to egress//Or ingress 1 to ingress 2
	    {  
	    	logP6Msg("propChange_service_access_interface", "SAMIF","Detected policy change parameter "+propName+" for class "+className);
	    	policy_change = true;
	    }

	    if (network_queue_significant[propName]) 
	    {
	    	nqueue_sig=true;
	    }
	    
	    //logP6Msg("propChange_service_access_interface", "SAMIF","propArray[propName] -> " + propArray[propName]);
	    if (isDef(propArray[propName]))
	    {
	    	//if (isDef(reverse_svc_access_interface_Name[propName]) || isDef(policy_type))
	    	// a regular property we care about
		    //debug//logP6Msg("propChange_service_access_interface", "SAMIF", "Working on: "+propName);	
		     
		    newvalue = propColl[j].newvalue;
		    if (isDef(newvalue)) 
		    {
		    	newvalue=newvalue.toString();
		    }
		     
		    oldvalue = propColl[j].oldvalue;
		    if (isDef(oldvalue)) 
		    {
		    	oldvalue=oldvalue.toString();
		    }
		     
		    mapped=false;//Requires mapping function to get property values. E.g ENUM
		    if (isDef(mapArray[propName])) 
		    {
		    	accInt[propName]=mapArray[propName](objectName, propName, newvalue);
		    	//accInt[propName]=getServiceMappedPropString(objectName, propName, newvalue);
		    	if (isDef(accInt[propName])) 
		    	{
		    		mapped=true;
		    		changed=true;
		    	}
		    }
		    
		    if (mapped != true) 
		    {
		    	changed = true;
		    	accInt[propName]=newvalue;
		    }
		     
		    logP6Msg("propChange_service_access_interface", "SAMIF", objectName+"==>["+propName+"]::"+accInt[propName]);	
		    
		    //10 January 2013 - Update JMS timestamp
			if(propColl[j].timestamp)//aka record.timestamp = <int>
			{
				logP4Msg("propChange_service_access_interface", "SAMIF", "timestamp -> " + propColl[j].timestamp);
				accInt['timestamp'] = propColl[j].timestamp;
			}
			else
			{
				logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "timestamp is not set");
			}
			
			//SAP avail func
			if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
		    {
				logP6Msg("propChange_service_access_interface", "SAMIF", "SAP Avail Routine");
				var _temp = availabilityInputHandler(propColl[j], AVAIL_NAME_SPACES["ACCESS_INTERFACE"]);
				logP6Msg("propChange_service_access_interface", "DEBUG", "_temp -> " + _temp);
		    }
		}
	    else 
	    {
	    	logP6Msg("propChange_service_access_interface", "SAMIF", propName+": skipping");	
	    }
	} // for over propList
    //At this level, all SAPs related stuffs are completed!!!

    // we can get away with changing the policy IDs in the accInt because we don't actually
    // use those values until we call process_access_interface()
    if (policy_change == true) 
    {
    	for( j in propColl)
	    { 
    		propName = propColl[j].attributeName;
    		if (isDef(propName)) 
    		{
    			propName=propName.toString();
    		}

    		if (isPolicyField(propName))
    		{
    			policy_type = lookup_policy_type(className, propName);//E.g. egressPolicyId -> accessEgress
			     
    			if (isDef(policy_type)) 
    			{
    				logP5Msg("propChange_service_access_interface", "SAMIF", "Changing policy for " + objectName + "(" + className + ")" );
    				logP5Msg("propChange_service_access_interface", "SAMIF", "Policytype is: " + policy_type);

    				newvalue = propColl[j].newvalue;
    				if (isDef(newvalue)) 
    				{
    					newvalue=newvalue.toString();
    				}
				 
    				oldvalue = propColl[j].oldvalue;
    				if (isDef(oldvalue)) 
    				{
    					oldvalue=oldvalue.toString();
    				}
				 
    				logP5Msg("propChange_service_access_interface", "SAMIF", "Changing field "+ propName + " FROM [::" + oldvalue + "::] TO [::" + newvalue + "::]");//E.g egressPolicyId 9 -> 8

    				if (oldvalue != newvalue)//Is this to make sure there is REALLY a policy change???
    				{ 	//This should always be true I belive
    					accInt[propName] = newvalue;//Egress will only take egress, so as Ingress
    					logP5Msg("propChange_service_access_interface", "SAMIF", "AccInt[" + propName + "] : " + accInt[propName]);
    					grepos = object_keymap[policy_type];//{ObjFN -> classKey <ip>-<policyId>-<policyType>, ... }
    					
    					if (isDef(grepos)) 
    					{
    						classkey = grepos[objectName];//9-accessEgree-138.120.242.60
    						if (isUndef(classkey)) 
    						{
    							logP5Msg("propChange_service_access_interface", "SAMIF", "Exiting: Unable to find classkey for objectFullName '"+objectName+"' in policy type '" + policy_type + "'");
    							return;
    						}

    						newclasskey = classkey_switch_policy(classkey, oldvalue, newvalue);//E.g. New policyId -> 8
    						//delete grepos[objectName];//Supposingly changes to new classKey
    						grepos[objectName] = newclasskey;//Object reference working???
    						
    						access_interface_switch_policy(accInt, classkey, newclasskey, objectName, policy_type);
    						process_access_interface(accInt, modelInterface);//This is just for testing!
    						
    						for(var z in _svcQueuesToBeDeleted)
    						{
    							turn_off_queue_SE(_svcQueuesToBeDeleted[z]);
    						}
    						_svcQueuesToBeDeleted = new Array();
    					} // grepos
    				} // old != new
    			} // isdef(policyType)
    		} // isPolicyField
	    } // for
    } // policy_change
		 
    // This is to handle the case where the mode or networkQueuePolicyCapable properties are changed.  
    //In that case that network queues are no longer applicable, the queues are removed.
    if (nqueue_sig == true) 
    {
    	grepos = object_keymap[policy_type];
    	if (isDef(grepos)) 
    	{
    		classkey = grepos[objectName];
    		if (isUndef(classkey)) 
    		{
    			accInt_storage[objectName] = accInt;
    			turn_off_SEs_by_accInt(objectName, oldclasskey);
    			process_access_interface(accInt, modelInterface);
    		}
    	} //grepos
    } // nqueue_sig

    //When there is no policy changes but SAP property changes
    if (changed == true && isUndef(policy_change)) 
    {
    	// This is taken care of above when the policy switches.
    	// But if no policy switch occurs, you have to save the changes.
    	accInt_storage[objectName] = accInt;
    	process_access_interface(accInt, modelInterface);
    }
}

function access_interface_switch_policy(accInt, oldclasskey, newclasskey, objectName, gtype) 
{
    var old_by_policy, new_by_policy;
    var len, found = 0;

    //logP5Msg("accInt_propChange", "SAMIF", "entering access_interface_switch_policy");
    old_by_policy = accInt_by_policy[oldclasskey];
    //logP5Msg("accInt_propChange", "SAMIF", "after old_by_policy");

    if (isUndef(old_by_policy)) 
    {
    	logP3Msg("access_interface_switch_policy", "SAMIF", "Unable to lookup classkey '" + oldclasskey + "' for objectFullName '" + objectName + "'");
    	return;
    }
    //logP5Msg("accInt_propChange", "SAMIF", "after is undef");
    len = old_by_policy.length;

    //logP6Msg("access_interface_switch_policy", "SAMIF", "length: "+len);
    for (i=0; i<len; i++) 
    {
    	//logP6Msg("access_interface_switch_policy", "SAMIF", "i: "+i);
    	//logP6Msg("access_interface_switch_policy", "SAMIF", "testing: "+old_by_policy[i].toString());
    	//logP6Msg("access_interface_switch_policy", "SAMIF", "against: "+objectName.toString());
    	if ((old_by_policy[i].toString()) == (objectName.toString()))//Look for the objectFullName within classkey's object
    	{
    		found = 1;	break;
    	}
    }
    
    if (found == 0) 
    {
    	//debug
    	logP3Msg("access_interface_switch_policy", "SAMIF", "Unable to find accInt "+objectName+" in accInt_by_policy");
    	return;
    } 
    else 
    {
    	old_by_policy.splice(i, 1);//Remove objectFullName from classley's object
    	accInt_by_policy[oldclasskey] = old_by_policy;
    	
    	turn_off_SEs_by_accInt(objectName, oldclasskey);
    	store_accInt(newclasskey, accInt, gtype);
    }
}

function turn_off_SEs_by_accInt(fullname, classkey) 
{
    // This will look in the repositories and turn off the subelements that are composed using a certain access interface
    // fullname is objectFullName of the access interface.  classkey is the classkey for that access interface
    var i;
    var kentry;
    var samObject;
    var subelementname;

    //debug	logP5Msg("turn_off_SEs_by_accInt", "SAMIF", "entering turn_off_SEs_by_accInt: "+fullname);
    samObject = accInt_storage[fullname];//Is this overridden???Or removed???
    if (isUndef(samObject)) 
    {
    	logP6Msg("turn_off_SEs_by_accInt", "SAMIF", "Exiting: Unable to find stored accInt for objectFullName : '" + fullname + "'");
    	return;
    }

    qarray=fcQByType.findHashArray(classkey);
    if (isUndef(qarray)) 
    {   // Not found
    	logP6Msg("turn_off_SEs_by_accInt", "SAMIF", "Exiting: queues not found for classkey '" + classkey + "'");
    	return;
    } 
    else 
    {
    	for (i=0; i<qarray.length; i++) 
    	{
    		qentry=qarray[i];
    		dump_samObject(qentry);
    		if (qentry.queue_set == true) 
    		{
    			subelementname = SEname_from_qentry_accInt(qentry, samObject, classname, qentry.samSiteId);//Not significant, maybe I'm wrong.
    			//turn_off_queue_SE(subelementname);//construct alt_idmap here!!!
    			tempObject = {};
    			_altMapId = samObject.objectFullName + '-' + qentry.samPolicyType + '-' + qentry.samId;//Just in case???
    			
    			tempObject.objectFullNameOrAltIdMap = _altMapId;
    			tempObject.timestamp = parseInt(samObject.timestamp);
    			tempObject.seName = subelementname;
    			
    			_svcQueuesToBeDeleted.push(tempObject);
    			//logP6Msg("turn_off_SEs_by_accInt", "SAMIF", "tempObject.timestamp -> " + tempObject.timestamp);
    			//turn_off_queue_SE(tempObject);
    		}   ///  ************* have yet to test this clause in the code ****
	    	/// were getting samContainingPolicyId (in the qentry in the SEName_from_queue_accint)
	    	/// was set to undefined.  this queue_set test might not be the right solution
		} // for
    }
}

function delete_classkey_access_interface(classkey, objectName) {

    var old_by_policy;
    var len, found;
    var accInt;

    //debug	logP3Msg("delete_classkey_access_interface", "SAMIF", "Entered with "+objectName);

    found = 0;

    old_by_policy = accInt_by_policy[classkey];

    if (isUndef(old_by_policy)) {
	//debug		logP3Msg("delete_classkey_access_interface", "SAMIF", "Unable to lookup "+classkey+" for "+objectName);
	return;
    }

    accInt = accInt_storage[objectName];

    if (isUndef(accInt)) {
	//debug		logP3Msg("delete_classkey_access_interface", "SAMIF", "Unable to find stored accInt "+objectName);
	return;
    }


    len = old_by_policy.length;
    //debug	logP6Msg("delete_classkey_access_interface", "SAMIF", "length: "+len);

    for (i=0; i<len; i++) {
	//debug		logP6Msg("delete_classkey_access_interface", "testing: "+old_by_policy[i].toString());
	//debug		logP6Msg("delete_classkey_access_interface", "against: "+objectName.toString());
	if ((old_by_policy[i].toString()) == (objectName.toString())) {
	    found = 1;
	    break;
	}
    }
    if (found == 0) {
	//debug		logP6Msg("delete_classkey_access_interface", "SAMIF", "Unable to find accInt "+objectName+" in accInt_by_policy");
	return;
    } 
    else {
	//debug		logP6Msg("delete_classkey_access_interface", "SAMIF", "Found "+objectName+" in accInt_by_policy");
	old_by_policy.splice(i, 1);
	//debug		logP6Msg("delete_classkey_access_interface", "SAMIF", "After splice.");
	accInt_by_policy[classkey] = old_by_policy;
	//debug		logP6Msg("delete_classkey_access_interface", "SAMIF", "After assint assign.");
	turn_off_SEs_by_accInt(objectName, classkey);
	//debug		logP6Msg("delete_classkey_access_interface", "SAMIF", "After turn off.");
    }

    //debug	logP6Msg("delete_classkey_access_interface", "SAMIF", "exiting");

}

//function delete_access_interface(className, objectName, propColl) {
function delete_access_interface(objectName) 
{
	var classkey;
    var i;
    var g;
    var garray;
    var gkey_map;

    //debug	logP6Msg("delete_access_interface", "SAMIF", "Entered with "+objectName);
    for (i=0; i<policy_list.length; i++) 
    {
    	g=policy_list[i];

    	gkey_map = object_keymap[g];

    	//debug	logP6Msg("delete_access_interface", "SAMIF", g);
	    
    	if (isDef(gkey_map)) 
    	{
    		classkey = gkey_map[objectName];
    		//debug 	logStatus("classkey", classkey);

    		if (classkey != undefined) 
    		{
    			delete_classkey_access_interface(classkey, objectName, propColl);
    		} // if classkey
    	} // if gkey_map
    } // for i (over policy_list)
}

function dump_samObject(samObject) 
{
    var i;

    logP6Msg("dump_samObject", "SAMIF", "beginning");

    nilStatus("samObject", samObject);

    if (isUndef(samObject)) 
    {
    	logP6Msg("dump_samObject", "SAMIF", "samObject input is undefined");
    } 
    else 
    {
    	for( i in samObject) 
    	{
    		/*
	      	logP6Msg("dump_samObject", "SAMIF", "i is "+i);
	      	logP6Msg("dump_samObject", "SAMIF", "samObject[i] is "+samObject[i]);
    		 */
    		logStatus(i.toString(), samObject[i]);
    	}
    }

    logP6Msg("dump_samObject", "SAMIF", "ending");
}

function get_classkey(policyType, policyId, siteId) 
{
    return(policyType+"-"+policyId+"-"+siteId);
}

function classkey_switch_policy(classkey, oldPolicy, newPolicy) 
{
	var newclasskey;

    logP5Msg("classkey_switch_policy", "SAMIF", "Entering");
    logStatus("classkey", classkey);
    logStatus("old Policy", oldPolicy);
    logStatus("new Policy", newPolicy);

    logP5Msg("classkey_switch_policy", "SAMIF", "Entering");

    newclasskey = classkey.replace("-"+oldPolicy+"-", "-"+newPolicy+"-");
    //logP5Msg("propChange_service_access_interface", "SAMIF", "Changing field "+propName+" from "+oldvalue+" to "+newvalue);

    logStatus("new classkey", newclasskey);
    logStatus("old classkey", classkey);

    logP5Msg("classkey_switch_policy", "SAMIF", "Exiting");

    return newclasskey;
}

function classkey_policy_type(classkey) 
{
    var pieces=classkey.split("-");
    //logP3Msg("classkey_policy_type", "SAMIF", "type is "+pieces[0]);
    return pieces[0];
}

function lookup_policy_type(classname, fieldname) 
{
	//ONLY these few access interfaces
    if (isDef(handled_access_interfaces[classname])) 
    {
    	switch(fieldname) 
    	{
    		case "ingressPolicyId":
    			return("accessIngress");
    		break;
    		case "egressPolicyId":
    			return("accessEgress");
    		break;
    		case "networkQueuePolicyName":
    			return("networkQueue");
    		case "sasIngressPolicyId":
    			return("sasAccessIngress");
    		break;
    	};
    }

    // Need to switch on the other classes handled.  They will probably all be containingPolicyId for the field
    switch(classname) 
    {
    	case "sasqos.Meter":
    		return("sasAccessIngress");
    	break;
    	case "sasqos.PortAccessEgressQueue":
    		return("sasPortAccessEgress");
    	break;
    	case "equipment.PhysicalPort":
    		return("networkQueue");
    	break;
    };    
}

function isPolicyField(fieldname) 
{
    return policy_fields_hash[fieldname];
}

function storePropertiesForVccvPingEnrichment(record, modelInterface, classname) 
{
    // Storage of properties for later enrichment of VCCV ping resources
    var vccv_properties = ["portName", "outerEncapValue", "innerEncapValue", "displayedName", "objectFullName", "nodeName"];

    logP3Msg("storePropertiesForVccvPingEnrichment", "SAMIF", "classname is "+classname);
    if (isDef(record.serviceId) && isDef(record.nodeId)) {
	//dump_samObject(record);
	logStatus("ServiceId", record.serviceId);
	logStatus("nodeId", record.nodeId);
	propObject = createOrFindPropEntry(sap_property_storage, record.nodeId, record.serviceId);
	copyPropertiesToObject(record, propObject, vccv_properties);
    }

	//Storage of properties for CFM properties enrichment, storing objectFullName as key is to enable lookup by using objectFullName
	var cfm_sap_object_full_name = ["serviceId", "nodeName","objectFullName"];
	if (isDef(record.serviceId))
	{
		//dump_samObject(record);
		logStatus("ServiceId", record.serviceId);
		logStatus("objectFullName", record.objectFullName);
		propObject = createOrFindPropEntry(sap_object_full_name_property_storage, record.objectFullName);
		copyPropertiesToObject(record, propObject, cfm_sap_object_full_name);
		//dump_samObject(propObject);
	}
}

// This sets up the data structures used to keep track of the "Service" inventory.  More accurately these
// are used to keep track of composing the subelements that are made up of policy-fc-queue sets.
function initialize_service_structures()
{
    var i, g;

    fc_key_map = new Array();
    fc_fc_map = new Array();
    queue_key_map = new Array();
    accInt_ing_key_map = new Array();
    accInt_eg_key_map = new Array();
    accInt_storage = new Array();
    accInt_by_policy = new Array();
    policy_def_fc = new Array();
    policy_key_map = new Array();

    object_keymap = new Array();
    for (i=0; i<policy_list.length; i++)//"accessIngress", "accessEgress", "sasAccessIngress", "sasPortAccessEgress", "networkQueue" 
    {
    	g=policy_list[i];
    	object_keymap[g] = new Array();//E.g. accessIngress -> {}, accessEgress -> {} ....;
    }
}
