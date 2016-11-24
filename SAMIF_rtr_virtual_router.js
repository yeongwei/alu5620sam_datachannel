// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_rtr_virtual_router_Name = {},
    rtr_virtual_router_Name = {
	"samAdministrativeState":"administrativeState",
	"samDeploymentState":"deploymentState",
	"samDisplayedName":"displayedName",
	"samName":"name",
	"samObjectFullName":"objectFullName",
	"samRouterId":"routerId",
	"samRouterName":"routerName",
	"samSiteId":"siteId",
	"samSiteName":"siteName"
 };

var SITENAME_LOOKUP;


for( var i in rtr_virtual_router_Name)
    {
	MasterPropertyMap[rtr_virtual_router_Name[i]] = i;
	ReverseMasterPropertyMap[rtr_virtual_router_Name[i]] = i;
	reverse_rtr_virtual_router_Name[rtr_virtual_router_Name[i]] = i;
    }

var vRtrMapFunctions = { "operationalState": getvRtrMappedPropString,
			 "administrativeState": getvRtrMappedPropString };

var mapvRtrOperationalState = { "0":"Unknown",
				"1":"Unknown",
				"2":"Up",
				"3":"Down",
				"4":"Transition"};

var mapvRtrAdministrativeState = { "0":"Unknown",
				   "1":"Noop",
				   "2":"Up",
				   "3":"Down" };

var mapForvRtrProp = {"operationalState": mapvRtrOperationalState, 
		      "administrativeState": mapvRtrAdministrativeState };

function getvRtrMappedPropString(objectName, propName, sp) {
    var spMap = mapForvRtrProp[propName];	
    logStatus("propName", propName);
    nilStatus("spMap", spMap);
    if (isDef(spMap)) {
	return(getMappedPropString(spMap, objectName, propName, sp));
    }
    else return;
}

function process_rtr_virtual_router(samObject, modelInterface)
{
    logP4Msg("process_rtr_virtual_router", "SAMIF", "entered process_rtr_virtual_router" );
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
    subelement.family = "5620_SAM_Virtual_Router" ;
    subelement.invariant = samObject.objectFullName;
    subelement.instance = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    if (isConfig("inv_uses_names") && isDef(mapSiteName[samObject.siteId])) {
	subelement.label = mapSiteName[samObject.siteId]+" "+samObject.objectFullName;
    }
    else {
	subelement.label = samObject.objectFullName;
    }

    subelement.addProperty("nmVendor", "Alcatel5620SAM");

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_Virtual_Router");

    logP4Msg("process_rtr_virtual_router", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_rtr_virtual_router", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_rtr_virtual_router", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_rtr_virtual_router", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in rtr_virtual_router_Name) 
	{
            if ( samObject[ rtr_virtual_router_Name[i] ] != undefined )
                {
		    subelement.addProperty( i.toString(), samObject[ rtr_virtual_router_Name[i] ].toString() );
                }    
	}

    //This is to support one RFE in 2.14.0.0 find2file pack
    
    if (!isDef(SITENAME_LOOKUP)){
    	SITENAME_LOOKUP = new Object();
    }
    
    if ( samObject.siteId != undefined && samObject.routerId != undefined){
        var key = samObject.siteId +"-"+ samObject.routerId;
        var siteName = SITENAME_LOOKUP[key];
        if (isUndef(siteName)){     	
        	SITENAME_LOOKUP[key] = samObject.siteName;
      	 }
   }
    
    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

    logP4Msg("process_rtr_virtual_router", "SAMIF", "exiting process_rtr_virtual_router" );

} 


