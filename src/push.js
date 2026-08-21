import { supabase } from "./supabaseClient";

const VAPID_PUBLIC_KEY = "BCeTiyh7YLqEiT1U0DnrChpGE8HM880CqXRZqicd68y1LeaNnKereOHB6g8RXRkcgfE8Xd9iR5GRrxGHKg5_smw";

function getDeviceId() {
  let id = localStorage.getItem("padelhouse-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("padelhouse-device-id", id);
  }
  return id;
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function pushWirdUnterstuetzt() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function pushBerechtigungStatus() {
  if (!pushWirdUnterstuetzt()) return "nicht_unterstuetzt";
  return Notification.permission; // "default" | "granted" | "denied"
}

export async function pushAktivieren(teamName) {
  if (!pushWirdUnterstuetzt()) return { erfolg: false, grund: "nicht_unterstuetzt" };

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { erfolg: false, grund: "verweigert" };

  try {
    const registration = await navigator.serviceWorker.register(`/sw.js?deviceId=${encodeURIComponent(getDeviceId())}`);
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const { error } = await supabase.from("push_subscriptions").upsert(
      { device_id: getDeviceId(), subscription: subscription.toJSON(), team_name: teamName || null, updated_at: new Date().toISOString() },
      { onConflict: "device_id" }
    );

    if (error) return { erfolg: false, grund: "speichern_fehlgeschlagen", details: error.message };
    return { erfolg: true };
  } catch (e) {
    return { erfolg: false, grund: "technischer_fehler", details: e.message };
  }
}

export async function pushTeamAktualisieren(teamName) {
  try {
    await supabase.from("push_subscriptions").update({ team_name: teamName }).eq("device_id", getDeviceId());
  } catch (e) {
    // unkritisch, betrifft nur gezielte Team-Benachrichtigungen
  }
}

export async function pushDeaktivieren() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) await subscription.unsubscribe();
  } catch (e) {
    // ignorieren, Haupt-Sache ist der Eintrag in der Datenbank wird entfernt
  }
  await supabase.from("push_subscriptions").delete().eq("device_id", getDeviceId());
}

export function pushBenachrichtigungSenden(titel, text, url, teamName) {
  return supabase.functions.invoke("send-push", {
    body: { title: titel, body: text, url: url || "/", teamName: teamName || null },
  }).catch((e) => console.error("Push-Versand fehlgeschlagen:", e));
}

export async function benachrichtigungenLaden(limit = 40) {
  const { data, error } = await supabase
    .from("notification_log")
    .select("*")
    .eq("device_id", getDeviceId())
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data || [];
}
