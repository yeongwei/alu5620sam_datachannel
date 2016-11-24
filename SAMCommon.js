// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// SAMCommon.js
//
// This script contains common code used by several SAM scripts
//

function dateFromSAMFilename(name) {
	var tmp = name.split("_")[1];
	var dateAndTime=tmp.split("-");
	var d=dateAndTime[0].split(".");
	var t=dateAndTime[1].split(".");
	return new Date(d[0],d[1]-1,d[2],t[0],t[1],t[2]);
}

function parseSAMURI(source) {
	source.timestamp = dateFromSAMFilename(source.localName);
}

function nilStatus(name, obj) {
	if (obj == undefined) {
	    logP5Msg("SAM", "SAMlib", name+" is UNDEFINED");
	}
	else {
	    logP5Msg("SAM", "SAMlib", name+" is defined");
		}
	}

function logStatus(name, obj) {
	if (obj == undefined) {
	    logP5Msg("SAM", "SAMlib", name+" is UNDEFINED");
	}
	else {
	    logP5Msg("SAM", "SAMlib", name+" is "+obj.toString());
		}
	}

function isUndef(obj) {
	if (obj == undefined)
		return true;
	else
		return false;
	}

function isDef(obj) {
	if (obj == undefined)
		return false;
	else
		return true;
	}

function cIncr(obj) {

	if (obj == undefined) {
	    logP5Msg("cIncr", "SAMlib", "Input UNDEFINED, returning 1.");
		return 1;
	} else {
	    logP5Msg("cIncr", "SAMlib", "Input "+obj);
	    logP5Msg("cIncr", "SAMlib", "Returning "+(obj+1));
		return (obj+1);
		}
}

function cDecr(obj) {
	if (obj == undefined)
	    logP5Msg("SAM", "SAMlib", "Trying to decrement something UNDEFINED");
	else
	    if (obj == 0)
	    	logP5Msg("SAM", "SAMlib", "Trying to decrement counter that is ZERO");
			else
		return (obj-1);

	return;
}

/*
 *Author: YeongWei
 *Created: 14 December 2012
 *Updated: 28 March 2013
 *Comment: 
 *1) Populate periodicTime with FILE_PERIOD
 *2) Or default to 900000 
 *3) Deprecated as NOW record timestamps being used
 */
function PeriodicTimeAsFilePeriod(_object)
{
	if(inv_metric_config_array['FILE_PERIOD'])
	{
		_periodicTime = inv_metric_config_array['FILE_PERIOD'] + '000';
		_periodicTime = parseInt(_periodicTime);
		_object['periodicTime'] = _periodicTime;
	}
	else
	{
		_object['periodicTime'] = 900000;
	}
}

/*
 *Author: YeongWei
 *Created: 28 March 2013
 *Comment: 
 *1) Create simple floatMetric object
 */
function CreateSimpleMetricObject(mRid, mRecord, mPath, mTargetMetric)
{
	var _log = '';
	//logP5Msg("CreateSimpleMetricObject", "DEBUG", "mRid -> " + mRid);
	//logP5Msg("CreateSimpleMetricObject", "DEBUG", "mTargetMetric -> " + mTargetMetric);
	var _timestampName = null; 
	_timestampName = metricClassTimestampMapping[mRecord["className"]];
	_log += "_timestampName: " + _timestampName.toString() + " | ";
	//logP5Msg("CreateSimpleMetricObject", "DEBUG", "_timestampName: " + _timestampName);
	
	var sMetriObject = OPERATOR.FloatMetric();//Since OPERATOR is global
	//sMetriObject.timestamp = parseInt(Math.round(parseInt(mRecord[_timestampName]) / 1000));	
	sMetriObject.timestamp = ParseTimestamp(mRecord[_timestampName]);
	_log += "timestamp: " + sMetriObject.timestamp.toString() + " | ";
	sMetriObject.name = mPath + mTargetMetric;	_log += "name: " + sMetriObject.name.toString() + " | ";
	sMetriObject.rid = mRid;	_log += "rid: " + sMetriObject.rid.toString() + " | ";
	sMetriObject.value = mRecord[mTargetMetric];	_log += "value: " + sMetriObject.value.toString();
	OPERATOR.addMetric(sMetriObject);
	logP5Msg("CreateSimpleMetricObject", "DEBUG", _log);
}
/*
theMetric = OPERATOR.FloatMetric();
theMetric.timestamp = record.timestamp / 1000;//This is just temporary
theMetric.name = "AP~Specific~Alcatel~5620 SAM~Bulk~equipment~InterfaceAdditionalStats~" + equipmentInterfaceAdditionalMetrics[i];
theMetric.rid = myId;	    
theMetric.value = record[equipmentInterfaceAdditionalMetrics[i]];
OPERATOR.addMetric(theMetric);
*/
/*
 * Author: YeongWei
 * Created: 18 April 2013
 * Comment: To parse timestamp correctly; Make sure no decimal point; Make sure timestamp not rounded wrongly
 */
function ParseTimestamp(_timestampValue)
{
	logP6Msg("ParseTimestamp", "DEBUG", "Recevied _timestampValue -> " + _timestampValue);
	_timestampValue = parseInt(_timestampValue).toString().substr(0,10);
	logP6Msg("ParseTimestamp", "DEBUG", "Returning _timestampValue -> " + _timestampValue);
	return parseInt(_timestampValue);
}
