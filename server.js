const express=require('express');
const path=require('path');
const cors=require('cors');
const fs=require('fs');
const app=express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.static(__dirname));

let db={produtos:[],categorias:["Blusas","Vestidos"],cores:[{nome:"Rosa",hex:"#e84393"},{nome:"Preto",hex:"#111111"},{nome:"Branco",hex:"#ffffff"}],conf:{taxa:10,zap:"558399923260",pix:"66b5d5fe-b9af-4d26-9f27-2467300dc6e3"},pedidos:{}};

try{
  if(fs.existsSync('data.json')){
    let lido = JSON.parse(fs.readFileSync('data.json','utf8'));
    db = {...db,...lido};
    if(!db.categorias) db.categorias=["Blusas","Vestidos"];
    if(!db.cores) db.cores=[{nome:"Rosa",hex:"#e84393"}];
    if(!db.conf) db.conf={taxa:10,zap:"558399923260",pix:"66b5d5fe-b9af-4d26-9f27-2467300dc6e3"};
    if(!db.pedidos) db.pedidos={};
    if(!db.produtos) db.produtos=[];
  }
}catch(e){}

function salvar(){fs.writeFileSync('data.json',JSON.stringify(db,null,2))}

// ===== API NUVEM - PRODUTOS =====
app.get('/api/dados',(req,res)=> res.json(db));

app.post('/api/dados',(req,res)=>{
  db.produtos = req.body.produtos || db.produtos;
  db.categorias = req.body.categorias || db.categorias;
  db.cores = req.body.cores || db.cores;
  db.conf = req.body.conf || db.conf;
  if(req.body.pedidos) db.pedidos = req.body.pedidos;
  salvar();
  res.json({ok:true});
});

// ===== SEUS PEDIDOS (mantive igual) =====
app.get('/api/todos-pedidos',(req,res)=>res.json(db.pedidos||{}));
app.post('/api/pedido',(req,res)=>{const c='B'+Math.floor(1000+Math.random()*9000);db.pedidos[c]={codigo:c,...req.body,status:'Novo',pagamento:'Falta pagar',data:new Date().toLocaleDateString('pt-BR')};salvar();res.json({codigo:c})});
app.post('/api/pedido/pagamento',(req,res)=>{if(db.pedidos[req.body.codigo])db.pedidos[req.body.codigo].pagamento=req.body.pagamento;salvar();res.json({ok:true})});
app.post('/api/pedido/status',(req,res)=>{if(db.pedidos[req.body.codigo])db.pedidos[req.body.codigo].status=req.body.status;salvar();res.json({ok:true})});

// ROTAS
app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'admin','index.html')));
app.get('/acompanhar',(req,res)=>res.sendFile(path.join(__dirname,'acompanhar.html')));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));

app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('BONITAS OK'));
