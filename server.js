const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
let pedidos = {};
app.get('/api/todos-pedidos',(req,res)=>res.json(pedidos));
app.post('/api/pedido',(req,res)=>{
  const codigo='B'+Math.floor(1000+Math.random()*9000);
  pedidos[codigo]={codigo,nome:req.body.nome,total:req.body.total,status:'Novo',pagamento:'Falta pagar',data:new Date().toLocaleDateString()};
  res.json({codigo});
});
app.post('/api/pedido/pagamento',(req,res)=>{
  if(pedidos[req.body.codigo]) pedidos[req.body.codigo].pagamento=req.body.pagamento;
  res.json({ok:true});
});
app.post('/api/pedido/status',(req,res)=>{
  if(pedidos[req.body.codigo]) pedidos[req.body.codigo].status=req.body.status;
  res.json({ok:true});
});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('rodando'));
