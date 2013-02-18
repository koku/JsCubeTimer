// todo: move to a better place
// binding fix
Function.prototype.bind=(function(){}).bind||function(a,b){b=this;return function(){b.apply(a,arguments)}}

// todo: move to a better place
// object extending
Object.extend = function(dest, source, allowOverwrite)
{
	for (var prop in source)
	{
		if (source.hasOwnProperty(prop) && (allowOverwrite || !dest.hasOwnProperty(prop)))
			dest[prop] = source[prop];
	}

	return dest;
}

// todo: move to a better place
// allow storage of objects in localStorage
Storage.prototype.setObject = function(key, value)
{
	this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key)
{
	var value = this.getItem(key);
	return value && JSON.parse(value);
}


