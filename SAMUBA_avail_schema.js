// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack
/*
function createAvailInputSchema(nameSpace) {
    var schema = PV.XMLInputSchema(
        nameSpace.name,
        {
            filePeriod: app_config_value('FILE_PERIOD')
        },
        PV.XMLRecordSchema(
            "create",
            {xpath: XPathExp("Envelope"), maxOccurs: Infinity},
            PV.StringFieldSchema("timestamp", {xpath: XPathExp("Header/header/MTOSI_osTime"), constructor: function(string) { return Math.floor(parseInt(string) / 1000);}}),
            PV.StringFieldSchema("eventName", {xpath: XPathExp("Header/header/eventName")}),
            PV.StringFieldSchema("name", {xpath: XPathExp("Body/jms/attributeValueChangeEvent/objectFullName")}),
		PV.XMLRecordSchema(
                "attributes",
                {xpath: XPathExp("Body/jms/attributeValueChangeEvent/attribute"), collect: true, maxOccurs: Infinity},
                PV.StringFieldSchema("key", {xpath: XPathExp("attributeName")}),
                PV.StringFieldSchema("value", {xpath: XPathExp("newValue")})
            )
        )
    );

    var dateMatcher = /^samjms-(\d+-\d+-\d+-\d+\.\d+)\.xml$/;
    schema.parseURI = function (descriptor) 
    {
        var name=descriptor.remoteName;
        var match=dateMatcher.exec(name);
        var rawTime=match == null ? null : match[1];
        if (rawTime == null) {
            descriptor.ignore=true;
            return;
        }
        descriptor.timestamp=new Date(rawTime);
    };

    schema.schemas[0].onRead=function(record)
    {
        if ("AttributeValueChange" != record.eventName) return;
        var stateValue = null;
        record.attributes.iterate(function(each) {
            if (each.key == "administrativeState" || each.key == "l3AdministrativeState") {
                var adminValue = nameSpace.convertAdminState(each.value);
                if (nameSpace.isOff(adminValue) || stateValue == null || stateValue == "undefined") {
                     stateValue = adminValue;
                }
            }
            if (!nameSpace.isOff(stateValue) && (each.key == "operationalState" || each.key == "l3InterfaceOperationalState" || each.key == "underlyingResourceState")) {
                stateValue = nameSpace.convertOperationalState(each.value);
            }
        });
        if (stateValue == null) return;
        record.operationalState = stateValue;
        
        delete record.attributes;
        this.emitTuple(record);
    };
    return schema;
}

// This is used as the handler function for the avaialbility in the case where it is
// used as a handler with the logToFile input
function old_availabilityInputHandler(record, nameSpace) {

	logP4Msg("Availability", "SAMUBA", "Availability_Read_Enter");
	logP4Msg("Availability", "SAMUBA", "Availability_Attribute_Name" + record.attributeName);
	dump_samObject(record);
	dump_samObject(nameSpace);
    var stateValue = null;
    //record.attributes.iterate(function(each) {
	record.iterate(function(each) {
            if (each.key == "administrativeState" || each.key == "l3AdministrativeState") {
                var adminValue = nameSpace.convertAdminState(each.value);
                if (nameSpace.isOff(adminValue) || stateValue == null || stateValue == "undefined") {
		    stateValue = adminValue;
                }
            }
            if (!nameSpace.isOff(stateValue) && (each.key == "operationalState" || each.key == "l3InterfaceOperationalState" || each.key == "underlyingResourceState")) {
                stateValue = nameSpace.convertOperationalState(each.value);
				logP4Msg("Availability", "SAMUBA", "Availability_Read_Enter"+stateValue);
            }
        });
		
		
    if (stateValue == null) return;
    record.operationalState = stateValue;
    
    delete record.attributes;
    this.emitTuple(record);
}
*/
// This is used as the handler function for the avaialbility in the case where it is
// used as a handler with the logToFile input
function availabilityInputHandler(record, nameSpace) 
{
   	logP4Msg("Availability", "SAMUBA", "Availability appropriate record");

   	var stateValue = null;
   	var key = record.attributeName;
   	var value = record.newValue;

   	//one attribute value change per record
   	//2013 June 13: Attribute administrativeState is now IGNORED
   	/*
    if (key == "administrativeState" || key == "l3AdministrativeState") 
    {
       	var adminValue = nameSpace.convertAdminState(value);
        if (nameSpace.isOff(adminValue) || stateValue == null || stateValue == "undefined") 
        {
        	stateValue = adminValue;
        }
    }
	*/
    if (!nameSpace.isOff(stateValue) && (key == "operationalState" || key == "l3InterfaceOperationalState" || key == "underlyingResourceState")) 
    {
    	stateValue = nameSpace.convertOperationalState(value);
		logP4Msg("Availability", "SAMUBA", "Availability_Read_Enter "+stateValue);
    }
        
    if (stateValue == null)//Other not useful attributes will satisfy this
    {
    	return;
    }

    record.operationalState = stateValue;//Valid value string or "undefined!"
    
    //delete record.attributes;//name is used later on; changed here for compatibility purposes, as XPATH assign it as "name"
    record.name = record.objectFullName;

    //Add each to iterators for calculateFunction later
    var _aggregators = OPERATOR.aggregators;
    for(i in _aggregators)
    {
        _aggregators[i].add(record);
    }
    
    return(record);
}
/*
function accountingAvailabilityHandler(record) 
{
    var nameSpace = AVAIL_NAME_SPACES["PHYSICAL_PORT"];

    if (availabilityInputHandler(record, nameSpace) != null) 
    {
    	OPERATOR2.emitTuple(record);
    }
}

function performanceAvailabilityHandler(record) 
{
    var nameSpace = AVAIL_NAME_SPACES["ACCESS_INTERFACE"];

    if (availabilityInputHandler(record, nameSpace) != null) 
    {
    	OPERATOR2.emitTuple(record);//This goes to where??? Not that important
    }
}
*/