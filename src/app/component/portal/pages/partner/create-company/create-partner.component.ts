import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {

  constructor(private msg: NzMessageService) { }

  ngOnInit(): void {
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }
}
