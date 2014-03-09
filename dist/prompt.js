;(function($, window, document){

	var instance_counter = 0,
		$document = (window.app && window.app.$document) || $(document);
		$body = (window.app && window.app.$body) || $(body);

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
		cancel_text: 'Cancel',
		accept_text: 'Confirm',
		cancel_btn_class: '',
		accept_btn_class: '',
		confirm: null,
		cancel: null
	};

	var api = {

		init: function( options ){

			this.ens = '.prompt' + (++instance_counter);

			this.$el = $(
				'<div class="prompt_overlay">\
					<div class="prompt_box">\
						<p>'+ this.options.message +'</p>\
						<div class="controls">\
							<a class="cancel '+ this.options.cancel_btn_class +'">'+ this.options.cancel_text +'</a>\
							<a class="accept '+ this.options.accept_btn_class +'">'+ this.options.accept_text +'</a>\
						</div>\
					</div>\
				 </div>'
			).appendTo($body);

			this.events();

		},

		events: function(){

			var self = this;

			this.$el.on('click' + this.ens, '.cancel', function(){ self.close(); } );
			this.$el.on('click'+ this.ens, '.accept', function(){ self.execute(); } );

			$document.on('keyup'+ this.ens, function(e){
				if ( e.keyCode === 27) { self.close(); }
				if ( e.keyCode === 13) { self.execute(); }
			});

		},

		execute: function(){

			this.close();

			if ( this.options.confirm ) {
				this.options.context ? this.options.confirm.call( this.options.context ) : this.options.confirm();
			}

		},

		close: function(){

			$document.off( this.ens );
			this.$el.remove();

			if ( this.options.cancel ) {
				this.options.context ? this.options.cancel.call( this.options.context ) : this.options.cancel();
			}

		}

	};

	$.extend(Prompt.prototype, api);

	$.wk = $.wk || {};
	$.wk.prompt = PromptFacade;
	$.wk.prompt.defaults = Prompt.defaults;

})(jQuery || Zepto, window, document);