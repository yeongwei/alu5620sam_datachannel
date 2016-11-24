// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_cfm_ethernet_Name = {},
    cfm_ethernet_Name = {
	"samAdministrativeState":"administrativeState",
	//"samEquipmentState":"equipmentState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
    "samSiteId":"siteId",
	//"samfromNodeId":"fromNodeId",
	"samObjectFullName":"objectFullName",
	"samOriginatingNode":"originatingNode",
	"samOriginatingMep":"originatingMep",
	"samMepId":"mepId",
	"samMaintenanceAssociationId":"maintenanceAssociationId",
	"samMaintenanceDomainId":"maintenanceDomainId"
 };

 var cfmTestMapFunctions = { 	"deploymentState": getCfmTestMappedPropString,
				"administrativeState": getCfmTestMappedPropString,
				"forwardingClass": getCfmTestMappedPropString
			};

var mapCfmTestDeploymentState = { 	"0":"deployed",
					"1":"pending",
					"2":"failed (resource not available)",
					"4":"failed (configuration)",
					"8":"failed (partial)",
					"16":"failed (internal error)",
					"64":"postponed"
				};

var mapCfmTestAdministrativeState = { 	"0":"Unknown",
					"1":"Enabled",
					"2":"Disabled"
				};

var mapCfmTestForwardingClass = {
		"1": "be", "2": "l2", "4": "af", "8": "l1", "16": "h2", "32": "ef", "64": "h1", "128": "nc"
};

var mapForCfmTestProp = {	"operationalState": mapCfmTestDeploymentState, 
				"deploymentState": mapCfmTestDeploymentState, 
				"administrativeState": mapCfmTestAdministrativeState,
				"forwardingClass": mapCfmTestForwardingClass
			};

function getCfmTestMappedPropString(objectName, propName, sp) {
	var spMap = mapForCfmTestProp[propName];	
	if (isDef(spMap)) {
			return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}

for( var i in cfm_ethernet_Name)
{
	MasterPropertyMap[cfm_ethernet_Name[i]] = i;
	ReverseMasterPropertyMap[cfm_ethernet_Name[i]] = i;
	reverse_cfm_ethernet_Name[cfm_ethernet_Name[i]] = i;
}

function process_cfm_ethernet(samObject, modelInterface)
{
    logP4Msg("process_cfm_ethernet", "SAMIF", "entered process_cfm_ethernet" );
    var element;
    var subelement;

    for( var i in samObject)
    {
        logP4Msg("process_cfm_ethernet","SAMIF",i + " : " + samObject[i]);
    }

    element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.state = true;
    element.name = samObject.siteId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    //subelement = modelInterface.Subelement();

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_CfmEthTest";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.siteId])) 
    {
    	subelement.label = mapSiteName[samObject.siteId]+" "+samObject.objectFullName;
    }
    else 
    {
    	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_CfmEthTest");

    logP4Msg("process_cfm_ethernet", "SAMIF", "Element: "+element.name);	
    logP4Msg("process_cfm_ethernet", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_cfm_ethernet", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_cfm_ethernet", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_cfm_ethernet", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in cfm_ethernet_Name) 
	{
    	if ( samObject[ cfm_ethernet_Name[i] ] != undefined )
        {
    		subelement.addProperty( i.toString(), samObject[ cfm_ethernet_Name[i] ].toString() );
        }    
	}

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_cfm_ethernet", "SAMIF", "exiting process_cfm_ethernet" );

} 


