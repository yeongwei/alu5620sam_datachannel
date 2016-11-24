// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

logP4Msg("ppp_control_protocol", "SAMIF", "entered ppp_control_protocol script" );

var reverse_ppp_control_protocol_Name = {},
ppp_control_protocol_Name = {
    "samObjectFullName":"objectFullName",		// used explicitly; need to track change?
    "samShelfId":"shelfId",				// used explicitly; need to track change?
    "samState":"state",
    "samSnmpPortId":"snmpPortId",
    "samControlProtocolType":"controlProtocolType",
    "samLastClearedTime":"lastClearedTime",
    "samRestartCount":"restartCount",
    "samDeploymentState":"deploymentState",
    "samName":"name"
};

//PPP Control Protocol objectFullName : PPP Control Protocol PvSubelement
var mapPPPConProObjectFullNameToPvSubelement = {};

for( var i in ppp_control_protocol_Name)
{
	MasterPropertyMap[ppp_control_protocol_Name[i]] = i;
	ReverseMasterPropertyMap[ppp_control_protocol_Name[i]] = i;
	reverse_ppp_control_protocol_Name[ppp_control_protocol_Name[i]] = i;
}

function ppp_control_protocol(samObject, modelInterface)
{
    logP4Msg("ppp_control_protocol", "SAMIF", "entered ppp_control_protocol function" );

    var element;
    var subelement;
    var nodeId;

    if (!isDef(mapPppInterfaceObjects[samObject.snmpPortId]) ) 
    {
    	logP4Msg("ppp_control_protocol", "SAMIF", "No object found in mapPppInterfaceObjects with snmpPortId " + samObject.snmpPortId);
    	nodeId = 0;
    }
    else 
    {
    	nodeId = mapPppInterfaceObjects[samObject.snmpPortId].getNodeId();
    }

    logP4Msg("ppp_control_protocol", "SAMIF", "****** NODE ID is " + nodeId);
    if ( nodeId == 0 || ! isDef(nodeId) )
    {
    	logP4Msg("ppp_control_protocol", "SAMIF", "Invalid Node Id for subelement object :- " + samObject.objectFullName);
    }
    else 
    {
    	//element = modelInterface.Element();
    	element = OPERATOR.elementNamedOrNew(nodeId);
		element.state = true;
		element.name = nodeId;
		element.origin = "SAM";
		element.collectorNumber = polled_stats_collector;

		//subelement = modelInterface.Subelement();
		logP4Msg("ppp_control_protocol", "SAMIF", "****** OBJECT FULL NAME is " + samObject.objectFullName);

		var simplePortName = nodeId + "_" + samObject.shelfId.toString() + "/" + samObject.name + "/" + "PID-" + samObject.snmpPortId;
		logP4Msg("ppp_control_protocol", "SAMIF", "****** SIMPLE PORT NAME is " +  simplePortName);
	
		//API missing earlier!!!
		subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
		subelement.name = samObject.objectFullName;
		subelement.state = true;
		subelement.origin = "SAM";
		subelement.family = "5620_SAM_PPP_Protocol";
		subelement.invariant = samObject.objectFullName;
		subelement.instance = "If<" + samObject.objectFullName +">";
		subelement.label = samObject.objectFullName;
		//subelement.timestamp = samObject.timestamp;
	
		var nodeName = mapPppInterfaceObjects[samObject.snmpPortId].getNodeName();
		logP4Msg("ppp_control_protocol", "SAMIF", "****** NODE NAME is " + nodeName);

		mapPppInterfaceObjects[samObject.snmpPortId].addControlProtocolFullName(samObject.name, samObject.objectFullName);

		subelement.addProperty("nmVendor", "Alcatel5620SAM");
		subelement.addProperty("samNodeId", nodeId);
		subelement.addProperty("samNodeName", nodeName);

		//This property added for TCR enablement, it will be use for Cognos resource grouping
    	subelement.addProperty("samFamilyName", "5620_SAM_PPP_Protocol");

    	for( var i in ppp_control_protocol_Name) 
	    {
    		if ( samObject[ ppp_control_protocol_Name[i] ] != undefined )
		    {
    			logP4Msg("ppp_control_protocol", "SAMIF", "****** PROPERTY is " + ppp_control_protocol_Name[i] + "=" + samObject[ ppp_control_protocol_Name[i] ]);
    			subelement.addProperty( i.toString(), samObject[ ppp_control_protocol_Name[i] ].toString() );
		    }    
	    }

		//subelement.timestamp = modelInterface.currentDate;
		subelement.element = element; 
		//element.addSubelement(subelement);
		//possible_inline_commit(modelInterface);
		//network:138.120.242.60:ppp:interface-3/2/1.sts48_1:cp-Link
		var _pppInterfaceObjectFullName = (subelement.name).split(":");
		_pppInterfaceObjectFullName = _pppInterfaceObjectFullName[0] + ":" + _pppInterfaceObjectFullName[1] + ":" + _pppInterfaceObjectFullName[2] + ":" + _pppInterfaceObjectFullName[3];
		logP4Msg("ppp_control_protocol", "SAMIF", "Parsed _pppInterfaceObjectFullName -> " + _pppInterfaceObjectFullName);
		if(isDef(mapPPPConProObjectFullNameToPvSubelement[_pppInterfaceObjectFullName]) == true)
		{
			mapPPPConProObjectFullNameToPvSubelement[_pppInterfaceObjectFullName].push(subelement);
		}
		else
		{
			mapPPPConProObjectFullNameToPvSubelement[_pppInterfaceObjectFullName] = new Array();	
			mapPPPConProObjectFullNameToPvSubelement[_pppInterfaceObjectFullName].push(subelement);
		}
    }

    logP4Msg("ppp_control_protocol", "SAMIF", "exited ppp_control_protocol function" );
}

