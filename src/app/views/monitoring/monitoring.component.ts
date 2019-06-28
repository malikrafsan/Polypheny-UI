import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InformationService} from '../../services/information.service';
import {InformationObject, InformationPage} from '../../models/information-page.model';
import {BreadcrumbService} from '../../components/breadcrumb/breadcrumb.service';
import {LeftSidebarService} from '../../components/left-sidebar/left-sidebar.service';
import {BreadcrumbItem} from '../../components/breadcrumb/breadcrumb-item';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  data;
  routerId;
  pageList;
  serverError;
  pageNotFound = false;

  constructor(
    private _information:InformationService,
    private _router: Router,
    private _route: ActivatedRoute,
    public _breadcrumb: BreadcrumbService,
    private _sidebar: LeftSidebarService
  ) { }

  ngOnInit() {
    this.routerId = this._route.snapshot.paramMap.get('id');
    this._route.params.subscribe(params => {
      this.routerId = params['id'];
      this.getServiceData();
    });

    this._sidebar.listInformationManagerPages();
    this._sidebar.open();

    this._information.onSocketEvent().subscribe(
      update => {
        const info:InformationObject = <InformationObject> update;
        if(this.data && this.data.groups[info.informationGroup] && this.data.groups[info.informationGroup].informationObjects[info.id]){
          this.data.groups[info.informationGroup].informationObjects[info.id] = info;
        }
      }
    );
  }

  ngOnDestroy() {
    this._breadcrumb.hide();
    this._sidebar.close();
  }

  getServiceData() {
    if(!this.routerId){
      this._information.getPageList().subscribe(
        res => {
          this.pageList = res;
          this._breadcrumb.setBreadcrumbs([new BreadcrumbItem('informationManager')]);
          this.serverError = null;
        }, err => {
          this.serverError = err;
        }
      );
    }else {
      this._information.getPage(this.routerId).subscribe(
        res => {
          if(res == null){
            this.onPageNotFound();
            this._breadcrumb.setBreadcrumbs([new BreadcrumbItem('informationManager')]);
          }else{
            this.data = <InformationPage>res;
            this._breadcrumb.setBreadcrumbs([new BreadcrumbItem('informationManager', '/views/monitoring/'), new BreadcrumbItem(this.data.name.toString())]);
            this.serverError = null;
          }
        }, err => {
          this.serverError = err;
        }
      );
    }
  }

  private onPageNotFound(){
    this.pageNotFound = true;
    this.serverError = null;
    this._information.getPageList().subscribe(
      res => {this.pageList = res;},
      err => {this.serverError = err;}
    );
  }

}
