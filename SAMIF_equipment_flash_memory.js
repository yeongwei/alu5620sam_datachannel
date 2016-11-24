//Licensed Materials - Property of IBM
//5724-W86, 5724-X63
//Copyright IBM Corporation 2013, 2015. All Rights Reserved.
//US Government Users Restricted Rights- Use, duplication or disclosure
//restricted by GSA ADP Schedule Contract with IBM Corp.

//Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_flash_memory_Name = {};
equipment_flash_memory_Name = {
	"samObjectFullName":"objectFullName",
	"samAdministrativeState":"administrativeState",
	"samDisplayedName":"displayedName",
	"samSiteId":"siteId",
	"samSiteName":"siteName",
	"samEquipmentState":"equipmentState",
	"samShelfId":"shelfId",
	"samOperationalState":"operationalState",
	"samDeploymentState":"deploymentState",
	"samName":"name",
	"samSlotName":"slotName",
	"samSlotId":"slotId",
	"samCardId":"cardId",
	"samFlashId":"flashId",
	"samDeviceState":"deviceState",
	"samFlashModelNumber":"flashModelNumber",
	"samFlashSerialNumber":"flashSerialNumber",
	"samFlashFirmwareRevision":"flashFirmwareRevision"
};    

for( var i in equipment_flash_memory_Name)
{
	MasterPropertyMap[equipment_flash_memory_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_flash_memory_Name[i]] = i;
	reverse_equipment_flash_memory_Name[equipment_flash_memory_Name[i]] = i;
}

function equipment_flash_memory(samObject, modelInterface)
{
	logP4Msg("equipment_flash_memory", "SAMIF", "entered equipment_flash_memory" );
	var element;
	var subelement;

	element = OPERATOR.elementNamedOrNew(samObject.siteId);
	element.state = true;
	element.name = samObject.siteId.toString();
	element.origin = "SAM" ;
	element.collectorNumber = polled_stats_collector;

	subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

	subelement.name = samObject.objectFullName;
	subelement.state = true;
	subelement.origin = "SAM";
	subelement.family = "5620_SAM_FMemory" ;
	subelement.invariant = samObject.objectFullName;
	subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

	
	logP4Msg("equipment_flash_memory", "SAMIF", "subelement:" +subelement);
	if (isConfig("inv_uses_names")) 
	{
		subelement.label = samObject.siteName+" "+samObject.objectFullName;
	}
	else 
	{
		subelement.label = samObject.objectFullName;
	}
	subelement.addProperty("nmVendor", "Alcatel5620SAM");

	//This property added for TCR enablement, it will be use for Cognos resource grouping
	subelement.addProperty("samFamilyName", "'5620_SAM_FMemory’");

	for( var i in equipment_flash_memory_Name) 
	{
		if ( samObject[ equipment_flash_memory_Name[i] ] != undefined )
		{
			subelement.addProperty( i.toString(), samObject[ equipment_flash_memory_Name[i] ].toString() );
		}    
	}

	//subelement.timestamp = modelInterface.currentDate;
	subelement.element = element;
	
	logP4Msg("equipment_flash_memory", "SAMIF", "subelement at the end of equipment_flash_memory:" +subelement);
	//element.addSubelement(subelement);
	//possible_inline_commit(modelInterface);

}//

