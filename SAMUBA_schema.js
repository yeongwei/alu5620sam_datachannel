// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// The prefix new is to indicate that it is meant for L2F UBAs
function newUBAInit() {
	var _functionName = "newUBAInit";
	var _componentName = "SAMUBA";
	var _log = "";

	// This is now important for SAP inventory creation
    	read_inventory_config();
	
	_log += "Performance Collector: " + polled_stats_collector + " ";
	_log += "Accounting Collector: " + accounting_stats_collector + " ";   	 
	logP3Msg(_functionName, _componentName, _log);

	// For fullDump	
    	filter_table = {};
    	setup_inv_soap_filters();
    	setup_inv_additional_class_entries();
    	inv_filter_table = filter_table;
    
    	// For JMS attribute value change
    	filter_table = {};
    	setup_inv_soap_filters();
    	setup_inv_additional_class_entries();
    	jmsA_filter_table = filter_table;
    
    	// For JMS object deletion
    	filter_table = {};
    	setup_inv_soap_filters();
    	setup_inv_additional_class_entries();
    	jmsD_filter_table = filter_table;

    	// For metrics processing
    	filter_table = {};
    	setup_metric_soap_filters();
    	met_filter_table = filter_table;

    	initUbaClassHandlers(); // x["M"] = array
    	initClassObjects();
    	initJmsAttributeValueChangeHandlers();
    	initJmsDeleteHandlers();
	
	initialize_service_structures();
}

/*
 * 25 March 2013: IMPORTANT!!! Current UBA's schema that initializes as CSV
 */
function createSAMCSVUBASchema(schema_name, filePeriod, precedence, noNewInputLimit) {
	var _log = "";
	
	var _pvConfiguration = PV.configuration;
	var _upperCaseSchemaName = schema_name.toUpperCase();
	var _deleteOnAcquire = _pvConfiguration["ALCATEL_5620_SAM_LOG2FILE"][_upperCaseSchemaName]["DELETEONACQUIRE"];
	if (_deleteOnAcquire == 'TRUE') {
		_deleteOnAcquire = true;
	} else {
		_deleteOnAcquire = false;
	} 
	_log += "schema_name: " + schema_name + " ";
	_log += "_deleteOnAcquire: " + _deleteOnAcquire + " ";

    	var uba_schema = PV.TextInputSchema(schema_name, {
		filePeriod: parseInt(app_config_value("FILE_PERIOD")),
		deleteOnAcquire: _deleteOnAcquire,
		heartbeatOnLastTimestamp: false,
		multiFileJoin: true,
            	noNewInputLimit: 2,
		precedence: 3,
		parseURI: function (source) {
		    	source.timestamp=dateFromSAMFilename(source.localName);
		},
		onOpen: function (source) {
			logP3Msg("onOpen", schema_name, "Opening the file" + source.localName);
			clearHandlers(); // Avoid temporaryDispatchRoutine firing incorrect handlers
		},
		onClose: function(source) { 
			logP3Msg("onClose", schema_name, "Closing the file" + source.localName);
		}
	}); // End TextInputSchema

    	if (isDef(filePeriod)) { 
    		uba_schema.filePeriod = parseInt(app_config_value("FILE_PERIOD"));
		_log += "filePeriod: " + filePeriod + " ";
    	}
    
	if (isDef(precedence)) {
    		uba_schema.precedence = precedence;
		_log += "precedence: " + precedence + " ";
    	}
    
    	if (isDef(noNewInputLimit)) {
    		uba_schema.noNewInputLimit = noNewInputLimit;
		_log += "noNewInputLimit: " + noNewInputLimit + " ";
    	}

	var uba_record_schema = PV.DelimitedRecordSchema("recordSchema", {
    		fieldSeparator: ",",
    		recordSeparator: "\r",
    		maxOccurs: Infinity,
    		hasHeaderRecord: false,
    		onRead: function (record) {
    			record.timestamp = PV.currentInputDescriptor.timestamp.asUTCSeconds();
    			// 25 March 2013: timestamp should come together with the CSV
    			// 02 April 2013: This will eventually go to record.timestamp
    			this.emitTuple(record);
    		}
	}, PV.StringFieldSchema("fields", {
    				minOccurs: 1, 
    				maxOccurs: 150, 
    				collect: true 
	}));

    	uba_schema.add(uba_record_schema);

    	logP4Msg("createSAMUBASchema", schema_name, _log);

	return(uba_schema);
}

