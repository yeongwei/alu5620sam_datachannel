// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2005, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

//
//          A p p L o g g e r
//
//.....................................................................................
//
//  AppLogger is meant to provide a minimal level of control over the log
//  messages used for debugging by the App Pack group.
//
//  There are 2 functions provided:
//
//  logMsg(logFunction,logComponent,logMessage)
//
//     Which is meant as a direct replacement for the SmallTalk provided PV.Logger.logInfo
//     It's use is discouraged, because it does not have any level information, and therefore 
//     can only be turned on and off.
//
//  logMessage(logLevel, logComponent, logFunction, logMess)
//
//     This is the preferred logging function for App Packs.
//     The arguments are presented in a different order from
//     the SmallTalk version, but are more hierarchial.
//
//      logLevel - number between 0 and 10.  The higher the number
//                       the less important the message is.
//      logComponet - the componet such as SAMIF or CWMUBA
//      logFunction - the name of the function where the message originates.
//
//     Note: In the future it might be possible to control logging at the function level, so
//     consistent use of this parameter is strongy encouraged.
//						
//     logMess - the text of the message to be displated.
//
//
//.......................................................................................
//
// Control of logging is accomplished through the dc.cfg with the following 2 settings.
//
//	PV.configuration.APP.LOGGING  --> either the string "true||TRUE" or the string "false"
//  	PV.configuration.APP.LEVEL -----> a number between 0 and 10
//
//  example from the SAM dc.cfg
//
//  	UBA.2.199.UK.APP.LOGGING=true
//  	UBA.2.199.UK.APP.LEVEL=4
//
//  Note: if LOGGING=false, then the LEVEL parameter has no effect
//
//


var AppLogging     = 'false';
var AppLevel       = 0;
var APP_LOG_LEVEL  = 0

if(PV.configuration != undefined)
{
	if(PV.configuration.APP != undefined)
	{
		if(PV.configuration.APP.LOGGING != undefined)
		{
			AppLogging = PV.configuration.APP.LOGGING;
		} else
		{
			PV.Logger.logInfo("AppLogger", "All",  "APP.LOGGING not defined in dc.cfg for this component");
		}
		if(PV.configuration.APP.LEVEL != undefined)
		{
			AppLevel      = 0+PV.configuration.APP.LEVEL;
            APP_LOG_LEVEL = PV.configuration.APP.LEVEL;
		} else
		{
			PV.Logger.logInfo("AppLogger", "All",  "APP.LEVEL not defined in dc.cfg for this component");
		}
	} else 
		{
			PV.Logger.logInfo("AppLogger", "All",  "APP not defined in dc.cfg for this component");
		}
} else
{
	PV.Logger.logInfo("AppLogger", "All",  "PV.configuration is not defined in dc.cfg for this component");
}
			
if(AppLevel == undefined)
{
	AppLevel = 0;
}
	
if(AppLogging == undefined)
{
	AppLogging = 'false';
}

function logMsg(logFunction,logComponent,logMess)
{
	if(AppLogging == 'true' || AppLogging == 'TRUE')
	{
		PV.Logger.logInfo(logFunction, logComponent,  logMess);
	}
}

function logMessage(logLevel, logComponent, logFunction, logMess)
{
	if(AppLogging == 'true' || AppLogging == 'TRUE')
	{
		if(AppLevel >= logLevel)
		{
			PV.Logger.logInfo(logFunction, logComponent,  logMess);
		}
	}
}

function logP0Msg(logFunction,logComponent,logMess)
{
	logMessage(0, logComponent, logFunction, logMess);
}

function logP1Msg(logFunction,logComponent,logMess)
{
	logMessage(1, logComponent, logFunction, logMess);
}

function logP2Msg(logFunction,logComponent,logMess)
{
	logMessage(2, logComponent, logFunction, logMess);
}

function logP3Msg(logFunction,logComponent,logMess)
{
	logMessage(3, logComponent, logFunction, logMess);
}

function logP4Msg(logFunction,logComponent,logMess)
{
	logMessage(4, logComponent, logFunction, logMess);
}

function logP5Msg(logFunction,logComponent,logMess)
{
	logMessage(5, logComponent, logFunction, logMess);
}

function logP6Msg(logFunction,logComponent,logMess)
{
	logMessage(6, logComponent, logFunction, logMess);
}

function logP7Msg(logFunction,logComponent,logMess)
{
	logMessage(7, logComponent, logFunction, logMess);
}

function logP8Msg(logFunction,logComponent,logMess)
{
	logMessage(8, logComponent, logFunction, logMess);
}

function logP9Msg(logFunction,logComponent,logMess)
{
	logMessage(9, logComponent, logFunction, logMess);
}

function logP10Msg(logFunction,logComponent,logMess)
{
	logMessage(10, logComponent, logFunction, logMess);
}

function enable_log_base_on_level(log_level)
{
    if (APP_LOG_LEVEL >= log_level)
    {
        return true;
    }

    return false;
}

PV.Logger.logInfo("AppLogger", "All",  "AppLogging = "+AppLogging);
PV.Logger.logInfo("AppLogger", "All",  "AppLevel = "+AppLevel);
logMsg("AppLogger", "All", "Test Message");
logMessage(0, "All", "AppLoggerTest","Test Level 0 Message");
logMessage(1, "All", "AppLoggerTest","Test Level 1 Message");
logMessage(2, "All", "AppLoggerTest","Test Level 2 Message");
logMessage(3, "All", "AppLoggerTest","Test Level 3 Message");
logMessage(4, "All", "AppLoggerTest","Test Level 4 Message");
logMessage(5, "All", "AppLoggerTest","Test Level 5 Message");
logMessage(6, "All", "AppLoggerTest","Test Level 6 Message");
logMessage(7, "All", "AppLoggerTest","Test Level 7 Message");
logMessage(8, "All", "AppLoggerTest","Test Level 8 Message");
logMessage(9, "All", "AppLoggerTest","Test Level 9 Message");
logMessage(10, "All", "AppLoggerTest","Test Level 10 Message");
