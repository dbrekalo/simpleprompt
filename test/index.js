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

    it('produces instance and assignes options', function() {

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
            messageClass: 'message',
            cancelBtnClass: '',
            acceptBtnClass: '',
            inputClass: 'prompt_input',

            closeOnOverlayClick: false,
            closeOnEscapeKey: true,

            hasUserInput: false,

            confirm: null,
            cancel: null,
            afterRender: null,
            validateInput: testValidate
        });

    });

    it('accepts options as object', function() {

        var prompt = new Prompt({
            message: 'Are you sure?'
        });

        assert.propertyVal(prompt.options, 'message', 'Are you sure?');

    });

    it('calls after render method when one is given', function() {

        var test;
        var prompt = new Prompt({
            afterRender: function() {
                test = true;
            }
        });

        assert.isTrue(test);

    });

});

describe('SimplePrompt events', function() {

    it('calls custom method on cancel click when one is given', function() {

        var test;
        var prompt = new Prompt({
            cancel: function() {
                test = true;
            }
        });
        prompt.$el.find('.cancel').trigger('click');

        assert.isTrue(test);

    });

    it('calls custom method on confirm click when one is given', function() {

        var test;
        var prompt = new Prompt({
            confirm: function() {
                test = true;
            }
        });
        prompt.$el.find('.accept').trigger('click');

        assert.isTrue(test);

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
            hasUserInput: true
        });

        assert.isTrue(prompt.$el.find('input').length === 1);

    });

    it('validate if user input is empty on confirm click', function() {

        var prompt = new Prompt({hasUserInput: true});
        $('input').val('');
        $('.accept').trigger('click');

        assert.equal($('.prompt_active').length, 1);

    });

    it('allows custom validate method on confirm click', function() {

        var test;
        var prompt = new Prompt({
            hasUserInput: true,
            validateInput: function(inputText) {
                test = inputText;
                return true;
            }
        });
        $('input').val('message');
        $('.accept').trigger('click');

        assert.equal(test, 'message');

    });

});
