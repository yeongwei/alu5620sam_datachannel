// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_cfm_loopback_Name = {},
    cfm_loopback_Name = {
	"samAdministrativeState":"administrativeState",
//	"samEquipmentState":"equipmentState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samFromNodeId":"fromNodeId",
	"samSiteId":"siteId",
	"samObjectFullName":"objectFullName",
	"samOriginatingNode":"originatingNode",
	"samOriginatingMep":"originatingMep",
	"samMepId":"mepId",
	"samMaintenanceAssociationId":"maintenanceAssociationId",
	"samMaintenanceDomainId":"maintenanceDomainId",
	"samForwardingClass":"forwardingClass",
	"samMepTargetMacAddr": "mepTargetMacAddr"
 };


for( var i in cfm_loopback_Name)
    {
	MasterPropertyMap[cfm_loopback_Name[i]] = i;
	ReverseMasterPropertyMap[cfm_loopback_Name[i]] = i;
	reverse_cfm_loopback_Name[cfm_loopback_Name[i]] = i;
    }

function process_cfm_loopback(samObject, modelInterface)
{
    logP4Msg("process_cfm_loopback", "SAMIF", "entered process_cfm_loopback" );
    var element;
    var subelement;
    
    for( var i in samObject)
    {
        logP4Msg("process_cfm_loopback","SAMIF", i + " : " + samObject[i]);
    }	
    element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.state = true;
    element.name = samObject.siteId.toString();
    //element.name = samObject.fromNodeId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_OAM_Test";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.siteId])) {
	subelement.label = mapSiteName[samObject.siteId]+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("OAMTestType", "CFM Loopback");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_OAM_Test");

    logP4Msg("process_cfm_loopback", "SAMIF", "Element: "+element.name);
    logP4Msg("process_cfm_loopback", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_cfm_loopback", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_cfm_loopback", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_cfm_loopback", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in cfm_loopback_Name) 
	{
            if ( samObject[ cfm_loopback_Name[i] ] != undefined )
                {
		    subelement.addProperty( i.toString(), samObject[ cfm_loopback_Name[i] ].toString() );
		    logP4Msg("add property for cfm loopback", "SAMIF", "adding property " + i + " value " + samObject[ cfm_loopback_Name[i]]);		
                }    
	}
	
	//Enrichment of Cfm Test Object resources with information from other inventory object 
	var current_service_id;
	if (isDef(samObject.testedObject)) 
	{
		//Use testedObject to lookup in mep_property_storage
		var source_node_id = samObject.fromNodeId;
		logP4Msg("cfm test object enhancement", "SAMIF", "source_node_id:" + source_node_id);
		var mep_entry = findPropEntry(mep_property_storage, samObject.testedObject);
		if (isDef(mep_entry)) 
		{
			nilStatus("mep_entry", mep_entry);
			dump_samObject(mep_entry);
			var sap_pointer = mep_entry.sapPointer;
			logP4Msg("cfm test object enhancement", "SAMIF", "sap_pointer:" + sap_pointer);
			if (isDef(sap_pointer))
			{
				var sap_object_full_name = findPropEntry(sap_object_full_name_property_storage, sap_pointer);
				
				if (isDef(sap_object_full_name)) 
					{
						nilStatus("sap_object_full_name", sap_object_full_name);
						dump_samObject(sap_object_full_name);
						if (isDef(sap_object_full_name.nodeName)) 
						{
							subelement.addProperty("samFromNodeName", sap_object_full_name.nodeName);
							logP4Msg("cfm test object enhancement", "SAMIF", "Added samFromNodeName:" + sap_object_full_name.nodeName);
						}
						
						current_service_id = sap_object_full_name.serviceId.toString();
						
						var sap_entry = findPropEntry(sap_property_storage, source_node_id, sap_object_full_name.serviceId);
						if (isDef(sap_entry)) 
						{
								nilStatus("sap_entry", sap_entry);
								dump_samObject(sap_entry);
								if (isDef(sap_entry.portName)) 
								{
									subelement.addProperty("samFromPortName", sap_entry.portName);
									logP4Msg("cfm test object enhancement", "SAMIF", "Added samFromPortName:" + sap_entry.portName);
								}
								if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) 
								{
									var from_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
									logStatus("from_encap", from_encap);
									subelement.addProperty("samFromEncapValue", from_encap);
									logP4Msg("cfm test object enhancement", "SAMIF", "Added samFromEncapValue:" + from_encap);
								}
						}
					}
			}
		}
		
		//Process Destination
		logP4Msg("process_cfm_loopback", "SAMIF", "Start CFM Loopback Destination Process");
		subelement = process_cfm_loopback_destination(samObject, modelInterface, current_service_id, subelement);
		logP4Msg("process_cfm_loopback", "SAMIF", "Ended CFM Loopback Destination Process");
	}
				

     //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

    logP4Msg("process_cfm_loopback", "SAMIF", "exiting process_cfm_loopback" );

} 

