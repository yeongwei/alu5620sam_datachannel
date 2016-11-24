// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_hwEnvironment_Name = {},
    equipment_hwEnvironment_Name = {
    "samObjectFullName":"objectFullName",
    "samShelfId":"shelfId",
    "samTemperatureThreshold":"temperatureThreshold",
    "samTemperatureThresholdInFahrenheit":"temperatureThresholdInFahrenheit",
    "samSlotId":"slotId",
    "samSiteName":"siteName",
    "samSiteId":"siteId",
    "samDaughterCardSlotId":"daughterCardSlotId"
    };    

for( var i in equipment_hwEnvironment_Name)
{
    MasterPropertyMap[equipment_hwEnvironment_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_hwEnvironment_Name[i]] = i;
	reverse_equipment_hwEnvironment_Name[equipment_hwEnvironment_Name[i]] = i;
}

function equipment_hw_environment(samObject, modelInterface)
{
	logP4Msg("equipment_hw_environment", "SAMIF", "entered equipment_hw_environment" );
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
    subelement.family = "5620_SAM_Hw_Environment" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
	
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
    subelement.addProperty("samFamilyName", "5620_SAM_Hw_Environment");

    for( var i in equipment_hwEnvironment_Name) 
    {
    	if ( samObject[ equipment_hwEnvironment_Name[i] ] != undefined )
		{
			subelement.addProperty( i.toString(), samObject[ equipment_hwEnvironment_Name[i] ].toString() );
		}    
    }

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

}//equipment_hw_environment

