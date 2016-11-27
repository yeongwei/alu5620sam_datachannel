// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// Polled metrics follow this

var standardAdditionalPolledMetricFields = [ "monitoredObjectPointer" ];



// For equipment.InterfaceStats

//
//  Names of the csv columns that we need to extract
//

var equipmentInterfaceMetrics   = [ "receivedOctetsPeriodic",
				    "receivedUnicastPacketsPeriodic",
				    "receivedPacketsDiscardedPeriodic",
				    "receivedBadPacketsPeriodic",
				    "receivedUnknownProtocolPacketsPeriodic",
				    "transmittedOctetsPeriodic",
				    "transmittedUnicastPacketsPeriodic",
				    "outboundPacketsDiscardedPeriodic",
				    "outboundBadPacketsPeriodic",
					"suspect",
				    "timeCaptured",
				  //code change start for PMR 16450
				    "periodicTime"
				  //code change end for PMR 16450
					//Added for suspect flag enhancement
					//"suspect"//Not within 2.12
				    ];


// For equipment.InterfaceAdditionalStatsLogRecord

var equipmentInterfaceAdditionalMetrics  = [ "receivedTotalOctetsPeriodic",
					     "receivedUnicastPacketsPeriodic",
					     "receivedMulticastPacketsPeriodic",
					     "receivedBroadcastPacketsPeriodic",
					     "transmittedTotalOctetsPeriodic",
					     "transmittedUnicastPacketsPeriodic",
					     "transmittedMulticastPacketsPeriodic",
					     "transmittedBroadcastPacketsPeriodic",
					     "suspect",
						 "timeCaptured",
						//code change start for PMR 16450
					     "periodicTime"
						//code change end for PMR 16450
						 //Added for suspect flag enhancement
					     //"suspect"//Not within 2.12
					     ];


// For equipment.MediaIndependentStatsLogRecord

var equipmentMediaIndependentMetrics  = [   "dropEventsPeriodic",	//12731
					    "droppedFramesPeriodic",					//12732
					    "receivedPacketsPeriodic",					//12733
					    "transmittedPacketsPeriodic",				//12734
					    "receivedOctetsPeriodic",					//12738
					    "transmittedOctetsPeriodic",				//12742
					    "receivedNonUnicastPacketsPeriodic",		//12737
					    "transmittedNonUnicastPacketsPeriodic",		//12741
					    "receivedBadPacketsPeriodic",				//12736
					    "transmittedBadPacketsPeriodic",			//12740
					    "inputSpeed",								//12743
					    "outputSpeed"								//12735
					    ];


// For equipment.SystemCpu

var cpuAdditionalFields= [ "monitoredObjectPointer",
			   "monitoredObjectSiteId"
			   ];

var equipmentSystemCpuMetrics = [ "systemCpuUsage"];


// For equipment.SystemMemoryStatsLogRecord

var equipmentSystemMemoryMetrics = [ "systemMemoryUsage"];


// equipment.AllocatedMemoryStatsLogRecord

var equipmentAllocatedMemoryMetrics = [ "allocatedMemory" ];


// equipment.AvailableMemoryStatsLogRecord
var equipmentAvailableMemoryMetrics = [ "availableMemory" ];


// For mpls.MplsInterfaceStatsLogRecord

var mplsInterfaceMetrics = [ "transmitPacketsPeriodic",
			     "receivePacketsPeriodic",
			     "transmitOctetsPeriodic",
			     "receiveOctetsPeriodic",
			     "timeCaptured",
			   //code change start for PMR 16450 
			     "periodicTime"
			   //code change end for PMR 16450 
			     ];


// For ppp.PppStatsLogRecord

var pppInterfaceStatMetrics = [ "keepaliveEchoReplyPacketsReceivedPeriodic",
				"keepaliveEchoRequestPacketsSentPeriodic",
				"keepaliveThresholdExceedsCountPeriodic",
				"lqmInRatePeriodic",
				"lqmLqrPacketsReceivedPeriodic",
				"lqmLqrPacketsSentPeriodic",
				"lqmOutRatePeriodic",
				"lqmThresholdExceedsCountPeriodic"];

