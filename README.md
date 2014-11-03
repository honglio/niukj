[ ![Codeship Status for honglio/niukj](https://codeship.io/projects/5c4fd850-11c8-0132-a74a-029e44e44534/status)](https://codeship.io/projects/33121)

# 牛课件 #

## Contributing ##

Here is the basic layout of the source:

* Presentation Model: cloudslide/deck
* Editor UI Layer: cloudslide/slide_editor
* Presentation Rendering: cloudslide/presentation_generator

templates for UI components are contained in cloudslide/COMPONENT_NAME/templates in order to package related markup and backing UI (not model) code into modules. In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Indentation should be set to four spaces. If you are adding a new problem, consider adding an entry on the problems list in the readme where applicable. Please lint and test your code with any means available - currently JavaScript has tests and linting via Mocha and JSHint.

### Building ###

To running locally, you'll need Grunt v0.4.0 or later.

1. Install the latest Grunt: 'npm install -g grunt-cli'
2. Install development dependencies: 'npm install'
3. Build pages from template: 'grunt'

the resulting build will be location in 'currentDirectory/dist'.

### Add custom fonts: ###
1. Reference them in web-fonts.css
2. Add the image hack for the given font to ImpressTemplate.hbs
3. Add the base-64 version of the font to present_dependence/base64/fonts
4. ttf2woff tool: npm install ttf2woff -g

## User Guide ##
* Component scale keep aspect ratio by default, press 'shift' to break the ratio.


## Acknowledgments ##

* HTML5 Boilerplate: [http://html5boilerplate.com](http://html5boilerplate.com)
* Backbone: [http://documentcloud.github.com/backbone/](http://documentcloud.github.com/backbone/)
* Require: [http://requirejs.org/](http://requirejs.org/)
* Handlebars: [http://handlebarsjs.com/](http://handlebarsjs.com/)
* Mocha: [http://visionmedia.github.io/mocha/](http://visionmedia.github.io/mocha/)
* Bootstrap: [http://twitter.github.io/bootstrap/](http://twitter.github.io/bootstrap/)
* Express: [http://expressjs.com/](http://expressjs.com/)
* Passport: [http://passportjs.org/](http://passportjs.org/)
* Impress: [http://github.com/bartaz/impress.js](http://github.com/bartaz/impress.js)