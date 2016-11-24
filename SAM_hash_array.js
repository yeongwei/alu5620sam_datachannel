// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack


// hashArray class defined after this

function hashArray() {

	this.arr = new Array();

	return this;

	}

hashArray.prototype.findHashArrayEntry = function(inputClasskey, inputEntryId) {

	var i;

	var classkey = inputClasskey.toString();
	var entryId = inputEntryId.toString();

//debug	logP6Msg("hash_array", "SAMIF", "entering findHashArrayEntry "+classkey+","+entryId+".");

	if (isUndef(this.arr[classkey])) {
		// Array not found
		return;
		}

	for (i=0; i<this.arr[classkey].length; i++) {
		if (this.arr[classkey][i].entryId == entryId) {
			return(this.arr[classkey][i]);
			} else {
//debug			logP6Msg("hash_array", "SAMIF", "no match: index "+i+" classkey "+classkey+" entryId "+this.arr[classkey][i].entryId+".");
			}
		}

	return;

};


hashArray.prototype.findHashArray = function(inputClasskey) {

	var classkey = inputClasskey.toString();

//debug	logP6Msg("hash_array", "SAMIF", "entering findHashArray "+classkey+".");

	if (isDef(this.arr[classkey])) {
		return this.arr[classkey];
		}
};

hashArray.prototype.insertOrFindHashArrayEntry = function(inputClasskey, inputEntryId) 
{
	var i, found;
	var classkey = inputClasskey.toString();
	var entryId = inputEntryId.toString();
	//debug//logP6Msg("hash_array", "SAMIF", "entering insertOrFindHashArrayEntry "+classkey+","+entryId+".");
	if (isUndef(this.arr[classkey]))//Array not found
	{
		//debug//logP6Msg("hash_array", "SAMIF", "array not found");
		this.arr[classkey]=new Array();
		//debug	//logP6Msg("hash_array", "SAMIF", "after new array");
	}

	found = false;
	for (i=0; i<this.arr[classkey].length; i++) 
	{
		if (this.arr[classkey][i].entryId == entryId) 
		{
			found = true;
			//debug//logP6Msg("hash_array", "SAMIF","found the entry");
			break;
		} 
		else 
		{
			//debug//logP6Msg("hash_array", "SAMIF", "no match: index "+i+" classkey "+classkey+" entryId "+this.arr[classkey][i].entryId+".");
		}
	}

	if (found != true) 
	{
		//debug//logP6Msg("hash_array", "SAMIF", "adding new entry as index "+i+" for classkey "+classkey+" entryId "+entryId+".");
		this.arr[classkey][i]= new Object();
		this.arr[classkey][i].entryId = entryId;
		//debug//logP6Msg("hash_array", "SAMIF", "added "+classkey+","+entryId);
	}
	return this.arr[classkey][i];	
};

hashArray.prototype.insertEntryIntoHashArray = function(inputClasskey, entry) {

	var i, found;

	var classkey = inputClasskey.toString();

//debug	logP6Msg("hash_array", "SAMIF", "entering insertEntryIntoHashArray "+classkey);
	if (isUndef(this.arr[classkey])) {
		// Array not found
//debug		logP6Msg("hash_array", "SAMIF", "array not found");
		this.arr[classkey]=new Array();
//debug		logP6Msg("hash_array", "SAMIF", "after new array");
		}

	found = false;
	for (i=0; i<this.arr[classkey].length; i++) {
		if (this.arr[classkey][i] == entry) {
			found = true;
//debug		logP6Msg("hash_array", "SAMIF","found the entry");
			break;
			} else {
//debug			logP6Msg("hash_array", "SAMIF", "no match: index "+i+" classkey "+classkey+" .");
			}
		}

	if (found != true) {
//debug		logP6Msg("hash_array", "SAMIF", "adding new entry as index "+i+" for classkey "+classkey+" .");
		this.arr[classkey][i]= entry;
//debug		logP6Msg("hash_array", "SAMIF", "added entry to "+classkey);
		}

	return this.arr[classkey][i];	

};



hashArray.prototype.deleteEntryFromHashArray = function(inputClasskey, entry) {

	var i, found;

	var classkey;

//debug	logP6Msg("hash_array", "SAMIF", "entering insertEntryIntoHashArray ");

	classkey = inputClasskey.toString();

//debug	logP6Msg("hash_array", "SAMIF", "entering insertEntryIntoHashArray "+classkey);
	if (isUndef(this.arr[classkey])) {
		// Array not found
//debug		logP6Msg("hash_array", "SAMIF", "array not found");
		return;
		}

	found = false;
	for (i=0; i<this.arr[classkey].length; i++) {
		if (this.arr[classkey][i] == entry) {
			found = true;
//debug		logP6Msg("hash_array", "SAMIF","found the entry");
			break;
			} else {
//debug			logP6Msg("hash_array", "SAMIF", "no match: index "+i+" classkey "+classkey+" .");
			}
		}

	if (found == true) {
//debug		logP6Msg("hash_array", "SAMIF", "removing entry at index "+i+" for classkey "+classkey+" .");
		this.arr[classkey].splice(i, 1);
//debug		logP6Msg("hash_array", "SAMIF", "removed entry");
		return entry;
		}
		
	return;

};

