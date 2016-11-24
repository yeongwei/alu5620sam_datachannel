// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

function createBaseAggregator(name, rootOperator, nameSpace) {
     var result = rootOperator.Aggregator();
     //rootOperator.connectPushPushClient(result);
     result.bePersistent();
     result.setPeriodDuration(app_config_value("FILE_PERIOD"));
     result.metricName = name;
     result.name = name;
     result.keyFunction=function(record) {
         var key = record.name;
         var subelement = LOOKUP.get(record.name);
         if (subelement != null) {
             key = subelement.name;
         }
         return key;
     };
     result.initializeFunction=function(record) {
         var state = new Object();
         if (record != null) state.subelementName = this.keyFunction(record);
         this.initializeState(state);
         return state;
     };
     result.closePeriodFunction=function(state) {
          this.commitState(state);
          this.generateMetric(state.subelementName, state.value);
          this.resetState(state);
     };
     result.initializeStateFor=function(state, subelement) {};
     result.commitState=function(state) {};
     result.resetState=function(state) {
         this.initializeState(state);
         this.initializeStateFor(state, null);
     };
     result.generateMetric=function(subelementName, value) {
         var metric = rootOperator.FloatMetric();
         metric.name = this.metricName;
         metric.resource = rootOperator.subelementNamed(subelementName);
         metric.timestamp = this.periodStart;
         metric.value = value;
         if (null == metric.resource) {
             // logP5Msg("availability_generate_metric", "SAMUBA", "INVALID_METRIC: No resource named: " + subelementName); 
             return;
         }
         rootOperator.addMetric(metric);
     };
     result.initializeWithInventory=function() {
          var self=this;
          rootOperator.allSubelements.iterate(function(subelement) {
		  //nilStatus("availability init subelement", subelement);
                if (nameSpace.Subelement.family == subelement.family) {
                    var state;
		    //		    logStatus("availability init name", subelement.name);
		    state = self.getStateAt(subelement.name);
                    if (null == state.subelementName) {
                        state.subelementName=subelement.name;
                    }
                    self.initializeStateFor(state, subelement);
                }
          });
     };
     return result;
}

function createCountAggregator(rootOperator, metricName, nameSpace, recordStateFunction, subelementStateFunction) {
    var result;

    result = createBaseAggregator(metricName, rootOperator, nameSpace);
    result.calculateFunction=function(key, state, record) {
        var newState = recordStateFunction(record);
        if (state.current != newState) {
            state.value++;
        }
        state.current=newState;
    };
     result.initializeState=function(state) {
          state.value=0;
     };
     result.initializeStateFor=function(state, subelement) {
         if (null != subelement) {
             state.current=subelementStateFunction(subelement);
         }
     };
     return result;
}

function createPercentageAggregator(rootOperator, metricName, nameSpace, recordStateFunction, subelementStateFunction) {
    var result;

     result = createBaseAggregator(metricName, rootOperator, nameSpace);
     result.calculateFunction=function(key, state, record) {
          var newIsState = recordStateFunction(record);
          if (newIsState) {
              if (!state.isState) {
                  state.begin = record.timestamp;
              }
          } else {
              if (state.isState) {
            	  var duration = record.timestamp - (state.begin == null ? this.periodStart : state.begin);
                  state.duration += duration;
              }
          }
          state.isState=newIsState;
     };
     result.commitState=function(state) {
          if (state.isState) {
              state.duration += this.startOfNextPeriod - (state.begin == null ? this.periodStart : state.begin);
        	  state.begin=this.startOfNextPeriod;
          }
          if (null == state.duration || 0 == state.duration) {
              state.value=0;
          } else {
              state.value=(state.duration / this.periodDuration) * 100;
          }
     };
     result.initializeState=function(state) {
          state.duration=0;
     };
     result.initializeStateFor=function(state, subelement) {
         if (null != subelement) {
              state.isState=subelementStateFunction(subelement);
         }
         
         if (state.isState) {
             state.begin=self.periodStart;
         }
     };
     return result;
}