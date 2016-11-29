//Licensed Materials - Property of IBM
//5724-W86, 5724-X63
//Copyright IBM Corporation 2013, 2015. All Rights Reserved.
//US Government Users Restricted Rights- Use, duplication or disclosure
//restricted by GSA ADP Schedule Contract with IBM Corp.

//Alcatel-Lucent 5620 SAM Pack

var reverse_nat_natpool_Name = {};
nat_natpool_Name = {
	"samObjectFullName":"objectFullName",
	"samAdministrativeState":"adminState",
	"samDescription":"description",
	"samDisplayedName":"displayedName",
	"samMode":"mode",
	"samNatPoolType":"natPoolType",
	"samOperationalMode":"operationalMode",
	"samRouterId":"routerId",
	"samRouterName":"routerName",
	"samName":"name",
	"samPortForwardingDynBlockReservation":"portForwardingDynBlockReservation",
	"samPortFwdRangeEnd":"portFwdRangeEnd",
	"samPortReservationType":"portReservationType",
	"samPortReservationValue":"portReservationValue"
};    

for( var i in nat_natpool_Name)
{
	MasterPropertyMap[nat_natpool_Name[i]] = i;
	ReverseMasterPropertyMap[nat_natpool_Name[i]] = i;
	reverse_nat_natpool_Name[nat_natpool_Name[i]] = i;
}

function nat_natpool(samObject, modelInterface) {
	logP4Msg("nat_natpool", "SAMIF_nat_natpool", "Entering");
	
	var element;
	var subelement;
	var monobj = samObject.objectFullName;
	var siteIdExp	= new RegExp('(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)');
	var value = siteIdExp.exec(monobj);
	var siteId = value[0];
	
	element = OPERATOR.elementNamedOrNew("5620_SAM_NATPool_Node_"+siteId);
	element.state = true;
	element.origin = "SAM" ;
	element.collectorNumber = polled_stats_collector;

	subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);

	subelement.name = samObject.objectFullName;
	subelement.state = true;
	subelement.origin = "SAM";
	subelement.family = "5620_SAM_NATPool" ;
	subelement.invariant = samObject.objectFullName;
	subelement.instance = samObject.objectFullName;

	logP3Msg("nat_natpool", "SAMIF_nat_natpool", "Subelement created: " + subelement);
	
	if (isConfig("inv_uses_names")) {
		subelement.label = siteId+" "+samObject.objectFullName;
	} else {
		subelement.label = samObject.objectFullName;
	}

	subelement.addProperty("nmVendor", "Alcatel5620SAM");
	subelement.addProperty("samSiteId", siteId);
	subelement.addProperty("samFamilyName", "5620_SAM_NATPool");

	for (var i in nat_natpool_Name) { 
		if (samObject[nat_natpool_Name[i]] != undefined) {
			subelement.addProperty( i.toString(), samObject[ nat_natpool_Name[i] ].toString() );
		}    
	}
			
	subelement.element = element;
	logP4Msg("nat_natpool", "SAMIF_nat_natpool", "Exiting");
}
