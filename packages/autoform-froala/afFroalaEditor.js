AutoForm.addInputType('jkfroala', {
    template: "afReactiveFroala",
    valueOut: function () {
        return $(this).froalaEditor('html.get', true, true);
    }
});

Template.afReactiveFroala.helpers({
    atts: function(){
        var atts = _.clone(this.atts);

        // Remove froalaOptions so doesn't get rendered as html attrib
        delete atts.froalaOptions;
        return atts;
    }
});

Template.afReactiveFroala.onCreated(function () {
    this.value = new ReactiveVar(this.data.value);
})

Template.afReactiveFroala.onRendered(function(){
    var self = this,
        $input = self.$('textarea'),
        froalaMethod;

    self.lastData = self.data;

    if ($input.length !== 1) {
        throw new Error ('invalid-froala-reactive-template');
    }

    froalaMethod = getFroalaEditorJQueryInstanceMethod($input);

    if (!froalaMethod) {
        throw new Error('invalid-froala-editor-plugin');
    }

    initEditor(self, self.data, self.lastData, $input, froalaMethod, self.data.atts.froalaOptions);

    // Autorun block, re-run every time the data context changes
    self.autorun(function () {
        // Set up reactive dependency on template's data context
        var _data = Template.currentData();

        Tracker.nonreactive(function () {
            // Update HTML data wrapped within froala editor, if changed
            var currentHTMLWithMarkers = $input[froalaMethod]('html.get', _data._keepMarkers /* keep_markers */);
            if (_data && currentHTMLWithMarkers !== _data.value) {
                // Avoid calling html.set with null
                // See: https://github.com/froala/wysiwyg-editor/issues/1061
                $input[froalaMethod]('html.set', _data.value || "");
                _data._keepMarkers && $input[froalaMethod]('selection.restore');
            }

            // Update froala editor option values, if changed
            var _changedOpts = _.filter(Object.keys(_data), function (opt) {
                // Find all option values whose value has changed
                // Exclude any opt properties that start with '_', reserved for
                // passing froala-reactive - specific parameters into the template
                // data context.
                return opt.indexOf('_')!==0 && !_.isEqual(self.lastData[opt], _data[opt]);
            });
            if (_changedOpts.length > 0) {
                // Destroy and re-init the editor
                var _snapshot = self.editor.froalaEditor('snapshot.get');
                self.editor.froalaEditor('destroy');
                initEditor(self, _data, self.lastData, $input, froalaMethod, self.data.atts.froalaOptions);
                self.editor.froalaEditor('snapshot.restore', _snapshot);
            }

            // Save current data context for comparison on next autorun execution
            self.lastData = _data;
        })

    });
});

/**
 * Ensure froalaEditor is properly removed to prevent memory leaks
 */
Template.afReactiveFroala.onDestroyed(function () {
    var self = this,
        $input = self.$('.'+self.wrapperClassName),
        froalaMethod;

    froalaMethod = getFroalaEditorJQueryInstanceMethod($input);

    if (!froalaMethod) {
        return;
    }

    if (!$input.data('froala.editor')) {
        // Restore internal 'froala_editor' reference to froala editor.
        // For some reason, by the time we get here in the destroyed procedure,
        // this jQuery data appears to have been wiped.
        // See: https://github.com/froala/froala-reactive/issues/2
        $input.data('froala.editor', self.__froala_editor);
    }

    // Destroy froala editor object itself
    // This may throw an exception if Meteor has already torn down part of the DOM
    // managed by Froala Editor, so we wrap this in a try / catch block to
    // silently ignore any such cases
    try {
        $input[froalaMethod]('destroy');
    } catch (e) {}

    // Workround for https://github.com/froala/wysiwyg-editor/issues/844
    $('.fr-modal').remove();
    $('.fr-overlay').remove();
});

/** Initialise Froala Editor instance */
function initEditor(self, data, lastData, $input, froalaMethod, dropdownOptions) {

    // Assign basic editor variables
    data.inlineMode = false;
    data.buttons = [];
    data.customDropdowns = {};
    data.linkAlwaysBlank=true;

    data.theme=dropdownOptions.theme;
    data.height = dropdownOptions.height;
    data.inlineMode = dropdownOptions.inlineMode;
    data.toolbarButtons = dropdownOptions.buttons;
    data.toolbarButtonsMD = dropdownOptions.buttons;
    data.toolbarButtonsXS = dropdownOptions.buttons;

    if(dropdownOptions.imageUploadURL) {
        data.imageUploadURL = dropdownOptions.imageUploadURL;
    }

    if(dropdownOptions.fileUploadURL) {
        data.fileUploadURL = dropdownOptions.fileUploadURL;
    }

    if(!_.isEmpty(dropdownOptions.customDropdowns)){
        // Make sure all dropdowns are added to buttons
        $.each(dropdownOptions.customDropdowns, function(key, val){
            if(data.toolbarButtons.indexOf(key) == -1) {
                data.toolbarButtons.push(key);
            }
        });

        // Assign dropdowns
        data.customDropdowns = dropdownOptions.customDropdowns;

        // Convert each of the dropdowns options from string to function format
        _.each(dropdownOptions.customDropdowns, function(dd, name) {
            if(!dd.inverted) {
                dd.options = _.invert(dd.options)
            }

            dd.inverted = true;

            $.FroalaEditor.DefineIcon(name, { NAME: "lg "+dd.icon.value });
            $.FroalaEditor.RegisterCommand(name, {
                title: dd.title,
                type: 'dropdown',
                focus: false,
                undo: false,
                refreshAfterCallback: true,
                options: dd.options,
                callback: function (cmd, val) {
                    this.html.insert(val);
                }
            });
        });
    }

    // Set up additional event handlers
    var eventHandlers = getEventHandlerNames(self.data);
    _.each(eventHandlers, function (opt) {
        var _eventName = 'froalaEditor.' + opt.substring(3); // Remove '_on' prefix
        $input.on(_eventName, function (e) {
            e.preventDefault();
            // Call callback, setting `this` to the latest, reactive, data context
            // of this template instance.
            // Callback function can use `this.value` to get up-to-date model value.
            // Also note that these callbacks fire AFTER the autorun function
            // has triggered if the data context changed. Hence, we pass the `lastData`
            // property as the data context for the callback function, not the original
            // `self.data` object.
            return self.data[opt].apply(lastData, arguments);
        });
    });

    // Create Froala Editor instance, setting options & initial HTML content
    // from template data context
    self.editor = $input[froalaMethod](data);
    if (self.data.value) {
        $input[froalaMethod]('html.set', data.value);
    }

    // Hack to provide destroyed callback with froala editor object,
    // by stuffing a reference to it in the template instance object.
    // See: https://github.com/froala/froala-reactive/issues/2
    self.__froala_editor = $input.data('froala.editor');
}

/**
 * Internal function to return correct Froala Editor instance method name
 *
 */
function getFroalaEditorJQueryInstanceMethod(froalaJQueryObject) {
    if (froalaJQueryObject) {
        if (_.isFunction(froalaJQueryObject.froalaEditor)) {
            // Original froala jQuery instance method
            return 'froalaEditor';
        }
    }
    // Whoops! Looks like froala editor code has not been loaded
    return null;
};

/**
 * Internal function to parse any '_on<event>' event callback arguments
 */
function getEventHandlerNames(tmplData) {
    return _.filter(Object.keys(tmplData), function (opt) {
        return opt.indexOf('_on') === 0 && // Include if '_on...'
            _.isFunction(tmplData[opt]); // and handler is indeed a function
    });
}