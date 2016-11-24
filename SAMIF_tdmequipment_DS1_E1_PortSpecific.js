// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_tdmequipment_DS1E1_PortSpecific_Name = {},
tdmequipment_DS1E1_PortSpecific_Name =
{
	"samObjectFullName"      : "objectFullName",
	"samDs1PortName"		 : "ds1PortType",		
	"samDisplayedName"		 : "dispName",
	"samShelfId"	 		 : "shelfId",
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId"
	
	 
};

for( var i in tdmequipment_DS1E1_PortSpecific_Name)
{
	MasterPropertyMap[tdmequipment_DS1E1_PortSpecific_Name[i]] = i;
	ReverseMasterPropertyMap[tdmequipment_DS1E1_PortSpecific_Name[i]] = i;
	reverse_tdmequipment_DS1E1_PortSpecific_Name[tdmequipment_DS1E1_PortSpecific_Name[i]] = i;
}

function tdmequipment_DS1E1_PortSpecific(samObject, modelInterface, className)
{
    logP4Msg("tdmequipment_DS1E1_PortSpecific", "SAMIF", "entered tdmequipment_DS1E1_PortSpecific" );
	
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
    subelement.family = "5620_SAM_DS1_E1";
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
    subelement.addProperty("samFamilyName", "5620_SAM_DS1_E1");

      for( var i in tdmequipment_DS1E1_PortSpecific_Name) 
    {
    	if ( samObject[ tdmequipment_DS1E1_PortSpecific_Name[i] ] != undefined )
        {
                subelement.addProperty( i.toString(), samObject[ tdmequipment_DS1E1_PortSpecific_Name[i] ].toString() );
		  

               if(i.toString() == "samDs1PortName"){
            		if (samObject[ tdmequipment_DS1E1_PortSpecific_Name[i] ].toString() == "ds1")
            		{
            			subelement.addProperty( "samDs1PortType", 1 );
            		}
            		if (samObject[ tdmequipment_DS1E1_PortSpecific_Name[i] ].toString() == "e1")
            		{
            			subelement.addProperty("samDs1PortType", 2);
            		}
            		if (samObject[ tdmequipment_DS1E1_PortSpecific_Name[i] ].toString() == "j1")
            		{
            			subelement.addProperty( "samDs1PortType", 3 );
            		}
            	}
	    }
    }
      subelement.element = element;
//subelement.timestamp = modelInterface.currentDate;
//    element.addSubelement(subelement);
//    possible_inline_commit(modelInterface);
    
} 

function jms_delete_tdmequipment_DS1E1_PortSpecific(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_tdmequipment_DS1E1_PortSpecific(objectName, propColl)
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
    
    logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "myId = "+myId);


	    for( i in propColl)
	    {
	        propName = propColl[i].attributeName;
    	    propValue = propColl[i].newvalue;
	        propOldValue = propColl[i].oldvalue;

	        if (propName == "speed")
	        {
	        	subelement.addProperty("samSpeed", getSpeedString(propValue));
                logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "samSpeed old value " + propOldValue);
                logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "samSpeed new value " + propValue);
	        }
        }

}

