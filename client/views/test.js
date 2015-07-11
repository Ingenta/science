Router.route("test",{
	path:"/test"
});

Template.test.helpers({
	tex:function(){
		//return "\\begin{align*}"+
		//"\\frac{\\rm d}{{\\rm d}t}\\hat{q}=\\;&\\frac{\\hat{p}}{m}, \\tag 4\\\\"+
		//"\\frac{{\\rm d}}{{\\rm d}t}\\hat{p}=\\;&-\\hbar\\omega_c^\\prime(\\hat{q})\\hat{a}^\\dag\\hat{a}-m\\omega_m^2(\\hat{q}-q_s)-\\gamma\\hat{p}+\\hat{\\eta}, \\tag 5\\\\"+
		//"\\frac{{\\rm d}}{{\\rm d}t}\\hat{a}=\\;&-{\\rm i}[\\omega_c(\\hat{q})-\\omega_l]\\hat{a}-{\\rm i}\\alpha_{\\rm L}-\\kappa\\hat{a}+\\sqrt{2\\kappa}\\hat{a}_{\\rm in},\\tag 6"+
		//"\\end{align*}";

		return "\\begin{align*}"
			+"H=\\;&\\hbar[\\omega_c(\\hat{q})-\\omega_l]\\hat{a}^\\dagger \\hat{a}+\\frac{\\hat{p}^2}{2m}+\\frac{1}{2}m\\omega_{m}^2 (\\hat{q}-q_s)^2 \\\\"
			+"\\;&+\\hbar\\alpha_{\\rm L}(\\hat{a}+\\hat{a}^\\dag)+H_{\\kappa}+H_{\\gamma},\\tag 3"
			+"\\end{align*}";
	}
})