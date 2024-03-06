import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColumnModel } from 'src/app/models/column-model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { AlertComponent } from '../alert/alert.component';
import { PermissionEnum } from 'src/app/enums/permission.enum';
import { AuthService } from '../auth';
import { ProductManagementService } from './product-management.service';
import { ProductEditSaveComponent } from './edit-save/edit-save.component';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit, OnDestroy {

  @ViewChild('editSaveComponent') private editSaveComponent: ProductEditSaveComponent;
  @ViewChild('confirmationComponent') private confirmationComponent: ConfirmationComponent;
  @ViewChild('alertComponent') private alertComponent: AlertComponent;

  hasEditPermission: boolean;
  hasDeletePermission: boolean;
  hasNewRecordPermission: boolean;

  constructor(private productManagementService: ProductManagementService, private authService: AuthService) {}

  header: string = "Ürünler";
  dataSource: any[];
  totalCount: number;
  paginationModel: PaginationModel;

  controlPermissions() {
    this.authService.currentUserSubject.asObservable().subscribe(result => {
      if(result?.permissions)
      {
        let permissionList = (JSON.parse(result?.permissions) as number[]);

        if(permissionList.includes(PermissionEnum['ProductScene.Delete.Permission'])) {
          this.hasDeletePermission = true;
        }
        else{
          this.hasDeletePermission = false;
        }

        if(permissionList.includes(PermissionEnum['ProductScene.Edit.Permission'])) {
          this.hasEditPermission = true;
        }
        else{
          this.hasEditPermission = false;
        }

        if(permissionList.includes(PermissionEnum['ProductScene.Save.Permission'])) {
          this.hasNewRecordPermission = true;
        }
        else{
          this.hasNewRecordPermission = false;
        }
      }
    });
  }
  
  delete(event: number) {
    this.productManagementService.delete(event).subscribe(result => {
      if(result.isSuccess) {
        this.alertComponent.alert('success', result.message);
        this.loadData();
      }
      else{
        this.alertComponent.alert('danger', result.message);
      }
    })
  }

  isSuccess(event: boolean) {
    this.loadData();
  }

  loadData() {
    this.productManagementService.paging(this.paginationModel.pageNumber, this.paginationModel.pageSize)
          .subscribe(result => {
            if(result.isSuccess) {
              result.data.items.forEach(item => {
                item.fileResult.fileContents = "data:" + item.fileResult.contentType + ";base64, " + item.fileResult.fileContents;
              })
              this.dataSource = result.data.items;
              this.totalCount = result.data.totalCount;
            }
            else{
              this.dataSource = [];
              this.totalCount = 0;
            }
          })
  }

  ngOnInit(): void {
    this.controlPermissions();
    this.paginationModel = { pageNumber: 1, pageSize: 10 } as PaginationModel;
    this.loadData();
  }

  ngOnDestroy() {
  }

  openDeleteModal(id: number) {
    this.confirmationComponent.openModal('Delete', id);
  }

  openEditModal(id: number) {
    this.editSaveComponent.openModal(id);
  }

  openSaveModal() {
    this.editSaveComponent.openModal(undefined);
  }

  onPageChanges() {
    this.loadData();
  }
}
