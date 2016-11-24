// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_mpls_site_Name = {},
mpls_site_Name = {
    "samObjectFullName":"objectFullName",
    "samSiteId":"siteId",
    "samSiteName":"siteName",
    "samOperationalState":"operationalState",
    "samAdministrativeState":"administrativeState",
    "samRouterId":"routerId",
    "samServiceType":"serviceType"
 };


// The next bit is used to map the numerical status values received from JMS to text strings so they
// are consistent with the status values set during full dump.


var mplsSiteMapFunctions = { "operationalState": getMplsSiteMappedPropString,
				"administrativeState": getMplsSiteMappedPropString };

var mapMplsSiteOperationalState = { "1":"mplsUnknown",
				"2":"mplsUp",
				"3":"mplsDown",
				"4":"mplsTransition" };

var mapMplsSiteAdministrativeState = { "1":"mplsNotOperational",
				 "2":"mplsUp",
				 "3":"mplsDown" };

var mapForMplsSiteProp = {"operationalState": mapMplsSiteOperationalState, 
			"administrativeState": mapMplsSiteAdministrativeState };

function getMplsSiteMappedPropString(objectName, propName, sp) {
	var spMap = mapForMplsSiteProp[propName];	
	if (isDef(spMap)) {
		return(getMappedPropString(spMap, objectName, propName, sp));
		}
	else return;
}

// Thus ends the code used to map the status values


for( var i in mpls_site_Name)
{
	MasterPropertyMap[mpls_site_Name[i]] = i;
	ReverseMasterPropertyMap[mpls_site_Name[i]] = i;
	reverse_mpls_site_Name[mpls_site_Name[i]] = i;
}

function process_mpls_site(samObject, modelInterface)
{
    logP4Msg("mpls_site", "SAMIF", "entered process_mpls_site" );
    var element;
    var subelement;

	var _name = samObject.siteName+"-"+samObject.siteId.toString();
    //element = OPERATOR.elementNamedOrNew(samObject.siteId);
	element = OPERATOR.elementNamedOrNew(_name);
    element.state = true;
    element.name = _name;
    element.origin = "SAM";
    element.collectorNumber = polled_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name = samObject.objectFullName;

    subelement.state = true;
    subelement.origin = "SAM";
    subelement.family = "5620_SAM_MPLS_Site" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;
	
    if (isConfig("inv_uses_names")) {
	subelement.label = samObject.siteId.toString()+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_MPLS_Site");

    for( var i in mpls_site_Name) 
    {
            if ( samObject[mpls_site_Name[i] ] != undefined )
                {
                        subelement.addProperty( i.toString(), samObject[ mpls_site_Name[i] ].toString() );
                }    
    }

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

}


