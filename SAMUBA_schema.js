// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


function newUBAInit() {

	//This is now important for SAP inventory creation
    read_inventory_config();
    logP3Msg("inventory_config", "SAM", "Look into inv_metric_config_array");
    dump_samObject(inv_metric_config_array);
    
    //accounting_stats_collector=app_config_value("accounting_stats_collector");
    //polled_stats_collector=app_config_value("polled_stats_collector");
    
    logP3Msg("inventory_config", "SAM", "accounting stats collector: " + accounting_stats_collector);
    logP3Msg("inventory_config", "SAM", "polled stats collector: " + polled_stats_collector);

    // For inventory creation (full dump & JMS)
    filter_table = {};
    setup_inv_soap_filters();
    setup_inv_additional_class_entries();
    logP3Msg("on function newUBAInit()", "Debug", "After setup_inv_additional_class_entries(), looking into inv_filter_table");
    inv_filter_table = filter_table;
    dump_samObject(inv_filter_table);
    
    // For JMS attribute value change
    filter_table = {};
    setup_inv_soap_filters();
    setup_inv_additional_class_entries();
    logP3Msg("on function newUBAInit()", "Debug", "After setup_inv_additional_class_entries(), looking into jmsA_filter_table");
    jmsA_filter_table = filter_table;
    dump_samObject(jmsA_filter_table);
    
    // For JMS delete
    // For JMS attribute value change
    filter_table = {};
    setup_inv_soap_filters();
    setup_inv_additional_class_entries();
    logP3Msg("on function newUBAInit()", "Debug", "After setup_inv_additional_class_entries(), looking into jmsD_filter_table");
    jmsD_filter_table = filter_table;
    dump_samObject(jmsD_filter_table);

    // For metrics
    filter_table = {};
    setup_metric_soap_filters();
    logP3Msg("on function newUBAInit()", "Debug", "After setup_inv_additional_class_entries(), looking into met_filter_table");
    met_filter_table = filter_table;
    dump_samObject(met_filter_table);

    initUbaClassHandlers();//x["M"] = array//Init object of <class_name>: <function>
    initClassObjects();
    initJmsAttributeValueChangeHandlers();
    initJmsDeleteHandlers();
	
	initialize_service_structures();


	//maybe we do not have this ???    initialize_handler_mapping();
    //initialize_service_structures();
	//return initializeDomainModel();
}

/*
 * 25 March 2013: IMPORTANT!!! Current UBA's schema that initializes as CSV
 */
