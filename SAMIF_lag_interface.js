// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_lag_interface_Name = {},
lag_interface_Name = {
"samObjectFullName":"objectFullName",
"samAdministrativeState":"administrativeState",
"samEncapType":"encapType",
"samHwMacAddress":"hwMacAddress",
"samLagId":"lagId",
"samLagName":"name",
"samMacAddress":"macAddress",
"samOperationalState":"operationalState",
"samPortName":"portName",
"samPrimaryLagMemberId":"primaryLagMemberId",
"samPrimaryLagMemberName":"primaryLagMemberName",
"samShelfId":"shelfId",
"samSiteId":"siteId",
"samSiteName":"siteName"
};

var fuller_lag_interface_Name = {
"samObjectFullName":"objectFullName",
"samAccountingPolicyId":"accountingPolicyId",
"samAccountingPolicyName":"accountingPolicyName",
"samAdministrativeState":"administrativeState",
"samCollectStats":"collectStats",
"samDisplayedName":"displayedName",
"samDescription":"description",
"samEncapType":"encapType",
"samEquipmentState":"equipmentState",
"samHwMacAddress":"hwMacAddress",
"samIsLinkUp":"isLinkUp",
"samIsPrimaryLagMember":"isPrimaryLagMember",
"samLagId":"lagId",
"samLagName":"name",
"samMacAddress":"macAddress",
"samMaxSpeed":"maxSpeed",
"samOperationalState":"operationalState",
"samPortName":"portName",
"samPrimaryLagMemberId":"primaryLagMemberId",
"samPrimaryLagMemberName":"primaryLagMemberName",
"samShelfId":"shelfId",
"samSiteId":"siteId",
"samSiteName":"siteName",
"samState":"state",
"samSnmpPortId":"snmpPortId"
};

for( var i in lag_interface_Name)
{
	MasterPropertyMap[lag_interface_Name[i]] = i;
	ReverseMasterPropertyMap[lag_interface_Name[i]] = i;
	reverse_lag_interface_Name[lag_interface_Name[i]] = i;
}

//LAG hashmap and object template
//The hashmap will contain LAG objects
var mapLagObjects = {};
function lag()
{
  this.lagSpeed = 0;
  this.lagFullName = "";
  //this.portSpeed = {};
  this.portSpeed = new Object();

  this.setLagSpeed = setLagSpeed;
  this.getLagSpeed = getLagSpeed;
  this.setLagFullName = setLagFullName;
  this.getLagFullName = getLagFullName;
  this.addPortToLag = addPortToLag;
  this.deletePortFromLag = deletePortFromLag;
}

//Port speed hashmap required for LAG related JMS port speed lookups
var mapPhysicalPortSpeed = {};

function setLagSpeed()
{
  var speed = 0;
  for (var name in this.portSpeed)
  {
	  logP4Msg("setLagSpeed", "SAMIF", "LAG Port adding: " + name + ", " + this.portSpeed[name]);
	  speed += this.portSpeed[name];
	  logP4Msg("setLagSpeed", "SAMIF", "LAG Port speed: " + speed);
  }

  this.lagSpeed = speed;
}

function getLagSpeed()
{
  return this.lagSpeed;
}

function setLagFullName(name)
{
  this.lagFullName = name;
}

function getLagFullName()
{
  return this.lagFullName;
}

function addPortToLag(name, speed)
{
  this.portSpeed[name] = parseFloat(speed);
  this.setLagSpeed();
}

function deletePortFromLag(name)
{
  delete this.portSpeed[name];
  this.setLagSpeed();
}

function get_lag_shortname_in_map(portFullName)
{
  for (var name in mapLagObjects)
  {
    for (var port in mapLagObjects[name].portSpeed)
    {
      if (port == portFullName)
      {   
	logP4Msg("get_lag_shortname_in_map", "SAMIF", "LAG shortname found: " + name);
	return name;
      }
    }
  }
  
  logP4Msg("get_lag_shortname_in_map", "SAMIF", "LAG shortname NOT found!!!");
  return "";
}

