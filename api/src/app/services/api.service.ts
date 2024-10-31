import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Folder {
  folder_id?: number;
  user_id: number;
  folder_name: string;
  created_at?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://arcoreportmaker.unaux.com/arcothisapi/api';
  private apiUrl = 'http://localhost/judoapi/api';



  // private apiUrl = 'https://gcccsarco.online/arcoapi/api';  
    // private apiUrl = 'http://localhost/arcoapi/api';
  constructor(private http: HttpClient) { }


  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //creatform 
  getDocuments(userId: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/documentall/${userId}`;
    return this.http.get<any>(apiUrl);
  }


  //collage

  submitCollage(userId: number, collageData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/collage/${userId}`;
    return this.http.post(endpoint, collageData);
  }


  //edit annual

  getAnnualReport(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/annualreportonly/${id}`;
    return this.http.get<any>(apiUrl);
  }

  editAnnualReport(id: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/edit_annualreport/${id}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //edit event

  getEventReport(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/eventreportonly/${id}`;
    return this.http.get<any>(apiUrl);
  }

  editEventReport(id: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/edit_eventreport/${id}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //edit financial 

  getFinancialReport(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/financialreportonly/${id}`;
    return this.http.get<any>(apiUrl);
  }

  editFinancialReport(id: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/edit_financialreport/${id}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //edit project 

  getProjectReport(id: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/projectreportonly/${id}`;
    return this.http.get<any>(apiUrl);
  }

  editProjectReport(id: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/edit_projectreport/${id}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //flipbook

  getCollageData(userId: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/collage_all/${userId}`;
    return this.http.get<any>(apiUrl);
  }

  cleanedFlipbook(filePath: string): string {
    const cleanedImagePath = filePath.replace(/^\.\.\//, '');
    return `${this.apiUrl}/${cleanedImagePath}`;
  }




  //annual form

  submitAnnualReport(userId: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/annualreport/${userId}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //submit event form
  submitEventReport(userId: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/eventreport/${userId}`;
    return this.http.post<any>(endpoint, reportData);
  }

  submitEventExpenses(userId: number, expensesData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/eventreportplus/${userId}`;
    return this.http.post<any>(endpoint, expensesData);
  }

  //submit finanial report

  submitFinancialReport(userId: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/financialreport/${userId}`;
    return this.http.post<any>(endpoint, reportData);
  }


  //submit project status report

  submitProjectStatusReport(userId: number, reportData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/projectreport/${userId}`;
    return this.http.post<any>(endpoint, reportData);
  }

  //output annual

  retrieveAnnualReport(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/annualreport/${userId}`;
    return this.http.get<any>(endpoint);
  }

  //output event

  retrieveEventReport(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/eventreport/${userId}`;
    return this.http.get<any>(endpoint);
  }

  retrieveEventExpenses(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/eventexpenses/${userId}`;
    return this.http.get<any>(endpoint);
  }

  //output financial

  retrieveFinancialReport(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/financialreport/${userId}`;
    return this.http.get<any>(endpoint);
  }

  //output project

  retrieveProjectStatusReport(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/projectreport/${userId}`;
    return this.http.get<any>(endpoint);
  }

  //profile

  retrieveProfileData(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/profilepage/${userId}`;
    return this.http.get<any>(endpoint);
  }

  validatePassword(userId: number, currentPassword: string): Observable<any> {
    const endpoint = `${this.apiUrl}/validate_password/${userId}`;
    return this.http.post<any>(endpoint, { currentPassword });
  }

  updateProfile(userId: number, data: any): Observable<any> {
    const endpoint = `${this.apiUrl}/edit_profile/${userId}`;
    return this.http.post<any>(endpoint, data);
  }

  //chart financial and project

  retrieveFinancialReports(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/financialreportall/${userId}`;
    return this.http.get<any>(endpoint);
  }

  retrieveProjectReports(userId: number): Observable<any> {
    const endpoint = `${this.apiUrl}/projectreportall/${userId}`;
    return this.http.get<any>(endpoint);
  }

  //collaboration

  fetchCollab(userId: number): Observable<any> {
    const apiUrl = `${this.apiUrl}/fetchall_collab/${userId}`;
    return this.http.get<any>(apiUrl);
  }

  //rte collab edit

  fetchOneCollab(postId: number): Observable<any> {
    const url = `${this.apiUrl}/fetch_onecollab/${postId}`;
    return this.http.get<any>(url);
  }

  editDocument(postId: number, content: string, editedBy: string): Observable<any> {
    const url = `${this.apiUrl}/edit_document/${postId}`;
    return this.http.post<any>(url, { content, edited_by: editedBy });
  }

  getUsername(userId: number): Observable<string> {
    const url = `${this.apiUrl}/getusername/${userId}`;
    return this.http.get(url, { responseType: 'text' });
  }

  uploadElements(userId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrl}/uploadelements/${userId}`;
    return this.http.post<any>(url, formData);
  }

  fetchElements(userId: number): Observable<any> {
    const url = `${this.apiUrl}/fetchelements/${userId}`;
    return this.http.get<any>(url);
  }

  constructImageUrl(filePath: string): string {
    const cleanedImagePath = filePath.replace(/^\/+/, '');
    return `${this.apiUrl}/${cleanedImagePath}`;
  }


  //rte edit

  getDocument(postId: number): Observable<any> {
    const url = `${this.apiUrl}/documentone/${postId}`;
    return this.http.get<any>(url);
  }

  
  editDocuments(postId: number, body: any): Observable<any> {
    const url = `${this.apiUrl}/edit_document/${postId}`;
    return this.http.post<any>(url, body);
  }

  //rte editor

  getUploadUrl(userId: number): string {
    return `${this.apiUrl}/uploadelements/${userId}`;
  }
  
  getFetchUrl(userId: number): string {
    return `${this.apiUrl}/fetchelements/${userId}`;
  }
  
  fetchImages(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  
  uploadImage(url: string, formData: FormData): Observable<any> {
    return this.http.post<any>(url, formData);
  }
  
  getSaveContentUrl(userId: number): string {
    return `${this.apiUrl}/new_emptydocument/${userId}`;
  }
  
  saveContent(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body);
  }

  //rte view


  getProfileData(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profilepage/${userId}`);
  }

  saveTitle(postId: number, title: string): Observable<any> {
    const url = `${this.apiUrl}/add_title/${postId}`;
    return this.http.post<any>(url, { title });
  }

  fetchDocument(userId: number): Observable<any> {
    const url = `${this.apiUrl}/documentonly/${userId}`;
    return this.http.get<any>(url);
  }

  fetchSharedUsers(postId: number): Observable<any> {
    const url = `${this.apiUrl}/fetch_collabusernames/${postId}`;
    return this.http.get<any>(url);
  }

  deleteUserCollab(collabId: number): Observable<any> {
    const url = `${this.apiUrl}/delete_usercollab/${collabId}`;
    return this.http.post<any>(url, {});
  }

  addSelectedUsers(postId: number, data: any): Observable<any> {
    const url = `${this.apiUrl}/collabusers/${postId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<any>(url, data, { headers });
  }

  fetchUsers(userId: number): Observable<any> {
    const url = `${this.apiUrl}/getallusernames/${userId}`;
    return this.http.get<any>(url);
  }

  updateDocument(postId: number, content: string): Observable<any> {
    const url = `${this.apiUrl}/documentonly/${postId}`;
    return this.http.post<any>(url, { content });
  }

  generateShareLink(postId: number, canEdit: boolean, viewLimit: number, destroyAfterView: boolean, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/sharelink/${postId}`;
    return this.http.post<any>(url, {
      can_edit: canEdit,
      view_limit: viewLimit,
      destroy_after_view: destroyAfterView
    }, { headers });
  }


  //rte general

  getSaveTitleUrl(postId: number): string {
    return `${this.apiUrl}/add_title/${postId}`;
  }

  fetchDocumentt(documentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/documentone/${documentId}`);
  }

  generateShareLinked(postId: number, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sharelink/${postId}`, body, { headers });
  }

  addSelectedUserss(postId: number, data: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collabusers/${postId}`, data, { headers });
  }

  saveTitled(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body);
  }

  //summary

  deleteAnnualReport(reportId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_annualreport/${reportId}`, {});
  }

  deleteEventReport(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_eventreport/${eventId}`, {});
  }

  deleteFinancialReport(financialReportId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_financialreport/${financialReportId}`, {});
  }

  deleteProjectReport(projectId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete_projectreport/${projectId}`, {});
  }

  getAnnualReports(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/annualreportall/${userId}`);
  }

  getEventReports(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/eventreportall/${userId}`);
  }

  getFinancialReports(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/financialreportall/${userId}`);
  }

  getProjectReports(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projectreportall/${userId}`);
  }


  //upload file


  uploadFile(userId: number, file: File): Observable<any> {
    const url = `${this.apiUrl}/collage/${userId}`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(url, formData);
  }


  //view event report 2

  getEventExpenses(event_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventexpensessummary/${event_id}`);
  }

  //project status report 2

  getProjectStatusReport(project_id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projectreportonly/${project_id}`);
  }

  //dashboard

  getFinancialReportss(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventreportall/${userId}`);
  }

  getProjectReportss(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projectreportall/${userId}`);
  }

  getAnnualReportss(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/annualreportall/${userId}`);
  }

  getEventReportss(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventreportall/${userId}`);
  }

  getDocumentss(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/documentall/${userId}`);
  }

  getCollaborations(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/fetchall_collab/${userId}`);
  }

  getTemplates(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/fetch_templates/${userId}`);
  }

  getUsernames(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/getusername/${userId}`);
  }

  deleteReport(reportId: number, reportType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete_${reportType}/${reportId}`, {});
  }

  //templates 
  FetchSaveTitleUrl(postId: number): string {
    return `${this.apiUrl}/template_title/${postId}`;
  } //working

  fetchTemplate(documentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/templateone/${documentId}`);
  } //working

  FetchTemplateRTE(postId: number): Observable<any> {
    const url = `${this.apiUrl}/templateone/${postId}`;
    return this.http.get<any>(url);
  }


  generateShareLinked3(postId: number, body: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sharelink/${postId}`, body, { headers });
  }

  addSelectedUserss3(postId: number, data: any, headers: HttpHeaders): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/collabusers/${postId}`, data, { headers });
  }

  saveTitled3(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body);
  } //working

  getTemplateURl(userId: number): string {
    return `${this.apiUrl}/template_use/${userId}`;
  }
  
  saveUsedTemplate(url: string, body: any): Observable<any> {
    return this.http.post<any>(url, body);
  }

  //folders

  getFolders(userId: number): Observable<Folder[]> {
    return this.http.get<Folder[]>(`${this.apiUrl}/kuhafolders/${userId}`);
  }

  createFolder(folder: Folder, userId: number): Observable<Folder> {
    return this.http.post<Folder>(`${this.apiUrl}/add_folder/${userId}`, folder);
  }


  deleteFolder(folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete_folder/${folderId}`, {});
  }

  getUnfolderedRichtext(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/unfilteredDocuments/${userId}`);
  }


  assignReportToFolder(userId: number, reportId: number, folderId: number): Observable<any> {
    const data = { report_id: reportId, folder_id: folderId };
    return this.http.post<any>(`${this.apiUrl}/assignDocumentToFolder/${userId}`, data);
  }

  getReportsByFolderId(folderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filterDocumentbyFolderId/${folderId}`);
  }
  
  

  



  



  
  











}
