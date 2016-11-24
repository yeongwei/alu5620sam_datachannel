// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


var reverse_aosqos_policy_Name = {},
    aosqos_policy_Name = {
	"samDisplayedName":"displayedName",
	"samPolicyType":"policyType",
	"samSiteId":"siteId",
	"samSiteName":"siteName",
	"samObjectFullName":"objectFullName"
 };

var aosqosMapFunctions = { "deploymentState": getAosqosMappedPropString
		};

var mapAosqosDeploymentState = { "0":"deployed",
	                          "1":"pending",
          	                  "2":"failed (resource not available)",
         	                  "4":"failed (configuration)",
                                  "8":"failed (partial)",
                                  "16":"failed (internal error)",
                                  "64":"postponed" 
			};

var mapForAosqosProp = {"operationalState": mapAosqosDeploymentState
			};

function getAosqosMappedPropString(objectName, propName, sp) {
        var spMap = mapForAosqosProp[propName];
        if (isDef(spMap)) {
                return(getMappedPropString(spMap, objectName, propName, sp));
                }
        else return;
}


for( var i in aosqos_policy_Name)
    {
	MasterPropertyMap[aosqos_policy_Name[i]] = i;
	ReverseMasterPropertyMap[aosqos_policy_Name[i]] = i;
	reverse_aosqos_policy_Name[aosqos_policy_Name[i]] = i;
    }

function process_aosqos_policy(samObject, modelInterface)
{


	//Fix Certification bug with skip processing local policy siteId=0.0.0.0
	// var checkSiteId = samObject.siteId.toString();
	// if(checkSiteId == '0.0.0.0')
	// {
		// logP4Msg("process_aosqos_policy", "SAMIF", "site id =" + checkSiteId );
		// return;
	// }
	// else
	if (isDef(samObject.siteId) && (samObject.siteId != "0.0.0.0"))
	{
    logP4Msg("process_aosqos_policy", "SAMIF", "entered process_aosqos_policy" );
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
    subelement.family = "5620_SAM_Aosqos_Policy";
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
    subelement.addProperty("samFamilyName", "5620_SAM_Aosqos_Policy");

	
    logP4Msg("process_aosqos_policy", "SAMIF", "ObjectFullName: "+samObject.objectFullName);
    logP4Msg("process_aosqos_policy", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_aosqos_policy", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_aosqos_policy", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in aosqos_policy_Name) 
	{
            if ( samObject[ aosqos_policy_Name[i] ] != undefined )
                {
		    subelement.addProperty( i.toString(), samObject[ aosqos_policy_Name[i] ].toString() );
                }    
	}

    //subelement.timestamp = modelInterface.currentDate;
	subelement.element = element;
    //element.addSubelement(subelement);
    //possible_inline_commit(modelInterface);

    logP4Msg("process_aosqos_policy", "SAMIF", "exiting process_aosqos_policy" );
	}

} 


