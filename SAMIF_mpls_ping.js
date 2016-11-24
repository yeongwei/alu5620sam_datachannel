// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_mpls_ping_Name = {},
mpls_ping_Name = {
	"samAdministrativeState":"administrativeState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samFromNodeId":"fromNodeId",
	"samGlobalId":"globalId",
	"samId":"id",
	"samLsp":"lsp",
	"samLspPath":"lspPath",
	//Fix Certification bug with wrong samOamTestDestination property value
	//"samOamTestDestination":"lsp",
	//"samMplsSite":"mplsSite",
	"samName":"name",
	"samObjectFullName":"objectFullName",
	"samTestTargetType":"testTargetType",
	"samTestType":"testType",
	"samForwardingClass":"forwardingClass"
	//"samTestedObject":"testedObject"
};


for( var i in mpls_ping_Name)
{
	MasterPropertyMap[mpls_ping_Name[i]] = i;
	ReverseMasterPropertyMap[mpls_ping_Name[i]] = i;
	reverse_mpls_ping_Name[mpls_ping_Name[i]] = i;
}

function process_mpls_ping(samObject, modelInterface)
{
    logP4Msg("process_mpls_ping", "SAMIF", "entered process_mpls_ping" );
    var element;
    var subelement;

    //element = modelInterface.Element();
    element = OPERATOR.elementNamedOrNew(samObject.fromNodeId.toString());
    element.state = true;
    element.name = samObject.fromNodeId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    //subelement = modelInterface.Subelement();
    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    //    var simplePortName = samObject.siteId.toString() + "_" + samObject.shelfId.toString() + "/" + samObject.cardSlotId.toString() + "/" + samObject.daughterCardSlotId.toString() + "/" + samObject.portId.toString();

    //    subelement.name = simplePortName;
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_OAM_Test" ;
    subelement.invariant = samObject.objectFullName;
    //    subelement.instance = "If<" + simplePortName +">";
    subelement.instance = samObject.objectFullName;
    //subelement.timestamp = samObject.timestamp;
    
    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.fromNodeId])) {
	subelement.label = mapSiteName[samObject.fromNodeId]+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
	}

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("OAMTestType", "MPLS Ping");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_OAM_Test");

    logP4Msg("process_mpls_ping", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_mpls_ping", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_mpls_ping", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_mpls_ping", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in mpls_ping_Name) 
    {
            if ( samObject[ mpls_ping_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ mpls_ping_Name[i] ].toString() );
                }    
    }

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
   // element.addSubelement(subelement);
   // possible_inline_commit(modelInterface);

    logP4Msg("process_mpls_ping", "SAMIF", "exiting process_mpls_ping" );

} 

