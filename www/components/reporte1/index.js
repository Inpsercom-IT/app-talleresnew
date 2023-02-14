'use strict';

app.reporte1 = kendo.observable({
    onShow: function () {

        ////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        //var canvas = document.getElementById('signature-pad');

        //var signaturePad = new SignaturePad(canvas, {
        //    backgroundColor: 'rgb(225, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
        //});

        //document.getElementById('save-jpeg').addEventListener('click', function () {
        //    if (signaturePad.isEmpty()) {
        //        return alert("Please provide a signature first.");
        //    }

        //    var data = signaturePad.toDataURL('image/jpeg');
        //    //  alert(data);

        //    document.getElementById("firma").value = data;

        //    //  window.open(data);
        //});


        //document.getElementById('clear').addEventListener('click', function () {
        //    signaturePad.clear();
        //    document.getElementById("firma").value = "";
        //});

        ////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

     //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ls_otdet2</center>", localStorage.getItem("ls_otdet2").toLocaleString());


        try {
            // Grid VIN
            var gridDet_1 = $("#gridDetalleOT_2").data("kendoGrid");
            gridDet_1.destroy();
        }
        catch (emo1)
        { }


        try {
            // Grid VIN
            var gridDet_1 = $("#gridDetalleSMS").data("kendoGrid");
            gridDet_1.destroy();
        }
        catch (emo1)
        { }


        document.getElementById("descSMS_1").innerHTML = "";
        document.getElementById("descSMS_2").innerHTML = "";

        document.getElementById("gridDetalleOT_2").innerHTML = "";
        document.getElementById("gridDetalleSMS").innerHTML = "";

        // Numero de OT
        var arrInfOT01 = localStorage.getItem("ls_otdet2").toLocaleString().split('|');
        document.getElementById("descOT_2").innerHTML = "<span style='font-weight:bold'>ORDEN DE TRABAJO:&nbsp;" + arrInfOT01[1] + "</span>";

        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            document.getElementById("btnFooterDetOT_2").innerHTML = "<button id='btnRegresarDetalleOT0' onclick='volverOT_det()' class='w3-btn'><i id='icnRegresarDetalleOT0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
        }
        else {
            document.getElementById("btnFooterDetOT_2").innerHTML = "<button id='btnRegresarDetalleOT0' onclick='volverOT_det()' class='w3-btn w3-red'><i id='icnRegresarDetalleOT0' class='fa fa-chevron-left' aria-hidden='true'></i> </button>";
        }
        llamarNuevoestilo("btnRegresarDetalleOT");
        llamarNuevoestiloIconB("icnRegresarDetalleOT");
        infoDetalleOT_det();

        infoDetalleOT_sms();

        //  verPDF(localStorage.getItem("ls_pdfnumOT").toLocaleString());
    },
    afterShow: function () {
    }
});

app.localization.registerView('reporte1');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Presenta el detalle de la OT 
Parametros: URL del servicio
--------------------------------------------------------------------*/
function infoDetalleOT_det() {  

    //  document.getElementById("gridDetalleOT_2").innerHTML = "";

    kendo.ui.progress($("#reporte1Screen"), true);
    setTimeout(function () {
        // precarga ***********************

        var descri = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 40) / 100;
        var cant = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 7) / 100;
        var obs = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 9) / 100;
        var fecha = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 14) / 100;
        var ot = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 17) / 100;
        var taller = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 12) / 100;
        var arrInfOT = localStorage.getItem("ls_otdet2").toLocaleString().split('|');

        var UrlDetalleOT = arrInfOT[0]; 

        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlDetalleOT);

        var infordetEV;
        $.ajax({
            url: UrlDetalleOT,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {

                    if (inspeccionar(data).includes("DetalleOT") == true) {
                        infordetEV = (JSON.parse(data.tl07DetalleOTGetResult)).DetalleOT;
                        if (inspeccionar(infordetEV).length > 0) {

                            // Titulo historial SMS
                            document.getElementById("descSMS_1").innerHTML = "<br /><i class='fa fa-calculator' aria-hidden='true'></i>  <span style='font-weight:bold'>DETALLE</span><br />";

                            $("#gridDetalleOT_2").kendoGrid({
                                dataSource: {
                                    pageSize: 20,
                                    data: infordetEV,
                                    aggregate: [
                                                { field: "descripcion", aggregate: "count", width: descri },
                                                { field: "dantidad", aggregate: "sum", width: cant },
                                                { field: "TOTAL", aggregate: "sum", width: cant }
                                    ]
                                },
                                pageable: false,
                                columns: [
                                            { field: "descripcion", title: "Descripci&oacute;n", footerTemplate: "TOTAL:", width: descri },
                                            { field: "cantidad", title: "Cantidad", width: cant },
                                            { field: "TOTAL", format: "{0:c}", title: "Total", footerTemplate: "#= kendo.toString(sum, '$0.00') #", width: cant }
                                ]
                            });

                            kendo.ui.progress($("#reporte1Screen"), false);
                        }
                        else {
                            kendo.ui.progress($("#reporte1Screen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No existe el detalle de la<br/>Orden de Trabajo <b>" + arrInfOT[1] + "</b></center>");
                         //   kendo.mobile.application.navigate("components/admOt/view.html");
                        }

                    }
                    else {
                        kendo.ui.progress($("#reporte1Screen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No existe el detalle de la<br/>Orden de Trabajo <b>" + arrInfOT[1] + "</b></center>");
                    //    kendo.mobile.application.navigate("components/admOt/view.html");
                    }

                } catch (e) {
                    kendo.ui.progress($("#reporte1Screen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#reporte1Screen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", err);
                return;
            }
        });

        // precarga ***********************
    }, 1000);

}

