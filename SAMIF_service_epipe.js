// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//*Initiate UBA cache for service epipe and vpls
var service_composite_mapping_storage = newPropStorage(1, 1000); //[key]serviceId -> [value]compositeSvcId
var composite_key_service_mapping_storage = newPropStorage(1, 1000); //[key] <int compSvcId>-eipie / <int compSvcId>-vpls -> [value] <int svcId>
	
var reverse_service_epipe_Name = {},
    service_epipe_Name = 
	{
		"samServiceId": "serviceId",
		"samCompositeSvcId": "compositeSvcId"
	};
	
for( var i in service_epipe_Name)
{
	MasterPropertyMap[service_epipe_Name[i]] = i;
	ReverseMasterPropertyMap[service_epipe_Name[i]] = i;
	reverse_service_epipe_Name[service_epipe_Name[i]] = i;
}
	
function process_service_epipe(samObject, modelInterface)
{
	logP4Msg("process_service_epipe", "SAMIF", "entered");

	var cfm_test_object_properties = ["serviceId", "compositeSvcId"];

	if (isDef(samObject.serviceId) && isDef(samObject.compositeSvcId))
	{
		logP4Msg("process_service_epipe", "SAMIF", "Start storing epipe.Epipe properties into UBA Cache");
		logStatus("serviceId", samObject.serviceId);
		logStatus("compositeSvcId", samObject.compositeSvcId);
		
		logP4Msg("process_service_epipe", "SAMIF", "Storing epipe.Epipe properties into UBA Cache service_composite_mapping_storage");
		propObject = createOrFindPropEntry(service_composite_mapping_storage, samObject.serviceId);
		copyPropertiesToObject(samObject, propObject, [cfm_test_object_properties[1]]);
		dump_samObject(propObject);
			
		if(samObject.compositeSvcId != 0)
		{
			logP4Msg("process_service_epipe", "SAMIF", "Storing epipe.Epipe properties into UBA Cache composite_key_service_mapping_storage");
			logP4Msg("process_service_epipe", "SAMIF", "Construct custom UBA Cache Key - " + samObject.compositeSvcId + "-epipe");
			propObject = createOrFindPropEntry(composite_key_service_mapping_storage, samObject.compositeSvcId + "-epipe");
			copyPropertiesToObject(samObject, propObject, [cfm_test_object_properties[0]]);
			dump_samObject(propObject);
			logP4Msg("process_service_epipe", "SAMIF", "Finished storing epipe.Epipe properties into UBA Cache");
		}
		else
		{
			logP4Msg("process_service_epipe", "SAMIF", "Epipe service details below is not a Composite Service");
			logStatus("serviceId", samObject.serviceId);
			logStatus("compositeSvcId", samObject.compositeSvcId);
		}
		logP4Msg("process_service_epipe", "SAMIF", "Finished storing epipe.Epipe properties into UBA Cache");
	}

	logP4Msg("process_service_epipe", "SAMIF", "exiting process_service_epipe");
}