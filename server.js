const express=require('express');const path=require('path');const cors=require('cors');const fs=require('fs');const app=express();
app.use(cors());app.use(express.json());app.use(express.static(__dirname));
let pedidos={};try{pedidos=JSON.parse(fs.readFileSync('pedidos.json'))}catch(e){}
function salvar(){fs.writeFileSync('pedidos.json',JSON.stringify(pedidos))}
app.get('/api/todos-pedidos',(req,res)=>res.json(pedidos));
app.post('/api/pedido',(req,res)=>{const cod='B'+Math.floor(1000+Math.random()*9000);pedidos[cod]={codigo:cod,nome:req.body.nome,total:req.body.total,produtos:req.body.produtos,status:'Novo',pagamento:'Falta pagar',data:new Date().toLocaleDateString('pt-BR')};salvar();res.json({codigo:cod})});
app.post('/api/pedido/pagamento',(req,res)=>{if(pedidos[req.body.codigo])pedidos[req.body.codigo].pagamento=req.body.pagamento;salvar();res.json({ok:true})});
app.post('/api/pedido/status',(req,res)=>{if(pedidos[req.body.codigo])pedidos[req.body.codigo].status=req.body.status;salvar();res.json({ok:true})});
app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'admin','index.html')));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('BONITAS OK'));
