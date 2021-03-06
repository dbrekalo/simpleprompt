(function(factory) {

    /* istanbul ignore next */
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }

}(function($) {

    var instanceCounter = 0,
        $document = $(window.document),
        $html,
        $body;

    function Prompt(message, confirmCallback, cancelCallback) {

        return this instanceof Prompt ? this.init(typeof message === 'object' ? message : {
            message: message,
            confirm: confirmCallback,
            cancel: cancelCallback
        }) : new Prompt(message, confirmCallback, cancelCallback);

    }

    $.extend(Prompt.prototype, {

        init: function(options) {

            this.options = $.extend({}, Prompt.defaults, options);
            this.ens = '.prompt' + (++instanceCounter);

            this.$el = $(
                '<div class="' + this.options.overlayClass + '">\
                    <div class="' + this.options.moduleClass + '">\
                        <p class="' + this.options.messageClass + '">' + this.options.message + '</p>\
                        <div class="controls">\
                            <a href="#" class="cancel ' + this.options.cancelBtnClass + '">' + this.options.cancelText + '</a>\
                            <a href="#" class="accept ' + this.options.acceptBtnClass + '">' + this.options.acceptText + '</a>\
                        </div>\
                    </div>\
                 </div>'
            ).appendTo($body = $body || $('body'));

            if (this.options.requiresUserInput) {
                this.$userInput = $('<input class="' + this.options.inputClass + '" type="text">').insertAfter(this.$el.find('.message'));
            }

            this.options.afterRender && this.options.afterRender(this.$el, this);

            ($html = $html || $('html')).addClass(this.options.htmlClass);

            this.$el.find('.accept').focus();

            this.events();

        },

        events: function() {

            var self = this;

            this.$el.on('click' + this.ens, '.cancel', function(e) {

                e.preventDefault(); self.close();

            }).on('click' + this.ens, '.accept', function(e) {

                e.preventDefault();

                if (self.options.requiresUserInput) {
                    self.validate() && self.execute();
                } else {
                    self.execute();
                }

            });

            this.options.closeOnOverlayClick && this.$el.on('click', function(e) {
                $(e.target).is(self.$el) && self.close();
            });

            this.options.closeOnEscapeKey && $document.on('keyup' + this.ens, function(e) {
                e.keyCode === 27 && self.close();
            });

        },

        validate: function() {

            return this.options.validateInput(this.$userInput.val(), this.$userInput, this);

        },

        execute: function() {

            var userInput = this.options.requiresUserInput ? this.$userInput.val() : undefined;

            this.options.confirm && this.options.confirm.call(this.options.context || window, userInput, this);

            return this.destroy();

        },

        close: function() {

            this.options.cancel && this.options.cancel.call(this.options.context || window);
            return this.destroy();

        },

        destroy: function() {

            $document.off(this.ens);
            $html.removeClass(this.options.htmlClass);
            this.$el.remove();

            return this;

        }

    });

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

    $.wk = $.wk || {};
    $.wk.prompt = $.simplePrompt = $.SimplePrompt = Prompt;

    return $;

}));
