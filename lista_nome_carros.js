const links = document.querySelectorAll('.wiki-flexi-gallery a[href^="/wiki/"]');

links.forEach(link => {
  console.log(link.href);
});
