// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
var mep_mac_property_storage = newPropStorage(1, 1000); //macAddress -> siteId

var reverse_ethernetoam_mep_Name = {},
    ethernetoam_mep_Name = 
	{
		"samSiteId":"siteId",
		"samMaintenanceDomainId":"maintenanceDomainId",
		"samMaintenanceAssociationId":"maintenanceAssociationId",
		"samMaintAssocName":"maintAssocName",
		"samServiceId":"serviceId",
		"samServiceType":"serviceType",
		"samSapOrBinding":"sapOrBinding",
		"samSdpBindingPointer":"sdpBindingPointer",
		"samSapPointer":"sapPointer",
		"samObjectFullName":"objectFullName",
		"samOperationalMacAddress": "operationalMacAddress"
	};
	
for( var i in ethernetoam_mep_Name)
{
	MasterPropertyMap[ethernetoam_mep_Name[i]] = i;
	ReverseMasterPropertyMap[ethernetoam_mep_Name[i]] = i;
	reverse_ethernetoam_mep_Name[ethernetoam_mep_Name[i]] = i;
}
	
function process_ethernetoam_mep(samObject, modelInterface)
{
	logP4Msg("process_ethernetoam_mep", "SAMIF", "entered");
	
	
	//for( var i in ethernetoam_mep_Name) 
	//{
    //		if ( samObject[ ethernetoam_mep_Name[i] ] != undefined )
    // 		{
	// 			logP4Msg("process_ethernetoam_mep", "SAMIF", "adding property " + i + " value " + samObject[ethernetoam_mep_Name[i]]);
    // 		}    
	// }
	
	//var sdp_binding_pointer = samObject.sapPointer;
	var cfm_test_object_properties = ["sapPointer", "objectFullName"];

	if (isDef(samObject.objectFullName) && isDef(samObject.sapPointer))
	{
		logStatus("objectFullName", samObject.objectFullName);
		logStatus("sapPointer", samObject.sapPointer);
		propObject = createOrFindPropEntry(mep_property_storage, samObject.objectFullName);
		copyPropertiesToObject(samObject, propObject, cfm_test_object_properties);
		dump_samObject(propObject);
	}
	
	if(isDef(samObject.operationalMacAddress) && isDef(samObject.siteId))
	{
		logP4Msg("process_ethernetoam_mep", "SAMIF", "Start storing ethernetoam.Mep properties into UBA Cache mep_mac_property_storage");
		logStatus("operationalMacAddress", samObject.operationalMacAddress);
		logStatus("siteId", samObject.siteId);
		propObject = createOrFindPropEntry(mep_mac_property_storage, samObject.operationalMacAddress);
		copyPropertiesToObject(samObject, propObject, ["siteId"]);
		dump_samObject(propObject);
		logP4Msg("process_ethernetoam_mep", "SAMIF", "Finished storing ethernetoam.Mep properties into UBA Cache mep_mac_property_storage");
	}
	
	//subelement.timestamp = modelInterface.currentDate;
    // element.addSubelement(subelement);
	// possible_inline_commit(modelInterface);
	
	logP4Msg("process_ethernetoam_mep", "SAMIF", "exiting process_ethernetoam_mep");
	
}
