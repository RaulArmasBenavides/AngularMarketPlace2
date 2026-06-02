import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Email } from '../../../../config';

import { OrdersService } from '../../../../services/orders.service';
import { SalesService } from '../../../../services/sales.service';

import { Sweetalert } from '../../../../functions';

import { Subject } from 'rxjs';


@Component({
  selector: 'app-account-orders',
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.css'],
  standalone: false
})
export class AccountOrdersComponent implements OnInit, OnDestroy {
  @Input() childItem: any;

  orders: any[] = [];
  idOrders: any[] = [];
  process: any[] = [];
  editNextProcess: any[] = [];
  selectedOrderIndex: number = 0;
  selectedOrderId: string = '';
  newNextProcess: any[] = [
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' },
    { stage: '', status: '', comment: '', date: '' }
  ];
  email: string = Email.url;

  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private salesService: SalesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    /*=============================================
	  	Agregamos opciones a DataTable
	  	=============================================*/

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    };

    let load = 0;

    /*=============================================
		Preguntamos si esta tienda tiene órdenes
		=============================================*/

    this.ordersService.getFilterData('store', this.childItem).subscribe((resp: any) => {
      if (Object.keys(resp).length > 0) {
        for (const i in resp) {
          load++;

          this.orders.push(resp[i]);

          this.idOrders.push(i);

          this.process.push(JSON.parse(resp[i].process));
        }

        if (load == this.orders.length) {
          this.dtTrigger.next(null);
        }
      }
    });
  }

  /*=============================================
    Editar Proceso
    =============================================*/

  nextProcess(idOrder: any, index: any) {
    this.editNextProcess = this.process[index];
    this.selectedOrderIndex = index;
    this.selectedOrderId = idOrder;

    const el = document.getElementById('nextProcess');
    if (el) {
      new (window as any).bootstrap.Modal(el).show();
    }

    if (this.editNextProcess[1]['status'] == 'pending') {
      setTimeout(() => {
        const header = document.querySelectorAll('.card-header');
        if (header.length > 2 && header[2].parentElement) {
          header[2].parentElement.remove();
        }
      }, this.editNextProcess.length * 10);
    }
  }

  /*=============================================
	Recoger información al cambiar el proceso
	=============================================*/

  changeProcess(type: any, item: any, index: any) {
    console.log('item', item.value);

    this.newNextProcess[index][type] = item.value;
  }

  /*=============================================
	Guardar cambios en el proceso de entrega
	=============================================*/

  onSubmitProcess() {
    let idOrder = this.selectedOrderId;

    this.editNextProcess.map((item, index) => {
      if (this.newNextProcess[index]['status'] != '') {
        item['status'] = this.newNextProcess[index]['status'];
      }

      if (this.newNextProcess[index]['comment'] != '') {
        item['comment'] = this.newNextProcess[index]['comment'];
      }

      if (this.newNextProcess[index]['date'] != '') {
        item['date'] = this.newNextProcess[index]['date'];
      }

      return item;
    });

    let status = '';

    if (this.newNextProcess[2]['status'] == 'ok') {
      status = 'delivered';

      this.salesService.getFilterData('id_order', idOrder).subscribe((resp) => {
        let idSale = Object.keys(resp)[0];

        let body = {
          status: 'success'
        };

        this.salesService
          .patchDataAuth(idSale, body)
          .subscribe((resp) => {});
      });
    } else {
      status = 'pending';
    }

    let body = {
      status: status,
      process: JSON.stringify(this.editNextProcess)
    };

    this.ordersService
      .patchDataAuth(idOrder, body)
      .subscribe(
        (resp) => {
          const formData = new FormData();

          formData.append('email', 'yes');
          formData.append('comment', 'You have received an update on your order delivery process');
          formData.append('url', 'account/my-shopping');
          formData.append('address', this.orders[this.selectedOrderIndex].email);
          formData.append('name', this.orders[this.selectedOrderIndex].user);

          this.http.post(this.email, formData).subscribe((resp: any) => {
            if (resp['status'] == 200) {
              Sweetalert.fnc('success', 'The order was successfully updated', '/account/orders');
            } else {
              Sweetalert.fnc('error', 'Failed to send email notification', null);
            }
          });
        },
        (err) => {
          Sweetalert.fnc('error', err.error.error.message, null);
        }
      );
  }

  /*=============================================
	Destruímos el trigger de angular
	=============================================*/

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
