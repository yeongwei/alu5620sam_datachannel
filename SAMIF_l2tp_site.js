//Licensed Materials - Property of IBM
//5724-W86, 5724-X63
//Copyright IBM Corporation 2013, 2015. All Rights Reserved.
//US Government Users Restricted Rights- Use, duplication or disclosure
//restricted by GSA ADP Schedule Contract with IBM Corp.

//Alcatel-Lucent 5620 SAM Pack

var reverse_l2tp_site_Name = {};
l2tp_site_Name = {
	"samObjectFullName":"objectFullName",
	"samAdministrativeState":"administrativeState",
	"samDisplayedName":"displayedName",
	"samServiceId":"serviceId",
	"samServiceType":"serviceType",
	"samSubscriberId":"subscriberId",
	"samSiteId":"siteId",
	"samSiteName":"siteName",
	"samRouterId":"routerId",
	"samRouterName":"routerName",
	"samOperationalState":"operationalState",
	"samLocalAddress":"localAddress",
	"samLocalAddressType":"localAddressType",
	"samLocalName":"localName"
};    

for( var i in l2tp_site_Name)
{
	MasterPropertyMap[l2tp_site_Name[i]] = i;
	ReverseMasterPropertyMap[l2tp_site_Name[i]] = i;
	reverse_l2tp_site_Name[l2tp_site_Name[i]] = i;
}

function l2tp_site(samObject, modelInterface)
{
	logP4Msg("l2tp_site", "SAMIF", "entered l2tp_site" );
	var element;
	var subelement;

	element = OPERATOR.elementNamedOrNew(samObject.siteId);
	element.state = true;
	element.name = samObject.siteId.toString();
	element.origin = "SAM" ;
	element.collectorNumber = polled_stats_collector;

	subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

	subelement.name = samObject.objectFullName;
	subelement.state = true;
	subelement.origin = "SAM";
	subelement.family = "5620_SAM_L2TP" ;
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
	//logP4Msg("l2tp_site", "SAMIF", "created element and subelement :"+subelement );
	subelement.addProperty("nmVendor", "Alcatel5620SAM");

	//This property added for TCR enablement, it will be use for Cognos resource grouping
	subelement.addProperty("samFamilyName", "5620_SAM_L2TP");

	for( var i in l2tp_site_Name) 
	{
		if ( samObject[ l2tp_site_Name[i] ] != undefined )
		{
			subelement.addProperty( i.toString(), samObject[ l2tp_site_Name[i] ].toString() );
		}    
	}

	//subelement.timestamp = modelInterface.currentDate;
	subelement.element = element;
	//element.addSubelement(subelement);
	//possible_inline_commit(modelInterface);
logP4Msg("l2tp_site", "SAMIF", "Exiting l2tp_site" );
}//

