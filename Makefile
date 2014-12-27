all:
	jsl -nologo -nofilelisting -nosummary -output-format "__FILE__:__LINE__:__COL__: __ERROR__" -process index.js

