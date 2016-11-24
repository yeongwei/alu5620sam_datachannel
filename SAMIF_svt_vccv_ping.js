// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var sdp_property_storage = newPropStorage(1, 1000),
    sap_property_storage = newPropStorage(2, 1000),
	mep_property_storage = newPropStorage(1, 1000);
	sap_object_full_name_property_storage = newPropStorage(1, 1000);

var reverse_svt_vccv_ping_Name = {},
svt_vccv_ping_Name = {
	"samAdministrativeState":"administrativeState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samFromNodeId":"fromNodeId",
	"samGlobalId":"globalId",
	"samId":"id",
	"samName":"name",
	"samObjectFullName":"objectFullName",
	"samTargetIpAddress":"targetIpAddress",
	"samTargetIpAddressType":"targetIpAddressType",
	"samTestType":"testType",
	"samToNodeId":"toNodeId",
	"samForwardingClass":"forwardingClass",
	"samOamTestDestination":"testedObject",
	"samPseudowireId":"pseudowireId"
};


for( var i in svt_vccv_ping_Name)
{
	MasterPropertyMap[svt_vccv_ping_Name[i]] = i;
	ReverseMasterPropertyMap[svt_vccv_ping_Name[i]] = i;
	reverse_svt_vccv_ping_Name[svt_vccv_ping_Name[i]] = i;
}

function process_svt_vccv_ping(samObject, modelInterface)
{
    logP4Msg("process_svt_vccv_ping", "SAMIF", "entered process_svt_vccv_ping" );
    var element;
    var subelement;

	element = OPERATOR.elementNamedOrNew(samObject.fromNodeId);
    element.state = true;
    element.name = samObject.fromNodeId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    //subelement = modelInterface.Subelement();

	subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_OAM_Test" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.fromNodeId])) {
	subelement.label = mapSiteName[samObject.fromNodeId]+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
	}

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("OAMTestType", "VCCV Ping");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_OAM_Test");

    logP4Msg("process_svt_vccv_ping", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_svt_vccv_ping", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_svt_vccv_ping", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_svt_vccv_ping", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in svt_vccv_ping_Name) 
    {
            if ( samObject[ svt_vccv_ping_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ svt_vccv_ping_Name[i] ].toString() );
                }    
    }

    // Enrichment of VCCV ping resources with information from other inventory objects
    
    if (isDef(samObject.testedObject)) {
	var sdp_entry = findPropEntry(sdp_property_storage, samObject.testedObject);
	if (isDef(sdp_entry)) {
	    nilStatus("sdp_entry", sdp_entry);
	    dump_samObject(sdp_entry);
	    if (isDef(sdp_entry.fromNodeName)) {
		subelement.addProperty("samFromNodeName", sdp_entry.fromNodeName);
	    }
	    if (isDef(sdp_entry.toNodeName)) {
		subelement.addProperty("samToNodeName", sdp_entry.toNodeName);
	    }
	    if (isDef(sdp_entry.toNodeId)) {
		subelement.addProperty("samToNodeId", sdp_entry.toNodeId);
	    }
	    // Properties from the origin
	    var sap_entry = findPropEntry(sap_property_storage, sdp_entry.fromNodeId, sdp_entry.serviceId);
	    nilStatus("sap_entry", sap_entry);
	    if (isDef(sap_entry)) {
	    dump_samObject(sap_entry);
		if (isDef(sap_entry.portName)) {
		    subelement.addProperty("samFromPortName", sap_entry.portName);
		}
		if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) {
		    var from_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
		    logStatus("from_encap", from_encap);
		    subelement.addProperty("samFromEncapValue", from_encap);
		}
	    }
	    // Properties from the destination
	    var sap_entry = findPropEntry(sap_property_storage, sdp_entry.toNodeId, sdp_entry.serviceId);
	    nilStatus("sap_entry", sap_entry);
	    if (isDef(sap_entry)) {
	    dump_samObject(sap_entry);
		if (isDef(sap_entry.portName)) {
		    subelement.addProperty("samToPortName", sap_entry.portName);
		}
		if (isDef(sap_entry.outerEncapValue) && isDef(sap_entry.innerEncapValue)) {
		    var to_encap = sap_entry.outerEncapValue + "." + sap_entry.innerEncapValue;
		    logStatus("to_encap", to_encap);
		    subelement.addProperty("samToEncapValue", to_encap);
		}
	    }
	} // sdp_entry
    } // testedobject

    // End of enrichment


    //subelement.timestamp = modelInterface.currentDate;

	subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_svt_vccv_ping", "SAMIF", "exiting process_svt_vccv_ping" );

}