function get_lagId_from_fullname(objectFullName)
{
    //fullname: network:10.1.241.74:lag:interface-12
    var fullNamePieces = objectFullName.split(":");//
    var lagIdPieces = fullNamePieces[3].split("-");
    return lagIdPieces[1];
}

function get_siteId_from_fullname(objectFullName)
{
    //fullname: network:10.1.241.74:lag:interface-12
    var fullNamePieces = objectFullName.split(":");
    return fullNamePieces[1];
}

function get_unique_lag_name(lagId, siteId)
{
    return lagId.toString() + "_" + siteId;
}

function get_lag_speed(objectFullName)
{
    var lagShortName = get_unique_lag_name(get_lagId_from_fullname(objectFullName), get_siteId_from_fullname(objectFullName));
    if (isDef(mapLagObjects[lagShortName])) 
    {
    	mapLagObjects[lagShortName].setLagFullName(objectFullName);//x[<id>_<siteId>][name] = <current lag objectfullname>
    }
    else 
    {
    	mapLagObjects[lagShortName] = new lag();//Object refer to above
    	mapLagObjects[lagShortName].setLagFullName(objectFullName);
    }
    logP4Msg("lag_interface", "SAMIF", "LAG (" + lagShortName + ") Speed: " + mapLagObjects[lagShortName].getLagSpeed());

    return mapLagObjects[lagShortName].getLagSpeed();//By default creation, lag speed is always 0
}

function lag_interface(samObject, modelInterface)
{
    logP4Msg("lag_interface", "SAMIF", "entered lag_interface" );
    
    if(accounting_uba == false)
    {
    	logP4Msg("lag_interface", "SAMIF", "Within Performance UBA" );
    	
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
    	subelement.family = "5620_SAM_LAGInterface" ;
    	subelement.invariant = samObject.objectFullName;
    	subelement.instance = samObject.objectFullName;
    	//subelement.timestamp = samObject.timestamp;
    
    	var sub_element_label = samObject.siteId.toString()+"_"+samObject.primaryLagMemberName+"_LAG-"+samObject.lagId;
    	if (isConfig("inv_uses_names"))
    	{
    		sub_element_label = samObject.siteName + "_" + sub_element_label;
    	}
    	subelement.label = sub_element_label;

    	subelement.addProperty("nmVendor", "Alcatel5620SAM");
    	subelement.addProperty("samActualSpeed", get_lag_speed(samObject.objectFullName).toString());//By default creation, lag speed is always 0

    	//This property added for TCR enablement, it will be use for Cognos resource grouping
    	subelement.addProperty("samFamilyName", "5620_SAM_LAGInterface");

    	for( var i in lag_interface_Name) 
    	{
    		if ( samObject[ lag_interface_Name[i] ] != undefined )
    		{
    			subelement.addProperty( i.toString(), samObject[ lag_interface_Name[i] ].toString() );
    		}    
    	}

    	//subelement.timestamp = modelInterface.currentDate;

    	subelement.element = element;
    	//element.addSubelement(subelement);
    	//possible_inline_commit(modelInterface);
    }
    else
    {
    	logP4Msg("lag_interface", "SAMIF", "Do not proceed with inventory creation since within Accounting UBA" );
    }
}


function add_equipment_physical_port_to_lag(lagMembershipId, siteId, portSpeed, portFullName)
{
	if (lagMembershipId > 0) 
	{
		var lagShortName = get_unique_lag_name(lagMembershipId, siteId);

		if (! isDef(mapLagObjects[lagShortName])) 
		{
			mapLagObjects[lagShortName] = new lag();
		}

		mapLagObjects[lagShortName].addPortToLag(portFullName, portSpeed);
		logP4Msg("add_equipment_physical_port_to_lag", "SAMIF", "LAG Interface Speed Updated (" + lagShortName + "): " + mapLagObjects[lagShortName].getLagSpeed());

		jms_update_lag_actual_speed("add_equipment_physical_port_to_lag", lagShortName, modelInterface);
	}
}


