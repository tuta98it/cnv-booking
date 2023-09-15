export class StringUtils {
  static getFileNameFromImageURL(imageUrl: any) {
    // Sử dụng hàm `split('/')` để tách chuỗi theo dấu "/"
    var parts = imageUrl.split('/');
    // Lấy phần tử cuối cùng trong mảng parts (chứa tên tệp)
    var fileName = parts[parts.length - 1];
    return fileName;
  }
}
