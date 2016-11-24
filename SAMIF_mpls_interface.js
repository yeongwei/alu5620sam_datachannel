// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_mpls_interface_Name = {},
mpls_interface_Name = {
    "samObjectFullName":"objectFullName",
    "samAdministrativeState":"administrativeState",
    "samEncapType":"encapType",
    "samNodeId":"nodeId",
    "samNodeName":"nodeName",
    "samOperationalState":"operationalState",
    "samPortId":"portId",
    "samRouterId":"routerId",
    "samServiceType":"serviceType"
 };

var fuller_mpls_interface_Name = {
    "samObjectFullName":"objectFullName",
    "samAdministrativeState":"administrativeState",
    "samCtpPointer":"ctpPointer",
    "samDescription":"description",
    "samDisplayedName":"displayedName",
    "samEncapType":"encapType",
    "samNodeId":"nodeId",
    "samNodeName":"nodeName",
    "samOperationalState":"operationalState",
    "samPortId":"portId",
    "samPortName":"portName",
    "samRouterId":"routerId",
    "samRouterName":"routerName",
    "samServiceId":"serviceId",
    "samServiceType":"serviceType",
    "samSubscriberId":"subscriberId",
    "samTerminatedObjectName":"terminatedObjectName",
    "samTerminatedPortClassName":"terminatedPortClassName"
 };

// The next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.


var mplsInterfaceMapFunctions = { "operationalState": getMplsInterfaceMappedPropString,
				"administrativeState": getMplsInterfaceMappedPropString };

var mapMplsInterfaceOperationalState = { "1":"mplsUnknown",
				"2":"mplsUp",
				"3":"mplsDown",
				"4":"mplsTransition" };

var mapMplsInterfaceAdministrativeState = { "1":"mplsNotOperational",
				 "2":"mplsUp",
				 "3":"mplsDown" };

var mapForMplsInterfaceProp = {"operationalState": mapMplsInterfaceOperationalState, 
			"administrativeState": mapMplsInterfaceAdministrativeState };

function getMplsInterfaceMappedPropString(objectName, propName, sp) {
	var spMap = mapForMplsInterfaceProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}

// Thus ends the code used to map the status values


for( var i in mpls_interface_Name)
{
	MasterPropertyMap[mpls_interface_Name[i]] = i;
	ReverseMasterPropertyMap[mpls_interface_Name[i]] = i;
	reverse_mpls_interface_Name[mpls_interface_Name[i]] = i;
}

function mpls_interface(samObject, modelInterface)
{
    logP4Msg("mpls_interface", "SAMIF", "entered" );
    var element;
    var subelement;

	var elementName = "5620SAM_Sub_"+samObject.subscriberId+"_Srv_"+samObject.serviceId+"_Node_"+samObject.nodeId;
    //element = OPERATOR.elementNamedOrNew(samObject.siteId);
	element = OPERATOR.elementNamedOrNew(elementName);
    element.state = true;
    //element.name = "5620SAM_Sub_"+samObject.subscriberId+"_Srv_"+samObject.serviceId+"_Node_"+samObject.nodeId;
	element.name = elementName;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;

    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_MPLSInterface" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
    //subelement.timestamp = samObject.timestamp;
    if (isConfig("inv_uses_names")) {
	subelement.label = samObject.nodeName+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_MPLSInterface");

    for( var i in mpls_interface_Name) 
    {
            if ( samObject[mpls_interface_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ mpls_interface_Name[i] ].toString() );
                }    
    }

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

} // mpls_interface