/*--------------------------------------------------------------------
Fecha: 13/08/2018
Descripcion: Presenta el historial de SMS
Parametros: URL del servicio
--------------------------------------------------------------------*/
function infoDetalleOT_sms() {
    var arrInfSMS = localStorage.getItem("ls_otdet2").toLocaleString().split('|');
    var UrlDetalleSMS = arrInfSMS[2];

      //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", arrInfSMS[2]);

    kendo.ui.progress($("#reporte1Screen"), true);
    setTimeout(function () {
        // precarga ***********************

        var infordetSMS;
        $.ajax({
            url: UrlDetalleSMS,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (inspeccionar(data).includes("tvh70") == true) {
                        infordetSMS = (JSON.parse(data.qvh70SmsGetResult)).tvh70;

                        if (inspeccionar(infordetSMS).length > 0) {
                            // Titulo historial SMS
                            document.getElementById("descSMS_2").innerHTML = "<i class='fa fa-commenting-o' aria-hidden='true'></i>  <span style='font-weight:bold'>HISTORIAL SMS</span><br />";

                            // Grid historial
                            $("#gridDetalleSMS").kendoGrid({

                                dataSource: {
                                    pageSize: 20,
                                    data: infordetSMS
                                },

                                pageable: {
                                    input: true,
                                    numeric: false
                                },

                                groupable: false,
                                columns: [
                                      //  { field: "fecha_proceso", title: "Fec.Proc.", width: 80 },
                             {
                                 field: "hora_proceso", title: "Fecha y Hora de Proceso", width: 140,
                                 template: "#= fecha_proceso# #= formatoHoraProc(hora_proceso) #"
                             },

                                        { field: "observaciones", title: "Contenido" },
                                        { field: "dato_origen", title: "Origen" },
                                        { field: "dato_destino", title: "Destino" }
                                ]
                            });
                        }
                    }
                    else {
                        kendo.ui.progress($("#reporte1Screen"), false);
                     //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No existe el historial de la<br/>Orden de Trabajo <b>" + arrInfSMS[1] + "</b></center>");
                        //  kendo.mobile.application.navigate("components/admOt/view.html");
                    }



                } catch (e) {
                    kendo.ui.progress($("#reporte1Screen"), false);
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#reporte1Screen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", err);
                return;
            }
        });

        kendo.ui.progress($("#reporte1Screen"), false);
        // precarga ***********************
    }, 1000);
}

function formatoHoraProc(horaProc) {

    var arrHoPr = horaProc.split(":");

    return arrHoPr[0] + ":" + arrHoPr[1];
}

function volverOT_det() {
    kendo.mobile.application.navigate("components/admOt/view.html");
}



//function verPDF(numOrden)
//{
//    var bajaOT = "OT20170003556";

//    localStorage.setItem("ls_verRecepcion", "1");

//    var anchoPDF = (screen.width * 100) / 100 ;
//    var largoPDF = (screen.height * 100) / 100;
//    document.getElementById("divPDF").innerHTML = "<center><a href='http://ecuainfo78-002-site3.btempurl.com/imagenes/" + bajaOT + ".pdf' class='w3-btn w3-red primary' aria-label='Descargar'><i class='fa fa-download' aria-hidden='true'></i>&nbsp;Descargar</a></center><br />" +
//        "<a href='http://ecuainfo78-002-site3.btempurl.com/imagenes/" + bajaOT + ".pdf' class='embed' style='display:none'>" + numOrden + ".pdf</a>";
//    $('a.embed').gdocsViewer({ width: anchoPDF, height: largoPDF });
//    $('#embedURL').gdocsViewer();
//}

//function volverOT() {
//    //kendo.mobile.application.navigate("components/lector_barras/view.html");
//    kendo.mobile.application.navigate("components/admOt/view.html");
//}

// END_CUSTOM_CODE_home