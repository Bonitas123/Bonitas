const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('.'));

let pedidos = {};

app.post('/api/pedido', (req,res)=>{
  const codigo='BON-'+Math.floor(10000+Math.random()*90000);
  pedidos[codigo]={...req.body, status:'Recebido', pagamento:'Falta pagar', data:new Date().toLocaleString()};
  res.json({codigo});
});

app.get('/api/pedido/:codigo',(req,res)=>{
  const p=pedidos[req.params.codigo.toUpperCase()];
  if(!p) return res.json({erro:true});
  res.json(p);
});

app.get('/api/todos-pedidos',(req,res)=>{
  res.json(pedidos);
});

app.post('/api/pedido/status',(req,res)=>{
  const {codigo,status}=req.body;
  if(pedidos[codigo]) pedidos[codigo].status=status;
  res.json({ok:true});
});

app.post('/api/pedido/pagamento',(req,res)=>{
  const {codigo,pagamento}=req.body;
  if(pedidos[codigo]) pedidos[codigo].pagamento=pagamento;
  res.json({ok:true});
});

app.listen(process.env.PORT||3000, ()=>console.log('rodando'));
