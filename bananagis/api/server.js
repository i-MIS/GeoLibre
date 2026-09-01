import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT=Number(process.env.PORT||8787);const HOST=process.env.HOST||'0.0.0.0';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const DB=process.env.BANANAGIS_DATA_FILE||path.join(path.dirname(fileURLToPath(import.meta.url)),'data','farms.json');
fs.mkdirSync(path.dirname(DB),{recursive:true});if(!fs.existsSync(DB))fs.writeFileSync(DB,'[]');
const read=()=>JSON.parse(fs.readFileSync(DB,'utf8')||'[]');const write=x=>{const tmp=DB+'.tmp';fs.writeFileSync(tmp,JSON.stringify(x,null,2));fs.renameSync(tmp,DB)};
const headers={'Access-Control-Allow-Origin':process.env.CORS_ORIGIN||'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS'};
const json=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8',...headers});res.end(JSON.stringify(data))};
const body=req=>new Promise((resolve,reject)=>{let s='';req.on('data',c=>s+=c);req.on('end',()=>{try{resolve(s?JSON.parse(s):{})}catch(e){reject(e)}})});
const feature=(p,g)=>({type:'Feature',properties:p,geometry:g});const valid=p=>p&&typeof p.farm_id==='string'&&p.farm_id.trim()&&typeof p.area_rai==='number'&&p.area_rai>=0;
function safeStatic(p){const base=path.resolve(ROOT,'app');const file=path.resolve(base,p==='/'?'index.html':'.'+p);return file.startsWith(base+path.sep)?file:null}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.geojson':'application/geo+json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(req.method==='OPTIONS')return json(res,204,{});if(u.pathname==='/health')return json(res,200,{ok:true,service:'BananaGIS API',time:new Date().toISOString()});if(u.pathname==='/api/farms'&&req.method==='GET'){let items=read();const province=u.searchParams.get('province');if(province)items=items.filter(x=>x.properties?.province===province);return json(res,200,{type:'FeatureCollection',features:items})}if(u.pathname==='/api/farms'&&req.method==='POST'){const f=await body(req);if(!valid(f.properties))return json(res,400,{error:'farm_id and non-negative area_rai are required'});const items=read();if(items.some(x=>x.properties.farm_id===f.properties.farm_id))return json(res,409,{error:'farm_id already exists'});const saved=feature(f.properties,f.geometry);items.push(saved);write(items);return json(res,201,saved)}const m=u.pathname.match(/^\/api\/farms\/([^/]+)$/);if(m){const id=decodeURIComponent(m[1]);let items=read();const i=items.findIndex(x=>x.properties?.farm_id===id);if(i<0)return json(res,404,{error:'farm not found'});if(req.method==='GET')return json(res,200,items[i]);if(req.method==='PUT'){const f=await body(req);if(!valid(f.properties))return json(res,400,{error:'invalid farm'});items[i]=feature(f.properties,f.geometry);write(items);return json(res,200,items[i])}if(req.method==='DELETE'){const old=items.splice(i,1)[0];write(items);return json(res,200,old)}}
const file=safeStatic(u.pathname);if(req.method==='GET'&&file){if(!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,404,{error:'not found'});res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});return fs.createReadStream(file).pipe(res)}return json(res,404,{error:'not found'})}catch(e){console.error(e);return json(res,500,{error:'internal server error'})}});
server.listen(PORT,HOST,()=>console.log(`BananaGIS listening on ${HOST}:${PORT}`));
