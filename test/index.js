var assert = require('chai').assert;
var jsdom = require('jsdom').jsdom;
var sinon = require('sinon');

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

        var prompt = new Prompt({
            confirm: sinon.spy()
        });

        prompt.$el.find('.accept').trigger('click');
        sinon.assert.calledOnce(prompt.options.confirm);

        prompt = new Prompt('Test message', sinon.spy());

        prompt.$el.find('.accept').trigger('click');
        sinon.assert.calledOnce(prompt.options.confirm);

    });

    it('calls cancel callback on reject', function() {

        var prompt = new Prompt({
            cancel: sinon.spy()
        });

        prompt.$el.find('.cancel').trigger('click');
        sinon.assert.calledOnce(prompt.options.cancel);

        prompt = new Prompt('Test message', null, sinon.spy());

        prompt.$el.find('.cancel').trigger('click');
        sinon.assert.calledOnce(prompt.options.cancel);

    });

    it('close prompt on escape key', function() {

        var prompt = new Prompt();
        var e = $.Event('keyup');
        e.keyCode = 27;

        var closeOnEscapeSpy = sinon.spy(prompt, 'close');
        $(document).trigger(e);

        sinon.assert.calledOnce(closeOnEscapeSpy);
        closeOnEscapeSpy.restore();

    });

    it('close prompt on overlay click', function() {

        var prompt = new Prompt({
            closeOnOverlayClick: true
        });

        var closeOnOverlaySpy = sinon.spy(prompt, 'close');
        $('.prompt_overlay').trigger('click');

        sinon.assert.calledOnce(closeOnOverlaySpy);
        closeOnOverlaySpy.restore();

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

        var prompt = new Prompt({
            requiresUserInput: true,
            validateInput: sinon.spy()
        });

        $('.accept').trigger('click');

        sinon.assert.calledOnce(prompt.options.validateInput);
        sinon.assert.notCalled(sinon.spy(prompt, 'close'));

    });

    it('allows custom validation', function() {

        var test = false;
        var prompt = Prompt({
            requiresUserInput: true,
            validateInput: function(inputText) {
                return inputText.length > 6;
            },
            confirm: sinon.spy()
        });

        var validateSpy = sinon.spy(prompt.options, 'validateInput');

        prompt.$el.find('input').val('test123');
        prompt.$el.find('.accept').trigger('click');

        sinon.assert.calledOnce(validateSpy);
        sinon.assert.calledWith(validateSpy, 'test123');
        sinon.assert.calledOnce(prompt.options.confirm);

        validateSpy.restore();

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
