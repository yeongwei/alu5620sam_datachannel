// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

var reverse_svq_aggregation_schedular_name = {},
svq_aggregation_schedular_name =
{
    'samAdministrativeState'    : 'administrativeState',
    'samOperationalState'       : 'operationalState',
    'samEquipmentId'            : 'equipmentId',
    'samEquipmentDisplayedName' : 'equipmentDisplayedName',
    'samScope'                  : 'scope',
	"samSiteId"                 : "siteId",
	"samSiteName"               : "siteName",
	"samObjectFullName"         : "objectFullName"
 };

var svq_aggregation_schedular_map_functions =
{
    "administrativeState" : get_svq_aggregation_schedular_mapped_prop_string,
    "operationalState"    : get_svq_aggregation_schedular_mapped_prop_string,
    "scope"               : get_svq_aggregation_schedular_mapped_prop_string
};

var map_svq_aggregation_schedular_operational_state =
{
    '0' : 'Unknown'
};
var map_svq_aggregation_schedular_administrative_state =
{
    "0" : "Unknown"
};
var map_svq_aggregation_schedular_scope =
{
    "1" : "port",
    "2" : "card"
};

var map_for_svq_aggregation_schedular_prop =
{
    'operationalState'    : map_svq_aggregation_schedular_operational_state,
    'administrativeState' : map_svq_aggregation_schedular_administrative_state,
    'scope'               : map_svq_aggregation_schedular_scope
};

function get_svq_aggregation_schedular_mapped_prop_string(objectname, propname, sp)
{
    var spmap = map_for_svq_aggregation_schedular_prop[propname];
    if (isDef(spmap))
    {
        return(getMappedPropString(spmap, objectname, propname, sp));
    }
    else return;
}


for( var i in svq_aggregation_schedular_name)
{
	MasterPropertyMap[svq_aggregation_schedular_name[i]] = i;
	ReverseMasterPropertyMap[svq_aggregation_schedular_name[i]] = i;
	reverse_svq_aggregation_schedular_name[svq_aggregation_schedular_name[i]] = i;
}

function process_svq_aggregation_schedular(samObject, modelinterface)
{
    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "entered process_svq_aggregation_schedular" );

    if (samObject.scope != 'port')
    {
        logP4Msg("process_svq_aggregation_schedular", "SAMIF", "Skip inventory for scope " + samObject.scope );
        return;
    }

    var element;	var subelement;

    var _name = '5620SAM_MSS_' + samObject.siteName + '-' + samObject.siteId.toString();
    //element 				= OPERATOR.elementNamedOrNew(samObject.siteId);
    element 				= OPERATOR.elementNamedOrNew(_name);
    element.state           = true;
    element.name            = _name;
    element.origin          = "SAM" ;
    element.collectorNumber = accounting_stats_collector;

    subelement = OPERATOR.subelementNamedOrNew(samObject.objectFullName);
    subelement.name      = samObject.objectFullName;
    subelement.state     = true;
    subelement.origin    = "SAM";
    subelement.family    = "5620_SAM_MSS";
    subelement.invariant = samObject.objectFullName;
    subelement.instance  = samObject.objectFullName;
	//subelement.timestamp = samObject.timestamp;

    var sub_element_label = samObject.objectFullName;
    if (isConfig("inv_uses_names"))
    {
        sub_element_label.replace(samObject.siteId, samObject.siteName+'-'+samObject.siteId);
    }
	subelement.label = sub_element_label;

    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "ObjectFullName: ["+samObject.objectFullName+"]");
    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "Label: "+subelement.label);
    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "Name: "+subelement.name);
    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "Invariant: "+subelement.invariant);

    for( var i in svq_aggregation_schedular_name) 
	{
        if ( samObject[ svq_aggregation_schedular_name[i] ] != undefined )
        {
		    subelement.addProperty( i.toString(), samObject[ svq_aggregation_schedular_name[i] ].toString() );
        }    
	}

    subelement.addProperty("nmVendor", "Alcatel5620SAM");
    subelement.addProperty("samMSSCompleteServiceMapId", 'mss-'+samObject.siteName+'-'+samObject.siteId+'-'+samObject.equipmentDisplayedName);

    //This property added for TCR enablement, it will be use for Cognos resource grouping
    subelement.addProperty("samFamilyName", "5620_SAM_MSS");

    //subelement.timestamp = modelInterface.currentDate;

    subelement.element = element;
    //    element.addSubelement(subelement);
    //    possible_inline_commit(modelInterface);

    logP4Msg("process_svq_aggregation_schedular", "SAMIF", "exiting process_svq_aggregation_schedular" );
} 

function enable_or_disable_aggregation_scheduler_base_on_scope(objectName, propColl) 
{
	var resource_id = modelInterface.idForName(objectName);

    if (resource_id <= 0)
    {
    	logP4Msg("enable or disable aggretaion scheduler", "SAMIF", " skipping for " + objectName + " due to " + resource_id + " not found." );
        return;
    }

    var currentObject = modelInterface.Subelement();
    currentObject.id  = resource_id;

    logP4Msg("enable or disable aggretaion scheduler", "SAMIF", " processing " + objectName + " with id " + resource_id);

    for (var i in propColl)
    {
        var property_name = propColl[i].attributeName;
        logP5Msg("enable or disable aggretaion scheduler", "SAMIF", " found property " + property_name);
        
        if (property_name != 'scope')
        {
            continue;
        }

        var property_value = propColl[i].newvalue.toLowerCase();
        logP4Msg("enable or disable aggretaion scheduler", "SAMIF", " processing property scope with value" + property_value);

        if (property_value == 2 || property_value == 'card')
        {
            currentObject.state = false;
            logP4Msg("enable or disable aggretaion scheduler", "SAMIF", " turn off " + objectName);
        }
        else if (property_value == 1 || property_value == 'port')
        {
            currentObject.state = true;
            logP4Msg("enable or disable aggretaion scheduler", "SAMIF", " turn on " + objectName);
        }

        currentObject.commit();
        return;
    }
}