function createSAMCSVUBASchema(schema_name, filePeriod, precedence, noNewInputLimit) {
	logP4Msg("createSAMUBASchema", schema_name, "Entering");
	var _pvConfiguration = PV.configuration;
	var upperCaseSchemaName = schema_name.toUpperCase();
	var _deleteOnAcquire = _pvConfiguration['ALCATEL_5620_SAM_LOG2FILE'][upperCaseSchemaName]['DELETEONACQUIRE'];
	if(_deleteOnAcquire == 'TRUE') {
		_deleteOnAcquire = true;
	} else {
		_deleteOnAcquire = false;
	} 
	logP4Msg("createSAMUBASchema", schema_name, "deleteOnAcquire: " + _deleteOnAcquire);
	    
    	var uba_schema = PV.TextInputSchema(schema_name, {
			filePeriod: parseInt(app_config_value("FILE_PERIOD")),
			deleteOnAcquire: _deleteOnAcquire,
			heartbeatOnLastTimestamp: false,
			multiFileJoin: true,
            		noNewInputLimit: 2,
			precedence: 3,

			parseURI: function(source) {
			    source.timestamp=dateFromSAMFilename(source.localName);
		    	},
			onOpen: function(source) {
				logP3Msg("onOpen", schema_name, "Opening the file" + source.localName);
				clearHandlers(); // Avoid temporaryDispatchRoutine firing incorrect handlers
		    	},
			onClose: function(source) { 
				logP3Msg("onClose", schema_name, "Closing the file" + source.localName);
		    	}
		}); // End TextInputSchema

    if (isDef(filePeriod)) 
    {
    	uba_schema.filePeriod = parseInt(app_config_value("FILE_PERIOD"));
    }
    
    if (isDef(precedence)) 
    {
    	uba_schema.precedence = precedence;
    }
    
    if (isDef(noNewInputLimit)) 
    {
    	uba_schema.noNewInputLimit = noNewInputLimit;
    }

    uba_record_schema = PV.DelimitedRecordSchema(
    	// uba_record_schema = PV.TypeDispatchSchema(
    	"recordSchema",
    	{ 
    		fieldSeparator: ",",
    		recordSeparator: "\r",
    		maxOccurs: Infinity,
    		hasHeaderRecord: false,
    		onRead: function(record) 
    		{
    			record.timestamp = PV.currentInputDescriptor.timestamp.asUTCSeconds();
    			//25 March 2013: timestamp should come together with the CSV
    			//02 April 2013: This will eventually go to record.timestamp
    			//Just do this to pass it along to the StreamQuery callback
    			this.emitTuple(record);
    		}
	  		//temporaryDispatchRoutine
    		//maybe breaks things to have this in here
    		//25 March 2013: temporaryDispatchRoutine is now used as a callback within the MAIN schema with PV.StreamQuery
    	},
    	PV.StringFieldSchema( 
    			"fields", 
    			{ 
    				minOccurs: 1, 
    				maxOccurs: 150, 
    				collect: true 
    			})
	);

    uba_schema.add(uba_record_schema);

    logP4Msg("createSAMUBASchema", schema_name, "filePeriod: " + uba_schema.filePeriod);
    logP4Msg("createSAMUBASchema", schema_name, "precedence: " + uba_schema.precedence);
    logP4Msg("createSAMUBASchema", schema_name, "noNewInputLimit: " + uba_schema.noNewInputLimit);
    logP4Msg("createSAMUBASchema", schema_name, "Exiting");

    return(uba_schema);
}

function addTypeHandler(record_id, dataType, classname, fields) 
{
    var classObject;
logP4Msg("addTypeHandler",  schema_name, "dataType: " +dataType);
logP4Msg("addTypeHandler",  schema_name, "classname: " +classname);
    classObject = get_class_entry(dataType, classname);
logP4Msg("addTypeHandler",  schema_name, "classObject: " +classObject);	
logP3Msg("addTypeHandler", "SAMUBA", "************************************");
	dump_samObject(classObject);

    if (isUndef(classObject)) 
    {
    	logP3Msg("addTypeHandler", "SAMUBA", "Can't find object for datatype: " + dataType + " and class: " + classname);
    	return;
    }

    classObject.record_id = record_id;
    classObject.fieldNames = fields;
    
    
    logStatus("record_id", record_id);
    logStatus("classname", classname);
    logStatus("classObject", classObject);
    
    

    temporaryHandlerLookup[record_id] = classObject;
	logStatus("temporaryHandlerLookup",temporaryHandlerLookup);

    //addTypeHandler(record_id, handler, fields, dataType, classname);

    logP5Msg("addTypeHandler", "SAMUBA", "Added handler for class: " + classname);
    // ??? change this to a higher debug level or remove it later
}

