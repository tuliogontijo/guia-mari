var V='guia-mari-v1';
var SHELL=['./','index.html','manifest.json','icon192.png','icon512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var u=new URL(e.request.url);
  if(u.origin===location.origin){
    // rede primeiro (página sempre atualizada), cache se estiver sem internet
    e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(V).then(function(c){c.put(e.request,cp)});return r}).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('./')})}));
  }else if(u.hostname.indexOf('fonts.g')===0){
    e.respondWith(caches.match(e.request).then(function(m){return m||fetch(e.request).then(function(r){var cp=r.clone();caches.open(V).then(function(c){c.put(e.request,cp)});return r})}));
  }
});
