// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_physical_port_Name = {};
equipment_physical_port_Name =
{
    "samObjectFullName"      : "objectFullName",		// used explicitly; need to track change?
    "samAdministrativeState" : "administrativeState",
    "samCardSlotId"          : "cardSlotId",			// used explicitly; need to track change?
    "samDaughterCardSlotId"  : "daughterCardSlotId",	// used explicitly; need to track change?
    "samDescription"         : "description",			// describes type of interface
    "samMacAddress"          : "macAddress",
    "samPortName"            : "portName",
    "samPortId"              : "portId", 				// used explicitly; need to track change?
    "samSpeed"               : "speed",
    "samActualSpeed"         : "actualSpeed",
    "samOperationalState"    : "operationalState",
    "samShelfId"             : "shelfId",				// used explicitly; need to track change?
    "samSiteId"              : "siteId",				// used explicitly; need to track change?
    "samSiteName"            : "siteName",
    "samLagMembershipId"     : "lagMembershipId",
    "samSnmpPortId"          : "snmpPortId"
};

//Below variables are used to incorporate 2.12.2.0. sam find2file pack.

var LAG_LOOKUP;
var SAPLOOKUP = "FALSE";

// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.
// Also, these are used by the PPP Channels.

var physicalMapFunctions =
{
    "operationalState"    : getPortMappedPropString,
    "administrativeState" : getPortMappedPropString,
    "speed"               : getPortMappedPropString,
	"encapType"	: getPortMappedPropString
};

var mapOperationalState =
{
    "1" : "portUnknown",
    "2" : "portInService",
    "3" : "portOutOfService",
    "4" : "portDiagnosing",
    "5" : "portFailed"
};

var mapAdministrativeState =
{
    "1" : "portNoop",
    "2" : "portInService",
    "3" : "portOutOfService",
    "4" : "portDiagnose"
};

var mapEncapType =
{
	"0" : "unknown",
	"1" : "nullEncap",
	"2" : "qEncap",
	"3" : "mplsEncap",
	"4" : "bcpNullEncap",
	"5" : "bcpDot1qEncap",
	"6" : "ipcpEncap",
	"7" : "frEncap",
	"8" : "pppAutoEncap",
	"9" : "atmEncap",
	"10" : "qinqEncap",
	"11" : "wanMirrorEncap",
	"12" : "hdlcEncap",
	"13" : "cemEncap",
	"14" : "rhdlcEncap"
};

var mapForInterfaceProp =
{
    "operationalState"    : mapOperationalState, 
    "administrativeState" : mapAdministrativeState,
    "speed"               : mapSpeed,
	"encapType"	: mapEncapType
};

var mapSiteName = {};

var mapQueuePtr = {};

function getPortMappedPropString(objectName, propName, sp)
{
    var spMap = mapForInterfaceProp[propName]; 
    if (isDef(spMap))
    {
	    return(getMappedPropString(spMap, objectName, propName, sp));
    }
    else
	return;
}


// This function is generally used in other classes

function getMappedPropString(spMap, objectName, propName, sp)
{

	nilStatus("spMap", spMap);

	if (isDef(spMap))
    	{
	    if(sp != undefined)
	    {
		var spStr = spMap[sp];
            	logStatus("spStr", spStr);
            	if(spStr != undefined)
		{
		    return spStr;
            	}
	    }

	}

	return "undefined!";
}


// Thus ends the code used to map the status values


for( var i in equipment_physical_port_Name)
{
	MasterPropertyMap[equipment_physical_port_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_physical_port_Name[i]] = i;
	reverse_equipment_physical_port_Name[equipment_physical_port_Name[i]] = i;
}

