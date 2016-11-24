// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//*******************************************************************
//
//             Version 2.0 -- no sequence numbers
//
//*******************************************************************
//
//             h a n d l e _ j m s _ m s g 
//
//*******************************************************************
function handle_jms_msg(msg)
{
    logP5Msg("handle_jms_msg 2.0", "SAMIF", msg.join("::") );
    if(msg != undefined)
		switch(msg[0])
		{
			case "NewElement":
				if(msg.length > 2)
					jms_newElement(msg[1],msg[2]);
				else
					logP0Msg("handle_jms_msg 2.0", "SAMIF", "MSG too short ... dropping message");
				break;
			case "DeletedElement":
				if(msg.length > 2)
					jms_delElement(msg[1],msg[2]);
				else
					logP0Msg("handle_jms_msg 2.0", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "PropertyChange":
				if(msg.length > 4)
					jms_propChange(msg[1],msg[2],msg[3],msg[4]);
				else
					logP0Msg("handle_jms_msg 2.0", "SAMIF", "MSG too short ... dropping message");    			
				break;
			default:
				logP0Msg("handle_jms_msg 2.0", "SAMIF", "Unexpected msg "+msg[0]+" ... dropping message"); 
		}
	else
		logP0Msg("handle_jms_msg 2.0", "SAMIF", "Dropping UNDEFINED message");
}
