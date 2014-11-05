#Simpleprompt

Simple custom dialog prompts based on jQuery.

##Usage
```javascript

app.prompt('Are you sure you want to delete this item?', function(){

	$.ajax({url: this.href, type: 'DELETE'}).done(function(){ window.location.reload(); });

});

app.prompt('Are you sure you want to delete this item?', function(){ // Confirm callback

	console.log('Executing confirm logic...');

}, function(){ // Optional cancel callback

	console.log('Canceling...');

});

app.prompt({
	message: 'Are you sure you want to delete this item?'
	confirm: function(){ $.ajax({url: this.href, type: 'DELETE'}).done(function(){ window.location.reload(); }); },
	cancel: function(){ /* cancel logic here */ }
});
```
##Available options

```javascript
$.wk.prompt.defaults = {
	message: 'Are you sure',
	cancelText: 'Cancel',
	acceptText: 'Confirm',

	overlayClass: 'prompt_overlay',
	moduleClass: 'prompt_box',
	messageClass: 'message',
	cancelBtnClass: '',
	acceptBtnClass: '',

	closeOnOverlayClick: false,

	confirm: null,
	cancel: null
};
```

##Installation

After including library file it is recommend to alias and bring library (that is initialy in $.wk.prompt namespace) to your desired namespace.
 ```javascript
 app.prompt = $.wk.prompt;
```


