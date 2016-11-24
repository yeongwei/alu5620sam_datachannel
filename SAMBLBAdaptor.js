// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMBLBAdaptor.js - The BLB adaptor for the 5620 SAM AppPack
var SAM={};
var MasterPropertyMap = {};
var THE_MODELINTERFACE = PV.ModelInterface();
PV.adaptor.modelInterface = THE_MODELINTERFACE;

// You are doomed to failure if you comment out the line below.
PV.importScript('alcatel_5620_sam_log2file/AppLogger.js');
PV.importScript("alcatel_5620_sam_log2file/SAMCommon.js");
PV.importScript("alcatel_5620_sam_log2file/SAMDomainModel.js");
PV.importScript('alcatel_5620_sam_log2file/SAM_app_config.js');
PV.importScript('alcatel_5620_sam_log2file/SAM_soap_filter.js');
PV.importScript('alcatel_5620_sam_log2file/SAMUBA_metrics.js');

var config_read = 0;
var ppp_filter;

read_UBA_config();

var sam_server_version         = app_config_value("SAM_SERVER_VERSION");
var sam_server_release_version = app_config_value("SAM_SERVER_RELEASE_VERSION");

// Override the base definition of exportClassSummary to ensure that we don't attempt
// to acquire and parse the CSV file (the csv export will be acquired and processed via
// the normal BLB/UBA file acquisition and processing scheme)
function initializeDomainModelForBLB()
{
    var samModel = initializeDomainModel();
    //samModel.classNamed("generic.GenericObject").addClassMethod("exportClassSummary","packagePrefixedClassFullName exportFormat propertyFormat filter<FilterHolder> outFileName", "outFileURI");
    //samModel.classNamed("equipment.PhysicalPort").addClassMethod("findToFile","fullClassName filter<FilterHolder> fileName","outFileURI");
    samModel.classNamed("generic.GenericObject").addClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder> fileName","outFileURI");

    return samModel;
}

