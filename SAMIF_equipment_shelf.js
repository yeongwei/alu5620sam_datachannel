// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_shelf_Name = {},
equipment_shelf_Name = {
    "samObjectFullName":"objectFullName",
    "samAdministrativeState":"administrativeState",
    "samDeviceState":"deviceState",
    "samEquipmentState":"equipmentState",
    "samNumberOfCardSlots":"numberOfCardSlots",
    "samOperationalState":"operationalState",
    "samShelfId":"shelfId",
    "samSiteId":"siteId",
    "samSiteName":"siteName",
    "samShelfType":"shelfType"
};

for( var i in equipment_shelf_Name)
{
	MasterPropertyMap[equipment_shelf_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_shelf_Name[i]] = i;
	reverse_equipment_shelf_Name[equipment_shelf_Name[i]] = i;
}

// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.

var shelfMapFunctions = { "operationalState": getShelfMappedPropString,
				"administrativeState": getShelfMappedPropString };

var mapShelfOperationalState = { "1":"unknown",
				"2":"inService",
				"3":"outOfService",
				"4":"diagnosing",
				"5":"failed",
				"6":"booting",
				"7":"empty",
				"8":"provisioned",
				"9":"unprovisioned",
				"10":"upgrade",
				"11":"downgrade",
				"12":"inServiceUpgrade",
				"13":"inServiceDowngrade",
				"14":"resetPending" };

var mapShelfAdministrativeState = { "1":"noop",
				 "2":"inService",
				 "3":"outOfService",
				 "4":"diagnose",
				 "5": "operateSwitch" };



var mapForShelfProp = {"operationalState": mapShelfOperationalState, 
			"administrativeState": mapShelfAdministrativeState };

function getShelfMappedPropString(objectName, propName, sp) 
{
	var spMap = mapForShelfProp[propName];	
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
function equipment_shelf(samObject, modelInterface)
{
    logP4Msg("equipment_shelf", "SAMIF", "entered equipment_shelf" );
    var element;
    var subelement;

    //element = OPERATOR.elementNamedOrNew(samObject.siteId.toString());
    element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.name = samObject.siteId;
    element.state = true;
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;
    //element.timestamp = PV.currentInputDescriptor.timestamp;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_Shelf" ;
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
logP4Msg("equipment_shelf", "SAMIF", "created element and subelement" );
    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_Shelf");

    for( var i in equipment_shelf_Name) 
    {
    	if ( samObject[ equipment_shelf_Name[i] ] != undefined )
		{
    		subelement.addProperty( i.toString(), samObject[ equipment_shelf_Name[i] ].toString() );
			logP4Msg("equipment_shelf", "addProperty", "property: " + i.toString() +" value: "+ samObject[equipment_shelf_Name[i]].toString() );
		}
    }
    subelement.element = element;
	logP4Msg("equipment_shelf", "SAMIF", "Exiting equipment_shelf" );
    //possible_inline_commit(modelInterface);
}//equipment_shelf


