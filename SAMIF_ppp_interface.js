// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

logP4Msg("ppp_interface", "SAMIF", "entered ppp_interface script" );

var reverse_ppp_interface_Name = {},
ppp_interface_Name = {
    "samObjectFullName":"objectFullName",		// used explicitly; need to track change?
    "samShelfId":"shelfId",
    "samPortId":"portId",
    "samNodeId":"nodeId",
    "samPortName":"portName",
    "samNodeName":"nodeName"
};

// PPP hashmap and object template
// The hashmap will contain PPP objects
var mapPppInterfaceObjects = {};

//PPP objectFullName : PPP subelement object (PvSubelement)
var mapPppObjectFullNameToPvSubelement = {};

function pppInterface()
{
    this.pppInterfaceNodeName = "";
    this.pppInterfaceNodeId = "";
    this.pppControlProtocolFullNameHashMap = {};
    
    this.setNodeName = setNodeName;
    this.getNodeName = getNodeName;
    this.setNodeId = setNodeId;
    this.getNodeId = getNodeId;
    this.addControlProtocolFullName = addControlProtocolFullName;
    this.deleteControlProtocolFullName = deleteControlProtocolFullName;
}

function setNodeName(name)
{
    this.pppInterfaceNodeName = name;
}

function getNodeName()
{
    return this.pppInterfaceNodeName;
}

function setNodeId(id)
{
    this.pppInterfaceNodeId = id;
}
function getNodeId()
{
    return this.pppInterfaceNodeId;
}

function addControlProtocolFullName(name, objectFullName)
{
    this.pppControlProtocolFullNameHashMap[name] = objectFullName;
}

function deleteControlProtocolFullName(name)
{
    delete this.pppControlProtocolFullNameHashMap[name];
}

for( var i in ppp_interface_Name)
{
	MasterPropertyMap[ppp_interface_Name[i]] = i;
	ReverseMasterPropertyMap[ppp_interface_Name[i]] = i;
	reverse_ppp_interface_Name[ppp_interface_Name[i]] = i;
}

function ppp_interface(samObject, modelInterface)
{
    logP4Msg("ppp_interface", "SAMIF", "entered ppp_interface function" );

    var element;
    var subelement;

    element = OPERATOR.elementNamedOrNew(samObject.nodeId);
    element.state = true;
    element.name = samObject.nodeId;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

    // Used by PPP Control Protocol
    logP4Msg("ppp_interface", "SAMIF", "****** PORT ID is " +  samObject.portId);
    if (! isDef(mapPppInterfaceObjects[samObject.portId]) ) 
    {
    	mapPppInterfaceObjects[samObject.portId] = new pppInterface();
    }
    
    mapPppInterfaceObjects[samObject.portId].setNodeId(samObject.nodeId);
    logP4Msg("ppp_interface", "SAMIF", "****** PPP OBJECT NODE ID is " +  mapPppInterfaceObjects[samObject.portId].getNodeId());
    mapPppInterfaceObjects[samObject.portId].setNodeName(samObject.nodeName);
    logP4Msg("ppp_interface", "SAMIF", "****** PPP OBJECT NODE NAME is " + mapPppInterfaceObjects[samObject.portId].getNodeName());

    var simplePortName = samObject.nodeId + "_" + samObject.portName;
    logP4Msg("ppp_interface", "SAMIF", "****** SIMPLE PORT NAME is " +  simplePortName);

    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_PPP_Interface";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = "If<" + samObject.objectFullName +">";
	//subelement.timestamp = samObject.timestamp;
    subelement.label = simplePortName;

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_PPP_Interface");

    for( var i in ppp_interface_Name) 
    {
        if ( samObject[ ppp_interface_Name[i] ] != undefined )
        {
        	logP4Msg("ppp_interface", "SAMIF", "****** PROPERTY is " + ppp_interface_Name[i]);
        	subelement.addProperty( i.toString(), samObject[ ppp_interface_Name[i] ].toString() );
	    }    
    }

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);
    mapPppObjectFullNameToPvSubelement[subelement.name] = subelement;
    
    logP4Msg("ppp_interface", "SAMIF", "exited ppp_interface function" );
}

// Once all of the PPP interfaces and control protocol subelements are
// create (after full dump complete), then there is no need to keep the
// objects. This function deletes those objects.
function ppp_interface_object_cleanup()
{
    logP4Msg("ppp_interface_object_cleanup", "SAMIF", "Cleaning up of PPP objects in memory - start");
    for(var i in mapPppInterfaceObjects) 
    {
    	logP4Msg("ppp_interface_object_cleanup", "SAMIF", "Deleting object index " + i.toString());
    	delete mapPppInterfaceObjects[i];
    }
    logP4Msg("ppp_interface_object_cleanup", "SAMIF", "Cleaning upof  PPP objects in memory - end");
}
