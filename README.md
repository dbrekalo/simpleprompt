#Simpleprompt
[![Build Status](https://travis-ci.org/dbrekalo/simpleprompt.svg?branch=master)](https://travis-ci.org/dbrekalo/simpleprompt)
[![Coverage Status](https://coveralls.io/repos/github/dbrekalo/simpleprompt/badge.svg?branch=master)](https://coveralls.io/github/dbrekalo/simpleprompt?branch=master)
[![NPM Status](https://img.shields.io/npm/v/simpleprompt.svg?style=flat)](https://www.npmjs.com/package/simpleprompt)

Simple custom dialog prompts based on jQuery.

##Usage
```javascript

Prompt('Are you sure you want to delete this item?', function(){

	$.ajax({url: this.href, type: 'DELETE'}).done(function(){ window.location.reload(); });

});

Prompt('Are you sure you want to delete this item?', function(){ // Confirm callback

	console.log('Executing confirm logic...');

}, function(){ // Optional cancel callback

	console.log('Canceling...');

});

Prompt({
	message: 'Are you sure you want to delete this item?'
	confirm: function(){ $.ajax({url: this.href, type: 'DELETE'}).done(function(){ window.location.reload(); }); },
	cancel: function(){ /* cancel logic here */ }
});
```
##Available options

```javascript
Prompt.defaults = {
	message: 'Are you sure',
	cancelText: 'Cancel',
	acceptText: 'Confirm',

	htmlClass: 'prompt_active',
	overlayClass: 'prompt_overlay',
	moduleClass: 'prompt_box',
	messageClass: 'message',
	cancelBtnClass: '',
	acceptBtnClass: '',
	inputClass: 'prompt_input',

	closeOnOverlayClick: false,
	closeOnEscapeKey: true,

	requiresUserInput: false,
	validateInput: function(inputText) {
	    return inputText.length > 0;
	},

	confirm: null,
	cancel: null,
	context: null,
	afterRender: null
};
```
