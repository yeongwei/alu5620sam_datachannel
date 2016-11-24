// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_card_slot_Name = {},
    equipment_card_slot_Name = {
	"samAdministrativeState":"administrativeState",
	"samEquipmentState":"equipmentState",
	"samOperationalState":"operationalState",
	"samObjectFullName":"objectFullName",
    "samSlotId":"slotId",
    "samSiteId":"siteId",
    "samSiteName":"siteName",	
	"samShelfId":"shelfId",
	"samShelfType":"shelfType"
    };    

for( var i in equipment_card_slot_Name)
{
        MasterPropertyMap[equipment_card_slot_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_card_slot_Name[i]] = i;
	reverse_equipment_card_slot_Name[equipment_card_slot_Name[i]] = i;
}

var cardSlotMapFunctions = { 	"operationalState": getCardSlotMappedPropString,
				"administrativeState": getCardSlotMappedPropString}; 
				//"shelfType":getCardSlotMappedPropString	};

var mapCardSlotOperationalState = { "1":"unknown",
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

var mapCardSlotAdministrativeState = { "1":"noop",
				 "2":"inService",
				 "3":"outOfService",
				 "4":"diagnose",
				 "5": "operateSwitch" };

/*var mapCardSlotShelfType = { "134":"aos_6850_chassis",
				"135":"aos_6850_24",
				"136":"aos_6850_24x",
				"137":"aos_6850_48",
				"138":"aos_6850_24l",
				"139":"aos_6850_p24",
				"140":"aos_6850_48l",
				"141":"aos_6850_p24x",
				"142":"aos_6850_48x",
				"143":"aos_6850_p48",
				"144":"aos_6850_p48l",
				"145":"aos_6850_u24x",
				"147":"aos_6850_p48x",
				"148":"aos_6850_p24l",
				"149":"aos_6855_chassis",
				"150":"aos_6855_14",
				"151":"aos_6855_24",
				"152":"aos_6855_u10",
				"153":"aos_6855_u24",
				"154":"aos_6400_chassis",
				"155":"aos_6400_24",
				"156":"aos_6400_p24",
				"157":"aos_6400_u24",
				"158":"aos_6400_du24",
				"159":"aos_6400_48",
				"160":"aos_6400_p48",
				"161":"aos_9600_5Slot",
				"162":"aos_9700_10Slot",
				"163":"aos_9800_18Slot",
				"174":"aos_6850_24lu",
				"175":"aos_6850_p24lu",
				"176":"aos_6850_48lu",
				"177":"aos_6850_p48lu",
				"183":"aos_6250_chassis",
				"184":"aos_6250_8m",
				"185":"aos_6250_24m",
				"186":"aos_6250_24md",
				"187":"aos_6250_24",
				"188":"aos_6250_p24",
				"189":"aos_9700e_10Slot",
				"190":"aos_9800e_18Slot",
				"220":"aos_6855_chassis_stk",
				"221":"aos_6855_u24x"	};*/

var mapForCardSlotProp = {"operationalState": mapCardSlotOperationalState, 
			"administrativeState": mapCardSlotAdministrativeState}; 
			//"shelfType": mapCardSlotShelfType	};

function getCardSlotMappedPropString(objectName, propName, sp) {
	var spMap = mapForCardSlotProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}

// Thus ends the code used to map the status values




function process_equipment_card_slot(samObject, modelInterface)
{
    logP4Msg("I", "SAMIF", "entered equipment_card_slot" );
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
    subelement.family = "5620_SAM_CardSlot" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
    if (isConfig("inv_uses_names")) {
	subelement.label = samObject.siteName+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }
    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_CardSlot");

    for( var i in equipment_card_slot_Name) 
    {
            if ( samObject[ equipment_card_slot_Name[i] ] != undefined )
			{
					subelement.addProperty( i.toString(), samObject[ equipment_card_slot_Name[i] ].toString() );
					logP4Msg("Add Property CardSlot", "SAMIF", "Adding Property" + i + "Value:" + samObject[ equipment_card_slot_Name[i]] );
			}    
    }

   //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

}  // process_equipment_cardslot

