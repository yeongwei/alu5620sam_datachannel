// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_icmp_ping_Name = {},
icmp_ping_Name = {
	"samAdministrativeState":"administrativeState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samEgressIfIndex":"egressIfIndex",
	"samFromNodeId":"fromNodeId",                     // definitely used
	"samGlobalId":"globalId",
	"samId":"id",
	"samName":"name",
	"samNeDeployedTest":"neDeployedTest",
	"samObjectFullName":"objectFullName",
	"samOriginatingNode":"originatingNode",
	"samSourceIpAddress":"sourceIpAddress",
	"samSourceIpAddressType":"sourceIpAddressType",
	"samTargetIpAddress":"targetIpAddress",
	"samTargetIpAddressType":"targetIpAddressType",
	"samTestSuiteId":"testSuiteId",
	"samTestTargetType":"testTargetType",
	"samTestType":"testType",
	"samOamTestDestination":"targetIpAddress",
	"samTimeToLive":"timeToLive"
};


// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.

// These are used to map status values for all of the OAM ping functions

var oamMapFunctions = 
{ 
	"deploymentState": getOamPingMappedPropString,
	"administrativeState": getOamPingMappedPropString,
	"forwardingClass" : getOamPingMappedPropString
};

var mapOamPingDeploymentState = { "0":"deployed",
			   "1":"pending",
			   "2":"failed (resource not available)",
			   "4":"failed (configuration)",
			   "8":"failed (partial)",
			   "16":"failed (internal error)",
			   "64":"postponed" };

var mapOamPingAdministrativeState = { "0":"Unknown",
			       "1":"Enabled",
			       "2":"Disabled"};

var mapOamForwardingClass =
{
	"1":"be",
	"2":"l2",
	"4":"af",
	"8":"l1",
	"16":"h2",
	"32":"ef",
	"64":"h1",
	"128":"nc"
};

var mapForOamPingProp = 
{
	"operationalState": mapOamPingDeploymentState, 
	"administrativeState": mapOamPingAdministrativeState,
	"forwardingClass": mapOamForwardingClass
};

function getOamPingMappedPropString(objectName, propName, sp) {
	var spMap = mapForOamPingProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}


// Thus ends the code used to map the status values


for( var i in icmp_ping_Name)
{
	MasterPropertyMap[icmp_ping_Name[i]] = i;
	ReverseMasterPropertyMap[icmp_ping_Name[i]] = i;
	reverse_icmp_ping_Name[icmp_ping_Name[i]] = i;
}

function process_icmp_ping(samObject, modelInterface)
{
    logP4Msg("process_icmp_ping", "SAMIF", "entered process_icmp_ping" );

    var element;
    var subelement;

    //element = modelInterface.Element();
    element = OPERATOR.elementNamedOrNew(samObject.fromNodeId);
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
    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.fromNodeId]) ) {
	subelement.label=mapSiteName[samObject.fromNodeId]+" "+samObject.objectFullName;
	//	logP4Msg("process_icmp_ping","SAMIF","Label uses name "+mapSiteName[samObject.fromNodeId]);
    }
    else {
	subelement.label = samObject.objectFullName;
	//	logP4Msg("process_icmp_ping","SAMIF","Label uses ID "+samObject.fromNodeId);
    }
    
    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("OAMTestType", "ICMP Ping");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_OAM_Test");


    logP4Msg("process_icmp_ping", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_icmp_ping", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_icmp_ping", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in icmp_ping_Name) 
    {
            if ( samObject[ icmp_ping_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ icmp_ping_Name[i] ].toString() );
                }    
    }

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_icmp_ping", "SAMIF", "exiting process_icmp_ping" );

} 

