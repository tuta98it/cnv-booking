import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-m-view-pdf',
  templateUrl: './m-view-pdf.component.html',
  styleUrls: ['./m-view-pdf.component.scss'],
})
export class MViewPdfComponent implements OnInit {
  @Input() pdfDocumentSrc: string;

  page = 1;
  totalPage: number;
  isLoaded: boolean;

  constructor() {}

  ngOnInit() {
  }

  afterLoadComplete(pdfData: any) {
    this.totalPage = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }
}
