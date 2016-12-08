// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// This can be called with 4 arguments, or 5.  The mapArray parameter is
// optional and is used only if you need to map numerical values received via
// JMS to text, for properties.

function jms_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray) {
	var _functionName = "jms_simple_propChange_with_mapping";
	var _componentName = "SAMIF";

	var subelement = LOOKUP.get(objectName);
	if (subelement == null){	
		logP4Msg(_functionName, _componentName, "Object not found for " + subelement);
		return;
	}
	
	var _log = "";	
	var changed = 0;
	
	// logP3Msg(_functionName, _componentName, "Input data: " + propColl);
	// logP3Msg(_functionName, _componentName, "Input data length: " + propColl.length); // Length should almost always be 1
	for (var i in propColl) {
		var propName = propColl[i].attributeName;
		var propValue = propColl[i].newvalue;

		_log += "propName: " + propName + " ";
		_log += "propValue: " + propValue + " ";		
	
		var mapped = 0; // flag to check if attribute value has to be mapped to some other values
		if (isDef(mapArray)) {
		    if (isDef(mapArray[propName])) {
				mapValue = mapArray[propName](objectName, propName, propValue);
				changed = 1;
		        	mapped = 1;
				_log += "mapValue: " + mapValue + " ";	
					
				if (isDef(propArray[propName])) { // make sure that propName is a valid SAM attribute and supported by TP
					subelement.addProperty(propArray[propName].toString(), mapValue);
				}
			}
		}

		// If there is no need to map value to some other values then just do the straight property change
		if ((mapped == 0) && (isDef(propArray[propName]))) { // propArray is usually the variable name starts with reverse_*
			changed = 1;
			subelement.addProperty(propArray[propName].toString(), propValue);
		}
		
		_log += "changed: " + changed + " ";
		_log += "mapped: " + mapped + " ";
		
		if (propColl[i].timestamp) {
			subelement.timestamp = propColl[i].timestamp;
		}
		
		// PMR 16515 START
		if (isDef(propArray[propName])) {
			if (propArray[propName].toString() == "samActualSpeed") {
				 
				var tempLabel = subelement.label.toString();
				var tempLabelArray = tempLabel.split(" ");

				if (isConfig("inv_uses_names")) {
					subelement.label = tempLabelArray[0] + " " + tempLabelArray[1] + " " + propValue;
		    		} else {
		    			subelement.label = tempLabelArray[0] + " " + propValue;
		    		}
				
				_log += "label: " + subelement.label + " ";
	
				// Update samActualSpeedDisplay 
				var _actualSpeedDisplayValue = new Number(propValue / 1000000).toFixed(2);
				_actualSpeedDisplayValue = _actualSpeedDisplayValue.toString();
                        	var _regexp = new RegExp("\\.$"); // e.g. 1., 3.
                        	if (_regexp.test(_actualSpeedDisplayValue)) {
                        	 	_actualSpeedDisplayValue = _actualSpeedDisplayValue + "0";
                        	}
				subelement.addProperty("samActualSpeedDisplay", _actualSpeedDisplayValue);
				_log += "samActualSpeedDisplay: " + _actualSpeedDisplayValue + " ";	
			}
		}
		// PMR 16515 END
		
		logP3Msg(_functionName, _componentName, _log);
	}

	if (changed == 1) {
		OPERATOR.addSubelement(subelement);
	}
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


function jmsAtrributeValueChangeDispatchHandler(record, modelInterface, className, classObject) {
	var _log = "";
	var propColl=[];
	
	record.newvalue = record.newValue;
	record.oldvalue = record.oldValue;
	
	propColl[0] = record; // Contains the newValue, oldValue, and attributeName //IMPORTANT INDEX!!!

	_log += "className: " + className + " classObject.className: " + classObject.className + " classObject.dataType: " + classObject.dataType + " ";
	_log += "classObject.dataType: " + classObject.dataType + " propColl: " + propColl 
	logP3Msg("jmsAttributeValueChangeDispatchHandler", "SAMUBA", _log);
    	
	//This is calling the JMS prop change routines with the standard arguments that they have always had
	classObject.jmsAttributeValueChangeFunc(className, record.objectFullName, propColl, classObject.jmsPropArray, classObject.jmsMapArray);
}

// 16 January 2013: pass in record object instead of record.objectfullname***
function jmsDeleteDispatchHandler(record, modelInterface, className, classObject) {
	classObject.jmsDeleteFunc(record, className);
}
