/*
const btn = document.querySelector(".btn-toggle");
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark');

btn.addEventListener('change', function () {
  if (prefersDarkScheme.matches {
    document.body.classList.toggle('light-theme');

  } else {
    document.body.classList.toggle('dark-theme');
  }
});
*/
function dark_mode()
	{
		var element = document.body;
		element.classList.toggle('dark-theme');
	}