//function jms_delete_lag_interface(objectFullName, modelInterface)
function jms_delete_lag_interface(record, modelInterface)
{
    logP4Msg("delete_lag_interface", "SAMIF", "entered delete_lag_interface" );
    
    //logP4Msg("delete_lag_interface", "DEBUG", "record -> " + record);
    var objectFullName = record.objectFullName;//E.g ObjectFullname: network:10.1.241.74:lag:interface-12
    //logP4Msg("delete_lag_interface", "DEBUG", "objectFullName -> " + objectFullName);
    
    var lagId = get_lagId_from_fullname(objectFullName);//E.g. 12
    var siteId = get_siteId_from_fullname(objectFullName);//E.g. 10.1.241.74
    var lagShortName = get_unique_lag_name(lagId, siteId);//E.g. 12_10.1.241.74
    var subelement = OPERATOR.subelementNamed(objectFullName);
    if(subelement == null)
    {
    	logP4Msg("delete_lag_interface", "SAMIF", "No such LAG subelement found -> " + subelement);
    	return;
    }
    //var myId = modelInterface.idForName(objectFullName);
    //var myId = subelement.id;
    
    if (isDef(mapLagObjects[lagShortName])) 
    {
    	delete mapLagObjects[lagShortName];
     	logP4Msg("delete_lag_interface", "SAMIF", "LAG map removed:: " + lagShortName);
    }
    else 
    {
    	logP4Msg("delete_lag_interface", "SAMIF", "LAG map removal not required:: " + lagShortName);
    }

    //if(myId != 0)
    if(subelement != null)
    {
    	//lagObject = modelInterface.Subelement();
      	//lagObject.id = myId;
      	//lagObject.state = false;
      	//lagObject.commit();
    	subelement.state = false;
    	//logP4Msg("delete_lag_interface", "DEBUG", "record.timestamp -> " + record.timestamp);
    	//subelement.timestamp = record.timestamp;
    	
      	logP4Msg("delete_lag_interface", "SAMIF", "deleted (turned off): " + objectFullName);
    }
    else 
    {
    	logP4Msg("delete_lag_interface", "SAMIF", "Could not find Object!!!: " + objectFullName);
    }
}

function jms_lag_update(className, objectName, propColl)
{
	var propName, propValue, propOldValue;
	//var myId = modelInterface.idForName(objectName);
  
	var subelement;//, myId;
	subelement=LOOKUP.get(objectName);
	logP5Msg("jms_lag_update", "SAMIF", "object: "+objectName);	
	//logP5Msg("jms_lag_update", "SAMIF", "myId = "+myId);

	//if (myId != 0)
	//{	
	if (isDef(subelement))
	{ 
		//var currentObject = modelInterface.Subelement();
		//currentObject.id = myId; 

		for( i in propColl)
		{    
			propName = propColl[i].attributeName;
			propValue = propColl[i].newvalue;
			propOldValue = propColl[i].oldvalue;

			if ((propName == "lagMembershipId") && (propValue == 0))
			{
				jms_delete_equipment_physical_port_from_lag(propOldValue, objectName, modelInterface);
			}
			
			if ((propName == "lagMembershipId") && (propValue > 0))
			{
				jms_add_equipment_physical_port_to_lag(propValue, objectName, modelInterface);
			}
			
			if (propName == "actualSpeed")
			{
				jms_update_equipment_physical_port_speed_in_lag(propValue, objectName, modelInterface);
			}
      
			//10 January 2013 - Update JMS timestamp
			if(propColl[i].timestamp)//aka record.timestamp = <int>
			{
				logP4Msg("jms_lag_update", "SAMIF", "timestamp -> " + propColl[i].timestamp);
				//subelement.timestamp = propColl[i].timestamp;
			}
			else
			{
				logP4Msg("jms_lag_update", "SAMIF", "timestamp is not set");
			}
		}
		//}
	}
	else 
	{
		logP4Msg("jms_lag_update", "SAMIF",  "Could not find Object!!!: " + objectName );
	}
}

