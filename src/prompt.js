;(function($, window, document){

	"use strict";

	var instance_counter = 0,
		$document = (window.app && window.app.$document) || $(document),
		$body = (window.app && window.app.$body) || $('body');

	function PromptFacade(message, confirmCallback, cancelCallback){

		var options = {};

		if (arguments.length === 1){ options = message; }
		else { options = {'message': message, 'confirm': confirmCallback, 'cancel': cancelCallback}; }

		return new Prompt(options);

	}

	function Prompt(options){

		this.options = $.extend({}, Prompt.defaults, options );
		this.init();

	}

	Prompt.defaults = {
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

	var api = {

		init: function(){

			this.ens = '.prompt' + (++instance_counter);

			this.$el = $(
				'<div class="'+ this.options.overlayClass +'">\
					<div class="'+ this.options.moduleClass +'">\
						<p class="'+ this.options.messageClass +'">'+ this.options.message +'</p>\
						<div class="controls">\
							<a href="#" class="cancel '+ this.options.cancelBtnClass +'">'+ this.options.cancelText +'</a>\
							<a href="#" class="accept '+ this.options.acceptBtnClass +'">'+ this.options.acceptText +'</a>\
						</div>\
					</div>\
				 </div>'
			).appendTo($body);

			this.$el.find('.accept').focus();

			this.events();

		},

		events: function(){

			var self = this;

			this.$el.on('click' + this.ens, '.cancel', function(e){ e.preventDefault(); self.close(); } );
			this.$el.on('click'+ this.ens, '.accept', function(e){ e.preventDefault(); self.execute(); } );

			this.options.closeOnOverlayClick && this.$el.on('click', function(e){
				$(e.target).is(self.$el) && self.close();
			});

			$document.on('keyup'+ this.ens, function(e){
				if ( e.keyCode === 27) { self.close(); }
			});

		},

		execute: function(){

			if ( this.options.confirm ) {
				this.options.context ? this.options.confirm.call( this.options.context ) : this.options.confirm();
			}

			this.destroy();

		},

		close: function(){

			if ( this.options.cancel ) {
				this.options.context ? this.options.cancel.call( this.options.context ) : this.options.cancel();
			}

			this.destroy();

		},

		destroy: function(){

			$document.off( this.ens );
			this.$el.remove();

		}

	};

	$.extend(Prompt.prototype, api);

	$.wk = $.wk || {};
	$.wk.prompt = PromptFacade;
	$.wk.prompt.defaults = Prompt.defaults;

})(window.jQuery || window.Zepto, window, document);