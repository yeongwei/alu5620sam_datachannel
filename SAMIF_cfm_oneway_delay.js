// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_cfm_oneway_delay_Name = {},
    cfm_oneway_delay_Name = {
	"samAdministrativeState":"administrativeState",
//	"samEquipmentState":"equipmentState",
	"samDeploymentState":"deploymentState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	//"samfromNodeId":"fromNodeId",
        "samSiteId":"siteId",
	"samObjectFullName":"objectFullName",
	"samOriginatingNode":"originatingNode",
	"samOriginatingMep":"originatingMep",
	"samMepId":"mepId",
	"samMaintenanceAssociationId":"maintenanceAssociationId",
	"samMaintenanceDomainId":"maintenanceDomainId"
 };


for( var i in cfm_oneway_delay_Name)
    {
	MasterPropertyMap[cfm_oneway_delay_Name[i]] = i;
	ReverseMasterPropertyMap[cfm_oneway_delay_Name[i]] = i;
	reverse_cfm_oneway_delay_Name[cfm_oneway_delay_Name[i]] = i;
    }

function process_cfm_oneway_delay(samObject, modelInterface)
{
    logP4Msg("process_cfm_oneway_delay", "SAMIF", "entered process_cfm_oneway_delay" );
    var element;
    var subelement;
    
    for( var i in samObject)
    {
        logP4Msg("process_cfm_oneway_delay","SAMIF",i + " : " + samObject[i]);
    }

    element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.state = true;
    element.name = samObject.siteId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_CfmOneWayDelay";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.siteId])) {
	subelement.label = mapSiteName[samObject.siteId]+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("CFMTestType", "One-Way Delay");
    
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_CfmOneWayDelay");

    logP4Msg("process_cfm_oneway_delay", "SAMIF", "Element: "+element.name);
    logP4Msg("process_cfm_oneway_delay", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_cfm_oneway_delay", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_cfm_oneway_delay", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_cfm_oneway_delay", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in cfm_oneway_delay_Name) 
	{
            if ( samObject[ cfm_oneway_delay_Name[i] ] != undefined )
                {
		    subelement.addProperty( i.toString(), samObject[ cfm_oneway_delay_Name[i] ].toString() );
                }    
	}

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

    logP4Msg("process_cfm_oneway_delay", "SAMIF", "exiting process_cfm_oneway_delay" );

} 


