// export class NotificationVHLEnum {
//   public static readonly READ = true;
//   public static readonly UNREAD = false;
// }

export enum NotificationVHLEnum {
  UNREAD = 0,
  READ = 1,
}


export const ColorStatusNotifications = {
  [NotificationVHLEnum.READ]: "#00000040",
  [NotificationVHLEnum.UNREAD]: "#188D47",
}


export const ColorTextViewDetailNotifications = {
  [NotificationVHLEnum.READ]: "#343A40",
  [NotificationVHLEnum.UNREAD]: "#1890ff",
}
