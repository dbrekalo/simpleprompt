var assert = require('chai').assert;
var jsdom = require('jsdom').jsdom;

global.document = jsdom('<body></body>');
global.window = document.defaultView;

var $ = require('jquery');
var Prompt = require('../').SimplePrompt;

describe ('SimplePrompt constructor', function() {

    it('produces instance with or without new keyword', function() {

        assert.instanceOf(new Prompt(), Prompt);
        assert.instanceOf(Prompt(), Prompt);

    });

    it('is assigned to proper namespaces', function() {

        assert.strictEqual($.wk.prompt, Prompt);
        assert.strictEqual($.simplePrompt, Prompt);
        assert.strictEqual($.SimplePrompt, Prompt);

    });

    it('assigns options to instance', function() {

        var testValidate = function() {};

        var prompt = new Prompt({
            message: 'Test',
            validateInput: testValidate
        });

        assert.deepEqual(prompt.options, {
            message: 'Test',
            cancelText: 'Cancel',
            acceptText: 'Confirm',

            htmlClass: 'prompt_active',
            overlayClass: 'prompt_overlay',
            moduleClass: 'prompt_box',
            inputClass: 'prompt_input',
            messageClass: 'message',
            cancelBtnClass: '',
            acceptBtnClass: '',

            closeOnOverlayClick: false,
            closeOnEscapeKey: true,

            requiresUserInput: false,

            confirm: null,
            cancel: null,
            context: null,
            afterRender: null,
            validateInput: testValidate
        });

    });

    it('calls after render method when one is given with correct parameters', function() {

        var prompt = new Prompt({
            afterRender: function($promptEl, promptInstance) {
                assert.instanceOf($promptEl, $);
                assert.instanceOf(promptInstance, Prompt);
            }
        });

    });

});

describe('SimplePrompt templating', function() {

    it('properly setups html classes to elements', function() {

        var prompt = Prompt({
            htmlClass: 'prompt_active',
            overlayClass: 'prompt_overlay',
            moduleClass: 'prompt_box',
            messageClass: 'message',
            cancelBtnClass: 'cancel_btn',
            acceptBtnClass: 'accept_btn',
            requiresUserInput: true,
            inputClass: 'prompt_input'
        });

        assert.isTrue($('html').hasClass('prompt_active'));
        assert.isTrue(prompt.$el.hasClass('prompt_overlay'));
        assert.isTrue(prompt.$el.find('.prompt_box').length > 0);
        assert.isTrue(prompt.$el.find('.message').length > 0);
        assert.isTrue(prompt.$el.find('.cancel_btn').length > 0);
        assert.isTrue(prompt.$el.find('.accept_btn').length > 0);
        assert.isTrue(prompt.$el.find('input').hasClass('prompt_input'));

    });

});

describe('SimplePrompt events', function() {

    it('calls confirm callback on accept', function() {

        var confirmCallbackCalled1 = false;
        var confirmCallbackCalled2 = false;

        Prompt({
            confirm: function() {
                confirmCallbackCalled1 = true;
            }
        }).$el.find('.accept').trigger('click');

        Prompt('Test message', function() {
            confirmCallbackCalled2 = true;
        }).$el.find('.accept').trigger('click');

        assert.isTrue(confirmCallbackCalled1);
        assert.isTrue(confirmCallbackCalled2);

    });

    it('calls cancel callback on reject', function() {

        var cancelCallbackCalled1 = false;
        var cancelCallbackCalled2 = false;

        Prompt({
            cancel: function() {
                cancelCallbackCalled1 = true;
            }
        }).$el.find('.cancel').trigger('click');

        Prompt('Test message', null, function() {
            cancelCallbackCalled2 = true;
        }).$el.find('.cancel').trigger('click');

        assert.isTrue(cancelCallbackCalled1);
        assert.isTrue(cancelCallbackCalled2);

    });

    it('close prompt on escape key', function() {

        var prompt = new Prompt();
        var e = $.Event('keyup');
        e.keyCode = 27;
        $(document).trigger(e);

        assert.equal($('.prompt_active').length, 0);

    });

    it('close prompt on overlay click', function() {

        var prompt = new Prompt({
            closeOnOverlayClick: true
        });
        $('.prompt_overlay').trigger('click');

        assert.equal($('.prompt_active').length, 0);

    });

});

describe('SimplePrompt user input', function() {

    it('adds user input field', function() {

        var prompt = new Prompt({
            requiresUserInput: true
        });

        assert.isTrue(prompt.$el.find('input').length === 1);

    });

    it('validate if user input is empty on confirm click', function() {

        var prompt = new Prompt({requiresUserInput: true});
        $('.accept').trigger('click');

        assert.equal($('.prompt_active').length, 1);

    });

    it('allows custom validation', function() {

        var test = false;
        var prompt = Prompt({
            requiresUserInput: true,
            validateInput: function(inputText) {
                return inputText.length > 6;
            },
            confirm: function() {
                test = true;
            }
        });

        prompt.$el.find('input').val('test');
        prompt.$el.find('.accept').trigger('click');

        assert.isFalse(test);

    });

    it('runs confirm callback with right parameters', function() {

        var prompt = Prompt({
            requiresUserInput: true,
            confirm: function(inputText, promptInstance) {
                assert.equal(inputText, 'testString');
                assert.instanceOf(promptInstance, Prompt);
                assert.strictEqual(this, window);
            }
        });

        prompt.$el.find('input').val('testString');
        prompt.$el.find('.accept').trigger('click');

    });

});
