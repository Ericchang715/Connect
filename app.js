(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const D=window.CONNECT_STORY, fmt=n=>n.toLocaleString('zh-TW');
  let activeCase='ncue',activeStep=0,chapter=0,focusMode=false,speakerOpen=false;
  $('#schoolCards').innerHTML=D.cases.map((c,i)=>`<article class="school-card"><a href="#cases" data-open-case="${c.id}" class="school-picture" style="display:block" aria-label="查看${c.short}推廣案例"><img src="${c.image}" alt="原簡報的${c.short}校園示意圖" loading="lazy" width="1080" height="420"><span>原簡報示意圖</span></a><div class="school-card-body"><div class="school-card-header"><div><h3>${c.name}</h3><p>${c.teacher} 老師</p></div><span>0${i+1}</span></div><div class="school-card-count">${c.count}<small>個 Connect${c.id==='tunghai'?' · 兩年期':''}</small></div><div class="school-card-bottom"><span>${c.tag}</span><a href="#cases" data-open-case="${c.id}" aria-label="查看${c.short}案例">↗</a></div></div></article>`).join('');
  $('#workflowTabs').innerHTML=D.workflow.map((w,i)=>`<button class="workflow-tab ${i===0?'active':''}" id="workflow-tab-${i}" role="tab" aria-selected="${i===0}" aria-controls="workflowPanel" tabindex="${i===0?0:-1}" data-step="${i}"><span>0${i+1}</span><div><h3>${w.name}</h3><small>${w.en}</small></div></button>`).join('');
  $('#caseTabs').innerHTML=D.cases.map((c,i)=>`<button class="case-tab ${i===0?'active':''}" id="case-tab-${c.id}" role="tab" aria-selected="${i===0}" aria-controls="casePanel" tabindex="${i===0?0:-1}" data-case="${c.id}"><span>0${i+1}</span><div><strong>${c.short}</strong><small>${c.tag}</small></div><b>${c.count}</b></button>`).join('');

  function renderWorkflow(){
    const w=D.workflow[activeStep];
    $$('[data-step]').forEach(b=>{const a=Number(b.dataset.step)===activeStep;b.classList.toggle('active',a);b.setAttribute('aria-selected',String(a));b.tabIndex=a?0:-1;});
    $('#workflowPanel').setAttribute('aria-labelledby',`workflow-tab-${activeStep}`);
    $('#workflowPanel').innerHTML=`<div><span class="overline">STEP 0${activeStep+1} · ${w.en}</span><h3>${w.title}</h3><p class="step-body">${w.body}</p><span class="step-owner">${w.owner}</span></div><div class="step-questions"><span>這一步，要先確認</span><ul>${w.points.map(p=>`<li>${p}</li>`).join('')}</ul><div class="step-output"><span>需要留下的結果</span><strong>${w.output}</strong></div></div>`;
  }
  function renderCase(){
    const c=D.cases.find(c=>c.id===activeCase);
    $$('[data-case]').forEach(b=>{const a=b.dataset.case===activeCase;b.classList.toggle('active',a);b.setAttribute('aria-selected',String(a));b.tabIndex=a?0:-1;});
    $('#casePanel').setAttribute('aria-labelledby',`case-tab-${c.id}`);
    $('#casePanel').innerHTML=`<aside class="case-side"><div class="case-side-image"><img src="${c.image}" alt="原簡報的${c.short}校園示意圖" width="1080" height="420" loading="lazy"><span>原簡報示意圖</span></div><div class="case-side-copy"><span class="overline">CAMPUS CASE · ${c.tag}</span><h3>${c.name}</h3><p>${c.teacher} 老師</p><div class="case-adoption">${c.count}<small>個 Connect</small></div><div class="case-follow"><span>採用後優先追蹤</span><p>${c.follow}</p></div></div></aside><div class="case-content"><h3>${c.title}</h3><p class="case-context">${c.context}</p><div class="case-steps">${c.steps.map(([t,p],i)=>`<article class="case-step"><span>0${i+1}</span><div><h4>${t}</h4><p>${p}</p></div></article>`).join('')}</div><div class="case-prices"><span>案例當時方案 · 原簡報列示</span>${c.prices.map(([label,p])=>`<div class="price-line"><span>${label}</span><strong>${p}</strong></div>`).join('')}</div><p class="case-lesson">經驗整理：${c.lesson}</p><div class="case-source"><span>來源：原簡報第 ${c.source} 頁</span><button class="text-link" data-source="case-${c.id}">檢視原始內容 ↗</button></div></div>`;
  }
  function keyboardTabs(e,type){
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();
    const list=type==='workflow'?D.workflow:D.cases;
    let idx=type==='workflow'?activeStep:D.cases.findIndex(c=>c.id===activeCase);
    idx=e.key==='Home'?0:e.key==='End'?list.length-1:(idx+(e.key==='ArrowRight'?1:-1)+list.length)%list.length;
    if(type==='workflow'){activeStep=idx;renderWorkflow();$(`#workflow-tab-${idx}`).focus();}
    else{activeCase=D.cases[idx].id;renderCase();$(`#case-tab-${activeCase}`).focus();}
  }
  $('#workflowTabs').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b){activeStep=Number(b.dataset.step);renderWorkflow();}});
  $('#workflowTabs').addEventListener('keydown',e=>keyboardTabs(e,'workflow'));
  $('#caseTabs').addEventListener('click',e=>{const b=e.target.closest('[data-case]');if(b){activeCase=b.dataset.case;renderCase();}});
  $('#caseTabs').addEventListener('keydown',e=>keyboardTabs(e,'cases'));
  document.addEventListener('click',e=>{const a=e.target.closest('[data-open-case]');if(a){activeCase=a.dataset.openCase;renderCase();}});

  const videos=$$('video');
  $$('[data-play]').forEach(b=>b.addEventListener('click',async()=>{
    const v=$('#'+b.dataset.play);
    try{await v.play();b.hidden=true;}catch{toast('請使用影片下方的原生播放控制，或開啟原始影片。');}
  }));
  videos.forEach(v=>{
    v.addEventListener('play',()=>{
      videos.filter(other=>other!==v).forEach(other=>other.pause());
      const b=$(`[data-play="${v.id}"]`);if(b)b.hidden=true;
    });
    v.addEventListener('error',()=>toast('影片暫時無法載入，請重新播放或使用來源說明中的原始影片連結。'));
  });

  const sourceInfo={
    overview:{title:'資料與整理說明',page:1,blocks:[
      ['原始內容','《McGraw_Hill_Connect_經驗分享.pptx》，共 14 頁。網頁以原稿重新編排為可捲動的分享內容，保留三校案例與兩支嵌入影片。原檔第 13、14 頁為隱藏投影片，現於網頁末尾獨立呈現「未來推廣藍圖」與「成果總結與感謝聆聽」。完整成果圖與結尾圖片均直接顯示，原始投影片 PDF 也包含這兩頁。'],
      ['數據採用原則','採用量：依第 2 頁文字與三校加總 136＋70＋7＝213 個。營收：依第 14 頁更新成果圖列示 366,600 元。第 2 頁文字寫為 36.6 萬元，與結尾圖的整數金額呈現不同。原檔第 1 頁舊示意圖仍有 303 個字樣，未用於本網頁統計。'],
      ['編排與文字調整','原稿中「100% 續訂」「徹底杜絕」與「無縫支援／自動同步」等絕對主張，改以需求確認、方案評估與後續追蹤呈現。此網頁未把這些說法當成已證實的成效或適用所有學校的功能保證。'],
      ['圖片與影片','校園圖與成果圖均來自原檔。校園圖保留為示意用途，未當作實地紀錄。兩支影片直接擷取原始嵌入媒體，保留畫面與聲音，不自動播放。'],
      ['案例與價格','三校的情境與價格依原稿整理。網頁未以案例價格回推整體營收，也未補入未提供的前期銷售資料。價格屬案例當時方案，實際方案另行確認。']
    ]},
    results:{title:'成果數據 · 以三校加總核對',page:2,blocks:[
      ['新採用量','彰師大 136 個＋東海 70 個＋逢甲 7 個＝213 個。東海的 70 個為兩年期 Connect，仍以 70 個授權計，未換算為 140 個。'],
      ['營收數據','原稿第 2 頁文字列為 36.6 萬元，第 14 頁更新成果圖列為 366,600 元。本網頁保留結尾成果圖的整數元數值，未自行推算三校各自營收。'],
      ['舊圖差異','原稿第 1 頁示意圖仍寫成 303 個。因與三校加總及第 14 頁更新圖不一致，本頁採 213 個，並保留此差異說明。'],
      ['採用量占比','彰師大 136÷213＝63.85%；東海 70÷213＝32.86%；逢甲 7÷213＝3.29%。原稿未提供前期採用量，本網頁未計算成長率。']
    ],image:true},
    perspective:{title:'推廣視角 · 原稿主張與整理方式',page:3,blocks:[
      ['原稿方向','第 3 頁提出從「賣書業務」走向「數位顧問」，關注延用遞減、班級產值與教學流程整合。'],
      ['本頁採用的表述','將三個方向整理為延用後需求追蹤、教材方案組合與課程導入。原稿未附續訂率的追蹤數據，也未證實每班都能達到特定產值，因此未沿用「確保 100% 續訂」或保證後續獨家採用的說法。'],
      ['功能與校端環境','平台內容、授權、帳號權限與學校系統串接，需回到實際課程與校端環境確認。此頁是業務推廣經驗整理，不是完整產品規格表。']
    ]},
    workflow:{title:'流程與分工 · 來源對照',page:4,blocks:[
      ['合作流程','第 4 頁：由華泰業務先釐清需求，再安排 Jason 到校或視訊示範。四步驟為需求訪談、約定示範、對應課程與接續追蹤。'],
      ['拜訪前的三個問題','第 7 頁：學生費用、操作難度與成績整合。本網頁保留問題方向，將無縫支援與自動同步等概括表述改為確認校端環境與實際可用方式。'],
      ['參與者分工','第 8 頁列出華泰業務負責需求訪談與後續聯繫，Jason 負責平台介紹與操作支援，老師評估課程安排。分工依每次參與者與支援範圍調整。'],
      ['章節示範的建議','第 9 頁講者筆記建議用同一章節，依序說明教師端任務、學生端完成流程與教師端查看結果。本網頁把它納入示範流程建議，並未把它當作彰師大現場已完成的操作紀錄。'],
      ['延伸問題與交付物','步驟中的提問與「需要留下的結果」為依原稿整理的拜訪輔助，並非已完成的拜訪紀錄。']
    ]},
    films:{title:'原始影片 · 保留簡報中的影音',page:5,blocks:[
      ['教師推廣影片','原簡報第 5 頁嵌入影片，約 2 分 40 秒，1920×1080。用於原稿所述「吸引老師目光」的推廣情境。'],
      ['學生推廣影片','原簡報第 6 頁嵌入直式影片，約 58 秒，480×854。用於原稿所述「吸引學生使用」的推廣情境。'],
      ['播放方式','兩支影片保留完整內容與原音。教師版另轉為 1280×720 的網頁播放尺寸，學生版保留原始尺寸，並整理影片索引以利開始播放。頁面不自動播放，播放其中一支時會暫停另一支。影片內容屬原稿推廣素材。']
    ],videos:true},
    roadmap:{title:'未來推廣藍圖 · 原簡報第 13 頁',page:13,blocks:[
      ['擴大雙軌巡迴規模','原稿提出將 Jason 到校實戰模式模組化，拓展至中部各大專院校。網頁接續前面合作流程，整理到校與視訊兩種示範方式。'],
      ['打造標竿成功案例','以彰師大、東海與逢甲採用為核心，延伸同系教師試用，再評估院系整體採購需求。'],
      ['深耕數位出版價值','原稿提出結合另外兩家外商平台，以適應不同學科需求，未列具體平台名稱。'],
      ['規劃與成果分開呈現','本頁保留原稿的未來方向，並不代表已完成巡迴拓展、院系採購或其他平台採用。']
    ]},
    wrapup:{title:'成果總結與感謝聆聽 · 原簡報第 14 頁',page:14,blocks:[
      ['完整原稿圖像','原始投影片的更新成果圖與「感謝聆聽」圖片，已完整納入網頁最後一章。兩張圖片均直接取自上傳的 PowerPoint。'],
      ['成果數字','彰師大 136 個＋東海 70 個＋逢甲 7 個＝213 個 Connect。東海 70 個為兩年期授權，依原稿以 70 個計算。結尾成果圖列示總金額 366,600 元。'],
      ['資料口徑','第 1 頁舊示意圖仍有 303 個字樣，第 2 頁文字為 36.6 萬元。此處依三校加總與第 14 頁更新成果圖呈現，未以各校方案價格回推營收。']
    ]},
    cases:{title:'三校案例 · 情境與方案',page:9,blocks:[
      ['彰師大','第 9 頁：資管系一年級到班，由 Jason 引導手機或平板試用，老師說明使用原因，張維峻介紹學生方案。原稿價格為紙本書加平台 1,800 元，平台 1,200 元。'],
      ['東海','第 10 頁：針對國際菁英組教學需求，與 Jason 到校講解，討論兩年期平台方案 2,400 元。經費項目是原稿所列需求背景，並不代表本網頁判定已核准或符合核銷規範。'],
      ['逢甲','第 11 頁：三方視訊後，因老師對全面採購有顧慮，採 Connect 與 VitalSource 並行。原稿價格為 VitalSource 990 元，Connect 1,200 元。'],
      ['採用後的追蹤','第 12 頁分別列出期中考上機考、學生使用兩種方案的回饋與跨學期授權安排。均為應追蹤事項，不是已完成的成效結論。']
    ]}
  };
  function showSource(key){
    let info=sourceInfo[key]||sourceInfo.overview;
    if(key.startsWith('case-')){
      const c=D.cases.find(c=>c.id===key.replace('case-',''));
      if(c)info={title:`${c.short} · ${c.teacher}老師的案例`,page:c.id==='ncue'?9:c.id==='tunghai'?10:11,blocks:[['原稿情境',c.context],['現場做法',c.steps.map(([t,p])=>`${t}：${p}`).join('<br>')],['當時方案',c.prices.map(([t,p])=>`${t}：${p}`).join('<br>')],['後續追蹤',c.follow],['經驗整理',c.lesson]]};
    }
    $('#sourceTitle').textContent=info.title;
    $('#sourceBody').innerHTML=info.blocks.map(([t,p])=>`<div class="source-block"><h3>${t}</h3><p>${p}</p></div>`).join('');
    if(info.image)$('#sourceBody').insertAdjacentHTML('beforeend','<div class="source-block"><details><summary class="text-link">展開原簡報結尾的更新成果圖 ＋</summary><img src="assets/source-summary.png" alt="原簡報第14頁更新成果圖，三校213個Connect，總金額366600元" loading="lazy" width="1447" height="1087"></details></div>');
    if(info.videos)$('#sourceBody').insertAdjacentHTML('beforeend','<div class="source-block"><h3>直接開啟影片</h3><div class="source-map"><a href="assets/teacher-demo.mp4" target="_blank" rel="noopener">教師推廣影片 ↗</a><a href="assets/student-demo.mp4" target="_blank" rel="noopener">學生推廣影片 ↗</a></div></div>');
    if(key==='overview')$('#sourceBody').insertAdjacentHTML('beforeend',`<div class="source-block"><h3>原始投影片對照</h3><div class="source-map">${[[1,'分享封面'],[2,'推廣成果'],[3,'角色轉型'],[4,'合作流程'],[5,'教師影片'],[6,'學生影片'],[7,'拜訪前問題'],[8,'參與者分工'],[9,'彰師大案例'],[10,'東海案例'],[11,'逢甲案例'],[12,'採用後追蹤'],[13,'未來方向（附頁）'],[14,'更新成果圖（附頁）']].map(([n,t])=>`<a href="assets/original-slides.pdf#page=${n}" target="_blank" rel="noopener">${String(n).padStart(2,'0')} · ${t} ↗</a>`).join('')}</div></div>`);
    $('#sourcePage').href=`assets/original-slides.pdf#page=${info.page}`;
    $('#sourceDialog').showModal();
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-source]');if(b)showSource(b.dataset.source);const c=e.target.closest('.dialog-close');if(c)c.closest('dialog').close();});
  $('#sourceDialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});

  function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('visible'),3400);}
  function setSpeaker(on){speakerOpen=on;$('#speakerPanel').hidden=!on;$('#speakerToggle').setAttribute('aria-pressed',String(on));$('#speakerToggle').setAttribute('aria-label',on?'關閉講者提示':'開啟講者提示');}
  $('#speakerToggle').addEventListener('click',()=>setSpeaker(!speakerOpen));$('#speakerClose').addEventListener('click',()=>setSpeaker(false));
  function setFocus(on){focusMode=on;document.documentElement.classList.toggle('focus-mode',on);$('#focusToggle').setAttribute('aria-pressed',String(on));$('#focusToggle').setAttribute('aria-label',on?'結束簡報模式':'開啟簡報模式');$('#presentationControls').hidden=!on;if(on)toast('簡報模式已開啟。使用 ← → 切換章節，Esc 結束。');}
  $('#focusToggle').addEventListener('click',()=>setFocus(!focusMode));$('#exitFocus').addEventListener('click',()=>setFocus(false));
  const chapters=$$('.chapter');let scrollQueued=false;
  function updateScroll(){
    const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=`${max>0?scrollY/max*100:0}%`;
    let index=0;chapters.forEach((s,i)=>{if(s.getBoundingClientRect().top<=innerHeight*.35)index=i;});
    chapter=index;const s=chapters[index];
    $$('.chapter-rail a').forEach((a,i)=>a.classList.toggle('active',i===index));
    $('#mainNav').querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+s.id));
    $('.chapter-rail').classList.toggle('dark',index===0||index===4);
    $('#chapterStatus').textContent=`${index===0?'序':String(index).padStart(2,'0')} · ${s.dataset.title}`;
    $('#prevChapter').disabled=index===0;$('#nextChapter').disabled=index===chapters.length-1;
    $('#speakerTitle').textContent=s.dataset.title;$('#speakerText').textContent=D.speaker[index];
    scrollQueued=false;
  }
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});addEventListener('resize',updateScroll);
  function go(direction){const i=Math.min(Math.max(chapter+direction,0),chapters.length-1);videos.forEach(v=>v.pause());chapters[i].scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
  $('#prevChapter').addEventListener('click',()=>go(-1));$('#nextChapter').addEventListener('click',()=>go(1));
  document.addEventListener('keydown',e=>{
    if($('#sourceDialog').open||/INPUT|TEXTAREA|SELECT|VIDEO/.test(e.target.tagName)||e.target.closest('[role=tablist]'))return;
    if(e.key==='Escape'){if(speakerOpen)setSpeaker(false);else if(focusMode)setFocus(false);return;}
    if(focusMode&&['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(e.key)){e.preventDefault();go(['ArrowRight','PageDown'].includes(e.key)?1:-1);}
  });
  $('#menuToggle').addEventListener('click',()=>{const on=$('#mainNav').classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(on));$('#menuToggle').setAttribute('aria-label',on?'關閉章節選單':'開啟章節選單');});
  $$('#mainNav a').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').setAttribute('aria-label','開啟章節選單');}));
  renderWorkflow();renderCase();updateScroll();
  if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06});
    $$('.reveal').forEach(el=>observer.observe(el));
  }
})();
