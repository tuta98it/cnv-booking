// export class NotificationVHLEnum {
//   public static readonly READ = true;
//   public static readonly UNREAD = false;
// }

export enum NotificationVHLEnum {
  UNREAD = 0,
  READ = 1,
}


export const ColorStatusNotifications = {
  [NotificationVHLEnum.READ]: "#188D47",
  [NotificationVHLEnum.UNREAD]: "#00000040",
}