function equipment_physical_port(samObject, modelInterface, className)
{
    logP4Msg("equipment_physical_port", "SAMIF", "entered equipment_physical_port" );

  //debug    logP4Msg("equipment_physical_port", "SAMIF", "entered equipment_physical_port" );
 // This SAPLOOKUP boolean variable is introduced to create a look-up for sap-lag solution 
 // when the value of this is true it will create only look up and sub - elements related to 
 // eupipment.physicalport will not be cretaed	
    
 //below if loop is fixpack 2.12.2.0   
 SAPLOOKUP = PV.configuration.APP.SAPLAGLOOKUP;

 logP6Msg("PRAS1", "SAMIF", "SAPLOOKUP FLAG IS "+ SAPLOOKUP );

// if (SAPLOOKUP == "TRUE"){
	 
 //}

 // if SAPLOOKUP value is false then this else loop will be executed to create subelements for equipment.physicalport 
// else{

    
    //var element;
    //var subelement;

    // In the logToFile UBA model, we will handle the physical port inventory one one UBA, and the network queue on another
    // That decision is made here
    
    //simplePortName is relevant to both perf inv creation and acct array hashing
    var simplePortName = samObject.siteId + "_" + samObject.shelfId + "/" + samObject.cardSlotId + "/" + samObject.daughterCardSlotId + "/" + samObject.portId;
    logP4Msg("equipment_physical_port", "SAMIF", "[Higher Scope] Simple Port Name:"+simplePortName);
    
    if (accounting_uba == true) 
    {

     	
        if (!isDef(LAG_LOOKUP)){
        	LAG_LOOKUP = new Object();
		logP4Msg("equipment_physical_port", "SAMIF", "LAG LOOKUP ");

        }

        if ( samObject.lagMembershipId != undefined && samObject.siteId != undefined){
		logP4Msg("equipment_physical_port", "SAMIF", "LAG LOOKUP2 ");
              var key = samObject.siteId +"-"+ samObject.lagMembershipId.toLowerCase();
             var lag1 = LAG_LOOKUP[key];
             if (isUndef(lag1)){
            	  lag1 = new Array();
       		      lag1[lag1.length] = samObject.portName;
        		  LAG_LOOKUP[key] = lag1;
           	 }else{
           		 lag1[lag1.length] = samObject.portName;
       		     LAG_LOOKUP[key] = lag1;
            }
        }
    
    	logP4Msg("equipment_physical_port", "SAMIF", "Process Physical Port for accouting uba" );
    	if ((samObject.networkQueueObjectPointer == null) || (samObject.networkQueueObjectPointer == ""))
	    {
    		logP4Msg("equipment_physical_port","SAMIF","No Queue Object Pointer");
		
	    }    
    	else
	    {
    		logP4Msg("equipment_physical_port","SAMIF","samObject.networkQueueObjectPointer -> " + samObject.networkQueueObjectPointer);
    		//	logP4Msg("equipment_physical_port","SAMIF","Adding Queue Object Pointer "+samObject.networkQueueObjectPointer+" to map for "+simplePortName);
    		if (isUndef(mapQueuePtr[samObject.objectFullName]))
		    {
    			mapQueuePtr[samObject.objectFullName] = {};
		    }
    		mapQueuePtr[samObject.objectFullName].pointer = samObject.networkQueueObjectPointer;
    		//e.g network:138.120.242.60:Network Queue:default
    		mapQueuePtr[samObject.objectFullName].simpleName = simplePortName;
    		//138.120.242.60_1/2/1/48
	    }
    	
    	process_access_interface(samObject, modelInterface, className);
    	logP4Msg("equipment_physical_port", "SAMIF", "Returned from process_access_interface");
    	
    	return;
    }
    else
    {
    	logP4Msg("equipment_physical_port", "SAMIF", "Process Physical Port for performance uba" );
    	//element = modelInterface.Element();
    	var element = OPERATOR.elementNamedOrNew(samObject.siteId.toString());
    	//element = OPERATOR.elementNamedOrNew(samObject.siteId);
    	element.state = true;
    	//element.name = samObject.siteId.toString();
    	element.origin = "SAM" ;
    	element.collectorNumber = polled_stats_collector;

    	//subelement = modelInterface.Subelement();
    	logP4Msg("equipment_physical_port", "SAMIF", "Site ID:"+samObject.siteId);

    	//var simplePortName = samObject.siteId.toString() + "_" + samObject.shelfId.toString() + "/" + samObject.cardSlotId.toString() + "/" + samObject.daughterCardSlotId.toString() + "/" + samObject.portId.toString();
    	//This got to be moved higher because if its in acct, an hash array will be constructed
    	//var simplePortName = samObject.siteId + "_" + samObject.shelfId + "/" + samObject.cardSlotId + "/" + samObject.daughterCardSlotId + "/" + samObject.portId;

    	//logP4Msg("equipment_physical_port", "SAMIF", "Simple Port Name:"+simplePortName);

    	//LAG support
    	mapPhysicalPortSpeed[samObject.objectFullName] = samObject.actualSpeed;
    	add_equipment_physical_port_to_lag(samObject.lagMembershipId, samObject.siteId, samObject.actualSpeed, samObject.objectFullName);

    	if (isConfig("inv_uses_names"))
    	{
    		mapSiteName[samObject.siteId] = samObject.siteName;
    	}

    	var subelement = OPERATOR.subelementNamedOrNew(simplePortName);//simplePortName is now at higher scope
    	subelement.state = true;
    	subelement.origin = "SAM";
    	subelement.family = "5620_SAM_PhysicalPort" ;
    	subelement.invariant = samObject.objectFullName;
    	subelement.instance = "If<" + simplePortName +">";
    	subelement.timestamp = samObject.timestamp;
    
    	//logP3Msg("equipment_physical_port","SAMIF", "Timestamp:"+subelement.timestamp);


    	if (isConfig("inv_uses_names"))
    	{
    		subelement.label = samObject.siteName + " " +simplePortName + " " + samObject.actualSpeed.toString();
			
			
			 logP2Msg("In true : jms_speed_update_equipment_physical_port", "SAMIF", "subelement.label: "+subelement.label);	
    	}
    	else
    	{
    		subelement.label = simplePortName + " " + samObject.actualSpeed.toString();
			logP2Msg("In False : jms_speed_update_equipment_physical_port", "SAMIF", "subelement.label: "+subelement.label);
    	}

    	subelement.addProperty("nmVendor", "Alcatel5620SAM");

    	//This property added for TCR enablement, it will be use for Cognos resource grouping
    	subelement.addProperty("samFamilyName", "5620_SAM_PhysicalPort");

	var logMsg = "";
    	for (var i in equipment_physical_port_Name) { 
    		if (samObject[ equipment_physical_port_Name[i] ] != undefined) {
    			if (equipment_physical_port_Name[i] == "speed") {
				var _speedString = getSpeedString(samObject[equipment_physical_port_Name[i]].toString());
    				subelement.addProperty(i.toString(), _speedString);
				logMsg += "speed: " + _speedString + " ";
    			} else {
				var _value = samObject[equipment_physical_port_Name[i]].toString();
    				subelement.addProperty(i.toString(), _value);
				logMsg += i.toString() + ": " +  _value + " ";	
    			}
	
			// if actualSpeed then need to convert to Gbps
			var _actualSpeed = "actualSpeed";
			if (equipment_physical_port_Name[i] == _actualSpeed) {
				var _actualSpeedDisplayVal = new Number(samObject[_actualSpeed] / 1000000).toFixed(2);
				_actualSpeedDisplayVal = _actualSpeedDisplayVal.toString();
				var _regexp = new RegExp("\\.$"); // e.g. 1., 3.
				if (_regexp.test(_actualSpeedDisplayVal)) {
					_actualSpeedDisplayVal = _actualSpeedDisplayVal + "0";
				}
				logMsg += "samActualSpeedDisplay: " + _actualSpeedDisplayVal + " "; 
				subelement.addProperty("samActualSpeedDisplay", _actualSpeedDisplayVal );
			}
    		}
    	}
	logP3Msg("equipment_physical_port", "SAMIF_equipment_physical_port", "Subelement create: " + subelement + " " + logMsg);

    	subelement.element = element; 
    }
} 

