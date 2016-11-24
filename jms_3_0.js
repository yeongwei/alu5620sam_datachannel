// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack

//*******************************************************************
//
//             Version 3.0 -- with sequence numbers
//
//*******************************************************************
//
//             h a n d l e _ j m s _ m s g 
//
//*******************************************************************
function handle_jms_msg(msg)
{

//debuglogP4Msg("handle_jms_msg 3.0", "SAMIF", "initial entering");
//    logP5Msg("handle_jms_msg 3.0", "SAMIF", msg.join("::") );
    if(msg != undefined) {

//debuglogP6Msg("handle_jms_msg 3.0", "SAMIF", "entering");
//debuglogP6Msg("handle_jms_msg 3.0", "SAMIF", "entering length: "+msg.length+" type: "+msg[0]);
		switch(msg[0])
		{
			case "ObjectCreation":
				if(msg.length > 3)
					jms_newElement(msg[1],msg[2],msg[3]);
				else
					logP3Msg("handle_jms_msg 3.0", "SAMIF", "MSG too short ... dropping message");
				break;
			case "ObjectDeletion":
			case "generic.ObjectDeletion":
				if(msg.length > 3)
					jms_delElement(msg[1],msg[2],msg[3]);
				else
					logP3Msg("handle_jms_msg 3.0", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "AttributeValueChange":
				if(msg.length > 3)
					jms_propChange(msg[1],msg[2],msg[3]);
				else
					logP3Msg("handle_jms_msg 3.0", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "SystemInfoEvent":
				if(msg.length > 3)
					jms_infoEvent(msg[12],msg[3]);
				else
					logP3Msg("handle_jms_msg 3.0", "SAMIF", "MSG too short ... dropping message");    			
				break;
			case "KeepAliveEvent":
				break;
			case "IgnoredEvent":
			case "IgnoredMessage":
				break;
			default:
				logP4Msg("handle_jms_msg 3.0", "SAMIF", "Unexpected msg "+msg[0]+" "+msg[1]+" ... dropping message"); 
		}
} // msg undefined
	else
		logP4Msg("handle_jms_msg 3.0", "SAMIF", "Dropping UNDEFINED message");
}

