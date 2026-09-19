const express=require('express');
const path=require('path');
const cors=require('cors');
const fs=require('fs');
const app=express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.static(__dirname, {maxAge:0}));

const DATA_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH,'data.json') : path.join(__dirname,'data.json');
const DATA_FALLBACK = path.join(__dirname,'data.json');

let db={produtos:[],categorias:["Blusas","Vestidos"],cores:[{nome:"Rosa",hex:"#e84393"},{nome:"Preto",hex:"#111111"},{nome:"Branco",hex:"#ffffff"}],conf:{taxa:10,zap:"558399923260",pix:"66b5d5fe-b9af-4d26-9f27-2467300dc6e3",nomeLoja:'BONITAS'},pedidos:{}};

function carregar(){
  try{
    let p = fs.existsSync(DATA_PATH)? DATA_PATH : (fs.existsSync(DATA_FALLBACK)? DATA_FALLBACK : null);
    if(p){
      let lido = JSON.parse(fs.readFileSync(p,'utf8'));
      db = {...db,...lido};
      if(lido.produtos) db.produtos = lido.produtos;
      if(lido.pedidos) db.pedidos = lido.pedidos;
      if(lido.categorias) db.categorias = lido.categorias;
      if(lido.cores) db.cores = lido.cores;
      if(lido.conf) db.conf = {...db.conf,...lido.conf};
      console.log('DB carregado de',p,db.produtos.length,'produtos',Object.keys(db.pedidos||{}).length,'pedidos');
    }
  }catch(e){console.log('Erro carregar DB',e.message)}
}
carregar();

function salvar(){
  try{
    fs.writeFileSync(DATA_PATH,JSON.stringify(db,null,2));
    if(DATA_PATH!==DATA_FALLBACK) fs.writeFileSync(DATA_FALLBACK,JSON.stringify(db,null,2));
    console.log('DB salvo',db.produtos.length);
  }catch(e){console.log('Erro salvar',e.message)}
}

// ===== API NUVEM =====
app.get('/api/dados',(req,res)=>{
  res.set('Cache-Control','no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma','no-cache');
  res.json(db);
});
app.post('/api/dados',(req,res)=>{
  if(req.body.produtos) db.produtos = req.body.produtos;
  if(req.body.categorias) db.categorias = req.body.categorias;
  if(req.body.cores) db.cores = req.body.cores;
  if(req.body.conf) db.conf = {...db.conf,...req.body.conf};
  if(req.body.pedidos) db.pedidos = req.body.pedidos;
  salvar();
  res.json({ok:true, qtd:db.produtos.length});
});

// ===== PEDIDOS =====
app.get('/api/pedidos',(req,res)=>{
  res.set('Cache-Control','no-store');
  res.json(Object.values(db.pedidos||{}));
});
app.get('/api/todos-pedidos',(req,res)=>res.json(db.pedidos||{}));
app.get('/api/pedido/:codigo',(req,res)=>{
  let c=req.params.codigo.toUpperCase();
  res.json(db.pedidos[c]||{erro:'Pedido não encontrado'});
});
app.post('/api/pedido',(req,res)=>{
  const c='BN'+Math.floor(1000+Math.random()*9000);
  db.pedidos[c]={codigo:c,...req.body,status:'Preparando',data:new Date().toLocaleString('pt-BR')};
  salvar();
  res.json({codigo:c});
});

// ADICIONADO - GARANTE BANNER ROSA (NÃO MUDA NADA DO QUE JÁ TINHA)
app.get('/banner-rosa.jpg',(req,res)=>{
  let p1=path.join(__dirname,'banner-rosa.jpg');
  let p2=path.join(__dirname,'public','banner-rosa.jpg');
  if(fs.existsSync(p1)) return res.sendFile(p1);
  if(fs.existsSync(p2)) return res.sendFile(p2);
  res.status(404).send('Banner não encontrado, suba banner-rosa.jpg na raiz');
});

// ROTAS
app.get('/admin',(req,res)=>{
  if(fs.existsSync(path.join(__dirname,'admin','index.html'))) return res.sendFile(path.join(__dirname,'admin','index.html'));
  if(fs.existsSync(path.join(__dirname,'admin.html'))) return res.sendFile(path.join(__dirname,'admin.html'));
  return res.sendFile(path.join(__dirname,'index.html'));
});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));

app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('BONITAS OK - DATA_PATH',DATA_PATH));
