// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//*****************************************************************
//
//  SAMIF_selectJmsVersion.js
//
//  Determines SAM version number from the dc.cfg and then
//  loads the appropriate version of the handle_jms_msg function.
//
//  Note: the protocol between the SamJMS process and the SAMIF process
//        changed to include the sequence number.  That is why 2 versions
//        of this function are needed.
//
//*****************************************************************


// Specify version of SAM Server:
//
//  SAMIF.1.101.APP.SAM_VERSION=2.0
//

var SamVersion = "3.0";

if(PV.configuration != undefined)
{
	if(PV.configuration.SAM != undefined)
	{
		if(PV.configuration.SAM.SAM_VERSION != undefined)
		{
			SamVersion = PV.configuration.SAM.SAM_VERSION;
		} else
		{
			PV.Logger.logInfo("SAMIFAdapter", "All",  "No Sam Version Defined in dc.cfg");
		}
	} else 
		{
			PV.Logger.logInfo("SAMIFAdapter", "All",  "SAM configuration not defined in dc.cfg for this component");
		}
} else
{
	PV.Logger.logInfo("SAMIFAdapter", "All",  "PV.configuration is not defined in dc.cfg for this component");
}
			
if(SamVersion == undefined)
{
	SamVersion = "3.0";
}

PV.Logger.logInfo("SAMIFAdapter", "All",  "Sam version = "+SamVersion);

if(SamVersion == "3.0")
{
	PV.importScript("alcatel_5620_sam_log2file/jms_3_0.js");
} else if(SamVersion == "2.1")
{
	PV.importScript("alcatel_5620_sam_log2file/jms_2_1.js");
} else if(SamVersion == "2.0")
{
	PV.importScript("alcatel_5620_sam_log2file/jms_2_0.js");
} 
 else 
{
	PV.Logger.logInfo("SAMIFAdapter", "All",  "Unknown Sam Version defaulting to jms_3_0.js");
	PV.importScript("alcatel_5620_sam_log2file/jms_3_0.js");
}

