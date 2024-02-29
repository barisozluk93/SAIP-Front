import { Component, EventEmitter, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent, ModalConfig } from "src/app/_metronic/partials";
import { AlertComponent } from "src/app/modules/alert/alert.component";
import { RoleModel } from "../../models/role.model";
import { OrganizationModel } from "src/app/modules/organization-management/models/organization.model";
import { UserManagementService } from "../../user-management.service";
import { OrganizationManagementService } from "src/app/modules/organization-management/organization-management.service";
import { UserModel } from "../../models/user.model";
import { ConfirmPasswordValidator } from "./confirm-password.validator";

@Component({
    selector: 'app-user-editsave',
    templateUrl: './edit-save.component.html',
    styleUrls: ['./edit-save.component.scss'],
})
export class UserEditSaveComponent {

    @ViewChild('modal') private modalComponent: ModalComponent;
    @ViewChild('alertComponent') private alertComponent: AlertComponent;
    @Output() isSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

    modalConfig: ModalConfig;
    form: FormGroup;
    roleList: RoleModel[];
    organizationList: OrganizationModel[];

    constructor(private fb: FormBuilder, private userManagementService: UserManagementService, private organizationManagementService: OrganizationManagementService) { }

    disableSubmitButton(): boolean {
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
            surname: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            email: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.minLength(3),
                    Validators.maxLength(320),
                ]),
            ],
            phone: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            username: [
                "",
                Validators.compose([
                    Validators.required,
                ]),
            ],
            password: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]),
            ],
            cPassword: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(100),
                ]),
            ],
            roles: [
                null,
                Validators.compose([
                    Validators.required,
                ]),
            ],
            organizations: [
                null
            ],
            isDeleted: false,
            isSystemData: false
        },
        {
            validator: ConfirmPasswordValidator.MatchPassword,
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    openModal(userId?: number) {

        this.userManagementService.allRoles().subscribe(result => {
            if (result.isSuccess) {
                this.roleList = result.data;
            }
        })

        this.organizationManagementService.all().subscribe(result => {
            if (result.isSuccess) {
                this.organizationList = result.data;
            }
        })

        this.modalConfig = {
            modalTitle: userId == null ? 'New Record' : 'Edit',
            dismissButtonLabel: 'Submit',
            onDismiss: this.submit.bind(this),
            shouldDismiss: this.disableSubmitButton.bind(this),
            closeButtonLabel: 'Cancel',
        };

        if (userId) {
            this.userManagementService.getUserById(userId).subscribe(result => {
                if (result.isSuccess) {                    
                    this.form.patchValue(result.data);
                    this.form.get("password")?.setValue("***");
                    this.form.get("cPassword")?.setValue("***");
                    this.form.get("roles")?.setValue(result.data.roles[0])

                    if(result.data.organizations.length > 0) {
                        this.form.get("organizations")?.setValue(result.data.organizations[0])
                    }
                    else{
                        this.form.get("organizations")?.setValue(null)
                    }

                    this.modalComponent.open();
                }
            })
        }
        else {
            this.form.reset({ id: 0, name: "", surname: "", email: "", password: "", cPassword: "", username: "", phone: "", roles: null, organizations: null, isDeleted: false, isSystemData: false });
            this.modalComponent.open();
        }
    }

    submit() {
        if (this.form.valid) {
            var temp = this.form.getRawValue();

            var data = this.form.getRawValue() as UserModel;

            if(temp.roles || temp.roles > 0) {
                data.roles = [temp.roles];
            }
            else{
                data.roles = [];
            }

            if(temp.organizations || temp.organizations > 0) {
                data.organizations = [temp.organizations];
            }
            else{
                data.organizations = [];
            }

            if (data.id == 0) {
                this.userManagementService.userSave(data).subscribe(result => {
                    if (result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
            else {
                this.userManagementService.userEdit(data).subscribe(result => {
                    if (result.isSuccess) {
                        this.alertComponent.alert("success", result.message);
                        this.isSuccess.emit(true);
                    }
                    else {
                        this.alertComponent.alert("danger", result.message);
                    }
                })
            }
        }

        return true;
    }
}