/**
 * Created by jiangkai on 15/10/21.
 */
//client side only

Meteor.subscribe("allEditableTemplate");

JET.previewTemplate = new ReactiveVar("");

JET.previewData = new ReactiveVar({});

JET.selector = "#editorContainer";

JET.tempName = "_previewEditableTemplate";
