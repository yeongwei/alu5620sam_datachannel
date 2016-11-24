// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
	
var reverse_service_vpls_Name = {},
    service_vpls_Name = 
	{
		"samServiceId": "serviceId",
		"samCompositeSvcId": "compositeSvcId"
	};
	
for( var i in service_vpls_Name)
{
	MasterPropertyMap[service_vpls_Name[i]] = i;
	ReverseMasterPropertyMap[service_vpls_Name[i]] = i;
	reverse_service_vpls_Name[service_vpls_Name[i]] = i;
}
	
function process_service_vpls(samObject, modelInterface)
{
	logP4Msg("process_service_vpls", "SAMIF", "entered");

	var cfm_test_object_properties = ["serviceId", "compositeSvcId"];

	if (isDef(samObject.serviceId) && isDef(samObject.compositeSvcId))
	{
		logP4Msg("process_service_vpls", "SAMIF", "Start storing vpls.Vpls properties into UBA Cache");
		logStatus("serviceId", samObject.serviceId);
		logStatus("compositeSvcId", samObject.compositeSvcId);
		
		logP4Msg("process_service_vpls", "SAMIF", "Storing vpls properties into UBA Cache service_composite_mapping_storage");
		propObject = createOrFindPropEntry(service_composite_mapping_storage, samObject.serviceId);
		copyPropertiesToObject(samObject, propObject, [cfm_test_object_properties[1]]);
		dump_samObject(propObject);
			
		if(samObject.compositeSvcId != 0)
		{
			logP4Msg("process_service_vpls", "SAMIF", "Storing vpls properties into UBA Cache composite_key_service_mapping_storage");
			propObject = createOrFindPropEntry(composite_key_service_mapping_storage, samObject.compositeSvcId + "-vpls");
			copyPropertiesToObject(samObject, propObject, [cfm_test_object_properties[0]]);
			dump_samObject(propObject);
			logP4Msg("process_service_vpls", "SAMIF", "Finished storing vpls.Vpls properties into UBA Cache");
		}
		else
		{
			logP4Msg("process_service_vpls", "SAMIF", "Vpls service details below is not a Composite Service");
			logStatus("serviceId", samObject.serviceId);
			logStatus("compositeSvcId", samObject.compositeSvcId);
		}
		logP4Msg("process_service_vpls", "SAMIF", "Finished storing vpls.Vpls properties into UBA Cache");
	}

	logP4Msg("process_service_vpls", "SAMIF", "exiting process_service_vpls");
}