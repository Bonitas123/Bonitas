const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json({limit:'10mb'}));
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'data.json');
function readData(){
  try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); }catch(e){ return {produtos:[], pedidos:[], config:{taxa:15, endereco:"João Pessoa - PB", pix:"66b5d5fe-b9af-4d26-9f27-2467300dc6e3", zap:"5583999232602", cep:"58000-000"} } }
}
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

app.get('/api/dados', (req,res)=>{ res.json(readData()); });
app.post('/api/dados', (req,res)=>{ writeData(req.body); res.json({ok:true}); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('BONITAS rodando na porta '+PORT));
