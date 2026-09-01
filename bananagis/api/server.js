import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT=Number(process.env.PORT||8787);
const HOST=process.env.HOST||'0.0.0.0';
const DB=process.env.BANANAGIS_DATA_FILE||path.join(path.dirname(fileURLToPath(import.meta.url)),'data','farms.json');
fs.mkdirSync(path.dirname(DB),{recursive:true});
if(!fs.existsSync(DB))fs.writeFileSync(DB,'[]');
const read=()=>JSON.parse(fs.readFileSync(DB,'utf8')||'[]');
const write=x=>{const tmp=DB+'.tmp';fs.writeFileSync(tmp,JSON.stringify(x,null,2));fs.renameSync(tmp,DB)};
const send=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':process.env.CORS_ORIGIN||'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'});res.end(JSON.stringify(data))};
const body=req=>new Promise((resolve,reject)=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch(e){reject(e)}})});
const feature=(p,geometry)=>({type:'Feature',properties:p,geometry});
const valid=p=>p&&typeof p.farm_id==='string'&&p.farm_id.trim()&&typeof p.area_rai==='number'&&p.area_rai>=0;
const server=http.createServer(async(req,res)=>{try{if(req.method==='OPTIONS')return send(res,204,{});const u=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(u.pathname==='/health')return send(res,200,{ok:true,service:'BananaGIS API',time:new Date().toISOString()});if(u.pathname==='/api/farms'&&req.method==='GET'){let items=read();const province=u.searchParams.get('province');if(province)items=items.filter(x=>x.properties?.province===province);return send(res,200,{type:'FeatureCollection',features:items})}if(u.pathname==='/api/farms'&&req.method==='POST'){const f=await body(req);if(!valid(f.properties))return send(res,400,{error:'farm_id and non-negative area_rai are required'});const items=read();if(items.some(x=>x.properties.farm_id===f.properties.farm_id))return send(res,409,{error:'farm_id already exists'});items.push(feature(f.properties,f.geometry));write(items);return send(res,201,f)}const m=u.pathname.match(/^\/api\/farms\/([^/]+)$/);if(m){const id=decodeURIComponent(m[1]);let items=read();const i=items.findIndex(x=>x.properties?.farm_id===id);if(i<0)return send(res,404,{error:'farm not found'});if(req.method==='GET')return send(res,200,items[i]);if(req.method==='PUT'){const f=await body(req);if(!valid(f.properties))return send(res,400,{error:'invalid farm'});items[i]=feature(f.properties,f.geometry);write(items);return send(res,200,items[i])}if(req.method==='DELETE'){const old=items.splice(i,1)[0];write(items);return send(res,200,old)}}return send(res,404,{error:'not found'})}catch(e){console.error(e);return send(res,500,{error:'internal server error'})}});
server.listen(PORT,HOST,()=>console.log(`BananaGIS API listening on ${HOST}:${PORT}`));
