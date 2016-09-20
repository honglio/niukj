[ ![Codeship Status for honglio/niukj](https://codeship.io/projects/5c4fd850-11c8-0132-a74a-029e44e44534/status)](https://codeship.io/projects/33121)

# Niukj #

## Browser Support

__Chrome__, __Safari__, __Firefox 3.6+__, __Opera__, __IE9-11__.  

## Getting started ##

Details of contributing on this project can be found in the [wiki](https://github.com/honglio/niukj/wiki).

## Developers Guide ##

### Install requirements

* Git (GitHub client preferred)
* [Vagrant (v1.4.3 or higher)](http://www.vagrantup.com/downloads.html)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)

### Quick Start

Clone the repository:

```shell
$ git clone https://github.com/honglio/niukj.git
```

Start the Vagrant virtual machine:

```shell
$ vagrant up
```

SSH into the Vagrant virtual machine:

```shell
$ vagrant ssh
```

Start the application inside the vagrant machine:

```shell
$ make
```

Now you can open `http://localhost:3000` in your browser.

### Source Structure ###

* Presentation Model: public/js/models
* Editor UI Layer: public/js/views
* Presentation Rendering: server/views/article
* templates for UI components: in public/js/templates 

### Build and Release ###

To running locally, you'll need Grunt v0.4.0 or later.

1. Install the latest Grunt: 'npm install -g grunt-cli'
2. Install development dependencies: 'npm install'
3. Build pages from template: 'grunt build'. *The resulting build will be location in 'currentDirectory/built'.*
4. Update the release version with [grunt-bump](https://github.com/vojtajina/grunt-bump#usage-examples)

### Add custom fonts: ###
1. Reference them in web-fonts.css
2. Add the image hack for the given font to ImpressTemplate.hbs
3. Add the base-64 version of the font to present_dependence/base64/fonts
4. ttf2woff tool: npm install ttf2woff -g
