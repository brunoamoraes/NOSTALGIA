(() => {
  'use strict';
  const items = window.BRUNOVERSE_DATA || [];
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const categoryNames={musica:'MÚSICA',filme:'FILME',serie:'SÉRIE'};
  const eraNames={passado:'Passado',presente:'Presente',futuro:'Futuro'};
  let currentEra='todos';
  const dialogs=$$('.site-dialog');
  const detail=$('#detail-dialog');
  const search=$('#search-dialog');
  function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function poster(item){return `<div class="poster theme-${safe(item.theme)}"><span class="poster-type">BRUNOVERSE / ${categoryNames[item.category]}</span><span class="poster-emoji" aria-hidden="true">${item.emoji}</span><span class="poster-caption">${safe(item.title)}</span></div>`;}
  function render(){let shown=0; ['musica','filme','serie'].forEach(category=>{const matching=items.filter(i=>i.category===category&&(currentEra==='todos'||i.era===currentEra));shown+=matching.length;const root=$(`[data-container="${category}"]`);root.innerHTML=matching.map(i=>`<button class="media-card" type="button" data-id="${i.id}" aria-label="Ver detalhes de ${safe(i.title)}">${poster(i)}<div class="media-title">${safe(i.title)}</div><div class="media-meta">${safe(i.subtitle)} · ${i.year}</div></button>`).join('');root.closest('.media-section').hidden=matching.length===0;});$('#empty-state').hidden=shown>0;$$('[data-era-filter]').forEach(btn=>{const active=btn.dataset.eraFilter===currentEra;btn.classList.toggle('selected',active);btn.setAttribute('aria-pressed',String(active));});}
  function openDetail(id){const i=items.find(x=>x.id===Number(id));if(!i)return;$('#detail-content').innerHTML=`<div class="detail-poster theme-${safe(i.theme)}" aria-hidden="true">${i.emoji}</div><span class="detail-label">${categoryNames[i.category]} / ${eraNames[i.era].toUpperCase()}</span><h2>${safe(i.title)}</h2><p class="detail-sub">${safe(i.subtitle)}</p><p class="detail-description">${safe(i.description)}</p><div class="detail-tags"><span>${i.year}</span><span>${safe(i.genre)}</span><span>${i.rating?`Minha nota ilustrativa: ${'★'.repeat(i.rating)}${'☆'.repeat(5-i.rating)}`:(i.era==='futuro'?'Quero conhecer':'Ainda sem nota')}</span></div><p class="detail-sub" style="font-size:11px;margin-top:20px">Os títulos do Passado foram escolhidos por Bruno. Os demais conteúdos ainda podem ser demonstrativos.</p>`;detail.showModal();}
  document.addEventListener('click',e=>{const item=e.target.closest('[data-id]');if(item){const id=item.dataset.id;dialogs.forEach(d=>d.open&&d.close());openDetail(id);return;}const era=e.target.closest('[data-era-filter], [data-filter]');if(era){currentEra=era.dataset.eraFilter||era.dataset.filter;render();$('#colecao').scrollIntoView({behavior:'smooth'});return;}const more=e.target.closest('[data-category]');if(more){window.location.href='pages/'+({musica:'musicas',filme:'filmes',serie:'series'}[more.dataset.category])+'.html';}});
  function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),4300);}
  $('#admin-button').addEventListener('click',()=>showToast('A administração privada será implementada na Etapa 4. Ainda não há login nem edição de dados.'));
  $('#open-search').addEventListener('click',()=>{search.showModal();$('#search-field').value='';renderSearch('');$('#search-field').focus();});
  $$('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
  dialogs.forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close();}));
  function renderSearch(query){const q=query.trim().toLocaleLowerCase('pt-BR');const results=items.filter(i=>(i.title+' '+i.subtitle+' '+i.genre+' '+i.description+' '+eraNames[i.era]).toLocaleLowerCase('pt-BR').includes(q));$('#search-results').innerHTML=`<p class="detail-sub" style="font-size:12px">${results.length} ${results.length===1?'resultado':'resultados'}</p>`+results.map(i=>`<button class="search-result" type="button" data-id="${i.id}"><span>${i.emoji} ${safe(i.title)}</span><small>${categoryNames[i.category]} · ${i.year}</small></button>`).join('');}
  $('#search-field').addEventListener('input',e=>renderSearch(e.target.value));
  const toggle=$('#menu-toggle'),nav=$('#menu');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');toggle.textContent=open?'✕':'☰';});$$('.nav-link').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';$$('.nav-link').forEach(l=>l.classList.remove('active'));link.classList.add('active');}));
  $('#year').textContent=new Date().getFullYear();render();
})();
