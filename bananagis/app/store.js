const BananaStore={
 key:'bananagis-local-v1',
 load(){try{return JSON.parse(localStorage.getItem(this.key)||'[]')}catch{return[]}},
 save(features){localStorage.setItem(this.key,JSON.stringify(features))},
 merge(base){const local=this.load();const ids=new Set(base.map(f=>f.properties.farm_id));return base.concat(local.filter(f=>!ids.has(f.properties.farm_id)))},
 exportGeoJSON(features){const blob=new Blob([JSON.stringify({type:'FeatureCollection',features},null,2)],{type:'application/geo+json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bananagis-farms.geojson';a.click();URL.revokeObjectURL(a.href)}
};
