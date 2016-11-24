// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_equipment_channel_Name = {},
equipment_channel_Name = {
    "samObjectFullName":"objectFullName",		// used explicitly; need to track change?
    "samAdministrativeState":"administrativeState",
    "samCardSlotId":"cardSlotId",			// used explicitly; need to track change?
    "samDaughterCardSlotId":"daughterCardSlotId",	// used explicitly; need to track change?
    "samDescription":"description",			// describes type of interface
    "samMacAddress":"macAddress",
    "samPortName":"portName",
    "samPortId":"portId", 				// used explicitly; need to track change?
    "samActualSpeed":"actualSpeed",
    "samOperationalState":"operationalState",
    "samShelfId":"shelfId",				// used explicitly; need to track change?
    "samSiteId":"siteId",				// used explicitly; need to track change?
    "samSiteName":"siteName",
    "samLagMembershipId":"lagMembershipId",
    "samPortChannelType":"portChannelType",
    "samSpecificType":"specificType",
    "samEncapType":"encapType"
};

var unnamedChannelStorage = {};

for( var i in equipment_channel_Name)
{
	MasterPropertyMap[equipment_channel_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_channel_Name[i]] = i;
	reverse_equipment_channel_Name[equipment_channel_Name[i]] = i;
}

var ppp_supported_encaptypes={"pppAutoEncap":"true", "bcpNullEncap":"true", "bcpDot1qEncap":"true", "ipcpEncap":"true"};

function process_equipment_channel(samObject, modelInterface)
{
    logP4Msg("equipment_channel", "SAMIF", "entered equipment_channel" );

    // Only create PPP subelements
    if (! isDef(ppp_supported_encaptypes[samObject.encapType]) ) 
    {
    	return;
    }

    if (samObject.portName == "N/A") 
    {
    	store_channel_record(samObject);
    	logP4Msg("equipment_channel", "SAMIF", "Storing channel because it has no portName:" + samObject.objectFullName);
    	return;
    }

    var element;
    var subelement;

    //element = modelInterface.Element();
    element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.state = true;
    element.name = samObject.siteId.toString();
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;

    //subelement = modelInterface.Subelement();
    var simplePortName = samObject.siteId.toString() + "_" + samObject.shelfId.toString() + "/" + samObject.portName;
    subelement = OPERATOR.subelementNamedOrNew(simplePortName);
    subelement.name = simplePortName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_Channel";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
    //subelement.timestamp = samObject.timestamp;
    
    if (isConfig("inv_uses_names")) 
    {
    	subelement.label = samObject.siteName + " " + simplePortName;
    }
    else 
    {
    	subelement.label = simplePortName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("samSpeed", getSpeedString(samObject.speed));

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_Channel");

    for( var i in equipment_channel_Name) 
    {
    	if ( samObject[ equipment_channel_Name[i] ] != undefined )
        {
    		subelement.addProperty( i.toString(), samObject[ equipment_channel_Name[i] ].toString() );
        }    
    }

    //subelement.timestamp = modelInterface.currentDate;
    subelement.element = element; 	
    //element.addSubelement(subelement);
   //possible_inline_commit(modelInterface);
} 

//03 April 2013: Used in SAM_soap_filter.js
function get_ppp_soap_filter(filterEntry) 
{
    var filter=get_soap_filter(filterEntry);
    var ppp;

    if (isUndef(filter)) 
    {
    	return;
    } 
    else 
    {
    	ppp=soap_filter_unary("equal", "encapType", "pppAutoEncap");
    	return(soap_filter_and(ppp, filter));
    }
}

//03 April 2013: Used within equipment channel
function store_channel_record(record) 
{
	unnamedChannelStorage[record.objectFullName] = record;
}

//03 April 2013: Used within equipment channel
function get_channel_record(objectFullName) 
{
	return(unnamedChannelStorage[objectFullName]);
}

//03 April 2013: Used within equipment channel
function clear_channel_record(objectFullName) 
{
	delete unnamedChannelStorage[objectFullName];
}

//03 April 2013: Used within equipment channel
function ppp_channel_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray) 
{
    var /*i, record,*/ propName, portName = undefined;
    var record=get_channel_record(objectName);

    // need to check the filter here?  Actually the create call already did that.

    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "entered with: " +objectName);

    // The record should only be stored for the initial create; an AttributeValueChange message comes <1 second later
    // with the value for the portName so the record should only be stored once, and very briefly.
    if (isDef(record)) {
	logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "found record");
	for (var i in propColl) {
	    propName=propColl[i].attributeName;
	    if (propName=="portName") {
		portName=propColl[i].newvalue;
		logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "found portName");
		break;
	    }
	}

	logStatus("portName", portName);
	if (isDef(portName)) {
	    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "before portname set");
	    record["portName"]=portName;
	    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "before process record");
	    process_equipment_channel(record, modelInterface);//AS per fulldump
	    //definite_commit(modelInterface);
	    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "before channel entry clear");
	    clear_channel_record(objectName);//Delete array element only
	    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "processed record");
	}
	
    } // record
    
	// Added property "encapType" to enable simple property change for channel family resource
	propArray["encapType"] = "samEncapType";
	
    jms_simple_propChange_with_mapping(className, objectName, propColl, propArray, mapArray);
    logP4Msg("ppp_channel_simple_propChange_with_mapping", "SAMIF", "updated properties");
}
