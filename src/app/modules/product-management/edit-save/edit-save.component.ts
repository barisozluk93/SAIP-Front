import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "../../alert/alert.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProductManagementService } from "../product-management.service";
import { ProductModel } from "../models/product.model";

@Component({
    selector: 'app-product-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class ProductEditSaveComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    modalConfig: ModalConfig;
    form: FormGroup;

    fileResult: any;

    constructor(private fb: FormBuilder, private productManagementService: ProductManagementService) {}

    disableSubmitButton() : boolean {
        return this.form.valid;
    }

    get f() {
        return this.form.controls;
    }

    initForm() {
        this.form = this.fb.group({
            id: 0,
            name: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            price: [
                undefined,
                Validators.compose([
                    Validators.required,
                ]),
            ],
            fileId: [
                undefined,
                Validators.compose([
                    Validators.required,
                ]),
            ],
            isDeleted: false
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    onFileChange(event: any) {

        if (event.target.files.length > 0) {
            let file: File = event.target.files[0];
            var src = URL.createObjectURL(file);
            this.fileResult = { fileContents: src };
            
            let formData = new FormData();
            formData.append("file", file);

            // this.productManagementService.upload(formData).subscribe(result => {
            //     if(result.isSuccess) {
            //         this.alertComponent.alert("success", result.message);
            //         this.form.get("fileId")?.setValue(result.data.id);
            //     }
            //     else{
            //         this.alertComponent.alert("danger", result.message);
            //     }
            // })
        }        
    }
    
    openModal(productId?: number) {

        this.modalConfig = {
            modalTitle: productId == null ? 'New Record' : 'Edit',
            dismissButtonLabel: 'Submit',
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: 'Cancel'
        };

        if (productId) {
            this.productManagementService.getById(productId).subscribe(result => {
                if(result.isSuccess) {
                    result.data.fileResult.fileContents = "data:" + result.data.fileResult.contentType + ";base64, " + result.data.fileResult.fileContents;
                    this.fileResult = result.data.fileResult;

                    this.form.patchValue(result.data);
                    this.modalComponent.open();
                }
            })
        }
        else{
            this.fileResult = undefined;

            this.form.reset({id : 0, name: "", price: undefined, fileId: undefined, isDeleted: false});
            this.modalComponent.open();
        }
    }

    submit() {
        if(this.form.valid) {
            var data = this.form.getRawValue() as ProductModel;

            if(data.id == 0) {
                this.productManagementService.save(data).subscribe(result => {
                    if(result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else{
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
            else{
                this.productManagementService.edit(data).subscribe(result => {
                    if(result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else{
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
        }

        return true;
    }
}