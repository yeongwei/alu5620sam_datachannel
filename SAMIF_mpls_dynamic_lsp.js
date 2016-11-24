// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_mpls_dynamic_lsp_Name = {},
mpls_dynamic_lsp_Name = {
    "samObjectFullName":"objectFullName",
    "samAdministrativeState":"administrativeState",
    "samDestinationIpAddress":"destinationIpAddress",
    "samEgressLabel":"egressLabel",    
    "samFromNodeId":"fromNodeId",
    "samFromNodeName":"fromNodeName",
    "samIngressLabel":"ingressLabel",    
    "samOperationalState":"operationalState",
    "samSourceNodeId":"sourceNodeId",
    "samToNodeId":"toNodeId"
};

var fuller_list_mpls_dynamic_lsp_Name = {
    "samObjectFullName":"objectFullName",
    "samAdministrativeState":"administrativeState",
    "samDescription":"description",
    "samDestinationNodeMisconfigured":"destinationNodeMisconfigured",
    "samDisplayedName":"displayedName",
    "samDestinationInterfaceId":"destinationInterfaceId",
    "samDestinationInterfaceName":"destinationInterfaceName",
    "samDestinationIpAddress":"destinationIpAddress",
    "samEgressInterfaceId":"egressInterfaceId",
    "samEgressInterfaceName":"egressInterfaceName",
    "samEgressInterfacePointer":"egressInterfacePointer",
    "samEgressLabel":"egressLabel",    
    "samFromCtp":"fromCtp",
    "samFromNodeId":"fromNodeId",
    "samFromNodeName":"fromNodeName",
    "samForwardingClasses":"forwardingClasses",
    "samIngressInterfaceId":"ingressInterfaceId",
    "samIngressInterfaceName":"ingressInterfaceName",
    "samIngressInterfacePointer":"ingressInterfacePointer",
    "samIngressLabel":"ingressLabel",    
    "samIsDefaultPath":"isDefaultPath",
    "samLoadFactor":"loadFactor",
    "samOperationalState":"operationalState",
    "samNumberOfPaths":"numberOfPaths",
    "samNumberOfPrimaryPaths":"numberOfPrimaryPaths",
    "samSourceNodeId":"sourceNodeId",
    "samSourceNodeMisconfigured":"sourceNodeMisconfigured",    
    "samToCtp":"toCtp",
    "samToNodeId":"toNodeId",
    "samToNodeName":"toNodeName"    
};


// The next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.


var lspMapFunctions = { "operationalState": getLspMappedPropString,
				"administrativeState": getLspMappedPropString };

var mapLspOperationalState = { "1":"lspUnknown",
				"2":"lspUp",
				"3":"lspDown",
				"4":"lspTransition" };

var mapLspAdministrativeState = { "1":"lspUnknown",
				 "2":"lspUp",
				 "3":"lspDown" };

var mapForLspProp = {"operationalState": mapLspOperationalState, 
			"administrativeState": mapLspAdministrativeState };

function getLspMappedPropString(objectName, propName, sp) {
	var spMap = mapForLspProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}

// Thus ends the code used to map the status values



for( var i in mpls_dynamic_lsp_Name)
{
	MasterPropertyMap[mpls_dynamic_lsp_Name[i]] = i;
	ReverseMasterPropertyMap[mpls_dynamic_lsp_Name[i]] = i;
	reverse_mpls_dynamic_lsp_Name[mpls_dynamic_lsp_Name[i]] = i;
}


function mpls_dynamic_lsp(samObject, modelInterface)
{
    logP4Msg("mpls_dynamic_lsp", "SAMIF", "entered" );
    var element;
    var subelement;


    //element = modelInterface.Element();
    element = OPERATOR.elementNamedOrNew(samObject.sourceNodeId.toString());
    element.state = true;
    element.name = samObject.sourceNodeId.toString();
    element.origin = "SAM";

    //subelement = modelInterface.Subelement();
    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.family = "mpls";
    
    subelement.instance = samObject.objectFullName;
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_MPLSDynamicLSP" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
    //subelement.timestamp = samObject.timestamp;
    if (isConfig("in_uses_names")) {
	//subelement.label = samObject.siteName+" "+samObject.objectFullName;
    	subelement.label = samObject.fromNodeName+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }


    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_MPLSDynamicLSP");

    for( var i in mpls_dynamic_lsp_Name) 
    {
            if ( samObject[ mpls_dynamic_lsp_Name[i] ] != undefined )

                {
                        subelement.addProperty( i.toString(), samObject[ mpls_dynamic_lsp_Name[i] ].toString() );
                }    
    }


   //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);


} // mpls_dynamic_lsp


