export const requestNotificationPermission = async () => {
  if ("Notification" in window) {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if ("Notification" in window && Notification.permission === "granted") {
    const content = {
      ...options,
      icon: "https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-500.webp",
      badge: "https://cdn.jsdelivr.net/gh/orz14/orzcode@main/chat-apps/logos/chat-apps-32.webp",
      tag: "message-notification",
      renotify: true as any,
      silent: false,
      lang: "id-ID",
      dir: "auto",
    } as any;

    new Notification(title, content);
  }
};
