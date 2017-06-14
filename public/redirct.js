window.onload = function(){
  var form = document.createElement('form');
  form.method = "POST";
  form.action = window.location.href;
  console.log(window.location)
  console.log(window.location.href)
  document.body.appendChild(form);
  console.log(form)
  form.submit()
}
