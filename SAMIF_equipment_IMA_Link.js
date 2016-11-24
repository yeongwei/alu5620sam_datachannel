// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_ima_Link_Name = {},
equipment_ima_Link_Name =
{
	"samObjectFullName"      : "objectFullName",	
	"samImaLinkAdminStatus"	 : "imaLinkAdminStatus",
	"samImaLinkGrpName"	     : "imaLinkGrpName",
	"samImaLinkOperStatus"	 : "imaLinkOperStatus",
	"samParentPortId"		 : "parentPortId",
	"samPortId"              : "portId", 				// used explicitly; need to track change?
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId",
	"samSlotId"				 : "slotId"
	 
};

for( var i in equipment_ima_Link_Name)
{
	MasterPropertyMap[equipment_ima_Link_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_ima_Link_Name[i]] = i;
	reverse_equipment_ima_Link_Name[equipment_ima_Link_Name[i]] = i;
}

function equipment_ima_Link(samObject, modelInterface, className)
{
	logP4Msg("equipment_IMA_Link", "SAMIF", "entered equipment_IMA_Link" );
	
    var element;
    var subelement;

	element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.name = samObject.siteId;
    element.state = true;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;
    
    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_IMALink";
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
    subelement.addProperty("samFamilyName", "5620_SAM_IMALink");

    for( var i in equipment_ima_Link_Name) 
    {
    	if ( samObject[ equipment_ima_Link_Name[i] ] != undefined )
        {
                subelement.addProperty( i.toString(), samObject[ equipment_ima_Link_Name[i] ].toString() );
                logP4Msg("equipment_IMA_Link", "addProperty", "property: " + i.toString() +" value: "+ samObject[ equipment_ima_Link_Name[i] ].toString() );
	    }
    }

    subelement.element = element;
//subelement.timestamp = modelInterface.currentDate;
//    element.addSubelement(subelement);
//    possible_inline_commit(modelInterface);
    
} 

function jms_delete_equipment_ima_Link(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_equipment_ima_Link(objectName, propColl)
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
    
    //var myId = modelInterface.idForName(objectName);
  
    logP4Msg("jms_speed_update_equipment_ima_Link", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_equipment_ima_Link", "SAMIF", "myId = "+myId);


	    for( i in propColl)
	    {
	        propName = propColl[i].attributeName;
    	    propValue = propColl[i].newvalue;
	        propOldValue = propColl[i].oldvalue;

	        if (propName == "speed")
	        {
		        //var currentObject = modelInterface.Subelement();
	            //currentObject.id = myId;
	           	//currentObject.addProperty("samSpeed", getSpeedString(propValue));
	        	//currentObject.commit();
				subelement.addProperty("samSpeed", getSpeedString(propValue));

                logP4Msg("jms_speed_update_equipment_ima_Link", "SAMIF", "samSpeed old value " + propOldValue);
                logP4Msg("jms_speed_update_equipment_ima_Link", "SAMIF", "samSpeed new value " + propValue);
	        }
        }

}

