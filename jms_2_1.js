// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//*******************************************************************
//
//             Version 2.1 -- with sequence numbers
//
//*******************************************************************
//
//             h a n d l e _ j m s _ m s g 
//
//*******************************************************************
function handle_jms_msg(msg)
{
    logP5Msg("handle_jms_msg 2.1", "SAMIF", msg.join("::") );
    if(msg != undefined)
		switch(msg[0])
		{
			case "NewElement":
				if(msg.length > 3)
					jms_newElement(msg[2],msg[3]);
				else
					logP0Msg("handle_jms_msg 2.1", "SAMIF", "MSG too short ... dropping message");
				break;
			case "DeletedElement":
				if(msg.length > 3)
					jms_delElement(msg[2],msg[3]);
				else
					logP0Msg("handle_jms_msg 2.1", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "PropertyChange":
				if(msg.length > 5)
					jms_propChange(msg[2],msg[3],msg[4],msg[5]);
				else
					logP0Msg("handle_jms_msg 2.1", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "KeepAlive":
				break;
			case "IgnoredMessage":
				break;
			default:
				logP0Msg("handle_jms_msg 2.1", "SAMIF", "Unexpected msg "+msg[0]+" "+msg[1]+" ... dropping message"); 
		}
	else
		logP0Msg("handle_jms_msg 2.1", "SAMIF", "Dropping UNDEFINED message");
}