// For svt.SdpBindingBaseStatsLogRecord

var sdpBindingMetrics = ["egressForwardedOctetsPeriodic",
			 "egressForwardedPacketsPeriodic",
			 "ingressDroppedPacketsPeriodic",
			 "ingressForwardedPacketsPeriodic",
			 "ingressDroppedOctetsPeriodic",
			 "ingressForwardedOctetsPeriodic",
			 "timeCaptured",
			//code change start for PMR 16450
			 "periodicTime"
			//code change end for PMR 16450 
			 ];


// For rtr.RouteStats

var rtrRouteMetrics = [ "isisRoutes",
			"bgpRoutes"
			];

// For equipment.CardHealthStatsLogRecord

var cardSlotMetrics = { "cpuLatest":"CPU Utilization (percent)",//2239
						"memoryLatest":"Memory Utilization (percent)"//2262
			};
			
var cardSlotMetricsFilter = [ 	"cpuLatest",
								"memoryLatest"
			];
	
var aosqosIngressPolicyMetrics = [ "greenPacketsPeriodic",
									"nonGreenPacketsPeriodic",
									"nonRedPacketsPeriodic",
									"redPacketsPeriodic",
									"yellowPacketsPeriodic"
			];
				
// For mpls.SiteStats
var mplsSiteStatsMetrics =
[
    'detourOriginatePeriodic',
    'detourTerminatePeriodic',
    'detourTransitPeriodic',
    'dynamicOriginatePeriodic',
    'dynamicTerminatePeriodic',
    'dynamicTransitPeriodic',
    'staticOriginatePeriodic',
    'staticTerminatePeriodic',
    'staticTransitPeriodic'
];

var svq_cust_multi_svc_site_egr_sched_plcy_port_stats =
[
    'forwardedOctets',
    'forwardedPackets'
];

var svq_cust_multi_svc_site_ing_sched_plcy_port_stats =
[
    'forwardedOctets',
    'forwardedPackets'
];	

var ethernet_equipment_dot3_stats =
[
    'alignmentErrorsPeriodic',
    'carrierSenseErrorsPeriodic',
    'deferredTransmissionsPeriodic',
    'excessiveCollisionsPeriodic',
    'fcsErrorsPeriodic',
    'frameTooLongsPeriodic',
    'internalMacReceiveErrorsPeriodic',
    'internalMacTransmitErrorsPeriodic',
    'lateCollisionsPeriodic',
    'multipleCollisionFramesPeriodic',
    'singleCollisionFramesPeriodic',
    'sqeTestErrorsPeriodic',
    'symbolErrorsPeriodic'
];

// Used for soap request for service.PppoeSapStatsLogRecord
var servicePppoeSapMetrics = 
[
    'pppoeSapReceivedDroppedPeriodic',
    'pppoeSapReceivedInvalidAcCookiePeriodic',
    'pppoeSapReceivedInvalidCodePeriodic',
    'pppoeSapReceivedInvalidLenPeriodic',
    'pppoeSapReceivedInvalidSessionPeriodic',
    'pppoeSapReceivedInvalidTagsPeriodic',
    'pppoeSapReceivedInvalidTypePeriodic',
    'pppoeSapReceivedInvalidVersionPeriodic',
    'pppoeSapReceivedSessionPeriodic',
    'pppoeSapTransmittedSessionPeriodic'
];

//******start New metrics classes in SAM 2.13 pack******

//For ethernetequipment.AggrMaintRxStatsLogRecord
var AggrMaintRxStatsMetrics = 
[
 	'aggrMaintRxTDFPeriodic',
 	'aggrMaintRxTRCFBroadcastPeriodic',
 	'aggrMaintRxTRCFMulticastPeriodic',
 	'aggrMaintRxTRCFPeriodic',
 	'aggrMaintRxTRCFUnicastPeriodic',
 	'aggrMaintRxTRCOPeriodic',
 	'aggrMaintRxTRSEFPeriodic',
 	"timeCaptured",
 	//code change start for PMR 16450
	"periodicTime"
 	//code change end for PMR 16450
];

