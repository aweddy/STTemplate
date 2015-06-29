# SilverTech Inc. HTML5 Boilerplate
The SilverTech Inc. Boilerplate was created using the HTML5 Boilerplate.  It is not intended for distribution outside SilverTech.  This boilerplate serves as a template to speed up the development process.  The folder structure loosely matches the structure of SilverTech's CMS install to allow for easy transfer to .ASP upon completion of the cut up process. 

:warning: We have set up a fairly specific branching model for this repo, please review [here](http://nvie.com/posts/a-successful-git-branching-model/).

:warning:  When comitting changes to the git repo, please remember to update the changelog.md with the date, your name, and changes made. Newest entries to the changelog at the top. 

:warning: Requires node.js.  Download and install node [here](http://nodejs.org/)

## Structure and Features

### Root and General
* The package.json and Gruntfile.js are included and preloaded with the current packages the front end team has identified should be used with every project.  
* server.js is included so that you may (optionally) run a local apache server without the need for WAMP or equivilent software.  Simply  navigate to the project folder in the command prompt and run `node server.js`  you can then navigate to your project at localhost:8000
* the .gitignore is already ignoring compiled sass and javascript.  Grunt will create the compiled files for you.
*

### Javascript 
* respond.js and selectivizr.js are included in the project folder, they are not linked in the markup.  You should know before starting a project whether or not you'll need these polyfills. 

### Sass and CSS
* grunt-criticalcss will automatically inline your above the fold styles.  

:warning: You must run server BEFORE running criticalcss.  It's crawling over the live page as our partials make it impossible to accurately crawl any single html file

### Images