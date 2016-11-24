// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

// SAMDomainModel.js - Define the domain model for the 5620 SAM
//
// This script should be imported by any script that makes use of the
// 5620 SAM Domain model, such as the SAMUBAAdaptor.js and the SAMIFAdaptor.js
//
//

//var cls;
/*
function initializeDomainModel()
{
    var samModel = PV.ForeignDomainModel();

    // construct base classes with methods
    cls = samModel.defineClass
    (
        "ManagedObject",
        null,
        "actionMask children-Set<children-set> className deploymentState<DeploymentState> name objectFullName parentId"
    );
    
    cls = samModel.defineClass
    (
        "generic.CommonManagedEntityInformation",
        null,
        "objectFullName objectClassName allomorphicClassName objectId displayedName lifeCycleState"
    );
    
    cls = samModel.defineClass("generic.GenericObject","ManagedObject","");

	cls.addCSVClassMethod("exportClassSummary", "packagePrefixedClassFullName exportFormat propertyFormat filter<FilterHolder>", "result<List>");

    cls.addClassMethod("classFind","className filter<FilterHolder>","result<List>");
    cls.addClassMethod("classFindShallow","fullClassName filter<FilterHolder>","result<List>");
 
 	cls = samModel.defineClass
    (
        "subscr.Subscriber",
        "ManagedObject",
        "address contact deletionState<boolean> description email numberOfLocalInstances phoneNumber subscr.Site-Set<children-set> subscriberId<long> subscriberName svc.Service-Set<children-set>"
    );
 
    cls.addMethod("findServices","filter<FilterHolder>","infoList<List>");
 	
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> filename","result<List>");

    constructOtherClasses(samModel);
    constructOtherClasses2(samModel);
    constructOtherClasses3(samModel);
    constructOtherClasses4(samModel);
    constructOtherClasses5(samModel);
	constructOtherClasses6(samModel);
    return samModel;
}
*/	
//
//  construct simple classes
//
/*	
function constructOtherClasses(samModel) 
{
    cls = samModel.defineClass("nqueue.ForwardingClass","ManagedObject","objectFullName name deploymentState siteName siteId policyType id isLocal globalPolicy displayedName description containingPolicyId containingPolicyDisplayedName queueId multicastQueueId forwardingClass");
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
    cls = samModel.defineClass("nqueue.Policy","ManagedObject","numberMulticastQueues numberUnicastQueues numberOfUnderlyingPolicyItems configurationAction configurationMode distributionMode policyType isLocal siteId siteName displayedName description id globalPolicy templateObject deploymentState objectFullName name selfAlarmed");
    //    cls = samModel.defineClass("nqueue.Policy","ManagedObject","objectFullName name deploymentState siteId siteName policyType isLocal id globalPolicy displayedName description serviceCapability numberOfUnderlyingPolicyItems numberUnicastQueues numberMulticastQueues");
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
    cls = samModel.defineClass("nqueue.Entry","ManagedObject","objectFullName name deploymentState siteId siteName policyType isLocal id globalPolicy displayedName description containingPolicyId containingPolicyDisplayedName weight queueParent pir multicast mbs level highPriority expedite cirWeight cirLevel cir cbs");
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("aengr.ForwardingClass", "ManagedObject", "broadcastQueueId containingPolicyDisplayedName containingPolicyId deploymentState description displayedName forwardingClass globalPolicy id inDscp inPrecedence inRemark isGhost isLocal multicastQueueId name objectFullName outDscp outPrecedence outRemark policyType profile queueId selfAlarmed siteId siteName unknownQueueId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("aengr.Policy", "ManagedObject", "bwFactor configurationAction defaultFc defaultFcPriority defaultFullFc defaultSubFc deploymentState description displayedName globalPolicy id isLocal matchCriteria name numberMulticastClasses numberOfForwardingSubClasses numberOfIpMatches numberOfMacMatches numberOfQueues numberOfUnderlyingPolicyItems objectFullName policyType serviceCapability siteId siteName");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("aengr.Queue", "ManagedObject", "cir cirAdaptation cirLevel cirWeight committedBurstSize containingPolicyDisplayedName containingPolicyId deploymentState description displayedName expedite globalPolicy highPriorityReserved id isLocal level maximumBurstSize mode multicast multipoint name objectFullName pir pirAdaptation policed policyType scheduler selfAlarmed siteId siteName weight");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");


	cls = samModel.defineClass("aingr.ForwardingClass", "ManagedObject", "broadcastQueueId containingPolicyDisplayedName containingPolicyId deploymentState description displayedName forwardingClass globalPolicy id inDscp inPrecedence inRemark isGhost isLocal multicastQueueId name objectFullName outDscp outPrecedence outRemark policyType profile queueId selfAlarmed siteId siteName unknownQueueId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("aingr.Policy", "ManagedObject", "bwFactor configurationAction defaultFc defaultFcPriority defaultFullFc defaultSubFc deploymentState description displayedName globalPolicy id isLocal matchCriteria name numberMulticastClasses numberOfForwardingSubClasses numberOfIpMatches numberOfMacMatches numberOfQueues numberOfUnderlyingPolicyItems objectFullName policyType serviceCapability siteId siteName");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("aingr.Queue", "ManagedObject", "cir cirAdaptation cirLevel cirWeight committedBurstSize containingPolicyDisplayedName containingPolicyId deploymentState description displayedName expedite globalPolicy highPriorityReserved id isLocal level maximumBurstSize mode multicast multipoint name objectFullName pir pirAdaptation policed policyType scheduler selfAlarmed siteId siteName weight");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("sasqos.AccessIngress", "ManagedObject", "scope defaultFc matchCriteria numberMulticastClasses numberOfIpMatches numberOfMacMatches  numberOfMeters numQosClassifiers numberOfUnderlyingPolicyItems configurationAction configurationMode distributionMode policyType isLocal siteId siteName displayedName description id globalPolicy templateObject deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 // Need to add something for forwarding class -- these properties are not right at all
	cls = samModel.defineClass("sasqos.AccessIngressForwardingClass", "ManagedObject", "broadcastQueueId containingPolicyDisplayedName containingPolicyId deploymentState description displayedName forwardingClass globalPolicy id inDscp inPrecedence inRemark isGhost isLocal multicastQueueId name objectFullName outDscp outPrecedence outRemark policyType profile queueId selfAlarmed siteId siteName unknownQueueId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sasqos.Meter", "ManagedObject", "mCast cir pir cbs mbs cirAdaptation pirAdaptation rateMode containingPolicyDisplayedName containingPolicyId policyType isLocal siteId siteName displayedName description id globalPolicy templateObject deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("sasqos.PortAccessEgress", "ManagedObject", "scope egressRemark numberOfUnderlyingPolicyItems configurationAction configurationMode distributionMode policyType isLocal siteId siteName displayedName description id globalPolicy templateObject deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 // Need to add something for forwarding class -- these properties are not right at all
	cls = samModel.defineClass("sasqos.PortAccessEgressForwardingClass", "ManagedObject", "broadcastQueueId containingPolicyDisplayedName containingPolicyId deploymentState description displayedName forwardingClass globalPolicy id inDscp inPrecedence inRemark isGhost isLocal multicastQueueId name objectFullName outDscp outPrecedence outRemark policyType profile queueId selfAlarmed siteId siteName unknownQueueId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sasqos.PortAccessEgressQueue", "ManagedObject", "cirAdaptation cir pirAdaptation pir containingPolicyDisplayedName containingPolicyId policyType isLocal siteId siteName displayedName description id globalPolicy templateObject deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");



	cls = samModel.defineClass("equipment.BaseCard", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.ControlProcessor", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.DaughterCardSlot", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.FanTray", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.FlashMemory", "ManagedObject", ""); 
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.HwEnvironment", "ManagedObject", "siteId siteName slotId daughterCardSlotId containingParentName identifier shelfId hwIndex temperature temperatureInFahrenheit temperatureThreshold temperatureThresholdInFahrenheit temperatureThresholdCrossed deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.LEDPanel", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.ManagementPort", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.MediaAdaptor", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.PowerSupplyTray", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.ProcessorCard", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.PhysicalPort", "ManagedObject", "objectFullName accountingPolicyId administrativeState cardSlotId collectStats daughterCardSlotId networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable description displayedName encapType equipmentState isLinkUp lagMembershipId macAddress mode portName portId operationalState shelfId siteId siteName actualSpeed speed nodeId nodeName snmpPortId");   
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/

/*
function constructOtherClasses2(samModel) 
{

 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.Shelf", "ManagedObject", "objectFullName administrativeState deviceState displayedName equipmentState numberOfCardSlots operationalState shelfId siteId siteName shelfName shelfType");	
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("equipment.SwitchFabricProcessor", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("ethernetequipment.EthernetPortSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("ies.L3AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("lag.Interface", "ManagedObject", "objectFullName accountingPolicyId accountingPolicyName administrativeState collectStats displayedName description encapType equipmentState hwMacAddress isLinkUp isPrimaryLagMember lagId lagMembershipId name macAddress maxSpeed operationalState portName primaryLagMemberId primaryLagMemberName portId shelfId siteId siteName state snmpPortId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("l2fwd.AccessInterfaceStp", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/

/*
function constructOtherClasses3(samModel) 
{
	cls = samModel.defineClass("mirror.L2AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("mpls.DynamicLsp", "ManagedObject", "objectFullName administrativeState description destinationNodeMisconfigured displayedName destinationInterfaceId destinationInterfaceName destinationIpAddress egressInterfaceId egressInterfaceName egressInterfacePointer egressLabel fromCtp fromNodeId fromNodeName forwardingClasses ingressInterfaceId ingressInterfaceName ingressInterfacePointer ingressLabel isDefaultPath loadFactor operationalState numberOfPaths numberOfPrimaryPaths sourceNodeId sourceNodeMisconfigured toCtp toNodeId toNodeName");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("mpls.InSegment", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("mpls.Interface", "ManagedObject", "objectFullName administrativeState ctpPointer description displayedName encapType nodeId nodeName operationalState portId portName routerId routerName serviceId serviceType subscriberId terminatedObjectName terminatedPortClassName");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("mpls.Lsp", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("mpls.LspExtension", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("mpls.LspPath", "ManagedObject", "properties<BitMask> propertyInheritance<BitMask> adaptive<Boolean> adminGroupExclude<int> children-Set<children-set>");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("netw.PhysicalInterfaceCtp", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("rtr.ServiceInterface", "ManagedObject", "");	
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("rtr.StaticArp", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("rtr.VirtualInterfaceArpConfiguration", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("rtr.VirtualInterfaceIcmpConfiguration", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("rtr.VirtualInterfaceNtpConfiguration", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("rtr.VirtualRouterIpAddress", "ManagedObject", "");	
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("slope.QosPool", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/

/*
function constructOtherClasses4(samModel) 
{
	cls = samModel.defineClass("sonet.SiteSync", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonet.SyncCommitter", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonet.SyncReference", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("sonetequipment.SonetPortMonitorSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.SonetPortOverheadSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.SonetPortSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

  
//NOTE: All of the Channels use the same list of properties. The properties may need to be adjusted depending on the type of channel. Therefore, if specific Channel properties are needed, then they will need to be added.

	cls = samModel.defineClass("sonetequipment.Sts12Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Sts192Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Sts1Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Sts3Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Sts48Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("tdmequipment.DS1E1Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("tdmequipment.DS3E3Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.TributaryChannel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Tu3Channel", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.TributaryGroup", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sonetequipment.Tug3Group", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("tdmequipment.DS0ChannelGroup", "ManagedObject", "vtChannelPayloadTypesProvisioned operationalMRU framing payloadType scramble cardSlotId daughterCardSlotId physicalPortId physicalPortSnmpId portChannelType channelRelativeName displayedLocalChannelId parentDisplayedName isChannelizationCapable isCommonApsConfiguration isApsProtected nodeCardinality snmpPortId portId portCategory portClass specificType specificCardType description mode hasUserAssignedMac isl2UplinkMode macAddress hwMacAddress encapType holdTimeUp holdTimeDown upProtocols isLinkUp state previousState isTerminatable isConnectionTerminated hasConnections mtuValue operationalMTU speed actualSpeed accountingPolicyCapable accountingPolicyId accountingPolicyName accountingPolicyObjectPointer collectStats networkQueuePolicyName networkQueueObjectPointer networkQueuePolicyCapable portName numberOfPossibleChannels isPortChannelALeaf parentSnmpPortId currentNumberOfChannels intervalNumber mirrorStatus loadBalanceAlgorithm portSchedulerPolicyObjectPointer portEgrHsmdaSchedulerPolicy uniProfilePointer portIngrNamedPoolPlcy portEgrNamedPoolPlcy portIngrPoolPercentageRate portEgrPoolPercentageRate vlanAutoBind shelfId hwIndex displayedName siteId siteName manufacturer serialNumber manufacturerBoardNumber manufactureDate equipmentCategory hwName cleiCode equipmentState containingEquipmentState compositeEquipmentState operationalState administrativeState isEquipped baseMacAddress hardwareFailureReason olcState deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
   
	cls = samModel.defineClass("service.AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("svc.Service","ManagedObject","");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("svt.MeshSdpBinding","ManagedObject","actualPathMtu administrativeState application circuitMtu circuitTransport circuitType connectionId deploymentState domain egressFilterId egressFilterName egressFilterPointer egressFilterType egressIpFilterId egressLabel egressMacFilterId encapsulationType fromCtp fromNodeId fromNodeName highestIngressFc ingressFilterId ingressFilterName ingressFilterPointer ingressFilterType ingressIpFilterId ingressLabel ingressMacFilterId labelMismatch lightweightSdp macPinning mtuMismatch name oamEnabled objectFullName operationalEgressLabel operationalFlags operationalIngressLabel operationalState pathId pathMtu pathName pathPointer returnCircuitPointer returnPathId returnPathName returnPathPointer selfAlarmed serviceId serviceName serviceType shgName shgSitePointer signallingType subscriberId subscriberName svcComponentId toCtp toNodeId toNodeName totalBandwidthFactor tunnelAutoselectionReturnSpokeCircuitTunnelId tunnelAutoselectionReturnTunnelTransportPreference tunnelAutoselectionTunnelTransportPreference tunnelSelectionTerminationSiteId useDefaultVcTag vcId vcIdMismatch vcType vlanVcTag");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
// Need some properties for this one
	cls = samModel.defineClass("svt.MirrorSdpBinding","ManagedObject","actualPathMtu administrativeState application circuitMtu circuitTransport circuitType connectionId deploymentState domain egressFilterId egressFilterName egressFilterPointer egressFilterType egressIpFilterId egressLabel egressMacFilterId encapsulationType fromCtp fromNodeId fromNodeName highestIngressFc ingressFilterId ingressFilterName ingressFilterPointer ingressFilterType ingressIpFilterId ingressLabel ingressMacFilterId interfaceName interfacePointer labelMismatch lightweightSdp macPinning mtuMismatch name oamEnabled objectFullName operationalEgressLabel operationalFlags operationalIngressLabel operationalState pathId pathMtu pathName pathPointer redundantServiceId returnCircuitPointer returnPathId returnPathName returnPathPointer selfAlarmed serviceId serviceName serviceType shgName shgSitePointer signallingType spokeConnectorPointer subscriberId subscriberName svcComponentId toCtp toNodeId toNodeName totalBandwidthFactor tunnelAutoselectionReturnSpokeCircuitTunnelId tunnelAutoselectionReturnTunnelTransportPreference tunnelAutoselectionTunnelTransportPreference tunnelSelectionTerminationSiteId useDefaultVcTag vcId vcIdMismatch vcType vlanVcTag");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("svt.SpokeSdpBinding","ManagedObject","actualPathMtu administrativeState application circuitMtu circuitTransport circuitType connectionId deploymentState domain egressFilterId egressFilterName egressFilterPointer egressFilterType egressIpFilterId egressLabel egressMacFilterId encapsulationType fromCtp fromNodeId fromNodeName highestIngressFc ingressFilterId ingressFilterName ingressFilterPointer ingressFilterType ingressIpFilterId ingressLabel ingressMacFilterId interfaceName interfacePointer labelMismatch lightweightSdp macPinning mtuMismatch name oamEnabled objectFullName operationalEgressLabel operationalFlags operationalIngressLabel operationalState pathId pathMtu pathName pathPointer redundantServiceId returnCircuitPointer returnPathId returnPathName returnPathPointer selfAlarmed serviceId serviceName serviceType shgName shgSitePointer signallingType spokeConnectorPointer subscriberId subscriberName svcComponentId toCtp toNodeId toNodeName totalBandwidthFactor tunnelAutoselectionReturnSpokeCircuitTunnelId tunnelAutoselectionReturnTunnelTransportPreference tunnelAutoselectionTunnelTransportPreference tunnelSelectionTerminationSiteId useDefaultVcTag vcId vcIdMismatch vcType vlanVcTag");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("sw.IOCardSoftware", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("sw.ControlProcessorSoftware", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("tdmequipment.DS3E3ChannelSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("tdmequipment.DS3E3ChannelMDLSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	cls = samModel.defineClass("tdmequipment.DS3E3PortSpecifics", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("vpls.L2AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("vprn.L3AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("vll.L2AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("ipipe.L2AccessInterface", "ManagedObject", "objectFullName accountingOn accountingPolicyId accountingPolicyName administrativeState ctpPointer description displayedName encapType highestIngressFc ingressWeightedBandwidthRequirement nodeId nodeName operationalState portIdentifyingName portId portName routerName serviceId serviceName serviceType subscriberId subscriberName terminatedObjectName terminatedPortClassName ingressPolicyId ingressPolicyName ingressPolicyObjectPointer egressPolicyId egressPolicyName egressPolicyObjectPointer sasIngressPolicyId sasIngressPolicyName sasIngressPolicyObjectPointer outerEncapValue innerEncapValue");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/
/*
function constructOtherClasses5(samModel) 
{
	cls = samModel.defineClass("icmp.IcmpPing", "ManagedObject", "testTargetType originatingNode originatingVprnSite sourceIpAddressType sourceIpAddress targetIpAddressType targetIpAddress virtualRouterId rapid timeToLive pattern positionalPattern diffServField nextHopAddrType nextHopAddr egressIfIndex bypassRouting doNotFragment interfacePointer vprnAccessInterfacePointer rtrNetworkInterfacePointer dnsName packetSize packetsToSend packetInterval packetTimeout assurance maxHistoryRows packetFailureThreshold testFailureThreshold bit trapGenerationPolicy testedObject fromNodeId testType nmUser aggregatedWith testSuite testSuiteId testPolicyUsage testDefinition lastGeneratedTime testSuiteTestedEntity nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest neDeployedTest id displayedName globalId description administrativeState weight deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("atm.AtmPing", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("mpls.LspPing", "ManagedObject", "forwardingClass profile timeToLive testTargetType lsp lspPath mplsSite ldpPrefixType ldpPrefix ldpPrefixLen packetSize packetsToSend packetInterval packetTimeout assurance maxHistoryRows packetFailureThreshold testFailureThreshold trapGenerationPolicy /trapGenerationPolicy testedObject fromNodeId testType nmUser aggregatedWith testSuite testSuiteId testPolicyUsage testDefinition lastGeneratedTime testSuiteTestedEntity nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest neDeployedTest id displayedName globalId description administrativeState weight deploymentState objectFullName name selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("service.MacPing", "ManagedObject", "");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("svt.TunnelPing", "ManagedObject", "forwardingClass originatingTunnel profile returnNodeId returnTunnel assurance maxHistoryRows packetFailureThreshold packetInterval packetSize packetTimeout packetsToSend testFailureThreshold trapGenerationPolicy accountingFiles accountingPolicyObjectPointer aggregatedWith fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject administrativeState description displayedName failures globalId id lastRunResult runs weight actionMask deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("svt.VccvPing", "ManagedObject", "forwardingClass profile pseudowireId replyType sourceIpAddress sourceIpAddressType spokeSdpBinding targetIpAddress targetIpAddressType ttl actionMask deploymentState isFaultSquelched name objectFullName selfAlarmed administrativeState description displayedName failures globalId id lastRunResult runs weight accountingFiles accountingPolicyObjectPointer aggregatedWith fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject assurance maxHistoryRows packetFailureThreshold packetInterval packetSize packetTimeout packetsToSend testFailureThreshold trapGenerationPolicy");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("service.SitePing", "ManagedObject", "isMirrorSite originatingNode serviceId sitePointer targetIpAddress targetIpAddressType useLocalTunnel useRemoteTunnel assurance maxHistoryRows packetFailureThreshold packetInterval packetSize packetTimeout packetsToSend testFailureThreshold trapGenerationPolicy accountingFiles accountingPolicyObjectPointer aggregatedWith fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject administrativeState description displayedName failures globalId id lastRunResult runs weight actionMask deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>","result<List>");

	cls = samModel.defineClass("ppp.PppControlProtocol", "ManagedObject", "objectFullName controlProtocolType lastClearedTime restartCount shelfId snmpPortId state name");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("ppp.Interface", "ManagedObject", "objectFullName portName nodeId nodeName portId shelfId");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass("rtr.VirtualRouter", "ManagedObject", "autonomousSystemNumber bgpEnabled confederationAutonomousSystemNumber igmpEnabled isisEnabled ldpEnabled mldEnabled mplsEnabled msdpEnabled ospfEnabled ospfv3Enabled pimEnabled ripEnabled routingInstanceType rsvpEnabled routerId routerName routingInstancePointer displayedName siteId siteName domain administrativeState application connectionId operationalState actionMask deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
 cls = samModel.defineClass("equipment.CardSlot", "ManagedObject", "assignedChildType equippedChildType replaceableUnitMismatch slotId supportedChildTypes administrativeState baseMacAddress cleiCode compositeEquipmentState containingEquipmentState displayedName equipmentCategory equipmentState hardwareFailureReason hwIndex hwName isEquipped manufactureDate manufacturer manufacturerBoardNumber olcState operationalState serialNumber shelfId siteId siteName actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed shelfType");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
 cls = samModel.defineClass("ethernetoam.CfmLoopback", "ManagedObject", "continuousExec globalMA maintenanceAssociationId maintenanceDomainId mepId mepTargetMacAddr originatingMep originatingNode siteId assurance forwardingClass maxHistoryRows packetFailureThreshold packetInterval packetTimeout packetsToSend profile testFailureThreshold accountingFiles accountingPolicyObjectPointer aggregatedWith executionState fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser sas.NmThresholdEvent-Set suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject weight administrativeState description displayedName failures globalId id lastRunResult runs actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
 cls = samModel.defineClass("ethernetoam.CfmOneWayDelayTest", "ManagedObject", "continuousExec globalMA maintenanceAssociationId maintenanceDomainId mepId mepTargetMacAddr originatingMep originatingNode siteId assurance forwardingClass maxHistoryRows packetFailureThreshold packetInterval packetTimeout packetsToSend profile testFailureThreshold accountingFiles accountingPolicyObjectPointer aggregatedWith executionState fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser sas.NmThresholdEvent-Set suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject weight administrativeState description displayedName failures globalId id lastRunResult runs actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

 cls = samModel.defineClass("ethernetoam.CfmTwoWayDelayTest", "ManagedObject", "continuousExec globalMA maintenanceAssociationId maintenanceDomainId mepId mepTargetMacAddr originatingMep originatingNode siteId assurance forwardingClass maxHistoryRows packetFailureThreshold packetInterval packetTimeout packetsToSend profile testFailureThreshold accountingFiles accountingPolicyObjectPointer aggregatedWith executionState fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser sas.NmThresholdEvent-Set suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject weight administrativeState description displayedName failures globalId id lastRunResult runs actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
  cls = samModel.defineClass("ethernetoam.CfmEthTest", "ManagedObject", "continuousExec globalMA maintenanceAssociationId maintenanceDomainId mepId mepTargetMacAddr originatingMep originatingNode siteId assurance forwardingClass maxHistoryRows packetFailureThreshold packetInterval packetTimeout packetsToSend profile testFailureThreshold accountingFiles accountingPolicyObjectPointer aggregatedWith executionState fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser sas.NmThresholdEvent-Set suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject weight administrativeState description displayedName failures globalId id lastRunResult runs actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
 cls = samModel.defineClass("aosqos.Policy", "ManagedObject", "configurationAction configurationMode discoveryState distributionMode numberOfUnderlyingPolicyItems origin description displayedName globalPolicy id isLocal policyType siteId siteName templateObject actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
 cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
 
	cls = samModel.defineClass('mpls.Site', "ManagedObject", 'siteName siteId serviceId serviceType subscriberId routerId routerName routingInstancePointer displayedName domain administrativeState application connectionId operationalState actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed');
	cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

	cls = samModel.defineClass('svq.AggregationScheduler', "ManagedObject", 'aggregationSchedulerName currentEgressSchedulerName currentIngressSchedulerName customerMultiServiceSiteFrameBaseAccounting description egressAggRateLimit egressSchedulerName egressSchedulerObjectPointer equipmentDisplayedName equipmentId equipmentPointer ingressSchedulerName ingressSchedulerObjectPointer intendedEgressSchedulerName intendedIngressSchedulerName participation scope subscriberId subscriberName todSuitePointer displayedName siteId siteName domain administrativeState application connectionId operationalState actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed');
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

    cls = samModel.defineClass('vprn.ServiceAccessPoint', "ManagedObject", 'aaApplicationProfile aaGrpId aaPartId antiSpoofing callingStationId cpmProtEthCfmMonitorFlags description displayedName id innerEncapValue macMonitoring outerEncapValue portPointer sapSubType accountingOn accountingPolicyId accountingPolicyName accountingPolicyObjectPointer administrativeState aggregation aggregationSchedulerName aggregationSchedulerObjectPointer ccagSnmpPortId dIconX dIconY dependantOlcState displayedName dosProtection egressAggRateLimit egressAtmPolicyId egressFilterId egressFilterName egressFilterPointer egressFilterType egressFrameBaseAccounting egressIpFilterId egressIpv6FilterId egressIpv6FilterName egressIpv6FilterPointer egressMacFilterId egressPolicerPolicyPointer egressPolicyId egressPolicyName egressPolicyObjectPointer egressQinqMarkTopBitsOnly egressSchedulerName egressSchedulerObjectPointer hsmdaEgrQosPackByteOffOvrd hsmdaEgrQosWrrPlcyOvrd hsmdaEgrSecondaryShaper ingressAtmPolicyId ingressFilterId ingressFilterName ingressFilterPointer ingressFilterType ingressIpFilterId ingressIpv6FilterId ingressIpv6FilterName ingressIpv6FilterPointer ingressMacFilterId ingressMatchQinqDot1pBits ingressPolicerPolicyPointer ingressPolicyId ingressPolicyName ingressPolicyObjectPointer ingressSchedulerName ingressSchedulerObjectPointer innerEncapValue mirrorStatus olcState operationalFlags outerEncapValue rowStatus sapEgressStatsEnable sapEgressStatsPktsMode sapIngressCounterMode sapIngressStatsEnable scpPointer serviceId serviceIdString serviceName serviceType sharedQueueOn subscriberId subscriberName svcComponentId templateVersionPointer transitIpPolicyPointer portIdentifyingName portPointer compositeState operationalState resourceState underlyingResourceState actualMtu ctpPointer encapType isExclusiveTermination mtuMismatch portId portName provisionedMtu routerId routerName terminatedObjectId terminatedObjectName terminatedObjectPointer terminatedPortClassName terminatedPortCombinedEncapValue terminatedPortInnerEncapValue terminatedPortOuterEncapValue terminatedPortPointer terminationParticipationType application description displayedName domain nodeId nodeName actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed');
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");

    cls = samModel.defineClass('ies.ServiceAccessPoint', "ManagedObject", 'aaApplicationProfile aaGrpId aaPartId antiSpoofing callingStationId cpmProtEthCfmMonitorFlags description displayedName id innerEncapValue macMonitoring outerEncapValue portPointer sapSubType accountingOn accountingPolicyId accountingPolicyName accountingPolicyObjectPointer administrativeState aggregation aggregationSchedulerName aggregationSchedulerObjectPointer ccagSnmpPortId dIconX dIconY dependantOlcState displayedName dosProtection egressAggRateLimit egressAtmPolicyId egressFilterId egressFilterName egressFilterPointer egressFilterType egressFrameBaseAccounting egressIpFilterId egressIpv6FilterId egressIpv6FilterName egressIpv6FilterPointer egressMacFilterId egressPolicerPolicyPointer egressPolicyId egressPolicyName egressPolicyObjectPointer egressQinqMarkTopBitsOnly egressSchedulerName egressSchedulerObjectPointer hsmdaEgrQosPackByteOffOvrd hsmdaEgrQosWrrPlcyOvrd hsmdaEgrSecondaryShaper ingressAtmPolicyId ingressFilterId ingressFilterName ingressFilterPointer ingressFilterType ingressIpFilterId ingressIpv6FilterId ingressIpv6FilterName ingressIpv6FilterPointer ingressMacFilterId ingressMatchQinqDot1pBits ingressPolicerPolicyPointer ingressPolicyId ingressPolicyName ingressPolicyObjectPointer ingressSchedulerName ingressSchedulerObjectPointer innerEncapValue mirrorStatus olcState operationalFlags outerEncapValue rowStatus sapEgressStatsEnable sapEgressStatsPktsMode sapIngressCounterMode sapIngressStatsEnable scpPointer serviceId serviceIdString serviceName serviceType sharedQueueOn subscriberId subscriberName svcComponentId templateVersionPointer transitIpPolicyPointer portIdentifyingName portPointer compositeState operationalState resourceState underlyingResourceState actualMtu ctpPointer encapType isExclusiveTermination mtuMismatch portId portName provisionedMtu routerId routerName terminatedObjectId terminatedObjectName terminatedObjectPointer terminatedPortClassName terminatedPortCombinedEncapValue terminatedPortInnerEncapValue terminatedPortOuterEncapValue terminatedPortPointer terminationParticipationType application description displayedName domain nodeId nodeName actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed');
    cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("ethernetoam.CfmSingleEndedLossTest", "ManagedObject", "continuousExec globalMA maintenanceAssociationId maintenanceDomainId mepId mepTargetMacAddr originatingMep originatingNode siteId assurance forwardingClass maxHistoryRows packetFailureThreshold packetInterval packetTimeout packetsToSend profile testFailureThreshold accountingFiles accountingPolicyObjectPointer aggregatedWith executionState fromNodeId id lastGeneratedTime neDeployedTest nePersistent neSchedulable neSchedulableDeployedTest neSchedulableTest nmUser sas.NmThresholdEvent-Set suppressAccounting testDefinition testPolicyUsage testSuite testSuiteId testSuiteTestedEntity testType testedObject weight administrativeState description displayedName failures globalId id lastRunResult runs actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
	cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("ethernetoam.Mep", "ManagedObject", "administrativeState aisEnable aisInterval aisMegLevel aisPriority aisTxCount ccEnable ccmLtmPriority controlMep description direction dmrTxCount dualEndedLossClearThreshold dualEndedLossEnable dualEndedLossRaiseThreshold ethRingPathEndptPointer ethTestEnable ethTestPattern ethTestThreshold ethTunnelPathEndptPointer facilityIfIndex facilityType facilityVlanId faultPropagation fcltyFaultNotify globalCcTest id isY1731Capable lagPointer lbmNoTLVMdaNum lbrTxCountNoTLV lbrTxCountWithTLV lmrTxCount macAddress maintAssocName maintAssocNameType maintAssociationPointer maintDomainLevel maintDomainName maintDomainNameType maintenanceAssociationId maintenanceDomainId mcLagInactive mcLagPointer mepCcmOut mepDefects mepFngAlarmTime mepFngResetTime mepHighestPrDefect mepLbrIn mepLowestPrDefect mepTransmitLbmStatus mepTransmitLtmSeqNumber operationalMacAddress owdtThreshold portPointer routerInterfacePointer rxAis rxAisInterval sapOrBinding sapPointer sapPortId sapVlanId sdpBindingPathId sdpBindingPointer sdpBindingVcId serviceId serviceSitePointer serviceType siteId txAisOnPortDown type actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed");
	cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/
/*
function constructOtherClasses6(samModel) 
{
	//CFM TwoWay Destination
	cls = samModel.defineClass("epipe.Epipe", "ManagedObject", "bandwidthMethod cacProbableCause cacStatus cos0BW cos1BW cos2BW cos3BW cos4BW cos5BW cos6BW cos7BW defaultVcId encapsulationTypeIncompatible hasProblem inheritanceMask lastAuditTime lastCacTime lspPathBooking overrides rca.Problem-Set service.GneSite-Set svcConnectionType svcPathBooking tier topologyAutoCompletion transportPreference tunnelSelectionProfile useBwReservedPath administrativeState aggrOperationalState compositeSvcId compositeSvcPointer configuredNumberOfSites customerName description displayedName enableAppPerfReporting flowThruSvcPtrs globalServiceComments globalServiceName groupPointer id isSegmented isTunnelBeingUsed mpr.VlanPathInstance-Set mtuInconsistent numberOfCircuitsInconsistent numberOfConnector numberOfInterfacesInconsistent numberOfSegments numberOfSites numberOfSitesInconsistent olcState operationalFlags reportCustName sasEntityName service.CustomDCPGroup-Set service.SystemDCPGroup-Set service.TerminationPointPointer-Set serviceId serviceTypeInconsistent subscriberId subscriberPointer svcConnectionType svcPriority svcSegmentPointerList svcTunnelPtrs svcTunnelType templatePointer templateVersionPointer tier topologyMisconfigured actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed findDownstreamSdpBindings DeleteAllSystemDCPGroups getServiceSegments shutDown turnUp");
	cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
	
	cls = samModel.defineClass("vpls.Vpls", "ManagedObject", "bandwidthMethod bgpAdAdminStatus cacProbableCause cacStatus cos0BW cos1BW cos2BW cos3BW cos4BW cos5BW cos6BW cos7BW defaultMeshVcId displayedName fullyConnected hasProblem includeBSite includeISite inheritanceMask l2fwd.ServiceMacProtection-Set lastAuditTime lastCacTime lspPathBooking missSpokeConfiguration missingMeshSdpBinding packagePolicyPointer rca.Problem-Set service.GneSite-Set svcConnectionType tier topologyAutoCompletion topologyAutoCompletionType transportPreference tunnelSelectionProfile useBwReservedPath vplsId administrativeState aggrOperationalState compositeSvcId compositeSvcPointer configuredNumberOfSites customerName description displayedName enableAppPerfReporting flowThruSvcPtrs globalServiceComments globalServiceName groupPointer id isSegmented isTunnelBeingUsed mpr.VlanPathInstance-Set mtuInconsistent numberOfCircuitsInconsistent numberOfConnector numberOfInterfacesInconsistent numberOfSegments numberOfSites numberOfSitesInconsistent olcState operationalFlags reportCustName sasEntityName service.CustomDCPGroup-Set service.SystemDCPGroup-Set service.TerminationPointPointer-Set serviceId serviceTypeInconsistent subscriberId subscriberPointer svcConnectionType svcPriority svcSegmentPointerList svcTunnelPtrs svcTunnelType templatePointer templateVersionPointer tier topologyMisconfigured actionMask children-Set deploymentState isFaultSquelched name objectFullName selfAlarmed distributeServiceMacProtectionList findAssociatedEpipeSites findAssociatedISites DeleteAllSystemDCPGroups getServiceSegments shutDown turnUp");
	cls.addXMLClassMethod("findToFile","fullClassName filter<FilterHolder> resultFilter<ResultFilterHolder>" ,"result<List>");
}
*/

