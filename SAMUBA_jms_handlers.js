// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// This can be called with 4 arguments, or 5.  The mapArray parameter is
// optional and is used only if you need to map numerical values received via
// JMS to text, for properties.

function jms_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray)
{
	//var myId = 0;
	//var currentObject;
	//var qmap;
	var changed, mapped;
	//var i;
	var propName, propValue, mapValue;
	var subelement;

	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", "entered");	

	//myId = modelInterface.idForName(objectName);

	subelement = LOOKUP.get(objectName);
	if(subelement == null)	
	{
		logP5Msg("jms_simple_propChange_with_mapping", "LOOKUP", "Skipping 0 rid for --> "+ subelement);
		return;
	}
	//timestamp = Math.floor(record.timeCaptured/1000);
	// myId = subelement.id;  

	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", "object: "+subelement);	
	//logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", "myId = "+myId);

	//currentObject = modelInterface.Subelement();
	//currentObject.id = myId; 
	changed = 0;
	    
	//nilStatus("jms_simple_propChange_with_mapping currentObject", currentObject);

	//for (var i in propColl) {
	//logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "i="+i);
	//logStatus("jms_simple_propChange_with_mapping propList", propColl[i].attributeName);
	//logStatus("jms_simple_propChange_with_mapping propValue", propColl[i].newvalue);
	//}


	for(var i in propColl)
	{    
		propName = propColl[i].attributeName;
		//propValue = propColl[i].newvalue;
		propValue = propColl[i].newvalue;

        logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "propName: "+propName);
		logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "propValue: "+propValue);
		logStatus("jms_simple_propChange_with_mapping propArray", propArray[propName]);//E.g. reserve_lag_interface_name

		mapped=0;
		if (isDef(mapArray))
        {
		    if (isDef(mapArray[propName]))
            {
				mapValue = mapArray[propName](objectName, propName, propValue);
				changed=1;
		        mapped=1;
				logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", objectName+'==>['+propName+']::'+propValue);	
				logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", propValue+" ==> "+mapValue);
				//As not all inventory class share the same property array
				if(isDef(propArray[propName]))//To handle undefined array object
				{
					logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", propArray[propName]);
					//currentObject.addProperty(propArray[propName].toString(), mapValue);
					subelement.addProperty(propArray[propName].toString(), mapValue);
				}
			}
		}

		//If there is no mapping array, then just do the straight property change
		if ((mapped == 0) && (isDef(propArray[propName]))) //a property we care about
		{ 
			changed=1;
			//debug	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", objectName+'==>['+propName+']::'+propValue);	
			//debug	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", propArray[propName]);
			//currentObject.addProperty(propArray[propName].toString(), propValue);
			subelement.addProperty(propArray[propName].toString(), propValue);
		}
		else 
		{
			//debug	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", propName+": skipping");	
		}
		
		//10 January 2013 - Update JMS timestamp
		if(propColl[i].timestamp)//aka record.timestamp = <int>
		{
			logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "timestamp -> " + propColl[i].timestamp);
			//subelement.timestamp = propColl[i].timestamp;
		}
		else
		{
			logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "timestamp is not set");
		}
	}


	logStatus("jms_simple_propChange_with_mapping changed", changed);
	if (changed == 1) 
	{
		//debug	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", "About to commit subelement);
		//currentObject.commit();
		//debug	logP5Msg("jms_simple_propChange_with_mapping", "SAMIF", "Committed subelement");
	}

	//definite_commit(modelInterface);
	logP4Msg("jms_simple_propChange_with_mapping", "SAMIF", "Committed model interface");
}

//use record instead of objectName since timestamp not updated automatically
function turn_off_SE(record) 
{
    //var myId;
    //var currentObject;
    var subelement;

    subelement = LOOKUP.get(record.objectFullName);
    
    if(subelement == null)	
    {
    	logP5Msg("turn_off_SE", "LOOKUP", "Can't find subelement for --> "+ objectName);
    	return;
    }

    //myId = modelInterface.idForName(delName);
    //logStatus("myId", myId);

    subelement.state = false;
    //subelement.timestamp = record.timestamp;
    /*
	currentObject = modelInterface.Subelement();
	logStatus("currentObject", currentObject);
	currentObject.id = myId;
	currentObject.name = delName;
	currentObject.state = false;
	currentObject.commit();
    */
	
    logP6Msg("jms_delElement", "SAMIF", "deleted (turned off): " + record.objectFullName );
}



// The below are helper functions to convert the standard single-handler with particular arguments
// to the existing UBA JMS functions

