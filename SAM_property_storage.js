// Licensed Materials - Property of IBM
// 5724-W86, 5724-X63
// Copyright IBM Corporation 2013, 2015. All Rights Reserved.
// US Government Users Restricted Rights- Use, duplication or disclosure
// restricted by GSA ADP Schedule Contract with IBM Corp.

// Alcatel-Lucent 5620 SAM Pack



/* This file defines a multi-level property storage cache contruscted
   using the UBACache object.  When you create the storage, you define
   the number of level and an initial size for each level (this size
   will internally be expanded as need, it is purely for internal
   usage).  When accessing the storage, you call the accessors with a
   variable number of arguments, with one for each of the levels in
   the lookup.

*/



function newPropStorage(levels, initial_size) {
    var storage=new Object();
    var cache;

    if (isUndef(initial_size)) {
	cache=PV.UBACache(1000);
	storage.initial_size=1000;
    } else {
	cache=PV.UBACache(initial_size);
	storage.initial_size=initial_size;
    }


    storage.cache=cache;
    storage.levels=levels;

    return(storage);
}


function findPropEntry(storage, key) {
    // Don't use "key" below, as this function has a variable number of arguments.

    var i, cache, level_key;

    if ((arguments.length-1) != storage.levels) {
	logP3Msg("SAM_property_storage", "SAM", "Wrong number of arguments for the levels of the property storage: " + (arguments.length-1) + " vs. " + storage.levels);
    }
    
    cache=storage.cache;

    // Iterate through each level of the storage; intermediate levels will return another UBACache
    // for the next level; the last result you get will ultimately be the stored object
    for (i=1; i<=storage.levels; i++) {
	level_key=arguments[i]; // iterate through arguments here
	cache=cache.get(level_key);
	    if (cache == null) return(cache);
	    }

    return(cache);
}


function storePropEntry(storage, key, entry) {
    // Don't use "key" or "entry" below as this function has a variable number of arguments
    var actual_entry=arguments[arguments.length-1];
    var i, cache, level_key;

    if ((arguments.length-2) != storage.levels) {
	logP3Msg("SAM_property_storage", "SAM", "Wrong number of arguments for the levels of the property storage: " + (arguments.length-2) + " vs. " + storage.levels);
    }
    
    // Iterate through each level of the storage; return the final UBACache level
    // storage will always have at least one level already created, unless it is null

    cache = storage.cache;

    for (i=1; i<storage.levels; i++) { // Go through loop levels-1 times
	level_key=arguments[i]; // iterate through arguments here
	new_cache=cache.get(level_key);
	if (new_cache == null) {
	    new_cache=PV.UBACache(storage.initial_size);
	    cache.put(level_key, new_cache);
	    }
	cache=new_cache;
    }


    cache.put(arguments[i], actual_entry);
	
}

// Looks in the storage for an entry with the key specification passed
// in.  If not found, it inserts an empty entry into the storage with
// the specified key.

function createOrFindPropEntry(storage, key) {
    var entry, args;

    entry=findPropEntry.apply(this, arguments);
    if (entry == null) {
	entry=new Object();
	// Trick to convent the arguments into an actual array
	args = Array.prototype.slice.call( arguments, 0 );
	args[args.length] = entry;
	storePropEntry.apply(this, args);
    }
    return(entry);
}


function copyPropertiesToObject(source, destination, prop_array) {
    for(var i = 0; i<prop_array.length; i++) {
	if (isDef(source[prop_array[i]])) {
	    destination[prop_array[i]] = source[prop_array[i]];
	}
    }
}


function test_prop_storage() {

    //var storage1, storage2, entry1, entry2;
	var storage1, entry1, entry2;
	
    storage1 = newPropStorage(1);
    logP4Msg("test_prop_storage()", "SAM", "Created storage1");

    entry1=new Object();
    entry1.property1="value1";
    entry1.property2="value2";

    logP4Msg("test_prop_storage()", "SAM", "--> Storing entry1");

    storePropEntry(storage1, "key1", entry1);

    logP4Msg("test_prop_storage()", "SAM", "After storing entry1");

    logP4Msg("test_prop_storage()", "SAM", "Dumping entry1");
    dump_samObject(entry1);

    logP4Msg("test_prop_storage()", "SAM", "Dumping done");
    
    logP4Msg("test_prop_storage()", "SAM", "--> Retrieving entry1 with key1");

    entry2 = findPropEntry(storage1, "key1");

    logP4Msg("test_prop_storage()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage()", "SAM", "Dumping done");

    entry2=null;

    logP4Msg("test_prop_storage()", "SAM", "--> Retrieving entry1 with findOrCreate");

    entry2 = findPropEntry(storage1, "key1");

    logP4Msg("test_prop_storage()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage()", "SAM", "--> Adding new property");

    entry2.pork = "chop";

    logP4Msg("test_prop_storage()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage()", "SAM", "Dumping done");

    entry2 = null;

    logP4Msg("test_prop_storage()", "SAM", "--> Retrieving entry1 with key1");

    entry2 = findPropEntry(storage1, "key1");

    logP4Msg("test_prop_storage()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage()", "SAM", "Dumping done");

}





function test_prop_storage2() {

    //var storage1, storage2, entry1, entry2, entry3;
	var storage2, entry1, entry2, entry3;
	
    storage2 = newPropStorage(2, 1500);
    logP4Msg("test_prop_storage2()", "SAM", "Created storage2");

    entry1=new Object();
    entry1.property1="value1";
    entry1.property2="value2";
    entry1.name = "entry1";

    entry2=new Object();
    entry2.david = "bowie";
    entry2.ziggy = "stardust";
    entry2.name="entry2";

    entry3=new Object();
    entry3.flat = "earth";
    entry3.name="entry3";

    logP4Msg("test_prop_storage2()", "SAM", "--> Storing entry1");

    storePropEntry(storage2, "key1", "chicken", entry1);

    logP4Msg("test_prop_storage2()", "SAM", "After storing entry1");
    logP4Msg("test_prop_storage2()", "SAM", "Storing others");

    storePropEntry(storage2, "key1", "beef", entry2);
    storePropEntry(storage2, "aluminum", "foil", entry3);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping entry1");
    dump_samObject(entry1);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");
    
    logP4Msg("test_prop_storage2()", "SAM", "--> Retrieving entry1 with key1 chicken");

    entry2 = findPropEntry(storage2, "key1", "chicken");

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");

    entry2=null;

    logP4Msg("test_prop_storage2()", "SAM", "--> Retrieving entry1 with findOrCreate");

    entry2 = findPropEntry(storage2, "key1", "chicken");

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "--> Adding new property");

    entry2.pork = "chop";

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");

    entry2 = null;

    logP4Msg("test_prop_storage2()", "SAM", "--> Retrieving entry1 with key1 chicken");

    entry2 = findPropEntry(storage2, "key1", "chicken");

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");


    logP4Msg("test_prop_storage2()", "SAM", "--> Retrieving entry2 with key1 beef");

    entry2 = findPropEntry(storage2, "key1", "beef");

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");


    logP4Msg("test_prop_storage2()", "SAM", "--> Retrieving entry3 with aluminum foil");

    entry2 = findPropEntry(storage2, "aluminum", "foil");

    logP4Msg("test_prop_storage2()", "SAM", "Dumping retrieval results");
    dump_samObject(entry2);

    logP4Msg("test_prop_storage2()", "SAM", "Dumping done");

}
