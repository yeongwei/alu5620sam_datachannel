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

function process_ddm_stats_log_record(record)
{
    var myId;
	var subelement;
	
    subelement = LOOKUP.get(record.monitoredObjectPointer.toString());
    if(subelement == null)
    {
    	logP5Msg("process_ddm_stats_log_record", "SAMUBA_ddm_stats_log_record", "Skipping 0 RID for --> "+ record.monitoredObjectPointer.toString());
        return;
    }

    myId = subelement.id;
    logP4Msg("process_ddm_stats_log_record", "SAMUBA_ddm_stats_log_record", "ENTERING for --> "+ record.monitoredObjectPointer.toString() + " with id == " + myId);

    for(var i in equipment_digital_diagnostic_monitoring_metrics)
    {

        CreateSimpleMetricObject(myId, record, "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~DigitalDiagnosticMonitoring~", equipment_digital_diagnostic_monitoring_metrics[i]);
    }

    logP4Msg("process_ddm_stats_log_record", "SAMUBA_ddm_stats_log_record", "LEAVING");
}
