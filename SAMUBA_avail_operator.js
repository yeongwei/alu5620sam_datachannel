// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

function addAggregatorsToOperator(operator, nameSpace, onResyncFunction) 
{	//operator.aggregators[n] = PvAggregator();
     operator.aggregators = [
         createPercentageAggregator(operator, nameSpace.MetricNames.Available, nameSpace, nameSpace.createStateFunction("Record", "isOn"), nameSpace.createStateFunction("Subelement", "isOn")),
         createPercentageAggregator(operator, nameSpace.MetricNames.Unavailable, nameSpace, nameSpace.createStateFunction("Record", "isOff"), nameSpace.createStateFunction("Subelement", "isOff")),
         createPercentageAggregator(operator, nameSpace.MetricNames.Unknown, nameSpace, nameSpace.createStateFunction("Record", "isUnknown"), nameSpace.createStateFunction("Subelement", "isUnknown")),
         createCountAggregator(operator, nameSpace.MetricNames.StateChangeCount, nameSpace, nameSpace.Record.bind("currentState"), nameSpace.Subelement.bind("currentState")) 
     ];
     
     /*
     operator.onResync(function() 
    		 { 
    	 		logP4Msg("on function mainOnResync ", "Debug", 'AVAILABILITY: Resync');
    	 		onResyncFunction.call();
    	 		
    	 		if (this.startOfPeriod) 
    	 			this.aggregators.iterate(function(eachAggregator)//PvAggre[0] 
    	 				{ 
    	 					logP4Msg("on function mainOnResync ", "Debug", 'AVAILABILITY: BEFORE initializeWithInventory');
    	 					eachAggregator.initializeWithInventory();
    	 				}); 
    	 	});
    *///2013 June 07: OPERATOR would not resync property as its initializeForInbandInventory
     /*
     operator.onResync(function(){
			logP4Msg("UBA", "Resync", "AVAILABILITY: Within MAIN");
			mainOnResync();	
			
			logP4Msg("UBA", "Resync", "AVAILABILITY: Iterate all PvAggregator");
			if (operator.startOfPeriod) 
				operator.aggregators.iterate(function(eachAggregator)//PvAggre[0] 
	 				{ 
	 					logP4Msg("on function mainOnResync ", "Debug", 'AVAILABILITY: BEFORE initializeWithInventory');
	 					eachAggregator.initializeWithInventory();
	 				}); 
		});
     */
     OPERATOR2.onResync(function(){
			logP4Msg("UBA", "Resync", "AVAILABILITY: Within WORKER");
			mainOnResync();
			
			logP4Msg("UBA", "Resync", "AVAILABILITY: Iterate all PvAggregator");
			if (operator.startOfPeriod) 
				operator.aggregators.iterate(function(eachAggregator)//PvAggre[0] 
	 				{ 
	 					logP4Msg("on function mainOnResync ", "Debug", 'AVAILABILITY: BEFORE initializeWithInventory');
	 					eachAggregator.initializeWithInventory();
	 				}); 
     });
     
}