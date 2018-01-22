## Neighorhood Coffee Map project

This website is an online map project designed to locate coffee shops
within a 10 mile radius in the north Seattle suburbs.  It is one of my **_Udacity_** projects
to highlight the capabilities of the Google Maps and Foursquare APIs.

### Usage

This is a simple website that is accessed by either cloning the repository or
downloading the zip file.  Once you have the files on your system, you can initiate
your coffee search by clicking on the dist/index.min.html file.  If you want to
modify/test the code, you can access the src/index.html and src/js/map.js files
to replace the appropriate API keys.

#### Tools

**_Grunt_** was used for some of the page optimization efforts in this project.  The Gruntfile.js
and package.json files are included in the repo, but the node_modules directory was removed
as requested.

Grunt was executed on the Git Bash command line within the project folder, but the actual Gruntfile.js file was modified via the
**_Atom_** text editor after each fix attempt to the index, css or js file(s).

### Features

The following features are available within this coffee map:

1.  This version initializes with 21 available coffee shops in a 10 mile radius.
2.  Any of the coffee cup icons can be selected for a closer view and the address for that location.
3.  There is an _Open/Close Coffee List_ link to open or close a menu that contains a list
    of all available coffee shops.  
4.  There is a **Coffee Shop Search** field at the top of this menu where you
    can narrow down locations in the list and on the map.
5.  Each of the locations in the _Coffee List_ can be selected for a closer view and address for that coffee shop.
6.  There is also a _Show All Coffee Shops_ link that will redisplay all the original map locations.

### Contributions

A big _Thank You_ to Udacity Mentors for the Javascript help and hints.