//For ethernetequipment.AggrMaintTxStatsLogRecord
var AggrMaintTxStatsMetrics = 
[
	'aggrMaintTxTDFPeriodic',
	'aggrMaintTxTTFBroadcastPeriodic',
	'aggrMaintTxTTFMulticastPeriodic',
	'aggrMaintTxTTFPeriodic',
	'aggrMaintTxTTFUnicastPeriodic',
	'aggrMaintTxTTOPeriodic',
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//For mpr.IMALinkCurrentStatsLogRecord
var IMALinkCurrentStatsMetrics = 
[
	'imaLinkCurrentFeRxNumFailuresPeriodic',
	'imaLinkCurrentFeTxNumFailuresPeriodic',
	'imaLinkCurrentNeRxNumFailuresPeriodic',
	'imaLinkCurrentNeTxNumFailuresPeriodic',
	'imaLinkCurrentFeRxUnusableSecsPeriodic', 
	'imaLinkCurrentFeSevErroredSecsPeriodic',
	'imaLinkCurrentFeTxUnusableSecsPeriodic',
	'imaLinkCurrentFeUnavailSecsPeriodic',
	'imaLinkCurrentNeRxUnusableSecsPeriodic', 
	'imaLinkCurrentNeSevErroredSecsPeriodic',
	'imaLinkCurrentNeTxUnusableSecsPeriodic',
	'imaLinkCurrentNeUnavailSecsPeriodic',
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];
//For radioequipment.RadioAnalogueMeasureLogRecord
var RadioAnalogueMeasureMetrics = 
[
	'localRxDivPowerPeriodic',
	'localRxMainPowerPeriodic',
	'localTxPowerPeriodic',
	'remoteRxDivPowerPeriodic', 
	'remoteRxMainPowerPeriodic',
	'remoteTxPowerPeriodic'
];

//For radioequipment.PdhFrameHopHistoryDataStats15Min
var PdhFrameHopHistoryDataStats15MinMetrics = 
[
	'pdhFrameHopHDBbePeriodic',
	'pdhFrameHopHDEsPeriodic',
	'pdhFrameHopHDSesPeriodic',
	'pdhFrameHopHDUasPeriodic', 
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//For radioequipment.PdhFrameLinkHistoryDataStats15Min
var PdhFrameLinkHistoryDataStats15MinMetrics = 
[
	'pdhFrameLinkHDBbePeriodic',
	'pdhFrameLinkHDEsPeriodic',
	'pdhFrameLinkHDSesPeriodic',
	'pdhFrameLinkHDUasPeriodic', 
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//For tdmequipment.E1HistoryStats15minInLogRecord
var E1HistoryStats15minInLogRecordMetrics = 
[
	'e1HDEs',
	'e1HDSes',
	'e1HDUas',
	'e1HDBbe', 
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//For tdmequipment.E1HistoryStats15minOutLogRecord
var E1HistoryStats15minOutLogRecordMetrics = 
[
	'e1HDEs',
	'e1HDSes',
	'e1HDUas',
	'e1HDBbe', 
	"timeCaptured",
	//code change start for PMR 16450
	 "periodicTime"
	//code change end for PMR 16450
];

//For tdmequipment.DS1HistoryStats15minInLogRecord
var DS1HistoryStats15minInLogRecordMetrics = 
[
	'ds1HDEs',
	'ds1HDSes',
	'ds1HDUas',
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//For tdmequipment.DS1HistoryStats15minOutLogRecord
var DS1HistoryStats15minOutLogRecordMetrics = 
[
	'ds1HDEs',
	'ds1HDSes',
	'ds1HDUas',
	"timeCaptured",
	//code change start for PMR 16450
	"periodicTime"
	//code change end for PMR 16450
];

//******End of New metrics classes in SAM 2.13 pack******

//******Start of New metrics classes in SAM 2.14 pack******

var equipmentSystemCpuMonStatsMetrics = [ "tmnxSysCpuMonCpuIdle",
                                          "tmnxSysCpuMonSampleTime",
                                          "tmnxSysCpuMonBusyCoreUtil"];

//for equipment.HardwareTemperatureLogRecord
var equipmentHwTempMetrics = [ "temperature"];

//for nat.IsaMemberUsageStatsLogRecord
var natIsaMemberUsageStatsMetrics = [ "sessionUsage",
                                    "priSessions",
                                    "sessionUsageHi"];

//for dhcp.LocalDhcp6ServerPrefixStatsLogRecord
var localDhcp6ServerPrefixStatsMetrics = [ "stableLeases",
                                    "provisionedBlocks",
                                    "unusedBlocks",
                                    "freeBlocks",
                                    "pctBlocksUnused",
                                    "pctBlocksInUse"];

//for dhcp.LocalDhcpServerSubnetStatsLogRecord
var localDhcpServerSubnetStatsMetrics = [ "freeAddresses",
                                    "pctUsedAddresses",
                                    "pctFreeAddresses",
                                    "usedLeases"];

//******End of New metrics classes in SAM 2.14 pack******

// LTE metrics start from here

var S11AgwPeerStatsMetrics = 
[
	"echoRequestReceived",
	"echoRequestTransmitted",
	"echoResponseReceived",
	"echoResponseTransmitted",
	"createBearerRequestReceived",
	"numberOfDelBearerFailMsgRecd",
	"deleteBearerRequestReceived",
	"numberOfModifyBearerFailMsgRecd",
	"modifyBearerRequestReceived",
	"numberOfBearerCommandMsgRecd",
	"numberOfBearerResourceCmdPackets"
];

var S11FailureCodeStatsMetrics = 
[
	"receivedContextNotFound",
	"receivedNoResourceAvailable",
	"receivedRemotePeerNoResp",
	"receivedRequestRejected",
	"receivedUserAuthFailure",
	"transmittedContextNotFound",
	"transmittedNoResourceAvailable",
	"transmittedRemotePeerNoResp",
	"transmittedRequestRejected",
	"transmittedUserAuthFailure"
];
var S1uAgwPeerStatsMetrics = 
[
	"echoRequestReceived",
	"echoRequestTransmitted",
	"echoResponseReceived",
	"echoResponseTransmitted"
];
var S5AgwPeerStatsMinMetrics = 
[
	"echoRequestReceived",
	"echoRequestTransmitted",
	"echoResponseReceived",
	"echoResponseTransmitted",
	"createBearerRequestReceived",
	"deleteBearerCommand",
	"deleteBearerFailure",
	"deleteBearerRequestReceived",
	"modifyBearerCommand",
	"modifyBearerFailure",
	"modifyBearerRequestReceived",
	"noOfBearerResourceCmdPcks",
	"noOfBearerResourceFailureIndPcks"
];
var S5AgwFailureCodeStatsMetrics = 
[
	"receivedContextNotFound",
	"receivedNoResourceAvailable",
	"receivedRemotePeerNoResp",
	"receivedRequestRejected",
	"receivedUserAuthFailure",
	"transmittedContextNotFound",
	"transmittedNoResourceAvailable",
	"transmittedRemotePeerNoResp",
	"transmittedRequestRejected",
	"transmittedUserAuthFailure"
];
var S8AgwPeerStatsMetrics = 
[
	"echoRequestReceived",
	"echoRequestTransmitted",
	"echoResponseReceived",
	"echoResponseTransmitted",
	"createBearerRequestReceived",
	"deleteBearerRequestReceived",
	"modifyBearerRequestReceived",
	"updateBearerRequest"
];
var S8AgwFailureCodeStatsMetrics = 
[
	"receivedContextNotFound",
	"receivedNoResourceAvailable",
	"receivedRemotePeerNoResp",
	"receivedRequestRejected",
	"receivedUserAuthFailure",
	"transmittedContextNotFound",
	"transmittedNoResourceAvailable",
	"transmittedRemotePeerNoResp",
	"transmittedRequestRejected",
	"transmittedUserAuthFailure"
];
var MAFConnectionMetrics =
[
	"maxNbrOfConnectedUE",
	"maxNbrOfDeRegisteredUE",
	"maxNbrOfIdleUE",
	"maxNbrOfRegIdleUE",
	"maxNbrOfRegisteredUE",
	"maxNumOfDedicatedBearers",
	"maxNumOfDefaultBearers"
];




// End of polled metrics section

// Accounting metrics start here

var standardAdditionalAccountingMetricFields = [ "timeRecorded",
					     "queueId",
					     "monitoredObjectPointer"
					     ];

// Fields needed for lag network queue processing

var lagNetworkQueueFields = [ "lagPort",
			      "monitoredObjectSiteId",
			      "portId"
			      ];


// Service queues
// This is the set of metrics we assign to formulas for ingress

var svcCompleteServiceIngressMetrics =
[
    "highPktsOffered",
    "highPktsDropped",
    "lowPktsOffered",
    "lowPktsDropped",
    "highOctetsOffered",
    "highOctetsDropped",
    "lowOctetsOffered",
    "lowOctetsDropped",
    "inProfilePktsForwarded",
    "outOfProfilePktsForwarded",
    "inProfileOctetsForwarded",
    "outOfProfileOctetsForwarded",
    "uncolouredPacketsOffered",
	"uncolouredOctetsOffered",
    "timeRecorded"
];

var svc_complete_service_ingress_metrics_for_mss =
[
    "highPktsDropped",
    "lowPktsDropped",
    "highOctetsDropped",
    "lowOctetsDropped",
	"timeRecorded"
];

// Used for soap request for service.CompleteServiceIngressPacketOctetsLogRecord

var completeServiceIngressPacketOctetsMetrics =
[
    'portId',
    'monitoredObjectSiteName',
    'monitoredObjectSiteId',
    'allOctetsDropped',
    'allPktsDropped',
    "highPktsOffered",
    "highPktsDropped",
    "lowPktsOffered",
    "lowPktsDropped",
    "highOctetsOffered",
    "highOctetsDropped",
    "lowOctetsOffered",
    "lowOctetsDropped",
    "inProfilePktsForwarded",
    "outOfProfilePktsForwarded",
    "inProfileOctetsForwarded",
    "outOfProfileOctetsForwarded",
    "uncolouredPacketsOffered",
	"uncolouredOctetsOffered"
];

// Used for soap request for service.ServiceIngressOctetsLogRecord

var serviceIngressOctetMetrics = [ "highOctetsOffered",
				   "highOctetsDropped",
				   "lowOctetsOffered",
				   "lowOctetsDropped",
				   "inProfileOctetsForwarded",
				   "outOfProfileOctetsForwarded",
				   "uncolouredOctetsOffered"
				   ];

// Used for soap request for service.ServiceIngressPacketsLogRecord

var serviceIngressPacketMetrics = [ "highPktsOffered",
				    "highPktsDropped",
				    "lowPktsOffered",
				    "lowPktsDropped",
				    "inProfilePktsForwarded",
				    "outOfProfilePktsForwarded",
				    "uncolouredPacketsOffered"
				    ];
						  
// This is the set of metrics we assign to formulas for egress

var svcCompleteServiceEgressMetrics = [ "inProfilePktsForwarded",
					"inProfilePktsDropped",
					"outOfProfilePktsForwarded",
					"outOfProfilePktsDropped",
					"inProfileOctetsForwarded",
					"inProfileOctetsDropped",
					"outOfProfileOctetsForwarded",
					"outOfProfileOctetsDropped",
					"timeRecorded"
					];

var svc_complete_service_egress_metrics_for_mss =
[
    "inProfilePktsDropped",
	"outOfProfilePktsDropped",
	"inProfileOctetsDropped",
	"outOfProfileOctetsDropped",
	"timeRecorded"
];

// Used for soap request for service.CompleteServiceEgressPacketOctetsLogRecord

var completeServiceEgressPacketOctetsMetrics =
[
    'portId',
    'monitoredObjectSiteName',
    'monitoredObjectSiteId',
    'allOctetsDropped',
    'allPktsDropped',
    "inProfilePktsForwarded",
    "inProfilePktsDropped",
    "outOfProfilePktsForwarded",
    "outOfProfilePktsDropped",
    "inProfileOctetsForwarded",
    "inProfileOctetsDropped",
    "outOfProfileOctetsForwarded",
    "outOfProfileOctetsDropped"
];

// Used for soap request for service.ServiceEgressOctetsLogRecord

var serviceEgressOctetMetrics = [ "inProfileOctetsForwarded",
				   "inProfileOctetsDropped",
				   "outOfProfileOctetsForwarded",
				   "outOfProfileOctetsDropped"
				   ];

// Used for soap request for service.ServiceEgressPacketsLogRecord

var serviceEgressPacketMetrics = [ "inProfilePktsForwarded",
				    "inProfilePktsDropped",
				    "outOfProfilePktsForwarded",
				    "outOfProfilePktsDropped"
				    ];

// Network queues
// This is the set of metrics we assign to formulas

//**This array is used in:
// 1. SAMUBA_nqueue_combined_network_ingress.js
// 2. SAMUBA_complete_network_egress_packet_octets.js
// 3. SAMUBA_complete_network_ingress_packet_octets.js
var nqueueCombinedNetworkIngressMetrics = [ "inProfileOctetsForwarded",
					    "outOfProfileOctetsForwarded",
					    "inProfileOctetsDropped",
					    "outOfProfileOctetsDropped",
					    "inProfilePktsForwarded",
					    "outOfProfilePktsForwarded",
					    "inProfilePktsDropped",
					    "outOfProfilePktsDropped",
					    "timeRecorded"
					    ];

// Used for soap request for service.NetworkIngressPacketsLogRecord

var nqueueIngressPacketMetrics = [ "inProfilePktsForwarded",
				   "outOfProfilePktsForwarded",
				   "inProfilePktsDropped",
				   "outOfProfilePktsDropped"
				   ];

// Used for soap request for service.CombinedNetworkIngressOctetsLogRecord

var nqueueIngressOctetMetrics = [ "inProfileOctetsForwarded",
				  "outOfProfileOctetsForwarded",
				  "inProfileOctetsDropped",
				  "outOfProfileOctetsDropped"
				  ];


// This is the set of metrics we assign to formulas

var nqueueCombinedNetworkEgressMetrics = [ "inProfileOctetsForwarded",
					   "outOfProfileOctetsForwarded",
					   "inProfileOctetsDropped",
					   "outOfProfileOctetsDropped",
					   "inProfilePktsForwarded",
					   "outOfProfilePktsForwarded",
					   "inProfilePktsDropped",
					   "outOfProfilePktsDropped",
					   "pktsForwarded",
					   "pktsDropped",
					   "timeRecorded"
					   ];

// Used for soap request for service.NetworkEgressPacketsLogRecord

var nqueueEgressPacketMetrics = [ "inProfilePktsForwarded",
				   "outOfProfilePktsForwarded",
				   "inProfilePktsDropped",
				   "outOfProfilePktsDropped",
				   "pktsForwarded",
				   "pktsDropped"
				   ];

// Used for soap request for service.CombinedNetworkEgressOctetsLogRecord

var nqueueEgressOctetMetrics = ["inProfileOctetsForwarded",
				 "outOfProfileOctetsForwarded",
				 "inProfileOctetsDropped",
				 "outOfProfileOctetsDropped"
				 ];

// End of accounting metrics section

// Metrics that are actually inventory classes, but treated as metrics so we can get history, stats, etc.

var standardAdditionalPseudoMetricFields = [ "objectFullName" ];

// For equipment.HwEnvironment

var equipmentHwEnvironmentPseudoMetrics = [ "temperature",
					    "temperatureInFahrenheit",
					    "temperatureThreshold",
					    "temperatureThresholdInFahrenheit"];


// For ppp.PppControlProtocol

var pppControlProtocolPseudoMetrics = [ "restartCount"];


//For nat.NatPoolLsnStatsLogRecord
var natPoolLsnStatsLogRecordMetrics = ["mbrBlockUsage"];

//For nat.NatPoolL2AwStatsLogRecord									   
 var natPoolL2AwStatsLogRecordMetrics = ["blkUsage"];
//-----------------------------------------------------------------

//For l2tp.SiteStatsLogRecord

var l2tpSiteStatsLogRecordMetrics = ["activeSessions",
                              "activeTunnels",
                              "attemptedSessionsPeriodic",
                              "attemptedTunnelsPeriodic",
                              "currentBlackListLengthPeriodic",
                              "failedSessionsPeriodic",
                              "failedTuAuthPeriodic",
                              "failedTunnelsPeriodic",
                              "totalSessionsPeriodic",
                              "totalTunnelsPeriodic"];

//For equipment.FlashMemory

var equipmentFlashMemoryMetrics = ["amountUsed",
                                   "capacity",
                                   "percentageUsed"];

//For ethernetequipment.EthernetStatsLogRecord

var ethernetequipmentEthernetStatsLogRecord = ["undersizePacketsPeriodic",
                                               "oversizePacketsPeriodic"];

// for equipment.DigitalDiagnosticMonitoring

var equipment_digital_diagnostic_monitoring_metrics =
[
    'rxOpticalPower',
    'supplyVoltage',
    'txBiasCurrent',
    'temperature',
    'txOutputPower'
];

// OAM ping tests

var standardAdditionalOAMTestMetricFields = ["test"];

// For OAM ping tests.  These are the metrics we extract in the processing routine.
// This list is used to assign metrics to formulas

var oamPingMetrics   = {
                        "averageInboundOneWayTime":"One Way~Inbound (ms) (avg)",
                        "averageOneWayTime":"One Way~Outbound (ms) (avg)",
                        "averageRoundTripTime":"Round Trip~RTT (ms) (avg)",
                        "inboundJitter":"Jitter~Inbound Jitter (ms) (avg)",
                        "outboundJitter":"Jitter~Outbound Jitter (ms) (avg)",
                        "roundTripJitter":"Jitter~Jitter (ms) (avg)",
                        "lossPercentage":"Round Trip~Probes Lost (percent)"
};



// This set is used for the filter on the metric request.  It should list the same ALU metrics as the previous set

var oamPingMetricsForFilter   = [    // "oneWayTime",
				 "averageInboundOneWayTime",
				 "averageOneWayTime",
				 "averageRoundTripTime",
				 "inboundJitter",
				 "outboundJitter",
				 "roundTripJitter",
				 "lossPercentage"
				 ];

var cfmOneWayDelayMetrics = 
[   
	"mepDelay",
    "mepDelayVariation"
];

var cfmTwoWayDelayMetrics = 
[   
	"mepDelay",
    "mepDelayVariation"
    // "lossPercentage",
    // "averageRoundTripTime"
    //"maximumRoundTripTime",
    //"minimumRoundTripTime"
];

var cfmEthernetMetrics = 
[      
	"mepByteCount",
    "mepFrameCount",
    "mepCrcFailures",
    "mepFailedBits"
];

var cfm_single_ended_loss_metrics = 
[      
	"frameLossLocal",
	"frameLossPeer",
	"frameLossRatioLocal",
	"frameLossRatioPeer"
];

var additional_ping_test_metrics =
[
	"packetTimeouts",
	"packetsLost",
	"packetsSent"
];

var natIsaResourceStatsMetrics = [
	"statsName",
	"statsValue",
	"statsMaxValue"
];


