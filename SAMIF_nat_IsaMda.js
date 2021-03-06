// Alcatel-Lucent 5620 SAM Pack for 9500 microwave

// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_nat_IsaMda_Name = {},
nat_IsaMda_Name =
{
	"samObjectFullName"      : "objectFullName",	
	"samCardSlot"			 : "cardSlot",	
	"samChassisIndex"		 : "chassisIndex",
	"samMdaSlot"			 : "mdaSlot",
	"samGroupNumber"		 : "groupNumber",
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId"
};

for( var i in nat_IsaMda_Name)
{
	MasterPropertyMap[nat_IsaMda_Name[i]] = i;
	ReverseMasterPropertyMap[nat_IsaMda_Name[i]] = i;
	reverse_nat_IsaMda_Name[nat_IsaMda_Name[i]] = i;
}

function nat_IsaMda(samObject, modelInterface, className)
{
	
	logP3Msg("nat_IsaMda", "SAMIF"  , "entered nat_IsaMda");
    var element;
    var subelement;

    //element = OPERATOR.elementNamedOrNew(samObject.siteId.toString());
    element = OPERATOR.elementNamedOrNew(samObject.siteName);
    element.name = samObject.siteName;
    element.state = true;
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;
    //element.timestamp = PV.currentInputDescriptor.timestamp;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_Mda";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
    
    
//    element = modelInterface.Element();
//    element.state = true;
//    element.name = samObject.siteName.toString();
//    element.origin = "SAM" ;
//    element.collectorNumber = polled_stats_collector;
//
//    subelement = modelInterface.Subelement();
//      
//    //var simplePortName = samObject.siteId.toString() + "_" + samObject.shelfId.toString() + "/" + samObject.cardSlotId.toString() + "/" + samObject.daughterCardSlotId.toString() + "/" + samObject.portId.toString();
//
//    subelement.name = samObject.objectFullName;
//    subelement.state = true;
//    subelement.origin = "SAM";
//    subelement.family = "5620_SAM_Mda";
//    subelement.invariant = samObject.objectFullName;
//    subelement.instance = samObject.objectFullName;

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
    subelement.addProperty("samFamilyName", "5620_SAM_Mda");

    for( var i in nat_IsaMda_Name) 
    {
    	if(i.toString() == "samSiteId" && samObject.siteName != undefined){
			 // This is Removed because as per latest CLD this property does not exist
			 //subelement.addProperty("samSiteId", samObject.siteName);
		 }else if ( samObject[ nat_IsaMda_Name[i] ] != undefined ){
             subelement.addProperty( i.toString(), samObject[ nat_IsaMda_Name[i] ].toString() );
             logP4Msg("nat_IsaMda", "addProperty", "property: " + i.toString() +" value: "+ samObject[ nat_IsaMda_Name[i] ].toString() );
 	    }
    }
    
    subelement.element = element;
//subelement.timestamp = modelInterface.currentDate;
//    element.addSubelement(subelement);
//    possible_inline_commit(modelInterface);
    
} 

function jms_delete_nat_IsaMda(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_nat_IsaMda(objectName, propColl)
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
    
    logP4Msg("jms_speed_update_nat_IsaMda", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "myId = "+myId);


	    for( i in propColl)
	    {
	        propName = propColl[i].attributeName;
    	    propValue = propColl[i].newvalue;
	        propOldValue = propColl[i].oldvalue;

	        if (propName == "speed")
	        {
	        	subelement.addProperty("samSpeed", getSpeedString(propValue));
                logP4Msg("jms_speed_update_nat_IsaMda", "SAMIF", "samSpeed old value " + propOldValue);
                logP4Msg("jms_speed_update_nat_IsaMda", "SAMIF", "samSpeed new value " + propValue);
	        }
        }
}

