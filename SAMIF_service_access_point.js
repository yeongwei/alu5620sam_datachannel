// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_service_access_point_Name = {},
    service_access_point_Name = 
{
    "samObjectFullName":"objectFullName",  
    "samAdministrativeState":"administrativeState",    
    "samDescription":"description",
    "samDisplayedName":"displayedName", 
    "samNodeId":"nodeId",
    "samNodeName":"nodeName",
    "samOperationalState":"operationalState",
    "samPortIdentifyingName":"portIdentifyingName",    
    "samPortId":"portId",
    "samPortName":"portName",
    "samServiceId":"serviceId",
    "samServiceName":"serviceName",
    "samServiceType":"serviceType",
    "samSubscriberId":"subscriberId",
    "samSubscriberName":"subscriberName",
    "samTerminatedObjectName":"terminatedObjectName",
    "samTerminatedPortClassName":"terminatedPortClassName"  
 };


var service_access_point_map_functions =
{ 
	"operationalState": getServiceMappedPropString,
	"administrativeState": getServiceMappedPropString
};

var map_service_access_point_operational_state = 
{ 
	"0":"serviceUnknown",
	"1":"serviceUp",
	"2":"serviceDown",
	"3":"serviceIngressQosMismatch",
	"4":"serviceEgressQosMismatch",
	"5":"servicePortMtuTooSmall",
	"6":"serviceAdminDown",
	"7":"servicIesIfAdminDown",
	"8":"blocking",
	"9":"forwarding",
	"10":"filtering"
};

var map_service_access_point_administrative_state =
{ 
	"0":"serviceUnknown",
	"1":"serviceUp",
	"2":"serviceDown" 
};

 var map_for_service_access_point_prop = 
{
	"operationalState": map_service_access_point_operational_state, 
	"administrativeState": map_service_access_point_administrative_state
 };

/*function getServiceAccessPointMappedPropString(objectName, propName, sp)
{
        var spMap = map_for_service_access_point_prop[propName];
        if (isDef(spMap)) 
	{
                return(getMappedPropString(spMap, objectName, propName, sp));
        }
        else return;
}*/


for( var i in service_access_point_Name)
{
	MasterPropertyMap[service_access_point_Name[i]] = i;
	ReverseMasterPropertyMap[service_access_point_Name[i]] = i;
	reverse_service_access_point_Name[service_access_point_Name[i]] = i;
}

function process_service_access_point(samObject, modelInterface)
{
    logP4Msg("process_service_access_point", "SAMIF", "entered process_service_access_point" );
    var element;
    var subelement;

    var _name = "5620SAM_SAP_node_"+samObject.nodeId;
    //element = OPERATOR.elementNamedOrNew(samObject.nodeId);
    element = OPERATOR.elementNamedOrNew(_name);
    element.state = true;
    element.name = _name;
    element.origin = "SAM" ;
    element.collectorNumber = accounting_stats_collector;

    var subEltName = "5620SAM_SAP_PPPoE_"+samObject.objectFullName;
    //subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement = OPERATOR.subelementNamedOrNew(subEltName);
    
    subelement.name = subEltName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_ServiceAccessInterface";
    subelement.instance = subelement.name;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names")) 
    {
    	subelement.label = "SAP_PPPoE_"+samObject.serviceId+"_"+samObject.nodeName+"_"+samObject.nodeId+"_"+samObject.portIdentifyingName;
    	logP4Msg("process_service_access_point", "SAMIF", "Label" + subelement.label );
    }
    else 
    {
    	subelement.label = "SAP_PPPoE_"+samObject.serviceId+"_"+samObject.nodeId+"_"+samObject.portIdentifyingName;
    	logP4Msg("process_service_access_point", "SAMIF", "Label No Name" + subelement.label );
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_ServiceAccessInterface");
	
    logP4Msg("process_service_access_point", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_service_access_point", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_service_access_point", "SAMIF", "Name: "+subelement.name);
    //logP4Msg("process_service_access_point", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in service_access_point_Name) 
    {
	    if ( samObject[ service_access_point_Name[i] ] != undefined )
	    {
		    subelement.addProperty( i.toString(), samObject[ service_access_point_Name[i] ].toString() );
		    logP4Msg("process_service_access_point", "SAMIF", "Subelement Add Property" + service_access_point_Name[i]);
	    }   
    }

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_service_access_point", "SAMIF", "exiting process_service_access_point" );
} 