PV.adaptor.initializeSchemas = function()
{
    this.schemas.add
    (
        PV.IdMapBLBSchema
        (
            "idmap",
            {
                precedence: 10,
                parseURI: function(inputDescriptor) { inputDescriptor.ignore=true; }
            }
        ) // IdmapBLBSchema 
    ); // add function 

    this.schemas.add
    (
        PV.SAMPassThruSchema
        (
            "sam",
            {
                precedence: 5,
                parseURI: parseSAMURI,
                domainModel: initializeDomainModelForBLB(),
                fileExtension: PV.configuration.SAM.FILEEXTENSION,
                sendExportQuery: function(stopDate, previousStopDate)
                {
                    var startDate_poll, startDate_acct, endDate_r, endDate_s, timeFilter_poll,timeFilter_acct,filenameTail_poll,filenameTail_acct,timeFilter_poll_base_on_acc;

                    if (config_read == 0)
                    {
                        read_metric_config();
                        setup_metric_soap_filters();
                        config_read = 1;
                    }
                
                    startDate_poll = previousStopDate.valueOf();
                    startDate_acct = previousStopDate.valueOf() - app_config_value("file_policy_period")*1000;
                    endDate_r = stopDate.valueOf() - 1; /* Make the starting time be 1 millisecond before the end time of this period to avoid slipping into the next hour */
                    endDate_s = stopDate.valueOf() - app_config_value("file_policy_period")*1000 - 1; /* Make the starting time be 1 millisecond before the end time of this period to avoid slipping into the next hour */
                
                    // timeFilter_poll, startDate_poll, etc., are for the polled stats. timeFilter_acct, etc., are for the 
                    // accounting stats.  They use different timestamps (timeCaptured vs. timeRecorded) which are on different
                    // delays, so they need to be handled separately.

                    timeFilter_poll             = timefilter("timeCaptured", startDate_poll, endDate_r);
                    timeFilter_oam              = timefilter("scheduledTime", startDate_poll, endDate_r);
                    timeFilter_acct             = timefilter("timeRecorded", startDate_acct, endDate_s);
                    timeFilter_poll_base_on_acc = timefilter("timeCaptured", startDate_acct, endDate_s);

                    // ?? createdOnPollType ?
                    recordFilter_poll = '<equal name="updatedOnPollType" value="ScheduledFullNodeResync"/>';
                    recordFilter_oam = '<equal name="scheduled" value="scheduled"/>';
                
                    logP6Msg("SAMBLB", "export_query", app_config_value("file_policy_period"));

                    logP6Msg("SAMBLB", "export_query", "timeFilter_poll " + timeFilter_poll);
                    logP6Msg("SAMBLB", "export_query", "timeFilter_oam " + timeFilter_oam);
                    logP6Msg("SAMBLB", "export_query", "timeFilter_acct " + timeFilter_acct);
                    logStatus("startDate_poll", startDate_poll);
                    logStatus("startDate_acct", startDate_acct);
                    logStatus("timeFilter_poll", timeFilter_poll);
                    logStatus("timeFilter_acct", timeFilter_acct);

                    var genObj=SAM.generic.GenericObject;
                    //var genObj=SAM.equipment.PhysicalPort;
                    filenameTail_poll="_" + previousStopDate.asProvisoString() + "." + this.fileExtension;
                    logStatus("filenameTail_poll", filenameTail_poll);

                    var k = Date.fromUTCSeconds((previousStopDate.valueOf() -  (app_config_value("file_policy_period").valueOf())*1000)/1000);

                    filenameTail_acct = "_" + k.asProvisoString() + "." + this.fileExtension;
                    logStatus("filenameTail_acct", filenameTail_acct);

                    logP6Msg("SAMBLB", "export_query", "Making non-accounting requests for time period:" + timeFilter_poll);
                    PV.Logger.logInfo("AppLogger", "All",  "SAMBLB requesting files");

                    blbStatsRequest2("ppp.PppStatsLogRecord", "PppInterfaceStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.InterfaceStatsLogRecord", "InterfaceStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.InterfaceAdditionalStatsLogRecord", "InterfaceAdditionalStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.MediaIndependentStatsLogRecord", "MediaIndependentStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.SystemCpuStatsLogRecord", "SystemCpuStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.SystemMemoryStatsLogRecord", "SystemMemoryStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.AvailableMemoryStatsLogRecord", "AvailableMemoryStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("equipment.AllocatedMemoryStatsLogRecord", "AllocatedMemoryStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    // no timefilter because this is an inventory class, not a stats class (hack)
                    blb_request_property_type_metric("equipment.HwEnvironment", "HWEnvTemperature" + filenameTail_poll);
                
                    // genObj.findToFile("equipment.HwEnvironment",get_soap_filter("equipment.HwEnvironment"),"HWEnvTemperature" + filenameTail_poll);
                    // this one is similar
                    if (isExcludeAll("ppp.PppControlProtocol"))
                    {
                        ppp_filter=nothing;
                    }
                    else
                    {
                        ppp_filter=everything;
                    }

                    logP3Msg("SAMBLB", "export_query", "ppp_filter is "+ppp_filter);

                    genObj.findToFile("ppp.PppControlProtocol",ppp_filter, no_children, "PPPControlProtocolMetrics" + filenameTail_poll);

                    blbStatsRequest2("mpls.MplsInterfaceStatsLogRecord", "MplsInterfaceStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    blbStatsRequest2("svt.SdpBindingBaseStatsLogRecord", "SdpBindingBaseStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    // OAM ping test results
                    blbStatsRequest2("icmp.IcmpPingResult", "IcmpPingResult" + filenameTail_poll, timeFilter_oam, recordFilter_oam);
                    blbStatsRequest2("mpls.LspPingResult","MplsLspPingResult" + filenameTail_poll, timeFilter_oam, recordFilter_oam);
                    blbStatsRequest2("svt.TunnelPingResult", "TunnelPingResult" + filenameTail_poll, timeFilter_oam, recordFilter_oam);
                    blbStatsRequest2("svt.VccvPingResult", "VccvPingResult" + filenameTail_poll, timeFilter_oam, recordFilter_oam);
                    blbStatsRequest2("service.SitePingResult", "SitePingResult" + filenameTail_poll, timeFilter_oam, recordFilter_oam);

                    logP6Msg("SAMBLB", "export_query", "Making accounting requests for time period:" +timeFilter_acct);

                    // The accounting stats are always scheduled, so there is no need for the filter
                    // for scheduled vs. on-demand

                    // Network queues
                    blbStatsRequest2("service.CombinedNetworkIngressOctetsLogRecord", "CombinedNetworkIngressOctetsLogRecord"+filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.NetworkIngressPacketsLogRecord", "NetworkIngressPacketsLogRecord"+filenameTail_acct, timeFilter_acct);

                    blbStatsRequest2("service.CombinedNetworkEgressOctetsLogRecord", "CombinedNetworkEgressOctetsLogRecord"+filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.NetworkEgressPacketsLogRecord", "NetworkEgressPacketsLogRecord"+filenameTail_acct, timeFilter_acct);


                    blbStatsRequest2("service.CompleteServiceIngressPacketOctetsLogRecord", "CompleteServiceIngressPacketOctets" + filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.ServiceIngressOctetsLogRecord", "ServiceIngressOctets" + filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.ServiceIngressPacketsLogRecord", "ServiceIngressPackets" + filenameTail_acct, timeFilter_acct);

                    blbStatsRequest2("service.CompleteServiceEgressPacketOctetsLogRecord", "CompleteServiceEgressPacketOctets" + filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.ServiceEgressOctetsLogRecord", "ServiceEgressOctets" + filenameTail_acct, timeFilter_acct);
                    blbStatsRequest2("service.ServiceEgressPacketsLogRecord", "ServiceEgressPackets" + filenameTail_acct, timeFilter_acct);

                    logP6Msg("SAMBLB", "export_query", "Making router stats requests for time period:" + timeFilter_acct);
                    blbStatsRequest2("rtr.RouteStatsLogRecord", "RouteStatsLogRecord" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                    if (sam_server_version >= 8)
                    {

						var load_sam_8_class_immediately = false;
						if (sam_server_version > 8)
                        {
                            load_sam_8_class_immediately = true;
                        }
			     
                        if (sam_server_release_version >= 5 || load_sam_8_class_immediately)
                        {
                            blbStatsRequest2("equipment.CardHealthStatsLogRecord", "CardHealth" + filenameTail_poll, timeFilter_poll, recordFilter_poll);
                            blbStatsRequest2("ethernetoam.CfmLoopbackResult", "CfmLoopbackPingResult" + filenameTail_poll, timeFilter_poll, recordFilter_oam);
                            blbStatsRequest2("ethernetoam.CfmOneWayDelayTestResult", "CfmOneWayDelay" + filenameTail_poll, timeFilter_poll, recordFilter_oam);
                            blbStatsRequest2("ethernetoam.CfmTwoWayDelayTestResult", "CfmTwoWayDelayPingResult" + filenameTail_poll, timeFilter_poll, recordFilter_oam);
                            blbStatsRequest2("ethernetoam.CfmEthTestResult", "CfmEthernet" + filenameTail_poll, timeFilter_poll, recordFilter_oam);
                            blbStatsRequest2("aosqos.QoSIngressPolicyStatsLogRecord", "QoSIngressPolicyStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);
                        }

                        if (sam_server_release_version >= 7 || load_sam_8_class_immediately)
                        {
			                blbStatsRequest2("mpls.SiteStatsLogRecord", "MplsSiteStats" + filenameTail_poll, timeFilter_poll, recordFilter_poll);

                            // no timefilter because this is an inventory class, not a stats class (hack)
                            blb_request_property_type_metric_filter_all_or_nothing("equipment.DigitalDiagnosticMonitoring", "DigitalDiagnosticMonitoring" + filenameTail_poll);

                            blbStatsRequest2("svq.CustMultiSvcSiteEgrSchedPlcyPortStatsLogRecord", "CustMultiSvcSiteEgrSchedPlcyPortStats" + filenameTail_acct, timeFilter_poll_base_on_acc, recordFilter_poll);
                            blbStatsRequest2("svq.CustMultiSvcSiteIngSchedPlcyPortStatsLogRecord", "CustMultiSvcSiteIngSchedPlcyPortStats" + filenameTail_acct, timeFilter_poll_base_on_acc, recordFilter_poll);
			                blbStatsRequest2("service.PppoeSapStatsLogRecord", "PppoeSapStatsLogRecord" + filenameTail_acct, timeFilter_poll_base_on_acc, recordFilter_poll);
                            blbStatsRequest2("ethernetequipment.Dot3StatsLogRecord", "EthernetEquipmentDot3StatsLogRecord" + filenameTail_poll, timeFilter_poll, recordFilter_poll);
							blbStatsRequest2("ethernetoam.CfmSingleEndedLossTestResult", "CfmSingleEndedLoss" + filenameTail_poll, timeFilter_poll, recordFilter_oam);
                        }
                    }
                }
            }
        ) // SAMPassThruSchema 
    ); // add function 
};


function blbStatsRequest1(statsRecord, filenameTail, timeFilter, recordFilter) {
    var statsFilter;
    var genObj=SAM.generic.GenericObject;
    var node_filter=get_soap_filter(statsRecord);

    if (isUndef(statsRecord)) {
    logP3Msg("SAMBLB", "blbStatsRequest", "Tried requesting class that is undefined!!!");
    return;
    }

    if (isUndef(node_filter)) {
    logP3Msg("SAMBLB", "blbStatsRequest", "Undefined soap filter for stats class " + statsRecord+"!!!");
    return;
    }

    
    if (isDef(timeFilter)) {
    statsFilter = soap_filter_and(node_filter, timeFilter);
    if (isDef(recordFilter)) {
        statsFilter = soap_filter_and(statsFilter, recordFilter);
    }
    }
    
    genObj.findToFile(statsRecord, statsFilter, no_children, filenameTail);

    logP6Msg("SAMBLB", "blbStatsRequest", "Requesting class "+statsRecord+" to file "+filenameTail);
    logP6Msg("SAMBLB", "blbStatsRequest", "Filter is: " + statsFilter);

    
}

function blbStatsRequest2(statsRecord, filenameTail, timeFilter, recordFilter)
{
    var statsFilter, resultFilter;

    var genObj       = SAM.generic.GenericObject;
    var node_filter  = get_soap_filter(statsRecord);
    var resultFilter = get_resultfilter(statsRecord);

    if (isUndef(statsRecord))
    {
        logP3Msg("SAMBLB", "blbStatsRequest", "Tried requesting class that is undefined!!!");
        return;
    }

    if (isUndef(node_filter))
    {
        logP3Msg("SAMBLB", "blbStatsRequest", "Undefined soap filter for stats class " + statsRecord+"!!!");
        return;
    }

    if (isUndef(resultFilter))
    {
        logP3Msg("SAMBLB", "blbStatsRequest", "Undefined result filter for stats class " + statsRecord+"!!!");
        return;
    }

    logP6Msg("SAMBLB", "blbStatsRequest2", "resultFilter: " + resultFilter);
    logP6Msg("SAMBLB", "blbStatsRequest2", "timeFilter: " + timeFilter);

    statsFilter = node_filter;

    if (isDef(timeFilter))
    {
        statsFilter = soap_filter_and(statsFilter, timeFilter);
    }

    if (isDef(recordFilter))
    {
        statsFilter = soap_filter_and(statsFilter, recordFilter);
    }
    
    genObj.findToFile(statsRecord, statsFilter, resultFilter, filenameTail);

    logP6Msg("SAMBLB", "blbStatsRequest", "Requesting class "+statsRecord+" to file "+filenameTail);
    logP6Msg("SAMBLB", "blbStatsRequest", "Filter is: " + statsFilter);
}

/*
 * Important Notes: This havent been tested
 *
 */
function blb_request_property_type_metric(request_class, file_name)
{
    if (! request_class && ! file_name)
    {
        return;
    }

    var genObj       = SAM.generic.GenericObject;
    var node_filter  = get_soap_filter(request_class);
    var resultFilter = get_resultfilter(request_class);

    if (isUndef(node_filter))
    {
        if (enable_log_base_on_level(3))
        {
            logP3Msg("SAMBLB", "BLB request property type metric", "Undefined soap filter for request class " + request_class+"!!!");
        }
        return;
    }

    if (! request_property_type_metric_within_time_frame(file_name))
    {
        if (enable_log_base_on_level(3))
        {
            logP3Msg('SAMBLB', 'BLB request property type metric', 'Requesting nothing for class' + request_class + ' due to not within the time frame');
        }
        node_filter = nothing;
    }

    if (enable_log_base_on_level(6))
    {
        logP6Msg('SAMBLB', 'BLB request property type metric', 'node_filter is set to ' + node_filter);
    }

    genObj.findToFile(request_class, node_filter, resultFilter, file_name);

    if (enable_log_base_on_level(6))
    {
        logP6Msg('SAMBLB', 'BLB request property type metric', 'Request class ' + request_class + ' to file ' + file_name);
    }
}

function blb_request_property_type_metric_filter_all_or_nothing(request_class, file_name)
{
    if (! request_class && ! file_name)
    {
        return;
    }

    var class_filter = get_soap_filter_property_type_metric_filter_all_or_nothing(request_class, file_name);

    if (enable_log_base_on_level(3))
    {
        logP3Msg('SAMBLB', 'BLB filter property type metric', 'filter for '+ request_class + ' is ' + class_filter);
    }

    var genObj = SAM.generic.GenericObject;
    genObj.findToFile(request_class, class_filter, no_children, file_name);

    if (enable_log_base_on_level(6))
    {
        logP6Msg('SAMBLB', 'BLB filter property type metric', 'Request class ' + request_class + ' to file ' + file_name);
    }
}

function request_property_type_metric_within_time_frame(file_name)
{
    // time frame for property type metric is 45 minutes
    // convert to milliseconds, 45 * 60 * 10000 = 2700000
    var accepted_time_frame    = 2700000;
    var request_file_timestamp = dateFromSAMFilename(file_name).getTime();;
    var current_timestamp      = new Date().getTime();

    if (enable_log_base_on_level(6))
    {
        logP6Msg('SAMBLB', 'current timestamp value', 'current timestamp ' + current_timestamp);
        logP6Msg('SAMBLB', 'request file timestamp value', 'requested timestamp ' + request_file_timestamp);
    }

    // check if request timestamp is not larger than accepted time frame
    if ((current_timestamp - request_file_timestamp) <= accepted_time_frame)
    {
        return true;
    }

    if (enable_log_base_on_level(3))
    {
        var accepted_time_frame_in_minutes = (accepted_time_frame / 1000) / 60;
        logP3Msg('SAMBLB', 'time frame check', 'Request class exceed ' + accepted_time_frame_in_minutes + ' minutes time frame');
    }

    return false;
}

function timefilter(property, start, end) {

    var first, second;

    
    first = soap_filter_unary("greaterOrEqual", property, start);
    second = soap_filter_unary("lessOrEqual", property, end);

    return(soap_filter_and(first, second));

}
