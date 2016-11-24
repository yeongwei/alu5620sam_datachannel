// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
var reverse_svt_sdp_binding_Name = {},
svt_sdp_binding_Name = {
	"samAdministrativeState":"administrativeState",
	"samConnectionId":"connectionId",
	"samEncapsulationType":"encapsulationType",
	"samFromNodeId":"fromNodeId",                  // We need this one
	"samObjectFullName":"objectFullName",
	"samOperationalState":"operationalState",
	"samPathId":"pathId",
	"samReturnPathId":"returnPathId",
	"samServiceType":"serviceType",                // We need this one
        "samServiceId":"serviceId",                    // We need this one
        "samSubscriberName":"subscriberName",          // We need this one
	"samToNodeId":"toNodeId",
	"samToNodeName":"toNodeName",
	"samVcId":"vcId"
};

var all_svt_sdp_binding_Name = {

	"samActualPathMtu":"actualPathMtu",
	"samAdministrativeState":"administrativeState",
	"samApplication":"application",
	"samCircuitMtu":"circuitMtu",
	"samCircuitTransport":"circuitTransport",
	"samCircuitType":"circuitType",
	"samConnectionId":"connectionId",
	"samDeploymentState":"deploymentState",
	"samDomain":"domain",
	"samEgressFilterId":"egressFilterId",
	"samEgressFilterName":"egressFilterName",
	"samEgressFilterPointer":"egressFilterPointer",
	"samEgressFilterType":"egressFilterType",
	"samEgressIpFilterId":"egressIpFilterId",
	"samEgressLabel":"egressLabel",
	"samEgressMacFilterId":"egressMacFilterId",
	"samEncapsulationType":"encapsulationType",
	"samFromCtp":"fromCtp",
	"samFromNodeId":"fromNodeId",
	"samFromNodeName":"fromNodeName",
	"samHighestIngressFc":"highestIngressFc",
	"samIngressFilterId":"ingressFilterId",
	"samIngressFilterName":"ingressFilterName",
	"samIngressFilterPointer":"ingressFilterPointer",
	"samIngressFilterType":"ingressFilterType",
	"samIngressIpFilterId":"ingressIpFilterId",
	"samIngressLabel":"ingressLabel",
	"samIngressMacFilterId":"ingressMacFilterId",
	"samInterfaceName":"interfaceName",				// Spoke SDP only
	"samInterfacePointer":"interfacePointer",			// Spoke SDP only
	"samLabelMismatch":"labelMismatch",
	"samLightweightSdp":"lightweightSdp",
	"samMacPinning":"macPinning",
	"samMtuMismatch":"mtuMismatch",
	"samName":"name",
	"samOamEnabled":"oamEnabled",
	"samObjectFullName":"objectFullName",
	"samOperationalEgressLabel":"operationalEgressLabel",
	"samOperationalFlags":"operationalFlags",
	"samOperationalIngressLabel":"operationalIngressLabel",
	"samOperationalState":"operationalState",
	"samPathId":"pathId",
	"samPathMtu":"pathMtu",
	"samPathName":"pathName",
	"samPathPointer":"pathPointer",
	"samRedundantServiceId":"redundantServiceId",                // Spoke SDP only
	"samReturnCircuitPointer":"returnCircuitPointer",
	"samReturnPathId":"returnPathId",
	"samReturnPathName":"returnPathName",
	"samReturnPathPointer":"returnPathPointer",
	"samSelfAlarmed":"selfAlarmed",
	"samServiceId":"serviceId",
	"samServiceName":"serviceName",
	"samServiceType":"serviceType",
	"samShgName":"shgName",
	"samShgSitePointer":"shgSitePointer",
	"samSignallingType":"signallingType",
	"samSpokeConnectorPointer":"spokeConnectorPointer",	     // Spoke SDP only
	"samSubscriberId":"subscriberId",
	"samSubscriberName":"subscriberName",
	"samSvcComponentId":"svcComponentId",
	"samToCtp":"toCtp",
	"samToNodeId":"toNodeId",
	"samToNodeName":"toNodeName",
	"samTotalBandwidthFactor":"totalBandwidthFactor",
	"samTunnelAutoselectionReturnSpokeCircuitTunnelId":"tunnelAutoselectionReturnSpokeCircuitTunnelId",
	"samTunnelAutoselectionReturnTunnelTransportPreference":"tunnelAutoselectionReturnTunnelTransportPreference",
	"samTunnelAutoselectionTunnelTransportPreference":"tunnelAutoselectionTunnelTransportPreference",
	"samTunnelSelectionTerminationSiteId":"tunnelSelectionTerminationSiteId",
	"samUseDefaultVcTag":"useDefaultVcTag",
	"samVcId":"vcId",
	"samVcIdMismatch":"vcIdMismatch",
	"samVcType":"vcType",
	"samVlanVcTag":"vlanVcTag"

};