function process_cfm_loopback_destination(samObject, modelInterface, current_service_id, subelement)//current_service_id consist of the serviceId used to evaluate source information
{	//Destination information lookup with targetMacAddr from CFM Loopback resource
	var destination_site = findPropEntry(mep_mac_property_storage, samObject.mepTargetMacAddr);	
			
	if(isDef(destination_site))
	{	//Get CompositeSvcId for the current serviceId used during source information extraction
		var service_composite_mapping = findPropEntry(service_composite_mapping_storage, current_service_id);

		if(isDef(service_composite_mapping))
		{	//Not a Composite Service if CompositeSvcId is 0
			if(service_composite_mapping.compositeSvcId == 0)
			{
				var sap_entry = findPropEntry(sap_property_storage, destination_site.siteId, current_service_id);
				if (isDef(sap_entry))
				{
					if (isDef(sap_entry.portName)) 
					{
						subelement.addProperty("samToPortName", sap_entry.portName);
					}
					if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) 
					{
						var to_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
						subelement.addProperty("samToEncapValue", to_encap);
					}
					if(isDef(sap_entry.nodeName))
					{
						subelement.addProperty("samToNodeName", sap_entry.nodeName);
					}
					if(isDef(destination_site.siteId))
					{
						subelement.addProperty("samToNodeId", destination_site.siteId);
					}
					logP4Msg("cfm test object enhancement", "SAMIF", "[samToPortName, samToEncapValue, samToNodeName, samToNodeId]: " + "[" + sap_entry.portName + ", " + to_encap + ", " + sap_entry.nodeName + ", " + destination_site.siteId + "]");
				}
			}//A Composite Service if CompositeSvcId is not 0
			else
			{	//Use Epipe as reference
				var composite_key = service_composite_mapping.compositeSvcId + "-epipe";
				//Evaluate destination service as possible Epipe
				var destination_service = findPropEntry(composite_key_service_mapping_storage, composite_key);
								
				if(isDef(destination_service))
				{
					var destination_service_id = destination_service.serviceId.toString();	
					//Check if current_service_id belongs to Epipe Serivce of a Composite Service
					if(destination_service_id == current_service_id)
					{	//Therefore the destination is a Vpls Service
						composite_key = service_composite_mapping.compositeSvcId + "-vpls";
						destination_service = findPropEntry(composite_key_service_mapping_storage, composite_key);//Contains VPLS object information
						if(isDef(destination_service))
						{
							destination_service_id = destination_service.serviceId;//VPLS serviceId
							sap_entry = findPropEntry(sap_property_storage, destination_site.siteId, destination_service_id);
							
							if(isDef(sap_entry))
							{
								if (isDef(sap_entry.portName)) 
								{
									subelement.addProperty("samToPortName", sap_entry.portName);
								}
								if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) 
								{
									var to_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
									subelement.addProperty("samToEncapValue", to_encap);
								}
								if(isDef(sap_entry.nodeName))
								{
									subelement.addProperty("samToNodeName", sap_entry.nodeName);
								}
								if(isDef(destination_site.siteId))
								{
									subelement.addProperty("samToNodeId", destination_site.siteId);
								}
								logP4Msg("cfm test object enhancement", "SAMIF", "[samToPortName, samToEncapValue, samToNodeName, samToNodeId]: " + "[" + sap_entry.portName + ", " + to_encap + ", " + sap_entry.nodeName + ", " + destination_site.siteId + "]");
							}
						}
					}
					else//current_service_id is a Vpls Service, since destination_service is evaluated as Epipe Service
					{
						//Double check if current_service_id is a valid vpls service
						composite_key = service_composite_mapping.compositeSvcId + "-vpls";
						var current_service_mask = findPropEntry(composite_key_service_mapping_storage, composite_key);
						if(isDef(current_service_mask))
						{
							var current_service_mask_id = current_service_mask.serviceId.toString();
							//Only continue if the current_service_id has been validated as valid Vpls service
							if(current_service_mask_id == current_service_id)
							{
								sap_entry = findPropEntry(sap_property_storage, destination_site.siteId, destination_service_id);
								
								if(isDef(sap_entry))
								{
									if (isDef(sap_entry.portName)) 
									{
										subelement.addProperty("samToPortName", sap_entry.portName);
									}
									if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) 
									{
										var to_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
										subelement.addProperty("samToEncapValue", to_encap);
									}
									if(isDef(sap_entry.nodeName))
									{
										subelement.addProperty("samToNodeName", sap_entry.nodeName);
									}
									if(isDef(destination_site.siteId))
									{
										subelement.addProperty("samToNodeId", destination_site.siteId);
									}	
									logP4Msg("cfm test object enhancement", "SAMIF", "[samToPortName, samToEncapValue, samToNodeName, samToNodeId]: " + "[" + sap_entry.portName + ", " + to_encap + ", " + sap_entry.nodeName + ", " + destination_site.siteId + "]");
								}
							}	
						}
					}
				}
			}
		}
	}
	return subelement;
}

