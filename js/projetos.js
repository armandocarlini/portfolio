/* Capturas ampliáveis; as explicações permanecem no fluxo da página. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'tela-dialog';
  dialog.setAttribute('aria-label', 'Interface ampliada');
  dialog.innerHTML = '<button type="button" autofocus>Fechar ×</button><img alt=""><p></p>';
  document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();} });
  dialog.addEventListener('close', () => { document.body.style.overflow=''; window.__lenis?.start(); });
  document.querySelectorAll('.ampliar-tela').forEach(button => button.addEventListener('click', () => {
    const img=button.querySelector('img');
    dialog.querySelector('img').src=img.currentSrc || img.src;
    dialog.querySelector('img').alt=img.alt;
    dialog.querySelector('p').textContent=img.alt;
    dialog.showModal();dialog.scrollLeft=0;dialog.scrollTop=0;
    document.body.style.overflow='hidden';window.__lenis?.stop();
  }));
  if(!document.body.classList.contains('pagina-projetos')||!window.gsap||!window.ScrollTrigger)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.projetos-abertura h1',{y:45,opacity:0,duration:1,ease:'power3.out'});
    document.querySelectorAll('.estudo .captura').forEach((el,i)=>gsap.from(el,{y:65,rotation:i%2?1.5:-1,scale:.96,opacity:0,ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 60%',scrub:.4}}));
    document.querySelectorAll('.estudo-cab,.implementacao,.dec article').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.7,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    gsap.to('.barra-p',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
    gsap.to('.perola',{'--ang':'300deg',ease:'none',scrollTrigger:{start:0,end:'max',scrub:true}});
  });
})();
