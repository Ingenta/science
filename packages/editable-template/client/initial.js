/**
 * Created by jiangkai on 15/10/21.
 */
//client side only

Meteor.subscribe("allEditableTemplate");

JET.tempName = "_previewEditableTemplate";

JET.dataEditor = undefined;

JET.templateEditor = undefined;


CodeMirror.defineExtension("autoFormatRange", function (from, to) {
	var cm = this;
	var outer = cm.getMode(), text = cm.getRange(from, to).split("\n");
	var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
	var tabSize = cm.getOption("tabSize");

	var out = "", lines = 0, atSol = from.ch == 0;
	function newline() {
		out += "\n";
		atSol = true;
		++lines;
	}

	for (var i = 0; i < text.length; ++i) {
		var stream = new CodeMirror.StringStream(text[i], tabSize);
		while (!stream.eol()) {
			var inner = CodeMirror.innerMode(outer, state);
			var style = outer.token(stream, state), cur = stream.current();
			stream.start = stream.pos;
			if (!atSol || /\S/.test(cur)) {
				out += cur;
				atSol = false;
			}
			if (!atSol && inner.mode.newlineAfterToken &&
				inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i+1] || "", inner.state))
				newline();
		}
		if (!stream.pos && outer.blankLine) outer.blankLine(state);
		if (!atSol) newline();
	}

	cm.operation(function () {
		cm.replaceRange(out, from, to);
		for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur)
			cm.indentLine(cur, "smart");
		cm.setSelection(from, cm.getCursor(false));
	});
});