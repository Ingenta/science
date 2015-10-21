Router.route("test",{
	path:"/test"
});

Template.test1.helpers({
	tex:function(){
		return  Blaze.toHTML(Template["test1"]).replace(/&lt;/g,"<");
		//return "\\begin{align*}"+
		//"\\frac{\\rm d}{{\\rm d}t}\\hat{q}=\\;&\\frac{\\hat{p}}{m}, \\tag 4\\\\"+
		//"\\frac{{\\rm d}}{{\\rm d}t}\\hat{p}=\\;&-\\hbar\\omega_c^\\prime(\\hat{q})\\hat{a}^\\dag\\hat{a}-m\\omega_m^2(\\hat{q}-q_s)-\\gamma\\hat{p}+\\hat{\\eta}, \\tag 5\\\\"+
		//"\\frac{{\\rm d}}{{\\rm d}t}\\hat{a}=\\;&-{\\rm i}[\\omega_c(\\hat{q})-\\omega_l]\\hat{a}-{\\rm i}\\alpha_{\\rm L}-\\kappa\\hat{a}+\\sqrt{2\\kappa}\\hat{a}_{\\rm in},\\tag 6"+
		//"\\end{align*}";

		//return "\\begin{align*}"
		//	+"H=\\;&\\hbar[\\omega_c(\\hat{q})-\\omega_l]\\hat{a}^\\dagger \\hat{a}+\\frac{\\hat{p}^2}{2m}+\\frac{1}{2}m\\omega_{m}^2 (\\hat{q}-q_s)^2 \\\\"
		//	+"\\;&+\\hbar\\alpha_{\\rm L}(\\hat{a}+\\hat{a}^\\dag)+H_{\\kappa}+H_{\\gamma},\\tag 3"
		//	+"\\end{align*}";

		//return "\\begin{align}"
		//+"\\tau_{q}[\\rho_{q}({\\emph{\\textbf{r}}})]=&\\frac{3}{5}(3\\uppi^2)^{2/3}\\rho^{5/3}_{q}+\\frac{1}{36}\\frac{(\\nabla\\rho_{q})^2}{\\rho_{q}}\\nonumber\\\\"
		//+"&+\\frac{1}{3}\\Delta\\rho_{q}+\\frac{1}{6}\\frac{\\nabla\\rho_{q}\\nabla f_{q}+\\rho_{q}\\Delta f_{q}}{f_{q}}\\nonumber\\\\"
		//+"&-\\frac{1}{12}\\rho_{q}\\bigg(\\frac{\\nabla f_{q}}{f_{q}}\\bigg)^2+\\frac{1}{2}\\rho_{q}\\bigg[\\frac{2m}{\\hbar^2}\\frac{W_{0}}{2}\\frac{\\nabla(\\rho+\\rho_{q})}{f_{q}}\\bigg]^2"
		//+"\\end{align}";
	}
})

Meteor.startup(function(){

})
