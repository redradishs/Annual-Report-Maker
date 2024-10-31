import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { CreateformComponent } from './pages/createform/createform.component';
import { FlipbookComponent } from './pages/flipbook/flipbook.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReportComponent } from './pages/report/report.component';
import { AnnualreportComponent } from './pages/forms/annualreport/annualreport.component';
import { FinancialreportComponent } from './pages/forms/financialreport/financialreport.component';
import { EventformComponent } from './pages/forms/eventform/eventform.component';
import { AnnualreportoutputComponent } from './pages/formsoutput/annualreportoutput/annualreportoutput.component';
import { EventreportoutputComponent } from './pages/formsoutput/eventreportoutput/eventreportoutput.component';
import { FinancialreportoutputComponent } from './pages/formsoutput/financialreportoutput/financialreportoutput.component';
import { EditeventreportComponent } from './pages/edit/editeventreport/editeventreport.component';
import { EditfinancialreportComponent } from './pages/edit/editfinancialreport/editfinancialreport.component';
import { EditannualreportComponent } from './pages/edit/editannualreport/editannualreport.component';
import { ProjectReportStatusComponent } from './pages/forms/projectreportstatus/projectreportstatus.component';
import { ProjectreportoutputComponent } from './pages/formsoutput/projectreportoutput/projectreportoutput.component';
import { EditprojectreportComponent } from './pages/edit/editprojectreport/editprojectreport.component';
import { UploadfilesComponent } from './pages/uploadfiles/uploadfiles.component';
import { ViewannualreportComponent } from './pages/view/viewannualreport/viewannualreport.component';
import { VieweventreportComponent } from './pages/view/vieweventreport/vieweventreport.component';
import { ViewfinancialrepertComponent } from './pages/view/viewfinancialrepert/viewfinancialrepert.component';
import { ViewprojectreportComponent } from './pages/view/viewprojectreport/viewprojectreport.component';
import { CollageComponent } from './pages/collage/collage.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { RichtexteditorComponent } from './pages/richtext/richtexteditor/richtexteditor.component';
import { RichtextviewComponent } from './pages/richtext/richtextview/richtextview.component';
import { RichtexteditComponent } from './pages/richtext/richtextedit/richtextedit.component';
import { RichtextviewgeneralComponent } from './pages/richtext/richtextviewgeneral/richtextviewgeneral.component';
import { CollaborationComponent } from './pages/richtext/collaboration/collaboration.component';
import { RichtextcollabeditComponent } from './pages/richtext/richtextcollabedit/richtextcollabedit.component';
import { authGuard } from './auth.guard';
import { FolderComponent } from './pages/folder/folder.component';
import { TemplateseditorComponent } from './pages/richtext/templateseditor/templateseditor.component';
import { TemplateseditorblankComponent } from './pages/richtext/templateseditorblank/templateseditorblank.component';
import { TemplateseditorviewComponent } from './pages/richtext/templateseditorview/templateseditorview.component';
import { NotfoundpageComponent } from './addons/notfoundpage/notfoundpage.component';
import { NewcollageComponent } from './pages/newcollage/newcollage.component';
import { CollagemakerComponent } from './pages/collagemaker/collagemaker.component';
import { TemplateslatestComponent } from './pages/richtext/templateslatest/templateslatest.component';
import { ShareComponent } from './pages/share/share.component';

