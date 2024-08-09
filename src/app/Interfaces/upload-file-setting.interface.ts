interface IShowUpload {
  showPreviewIcon?: boolean,
  showDownloadIcon?: boolean
  showRemoveIcon?: boolean,
}
export interface UploadFileSetting  {
  isMultiple: boolean,
  action?: string,
  header?: any
  name?: string,
  showUploadList?: IShowUpload
}
