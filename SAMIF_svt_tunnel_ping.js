// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_svt_tunnel_ping_Name = {},
svt_tunnel_ping_Name = {
	"samAdministrativeState":"administrativeState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samFromNodeId":"fromNodeId",
	"samGlobalId":"globalId",
	"samId":"id",
	"samName":"name",
	"samObjectFullName":"objectFullName",
	"samOriginatingTunnel":"originatingTunnel",
	//Fix Certification bug with wrong samOamTestDestination property value
	//"samOamTestDestination":"originatingTunnel",
	"samTestType":"testType",
	"samForwardingClass":"forwardingClass"
};


for( var i in svt_tunnel_ping_Name)
{
	MasterPropertyMap[svt_tunnel_ping_Name[i]] = i;
	ReverseMasterPropertyMap[svt_tunnel_ping_Name[i]] = i;
	reverse_svt_tunnel_ping_Name[svt_tunnel_ping_Name[i]] = i;
}

function process_svt_tunnel_ping(samObject, modelInterface)
{
    logP4Msg("process_svt_tunnel_ping", "SAMIF", "entered process_svt_tunnel_ping" );
    var element;
    var subelement;

    element = OPERATOR.elementNamedOrNew(samObject.fromNodeId);
    element.state = true;
    element.name = samObject.fromNodeId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    //subelement = modelInterface.Subelement();

	subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;
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
    subelement.addProperty("OAMTestType", "Tunnel Ping");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_OAM_Test");

    logP4Msg("process_svt_tunnel_ping", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_svt_tunnel_ping", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_svt_tunnel_ping", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_svt_tunnel_ping", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in svt_tunnel_ping_Name) 
    {
            if ( samObject[ svt_tunnel_ping_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ svt_tunnel_ping_Name[i] ].toString() );
                }    
    }
	subelement.element = element;
   //subelement.timestamp = modelInterface.currentDate;

    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_svt_tunnel_ping", "SAMIF", "exiting process_svt_tunnel_ping" );

} 


