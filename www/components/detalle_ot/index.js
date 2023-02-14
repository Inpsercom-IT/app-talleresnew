/*=======================================================================
Fecha: 20/10/2017
=======================================================================
Detalles: 
- OT: Presenta el detalle de la orden de trabajo y observaciones
=======================================================================
Autor: RRP.
=======================================================================*/


'use strict';

app.detalle_ot = kendo.observable({
    onShow: function () {

        infoDetalleOT();
    },
    afterShow: function () {
    }
});
app.localization.registerView('detalle_ot');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Presenta el detalle de la OT 
Parametros: URL del servicio
--------------------------------------------------------------------*/
function infoDetalleOT() {
    try {
    
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnFooterDetOT").innerHTML = "<button id='btnRegresar0' onclick='volverOT()' class='w3-btn w3-red'><i id='imgRegresar0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        document.getElementById("btnFooterDetOT").innerHTML = "<button id='btnRegresar1' onclick='volverOT()' class='w3-btn w3-red'><i id='imgRegresar1' class='fa fa-chevron-left' aria-hidden='true'></i> </button>";
    }
    llamarNuevoestilo("btnRegresar");
    llamarNuevoestiloIconB("imgRegresar");
    kendo.ui.progress($("#detalle_otScreen"), true);
    setTimeout(function () {
        // precarga ***********************

        var descri = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 40) / 100;
        var cant = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 7) / 100;

        var obs = (screen.width * 9) / 100;
        var fecha = (screen.width * 14) / 100;
        var ot = (screen.width * 17) / 100;
        var taller = (screen.width * 12) / 100;

        localStorage.setItem("ls_verRecepcion", "1");

        //  document.getElementById("gridDetalleOT").innerHTML = "";

        // Nombre taller
        document.getElementById("nomTalleres").innerHTML = "<font color='red' style='font-size: 14px'><b>TALLER:&nbsp;</b>" + localStorage.getItem("ls_nomtall").toLocaleString() + '</font>';

        // Observaciones
        if (localStorage.getItem("ls_otobs").toLocaleString() != "0,") {
            var arrObservacionDet = localStorage.getItem("ls_otobs").toLocaleString().split(",");
            document.getElementById("otObs").innerHTML = "<table align='center' width='95%'>" +
            "<tr><td><font color='#000000' style='font-size: 12px; font-weight:bold'>OBSERVACIONES</font></td></tr>" +
            "<tr><td style='border:solid 1px'><p>" + arrObservacionDet[1] + "</p></td></tr>" +
            "</table>";
        }
        else { document.getElementById("otObs").innerHTML = "<br />"; }

        var UrlDetalleOT = localStorage.getItem("ls_urldetot").toLocaleString();
        //"http://186.71.21.170:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc/Detalle/2,2017,767882";


         // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlDetalleOT);
//alert(UrlDetalleOT);
        var infordet;
        $.ajax({
            url: UrlDetalleOT,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    //  infordet = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;

                    if (UrlDetalleOT.includes("tl07DetalleOTGet") == true) {
                        infordet = (JSON.parse(data.tl07DetalleOTGetResult)).DetalleOT01;
                    }
                    else {
                        infordet = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
                    }


                } catch (e) {
                    kendo.ui.progress($("#detalle_otScreen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#detalle_otScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                return;
            }
        });


        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infordet)[0]);

        if (inspeccionar(infordet).length > 0) {

            if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {

                $("#gridDetalleOT").kendoGrid({
                    dataSource: {
                        pageSize: 20,
                        data: infordet,
                        aggregate: [
                                    { field: "Descripcion", aggregate: "count", width: descri },
                                    { field: "Cantidad", aggregate: "sum", width: cant },
                                    { field: "Total", aggregate: "sum" }
                        ]
                    },
                    pageable: false,
                    columns: [
                                { field: "Descripcion", title: "Descripci&oacute;n", footerTemplate: "TOTAL:", width: descri },
                                { field: "Cantidad", title: "Cantidad", width: cant },
                                { field: "Total", format: "{0:c}", title: "Total", footerTemplate: "#= kendo.toString(sum, '$0.00') #" }
                    ]
                });

            }
            else {
                $("#gridDetalleOT").kendoGrid({
                    dataSource: {
                        pageSize: 20,
                        data: infordet,
                        aggregate: [
                                    { field: "Descripcion", aggregate: "count", width: descri },
                                    { field: "Cantidad", aggregate: "sum", width: cant },
                                    { field: "Total", aggregate: "sum" }
                        ]
                    },
                    pageable: false,
                    columns: [
                                { field: "Descripcion", title: "Descripci&oacute;n", footerTemplate: "TOTAL:" },
                                { field: "Cantidad", title: "Cantidad", width: 70 },
                                { field: "Total", format: "{0:c}", title: "Total", footerTemplate: "#= kendo.toString(sum, '$0.00') #", width: 70 }
                    ]
                });

            }

        }


        kendo.ui.progress($("#detalle_otScreen"), false);

        // precarga ***********************
    }, 1000);
} catch (error) {
      alert(error);  
}
}



function volverOT() {
    kendo.mobile.application.navigate("components/lector_barras/view.html");
}




//function shareMessageViaWhatsApp() {

//    alert("xdd");

////    window.plugins.socialsharing.shareViaWhatsApp('The message', null, null, this.onSuccess2, this.onError2);
//      window.plugins.socialsharing.shareViaSMS('My cool message', null /* see the note below */, alert('ok: ' + msg), alert('error: ' + msg));
//    alert("33");

//}




//function onSuccess2(msg) {
//    alert('SocialSharing success: ' + msg);
//}

//function onError2(msg) {
//    alert('SocialSharing error: ' + msg);
//}




// END_CUSTOM_CODE_home