// Prepare recordId and associated handler object
function addTypeHandler(record_id, dataType, classname, fields) { 
	var _log = "";
	_log += "record_id: " + record_id + " ";
	_log += "dateType: " + dataType + " ";
	_log += "classname: " + classname + " ";
    	
	var classObject = get_class_entry(dataType, classname);

    	if (isUndef(classObject)) {
		_log += "classObject: undefined";
    	} else {
		_log += "classObject: defined";
    		classObject.record_id = record_id;
    		classObject.fieldNames = fields;

		temporaryHandlerLookup[record_id] = classObject;
		_log += "temporaryHandlerLookup: true";
	}
	logP3Msg("addTypeHandler", "SAMUBA", _log);
}

function zeroRecordHandler(record) { 
    	// Record has two fields: fields[0]: The recordId (always 0)  fields[1]: the record definition itself
    	// var recordId = record.recordType;
    	var recordId =  record.fields[0];

    	// This should always be 0
    	if (isUndef(recordId) || (recordId != 0)) {
	    	logP3Msg("zeroRecordHandler", "SAMUBA", "recordId not zero!");
	    	return;
	}
	
    	var recordDef = eval('('+record.fields[1]+')'); // JSON into array object

    	var className = recordDef.className;		// equipment.PhysicalPort
    	var recordType = recordDef["recordType"];	// <int> 1, 10, 31, ...
    	var dataType = recordDef["dataType"];		// M, A, D
    	var fieldNames = recordDef["fieldNames"];	// ""fieldNames"":[""accountingPolicyId"",""actualSpeed"",""administra

	if (isUndef(recordType)) {
	    logP3Msg("zeroRecordHandler", "SAMUBA", "recordType not defined in record");
	    return;
	}
	
	if (isUndef(dataType)) { 
	    logP3Msg("zeroRecordHandler", "SAMUBA", "dataType not defined in record");
	    return;
	}
	
	if (isUndef(className)) {
	    logP3Msg("zeroRecordHandler", "SAMUBA", "className not defined in record");
	    return;
	}
	
	if (isUndef(fieldNames)) {
	    logP3Msg("zeroRecordHandler", "SAMUBA", "fieldNames not defined in record");
	    return;
	}
	
	addTypeHandler(recordType, dataType, className, fieldNames);
}

function temporaryDispatchRoutine(record) {
    var recordId = record.fields[0];

    if (recordId == 0) {
    	zeroRecordHandler(record);
    } else { 
    	var handlerEntry = temporaryHandlerLookup[recordId]; // Returns classObject from get_class_entry

    	if (isUndef(handlerEntry)) {
	    	logP3Msg("temporaryDispatchRoutine", "SAMUBA", "Handler not found for recordId " + recordId + "-- skipping");
	    	return;
    	}

    	assignFields(record, handlerEntry.className, handlerEntry.fieldNames, handlerEntry.classObject);
	
    	if((typeof handlerEntry.handler) == "function") {
    		handlerEntry.handler(record, modelInterface, handlerEntry.className, handlerEntry);
    	} else {
    		logP3Msg("temporaryDispatchRoutine", "SAMUBA", "NO HANDLER DEFINED!!! SKIPPING -> " + record);
    	}
    	
    	OPERATOR.emitTuple(record);
    }
}

/*
 * 28 March 2013: Assign class name as property / attribute into the record object for timestamp parameter evaluation
 */
function assignFields(record, classname, fieldNames, classObject) {
    var logMsg = "classname: " + classname + " record: " + record + " ";

    for(var i = 0; i < fieldNames.length; i++) { 
    	var value = record.fields[i+1]; //The field 0 is the record identifier(Zero Record), so i+1
    	if (value != "") { // 25 March 2013: Drop fields with no values aka ""
    		record[fieldNames[i]] = value;
    	}
    }

    record["className"] = classname;
    
    if(isDef(record.mtosiTime) == true) { // if mtosiTime exist then records are inventory
	record.timestamp = ParseTimestamp(record.mtosiTime);
   	logMsg += "inventory: true";
    }
    
    logP4Msg("assignFields", "SAMUBA_schema", "Assigned fields: " + logMsg); 
    
}

function clearHandlers() {
    temporaryHandlerLookup = {};
}
