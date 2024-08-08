import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { MENU_CREATE_PARTNER_OPTION, MenuCreatePartner } from 'src/app/enums/menu-create-partner.enum';
@Component({
  selector: 'app-action-partner',
  templateUrl: './action-partner.component.html',
  styleUrls: ['./action-partner.component.scss']
})
export class ActionPartnerComponent implements OnInit {
  selectedMenu = MenuCreatePartner.DebtManagement;
  actionPartnerVHL: any;

  constructor(
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) { }
  MenuCreatePartner = MenuCreatePartner;
  MENU_CREATE_PARTNER_OPTION = MENU_CREATE_PARTNER_OPTION;
  ngOnInit(): void {
    // Lấy giá trị status từ route data
    this.actionPartnerVHL = this.activatedRoute.snapshot.data['type'];
    console.log('actionPartnerVHL:', this.actionPartnerVHL); // Để kiểm tra giá trị
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
