# Changelog

## September 6, 2014 
* Sean Dempsey - Replaced webfont task in Gruntfile.js (went missing somehow).  Added grunt-criticicalcss which currently outputs to partials/criticalcss.html  This is then included in base.html in the '<head></head>' #perf

## August 15, 2014 
* Sean Dempsey - Updated Gruntfile.js css tasks to separate 'development' and 'production' tasks.
  - The task now creates a .min.css file for production and leaves the uncleaned, unminified source for mapping.
* Sean Dempsey - Updated .gitignore to cover all map and .min.css files.

## August 5, 2014
* Sean Dempsey - Updated Gruntfile.js 'imagemin' path from images to 'img'.
* Sean Dempsey - Updated Changelog to reflect changes made.  

:warning: Please don't forget!  You could just copy your intended commit message!  

## July 30, 2014 
* Sean Dempsey - Added grunt-express-server, Separated out mixins, added timing functions (decidedly not a mixin - we can move it later)

##July 27, 2014
* Sean Dempsey - Updated _base.scss with triangle mixin.

## July 24, 2014
* Matthew Chase - Got rid of the HTML5 bootstrap index.html

## July 23, 2014
* Matthew Chase - Updates Grunt to include grunt-githooks and grunt-npm-install, which (if this works) will invoke npm install and grunt after you update the repo.

* Matthew Chase - Removed link tag trying to load normalize.css

## July 18, 2014
* Matthew Chase - Modified swig templates so have a base template and page layouts that extend it. Now inner has two blocks; one for content and one for sidebar, instead of just one block that contains ARTICLE and ASIDE tags
* Matthew Chase - Added Swig templating and a bare-bones icon font

##July 3, 2014
* Sean Dempsey - Created!

