
Template.registerHelper('mathjax', function () {
	var options = this,
	    wait = options.wait !== undefined ? options.wait : false;

	var update = function (firstNode, lastNode) {
		var alreadyThere = false;
		$(firstNode).parent().contents().each(function (index, node) {
			// TODO add support for text nodes
			if (node === firstNode) {
				alreadyThere = true;
			}
			if (alreadyThere && this.nodeType === 1) {
				MathJax.Hub.Queue(["Typeset", MathJax.Hub, this]);
			}
			return this !== lastNode;
		});
	}

	var mathjax = new Template('mathjax', function () { // render func
		var view = this, content = '';
		if (view.templateContentBlock) {
			// this will trigger rerender every time the content is changed
			content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
		}
		return view.templateContentBlock;
	});

	mathjax.rendered = function () {
		var self = this;
		//---------------------------------
		onMathJaxReady(function (MathJax) {
			if (!wait) {
				Meteor.defer(function () { update(self.firstNode, self.lastNode); });
			} else {
				update(self.firstNode, self.lastNode);
			}
		}); // ready
	};

	return mathjax;
});

// loading MathJax

function onMathJaxReady(callback) {
	if (window.MathJax) {
		callback(window.MathJax);
	} else {
		if (!onMathJaxReady.listeners) {
			$.getScript( // TODO: let the user change the source
				'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'
			).done(function () {
					//------------------
					MathJax.Hub.Config({
						skipStartupTypeset: true,
						showProcessingMessages: false,
						tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] ,processEscapes: true},
						menuSettings: {
							zoom: "None",        //  when to do MathZoom
							CTRL: false,         //    require CTRL for MathZoom?
							ALT: false,          //    require Alt or Option?
							CMD: false,          //    require CMD?
							Shift: false,        //    require Shift?
							zscale: "150%",      //  the scaling factor for MathZoom
							font: "Auto",        //  what font HTML-CSS should use
							context: "MathJax",  //  or "Browser" for pass-through to browser menu
							mpContext: false,    //  true means pass menu events to MathPlayer in IE
							mpMouse: false,      //  true means pass mouse events to MathPlayer in IE
							texHints: true,      //  include class names for TeXAtom elements
							semantics: false     //  add semantics tag with original form in MathML output
						},
						TeX: {
							Macros: {
								dag: ["\\dagger"],
								uppi:["\\pi"],
								emph:["\\textit{}"]
							}
						}
					});
					//-------------------------------------------------------------------------------------------------------
					while (onMathJaxReady.listeners.length > 0) { onMathJaxReady.listeners.pop().call(null, window.MathJax) }
				});
			onMathJaxReady.listeners = [];
		}
		onMathJaxReady.listeners.push(callback);
	}
}
