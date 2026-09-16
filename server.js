const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.static(__dirname));
const DATA_FILE = path.join(__dirname, 'data.json');
function readData(){
  try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); }
  catch(e){ return {produtos:[], pedidos:[], config:{taxa:15, endereco:"João Pessoa - PB", pix:"66b5d5fe-b9af-4d26-9f27-2467300dc6e3", zap:"5583999232602", cep:"00000-000"}}; }
}
app.get('/api/dados',(req,res)=>res.json(readData()));
app.post('/api/dados',(req,res)=>{ fs.writeFileSync(DATA_FILE, JSON.stringify(req.body,null,2)); res.json({ok:true}); });
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
const PORT = process.env.PORT || 3000;let pedidos={};
app.post('/api/pedido',(req,res)=>{const codigo='BON'+Math.floor(1000+Math.random()*9000);const {nome,blusa,tamanho,foto}=req.body;pedidos[codigo]={nome,blusa,tamanho,foto,status:'Preparando',data:new Date().toLocaleDateString()};res.json({codigo});});
app.get('/api/pedido/:codigo',(req,res)=>{const p=pedidos[req.params.codigo.toUpperCase()];if(!p) return res.json({erro:'Codigo nao encontrado'});res.json(p);});
app.post('/api/pedido/status',(req,res)=>{const {codigo,status}=req.body;if(pedidos[codigo]) pedidos[codigo].status=status;res.json({ok:true});});
app.get('/api/todos-pedidos',(req,res)=>res.json(pedidos));
app.get('/acompanhar.html',(req,res)=>res.sendFile(__dirname+'/acompanhar.html'));
app.listen(PORT,'0.0.0.0',()=>console.log('BONITAS na porta '+PORT));
