// Alcatel-Lucent 5620 SAM Pack for 9500 microwave

// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_controlprocessor_Name = {},
equipment_controlprocessor_Name =
{
	"samObjectFullName"      : "objectFullName",	
	"samAdministrativeState" : "administrativeState",
	"samEquipmentState"	     : "equipmentState",
	"samOperationalState"	 : "operationalState",
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId",
	"samSlotId"				 : "slotId",	
	"samShelfId"			 : "shelfId"
	 
};

for( var i in equipment_controlprocessor_Name)
{
	MasterPropertyMap[equipment_controlprocessor_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_controlprocessor_Name[i]] = i;
	reverse_equipment_controlprocessor_Name[equipment_controlprocessor_Name[i]] = i;
}

function equipment_controlprocessor(samObject, modelInterface, className)
{
	
	logP3Msg("equipment_controlprocessor", "SAMIF" , "entered equipment_controlprocessor");
	
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
    subelement.family = "5620_SAM_ControlProcessor";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
    
    
    if (isConfig("inv_uses_names"))
    {
        subelement.label = samObject.siteName+"_"+samObject.objectFullName;
    }
    else
    {
        subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_ControlProcessor");

    for( var i in equipment_controlprocessor_Name) 
    {
    	logP3Msg("equipment_controlprocessor", "PRPERTYNAME : " + i.toString() , "Value : "+samObject[ equipment_controlprocessor_Name[i] ].toString());
    	if ( samObject[ equipment_controlprocessor_Name[i] ] != undefined )
        {
                subelement.addProperty( i.toString(), samObject[ equipment_controlprocessor_Name[i] ].toString() );
	    }
    }
    
    subelement.element = element;
//subelement.timestamp = modelInterface.currentDate;
//    element.addSubelement(subelement);
//    possible_inline_commit(modelInterface);
    
} 

function jms_delete_equipment_controlprocessor(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_equipment_controlprocessor(objectName, propColl)
{
    var propName, propValue, propOldValue;
    //var myId = modelInterface.idForName(objectName);
	var subelement;

    subelement = LOOKUP.get(objectName);
    if(subelement == null)	
    {
    	logP5Msg("jms_simple_propChange_with_mapping", "LOOKUP", "Skipping 0 rid for --> "+ objectName);
    	return;
    }
    
    logP4Msg("jms_speed_update_equipment_controlprocessor", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "myId = "+myId);


	    for( i in propColl)
	    {
	        propName = propColl[i].attributeName;
    	    propValue = propColl[i].newvalue;
	        propOldValue = propColl[i].oldvalue;

	        if (propName == "speed")
	        {
	        	subelement.addProperty("samSpeed", getSpeedString(propValue));
                logP4Msg("jms_speed_update_equipment_controlprocessor", "SAMIF", "samSpeed old value " + propOldValue);
                logP4Msg("jms_speed_update_equipment_controlprocessor", "SAMIF", "samSpeed new value " + propValue);
	        }
        }
}

