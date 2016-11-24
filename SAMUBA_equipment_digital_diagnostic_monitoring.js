// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// var schema_digital_diagnostic_monitoring = createSAMUBASchema("SAM_equipment_ddm", 900, 3);
// schema_digital_diagnostic_monitoring     = addSAMUBARecordSchema
// (
    // schema_digital_diagnostic_monitoring,
    // "DigitalDiagnosticMonitoring",
    // "equipment.DigitalDiagnosticMonitoring",
    // equipment_digital_diagnostic_monitoring_metrics,
    // standardAdditionalPseudoMetricFields
// );


	var reverse_equipment_digital_diagnostic_monitoring_Name = {};
	equipment_digital_diagnostic_monitoring_Name =
	{
    "samObjectFullName"      : "objectFullName",		// used explicitly; need to track change?    
    "samDescription"         : "description",			// describes type of interface
    "samShelfId"             : "shelfId",				// used explicitly; need to track change?
    "samSiteName"            : "siteName",
    "samSnmpPortId"          : "snmpPortId"
	};
	
	for( var i in equipment_digital_diagnostic_monitoring_Name)
	{
	MasterPropertyMap[equipment_digital_diagnostic_monitoring_Name[i]] = i;
	ReverseMasterPropertyMap[equipment_digital_diagnostic_monitoring_Name[i]] = i;
	reverse_equipment_physical_port_Name[equipment_digital_diagnostic_monitoring_Name[i]] = i;
	}


function process_digital_diagnostic_monitoring(record)
{
    var myId;
    var object_full_name = record.objectFullName;
	// adding if look to implement #RFE  in L2F 2.5.0.0
	
	if(record.siteName == undefined ){ //SAM 10
		object_full_name = object_full_name.toString();
		var subelement = LOOKUP.get(object_full_name);
		
		if(subelement == null)
		{
			logP5Msg("process_digital_diagnostic_monitoring", "SAMUBA_digital_diagnostic_monitoring", "Skipping 0 RID for --> "+ object_full_name);
			return;
		}

		myId = subelement.id;
		logP4Msg("process_digital_diagnostic_monitoring", "SAMUBA_digital_diagnostic_monitoring", "ENTERING for --> "+ object_full_name + " with id == " + myId);

		for(var i in equipment_digital_diagnostic_monitoring_metrics)
		{
			CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~DigitalDiagnosticMonitoring~", equipment_digital_diagnostic_monitoring_metrics[i]);
		}
	}
	else{
		var element;
		var subelement;
		var monobj = record.objectFullName.toString();
		var siteIdExp	= new RegExp('(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)');
		var value = siteIdExp.exec(monobj);
		var siteId = value[0];
		element = OPERATOR.elementNamedOrNew(record.siteName.toString());
		element.state = true;
		element.name = record.siteName.toString();
		element.origin = "SAM" ;
		element.collectorNumber = polled_stats_collector;

		subelement = OPERATOR.subelementNamedOrNew(record.objectFullName);

		subelement.name = record.objectFullName;
		subelement.state = true;
		subelement.origin = "SAM";
		subelement.family = "5620_SAM_DDM" ;
		subelement.invariant = record.objectFullName;
		subelement.instance = record.objectFullName;
		//subelement.timestamp = record.timestamp;
	  
			if (isConfig("inv_uses_names")) 
		{
			subelement.label = record.siteName+" "+record.objectFullName;
		}
		else 
		{
			subelement.label = record.objectFullName;
		}
		subelement.addProperty("nmVendor", "Alcatel5620SAM");
		subelement.addProperty("samSiteId", siteId);
		logP4Msg("process_digital_diagnostic_monitoring","siteId",siteId);
		//This property added for TCR enablement, it will be use for Cognos resource grouping
		subelement.addProperty("samFamilyName", "5620_SAM_DDM");

		for( var i in equipment_digital_diagnostic_monitoring_Name) 
		{
			if ( record[ equipment_digital_diagnostic_monitoring_Name[i] ] != undefined )
			{
				subelement.addProperty( i.toString(), record[ equipment_digital_diagnostic_monitoring_Name[i] ].toString() );
			}    
		}
		subelement.element = element; 
  
	}
 
 
    logP4Msg("process_digital_diagnostic_monitoring", "SAMUBA_digital_diagnostic_monitoring", "LEAVING");
}
	

