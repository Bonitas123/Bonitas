const express=require('express');const path=require('path');const cors=require('cors');const fs=require('fs');const app=express();
app.use(cors());app.use(express.json());app.use(express.static(__dirname));
let db={produtos:[],pedidos:{}};try{if(fs.existsSync('data.json'))db=JSON.parse(fs.readFileSync('data.json','utf8'))}catch(e){}
function salvar(){fs.writeFileSync('data.json',JSON.stringify(db,null,2))}
app.get('/api/todos-pedidos',(req,res)=>res.json(db.pedidos||{}));
app.post('/api/pedido',(req,res)=>{const c='B'+Math.floor(1000+Math.random()*9000);db.pedidos[c]={codigo:c,...req.body,status:'Novo',pagamento:'Falta pagar',data:new Date().toLocaleDateString('pt-BR')};salvar();res.json({codigo:c})});
app.post('/api/pedido/pagamento',(req,res)=>{if(db.pedidos[req.body.codigo])db.pedidos[req.body.codigo].pagamento=req.body.pagamento;salvar();res.json({ok:true})});
app.post('/api/pedido/status',(req,res)=>{if(db.pedidos[req.body.codigo])db.pedidos[req.body.codigo].status=req.body.status;salvar();res.json({ok:true})});
app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'admin','index.html')));
app.get('/acompanhar',(req,res)=>res.sendFile(path.join(__dirname,'acompanhar.html')));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('BONITAS OK'));
