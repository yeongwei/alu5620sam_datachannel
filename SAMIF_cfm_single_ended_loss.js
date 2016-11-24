// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_cfm_single_ended_loss_Name = {},
    cfm_single_ended_loss_Name = {
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


for( var i in cfm_single_ended_loss_Name)
    {
	MasterPropertyMap[cfm_single_ended_loss_Name[i]] = i;
	ReverseMasterPropertyMap[cfm_single_ended_loss_Name[i]] = i;
	reverse_cfm_single_ended_loss_Name[cfm_single_ended_loss_Name[i]] = i;
    }

function process_cfm_single_ended_loss(samObject, modelInterface)
{
    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "entered process_cfm_single_ended_loss" );
    var element;
    var subelement;

    for( var i in samObject)
    {
    	logP4Msg("process_cfm_single_ended_loss","SAMIF",i + " : " + samObject[i]);
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
    subelement.family = "5620_SAM_CfmSingleEndedLoss";
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
    
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_CfmSingleEndedLoss");

    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in cfm_single_ended_loss_Name) 
	{
            if ( samObject[ cfm_single_ended_loss_Name[i] ] != undefined )
                {
		    subelement.addProperty( i.toString(), samObject[ cfm_single_ended_loss_Name[i] ].toString() );
                }    
	}

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

    logP4Msg("process_cfm_single_ended_loss", "SAMIF", "exiting process_cfm_single_ended_loss" );

} 