//03 April 2013: Used by equipment physical port and equipment channel
var mapSpeed = { "0":"Line Rate",
				 "1":"10 Mbps",
				 "2":"100 Mbps",
				 "3":"1 Gbps",
				 "4":"10 Gbps",
				 "5":"OC3",
				 "6":"OC12",
				 "7":"OC48",
				 "8":"OC192",
				 "9":"OC768",
				 "10":"56 Kbps",
		                 "11":"64 Kbps",
		                 "12":"Auto Speed",
		                 "13":"Max100",
		                 "14":"Max1000",
		                 "lineRate":"Line Rate",
				 "ethernet10":"10 Mbps",
				 "ethernet100":"100 Mbps",
				 "ethernet1000":"1 Gbps",
				 "ethernet10000":"10 Gbps",
				 "oc3":"OC3",
				 "oc12":"OC12",
				 "oc48":"OC48",
				 "oc192":"OC192",
				 "oc768":"OC768",
				 "speed56":"56 Kbps",
		                 "speed64":"64 Kbps",
		                 "autoSpeed":"Auto Speed",
		                 "speedmax100":"Max100",
		                 "speedmax1000":"Max1000"
};

function getSpeedString(sp)
{
	if(sp != undefined)
	{
		var spStr = mapSpeed[sp];
		if(spStr != undefined)
		{
			return spStr;
		}
	}
	
	return sp;
}
