// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_lte_S1uPeer_Name = {},
lte_S1uPeer_Name =
{
	"samObjectFullName"      : "objectFullName",
	"samEpcId"				 : "epcId",
	"samVirtualRouterId"	 : "virtualRouterId",
	"samPeerIPAddress"		 : "peerIpAddress",
	"samReferencePointSiteId": "referencePointSiteId",
//		"samSiteName"            : "siteName",
	"samSiteId"              : "siteId"

};

for( var i in lte_S1uPeer_Name)
{
	MasterPropertyMap[lte_S1uPeer_Name[i]] = i;
	ReverseMasterPropertyMap[lte_S1uPeer_Name[i]] = i;
	reverse_lte_S1uPeer_Name[lte_S1uPeer_Name[i]] = i;
}

function lte_S1uPeer(samObject, modelInterface, className)
{
	logP4Msg("lte_S1uPeer", "SAMIF", "entered lte_S1uPeer" );
	
	//	Extract siteId from objectFullName
	//	Example :
	//		<objectFullName>network:35.227.229.109:epc-1:eps-peer-1-10.10.1.75-2123-refPtName-default</objectFullName> 
	//	Where :
	//		samSiteId = 35.227.229.109
	
	//var siteIdExp=new RegExp('network\\:(\\d+\\.\\d+\\.\\d+\\.\\d+)');
	var objectFullName = samObject.objectFullName.toString();
	samObject.siteId = objectFullName.split(":")[1];
	//samObject.siteId = siteIdExp.exec(objectFullName)[1];
	logP4Msg("SAMIF", " Site ID", "  Extracted site ID value: " + samObject.siteId );
	
    var element;
    var subelement;

	element = OPERATOR.elementNamedOrNew(samObject.siteId);
    element.name = samObject.siteId;
    element.state = true;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;
    
    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;
    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_S1UPeer";
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
    

    if (isConfig("inv_uses_names"))
    {
        subelement.label = samObject.siteName+" "+samObject.objectFullName;
    }
    else
    {
        subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_S1UPeer");

    for( var i in lte_S1uPeer_Name) 
    {
    	if ( samObject[ lte_S1uPeer_Name[i] ] != undefined )
        {
                subelement.addProperty( i.toString(), samObject[ lte_S1uPeer_Name[i] ].toString() );
                logP4Msg("lte_S1uPeer", "addProperty", "property: " + i.toString() +" value: "+ samObject[ lte_S1uPeer_Name[i] ].toString() );
	    }
    }

    subelement.element = element;
    
} 

function jms_delete_lte_S1uPeer(record)
{
    turn_off_SE(record);
}
