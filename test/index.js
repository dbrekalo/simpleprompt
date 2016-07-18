var assert = require("chai").assert;
var jsdom = require("jsdom").jsdom;

var document = global.document = jsdom('<body></body>');
var window = global.window = document.defaultView;

var $ = require('jquery');
var SimplePrompt = require("../");

var Prompt = $.simplePrompt;

describe ("SimplePrompt constructor", function() {

    it('produces instance and assignes options', function() {

        var prompt = new Prompt('Test');

        assert.instanceOf(prompt, Prompt);
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

            closeOnOverlayClick: false,
            closeOnEscapeKey: true,

            confirm: null,
            cancel: null,
            afterRender: null
        });

    });

    it('produces instance without new keyword', function() {

        var prompt = Prompt();

        assert.instanceOf(prompt, Prompt);

    });

    it('accepts options as object', function() {

        var prompt = new Prompt({
            message: 'Are you sure?',
        });

        assert.propertyVal(prompt.options, 'message', 'Are you sure?');

    });

    it('calls after render method when one is given', function() {

        var test;
        var prompt = new Prompt({
            afterRender: function(){
                test = true;
            }
        });

        assert.isTrue(test);

    });

});

describe("SimplePrompt events", function() {

    it('calls custom method on cancel click when one is given', function() {

        var test;
        var prompt = new Prompt({
            cancel: function(){
                test = true;
            }
        });
        $('.cancel').trigger('click');

        assert.isTrue(test);

    });

    it('calls custom method on confirm click when one is given', function() {

        var test;
        var prompt = new Prompt({
            confirm: function(){
                test = true;
            }
        });
        $('.accept').trigger('click');

        assert.isTrue(test);

    });

    it('close prompt on escape key', function() {

        var prompt = new Prompt();
        var e = $.Event("keyup");
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