function zeroRecordHandler(record) 
{
    //Record has two fields: fields[0]: The recordId (always 0)  fields[1]: the record definition itself
    //var recordId = record.recordType;
    var recordId =  record.fields[0];
    var recordDef;

    //logP3Msg("zeroRecordHandler", "SAMUBA", "Entering");

    //This should always be 0
    if (isUndef(recordId) || (recordId != 0)) 
    {
	    logP3Msg("zeroRecordHandler", "SAMUBA", "recordId not zero!");
	    return;
	}
	
    /*
    logP3Msg("zeroRecordHandler", "SAMUBA", "field[0]: " + record.fields[0]);
    logP3Msg("zeroRecordHandler", "SAMUBA", "field[1]: " + record.fields[1]);
    */

    recordDef = eval('('+record.fields[1]+')');//JSON into array object

    var className = recordDef.className;	//equipment.PhysicalPort
    var recordType = recordDef["recordType"];	//<int> 1, 10, 31, ...
    var dataType = recordDef["dataType"];	//M, A, D
    var fieldNames = recordDef["fieldNames"];//""fieldNames"":[""accountingPolicyId"",""actualSpeed"",""administra

    /*
    logStatus("recordDef", recordDef);
    logStatus("recordDef type", typeof(recordDef));
    logStatus("recordType", recordType);
    logStatus("dataType", dataType);
    logStatus("fieldNames", fieldNames);
    logStatus("className", className);

    */

	if (isUndef(recordType)) 
	{
	    logP3Msg("zeroRecordHandler", "SAMUBA", "recordType not defined in record");
	    return;
	}
	
	if (isUndef(dataType)) 
	{
	    logP3Msg("zeroRecordHandler", "SAMUBA", "dataType not defined in record");
	    return;
	}
	
	if (isUndef(className)) 
	{
	    logP3Msg("zeroRecordHandler", "SAMUBA", "className not defined in record");
	    return;
	}
	
	if (isUndef(fieldNames)) 
	{
	    logP3Msg("zeroRecordHandler", "SAMUBA", "fieldNames not defined in record");
	    return;
	}
	
	addTypeHandler(recordType, dataType, className, fieldNames);
}