export const routes: Routes = [

      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent, canActivate: [authGuard]
    },
    {
        path: 'create',
        component: CreateformComponent, canActivate: [authGuard]
    },
    {
        path: 'create/annualreport', 
        component: AnnualreportComponent, canActivate: [authGuard]
    },
    {
        path: 'create/annualreport/view', 
        component: AnnualreportoutputComponent, canActivate: [authGuard]
    },
    {
        path: 'create/financialreport/view', 
        component: FinancialreportoutputComponent, canActivate: [authGuard]
    },
    {
        path: 'create/eventreport', 
        component: EventformComponent, canActivate: [authGuard]
    },  
    {
        path: 'create/eventreport/uploadmedia', 
        component: UploadfilesComponent, canActivate: [authGuard]
    },  
    {
        path: 'create/financialreport',  
        component: FinancialreportComponent, canActivate: [authGuard]
    },
    {
        path: 'create/projectreportstatus',
        component: ProjectReportStatusComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/annualreport/view',  
        component: AnnualreportoutputComponent, canActivate: [authGuard]
    },   
    {
        path: 'create/eventreport/uploadmedia/view',  
        component: EventreportoutputComponent, canActivate: [authGuard]
    }, 
    {
        path: 'summary/eventreport/view/:id',  
        component: EventreportoutputComponent, canActivate: [authGuard]
    }, 
    {
        path: 'summary/financialreport/view/:id',  
        component: FinancialreportoutputComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/projectreportstatus/view',  
        component: ProjectreportoutputComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/eventreport/:id',        //dito done
        component: EditeventreportComponent, canActivate: [authGuard]
    },  
    {
        path: 'summary/financialreport/:id',           //dito done 
        component: EditfinancialreportComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/annualreport/:id',      //dito           
        component: EditannualreportComponent, canActivate: [authGuard]
    }, 
    {
        path: 'summary/projectreportstatus/:id',      //dito           
        component: EditprojectreportComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/vieweventreport/view/:id',        //dito done
        component: VieweventreportComponent, canActivate: [authGuard]
    },  
    {
        path: 'summary/viewfinancialreport/view/:id',           //dito done 
        component: ViewfinancialrepertComponent, canActivate: [authGuard]
    },
    {
        path: 'summary/viewannualreport/view/:id',      //dito           
        component: ViewannualreportComponent, canActivate: [authGuard]
    }, 
    {
        path: 'summary/viewprojectreport/view/:id',      //dito           
        component: ViewprojectreportComponent, canActivate: [authGuard]
    }, 
    {
        path: 'summary',
        component: SummaryComponent, canActivate: [authGuard]
    },
    {
        path: 'flipbook',
        component: FlipbookComponent, canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent, canActivate: [authGuard]
    },
    {
        path: 'report',
        component: ReportComponent, canActivate: [authGuard]
    },
    {
        path: 'report/folder/:folderId/:folderType',
        component: FolderComponent,
    },
    {
        path: 'report/folder/:folderType',
        component: FolderComponent,
    },
    {
        path: 'collage',
        component: CollageComponent, canActivate: [authGuard]
    },
    {
        path: 'create/projectreportstatus/final',
        component: ProjectreportoutputComponent, canActivate: [authGuard]
    },
    {
        path: 'assistant',
        component: AssistantComponent, canActivate: [authGuard]
    },
    {
        path: 'document',   
        component: RichtexteditorComponent, canActivate: [authGuard]
    },
    {
        path: 'document/view',   
        component: RichtextviewComponent, canActivate: [authGuard]
    },
    {
        path: 'edit-document/:id',   
        component: RichtexteditComponent, canActivate: [authGuard]
    },
    {
        path: 'document/view/:id',   
        component: RichtexteditComponent, canActivate: [authGuard]
    },
    {
        path: 'document/view/output/:id',   
        component: RichtextviewgeneralComponent, canActivate: [authGuard]
    },
    {
        path: 'collaboration',   
        component: CollaborationComponent, canActivate: [authGuard]
    },
    {
        path: 'collaboration/view/:id',
        component: RichtextcollabeditComponent, canActivate: [authGuard]
    },
    {
        path: 'collabedit',
        component: RichtextcollabeditComponent, canActivate: [authGuard]
    },
    {
        path: 'editannual/:id',
        component: ViewannualreportComponent, canActivate: [authGuard]
    },
    { path: 'document/:id', 
      component: RichtextviewgeneralComponent, canActivate: [authGuard] },
    { path: 'summary/document/:id', 
      component: RichtextviewgeneralComponent, canActivate: [authGuard] },
    { path: 'summary/edit/:id', 
    component: RichtexteditComponent, canActivate: [authGuard] },
    { path: 'collaboration/:id', 
     component: RichtextviewgeneralComponent, canActivate: [authGuard] },
    { path: 'report/:id', 
    component: RichtextviewgeneralComponent, canActivate: [authGuard] },
    { path: 'edit-report/:id', 
     component: RichtextviewgeneralComponent, canActivate: [authGuard] },
    { path: 'annualreport/:id', 
    component: ViewannualreportComponent, canActivate: [authGuard] },
    { path: 'financialreport/:id', 
    component: ViewfinancialrepertComponent, canActivate: [authGuard] },
    { path: 'projectreportstatus/:id', 
    component: ViewprojectreportComponent, canActivate: [authGuard] },
    { path: 'eventreport/:id', 
    component: VieweventreportComponent, canActivate: [authGuard] },
    { path: 'template/edit/:id', 
    component: TemplateseditorComponent, canActivate: [authGuard] },
    { path: 'template', 
    component: TemplateseditorblankComponent, canActivate: [authGuard] },
    { path: 'dashboard/template/view/:id', 
    component: TemplateseditorviewComponent, canActivate: [authGuard] },
    { path: 'templateview', 
    component: TemplateslatestComponent, canActivate: [authGuard] },
    { path: 'create/template/view/:id', 
    component: TemplateseditorviewComponent, canActivate: [authGuard] },
    { path: 'template/edit/:id', 
    component: TemplateseditorComponent, canActivate: [authGuard] },
    { path: 'report/edit/:id', 
    component: RichtexteditComponent, canActivate: [authGuard] },
    { path: 'newcollage', 
    component: CollagemakerComponent, canActivate: [authGuard] },
    {
        path: 'share/:link_token', component: ShareComponent
    }
    // { path: '**', component: NotfoundpageComponent }
    

];