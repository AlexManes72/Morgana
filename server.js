require('dotenv').config();
const express = require('express');
const https   = require('https');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY = process.env.GROQ_API_KEY || '';

app.use(express.json({ limit: '2mb' }));
app.use(function(req,res,next){ res.setHeader('Cache-Control','no-store'); next(); });
app.use(express.static(path.join(__dirname,'public')));
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/api/chat', function(req, res) {
  var incoming = req.body;
  var messages = (incoming.messages||[]).slice();
  if(incoming.system) messages = [{role:'system',content:incoming.system}].concat(messages);
  var groqBody = JSON.stringify({
    model:'llama-3.3-70b-versatile',
    max_tokens: incoming.max_tokens||800,
    messages: messages,
    temperature: 0.9
  });
  var options = {
    hostname:'api.groq.com', port:443,
    path:'/openai/v1/chat/completions', method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Content-Length':Buffer.byteLength(groqBody),
      'Authorization':'Bearer '+GROQ_KEY
    }
  };
  var apiReq = https.request(options, function(apiRes){
    var data='';
    apiRes.on('data',function(c){data+=c});
    apiRes.on('end',function(){
      try {
        var p=JSON.parse(data);
        if(p.error) return res.status(400).json({error:p.error});
        var text=p.choices&&p.choices[0]&&p.choices[0].message&&p.choices[0].message.content||'';
        res.json({content:[{type:'text',text:text}]});
      } catch(e){ res.status(500).json({error:{message:'Parse error'}}); }
    });
  });
  apiReq.on('error',function(e){ res.status(500).json({error:{message:e.message}}); });
  apiReq.write(groqBody);
  apiReq.end();
});

app.get('*',function(req,res){ res.sendFile(path.join(__dirname,'public','index.html')); });

app.listen(PORT,function(){
  console.log('\n\x1b[35m🔮 MORGANA\x1b[0m');
  console.log('\x1b[32m✅ http://localhost:'+PORT+'\x1b[0m');
  console.log('\x1b[33m⚡ Groq Llama 3.3 attivo\x1b[0m\n');
});
