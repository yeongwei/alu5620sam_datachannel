// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_ltemme_MmeServiceMemberMaf_Name = {},
ltemme_MmeServiceMemberMaf_Name =
{
	"samObjectFullName"      : "objectFullName",	
	"samServiceId"			 : "serviceId",
	"samServiceName"		 : "serviceName",
	"samSiteName"            : "siteName",
	"samSiteId"              : "siteId"
	 
};

for( var i in ltemme_MmeServiceMemberMaf_Name)
{
	MasterPropertyMap[ltemme_MmeServiceMemberMaf_Name[i]] = i;
	ReverseMasterPropertyMap[ltemme_MmeServiceMemberMaf_Name[i]] = i;
	reverse_ltemme_MmeServiceMemberMaf_Name[ltemme_MmeServiceMemberMaf_Name[i]] = i;
}

function ltemme_MmeServiceMemberMaf(samObject, modelInterface, className)
{
	logP4Msg("ltemme_MmeServiceMemberMaf", "SAMIF", "entered ltemme_MmeServiceMemberMaf" );
	
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
    subelement.family = "5620_SAM_MME";
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
    subelement.addProperty("samFamilyName", "5620_SAM_MME");

    for( var i in ltemme_MmeServiceMemberMaf_Name) 
    {
    	if ( samObject[ ltemme_MmeServiceMemberMaf_Name[i] ] != undefined )
        {
                subelement.addProperty( i.toString(), samObject[ ltemme_MmeServiceMemberMaf_Name[i] ].toString() );
                logP4Msg("ltemme_MmeServiceMemberMaf", "addProperty", "property: " + i.toString() +" value: "+ samObject[ ltemme_MmeServiceMemberMaf_Name[i] ].toString() );
	    }
    }

    subelement.element = element;
    
} 

function jms_delete_ltemme_MmeServiceMemberMaf(record)
{
    turn_off_SE(record);
}
