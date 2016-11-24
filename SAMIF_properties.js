// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var standardAdditionalInventoryFields = [ "networkQueueObjectPointer",
					  "networkQueuePolicyName",
					  "mode",
					  "portIdentifyingName",
					  "networkQueuePolicyCapable"
					  ];
					  

var equipment_physical_port_Name =
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

