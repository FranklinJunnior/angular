import { Component,ViewChild, ElementRef  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-cotizar',
  templateUrl: './cotizar.component.html',
  styleUrls: ['./cotizar.component.css']
})
export class CotizarComponent {
  sedeSeleccionada: string = '';
  @ViewChild('alertModal') alertModal!: ElementRef;
  modalInstance: any;
  alertMessage: string = '';
  isConfirmDialog: boolean = false;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sedeSeleccionada = params['sede'] || '';
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.alertModal.nativeElement);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showAlert('Debe rellenar todos los campos correctamente.');
      return;
    }

    if (!this.validateEmail(form.value.email)) {
      this.showAlert('Por favor, ingrese un email válido.');
      return;
    }

    const sede = form.value.sede;
    const kingKong = form.value.kingKong || 0;
    const pandereta = form.value.pandereta || 0;
    const techo10 = form.value.techo10 || 0;
    const techo12 = form.value.techo12 || 0;

    const totalLadrillos = kingKong + pandereta + techo10 + techo12;

    if (totalLadrillos === 0) {
      this.showAlert('Debe seleccionar al menos un tipo de ladrillo.');
      return;
    }

    if ((sede === 'caracoto' || sede === 'sanmiguel') && totalLadrillos > 3000) {
      this.showConfirmDialog(`La cantidad de ladrillos excede 3000. Por favor, seleccione la sede principal (Juliaca) para pedidos mayores a 3000 ladrillos.`);
    } else {
      this.enviarFormulario(form);
    }
  }

  enviarFormulario(form: NgForm) {
    this.http.post('http://localhost:3000/api/pedidos', form.value).subscribe(
      (response) => {
        this.showAlert('Los datos se han enviado correctamente.');
        form.reset();
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
        this.showAlert(`Error al enviar los datos: ${error.error?.message || error.message}`);
      }
    );
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.isConfirmDialog = false;
    this.modalInstance.show();
  }

  showConfirmDialog(message: string) {
    this.alertMessage = message;
    this.isConfirmDialog = true;
    this.modalInstance.show();
  }

  onConfirm(form: NgForm) {
    this.modalInstance.hide();
    this.enviarFormulario(form);
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  }
}