for( var i in svt_sdp_binding_Name)
{
//	MasterPropertyMap[i] = svt_sdp_binding_Name[i];
	MasterPropertyMap[svt_sdp_binding_Name[i]] = i;
	ReverseMasterPropertyMap[svt_sdp_binding_Name[i]] = i;
	reverse_svt_sdp_binding_Name[svt_sdp_binding_Name[i]] = i;
}

// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.

var sdpMapFunctions = { "operationalState": getSDPMappedPropString,
				"administrativeState": getSDPMappedPropString };

var mapSDPOperationalState = { "0":"circuitUnknown",
				"1":"circuitUp",
				"2":"circuitNoEgressLabel",
				"3":"circuitNoIngressLabel",
				"4":"circuitNoLabels",
				"5":"circuitDown",
				"6":"circuitMtuMismatch",
				"7":"circuitTunnelMtuTooSmall",
				"8":"circuitTunnelNotReady",
				"9":"circuitTunnelDown" };

var mapSDPAdministrativeState = { "0":"circuitUnknown",
				  "1":"circuitUp",
				  "2":"circuitDown" };

var mapForSDPProp = {"operationalState": mapSDPOperationalState, 
			"administrativeState": mapSDPAdministrativeState };

function getSDPMappedPropString(objectName, propName, sp) 
{
	var spMap = mapForSDPProp[propName];	
	if (isDef(spMap)) 
	{
		return(getMappedPropString(spMap, objectName, propName, sp));
	}
	else 
	{
			return;
	}
}

// Thus ends the code used to map the status values
function svt_sdp_binding(samObject, modelInterface)
{
	//debug//logP4Msg("svt_sdp_binding", "SAMIF", "entered");
	//var element;
    //var subelement;
    var propObject;
    //var name;

    //element = OPERATOR.elementNamedOrNew(samObject.siteId);
    //element.name = "5620SAM_Bind_Sub_"+samObject.subscriberId+"_Srv_"+samObject.serviceId+"_FromNode_"+samObject.fromNodeId;
    var _name = "5620SAM_Bind_Sub_"+samObject.subscriberId+"_FromNode_"+samObject.fromNodeId;
    var element = OPERATOR.elementNamedOrNew(_name);
    element.name = _name;
    element.state = true;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;

    var subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName.toString());
    subelement.state = true;
    subelement.name = samObject.objectFullName;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_SdpBinding";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
    //subelement.timestamp = samObject.timestamp;
    
    //subelement.label = samObject.fromNodeId.toString()+"-"+samObject.toNodeId.toString();
    logP3Msg("svt_sdp_binding","SAMIF","toNodeName: "+samObject.toNodeName+" fromNodeName: "+samObject.fromNodeName);
    if (isConfig("inv_uses_names")) 
    {
    	subelement.label = "5620SAM_SdpBinding_"+samObject.subscriberId+"_"+samObject.pathId+"_"+samObject.serviceId+"_"+samObject.fromNodeName+"-"+samObject.toNodeName;
    } 
    else 
    {
    	subelement.label = "5620SAM_SdpBinding_"+samObject.subscriberId+"_"+samObject.pathId+"_"+samObject.serviceId+"_"+samObject.fromNodeId+"-"+samObject.toNodeId;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_SdpBinding");

    //debug//logP4Msg("svt_sdp_binding", "SAMIF", "about to do properties");

    for( var i in svt_sdp_binding_Name) 
    {
    	//nilStatus("Checking i", i);
    	//nilStatus(i.toString(), svt_sdp_binding_Name[i]);
    	if ( samObject[ svt_sdp_binding_Name[i] ] != undefined )
        {
    		subelement.addProperty( i.toString(), samObject[ svt_sdp_binding_Name[i] ].toString() );
        }

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

	//Storage of properties for later enrichment of VCCV ping resources
	var vccv_properties = ["serviceId", "fromNodeId", "toNodeId", "fromNodeName", "toNodeName", "objectFullName"];
	propObject = createOrFindPropEntry(sdp_property_storage, samObject.objectFullName);
	copyPropertiesToObject(samObject, propObject, vccv_properties);
	
	//subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);
} //svt_sdp_binding


