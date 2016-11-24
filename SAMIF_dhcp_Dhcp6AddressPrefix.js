// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_dhcp_dhcp6AddressPrefix_Name = {},
dhcp_dhcp6AddressPrefix_Name =
{
	"samObjectFullName"      : "objectFullName",	
	"samNodeId"				 : "nodeId",
	"samRouterId"			 : "routerId",
	"samDisplayedName"		 : "displayName",
	"samLocalDhcpServerName" : "localDhcpServerName",
	"samAddress"			 : "address",
	"samAddressPoolName" 	 : "addressPoolName",
	"samAddressType"		 : "addressType",
	"samPrefixLength"		 : "prefixLength",
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId"
};

for( var i in dhcp_dhcp6AddressPrefix_Name)
{
	MasterPropertyMap[dhcp_dhcp6AddressPrefix_Name[i]] = i;
	ReverseMasterPropertyMap[dhcp_dhcp6AddressPrefix_Name[i]] = i;
	reverse_dhcp_dhcp6AddressPrefix_Name[dhcp_dhcp6AddressPrefix_Name[i]] = i;
}

function process_dhcp_dhcp6addressprefix(samObject, modelInterface, className)
{
	logP3Msg("process_dhcp_dhcp6addressprefix", "SAMIF"  , "entered process_dhcp_dhcp6addressprefix");
    var element;
    var subelement;
    var siteName;
    
	    //TELUS PMR Fix PMR 81712,035,649 : Upgrade SAM App Pack from 2.12.2.0 to 2.14.1.0 (SAMIF dump is keep crashing......) 
    // previously content of localDhcpServerName = <pool_name>
    // 			e.g localDhcpServerName = IPv6_LOCAL_DYN 
    // As siteName is not available for this class customer modified localDhcpServerName property to have device name into it
    // And customer now filtering on localDhcpServerName name to do the load balancing
    // New format <devicename>-<pool_name>
    // 			e.g.localDhcpServerName = BNBYBCHQRE10-IPv6_LOCAL_DYN 
    // But our property needs to be in synch with the existing one so we are extracting only <pool_name> from this modified property 
    // Implementation is as below
    // Start
    var localDhcpName = samObject.localDhcpServerName.toString();
    logP1Msg("process_dhcp_dhcp6addressprefix", "SAMIF",  "Valu of localDhcpName : " + localDhcpName );
    if (localDhcpName.indexOf("-") != -1){
    	logP1Msg("process_dhcp_dhcp6addressprefix", "SAMIF",  "Entered in Telus Fix" );
	    samObject.localDhcpServerName = localDhcpName.split("-")[1];
	    siteName = localDhcpName.split("-")[0];
    }
    //End
	
    
    //element = OPERATOR.elementNamedOrNew(samObject.siteId.toString());
    element = OPERATOR.elementNamedOrNew(samObject.nodeId.toString());
    element.name = samObject.nodeId.toString();
    element.state = true;
    element.origin = "SAM" ;
    element.collectorNumber = polled_stats_collector;
    //element.timestamp = PV.currentInputDescriptor.timestamp;
    
    var subName = samObject.nodeId + "_Router:" + samObject.routerId + "_DHCP6Server:" + samObject.localDhcpServerName + "_DHCPPool:" + samObject.addressPoolName + "_"+samObject.objectFullName;
    subelement = OPERATOR.subelementNamedOrNew(subName);
    subelement.name = subName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_DHCP6_Address";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
    
    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_DHCP6_Address");

    for( var i in dhcp_dhcp6AddressPrefix_Name) 
    {
    	if(i.toString() == "samSiteId" && samObject.nodeId != undefined){
			 subelement.addProperty("samSiteId", samObject.nodeId);
		 } else if(i.toString() == "samSiteName" && samObject.nodeId != undefined){
			 var key = samObject.nodeId +"-"+ samObject.routerId;
			 if ( siteName == undefined ){
				if( SITENAME_LOOKUP != undefined ){
					siteName = SITENAME_LOOKUP[key];
				 }
			 }
			 if (isDef(siteName)){
				 logP1Msg("process_dhcp_dhcp6addressprefix", "SAMIF",  "Value of siteName : "+ siteName);
				 subelement.addProperty("samSiteName", siteName);
			 }
		 }else if ( samObject[ dhcp_dhcp6AddressPrefix_Name[i] ] != undefined ){
    			 subelement.addProperty( i.toString(), samObject[ dhcp_dhcp6AddressPrefix_Name[i] ].toString() );
	    }
    }

    if (isConfig("inv_uses_names"))
    {
        subelement.label = siteName+"_DHCP6Server:"+samObject.localDhcpServerName+"_DHCPPool:"+samObject.addressPoolName+"_"+samObject.address;
    }
    else
    {
    	subelement.label = siteName+"_DHCP6Server:"+samObject.localDhcpServerName+"_DHCPPool:"+samObject.addressPoolName+"_"+samObject.address;
    }
    
    subelement.element = element;
//subelement.timestamp = modelInterface.currentDate;
//    element.addSubelement(subelement);
//    possible_inline_commit(modelInterface);
    
} 

function jms_delete_dhcp_dhcp6AddressPrefix(record)
{
    //var myId;
    //delete mapPhysicalPortSpeed[record];
    delete mapPhysicalPortSpeed[record.objectFullName];
    //turn_off_SE(objectFullName);
    turn_off_SE(record);
}

function jms_speed_update_dhcp_dhcp6AddressPrefix(objectName, propColl)
{
    var propName, propValue, propOldValue;
    //var myId = modelInterface.idForName(objectName);
	var subelement;

    subelement = LOOKUP.get(objectName);
    if(subelement == null)	
    {
    	logP5Msg("jms_simple_propChange_with_mapping", "LOOKUP", "Skipping 0 rid for --> "+ objectName);
    	return;
    }
    
    logP4Msg("jms_speed_update_dhcp_dhcp6AddressPrefix", "SAMIF", "object: "+objectName);	
    //logP4Msg("jms_speed_update_tdmequipment_DS1E1_PortSpecific", "SAMIF", "myId = "+myId);


	    for( i in propColl)
	    {
	        propName = propColl[i].attributeName;
    	    propValue = propColl[i].newvalue;
	        propOldValue = propColl[i].oldvalue;

	        if (propName == "speed")
	        {
	        	subelement.addProperty("samSpeed", getSpeedString(propValue));
                logP4Msg("jms_speed_update_dhcp_dhcp6AddressPrefix", "SAMIF", "samSpeed old value " + propOldValue);
                logP4Msg("jms_speed_update_dhcp_dhcp6AddressPrefix", "SAMIF", "samSpeed new value " + propValue);
	        }
        }
}

