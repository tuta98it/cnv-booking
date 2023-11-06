export class StringUtils {
  static getFileNameFromImageURL(imageUrl: any) {
    if(!imageUrl) return
    // Sử dụng hàm `split('/')` để tách chuỗi theo dấu "/"
    var parts = imageUrl.split('/');
    // Lấy phần tử cuối cùng trong mảng parts (chứa tên tệp)
    var fileName = parts[parts.length - 1];
    return fileName;
  }

  static validateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || !mail) {
      return (true);
    }
    // alert('Chưa đúng định dạng email!');
    return (false);
  }
}
