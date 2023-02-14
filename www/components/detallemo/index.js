/*=======================================================================
Fecha: 20/06/2017
=======================================================================
Detalles: 
- OT: Presenta el detalle de la mano de obra
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

app.detallemo = kendo.observable({
    onShow: function () {
       // infoDetalleMO();
    },
    afterShow: function() {}
});
app.localization.registerView('detallemo');

// START_CUSTOM_CODE_detallemo
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes



function infoDetalleMO() {


    var descri = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 30) / 100;
    var cant = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 7) / 100;

    var obs = (screen.width * 9) / 100;
    var fecha = (screen.width * 14) / 100;
    var ot = (screen.width * 17) / 100;
    var taller = (screen.width * 12) / 100;

    localStorage.setItem("ls_verRecepcion", "1");

    //  document.getElementById("gridDetalleOT").innerHTML = "";



 //   http://186.71.21.170:8077/taller/Services/tl/Taller.svc/tl04TemparioGet/1,1;24150R00;FILTRO;XM;MODELO;KIA;MECANICA;


    var UrlDetalleMO =  localStorage.getItem("ls_urldetmo").toLocaleString()+"/Services/tl/Taller.svc/tl04TemparioGet/1,1;24150R00;FILTRO;XM;MODELO;KIA;MECANICA"; // localStorage.getItem("ls_urldetmo").toLocaleString();

  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlDetalleMO</center>", UrlDetalleMO);

    var infordetOM;
    $.ajax({
        url: UrlDetalleMO,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                //  infordet = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;

             //   alert(inspeccionar(data));

                if (UrlDetalleMO.includes("tl07DetalleOTGet") == true) {
                    infordetOM = (JSON.parse(data.tl07DetalleOTGetResult)).DetalleOT;

                 //   alert(inspeccionar(infordetOM));
                }
                else {
                    infordetOM = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
                }

            } catch (e) {
                // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
            return;
        }
    });

 //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infordetOM)[0]);

    if (inspeccionar(infordetOM).length > 0) {

      //  alert(inspeccionar(infordetOM));

        $("#gridDetalleMO").kendoGrid({
            dataSource: {
                pageSize: 20,
                data: infordetOM,
                aggregate: [                    
                    { field: "clase_registro", aggregate: "count", width: cant },
                    { field: "descripcion", aggregate: "count" },
                    { field: "tercero", aggregate: "count", width: cant },
                    { field: "cantidad", aggregate: "sum", width: cant },
                    { field: "precio_unitario", aggregate: "sum", width: cant },
                    { field: "subtotal", aggregate: "sum" }
                ]
            },
            pageable: false,
            columns: [
                    { field: "clase_registro", title: "Clase", width: cant },
                    { field: "descripcion", title: "Descripci&oacute;n" , width: 300 },                 
                    { field: "tercero", title: "Tercero", width: 70, template: '# if (tercero == true ) { # <center><i class="fa fa-check fa-lg" aria-hidden="true"></i></center> # } else { # <center> </center> #}#' },
                    { field: "cantidad", title: "Cantidad", width: 70 },
                    { field: "precio_unitario", title: "Precio", width: cant, template: "#= kendo.toString(precio_unitario, '$0.00') #" , footerTemplate: "SUBTOTAL:"},
                    { field: "subtotal", format: "{0:c}", title: "Subtotal", footerTemplate: "#= kendo.toString(sum, '$0.00') #", width: cant }
            ]
        });
    }
}



function volverMO() {
    kendo.mobile.application.navigate("components/lector_barras/view.html");
}

// END_CUSTOM_CODE_detallemo