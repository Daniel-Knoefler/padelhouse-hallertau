self.addEventListener("push", (event) => { 

  let data = { title: "Padelhouse Hallertau", body: "Neue Nachricht" }; 

  try { 

    if (event.data) data = event.data.json(); 

  } catch (e) { 

    // Fallback bleibt bei den Standardwerten 

  } 

  

  const options = { 

    body: data.body, 

    icon: "/icon-192.png", 

    badge: "/icon-192.png", 

    data: { url: data.url || "/" }, 

  }; 

  

  const aufgaben = [self.registration.showNotification(data.title, options)]; 

  

  if (self.navigator && "setAppBadge" in self.navigator) { 

    aufgaben.push(self.navigator.setAppBadge(1).catch(() => {})); 

  } 

  

  event.waitUntil(Promise.all(aufgaben)); 

}); 

  

self.addEventListener("notificationclick", (event) => { 

  event.notification.close(); 

  const url = event.notification.data?.url || "/"; 

  

  if (self.navigator && "clearAppBadge" in self.navigator) { 

    self.navigator.clearAppBadge().catch(() => {}); 

  } 

  

  event.waitUntil( 

    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => { 

      for (const client of clientList) { 

        if (client.url.includes(self.location.origin) && "focus" in client) { 

          return client.focus(); 

        } 

      } 

      if (clients.openWindow) return clients.openWindow(url); 

    }) 

  ); 

}); 
