;(function($, window, document) {

    var instanceCounter = 0,
        $document = $(document),
        $html = $('html'),
        $body;

    function Prompt(message, confirmCallback, cancelCallback) {

        return this instanceof Prompt ? this.init(arguments.length === 1 ? message : {
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

            this.options.afterRender && this.options.afterRender(this.$el, this);

            $html.addClass(this.options.htmlClass);

            this.$el.find('.accept').focus();

            this.events();

        },

        events: function() {

            var self = this;

            this.$el.on('click' + this.ens, '.cancel', function(e) {

                e.preventDefault(); self.close();

            }).on('click' + this.ens, '.accept', function(e) {

                e.preventDefault(); self.execute();

            });

            this.options.closeOnOverlayClick && this.$el.on('click', function(e) {
                $(e.target).is(self.$el) && self.close();
            });

            this.options.closeOnEscapeKey && $document.on('keyup' + this.ens, function(e) {
                e.keyCode === 27 && self.close();
            });

        },

        execute: function() {

            this.options.confirm && this.options.confirm.call(this.options.context || window);

            this.destroy();

        },

        close: function() {

            this.options.cancel && this.options.cancel.call(this.options.context || window);

            this.destroy();

        },

        destroy: function() {

            $document.off(this.ens);
            $html.removeClass(this.options.htmlClass);
            this.$el.remove();

        }

    });

    $.wk = $.wk || {};
    $.wk.prompt = Prompt;

    $.wk.prompt.defaults = Prompt.defaults = {
        message: 'Are you sure',
        cancelText: 'Cancel',
        acceptText: 'Confirm',

        htmlClass: 'prompt_active',
        overlayClass: 'prompt_overlay',
        moduleClass: 'prompt_box',
        messageClass: 'message',
        cancelBtnClass: '',
        acceptBtnClass: '',

        closeOnOverlayClick: false,
        closeOnEscapeKey: true,

        confirm: null,
        cancel: null,
        afterRender: null
    };

})(window.jQuery || window.Zepto, window, document);