//16 January 2013: Use record object instead of objectFullName
//function jms_delete_equipment_physical_port(objectFullName)
function jms_delete_equipment_physical_port(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_equipment_physical_port(objectName, propColl)
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
		
    logP4Msg("jms_speed_update_equipment_physical_port", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_equipment_physical_port", "SAMIF", "myId = "+myId);
	
    for( i in propColl)
    { 
        propName = propColl[i].attributeName;
   	    propValue = propColl[i].newvalue;
        propOldValue = propColl[i].oldvalue;

        if (propName == "speed")//Masking property
        {
	        //var currentObject = modelInterface.Subelement();
            //currentObject.id = myId;
           	//currentObject.addProperty("samSpeed", getSpeedString(propValue));
        	//currentObject.commit();
			subelement.addProperty("samSpeed", getSpeedString(propValue));
				
				
				var tempLabel = subelement.label.toString();
			var tempLabelArray = tempLabel.split(" ");
			
	    	if (isConfig("inv_uses_names"))
	    	{
	    		subelement.label = tempLabelArray[0] + " " +tempLabelArray[1] + " " + getSpeedString(propValue);
				
				 logP2Msg("In true : jms_speed_update_equipment_physical_port", "SAMIF", "UPDATED subelement.label: "+subelement.label);
	    	}
	    	else
	    	{
	    		subelement.label = tempLabelArray[0] + " " + getSpeedString(propValue);
				
				 logP2Msg("In true : jms_speed_update_equipment_physical_port", "SAMIF", "UPDATED subelement.label: "+subelement.label);
	    	}	
				
            logP4Msg("jms_speed_update_equipment_physical_port", "SAMIF", "samSpeed old value " + propOldValue);
            logP4Msg("jms_speed_update_equipment_physical_port", "SAMIF", "samSpeed new value " + propValue);
	    }
    }
}
