
const TABS=['Research','Ebook','Ads','Ideas','Client Work'];
let current='Research';

const editor=document.getElementById('editor');

let db=JSON.parse(localStorage.getItem('cw_full')||'{}');
if(!db.tabs){
 db={tabs:{},scratch:''};
 TABS.forEach(t=>db.tabs[t]=[]);
}

function saveDB(){localStorage.setItem('cw_full',JSON.stringify(db));}

const tabsDiv=document.getElementById('tabs');
TABS.forEach(t=>{
 let b=document.createElement('button');
 b.textContent=t;
 b.onclick=()=>{current=t;renderNotes();};
 tabsDiv.appendChild(b);
});

editor.value=db.scratch||'';

editor.addEventListener('input',()=>{
 db.scratch=editor.value;
 saveDB();
 updateStats();
 document.getElementById('saveStatus').textContent='Auto Saved';
});

function updateStats(){
 let txt=editor.value;
 let words=txt.trim()?txt.trim().split(/\s+/).length:0;
 document.getElementById('words').textContent='Words: '+words;
 document.getElementById('chars').textContent='Chars: '+txt.length;
 document.getElementById('reading').textContent='Reading: '+Math.max(1,Math.ceil(words/200))+' min';
}
updateStats();

function saveNote(){
 if(!editor.value.trim()) return;
 db.tabs[current].unshift({
  text:editor.value,
  date:new Date().toLocaleString(),
  pinned:false,
  fav:false
 });
 saveDB();
 renderNotes();
}

function renderNotes(){
 let q=document.getElementById('search').value.toLowerCase();
 let notes=db.tabs[current];
 document.getElementById('notes').innerHTML=notes.filter(n=>n.text.toLowerCase().includes(q)).map((n,i)=>`
 <div class="note">
 <div>${n.pinned?'📌':''}${n.fav?'⭐':''}</div>
 <small>${n.date}</small>
 <p>${n.text.substring(0,300)}</p>
 <button onclick="copyNote(${i})">📋 Copy</button>
 <button onclick="editNote(${i})">✏ Edit</button>
 <button onclick="duplicateNote(${i})">📄 Duplicate</button>
 <button onclick="pinNote(${i})">📌 Pin</button>
 <button onclick="favNote(${i})">⭐ Favorite</button>
 <button onclick="deleteNote(${i})">🗑 Delete</button>
 </div>`).join('');
}

function copyNote(i){navigator.clipboard.writeText(db.tabs[current][i].text);}
function editNote(i){editor.value=db.tabs[current][i].text;updateStats();}
function duplicateNote(i){db.tabs[current].unshift({...db.tabs[current][i]});saveDB();renderNotes();}
function pinNote(i){db.tabs[current][i].pinned=!db.tabs[current][i].pinned;saveDB();renderNotes();}
function favNote(i){db.tabs[current][i].fav=!db.tabs[current][i].fav;saveDB();renderNotes();}
function deleteNote(i){db.tabs[current].splice(i,1);saveDB();renderNotes();}

function insertSnippet(t){
 editor.setRangeText(t,editor.selectionStart,editor.selectionStart,'end');
 updateStats();
}

function replaceOne(){
 editor.value=editor.value.replace(document.getElementById('findText').value,document.getElementById('replaceText').value);
}
function replaceAllText(){
 let f=document.getElementById('findText').value;
 editor.value=editor.value.split(f).join(document.getElementById('replaceText').value);
}

function downloadTXT(){
 let a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([editor.value]));
 a.download='creator-workspace.txt';
 a.click();
}

function downloadJSON(){
 let a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob([JSON.stringify(db)]));
 a.download='creator-workspace.json';
 a.click();
}

function importJSON(){
 alert('Use browser localStorage backup restore by replacing stored JSON in future version.');
}

document.getElementById('themeToggle').onclick=()=>document.body.classList.toggle('dark');
document.getElementById('search').addEventListener('input',renderNotes);

renderNotes();
