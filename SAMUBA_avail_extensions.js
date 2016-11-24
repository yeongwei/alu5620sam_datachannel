// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

Base = new Object();
Base.clone=function() {
    var creator=function() { this.constructor = arguments.callee;  };
    creator.prototype=this;
    var result = new creator();
    return result;
};

Base.mixIn=function(definitions) {
    for (var each in definitions) if ( definitions.hasOwnProperty(each) ) {
        this[each] = definitions[each];
    }
    return this;
};

Base.bind=function(property) {
    var self=this;
    var func = self[property];
    if (!func || func.constructor != Function) throw "No function at " + property;
    return function() { return func.apply(self, arguments); };
};

AbstractNameSpace = Base.clone().mixIn({
    createStateFunction: function(typeName, functionName) {
        var self=this;
        var type=self[typeName];
        var check=self[functionName];
        return function(object) {
            return check.call(self,type.currentState(object));
        };
    },
    isUnknown: function(state) {
        return !this.isOff(state) && !this.isOn(state);
    },
    MetricNames: Base.clone().mixIn({
        StateChangeCount: "AP~Generic~Universal~Other~State Transitions",	//2648
        Available: "AP~Generic~Universal~Availability~Availability (percent)",	//2203
        Unavailable: "AP~Generic~Universal~Availability~Unavailable (percent)",	//2643
        Unknown: "AP~Generic~Universal~Availability~Availability Unknown (percent)"	//63010
    }),
    Subelement: Base.clone().mixIn({
        currentState: function(subelement) {
            return subelement.propertyNamed("samOperationalState");//portIn / portOut
        }
    }),
    Record: Base.clone().mixIn({
        currentState: function(record) {
            return record.operationalState;
        }
    })
});

AccessInterface = AbstractNameSpace.clone().mixIn({
    name: "ACCESS_INTERFACE",
    Subelement: AbstractNameSpace.Subelement.clone().mixIn({
        family: "5620_SAM_ServiceAccessInterface"
    }),
    convertOperationalState: function(name) {
        return getServiceMappedPropString(null, "operationalState", name);
    },
    convertAdminState: function(name) {
        return getServiceMappedPropString(null, "administrativeState", name);
    },
    isOn: function(state) {
        return "serviceUp" == state;
    },
    isOff: function(state) {
        return "serviceDown" == state || "serviceAdminDown" == state || "servicIesIfAdminDown" == state;
    }
});

PhysicalPort = AbstractNameSpace.clone().mixIn({
    name: "PHYSICAL_PORT",
    Subelement: AbstractNameSpace.Subelement.clone().mixIn({
        family: "5620_SAM_PhysicalPort"
    }),
    convertOperationalState: function(name) {
        return getPortMappedPropString(null, "operationalState", name);
    },
    convertAdminState: function(name) {
        return getPortMappedPropString(null, "administrativeState", name);
    },
    isOn: function(state) {
        return "portInService" == state;
    },
    isOff: function(state) {
        return "portOutOfService" == state;
    }
});

var AVAIL_NAME_SPACES=new Object();
AVAIL_NAME_SPACES[AccessInterface.name]=AccessInterface;
AVAIL_NAME_SPACES[PhysicalPort.name]=PhysicalPort;