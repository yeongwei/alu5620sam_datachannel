// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// The functions and data in this file are used to map the numerical
// status values received from JMS to text strings so they are
// consistent with the status values set during full dump.


// this section is for equipment.physicalPort

var physicalMapFunctions = { "operationalState": getPortMappedPropString,
				"administrativeState": getPortMappedPropString };

var mapOperationalState = { "1":"portUnknown",
				 "2":"portInService",
				 "3":"portOutOfService",
				 "4":"portDiagnosing",
				 "5":"portFailed" };

var mapAdministrativeState = { "1":"portNoop",
				 "2":"portInService",
				 "3":"portOutOfService",
				 "4":"portDiagnose" };

var mapForInterfaceProp = {"operationalState": mapOperationalState, 
			"administrativeState": mapAdministrativeState };

var mapSiteName = {};

var mapQueuePtr = {};

function getPortMappedPropString(objectName, propName, sp) {
	var spMap = mapForInterfaceProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
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
	} // isDef(spMap)
	
	return "undefined!";
}


// Thus ends the code used to map the status values



// This section is for access interfaces


// Then next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.


var serviceMapFunctions = { "operationalState": getServiceMappedPropString,
			    "administrativeState": getServiceMappedPropString,
			    "l3InterfaceOperationalState": getServiceMappedPropString,
			    "l3InterfaceAdministrativeState": getServiceMappedPropString };

var mapServiceOperationalState = { "0":"serviceUnknown",
				"1":"serviceUp",
				"2":"serviceDown",
				"3":"serviceIngressQosMismatch",
				"4":"serviceEgressQosMismatch",
				"5":"servicePortMtuTooSmall",
				"6":"serviceAdminDown",
				"7":"servicIesIfAdminDown",
				"8":"blocking",
				   "9":"forwarding",
				   "10":"filtering"};

var mapServiceAdministrativeState = { "0":"serviceUnknown",
				  "1":"serviceUp",
				  "2":"serviceDown" };


var mapForServiceProp = {"operationalState": mapServiceOperationalState, 
			 "administrativeState": mapServiceAdministrativeState,
			 "l3InterfaceOperationalState": mapServiceOperationalState, 
			 "l3InterfaceAdministrativeState": mapServiceAdministrativeState };

function getServiceMappedPropString(objectName, propName, sp) {
	var spMap = mapForServiceProp[propName];	
	logStatus("propName", propName);
	nilStatus("spMap", spMap);
	if (isDef(spMap)) 
	{
		return(getMappedPropString(spMap, objectName, propName, sp));
	}
	else return;
}




// Thus ends the code used to map the status values