// This is to be used only until the UBA enhancements add the 0-record handling and record-type dispatch functioinality
function temporaryDispatchRoutine (record) 
{
	//logP3Msg("temporaryDispatchRoutine", "DEBUG", "Looking into record before parsed");
	//dump_samObject(record);
	
    var recordId = record.fields[0];

    // logP3Msg("temporaryDispatchRoutine", "SAMUBA", "record is " + record);
   
    /*
    if (isUndef(recordId)){
	    logP3Msg("temporaryDispatchRoutine", "SAMUBA", "recordId not defined!");
	    return;
	}
    */

    // logP3Msg("temporaryDispatchRoutine", "SAMUBA", "recordId is " + recordId);


    if (recordId == 0) 
    {
    	zeroRecordHandler(record);
    } 
    else 
    {
			logStatus("temporaryHandlerLookup",temporaryHandlerLookup);
			
    	logStatus("temporaryHandlerLookup[recordId]",temporaryHandlerLookup[recordId]);
    	var handlerEntry = temporaryHandlerLookup[recordId];
    	// handlerEntry is the classObject

    	/*
    	logStatus("record_id", record_id);
    	logStatus("classObject", classObject);
    	logStatus("handlerEntry", handlerEntry);
    	logStatus("temporaryHandlerLookup", temporaryHandlerLookup);
    	 */

    	if (isUndef(handlerEntry)) 
    	{
	    	logP3Msg("temporaryDispatchRoutine", "SAMUBA", "Handler not found for recordId " + recordId + "-- skipping");
	    	return;
    	}

    	/*
		logStatus("className", handlerEntry.className);
		nilStatus("handler", handlerEntry.handler);
		dump_samObject(handlerEntry);
    	 */

    	//nilStatus("handler", handlerEntry.handler);
    	//dump_samObject(handlerEntry);

    	// This should only be true for messages originating from JMS
    	// (Inventory-related only)
    	// The value in timeCaptured will be the MTOSI_osTime
    	// Apparently used due to a shortcoming in datastage processing model
    	// ALU timestamps are in milliseconds
    	/*
    	if (handlerEntry.timestampHack == true) 
    	{
    		if (record.timeCaptured != null)
    		{
    			record.timestamp = record.timeCaptured / 1000;
    		}
    	}
		*/
		logStatus("recordId", recordId);
		logP7Msg("temporaryDispatchRoutine", "SAMUBA", "HandlerEntry "+handlerEntry.className);
			logP7Msg("temporaryDispatchRoutine", "SAMUBA", "HandlerEntry "+handlerEntry.handler);
    	assignFields(record, handlerEntry.className, handlerEntry.fieldNames, handlerEntry.classObject);
	
    	//data types mapped, (object record, object moduleInterface, string handlerEntry.className, object handlerEntry)
    	if((typeof handlerEntry.handler) == "function")
    	{
    		handlerEntry.handler(record, modelInterface, handlerEntry.className, handlerEntry);
    	}
    	else
    	{
    		logP3Msg("temporaryDispatchRoutine", "SAMUBA", "NO HANDLER DEFINED!!! SKIPPING -> " + record);
    	}
    	
    	OPERATOR.emitTuple(record);
    	//logP3Msg("temporaryDispatchRoutine", "SAMUBA", "emitted record (containing inventory or metric update?)");
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

function clearHandlers() 
{
    temporaryHandlerLookup = {};
}

/*
 * 25 March 2013: Below function is no used as it was meant for F2F 
 */
/*
function createSAMUBASchema(schema_name, filePeriod, precedence, noNewInputLimit) 
{

    logP4Msg("createSAMUBASchema", schema_name, "Entering the create UBA schema function");

    var _pvConfiguration = PV.configuration;
    var upperCaseSchemaName = schema_name.toUpperCase();
    var deleteOnAcquire = _pvConfiguration['ALCATEL_5620_SAM_LOG2FILE'][upperCaseSchemaName]['DELETEONACQUIRE'];
    
    logP4Msg("createSAMUBASchema", schema_name, "Creating schema with deleteOnAcquire -> " + deleteOnAcquire);
    
    var uba_schema = PV.XMLInputSchema(
    		schema_name,
            {
    			filePeriod: 900,
    			//deleteOnAcquire: true,
    			deleteOnAcquire: deleteOnAcquire,
    			parseURI: function(source) 
    			{
    					source.timestamp=dateFromSAMFilename(source.localName);
    			},
    			precedence: 3,
    			ignoreProcessingErrors: true
    		}
		);  // XmlInputSchema

    if (isDef(filePeriod)) 
    {
    	uba_schema.filePeriod = filePeriod;
    }
    
    if (isDef(precedence)) 
    {
    	uba_schema.precedence = precedence;
    }
    
    if (isDef(noNewInputLimit)) 
    {
    	uba_schema.noNewInputLimit = noNewInputLimit;
    }

    logP4Msg("createSAMUBASchema", schema_name, "File period: " + uba_schema.filePeriod);
    logP4Msg("createSAMUBASchema", schema_name, "Precedence: " + uba_schema.precedence);
    logP4Msg("createSAMUBASchema", schema_name, "No New Input Limit: " + uba_schema.noNewInputLimit);

    logP4Msg("createSAMUBASchema", schema_name, "Exiting the create UBA schema function");

    return(uba_schema);
}
*/

/*
 * 25 March 2013: Below function is no used as it was meant for F2F 
 */
/*
function addSAMUBARecordSchema(uba_schema, record_name, xml_record_name, metrics, additional_metrics) 
{
    logP4Msg("addSAMUBARecordSchema", xml_record_name, "Entering the add UBA record function");

    var i;
    var fields = new Array();
    var record_schema = PV.XMLRecordSchema( 
    		record_name, 
    		{ 
    			xpath:XPathExp(xml_record_name),
				onRead: function(rec) 
				{ 
					rec.timestamp=this.inputSchema.currentObject.timestamp.asUTCSeconds();
					logP3Msg("timestamp processing", "SAMUBA", "About to emit");
					this.emitTuple(rec); 
	            },
				maxOccurs: Infinity 
	         }  
    	);

    if (isDef(metrics)) 
    {
    	fields=fields.concat(metrics);
	}

    if (isDef(additional_metrics)) 
    {
    	fields=fields.concat(additional_metrics);
    }


    for (i in fields) 
    {
    	logP4Msg("addSAMUBARecordSchema", xml_record_name, "Record name: " +record_name+ " i: " +fields[i]);
    	record_schema.add(PV.StringFieldSchema(fields[i], {xpath: XPathExp(fields[i])}));
    }

    //addAttributeFieldSchemas(record_schema);

    uba_schema.add(record_schema);

    logP4Msg("addSAMUBARecordSchema", xml_record_name, "Exiting the add UBA record function");

    return(uba_schema);
}
*/