//02 April 2013: Branching from jms_lag_update()
function jms_add_equipment_physical_port_to_lag(lagId, objectFullName, modelInterface)
{
    logP4Msg("jms_add_equipment_physical_port_to_lag", "SAMIF", "entered add_equipment_physical_port_to_lag");

    var lagShortName = get_unique_lag_name(lagId, get_siteId_from_fullname(objectFullName));
    if (isDef(mapLagObjects[lagShortName])) 
    {
    	var portSpeed = mapPhysicalPortSpeed[objectFullName];//Coming from equipment.PhysicalPort
    	mapLagObjects[lagShortName].addPortToLag(objectFullName, portSpeed);
    
    	// Update the LAG samActualSpeed property
    	jms_update_lag_actual_speed("Added physical port to LAG: " + objectFullName, lagShortName, modelInterface);
    }
    else 
    {
    	logP4Msg("jms_add_equipment_physical_port_to_lag", "SAMIF",  "LAG not found in map!!!: " + lagShortName);
    }
}

//02 April 2013: Branching from jms_lag_update()
function jms_delete_equipment_physical_port_from_lag(lagId, objectFullName, modelInterface)
{
    logP4Msg("delete_equipment_physical_port_from_lag", "SAMIF", "entered delete_equipment_physical_port_from_lag");

    var lagShortName = get_unique_lag_name(lagId, get_siteId_from_fullname(objectFullName));//E.g <id>_<siteId>
    if (isDef(mapLagObjects[lagShortName])) 
    {
    	mapLagObjects[lagShortName].deletePortFromLag(objectFullName);
        // Update the LAG samActualSpeed property
    	jms_update_lag_actual_speed("Deleted physical port from LAG: " + objectFullName, lagShortName, modelInterface);
    }
    else
    {
    	logP4Msg("delete_equipment_physical_port_from_lag", "SAMIF",  "LAG not found in map!!!: " + lagShortName);
    }

}

//02 April 2013: Branching from jms_lag_update()
function jms_update_equipment_physical_port_speed_in_lag(newSpeed, objectFullName, modelInterface)
{
    logP4Msg("update_equipment_physical_port_speed_in_lag", "SAMIF", "entered add_equipment_physical_port_to_lag");

    var lagShortName = get_lag_shortname_in_map(objectFullName);
    if (isDef(mapLagObjects[lagShortName])) 
    {
      mapLagObjects[lagShortName].deletePortFromLag(objectFullName);
      mapLagObjects[lagShortName].addPortToLag(objectFullName, newSpeed);

      // Update the physical port speed mapping
      mapPhysicalPortSpeed[objectFullName] = newSpeed;
          
      // Update the LAG samActualSpeed property
      jms_update_lag_actual_speed("Changed physical port speed in LAG: " + objectFullName, lagShortName, modelInterface);
    }
    else 
    {
    	logP4Msg("update_equipment_physical_port_speed_in_lag", "SAMIF",  "LAG not found in map!!!: " + lagShortName);
    }
}

function jms_update_lag_actual_speed(msg, lagShortName, modelInterface)
{
    logP4Msg("jms_update_lag_actual_speed", "SAMIF", "entered jms_update_lag_actual_speed");

    // Update the LAG samActualSpeed property
    var lagObjectFullName = mapLagObjects[lagShortName].getLagFullName();
	var subelement = LOOKUP.get(lagObjectFullName);
	//If subelement created == in mapLagObjects array???
	//Added into mapLagObjects the moment function get_lag_speed() is invoked.
	
    //var myId = modelInterface.idForName(lagObjectFullName);
    //if (myId != 0)
    //{
	if (subelement != null)
	{
		var speed_str = mapLagObjects[lagShortName].getLagSpeed().toString();
		/*
      	var lagObject = modelInterface.Subelement();
      	lagObject.id = myId;
      	lagObject.addProperty("samActualSpeed", speed_str);
      	lagObject.commit();
		*/
		subelement.addProperty("samActualSpeed", speed_str);
		logP4Msg("jms_update_lag_actual_speed", "SAMIF", msg);
		logP4Msg("jms_update_lag_actual_speed", "SAMIF", "LAG Interface Speed Updated (" + lagShortName + "): " + speed_str);
		//}
	}
    else 
    {
    	logP4Msg("jms_update_lag_actual_speed", "SAMIF", "Could not find Object!!!: " + lagObjectFullName);
    }
}
