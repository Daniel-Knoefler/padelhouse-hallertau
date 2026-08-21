const SUPABASE_URL = "https://mjwxppygqecrmwdeucpk.supabase.co";
const SUPABASE_KEY = "sb_publishable_Jvnl0lGe59BlLs7IA1bmKw_AhVdbXUz";

function getDeviceIdFromRegistration() {
  try {
    return new URL(self.location.href).searchParams.get("deviceId");
  } catch (e) {
    return null;
  }
}

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

  const deviceId = getDeviceIdFromRegistration();
  if (deviceId) {
    aufgaben.push(
      fetch(`${SUPABASE_URL}/rest/v1/notification_log`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_id: deviceId, title: data.title, body: data.body, url: data.url || "/" }),
      }).catch(() => {})
    );
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
          client.postMessage({ type: "padelhouse-navigate", url });
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