function pppInterfaceJmsUpdate(className, objectName, propColl, propArray, mapArray) {

	logP6Msg("pppInterfaceJmsUpdate", "Entered" );
	
    jms_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray);
    ppp_control_protocol_propChange_with_mapping(objectName, propColl);
    
    logP6Msg("pppInterfaceJmsUpdate", "SAMIF", "propColl[0].attributeName -> " + propColl[0]["attributeName"]);
    if(propColl[0]["attributeName"].toString() == "portId")
    {
    	if(isDef(mapPppObjectFullNameToPvSubelement[objectName]) == true)
    	{
    		logP6Msg("pppInterfaceJmsUpdate", "SAMIF", "mapPppObjectFullNameToPvSubelement[objectName] -> " + mapPppObjectFullNameToPvSubelement[objectName]);
    		mapPppObjectFullNameToPvSubelement[objectName].addProperty("samPortId", propColl[0]["newValue"].toString());
    	}
    	
    	if(isDef(mapPPPConProObjectFullNameToPvSubelement[objectName]) == true)
    	{
    		for(var m in mapPPPConProObjectFullNameToPvSubelement[objectName])
    		{
    			logP6Msg("pppInterfaceJmsUpdate", "SAMIF", "mapPPPConProObjectFullNameToPvSubelement[objectName][m] -> " + mapPPPConProObjectFullNameToPvSubelement[objectName][m]);	
    			mapPPPConProObjectFullNameToPvSubelement[objectName][m].addProperty("samPortId", propColl[0]["newValue"].toString());
    		}
    	}
    }
    logP6Msg("pppInterfaceJmsUpdate", "SAMIF", "Exiting" );
}

function physicalPortJmsUpdate(className, objectName, propColl, propArray, mapArray)//propColl aka record[0]
{

	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Physical Port JMS -> " + className);
	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Physical Port JMS -> " + propColl);
	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Physical Port JMS -> " + objectName);
	
    jms_lag_update(className, objectName, propColl);
    jms_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray);
    propChange_service_access_interface(className, objectName, propColl, propArray, mapArray);
	
	// Set a flag indicating that this record should be used for availability calculations
    // It will get passed on to OPERATOR2 when it is emitted
    // propColl[0] is the record
    
    logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Look into propColl");
    dump_samObject(propColl);
    
    logP4Msg("JMS_ATTRIBUTE", "SAMIF", "Look into propColl[0]");
    dump_samObject(propColl[0]);
    
    if (is_uba_available_schema_active('AVAIL_NAME_SPACE_ACTIVE'))
    {
    	//propColl[0].timestamp = ParseTimestamp(propColl[0].timeCaptured);//Because PP always have TC
    	var _temp = availabilityInputHandler(propColl[0], AVAIL_NAME_SPACES["PHYSICAL_PORT"]);
    	logP4Msg("JMS_ATTRIBUTE", "SAMIF", "_temp -> " + _temp);
    }
    //var nameSpace = AVAIL_NAME_SPACES["SAM_csv_performance"]
    //availabilityInputHandler(propColl, "PHYSICAL_PORT");

}

//Use record instead of delName
//function physicalPortJmsDelete(delName, className)
function physicalPortJmsDelete(record, className)
{
    //jms_delete_equipment_physical_port(delName.toString());
	jms_delete_equipment_physical_port(record);
    // For network queues
    //delete_access_interface(delName.toString());
	delete_access_interface(record.objectFullName);
}

//16 January 2013: User record instead of delName
//function accessInterfaceJmsDelete(delName, className)
function accessInterfaceJmsDelete(record)
{
    turn_off_SE(record);
    delete_access_interface(record.objectFullName);
}

// To replace the modelInterface.idForName that the JMS routines are expecting
function idForName(objectName) 
{
    LOOKUP.get(objectName);
}

function accessInterfaceJmsUpdate(className, objectName, propColl, propArray, mapArray) 
{
	propChange_service_access_interface(className, objectName, propColl, propArray, mapArray);

	//Set a flag indicating that this record should be used for availability calculations
    //It will get passed on to OPERATOR2 when it is emitted
    //propColl[0] is the record
    propColl[0].forAvail="A";  // access interface, though this shouldn't matter

    //Pass the attribute value changes along for availability calculations
    //availabilityInputHandler(propColl);
}


function jmsAtrributeValueChangeDispatchHandler(record, modelInterface, className, classObject) 
{

    var propColl=[];
	
	//We should maybe change the input fields to match this
    record.newvalue = record.newValue;
    record.oldvalue = record.oldValue;
	
	logP3Msg("JMS_HANDLER", "SAMIF", "JMS_HANDLER " + modelInterface);

	//dump_samObject(record);
	//dump_samObject(classObject);
    propColl[0]=record;// Contains the newValue, oldValue, and attributeName//IMPORTANT INDEX!!!

	logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "ClassName:" + className);
    logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "objectName:" + record.objectFullName);
    logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "propColl:" + propColl);
    logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "classObject.dataType:" + classObject.dataType);
    logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "classObject.className:" + classObject.className);
    
    nilStatus("jmsAttributeValueChangeFunc", classObject.jmsAttributeValueChangeFunc);
    //nilStatus("modelInterface", modelInterface);
    //nilStatus("idForName", modelInterface.idForName);
    
	///logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", "modelInterface.idForName:" + modelInterface.idForName);
	
    //This is calling the JMS prop change routines with the standard arguments that they have always had
    classObject.jmsAttributeValueChangeFunc(className, record.objectFullName, propColl, classObject.jmsPropArray, classObject.jmsMapArray);

}

//16 January 2013: pass in record object instead of record.objectfullname***
function jmsDeleteDispatchHandler(record, modelInterface, className, classObject) 
{
    //var propColl;
    // This is calling the existing JMS dispatch routines
    //classObject.jmsDeleteFunc(record.objectFullName, className);
	classObject.jmsDeleteFunc(record, className);
}
