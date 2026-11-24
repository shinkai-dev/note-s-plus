
(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
setTimeout(()=>{document.body.classList.remove('booting');document.body.classList.add('ready');const b=$('#boot');if(b)b.remove()},4500);
window.addEventListener('error',()=>{document.body.classList.remove('booting');document.body.classList.add('ready');const b=$('#boot');if(b)b.remove()});
const APP_VER='1.0.1';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const escReg=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const debounce=(fn,ms)=>{let t;const f=(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)};f.clear=()=>clearTimeout(t);f.now=(...a)=>{clearTimeout(t);fn(...a)};return f};
const pad=n=>String(n).padStart(2,'0');
const fmtDT=ts=>{const d=new Date(ts);return d.getFullYear()+'/'+pad(d.getMonth()+1)+'/'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const fmtRel=ts=>{const d=new Date(ts),n=new Date();
  if(d.toDateString()===n.toDateString())return '今日 '+pad(d.getHours())+':'+pad(d.getMinutes());
  const y=new Date(n);y.setDate(n.getDate()-1);
  if(d.toDateString()===y.toDateString())return '昨日';
  if(d.getFullYear()===n.getFullYear())return (d.getMonth()+1)+'月'+d.getDate()+'日';
  return d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()};
const fmtBytes=b=>b>1048576?(b/1048576).toFixed(1)+' MB':b>1024?(b/1024).toFixed(0)+' KB':b+' B';
const todayStr=()=>{const d=new Date();return d.getFullYear()+'/'+pad(d.getMonth()+1)+'/'+pad(d.getDate())};
const fileDate=()=>new Date().toISOString().slice(0,10);
const safeName=s=>(s||'無題のメモ').replace(/[\\/:*?"<>|]/g,'_').slice(0,60);
const TAG_COLORS=['#6FA8FF','#9D7CFF','#53C8D8','#7FE0C3','#F5B84A','#FF6B81','#8FB8C9','#C9A0DC'];
const tagColor=t=>{let h=0;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return TAG_COLORS[h%TAG_COLORS.length]};
const isMac=/Mac|iPhone|iPad/.test(navigator.platform||'');
const MOD=isMac?'⌘':'Ctrl';
const P={
plus:'<path d="M12 5v14M5 12h14"/>',
x:'<path d="M18 6L6 18M6 6l12 12"/>',
pin:'<path d="M9 4h6l-1 6 3 3v2H7v-2l3-3-1-6z"/><path d="M12 15v6"/>',
trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
restore:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
sliders:'<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
download:'<path d="M12 3v12M7 10l5 5 5-5M4 17v3h16v-3"/>',
dots:'<circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
pen:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',
cols:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/>',
max:'<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/>',
min:'<path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/>',
cmd:'<path d="M9 9V6a3 3 0 1 0-3 3h3zm0 0v6m0-6h6m-6 6v3a3 3 0 1 1-3-3h3zm6-6h3a3 3 0 1 0-3-3v3zm0 6v3a3 3 0 1 0 3-3h-3zm0 0H9"/>',
grip:'<circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none"/>',
check:'<path d="M4 12l5 5L20 7"/>',
chevU:'<path d="M6 15l6-6 6 6"/>',chevD:'<path d="M6 9l6 6 6-6"/>',
copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
cam:'<rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 7l2-3h4l2 3"/>',
bookmark:'<path d="M6 3h12v18l-6-4-6 4V3z"/>',
menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
alert:'<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v4M12 17v.01"/>',
db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
tag:'<path d="M3 3h8l10 10-8 8L3 11V3z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
kb:'<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h4M14 10h4M6 14h12"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h5a4 4 0 0 0 4-4c0-3.9-4-6-9-6z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor" stroke="none"/><circle cx="11" cy="7.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none"/>',
list:'<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor" stroke="none"/>',
task:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-6"/>',
quote:'<path d="M6 17c3 0 4-2 4-5V7H4v5h4c0 2-1 3-2 3v2zm10 0c3 0 4-2 4-5V7h-6v5h4c0 2-1 3-2 3v2z" fill="currentColor" stroke="none"/>',
code:'<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
table:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M9 4v16M15 4v16"/>',
minus:'<path d="M4 12h16"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h9a7 7 0 0 1 7 7v1"/>',
redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9h-9a7 7 0 0 0-7 7v1"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
dup:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 4H6a2 2 0 0 0-2 2v10"/>',
csv:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6M8 13h2M12 13h2M16 13h0M8 17h2M12 17h2"/>',
sparkle:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>'
};
const ic=(n,s=16)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[n]||'')+'</svg>';
$$('[data-ic]').forEach(el=>{el.innerHTML=ic(el.dataset.ic,16)});
const DB=(()=>{
  let db=null,ok=false;
  function open(){return new Promise(res=>{
    try{
      if(!('indexedDB' in window))return res(false);
      const req=indexedDB.open('note-splus-db',1);
      const t=setTimeout(()=>res(false),3500);
      req.onupgradeneeded=e=>{const d=e.target.result;
        if(!d.objectStoreNames.contains('notes'))d.createObjectStore('notes',{keyPath:'id'});
        if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta',{keyPath:'k'});
        if(!d.objectStoreNames.contains('versions')){const s=d.createObjectStore('versions',{keyPath:'id'});s.createIndex('noteId','noteId');}
      };
      req.onsuccess=e=>{clearTimeout(t);db=e.target.result;ok=true;db.onversionchange=()=>{try{db.close()}catch(_){}};hideWarn();res(true)};
      req.onerror=()=>{clearTimeout(t);res(false)};
      req.onblocked=()=>{clearTimeout(t);res(false)};
    }catch(_){res(false)}
  })}
  const store=(n,m)=>db.transaction(n,m).objectStore(n);
  const wrap=r=>new Promise((res,rej)=>{r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  return{
    open,get ready(){return ok},
    put:(n,v)=>ok?wrap(store(n,'readwrite').put(v)).then(()=>true).catch(()=>false):Promise.resolve(false),
    del:(n,k)=>ok?wrap(store(n,'readwrite').delete(k)).catch(()=>{}):Promise.resolve(),
    get:(n,k)=>ok?wrap(store(n,'readonly').get(k)).catch(()=>null):Promise.resolve(null),
    all:n=>ok?wrap(store(n,'readonly').getAll()).catch(()=>[]):Promise.resolve([]),
    clear:n=>ok?wrap(store(n,'readwrite').clear()).catch(()=>{}):Promise.resolve()
  };
})();
function showWarn(){$('#storageWarn').hidden=false;document.body.classList.add('has-warn');$('#offlineBadge').classList.add('bad');$('#offlineText').textContent='保存無効（メモリのみ）'}
function hideWarn(){$('#storageWarn').hidden=true;document.body.classList.remove('has-warn');$('#offlineBadge').classList.remove('bad');updateOnline()}
const DEFAULTS={theme:'yoi',fontFamily:'sans',fontSize:16,lineHeight:1.9,editorWidth:780,sync:true,sidebarW:300};
const state={notes:[],activeId:null,tab:'all',query:'',tag:null,sort:'updated',activeView:null,mode:'split',zen:false,selected:new Set(),settings:{...DEFAULTS},views:[],versions:new Map(),firstRender:true,persisted:false};
let backup={lastAt:0,changes:0},nudgeShown=false;
const note=id=>state.notes.find(n=>n.id===id);
const active=()=>note(state.activeId);
const liveNotes=()=>state.notes.filter(n=>!n.deletedAt);
function displayTitle(n){
  if(n.title&&n.title.trim())return n.title.trim();
  const line=n.body.split('\n').map(l=>l.replace(/^#{1,6}\s+/,'').replace(/[*_`~>\-]/g,'').trim()).find(l=>l);
  return line?line.slice(0,40):'無題のメモ';
}
const backupThreshold=()=>backup.lastAt?30:15;
function seedNotes(){
  const now=Date.now(),H=36e5,D=864e5;
  const guide=[
'# Note S+ へようこそ','**完全オフライン**で動く高機能Markdownメモ帳です。データはこのブラウザの **IndexedDB** にだけ保存され、外部サーバーへの送信は一切ありません。','',
'## このツールの存在理由','',
'- **機密・個人情報を外に出さない** — クラウド同期ゼロ。社用PC・共有端末・制限の厳しい環境でも安心',
'- **インストール不要** — ブラウザだけで完結。管理者権限がなくても使える',
'- **ネットが無くても動く** — 機内・地下・回線障害時も普通に読み書きできる',
'- **書くことに集中できる** — 広告もアカウントも「同期中…」もなし','',
'> クラウドは便利。でも「そこまで預けたくないメモ」は必ずある。その受け皿になるのが Note S+ です。','',
'## 30秒でわかる基本操作','',
'1. 左の **＋ 新規メモ**（`Alt+N`）で作成',
'2. 書くだけで**自動保存**（右下に保存状態が表示されます）',
'3. `Ctrl+K` の**コマンドパレット**から全機能へアクセス',
'4. 右端の情報ボタンで**ドロワー**（タグ・アウトライン・履歴）','',
'## 搭載機能','',
'- 全文検索・タグ絞り込み・5種の並び替え（**手動ドラッグ**含む）',
'- Markdownライブプレビュー / 編集・分割・閲覧の3モード',
'- メモ内**検索＆置換**（`Ctrl+F`、全置換前に自動スナップショット）',
'- **バージョン履歴**（10分ごとに自動保存、最大25世代）',
'- **バックアップ催促** — 変更が一定数たまるとJSON書き出しを提案',
'- ピン留め / ゴミ箱（30日保持・**削除はUndo可能**）/ 一括選択操作',
'- **保存ビュー**（検索条件を名前付きで保存）',
'- 4テーマ（ライトモード・ダークモード・ダークモード（グレー）・ダークモード（ライム））/ フォント・文字サイズ・行間・幅の調整',
'- **集中モード**（右上の⛶ボタン）','',
'## データの保全について','',
'ブラウザのストレージは、クリーンアップ設定やプライベートモードで消えることがあります。Note S+ は保存時に永続化を要求し、変更がたまると**バックアップを催促**します。書き出しはダウンロードのみ、復元はテキスト貼り付けで行えます。','',
'| 対象 | 形式 |','|---|---|',
'| いまのノート | Markdown / テキスト / HTML |',
'| 全ノート | JSONバックアップ |',
'| 一覧 | CSV（BOM付き・Excel対応） |','',
'## 試してみよう','',
'- [ ] このチェックボックスを**プレビュー側でクリック**（本文に反映されます）',
'- [ ] 行末で Enter → リストが自動で続く',
'- [ ] 並び順を「手動」にしてカードをドラッグ',
'- [ ] `Ctrl+K` →「ダークモード（ライム）」と入力してテーマ変更','',
'---','それでは、良い執筆を。 — Note S+'].join('\n');
  const cheat=[
'# Markdown チートシート','このアプリで使える記法の一覧です。分割表示で左を編集すると、右がすぐ変わります。','',
'## 見出し','`# H1`〜`###### H6`（行頭）','',
'## 強調','- **太字** → `**太字**`','- *斜体* → `*斜体*`','- ~~取り消し~~ → `~~取り消し~~`','- ==ハイライト== → `==ハイライト==`','- `インラインコード` → バッククォートで囲む','',
'## リスト','- 箇条書き','- ネストは2スペース','  - こんなふうに','',
'1. 番号付き','2. リスト','',
'- [ ] 未完了タスク','- [x] 完了タスク（プレビューでクリック可）','',
'## 引用とコード','',
'> 引用ブロック。複数行も','> こんなふうに続きます。','',
'```js','// フェンスコードブロック（言語ラベル＋コピーボタン付き）','const note = (s) => s.trim();','console.log(note("  Note S+  "));','```','',
'## 表','',
'| 記法 | 結果 | 備考 |','|:---|:---:|---:|',
'| `**x**` | 太字 | 左寄せ |',
'| `*x*` | 斜体 | 中央 |',
'| `~~x~~` | 取消 | 右寄せ |','',
'## その他','- 区切り線 → `---`','- リンク → [Note S+ について](https://example.com)','- 画像記法はオフライン方針のためチップ表示になります','','---','*Tip: ツールバーのボタンはすべて選択範囲に作用します。*'].join('\n');
  const mk=(title,body,tags,created,updated,pinned,order)=>({id:uid(),title,body,tags,pinned,order,createdAt:created,updatedAt:updated,deletedAt:null});
  const notes=[
    mk('はじめに — Note S+ の使い方',guide,['ガイド'],now-6*D,now-2*H,true,0),
    mk('Markdown チートシート',cheat,['ガイド','Markdown'],now-6*D,now-1*D,false,1)
  ];
  return{notes,versions:[],views:[]};
}
function inlineMd(text,tokens){
  const push=h=>{tokens.push(h);return '\u0001'+(tokens.length-1)+'\u0001'};
  text=text.replace(/\\([\\`*_{}\[\]()#+\-.!~|])/g,(_,c)=>push(esc(c)));
  text=text.replace(/`([^`\n]+)`/g,(_,c)=>push('<code>'+c+'</code>'));
  text=text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,(_,alt,url)=>push('<span class="md-imgchip" title="'+url+'">'+ic('image',13)+(alt||'画像')+'</span>'));
  text=text.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g,(m,txt,url)=>/^(https?:\/\/|mailto:)/i.test(url)?'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+(txt||url)+'</a>':m);
  text=text.replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_\n]+)__/g,'<strong>$1</strong>');
  text=text.replace(/~~([^~\n]+)~~/g,'<del>$1</del>');
  text=text.replace(/==([^=\n]+)==/g,'<span class="md-hl">$1</span>');
  text=text.replace(/\*([^*\n]+)\*/g,'<em>$1</em>').replace(/(^|[^\w])_([^_\n]+)_(?=[^\w]|$)/g,'$1<em>$2</em>');
  text=text.replace(/(^|\s)(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
  return text;
}
function mdToHtml(src,opts){
  opts=opts||{};const interactive=opts.interactive!==false;const outline=opts.outline||null;
  const lines=esc(src).split('\n');const out=[];const tokens=[];let listType=null;let i=0;
  const closeList=()=>{if(listType){out.push('</'+listType+'>');listType=null}};
  const isTableSep=s=>{if(!s||!s.includes('-'))return false;const t=s.trim().replace(/^\|/,'').replace(/\|$/,'');if(!t)return false;return t.split('|').every(c=>/^\s*:?-+:?\s*$/.test(c))};
  const listRe=/^(\s*)(?:([-*+])|(\d+)[.)])\s+(.*)$/;
  const special=idx=>{const L=lines[idx];return /^```/.test(L)||/^#{1,6}\s/.test(L)||/^ {0,3}([-*_])\s*(?:\1\s*){2,}$/.test(L)||/^&gt;/.test(L)||listRe.test(L)||(L.includes('|')&&isTableSep(lines[idx+1]))};
  while(i<lines.length){
    const L=lines[i];
    if(/^\s*$/.test(L)){if(!(i+1<lines.length&&listRe.test(lines[i+1])))closeList();i++;continue}
    const fence=L.match(/^```(\S*)\s*$/);
    if(fence){closeList();const lang=fence[1]||'text';const buf=[];i++;
      while(i<lines.length&&!/^```\s*$/.test(lines[i])){buf.push(lines[i]);i++}
      i++;
      out.push('<div class="md-codeblock"><div class="cb-head"><span>'+lang+'</span>'+(interactive?'<button class="cb-copy" data-copy>'+ic('copy',12)+'コピー</button>':'')+'</div><pre><code>'+buf.join('\n')+'</code></pre></div>');continue}
    const h=L.match(/^(#{1,6})\s+(.*)$/);
    if(h){closeList();const lv=h[1].length;const txt=inlineMd(h[2],tokens);
      if(outline)outline.push({level:lv,text:h[2].replace(/[*_`~=]/g,''),line:i});
      out.push('<h'+lv+' data-hline="'+i+'">'+txt+'</h'+lv+'>');i++;continue}
    if(/^ {0,3}([-*_])\s*(?:\1\s*){2,}$/.test(L)){closeList();out.push('<hr>');i++;continue}
    if(/^&gt;/.test(L)){closeList();const buf=[];
      while(i<lines.length&&/^&gt;/.test(lines[i])){buf.push(inlineMd(lines[i].replace(/^&gt;\s?/,''),tokens));i++}
      out.push('<blockquote><p>'+buf.join('<br>')+'</p></blockquote>');continue}
    if(L.includes('|')&&isTableSep(lines[i+1])){closeList();
      const cells=r=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim());
      const head=cells(L);const aligns=cells(lines[i+1]).map(c=>{const l=c.startsWith(':'),r=c.endsWith(':');return l&&r?'center':r?'right':l?'left':''});
      i+=2;const rows=[];
      while(i<lines.length&&lines[i].includes('|')&&!/^\s*$/.test(lines[i])){rows.push(cells(lines[i]));i++}
      let t='<div class="md-table-wrap"><table><thead><tr>';
      head.forEach((c,x)=>{t+='<th'+(aligns[x]?' style="text-align:'+aligns[x]+'"':'')+'>'+inlineMd(c,tokens)+'</th>'});
      t+='</tr></thead><tbody>';
      rows.forEach(r=>{t+='<tr>';head.forEach((_,x)=>{t+='<td'+(aligns[x]?' style="text-align:'+aligns[x]+'"':'')+'>'+inlineMd(r[x]||'',tokens)+'</td>'});t+='</tr>'});
      out.push(t+'</tbody></table></div>');continue}
    const lm=L.match(listRe);
    if(lm){const indent=lm[1].replace(/\t/g,'  ').length;const depth=clamp(Math.floor(indent/2),0,4);
      const type=lm[3]?'ol':'ul';
      if(listType!==type){closeList();out.push('<'+type+'>');listType=type}
      const content=lm[4];const task=content.match(/^\[( |x|X)\]\s+(.*)$/);
      if(task){const checked=task[1].toLowerCase()==='x';
        out.push('<li class="task d'+depth+'"'+(type==='ol'?' value="'+lm[3]+'"':'')+'><label class="md-task"><input type="checkbox" data-line="'+i+'"'+(checked?' checked':'')+(interactive?'':' disabled')+'><span>'+inlineMd(task[2],tokens)+'</span></label></li>');
      }else{
        out.push('<li class="d'+depth+'"'+(type==='ol'?' value="'+lm[3]+'"':'')+'>'+inlineMd(content,tokens)+'</li>');
      }
      i++;continue}
    closeList();const buf=[inlineMd(L,tokens)];i++;
    while(i<lines.length&&!/^\s*$/.test(lines[i])&&!special(i)){buf.push(inlineMd(lines[i],tokens));i++}
    out.push('<p>'+buf.join('<br>')+'</p>');
  }
  closeList();
  let html=out.join('\n');
  html=html.replace(/\u0001(\d+)\u0001/g,(_,n)=>tokens[+n]||'');
  return html;
}
function toast(msg,type,opts){
  type=type||'info';opts=opts||{};
  const box=$('#toasts');
  while(box.children.length>=3)box.firstChild.remove();
  const el=document.createElement('div');el.className='toast '+type;
  el.innerHTML=ic(type==='success'?'check':type==='warn'||type==='danger'?'alert':'info',16)+'<span class="msg">'+msg+'</span>'+(opts.action?'<button class="act">'+esc(opts.action)+'</button>':'')+'<button class="close" aria-label="閉じる">'+ic('x',13)+'</button>';
  const kill=()=>{if(!el.parentNode)return;el.classList.add('out');setTimeout(()=>el.remove(),240)};
  el.querySelector('.close').onclick=kill;
  if(opts.action)el.querySelector('.act').onclick=()=>{kill();opts.onAction&&opts.onAction()};
  box.appendChild(el);
  setTimeout(kill,opts.duration||(opts.action?6500:4200));
}
let menuAnchor=null;
function closeMenu(){$('#menuRoot').innerHTML='';menuAnchor=null}
function openMenu(anchor,items){
  closeMenu();menuAnchor=anchor;
  const m=document.createElement('div');m.className='menu';
  items.forEach(it=>{
    if(it.sep){const s=document.createElement('div');s.className='menu-sep';m.appendChild(s);return}
    const b=document.createElement('button');
    b.innerHTML=(it.icon?ic(it.icon,15):'<span style="width:15px"></span>')+'<span>'+esc(it.label)+'</span>'+(it.hint?'<span class="hint">'+esc(it.hint)+'</span>':'');
    if(it.danger)b.classList.add('danger');
    if(it.disabled)b.disabled=true;
    b.onclick=()=>{closeMenu();it.fn&&it.fn()};
    m.appendChild(b);
  });
  $('#menuRoot').appendChild(m);
  const r=anchor.getBoundingClientRect();const mw=m.offsetWidth,mh=m.offsetHeight;
  const left=clamp(r.right-mw,8,innerWidth-mw-8);let top=r.bottom+6;
  if(top+mh>innerHeight-8)top=Math.max(8,r.top-mh-6);
  m.style.left=left+'px';m.style.top=top+'px';
}
let modalResolve=null,modalPrevFocus=null;
function closeModal(result){
  const root=$('#modalRoot');root.classList.remove('open');root.innerHTML='';
  const r=modalResolve;modalResolve=null;
  if(modalPrevFocus&&modalPrevFocus.focus)try{modalPrevFocus.focus()}catch(_){}
  modalPrevFocus=null;r&&r(result);
}
function openModal(html,opts){
  opts=opts||{};
  if(modalResolve)closeModal(null);
  modalPrevFocus=document.activeElement;
  const root=$('#modalRoot');
  root.innerHTML='<div class="modal'+(opts.wide?' wide':'')+'" role="dialog" aria-modal="true">'+html+'</div>';
  root.classList.add('open');
  root.onpointerdown=e=>{if(e.target===root&&opts.dismissible!==false)closeModal(null)};
  const p=new Promise(res=>{modalResolve=res});
  root.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close==='ok'?true:null));
  const af=root.querySelector('[autofocus]');if(af)setTimeout(()=>af.focus(),30);
  return p;
}
function confirmDlg(title,msg,okLabel,danger){
  return openModal(
    '<div class="modal-head">'+ic(danger?'alert':'info',18)+'<h2>'+esc(title)+'</h2></div>'+
    '<div class="modal-body"><div class="modal-msg">'+msg+'</div></div>'+
    '<div class="modal-foot"><button class="btn-cancel" data-close="">キャンセル</button>'+
    '<button class="'+(danger?'btn-danger':'btn-primary')+'" data-close="ok" autofocus>'+esc(okLabel||'OK')+'</button></div>'
  ).then(v=>v===true);
}
function promptDlg(title,msg,value,placeholder){
  const p=openModal(
    '<div class="modal-head">'+ic('bookmark',18)+'<h2>'+esc(title)+'</h2></div>'+
    '<div class="modal-body"><div class="modal-msg">'+msg+'</div><input class="prompt-input" id="promptInput" value="'+esc(value||'')+'" placeholder="'+esc(placeholder||'')+'" autofocus maxlength="40"></div>'+
    '<div class="modal-foot"><button class="btn-cancel" data-close="">キャンセル</button><button class="btn-primary" data-close="ok">保存</button></div>'
  );
  const inp=$('#promptInput');
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();closeModal(true)}});
  return p.then(ok=>ok===true?(inp.value.trim()||null):null);
}
const persistSettings=debounce(()=>DB.put('meta',{k:'settings',v:state.settings}),400);
function applySettings(){
  const s=state.settings;
  document.body.dataset.theme=s.theme;
  const fonts={serif:'var(--font-serif)',sans:'var(--font-ui)',mono:'var(--font-mono)'};
  const r=document.documentElement.style;
  r.setProperty('--ed-font',fonts[s.fontFamily]||fonts.sans);
  r.setProperty('--ed-size',s.fontSize+'px');
  r.setProperty('--ed-lh',String(s.lineHeight));
  r.setProperty('--ed-w',s.editorWidth+'px');
  r.setProperty('--sb-w',s.sidebarW+'px');
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=getComputedStyle(document.body).getPropertyValue('--bg').trim();
}
function setSetting(k,v){state.settings[k]=v;applySettings();persistSettings.now()}
const THEMES=[
  {id:'yoi',name:'ダークモード',en:'MIDNIGHT',sw:['#0B0F17','#6FA8FF','#9D7CFF']},
  {id:'platinum',name:'ライトモード',en:'PLATINUM',sw:['#F2F4F8','#2E63E7','#1B2434']},
  {id:'graphite',name:'ダークモード（グレー）',en:'GRAPHITE',sw:['#101214','#D6B36A','#8FB8C9']},
  {id:'rime',name:'ダークモード（ライム）',en:'LIME',sw:['#081418','#53C8D8','#7FE0C3']}
];
let saveTimer=null,pendingNote=null,saveErrorShown=false;
function setSaveUI(mode){
  const dot=$('#saveDot'),txt=$('#saveText');dot.className='';
  if(mode==='typing'){dot.classList.add('typing');txt.textContent='編集中…'}
  else if(mode==='saving'){dot.classList.add('saving');txt.textContent='保存中…'}
  else if(mode==='error'){dot.classList.add('error');txt.textContent='保存失敗'}
  else{const d=new Date();txt.textContent='保存済み '+pad(d.getHours())+':'+pad(d.getMinutes())}
}
async function maybeSnapshot(n){
  if(!n.body||n.body.length<20)return;
  const list=state.versions.get(n.id)||[];
  const last=list[0];
  if(last&&last.body===n.body)return;
  if(last&&Date.now()-last.at<10*60e3)return;
  await pushVersion(n);
}
async function pushVersion(n){
  const v={id:uid(),noteId:n.id,at:Date.now(),title:n.title,body:n.body,chars:n.body.length};
  const list=state.versions.get(n.id)||[];list.unshift(v);
  while(list.length>25){const old=list.pop();DB.del('versions',old.id)}
  state.versions.set(n.id,list);
  await DB.put('versions',v);
  return v;
}
const persistBackup=debounce(()=>DB.put('meta',{k:'backup',v:backup}),500);
function renderBackupChip(){
  const due=backup.changes>=backupThreshold();
  $('#backupChip').hidden=!due;
  const t=$('#backupChipText');
  if(due&&t)t.textContent='バックアップ推奨（'+backup.changes+'件の変更）';
}
function noteBackupChange(){
  const prev=backup.changes;
  backup.changes++;
  persistBackup();
  renderBackupChip();
  const T=backupThreshold();
  if(prev<T&&backup.changes>=T&&!nudgeShown){
    nudgeShown=true;
    toast('前回のバックアップから'+backup.changes+'件の変更があります。JSONバックアップを推奨します。','warn',{action:'バックアップ',duration:9000,onAction:exportAllJson});
  }
}
async function persistNote(n){
  setSaveUI('saving');
  const ok=await DB.put('notes',n);
  if(!ok&&DB.ready===false){setSaveUI('error');if(!saveErrorShown){saveErrorShown=true;showWarn()}}
  else setSaveUI('saved');
  await maybeSnapshot(n);
  noteBackupChange();
  renderList();updateDrawerStats();
}
function scheduleSave(n){
  pendingNote=n;clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{const t=pendingNote;pendingNote=null;saveTimer=null;if(t)persistNote(t)},600);
}
function flushSave(){if(saveTimer){clearTimeout(saveTimer);saveTimer=null;const t=pendingNote;pendingNote=null;if(t)persistNote(t)}}
function visibleNotes(){
  let arr=state.tab==='trash'?state.notes.filter(n=>n.deletedAt):liveNotes();
  if(state.tab==='pinned')arr=arr.filter(n=>n.pinned);
  if(state.tag)arr=arr.filter(n=>n.tags.includes(state.tag));
  if(state.query){const q=state.query.toLowerCase();arr=arr.filter(n=>(displayTitle(n)+'\n'+n.body+'\n'+n.tags.join(' ')).toLowerCase().includes(q))}
  const by={updated:(a,b)=>b.updatedAt-a.updatedAt,created:(a,b)=>b.createdAt-a.createdAt,
    title:(a,b)=>displayTitle(a).localeCompare(displayTitle(b),'ja'),
    chars:(a,b)=>b.body.length-a.body.length,manual:(a,b)=>a.order-b.order};
  arr=[...arr].sort(by[state.sort]||by.updated);
  if(state.tab!=='trash'&&state.sort!=='manual')arr.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  return arr;
}
const dragEnabled=()=>state.sort==='manual'&&state.tab==='all'&&!state.query&&!state.tag;
function hl(text,q){
  const e=esc(text);
  if(!q)return e;
  try{return e.replace(new RegExp('('+escReg(esc(q))+')','gi'),'<mark>$1</mark>')}catch(_){return e}
}
function snippet(n){
  const plain=n.body.replace(/```[\s\S]*?```/g,' ').replace(/[#>*`~\[\]|=]/g,'').replace(/\s+/g,' ').trim();
  if(state.query){const idx=plain.toLowerCase().indexOf(state.query.toLowerCase());
    if(idx>40)return '…'+plain.slice(idx-24,idx+80)}
  return plain.slice(0,100);
}
function renderTabs(){
  $('#cntAll').textContent=liveNotes().length;
  $('#cntPin').textContent=liveNotes().filter(n=>n.pinned).length;
  $('#cntTrash').textContent=state.notes.filter(n=>n.deletedAt).length;
  $$('#tabs .tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===state.tab));
}
function renderTagRow(){
  const counts=new Map();
  liveNotes().forEach(n=>n.tags.forEach(t=>counts.set(t,(counts.get(t)||0)+1)));
  const tags=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'ja'));
  const row=$('#tagRow');row.innerHTML='';row.hidden=tags.length===0;
  tags.forEach(([t,c])=>{
    const b=document.createElement('button');b.className='tag-chip'+(state.tag===t?' on':'');
    b.style.setProperty('--tc',tagColor(t));
    b.innerHTML='<span class="dot"></span>'+esc(t)+' <span style="opacity:.6">'+c+'</span>';
    b.onclick=()=>{state.tag=state.tag===t?null:t;state.activeView=null;state.selected.clear();renderAll()};
    row.appendChild(b);
  });
}
function renderViews(){
  const row=$('#viewRow');row.innerHTML='';row.hidden=state.views.length===0;
  state.views.forEach(v=>{
    const chip=document.createElement('span');chip.className='view-chip'+(state.activeView===v.id?' on':'');
    const apply=document.createElement('button');apply.className='v-apply';apply.title='ビューを適用';
    apply.innerHTML=ic('bookmark',11)+esc(v.name);
    apply.onclick=()=>{state.tab=v.tab;state.query=v.query;state.tag=v.tag;state.sort=v.sort;state.activeView=v.id;
      $('#search').value=v.query;$('#btnClearSearch').hidden=!v.query;$('#sortSel').value=v.sort;state.selected.clear();renderAll();closeMobileSb()};
    const del=document.createElement('button');del.className='v-del';del.title='ビューを削除';del.setAttribute('aria-label','ビューを削除');del.innerHTML=ic('x',11);
    del.onclick=async()=>{state.views=state.views.filter(x=>x.id!==v.id);if(state.activeView===v.id)state.activeView=null;
      await DB.put('meta',{k:'views',v:state.views});renderViews();
      toast('ビュー「'+esc(v.name)+'」を削除しました','info',{action:'元に戻す',onAction:async()=>{state.views.push(v);await DB.put('meta',{k:'views',v:state.views});renderViews()}})};
    chip.appendChild(apply);chip.appendChild(del);row.appendChild(chip);
  });
}
function renderList(){
  const list=$('#noteList');const arr=visibleNotes();const st=list.scrollTop;
  const frag=document.createDocumentFragment();
  $('#countLabel').textContent=arr.length+'件'+(state.query||state.tag?'（絞り込み中）':'');
  arr.forEach((n,idx)=>{
    const card=document.createElement('article');
    card.className='note-card'+(n.id===state.activeId?' on':'')+(state.selected.has(n.id)?' checked':'')+(state.firstRender?' anim':'');
    card.dataset.id=n.id;card.tabIndex=0;card.setAttribute('role','listitem');
    card.style.setProperty('--d',Math.min(idx*35,350)+'ms');
    if(dragEnabled())card.draggable=true;
    const tags=n.tags.slice(0,3).map(t=>'<span class="mini-tag" style="--tc:'+tagColor(t)+'"><i></i>'+esc(t)+'</span>').join('');
    let acts='';
    if(n.deletedAt){acts='<div class="card-trash-acts"><button data-act="restore">'+ic('restore',11)+' 復元</button><button data-act="purge" class="danger">完全削除</button></div>'}
    card.innerHTML=
      (dragEnabled()?'<span class="card-grip">'+ic('grip',13)+'</span>':'')+
      '<span class="card-check"><input type="checkbox" data-act="check"'+(state.selected.has(n.id)?' checked':'')+' aria-label="選択"></span>'+
      '<div class="card-main"><div class="card-top"><h3>'+hl(displayTitle(n),state.query)+'</h3>'+
      (n.deletedAt?'':'<button class="card-pin'+(n.pinned?' pinned':'')+'" data-act="pin" title="'+(n.pinned?'ピン留め解除':'ピン留め')+'" aria-pressed="'+n.pinned+'">'+ic('pin',13)+'</button>')+
      '</div><p class="card-snippet">'+hl(snippet(n),state.query)+'</p>'+
      '<div class="card-meta"><time>'+fmtRel(n.deletedAt||n.updatedAt)+'</time><span>·</span><span>'+n.body.length.toLocaleString()+'字</span>'+tags+'</div>'+acts+'</div>';
    frag.appendChild(card);
  });
  list.innerHTML='';
  if(arr.length===0){
    const d=document.createElement('div');d.className='list-empty';
    d.innerHTML=state.tab==='trash'?'ゴミ箱は空です':state.query||state.tag?'該当するノートがありません<br>条件をクリアしてみてください':state.tab==='pinned'?'ピン留めしたノートがここに出ます':'ノートがありません';
    list.appendChild(d);
  }else list.appendChild(frag);
  list.scrollTop=st;
  const sa=$('#selectAll');const selVisible=arr.filter(n=>state.selected.has(n.id)).length;
  sa.checked=arr.length>0&&selVisible===arr.length;sa.indeterminate=selVisible>0&&selVisible<arr.length;
  renderBulkBar();
  state.firstRender=false;
}
function renderBulkBar(){
  const bar=$('#bulkBar');const n=state.selected.size;
  bar.hidden=n===0;document.body.classList.toggle('selecting',n>0);
  if(n===0)return;
  $('#bulkCount').textContent=n+'件選択';
  const trash=state.tab==='trash';
  bar.querySelector('[data-bulk="restore"]').hidden=!trash;
  bar.querySelector('[data-bulk="pin"]').hidden=trash;
  bar.querySelector('[data-bulk="md"]').hidden=trash;
  $('#bulkDeleteLabel').textContent=trash?'完全削除':'ゴミ箱へ';
}
let lastOutline=[];
const renderPreviewSoon=(()=>{let raf=0;return()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;renderPreview()})}})();
function renderPreview(){
  const n=active();const pv=$('#preview');const pane=$('#previewPane');
  if(!n){pv.innerHTML='';return}
  const st=pane.scrollTop;lastOutline=[];
  pv.innerHTML=mdToHtml(n.body,{outline:lastOutline});
  pane.scrollTop=st;
}
function updateCounts(){
  const n=active();const body=n?n.body:'';
  const chars=body.replace(/\n/g,'').length;
  $('#stChars').textContent=chars.toLocaleString()+'字';
  $('#stLines').textContent=(body?body.split('\n').length:0)+'行';
  $('#stRead').textContent='約'+(chars?Math.max(1,Math.round(chars/500)):0)+'分';
}
function updateCursor(){
  const ed=$('#editor');if(document.activeElement!==ed)return;
  const pos=ed.selectionStart;const upto=ed.value.slice(0,pos);
  const ln=upto.split('\n').length;const col=pos-upto.lastIndexOf('\n');
  $('#stCursor').textContent='Ln '+ln+', Col '+col;
  const sel=ed.selectionEnd-ed.selectionStart;
  $('#stSel').hidden=sel===0;if(sel>0)$('#stSel').textContent='選択 '+sel.toLocaleString()+'字';
}
function updateChrome(){
  const n=active();const trash=!!(n&&n.deletedAt);const has=!!n;
  $('#titleInput').disabled=!has||trash;
  ['#btnFind','#btnZen'].forEach(s=>$(s).disabled=!has||trash);
  $('#btnInfo').disabled=!has;$('#btnMore').disabled=!has;
  $$('#modeSeg button').forEach(b=>{b.disabled=!has||trash;b.classList.toggle('on',has&&!trash&&b.dataset.mode===state.mode)});
  $('#formatBar').hidden=!has||trash||state.mode==='preview';
  $('#statusBar').hidden=!has;
  $('#trashBanner').hidden=!trash;
  const ws=$('#workspace');
  ws.classList.toggle('no-note',!has);
  ws.classList.remove('mode-edit','mode-split','mode-preview','mode-trash');
  ws.classList.add(trash?'mode-trash':has?'mode-'+state.mode:'mode-split');
  $('#emptyState').hidden=has;
  $('#btnEmptySamples').hidden=state.notes.length>0;
  document.title=(has?displayTitle(n)+' — ':'')+'Note S+';
}
function loadNote(id,opts){
  opts=opts||{};
  flushSave();
  const n=note(id);state.activeId=n?n.id:null;
  const ed=$('#editor');
  ed.value=n?n.body:'';$('#titleInput').value=n?n.title:'';
  if(n&&n.deletedAt)closeFind();
  updateChrome();renderPreview();updateCounts();setSaveUI('saved');
  $('#stCursor').textContent='Ln 1, Col 1';$('#stSel').hidden=true;
  if(!opts.keepScroll){ed.scrollTop=0;$('#previewPane').scrollTop=0}
  const ws=$('#workspace');ws.classList.remove('switching');void ws.offsetWidth;ws.classList.add('switching');
  renderList();
  if(!$('#drawer').hidden)renderDrawer();
  if(findOpen)refreshFind();
}
function renderAll(){renderTabs();renderTagRow();renderViews();renderList();updateChrome();renderBackupChip()}
function ensureActive(){
  const arr=visibleNotes();
  if(state.activeId&&note(state.activeId))return;
  state.activeId=arr[0]?arr[0].id:(liveNotes()[0]?liveNotes()[0].id:null);
}
async function createNote(body,title){
  flushSave();
  const minOrder=Math.min(0,...liveNotes().map(n=>n.order));
  const n={id:uid(),title:title||'',body:body||'',tags:state.tag?[state.tag]:[],pinned:false,order:minOrder-1,createdAt:Date.now(),updatedAt:Date.now(),deletedAt:null};
  state.notes.unshift(n);
  if(state.tab==='trash'){state.tab='all';state.activeView=null}
  state.query='';$('#search').value='';$('#btnClearSearch').hidden=true;
  renderAll();loadNote(n.id);
  await DB.put('notes',n);setSaveUI('saved');renderList();
  $('#titleInput').focus();
  toast('新しいノートを作成しました','success');
  closeMobileSb();
  return n;
}
async function togglePin(n){
  n.pinned=!n.pinned;renderList();renderTabs();
  await DB.put('notes',n);
  toast(n.pinned?'ピン留めしました':'ピン留めを解除しました','info');
}
async function trashNotes(ids){
  const targets=ids.map(note).filter(Boolean);if(!targets.length)return;
  const wasActive=targets.some(n=>n.id===state.activeId);
  targets.forEach(n=>{n.deletedAt=Date.now();DB.put('notes',n)});
  state.selected.clear();
  if(wasActive){state.activeId=null;ensureActive();loadNote(state.activeId)}
  renderAll();
  toast(targets.length+'件をゴミ箱へ移動しました','warn',{action:'元に戻す',onAction:async()=>{
    targets.forEach(n=>{n.deletedAt=null;DB.put('notes',n)});
    renderAll();if(!state.activeId){state.activeId=targets[0].id;loadNote(state.activeId)}
    toast('復元しました','success');
  }});
}
async function restoreNotes(ids){
  const targets=ids.map(note).filter(Boolean);
  targets.forEach(n=>{n.deletedAt=null;DB.put('notes',n)});
  state.selected.clear();renderAll();
  if(targets.some(n=>n.id===state.activeId))loadNote(state.activeId);
  toast(targets.length+'件を復元しました','success');
}
async function purgeNotes(ids){
  for(const id of ids){
    const vs=state.versions.get(id)||[];
    for(const v of vs)await DB.del('versions',v.id);
    state.versions.delete(id);
    await DB.del('notes',id);
    state.notes=state.notes.filter(n=>n.id!==id);
  }
  state.selected.clear();
  if(!note(state.activeId)){state.activeId=null;ensureActive();loadNote(state.activeId)}
  renderAll();refreshStorage();
}
async function duplicateNote(n){
  const c={...n,id:uid(),title:displayTitle(n)+'（コピー）',tags:[...n.tags],pinned:false,order:Math.min(0,...liveNotes().map(x=>x.order))-1,createdAt:Date.now(),updatedAt:Date.now(),deletedAt:null};
  state.notes.unshift(c);renderAll();loadNote(c.id);
  await DB.put('notes',c);toast('ノートを複製しました','success');
}
function download(name,text,mime){
  const blob=new Blob([text],{type:(mime||'text/plain')+';charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
  toast('「'+esc(name)+'」をダウンロードしました','success');
}
async function copyText(t,label){
  try{await navigator.clipboard.writeText(t);toast((label||'テキスト')+'をコピーしました','success')}
  catch(_){
    const tmp=document.createElement('textarea');tmp.value=t;tmp.style.cssText='position:fixed;left:-9999px';
    document.body.appendChild(tmp);tmp.select();
    try{document.execCommand('copy');toast((label||'テキスト')+'をコピーしました','success')}
    catch(e){toast('コピーに失敗しました','danger')}
    tmp.remove();
  }
}
function exportNoteHtml(n){
  const cs=getComputedStyle(document.body);const v=k=>cs.getPropertyValue(k).trim();
  const body=mdToHtml(n.body,{interactive:false});
  return '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(displayTitle(n))+'</title><style>'+
  'body{margin:0;background:'+v('--bg')+';color:'+v('--text')+';font-family:"Hiragino Kaku Gothic ProN","Yu Gothic UI",Meiryo,sans-serif;line-height:1.9}'+
  '.wrap{max-width:760px;margin:0 auto;padding:48px 28px}h1,h2,h3{line-height:1.55;font-family:"Hiragino Mincho ProN","Yu Mincho",Georgia,serif}h1{border-bottom:1px solid '+v('--border')+';padding-bottom:.3em}h2{border-left:3px solid '+v('--accent')+';padding-left:12px}'+
  'a{color:'+v('--accent2')+'}code{font-family:Consolas,monospace;background:'+v('--surface2')+';border:1px solid '+v('--border')+';padding:.1em .4em;border-radius:5px;font-size:.86em}'+
  'pre{background:'+v('--bg2')+';border:1px solid '+v('--border')+';border-radius:10px;padding:14px;overflow-x:auto}pre code{border:none;background:none}'+
  'blockquote{border-left:3px solid '+v('--accent2')+';margin:1em 0;padding:.5em 1em;color:'+v('--muted')+'}'+
  'table{border-collapse:collapse;width:100%;font-size:.9em}th,td{border:1px solid '+v('--border')+';padding:7px 12px}th{background:'+v('--surface2')+'}'+
  'hr{border:none;height:1px;background:'+v('--border2')+';margin:2em 0}li{margin:.3em 0}.task{list-style:none}.md-hl{background:'+v('--sel')+';padding:0 3px}'+
  '.cb-head{font-size:11px;color:'+v('--faint')+';font-family:monospace;padding:4px 10px;background:'+v('--surface2')+';border-bottom:1px solid '+v('--border')+'}.md-codeblock{border:1px solid '+v('--border')+';border-radius:10px;overflow:hidden;margin:1em 0}.md-codeblock pre{border:none;margin:0;border-radius:0}'+
  '.md-imgchip{display:inline-block;border:1px dashed '+v('--border2')+';border-radius:7px;padding:2px 10px;color:'+v('--muted')+'}'+
  'footer{margin-top:56px;padding-top:16px;border-top:1px solid '+v('--border')+';font-size:11px;color:'+v('--faint')+'}'+
  '</style></head><body><div class="wrap">'+body+'<footer>Note S+ · '+fmtDT(Date.now())+' 出力 · タグ: '+esc(n.tags.join(', ')||'なし')+'</footer></div></body></html>';
}
function exportCurrent(n,fmt){
  if(!n)return;
  const name=safeName(displayTitle(n));
  if(fmt==='md')download(name+'.md',n.body,'text/markdown');
  else if(fmt==='txt')download(name+'.txt',n.body,'text/plain');
  else if(fmt==='html')download(name+'.html',exportNoteHtml(n),'text/html');
  else if(fmt==='copy')copyText(n.body,'Markdown');
}
function exportAllJson(){
  const data={app:'note-splus',version:APP_VER,exportedAt:new Date().toISOString(),notes:state.notes,views:state.views};
  download('note-splus-backup-'+fileDate()+'.json',JSON.stringify(data,null,2),'application/json');
  backup={lastAt:Date.now(),changes:0};nudgeShown=false;
  DB.put('meta',{k:'backup',v:backup});renderBackupChip();
}
function exportCsv(){
  const rows=[['title','tags','pinned','chars','createdAt','updatedAt','status']];
  visibleNotes().forEach(n=>rows.push([displayTitle(n),n.tags.join(';'),n.pinned?'1':'0',String(n.body.length),new Date(n.createdAt).toISOString(),new Date(n.updatedAt).toISOString(),n.deletedAt?'trash':'active']));
  const csv='\uFEFF'+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\r\n');
  download('note-splus-list-'+fileDate()+'.csv',csv,'text/csv');
}
function exportSelected(fmt){
  const arr=visibleNotes().filter(n=>state.selected.has(n.id));
  if(!arr.length)return;
  if(fmt==='json')download('note-splus-selected-'+fileDate()+'.json',JSON.stringify({app:'note-splus',version:APP_VER,exportedAt:new Date().toISOString(),notes:arr},null,2),'application/json');
  else download('note-splus-selected-'+fileDate()+'.md',arr.map(n=>'# '+displayTitle(n)+'\n\n'+n.body).join('\n\n---\n\n'),'text/markdown');
}
function openExportMenu(anchor){
  const n=active();
  openMenu(anchor,[
    {label:'Markdown（.md）',icon:'download',disabled:!n,fn:()=>exportCurrent(n,'md')},
    {label:'テキスト（.txt）',icon:'file',disabled:!n,fn:()=>exportCurrent(n,'txt')},
    {label:'HTML（.html・テーマ付き）',icon:'code',disabled:!n,fn:()=>exportCurrent(n,'html')},
    {label:'クリップボードにコピー',icon:'copy',disabled:!n,fn:()=>exportCurrent(n,'copy')},
    {sep:true},
    {label:'全ノートをJSONバックアップ',icon:'db',fn:exportAllJson},
    {label:'一覧をCSV出力（Excel対応）',icon:'csv',fn:exportCsv}
  ]);
}
function openMoreMenu(anchor){
  const n=active();if(!n)return;
  if(n.deletedAt){openMenu(anchor,[
    {label:'復元する',icon:'restore',fn:()=>restoreNotes([n.id])},
    {label:'完全削除…',icon:'trash',danger:true,fn:async()=>{if(await confirmDlg('完全削除','「<strong>'+esc(displayTitle(n))+'</strong>」を完全に削除します。この操作は取り消せません。','削除する',true)){await purgeNotes([n.id]);toast('完全に削除しました','danger')}}}
  ]);return}
  openMenu(anchor,[
    {label:n.pinned?'ピン留めを解除':'ピン留め',icon:'pin',fn:()=>togglePin(n)},
    {label:'複製',icon:'dup',fn:()=>duplicateNote(n)},
    {label:'スナップショットを保存',icon:'cam',fn:async()=>{await pushVersion(n);toast('スナップショットを保存しました','success');if(!$('#drawer').hidden)renderDrawer()}},
    {sep:true},
    {label:'ゴミ箱へ移動',icon:'trash',danger:true,fn:()=>trashNotes([n.id])}
  ]);
}
const ta=$('#editor');
function insertText(text){
  ta.focus();
  let ok=false;try{ok=document.execCommand('insertText',false,text)}catch(_){}
  if(!ok){const s=ta.selectionStart,e=ta.selectionEnd;ta.setRangeText(text,s,e,'end');ta.dispatchEvent(new Event('input',{bubbles:true}))}
}
function replaceRange(start,end,text,selS,selE){
  ta.focus();ta.setSelectionRange(start,end);
  let ok=false;
  try{ok=text===''?document.execCommand('delete'):document.execCommand('insertText',false,text)}catch(_){}
  if(!ok){ta.setRangeText(text,start,end,'end');ta.dispatchEvent(new Event('input',{bubbles:true}))}
  if(selS!=null)ta.setSelectionRange(selS,selE!=null?selE:selS);
}
function wrapSel(mark,placeholder){
  const s=ta.selectionStart,e=ta.selectionEnd;const sel=ta.value.slice(s,e);
  const before=ta.value.slice(Math.max(0,s-mark.length),s),after=ta.value.slice(e,e+mark.length);
  if(before===mark&&after===mark){replaceRange(s-mark.length,e+mark.length,sel,s-mark.length,e-mark.length);return}
  if(sel.startsWith(mark)&&sel.endsWith(mark)&&sel.length>=mark.length*2){const inner=sel.slice(mark.length,sel.length-mark.length);replaceRange(s,e,inner,s,s+inner.length);return}
  const content=sel||placeholder||'テキスト';
  replaceRange(s,e,mark+content+mark,s+mark.length,s+mark.length+content.length);
}
function linePrefix(prefix,toggleRe){
  const s=ta.selectionStart,e=ta.selectionEnd;const v=ta.value;
  const ls=v.lastIndexOf('\n',s-1)+1;let le=v.indexOf('\n',e);if(le===-1)le=v.length;
  const block=v.slice(ls,le);const lines=block.split('\n');
  const allOn=lines.every(l=>toggleRe.test(l)||l.trim()==='');
  const outLines=lines.map((l,idx)=>{
    if(l.trim()===''&&lines.length>1)return l;
    if(allOn)return l.replace(toggleRe,'');
    const stripped=l.replace(/^(\s*)(#{1,6}\s+|[-*+]\s\[[ xX]\]\s|[-*+]\s|\d+[.)]\s|>\s)/,'$1');
    return stripped.replace(/^(\s*)/,m=>m+(typeof prefix==='function'?prefix(idx):prefix));
  });
  const out=outLines.join('\n');
  replaceRange(ls,le,out,ls,ls+out.length);
}
function fmtAction(a){
  const n=active();if(!n||n.deletedAt)return;
  if(state.mode==='preview')setMode('split');
  switch(a){
    case 'undo':ta.focus();try{document.execCommand('undo')}catch(_){}break;
    case 'redo':ta.focus();try{document.execCommand('redo')}catch(_){}break;
    case 'bold':wrapSel('**');break;
    case 'italic':wrapSel('*');break;
    case 'strike':wrapSel('~~');break;
    case 'highlight':wrapSel('==');break;
    case 'h1':linePrefix('# ',/^#{1}\s/);break;
    case 'h2':linePrefix('## ',/^#{2}\s/);break;
    case 'h3':linePrefix('### ',/^#{3}\s/);break;
    case 'ul':linePrefix('- ',/^[-*+]\s(?!\[)/);break;
    case 'ol':linePrefix(i=>(i+1)+'. ',/^\d+[.)]\s/);break;
    case 'task':linePrefix('- [ ] ',/^[-*+]\s\[[ xX]\]\s/);break;
    case 'quote':linePrefix('> ',/^>\s/);break;
    case 'code':{
      const s=ta.selectionStart,e=ta.selectionEnd;const sel=ta.value.slice(s,e);
      if(sel.includes('\n'))replaceRange(s,e,'```\n'+sel+'\n```',s+4,s+4+sel.length);
      else wrapSel('`','code');break}
    case 'link':{
      const s=ta.selectionStart,e=ta.selectionEnd;const sel=ta.value.slice(s,e)||'リンクテキスト';
      const t='['+sel+'](https://)';replaceRange(s,e,t,s+sel.length+3,s+sel.length+11);break}
    case 'table':{
      const t='\n| 項目 | 内容 | 備考 |\n|---|---|---|\n|  |  |  |\n|  |  |  |\n';
      const s=ta.selectionStart;replaceRange(s,ta.selectionEnd,t,s+3,s+5);break}
    case 'hr':{const s=ta.selectionStart;replaceRange(s,ta.selectionEnd,'\n\n---\n\n');break}
    case 'date':insertText(todayStr());break;
  }
}
ta.addEventListener('keydown',e=>{
  if(e.isComposing||e.keyCode===229)return;
  if(e.key==='Tab'){
    e.preventDefault();
    if(e.shiftKey){
      const s=ta.selectionStart;const ls=ta.value.lastIndexOf('\n',s-1)+1;
      const line=ta.value.slice(ls);const m=line.match(/^ {1,2}/);
      if(m)replaceRange(ls,ls+m[0].length,'',Math.max(ls,s-m[0].length));
    }else insertText('  ');
    return;
  }
  if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
    const s=ta.selectionStart;if(s!==ta.selectionEnd)return;
    const ls=ta.value.lastIndexOf('\n',s-1)+1;const line=ta.value.slice(ls,s);
    let m=line.match(/^(\s*)([-*+]) \[( |x|X)\] (.*)$/);
    if(m){e.preventDefault();if(m[4]===''){replaceRange(ls,s,'');return}insertText('\n'+m[1]+m[2]+' [ ] ');return}
    m=line.match(/^(\s*)([-*+]) (.*)$/);
    if(m){e.preventDefault();if(m[3]===''){replaceRange(ls,s,'');return}insertText('\n'+m[1]+m[2]+' ');return}
    m=line.match(/^(\s*)(\d+)([.)]) (.*)$/);
    if(m){e.preventDefault();if(m[4]===''){replaceRange(ls,s,'');return}insertText('\n'+m[1]+(parseInt(m[2],10)+1)+m[3]+' ');return}
    m=line.match(/^(\s*)> (.*)$/);
    if(m){e.preventDefault();if(m[2]===''){replaceRange(ls,s,'');return}insertText('\n'+m[1]+'> ');return}
  }
});
ta.addEventListener('input',()=>{
  const n=active();if(!n||n.deletedAt)return;
  n.body=ta.value;n.updatedAt=Date.now();
  setSaveUI('typing');scheduleSave(n);
  updateCounts();renderPreviewSoon();
  if(findOpen)refreshFind(false);
});
ta.addEventListener('scroll',()=>{
  if(!state.settings.sync||state.mode!=='split')return;
  const pane=$('#previewPane');
  const ratio=ta.scrollTop/Math.max(1,ta.scrollHeight-ta.clientHeight);
  pane.scrollTop=ratio*(pane.scrollHeight-pane.clientHeight);
});
$('#titleInput').addEventListener('input',()=>{
  const n=active();if(!n||n.deletedAt)return;
  n.title=$('#titleInput').value;n.updatedAt=Date.now();
  setSaveUI('typing');scheduleSave(n);
  document.title=displayTitle(n)+' — Note S+';
});
$('#titleInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();ta.focus()}});
let cursorRaf=0;
document.addEventListener('selectionchange',()=>{if(cursorRaf)return;cursorRaf=requestAnimationFrame(()=>{cursorRaf=0;updateCursor()})});
$('#preview').addEventListener('change',e=>{
  const cb=e.target.closest('input[data-line]');if(!cb)return;
  const n=active();if(!n||n.deletedAt)return;
  const idx=+cb.dataset.line;const lines=n.body.split('\n');
  if(lines[idx]==null)return;
  lines[idx]=lines[idx].replace(/\[( |x|X)\]/,cb.checked?'[x]':'[ ]');
  n.body=lines.join('\n');n.updatedAt=Date.now();
  ta.value=n.body;scheduleSave(n);updateCounts();renderPreviewSoon();
  if(findOpen)refreshFind(false);
});
$('#preview').addEventListener('click',e=>{
  const cp=e.target.closest('[data-copy]');
  if(cp){const code=cp.closest('.md-codeblock').querySelector('code');copyText(code.textContent,'コード')}
});
let findOpen=false,findMatches=[],findIdx=-1,findCase=false;
function mirrorTop(pos){
  const cs=getComputedStyle(ta);const m=document.createElement('div');
  ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','paddingTop','paddingLeft','paddingRight','paddingBottom','width','boxSizing','tabSize'].forEach(p=>m.style[p]=cs[p]);
  m.style.cssText+=';position:absolute;left:-99999px;top:0;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word';
  m.textContent=ta.value.slice(0,pos);
  document.body.appendChild(m);const h=m.offsetHeight;m.remove();return h;
}
function refreshFind(jump){
  const q=$('#findInput').value;findMatches=[];findIdx=-1;
  if(q){
    const hay=findCase?ta.value:ta.value.toLowerCase();const needle=findCase?q:q.toLowerCase();
    let p=0;while((p=hay.indexOf(needle,p))!==-1){findMatches.push(p);p+=Math.max(1,needle.length)}
  }
  if(findMatches.length){findIdx=0;if(jump!==false)gotoMatch()}
  updateFindCount();
}
function updateFindCount(){$('#findCount').textContent=(findMatches.length?(findIdx+1):0)+'/'+findMatches.length}
function gotoMatch(){
  if(!findMatches.length)return;
  const q=$('#findInput').value;const pos=findMatches[findIdx];
  ta.focus();ta.setSelectionRange(pos,pos+q.length);
  ta.scrollTop=Math.max(0,mirrorTop(pos)-ta.clientHeight/2);
  updateFindCount();updateCursor();
}
function openFind(){
  const n=active();if(!n||n.deletedAt)return;
  if(state.mode==='preview')setMode('split');
  findOpen=true;$('#findBar').hidden=false;
  const sel=ta.value.slice(ta.selectionStart,ta.selectionEnd);
  if(sel&&!sel.includes('\n'))$('#findInput').value=sel;
  $('#findInput').focus();$('#findInput').select();refreshFind();
}
function closeFind(){findOpen=false;$('#findBar').hidden=true}
$('#btnFind').onclick=()=>findOpen?closeFind():openFind();
$('#btnFindClose').onclick=closeFind;
$('#findInput').addEventListener('input',()=>refreshFind());
$('#findInput').addEventListener('keydown',e=>{
  if(e.isComposing)return;
  if(e.key==='Enter'){e.preventDefault();if(!findMatches.length)return;findIdx=(findIdx+(e.shiftKey?-1:1)+findMatches.length)%findMatches.length;gotoMatch()}
  if(e.key==='Escape'){e.preventDefault();closeFind();ta.focus()}
});
$('#findNext').onclick=()=>{if(findMatches.length){findIdx=(findIdx+1)%findMatches.length;gotoMatch()}};
$('#findPrev').onclick=()=>{if(findMatches.length){findIdx=(findIdx-1+findMatches.length)%findMatches.length;gotoMatch()}};
$('#findCase').onclick=()=>{findCase=!findCase;$('#findCase').setAttribute('aria-pressed',String(findCase));refreshFind()};
$('#btnReplace').onclick=()=>{
  const n=active();if(!n||!findMatches.length)return;
  const q=$('#findInput').value;const pos=findMatches[findIdx];
  replaceRange(pos,pos+q.length,$('#replaceInput').value);
  refreshFind(false);if(findMatches.length){findIdx=clamp(findIdx,0,findMatches.length-1);gotoMatch()}else updateFindCount();
};
$('#btnReplaceAll').onclick=async()=>{
  const n=active();if(!n||!findMatches.length)return;
  const q=$('#findInput').value;const count=findMatches.length;
  await pushVersion(n);
  const re=new RegExp(escReg(q),findCase?'g':'gi');
  const next=ta.value.replace(re,()=>$('#replaceInput').value);
  ta.value=next;n.body=next;n.updatedAt=Date.now();
  scheduleSave(n);updateCounts();renderPreview();refreshFind(false);updateFindCount();
  toast(count+'件を置換しました（置換前のスナップショットを保存）','success');
};
function setMode(m){state.mode=m;updateChrome();if(m!=='edit')renderPreview()}
$$('#modeSeg button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
function setZen(on){state.zen=on;document.body.classList.toggle('zen',on);$('#zenExit').hidden=!on;if(on){closeFind();ta.focus()}}
$('#btnZen').onclick=()=>setZen(true);
$('#zenExit').onclick=()=>setZen(false);
$('#btnNew').onclick=()=>createNote();
$('#btnEmptyNew').onclick=()=>createNote();
$('#btnEmptySamples').onclick=async()=>{
  const s=seedNotes();
  for(const n of s.notes){state.notes.push(n);await DB.put('notes',n)}
  renderAll();loadNote(s.notes[0].id);toast('サンプルノートを追加しました','success');
};
const doSearch=debounce(()=>{state.query=$('#search').value.trim();state.activeView=null;$('#btnClearSearch').hidden=!$('#search').value;state.selected.clear();renderList()},130);
$('#search').addEventListener('input',doSearch);
$('#search').addEventListener('keydown',e=>{
  if(e.isComposing)return;
  if(e.key==='Escape'){$('#search').value='';state.query='';$('#btnClearSearch').hidden=true;renderList()}
  if(e.key==='ArrowDown'){e.preventDefault();const c=$('#noteList .note-card');if(c)c.focus()}
});
$('#btnClearSearch').onclick=()=>{$('#search').value='';state.query='';$('#btnClearSearch').hidden=true;renderList();$('#search').focus()};
$$('#tabs .tab').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;state.activeView=null;state.selected.clear();renderAll();
  const arr=visibleNotes();if(arr.length&&!arr.some(n=>n.id===state.activeId))loadNote(arr[0].id)});
$('#sortSel').onchange=()=>{state.sort=$('#sortSel').value;state.activeView=null;renderList();
  if(state.sort==='manual')toast('手動モード：カードをドラッグして並び替えできます','info')};
$('#btnSaveView').onclick=async()=>{
  const suggested=state.tag||state.query||(state.tab==='pinned'?'ピン留め':state.tab==='trash'?'ゴミ箱':'');
  const name=await promptDlg('ビューを保存','現在の検索語・タグ・タブ・並び順を名前付きで保存します。','',suggested||'マイビュー');
  if(!name)return;
  const v={id:uid(),name,tab:state.tab,query:state.query,tag:state.tag,sort:state.sort};
  state.views.push(v);state.activeView=v.id;
  await DB.put('meta',{k:'views',v:state.views});renderViews();
  toast('ビュー「'+esc(name)+'」を保存しました','success');
};
$('#selectAll').onchange=e=>{
  const arr=visibleNotes();
  if(e.target.checked)arr.forEach(n=>state.selected.add(n.id));else arr.forEach(n=>state.selected.delete(n.id));
  renderList();
};
const noteList=$('#noteList');
noteList.addEventListener('click',e=>{
  const card=e.target.closest('.note-card');if(!card)return;
  const id=card.dataset.id;const n=note(id);if(!n)return;
  const act=e.target.closest('[data-act]');
  if(act){
    const a=act.dataset.act;
    if(a==='pin'){togglePin(n);return}
    if(a==='check'){
      if(act.checked)state.selected.add(id);else state.selected.delete(id);
      card.classList.toggle('checked',act.checked);renderBulkBar();
      const arr=visibleNotes();const sv=arr.filter(x=>state.selected.has(x.id)).length;
      $('#selectAll').checked=sv===arr.length&&sv>0;$('#selectAll').indeterminate=sv>0&&sv<arr.length;
      return}
    if(a==='restore'){restoreNotes([id]);return}
    if(a==='purge'){confirmDlg('完全削除','「<strong>'+esc(displayTitle(n))+'</strong>」を完全に削除します。この操作は取り消せません。','削除する',true).then(async ok=>{if(ok){await purgeNotes([id]);toast('完全に削除しました','danger')}});return}
    return;
  }
  loadNote(id);closeMobileSb();
});
noteList.addEventListener('keydown',e=>{
  const card=e.target.closest('.note-card');if(!card)return;
  if(e.key==='Enter'||e.key===' '){e.preventDefault();loadNote(card.dataset.id);closeMobileSb()}
  if(e.key==='ArrowDown'){e.preventDefault();const nx=card.nextElementSibling;if(nx&&nx.classList.contains('note-card'))nx.focus()}
  if(e.key==='ArrowUp'){e.preventDefault();const pv=card.previousElementSibling;if(pv&&pv.classList.contains('note-card'))pv.focus();else $('#search').focus()}
});
let dragId=null;
noteList.addEventListener('dragstart',e=>{
  const card=e.target.closest('.note-card');if(!card||!dragEnabled()){e.preventDefault();return}
  dragId=card.dataset.id;card.classList.add('dragging');
  e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId)}catch(_){}
});
noteList.addEventListener('dragover',e=>{
  if(!dragId)return;e.preventDefault();
  const card=e.target.closest('.note-card');
  $$('.note-card.drop-before,.note-card.drop-after').forEach(c=>c.classList.remove('drop-before','drop-after'));
  if(!card||card.dataset.id===dragId)return;
  const r=card.getBoundingClientRect();
  card.classList.add(e.clientY<r.top+r.height/2?'drop-before':'drop-after');
});
noteList.addEventListener('drop',async e=>{
  if(!dragId)return;e.preventDefault();
  const card=e.target.closest('.note-card');
  const id=dragId;dragId=null;
  $$('.note-card.dragging,.note-card.drop-before,.note-card.drop-after').forEach(c=>c.classList.remove('dragging','drop-before','drop-after'));
  if(!card||card.dataset.id===id){renderList();return}
  const r=card.getBoundingClientRect();const before=e.clientY<r.top+r.height/2;
  const seq=liveNotes().sort((a,b)=>a.order-b.order);
  const moving=seq.find(n=>n.id===id);if(!moving)return;
  const rest=seq.filter(n=>n.id!==id);
  let idx=rest.findIndex(n=>n.id===card.dataset.id);
  if(!before)idx++;
  rest.splice(idx,0,moving);
  rest.forEach((n,i)=>{if(n.order!==i){n.order=i;DB.put('notes',n)}});
  renderList();toast('並び順を保存しました','success');
});
noteList.addEventListener('dragend',()=>{dragId=null;$$('.note-card.dragging,.note-card.drop-before,.note-card.drop-after').forEach(c=>c.classList.remove('dragging','drop-before','drop-after'))});
$('#bulkBar').addEventListener('click',async e=>{
  const b=e.target.closest('[data-bulk]');if(!b)return;
  const ids=[...state.selected];if(!ids.length&&b.dataset.bulk!=='clear')return;
  switch(b.dataset.bulk){
    case 'clear':state.selected.clear();renderList();break;
    case 'pin':{
      const targets=ids.map(note).filter(Boolean);
      const allPinned=targets.every(n=>n.pinned);
      targets.forEach(n=>{n.pinned=!allPinned;DB.put('notes',n)});
      state.selected.clear();renderAll();toast(allPinned?'ピン留めを解除しました':'ピン留めしました','success');break}
    case 'md':exportSelected('md');break;
    case 'json':exportSelected('json');break;
    case 'restore':restoreNotes(ids);break;
    case 'delete':
      if(state.tab==='trash'){
        if(await confirmDlg('完全削除','選択した<strong>'+ids.length+'件</strong>を完全に削除します。この操作は取り消せません。','削除する',true)){await purgeNotes(ids);toast(ids.length+'件を完全に削除しました','danger')}
      }else trashNotes(ids);
      break;
  }
});
$('#formatBar').addEventListener('click',e=>{const b=e.target.closest('[data-fmt]');if(b)fmtAction(b.dataset.fmt)});
$('#btnExport').onclick=e=>openExportMenu(e.currentTarget);
$('#btnMore').onclick=e=>openMoreMenu(e.currentTarget);
$('#btnRestoreNote').onclick=()=>{const n=active();if(n)restoreNotes([n.id])};
$('#btnPurgeNote').onclick=async()=>{const n=active();if(!n)return;
  if(await confirmDlg('完全削除','「<strong>'+esc(displayTitle(n))+'</strong>」を完全に削除します。この操作は取り消せません。','削除する',true)){await purgeNotes([n.id]);toast('完全に削除しました','danger')}};
$('#btnFontMinus').onclick=()=>setSetting('fontSize',clamp(state.settings.fontSize-1,12,24));
$('#btnFontPlus').onclick=()=>setSetting('fontSize',clamp(state.settings.fontSize+1,12,24));
$('#btnTheme').onclick=()=>{
  const i=THEMES.findIndex(t=>t.id===state.settings.theme);
  const next=THEMES[(i+1)%THEMES.length];
  setSetting('theme',next.id);
  toast('テーマ「'+next.name+'」に変更しました','info');
};
$('#backupChip').onclick=exportAllJson;
function closeMobileSb(){if(innerWidth<=900){document.body.classList.remove('sb-open');if($('#drawer').hidden)$('#scrim').hidden=true}}
$('#btnMenu').onclick=()=>{document.body.classList.add('sb-open');$('#scrim').hidden=false};
$('#btnSidebarClose').onclick=closeMobileSb;
$('#scrim').onclick=()=>{closeMobileSb();closeDrawer()};
(()=>{
  const rz=$('#resizer');let on=false;
  rz.addEventListener('pointerdown',e=>{on=true;rz.classList.add('active');rz.setPointerCapture(e.pointerId)});
  rz.addEventListener('pointermove',e=>{if(!on)return;const w=clamp(e.clientX,230,430);state.settings.sidebarW=w;document.documentElement.style.setProperty('--sb-w',w+'px')});
  rz.addEventListener('pointerup',()=>{on=false;rz.classList.remove('active');persistSettings.now()});
})();
function openDrawer(){
  const n=active();if(!n)return;
  $('#drawer').hidden=false;renderDrawer();
  if(innerWidth<=900)$('#scrim').hidden=false;
  $('#btnInfo').classList.add('on');
}
function closeDrawer(){$('#drawer').hidden=true;$('#btnInfo').classList.remove('on');if(!document.body.classList.contains('sb-open'))$('#scrim').hidden=true}
$('#btnInfo').onclick=()=>$('#drawer').hidden?openDrawer():closeDrawer();
$('#drawerClose').onclick=closeDrawer;
function updateDrawerStats(){
  if($('#drawer').hidden)return;const n=active();if(!n)return;
  const c=$('#drawerBody [data-stat="chars"]');if(c)c.textContent=n.body.replace(/\n/g,'').length.toLocaleString()+'字';
  const u=$('#drawerBody [data-stat="updated"]');if(u)u.textContent=fmtDT(n.updatedAt);
}
function renderDrawer(){
  const n=active();const body=$('#drawerBody');if(!n){body.innerHTML='';return}
  const vers=state.versions.get(n.id)||[];
  const trash=!!n.deletedAt;
  const tags=n.tags.map(t=>'<span class="dw-tag" style="--tc:'+tagColor(t)+'"><i></i>'+esc(t)+(trash?'':'<button data-dtag="'+esc(t)+'" aria-label="タグを削除">'+ic('x',11)+'</button>')+'</span>').join('');
  const outline=lastOutline.length?lastOutline.map(h=>'<button class="lv'+h.level+'" data-hline="'+h.line+'">'+esc(h.text)+'</button>').join(''):'<div class="dw-empty">見出し（# 〜）を書くとアウトラインがここに並びます。</div>';
  const verHtml=vers.length?vers.map(v=>{
    const first=(v.body.split('\n').find(l=>l.trim())||'').replace(/[#>*`\-]/g,'').trim().slice(0,40);
    return '<div class="ver-item"><div class="ver-info"><div class="ver-time">'+fmtDT(v.at)+'</div><div class="ver-sub">'+v.chars.toLocaleString()+'字 · '+esc(first)+'</div></div><button data-vrestore="'+v.id+'">復元</button><button class="del" data-vdel="'+v.id+'" aria-label="削除">'+ic('x',12)+'</button></div>';
  }).join(''):'<div class="dw-empty">まだスナップショットがありません。編集を続けると10分ごとに自動保存されます（最大25世代）。</div>';
  body.innerHTML=
    '<div class="dw-section"><h3>'+ic('file',12)+'ノート情報</h3><div class="meta-grid">'+
    '<div class="meta-cell"><div class="k">作成</div><div class="v">'+fmtDT(n.createdAt)+'</div></div>'+
    '<div class="meta-cell"><div class="k">更新</div><div class="v" data-stat="updated">'+fmtDT(n.updatedAt)+'</div></div>'+
    '<div class="meta-cell"><div class="k">文字数</div><div class="v" data-stat="chars">'+n.body.replace(/\n/g,'').length.toLocaleString()+'字</div></div>'+
    '<div class="meta-cell"><div class="k">行数</div><div class="v">'+(n.body?n.body.split('\n').length:0)+'行</div></div></div></div>'+
    '<div class="dw-section"><h3>'+ic('tag',12)+'タグ</h3><div class="dw-tags">'+(tags||'<span class="dw-empty">タグなし</span>')+'</div>'+
    (trash?'':'<input id="dwTagInput" placeholder="タグを追加（Enter・カンマ区切り可）" maxlength="24">')+'</div>'+
    '<div class="dw-section"><h3>'+ic('list',12)+'アウトライン</h3><div class="dw-outline">'+outline+'</div></div>'+
    '<div class="dw-section"><h3>'+ic('cam',12)+'バージョン履歴</h3>'+
    (trash?'':'<button class="dw-btn wide" id="dwSnap" style="margin-bottom:8px">'+ic('cam',13)+'今すぐスナップショットを保存</button>')+verHtml+'</div>'+
    '<div class="dw-section"><h3>'+ic('download',12)+'書き出し</h3><div class="dw-btn-row">'+
    '<button class="dw-btn" data-exp="md">'+ic('download',13)+'.md</button>'+
    '<button class="dw-btn" data-exp="txt">'+ic('file',13)+'.txt</button>'+
    '<button class="dw-btn" data-exp="html">'+ic('code',13)+'.html</button>'+
    '<button class="dw-btn" data-exp="copy">'+ic('copy',13)+'コピー</button></div></div>'+
    '<div class="dw-section"><h3>'+ic('alert',12)+'操作</h3><div class="dw-btn-row">'+
    (trash?'<button class="dw-btn" id="dwRestore">'+ic('restore',13)+'復元する</button><button class="dw-btn danger" id="dwPurge">'+ic('trash',13)+'完全削除</button>'
      :'<button class="dw-btn" id="dwDup">'+ic('dup',13)+'複製</button><button class="dw-btn danger" id="dwTrash">'+ic('trash',13)+'ゴミ箱へ</button>')+
    '</div></div>';
}
$('#drawerBody').addEventListener('click',async e=>{
  const n=active();if(!n)return;
  const dt=e.target.closest('[data-dtag]');
  if(dt){n.tags=n.tags.filter(t=>t!==dt.dataset.dtag);n.updatedAt=Date.now();await DB.put('notes',n);renderDrawer();renderTagRow();renderList();return}
  const hlBtn=e.target.closest('[data-hline]');
  if(hlBtn){
    if(state.mode==='edit')setMode('split');
    const target=$('#preview [data-hline="'+hlBtn.dataset.hline+'"]');
    if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    if(innerWidth<=900)closeDrawer();
    return}
  const vr=e.target.closest('[data-vrestore]');
  if(vr){
    const v=(state.versions.get(n.id)||[]).find(x=>x.id===vr.dataset.vrestore);if(!v)return;
    if(await confirmDlg('バージョンを復元',fmtDT(v.at)+' の内容（'+v.chars.toLocaleString()+'字）に戻します。<strong>現在の内容は自動でスナップショットに退避</strong>されます。','復元する')){
      await pushVersion(n);
      n.body=v.body;n.title=v.title;n.updatedAt=Date.now();
      ta.value=n.body;$('#titleInput').value=n.title;
      await DB.put('notes',n);renderPreview();updateCounts();renderList();renderDrawer();setSaveUI('saved');
      toast('バージョンを復元しました','success');
    }
    return}
  const vd=e.target.closest('[data-vdel]');
  if(vd){
    const id=vd.dataset.vdel;
    const list=(state.versions.get(n.id)||[]).filter(x=>x.id!==id);
    state.versions.set(n.id,list);await DB.del('versions',id);renderDrawer();
    toast('スナップショットを削除しました','info');return}
  const ex=e.target.closest('[data-exp]');
  if(ex){exportCurrent(n,ex.dataset.exp);return}
  if(e.target.closest('#dwSnap')){await pushVersion(n);renderDrawer();toast('スナップショットを保存しました','success');return}
  if(e.target.closest('#dwDup')){duplicateNote(n);return}
  if(e.target.closest('#dwTrash')){trashNotes([n.id]);return}
  if(e.target.closest('#dwRestore')){restoreNotes([n.id]);return}
  if(e.target.closest('#dwPurge')){
    if(await confirmDlg('完全削除','「<strong>'+esc(displayTitle(n))+'</strong>」を完全に削除します。この操作は取り消せません。','削除する',true)){await purgeNotes([n.id]);toast('完全に削除しました','danger')}
  }
});
$('#drawerBody').addEventListener('keydown',async e=>{
  if(e.target.id!=='dwTagInput'||e.key!=='Enter'||e.isComposing)return;
  e.preventDefault();
  const n=active();if(!n)return;
  const parts=e.target.value.split(/[,、]/).map(s=>s.trim()).filter(Boolean);
  let added=0;
  parts.forEach(t=>{if(!n.tags.includes(t)&&n.tags.length<8){n.tags.push(t);added++}});
  if(added){n.updatedAt=Date.now();await DB.put('notes',n);renderDrawer();renderTagRow();renderList();
    const inp=$('#dwTagInput');if(inp)inp.focus()}
});
function openSettings(){
  const s=state.settings;
  const themeCards=THEMES.map(t=>'<button class="theme-card'+(s.theme===t.id?' on':'')+'" data-theme-id="'+t.id+'"><span class="theme-swatches">'+t.sw.map(c=>'<i style="background:'+c+'"></i>').join('')+'</span><span class="tn">'+t.name+'</span><br><span class="te">'+t.en+'</span></button>').join('');
  const backupInfo='前回バックアップ: '+(backup.lastAt?fmtDT(backup.lastAt):'未実施')+' ／ 以降の変更: '+backup.changes+'件 ／ 永続化: '+(state.persisted?'許可済み':'未許可（ブラウザ判断）');
  openModal(
    '<div class="modal-head">'+ic('sliders',18)+'<h2>設定</h2><button class="icon-btn" data-close="" aria-label="閉じる">'+ic('x',15)+'</button></div>'+
    '<div class="modal-body">'+
    '<div class="set-section"><h3>'+ic('palette',12)+'テーマ</h3><div class="theme-grid">'+themeCards+'</div></div>'+
    '<div class="set-section"><h3>'+ic('pen',12)+'エディタ</h3>'+
    '<div class="set-row"><label>本文フォント</label><select data-set="fontFamily"><option value="sans"'+(s.fontFamily==='sans'?' selected':'')+'>ゴシック（デフォルト）</option><option value="serif"'+(s.fontFamily==='serif'?' selected':'')+'>明朝</option><option value="mono"'+(s.fontFamily==='mono'?' selected':'')+'>等幅</option></select></div>'+
    '<div class="set-row"><label>文字サイズ</label><input type="range" min="12" max="24" step="1" value="'+s.fontSize+'" data-set="fontSize"><span class="set-val" data-val="fontSize">'+s.fontSize+'px</span></div>'+
    '<div class="set-row"><label>行間</label><input type="range" min="1.4" max="2.6" step="0.1" value="'+s.lineHeight+'" data-set="lineHeight"><span class="set-val" data-val="lineHeight">'+s.lineHeight.toFixed(1)+'</span></div>'+
    '<div class="set-row"><label>本文の最大幅</label><input type="range" min="560" max="1100" step="20" value="'+s.editorWidth+'" data-set="editorWidth"><span class="set-val" data-val="editorWidth">'+s.editorWidth+'px</span></div>'+
    '<div class="set-row"><label>スクロール同期<span class="sub">分割表示で編集とプレビューを連動</span></label><label class="switch"><input type="checkbox" data-set="sync"'+(s.sync?' checked':'')+'><i></i></label></div></div>'+
    '<div class="set-section"><h3>'+ic('db',12)+'データ</h3>'+
    '<div class="about-box" style="margin-bottom:8px">'+backupInfo+'</div>'+
    '<div class="data-btns">'+
    '<button class="data-btn" data-act="export-all">'+ic('download',17)+'<span><span class="t">全ノートをJSONバックアップ</span><span class="d">ダウンロードのみ。ファイルの読み込みは行いません</span></span></button>'+
    '<button class="data-btn" data-act="export-csv">'+ic('csv',17)+'<span><span class="t">一覧をCSV出力</span><span class="d">BOM付き · Excelでそのまま開けます</span></span></button>'+
    '<button class="data-btn" data-act="paste-restore">'+ic('restore',17)+'<span><span class="t">貼り付けで復元</span><span class="d">バックアップJSONをテキストとして貼り付けてマージ</span></span></button>'+
    '<button class="data-btn" data-act="samples">'+ic('sparkle',17)+'<span><span class="t">サンプルノートを追加</span><span class="d">ガイドやサンプルをもう一度投入</span></span></button>'+
    '<button class="data-btn danger" data-act="empty-trash">'+ic('trash',17)+'<span><span class="t">ゴミ箱を空にする</span><span class="d">'+state.notes.filter(n=>n.deletedAt).length+'件 · 取り消せません</span></span></button>'+
    '<button class="data-btn danger" data-act="wipe">'+ic('alert',17)+'<span><span class="t">全データを削除</span><span class="d">ノート・履歴・ビューをすべて消去</span></span></button></div></div>'+
    '<div class="set-section"><h3>'+ic('kb',12)+'ヘルプ</h3><div class="data-btns">'+
    '<button class="data-btn" data-act="shortcuts">'+ic('kb',17)+'<span><span class="t">キーボードショートカット</span><span class="d">一覧を表示</span></span></button></div></div>'+
    '<div class="set-section"><h3>'+ic('info',12)+'このアプリについて</h3><div class="about-box"><strong>Note S+</strong> v'+APP_VER+' — 完全オフライン・依存ゼロ・単一ファイル。<br>保存先はこのブラウザの IndexedDB のみ。外部サーバー・CDN・APIへの通信は一切ありません。<br>「クラウドに預けたくないメモ」のための、静かで速い書き場所です。</div></div>'+
    '</div>'
  ,{wide:true});
  const root=$('#modalRoot .modal');
  root.addEventListener('input',e=>{
    const k=e.target.dataset.set;if(!k)return;
    let v;
    if(e.target.type==='checkbox')v=e.target.checked;
    else if(e.target.type==='range')v=parseFloat(e.target.value);
    else v=e.target.value;
    setSetting(k,v);
    const lbl=root.querySelector('[data-val="'+k+'"]');
    if(lbl)lbl.textContent=k==='lineHeight'?v.toFixed(1):v+(k==='fontFamily'?'':'px');
  });
  root.addEventListener('click',async e=>{
    const tc=e.target.closest('[data-theme-id]');
    if(tc){setSetting('theme',tc.dataset.themeId);root.querySelectorAll('.theme-card').forEach(c=>c.classList.toggle('on',c===tc));return}
    const act=e.target.closest('[data-act]');if(!act)return;
    const a=act.dataset.act;
    if(a==='export-all')exportAllJson();
    else if(a==='export-csv')exportCsv();
    else if(a==='shortcuts'){closeModal(null);openShortcuts()}
    else if(a==='paste-restore'){closeModal(null);openPasteRestore()}
    else if(a==='samples'){
      closeModal(null);
      const sd=seedNotes();
      for(const n of sd.notes){state.notes.push(n);await DB.put('notes',n)}
      renderAll();loadNote(sd.notes[0].id);refreshStorage();toast('サンプルノートを追加しました','success');
    }
    else if(a==='empty-trash'){
      const ids=state.notes.filter(n=>n.deletedAt).map(n=>n.id);
      if(!ids.length){toast('ゴミ箱はすでに空です','info');return}
      closeModal(null);
      if(await confirmDlg('ゴミ箱を空にする','ゴミ箱内の<strong>'+ids.length+'件</strong>を完全に削除します。この操作は取り消せません。','空にする',true)){await purgeNotes(ids);toast('ゴミ箱を空にしました','danger')}
    }
    else if(a==='wipe'){
      closeModal(null);
      if(await confirmDlg('全データを削除','すべてのノート・バージョン履歴・保存ビューを削除します。<strong>この操作は取り消せません。</strong>必要なら先にJSONバックアップを取得してください。','すべて削除する',true)){
        await DB.clear('notes');await DB.clear('versions');
        state.notes=[];state.versions.clear();state.views=[];state.activeId=null;
        await DB.put('meta',{k:'views',v:[]});
        state.selected.clear();renderAll();loadNote(null);refreshStorage();
        toast('全データを削除しました','danger');
      }
    }
  });
}
$('#btnSettings').onclick=openSettings;
function openShortcuts(){
  const rows=[
    ['コマンドパレット',MOD+'+K'],['今すぐ保存',MOD+'+S'],['新規メモ','Alt+N'],
    ['メモ内検索・置換',MOD+'+F'],['サイドバー検索','/'],['太字 / 斜体',MOD+'+B / '+MOD+'+I'],
    ['取り消し線',MOD+'+Shift+X'],['書き出しメニュー',MOD+'+Shift+E'],['表示モード切替',MOD+'+\\'],
    ['インデント / 解除','Tab / Shift+Tab'],['リスト自動継続','Enter'],['閉じる・集中解除','Esc']
  ];
  openModal('<div class="modal-head">'+ic('kb',18)+'<h2>キーボードショートカット</h2><button class="icon-btn" data-close="" aria-label="閉じる">'+ic('x',15)+'</button></div>'+
  '<div class="modal-body"><table class="sc-table">'+rows.map(r=>'<tr><td>'+esc(r[0])+'</td><td><kbd>'+esc(r[1])+'</kbd></td></tr>').join('')+'</table></div>');
}
function openPasteRestore(){
  openModal('<div class="modal-head">'+ic('restore',18)+'<h2>貼り付けで復元</h2><button class="icon-btn" data-close="" aria-label="閉じる">'+ic('x',15)+'</button></div>'+
  '<div class="modal-body"><div class="modal-msg">JSONバックアップの中身を<strong>テキストとして貼り付け</strong>てください。同じIDのノートは更新日時が新しい方で上書きされます。</div>'+
  '<textarea id="restoreText" placeholder=\'{"app":"note-splus","notes":[…]}\' autofocus></textarea><div class="restore-err" id="restoreErr"></div></div>'+
  '<div class="modal-foot"><button class="btn-cancel" data-close="">キャンセル</button><button class="btn-primary" id="doRestore">マージして復元</button></div>',{wide:true});
  $('#doRestore').onclick=async()=>{
    const err=$('#restoreErr');
    let data;
    try{data=JSON.parse($('#restoreText').value)}catch(_){err.textContent='JSONとして解析できませんでした。バックアップ全文を貼り付けてください。';return}
    if(!data||!Array.isArray(data.notes)){err.textContent='形式が違います（notes 配列が必要です）。';return}
    let added=0,updated=0;
    for(const raw of data.notes){
      if(!raw||typeof raw.id!=='string')continue;
      const clean={id:raw.id,title:String(raw.title||''),body:String(raw.body||''),tags:Array.isArray(raw.tags)?raw.tags.map(String).slice(0,8):[],pinned:!!raw.pinned,order:typeof raw.order==='number'?raw.order:0,createdAt:+raw.createdAt||Date.now(),updatedAt:+raw.updatedAt||Date.now(),deletedAt:raw.deletedAt?+raw.deletedAt:null};
      const exist=note(clean.id);
      if(!exist){state.notes.push(clean);added++;await DB.put('notes',clean)}
      else if(clean.updatedAt>exist.updatedAt){Object.assign(exist,clean);updated++;await DB.put('notes',clean)}
    }
    if(Array.isArray(data.views)){
      data.views.forEach(v=>{if(v&&v.id&&v.name&&!state.views.some(x=>x.id===v.id))state.views.push({id:String(v.id),name:String(v.name),tab:v.tab||'all',query:v.query||'',tag:v.tag||null,sort:v.sort||'updated'})});
      await DB.put('meta',{k:'views',v:state.views});
    }
    closeModal(null);renderAll();ensureActive();loadNote(state.activeId);refreshStorage();
    toast('復元完了：'+added+'件追加 / '+updated+'件更新','success');
  };
}
let palItems=[],palFiltered=[],palIdx=0;
function paletteActions(){
  const n=active();
  const acts=[
    {label:'新規ノートを作成',icon:'plus',hint:'Alt+N',keys:'new shinsei create',fn:()=>createNote()},
    {label:'編集モード',icon:'pen',keys:'edit henshu',fn:()=>setMode('edit')},
    {label:'分割表示',icon:'cols',keys:'split bunkatsu',fn:()=>setMode('split')},
    {label:'プレビューのみ',icon:'eye',keys:'preview',fn:()=>setMode('preview')},
    {label:'集中モード',icon:'max',keys:'zen focus shuchu',fn:()=>setZen(true)},
    {label:'ノート内検索・置換',icon:'search',hint:MOD+'+F',keys:'find kensaku replace',fn:openFind},
    {label:'ノート情報・履歴を開く',icon:'info',keys:'info history rireki drawer',fn:openDrawer},
    {label:'スナップショットを保存',icon:'cam',keys:'snapshot version',disabled:!n||!!(n&&n.deletedAt),fn:async()=>{if(n){await pushVersion(n);toast('スナップショットを保存しました','success');if(!$('#drawer').hidden)renderDrawer()}}},
    {label:'ピン留め切替',icon:'pin',keys:'pin',disabled:!n||!!(n&&n.deletedAt),fn:()=>n&&togglePin(n)},
    {label:'ノートを複製',icon:'dup',keys:'duplicate fukusei',disabled:!n,fn:()=>n&&duplicateNote(n)},
    {label:'Markdownでダウンロード',icon:'download',keys:'export md download',disabled:!n,fn:()=>exportCurrent(n,'md')},
    {label:'HTMLでダウンロード',icon:'code',keys:'export html',disabled:!n,fn:()=>exportCurrent(n,'html')},
    {label:'全ノートをJSONバックアップ',icon:'db',keys:'backup json export all',fn:exportAllJson},
    {label:'一覧をCSV出力',icon:'csv',keys:'csv excel export',fn:exportCsv},
    {label:'ゴミ箱へ移動',icon:'trash',keys:'trash gomi delete',disabled:!n||!!(n&&n.deletedAt),fn:()=>n&&trashNotes([n.id])},
    {label:'設定を開く',icon:'sliders',keys:'settings settei',fn:openSettings},
    {label:'ショートカット一覧',icon:'kb',keys:'shortcut keyboard help',fn:openShortcuts},
    {label:'貼り付けで復元',icon:'restore',keys:'restore import paste fukugen',fn:openPasteRestore},
    {sep:true,group:'テーマ'}
  ];
  THEMES.forEach(t=>acts.push({label:'テーマ：'+t.name+'（'+t.en+'）',icon:'palette',keys:'theme '+t.id+' '+t.en.toLowerCase(),fn:()=>{setSetting('theme',t.id);toast('テーマ「'+t.name+'」に変更しました','info')}}));
  acts.push({sep:true,group:'ノートへ移動'});
  liveNotes().sort((a,b)=>b.updatedAt-a.updatedAt).forEach(x=>acts.push({label:displayTitle(x),icon:'file',keys:x.tags.join(' '),note:true,fn:()=>{if(state.tab==='trash'){state.tab='all';renderAll()}loadNote(x.id);closeMobileSb()}}));
  return acts;
}
function openPalette(){
  closeMenu();
  $('#palette').hidden=false;$('#palInput').value='';
  palItems=paletteActions();palIdx=0;renderPalette('');
  setTimeout(()=>$('#palInput').focus(),20);
}
function closePalette(){$('#palette').hidden=true}
function renderPalette(q){
  q=q.toLowerCase().trim();
  const rows=[];
  if(!q){palItems.forEach(it=>{if(it.sep)rows.push({group:it.group});else if(!it.disabled)rows.push(it)})}
  else{palItems.forEach(it=>{if(!it.sep&&!it.disabled&&(it.label+' '+(it.keys||'')).toLowerCase().includes(q))rows.push(it)})}
  palFiltered=rows.filter(x=>!x.group);
  palIdx=clamp(palIdx,0,Math.max(0,palFiltered.length-1));
  const list=$('#palList');list.innerHTML='';
  if(!palFiltered.length){list.innerHTML='<div class="pal-none">該当するコマンド・ノートがありません</div>';return}
  rows.forEach(it=>{
    if(it.group){const g=document.createElement('div');g.className='pal-group';g.textContent=it.group;list.appendChild(g);return}
    const i=palFiltered.indexOf(it);
    const b=document.createElement('button');b.className='pal-item'+(i===palIdx?' active':'');b.setAttribute('role','option');
    b.innerHTML=ic(it.icon,15)+'<span>'+hl(it.label,q)+'</span>'+(it.hint?'<span class="hint">'+esc(it.hint)+'</span>':it.note?'<span class="hint">ノート</span>':'');
    b.onmouseenter=()=>{palIdx=i;list.querySelectorAll('.pal-item').forEach((el,x)=>el.classList.toggle('active',x===i))};
    b.onclick=()=>{closePalette();it.fn()};
    list.appendChild(b);
  });
  const act=list.querySelector('.pal-item.active');if(act)act.scrollIntoView({block:'nearest'});
}
$('#palInput').addEventListener('input',()=>{palIdx=0;renderPalette($('#palInput').value)});
$('#palInput').addEventListener('keydown',e=>{
  if(e.isComposing)return;
  if(e.key==='ArrowDown'){e.preventDefault();palIdx=(palIdx+1)%Math.max(1,palFiltered.length);renderPalette($('#palInput').value)}
  else if(e.key==='ArrowUp'){e.preventDefault();palIdx=(palIdx-1+palFiltered.length)%Math.max(1,palFiltered.length);renderPalette($('#palInput').value)}
  else if(e.key==='Enter'){e.preventDefault();const it=palFiltered[palIdx];if(it){closePalette();it.fn()}}
  else if(e.key==='Escape'){e.preventDefault();closePalette()}
});
$('#palette').addEventListener('pointerdown',e=>{if(e.target===$('#palette'))closePalette()});
$('#btnPalette').onclick=openPalette;
document.addEventListener('keydown',e=>{
  const mod=e.ctrlKey||e.metaKey;
  const typing=e.target.closest('input,textarea,select');
  if(e.key==='Escape'){
    if(!$('#palette').hidden){closePalette();return}
    if($('#modalRoot').classList.contains('open')){closeModal(null);return}
    if($('#menuRoot').children.length){closeMenu();return}
    if(!$('#drawer').hidden){closeDrawer();return}
    if(findOpen){closeFind();ta.focus();return}
    if(state.zen){setZen(false);return}
    if(state.selected.size){state.selected.clear();renderList();return}
    if(document.body.classList.contains('sb-open')){closeMobileSb();return}
    return;
  }
  if(modalResolve||!$('#palette').hidden)return;
  if(mod&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();return}
  if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();flushSave();const n=active();if(n)persistNote(n);toast('保存しました','success');return}
  if(e.altKey&&e.key.toLowerCase()==='n'){e.preventDefault();createNote();return}
  if(mod&&e.key.toLowerCase()==='f'){e.preventDefault();openFind();return}
  if(mod&&e.shiftKey&&e.key.toLowerCase()==='e'){e.preventDefault();openExportMenu($('#btnExport'));return}
  if(mod&&e.key==='\\'){e.preventDefault();const seq=['edit','split','preview'];setMode(seq[(seq.indexOf(state.mode)+1)%3]);return}
  if(mod&&e.shiftKey&&e.key.toLowerCase()==='x'&&document.activeElement===ta){e.preventDefault();fmtAction('strike');return}
  if(mod&&e.key.toLowerCase()==='b'&&document.activeElement===ta){e.preventDefault();fmtAction('bold');return}
  if(mod&&e.key.toLowerCase()==='i'&&document.activeElement===ta){e.preventDefault();fmtAction('italic');return}
  if(!typing&&e.key==='/'){e.preventDefault();if(innerWidth<=900){document.body.classList.add('sb-open');$('#scrim').hidden=false}$('#search').focus();return}
});
document.addEventListener('pointerdown',e=>{
  if($('#menuRoot').children.length&&!e.target.closest('.menu')&&!(menuAnchor&&menuAnchor.contains(e.target)))closeMenu();
});
window.addEventListener('beforeunload',flushSave);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushSave()});
function updateOnline(){
  if(!DB.ready&&saveErrorShown)return;
  $('#offlineText').textContent=navigator.onLine?'ローカル保存・ネット不要':'オフラインで動作中';
}
window.addEventListener('online',updateOnline);window.addEventListener('offline',updateOnline);
async function refreshStorage(){
  const txt=$('#storageText'),bar=$('#storageBar');
  const count=state.notes.length;
  try{
    if(navigator.storage&&navigator.storage.estimate){
      const est=await navigator.storage.estimate();
      const usage=est.usage||0,quota=est.quota||0;
      txt.textContent=count+'件 · '+fmtBytes(usage);
      bar.style.width=(quota?clamp(usage/quota*100,2,100):2)+'%';
      $('#storageTrack').title='ブラウザ割り当て容量: '+fmtBytes(quota)+' ／ 永続化: '+(state.persisted?'許可済み':'未許可');
      return;
    }
  }catch(_){}
  const approx=state.notes.reduce((a,n)=>a+n.body.length*2+200,0);
  txt.textContent=count+'件 · 約'+fmtBytes(approx);bar.style.width='6%';
}
async function init(){
  const dbOk=await DB.open();
  if(!dbOk){showWarn();saveErrorShown=true}
  try{
    if(navigator.storage&&navigator.storage.persist){
      if(navigator.storage.persisted&&await navigator.storage.persisted())state.persisted=true;
      else state.persisted=await navigator.storage.persist();
    }
  }catch(_){}
  const [metaSettings,metaViews,metaInstalled,metaBackup,notes,versions]=await Promise.all([
    DB.get('meta','settings'),DB.get('meta','views'),DB.get('meta','installed'),DB.get('meta','backup'),DB.all('notes'),DB.all('versions')
  ]);
  if(metaSettings&&metaSettings.v)state.settings={...DEFAULTS,...metaSettings.v};
  if(metaViews&&Array.isArray(metaViews.v))state.views=metaViews.v;
  if(metaBackup&&metaBackup.v)backup=metaBackup.v;
  state.notes=Array.isArray(notes)?notes:[];
  (Array.isArray(versions)?versions:[]).forEach(v=>{
    const l=state.versions.get(v.noteId)||[];l.push(v);state.versions.set(v.noteId,l);
  });
  state.versions.forEach(l=>l.sort((a,b)=>b.at-a.at));
  if(!metaInstalled){
    const s=seedNotes();
    state.notes=s.notes;state.views=s.views;
    s.versions.forEach(v=>state.versions.set(v.noteId,[v]));
    await Promise.all([
      ...s.notes.map(n=>DB.put('notes',n)),...s.versions.map(v=>DB.put('versions',v)),
      DB.put('meta',{k:'views',v:s.views}),DB.put('meta',{k:'installed',v:Date.now()}),DB.put('meta',{k:'settings',v:state.settings})
    ]);
  }
  const expired=state.notes.filter(n=>n.deletedAt&&Date.now()-n.deletedAt>30*864e5).map(n=>n.id);
  if(expired.length){await purgeNotes(expired);toast('30日経過した'+expired.length+'件を自動削除しました','info')}
  if(innerWidth<=720)state.mode='edit';
  applySettings();
  $('#sortSel').value=state.sort;
  ensureActive();
  renderAll();
  loadNote(state.activeId);
  refreshStorage();updateOnline();
  document.body.classList.remove('booting');
  document.body.classList.add('ready');
  setTimeout(()=>{const b=$('#boot');if(b)b.remove()},600);
  if(!metaInstalled)setTimeout(()=>toast('IndexedDBへのローカル保存を開始しました。ネット接続は不要です。','success'),700);
}
init().catch(()=>{
  document.body.classList.remove('booting');document.body.classList.add('ready');
  showWarn();
  state.notes=[];renderAll();loadNote(null);
});
})();