function ppp_control_protocol_propChange_with_mapping(objectName, propColl) 
{
    //var myId = 0;
    //var snmpPortId = 0;
   // var portId = 0;
    var pppControlProtocolFullName;
   // var pppControlProtocolObject;

    logP5Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "entered");

    // When a new ppp interface is created the portId is set to 0. Unfortunately, the 
    // control protocol for the ppp interface also has a snmpPortId of 0. For the ppp
    // interface, a attribute change event is sent immediately following the object creation
    // event. This attribute change event changes the portId of the ppp interface, BUT
    // does NOT update the control protocol snmpPortId(s) associated with the interface. The 
    // mapPppInterfaceObjects is indexed by the portId.

    //if ( isDef(mapPppInterfaceObjects[0]) )
    //{
    	// Create a new index with the correct ppp interface portId. The port Id was updated
    	// during the ppp interface update
    	var portId = get_updated_ppp_interface_snmp_port_id(objectName, propColl);
    	logP5Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "****** PPP INTERFACE PORT ID " + portId);
    	if(isUndef(mapPppInterfaceObjects[portId]) == true)
    	{
    		mapPppInterfaceObjects[portId] = new pppInterface();
    	}
    	//mapPppInterfaceObjects[portId].setNodeId(modelInterface.nodeId);
    	//mapPppInterfaceObjects[portId].setNodeName(modelInterface.nodeName);
    	mapPppInterfaceObjects[portId].setNodeId(propColl.nodeId);
    	mapPppInterfaceObjects[portId].setNodeName(propColl.nodeName);
    	
    	//Get the ObjectFullName of each ppp control protocol and add to the new index of 
    	//mapPppInterfaceObjects.
    	for (var name in mapPppInterfaceObjects[0].pppControlProtocolFullNameHashMap)
    	{
    		pppControlProtocolFullName = mapPppInterfaceObjects[0].pppControlProtocolFullNameHashMap[name];
	    	mapPppInterfaceObjects[portId].addControlProtocolFullName(name, pppControlProtocolFullName);
	    
	    	// Setting the pppControlProtocolObject
	    	//myId = modelInterface.idForName(pppControlProtocolFullName);
	    	var subelement = OPERATOR.elementNamed(pppControlProtocolFullName);
	    	logP5Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "object: " + pppControlProtocolFullName);	
	    	logP5Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "subelement = " + subelement);

	    	//if(myId != 0)
	    	//if(isUndef(subelement) == true)
	    	if(isDef(subelement) == true)
	    	{ 	
	    		//pppControlProtocolObject = modelInterface.Subelement();
	    		//pppControlProtocolObject.id = myId;
	
	    		//pppControlProtocolObject.addProperty("samSnmpPortId", portId);
	    		subelement.addProperty("samSnmpPortId", portId);
	    		//pppControlProtocolObject.commit();

	    		//definite_commit(modelInterface);
	    		logP4Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "PPP map updated (ppp interface snmpPortId updated): " + portId);
	    	}
	    	else {
	    		//couldn't find object in idmap	
	    		logP4Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF",  "Could not find Object!!!: " + pppControlProtocolFullName );
	    	}
	    
    	}
    	
    	//delete mapPppInterfaceObjects[0];
		//delete mapPppInterfaceObjects[portId];
	
		logP4Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "updated properties complete");
	
    //}
    //else 
    //{
    	//logP4Msg("ppp_control_protocol_propChange_with_mapping", "SAMIF", "PPP interface with portId of 0 not found in map - skipping");
    //}
}

//02 Apric 2013: Getting the portId from JMS update data
function get_updated_ppp_interface_snmp_port_id(objectName, propColl)
{
    //var pppInterfaceObject;
    var snmpPortId = 0;
    var propName;

    //Setting the pppInterfaceObject
    //var subelement = OPERATOR.subelementNamed(samObject.objectFullName);
    var subelement = OPERATOR.subelementNamed(objectName);
    //myId = modelInterface.idForName(objectName);
    //var myId = subelement.id;
    
    //if ( myId == 0 )
    //if(isUndef(subelement.id) == true)
    if(isUndef(subelement) == true)
    {
    	//couldn't find object in idmap	
    	logP4Msg("get_updated_ppp_interface_snmp_port_id", "SAMIF",  "Could not find Object!!!: " + objectName );
    	return 0;
    }
    else 
    {
    	//pppInterfaceObject = modelInterface.Subelement();
    	//pppInterfaceObject = subelement;
    	//pppInterfaceObject.id = myId;
	
    	logP4Msg("get_updated_ppp_interface_snmp_port_id", "SAMIF", "LOOKING FOR snmpPortId with objectFullName -> " + objectName);

    	for (var i in propColl)
    	{
    		propName = propColl[i].attributeName;
    		logP4Msg("get_updated_ppp_interface_snmp_port_id", "SAMIF", "****** PropName " + propName);

    		if (propName == "snmpPortId" )
    		{
    			snmpPortId = propColl[i].newvalue;
    			logP4Msg("get_updated_ppp_interface_snmp_port_id", "SAMIF", "found snmpPortId " + snmpPortId);
    			break;
    		}
    	}

    	return snmpPortId;
    }
}
