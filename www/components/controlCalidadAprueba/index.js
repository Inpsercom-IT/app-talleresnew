var arrEstOTCCA = ["RECEPCIONADO", "EN ESPERA DE ASIGNACION", "ASIGNADO TECNICO", "TRABAJANDO", "PARALIZADO", "LAVADO", "CONTROL CALIDAD", "CERRADO"];
var arrColorOTCCA = ["#ffffff", "#C6C7C6", "#FF00FF", "#FFFF00", "#FF5152", "#5151FF", "#BDFFBD", "#00EF00"];

'use strict';
app.ccAprueba = kendo.observable({
    onShow: function () {
        if(banderaCCL==0){
            vistaParametrosCCA();
        }else{
            admConsultarOTCCA();
        }
        
    },
    afterShow: function () { }
});
app.localization.registerView('ccAprueba');

function vistaParametrosCCA() {
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("tablaOT2CCA").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                                                        "    <tr>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                </p><p>" +
                                                        "                <input id='dpInicioOTCCA' value='01-01-1900' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "            </p><p>" +
                                                        "                <input id='dpFinOTCCA' value='01-10-2017' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +

                                                        "<td>" +
                                                        "<p>" +
                                                        "<label class='w3-text-red'><b>N&#186; Orden Trabajo</b></label>" +
                                                        "</p>" +
                                                        "<p><input name='numProfCA' type='number' id='numProfCCA' class='w3-input w3-border textos' style='max-width:115px' value=''></p>" +
                                                         "</td>" +
                                                        "        <td valign='bottom'>" +
                                                        "            <p>" +
                                                        "                <button onclick='admConsultarOTCCA();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "    </tr>" +

                                                        "</table>";
    }
    else {
        document.getElementById("tablaOT2CCA").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "                <td>" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                        <input id='dpInicioOTCCA' value='01-01-1900' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "                <td >" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                       <input id='dpFinOTCCA' value='01-10-2017' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" +
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "             <tr>" +
                                                        "                <td valign='bottom'>" +
                                                        "                    <p>" +
                                                        "                        <button onclick='admConsultarOTCCA();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i> </button>" +
                                                                "&nbsp;&nbsp;<button class='w3-btn w3-red'><a id='mostrar3CCA' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
                                                        "<a id='ocultar3CCA' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
                                                        "                </td>" +
                                                        "            </tr>      " +
                                                        "        </table>" +
                                                        "<div id='divControlesOTCCA' style='display:initial' class='target3'>" + // mas controles    
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "<td>" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" + tablaEstadoColor() +
                                                        "</div>";
    }
try {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //Enero is 0

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    var date = moment(yyyy + '-' + mm + '-' + dd),
        begin = moment(date).isoWeekday(1);

    begin.startOf('week');

    for (var i = 0; i < 7; i++) {
        if (i == 1) {
            // Toma el lunes por def.
            document.getElementById("dpInicioOTCCA").value = begin.format('DD-MM-YYYY');
            break;
        }
        //  alert(begin.format('DD-MM-YYYY'));
        begin.add('d', 1);
    }

    $("#dpInicioOTCCA").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    document.getElementById("dpFinOTCCA").value = dd + '-' + mm + '-' + yyyy;

    $("#dpFinOTCCA").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target3CCA').hide("fast");

    $(document).ready(function () {
        $("#mostrar3CCA").click(function () {
            $('#target3CCA').show(1000);
            $('.target3CCA').show("fast");
            $('.mostrar3CCA').hide("fast");
            document.getElementById("mostrar3CCA").style.display = 'none';
            document.getElementById("ocultar3CCA").style.display = 'initial';
            document.getElementById('otNumCCA').value = "";
        });
        $("#ocultar3CCA").click(function () {
            $('#target3CCA').hide(1000);
            $('.target3CCA').hide("fast");
            document.getElementById("mostrar3CCA").style.display = 'initial';
            document.getElementById("ocultar3CCA").style.display = 'none';
            document.getElementById('otNumCCA').value = "";
        });
    });
    if (inspeccionar(localStorage.getItem("dataItem")) == null || inspeccionar(localStorage.getItem("dataItem")) == ""){
        document.getElementById("tablaOTDetalleCCA").style.display = "none";
    }
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnFooterOTCCA").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        document.getElementById("btnFooterOTCCA").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button onclick='vistaParametrosCCA();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i></button>";
    }
} catch (error) {
    alert(error);
}

}

function admConsultarOTCCA() {
    try {
        document.getElementById("gridListaOrdenesCCA").innerHTML = "";
        // elimina la variable del radio button
        if (localStorage.getItem("ls_oteiCCA") != undefined) {
            localStorage.removeItem("ls_oteiCCA");
        }
        // elimina la variable del detalle
        if (localStorage.getItem("ls_otdet2CCA") != undefined) {
            localStorage.removeItem("ls_otdet2CCA");
        }
        document.getElementById("tablaOTDetalleCCA").style.display = "none";
    
        try {
            // Grid VIN
            var grid01_1 = $("#gridListaOrdenesCCA").data("kendoGrid");
            grid01_1.destroy();
        }
        catch (emo1)
        { }
        var strProp = ""; //document.getElementById('otPropCA').value;
        var strPLACA = ""; //document.getElementById('otPlacaCA').value;
        //var strOT = document.getElementById('otNumCA').value;
        var otEstado2 = "ABIERTO"; //document.getElementById('otEstado2CA').value;
        var datFecIni = document.getElementById('dpInicioOTCCA').value;
        var datFecFin = document.getElementById('dpFinOTCCA').value;
        var strOT = document.getElementById('numProfCCA').value;
        var numProf = "";
        
        if (numProf.trim() == "") {
            numProf = "0";
        }
        if (validaFecha(datFecIni, datFecFin) == false) {
            kendo.ui.progress($("#ccApruebaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
            return;
        }
        kendo.ui.progress($("#ccApruebaScreen"), true);
        setTimeout(function () {
            //  precarga *********************************************************************************************
            var verColEstado = true;
            var UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/16,json;" +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() +
            ";;;;;" + strProp + ";;" +
            datFecIni + ";" + datFecFin + ";;" + otEstado2 + "" +
            ";" + numProf + ";CONTROL CALIDAD";
    
            if (strOT.trim() != "") {
    
                if (strOT.trim().length > 7) {
                    UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/16,json;" +
                    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                    localStorage.getItem("ls_usagencia").toLocaleString() +
                    ";;;;;" + strProp + ";" + strOT + ";;;;" + otEstado2 + "" +
                    ";" + numProf + ";CONTROL CALIDAD";
                }
                else {
                    UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/16json;" +
                    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                    localStorage.getItem("ls_usagencia").toLocaleString() +
                    ";" + strOT + ";;;;" + strProp + ";;;;;" + otEstado2 + "" +
                    ";" + numProf  + ";CONTROL CALIDAD";
                }
    
                verColEstado = false;
            }
            UrlOrdenes = UrlOrdenes + ";POR_REVISAR";
            var imgBotOt = "fa fa-unlock-alt fa-lg";
            var modoEnviaOT = "9";
            var colOculta = true;
            var titGEv01 = "Liquidar";
    
            if (otEstado2 == "CERRADO") {
                imgBotOt = "fa fa-unlock fa-lg";
                modoEnviaOT = "10";
                colOculta = false;
                titGEv01 = "Reliquidar";
            }

            var infOrdenes;
            $.ajax({
                url: UrlOrdenes,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        //  alert(inspeccionar(data));
                        infOrdenes = (JSON.parse(data.tl06OrdenesGetResult)).ttl06;
                    } catch (e) {
                        kendo.ui.progress($("#ccApruebaScreen"), false);
                        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                        return;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#ccApruebaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                    return;
                }
            });
    
            if (inspeccionar(infOrdenes).length > 0) {
                var numeroFilasOT = 5;
                //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                //}
                var col1 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 4) / 100;
                var col2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 4) / 100;
                //  if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                if (otEstado2 == "ABIERTO") {
                    numeroFilasOT = 27;
                    $("#gridListaOrdenesCCA").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasOT,
                            data: infOrdenes
                        },
                        filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    startswith: "inicia con",
                                    eq: "igual a",
                                    neq: "distinto de"
                                }
                            }
                        },
                        pageable: {
                            input: true,
                            numeric: false
                        },
                        //    height: 'auto',
                        scrollable: true,
                        groupable: false,
                        columns: [{
                                         title: "Formulario",
                                         width: 13,
                                         command: [{
                                             name: "detalle",
                                             text: "",
                                             imageClass: "fa fa-file-text-o",
                                             visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                             click: function (emo04) {
                                                 try {
                                                     var dataItemCCA = this.dataItem($(emo04.currentTarget).closest("tr"));
                                                     emo04.preventDefault();
                                                     localStorage.setItem("dataItemCCA", JSON.stringify(dataItemCCA));
                                                     // abre pagina detalle
                                                     kendo.mobile.application.navigate("components/reporteControlCliente/view.html");
                                                     
                                                 }
                                                 catch (fmo4) {
                                                     kendo.ui.progress($("#ccApruebaScreen"), false);
                                                     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                                     return;
                                                 }
                                             }
                                         }],
                                     },
                                     {
                                        field: "estado_calidad", title: "Est. Calidad",filterable:false, width: 17 //, hidden: verColEstado
                                    },
                               
                                //{ field: "numero_orden", title: "OT", width: 33 },
    
                                // VIP BANDERA
                                  {
                                      field: "numero_orden", title: "OT <b>(VIP <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i>)</b>", width: 20,
                                      template: "#= clienteVIP(numero_orden, persona_clase) #"
                                  },
    
                                { field: "placa", title: "Placa",filterable:false, width: 14 },
                                { field: "nombre_modelo", title: "Modelo", width: col1 },
                                {
                                    field: "nombre_propietario",filterable:false,
                                    title: "Propietario",
                                    groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                    width: col2
                                },
                                {
                                    field: "estado", title: "Estado", width: 20 //, hidden: verColEstado
                                },
                                {
                                    field: "estado_interno", title: "Estado Interno",filterable:false, width: 25,
                                    
                                },
                                 { field: "nombre_entrega_auto", title: "Nombre CSI", width: col2 },
                                 { field: "tipo_trabajo", title: "Tipo Trabajo", width: 30 }, 
                                 { field: "causal_parada_actividad", title: "Causa", width: 30 }, 
                                 { field: "persona_clase", title: "VIP", width: 25 }
    
                        ]
                    });
                }
                else {
                    numeroFilasOT = 27;
                    $("#gridListaOrdenesCCA").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasOT,
                            data: infOrdenes
                        },
                        filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    startswith: "inicia con",
                                    eq: "igual a",
                                    neq: "distinto de"
                                }
                            }
                        },
                        pageable: {
                            input: true,
                            numeric: false
                        },
    
                        scrollable: true,
                        groupable: false,
                        columns: [
                                     {
                                         title: titGEv01,
                                         width: 25,
                                         command: [{
                                             name: "reversa",
                                             text: "",
                                             imageClass: imgBotOt,
                                             visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                             click: function (emo02) {
                                                 try {
                                                     var dataItem = this.dataItem($(emo02.currentTarget).closest("tr"));
                                                     emo02.preventDefault();
                                                     //  Cierra la orden
                                                     //  admCierraOT(modoEnviaOT, dataItem.numero_orden);
    
    
    
                                                     // Cierra OT solo si esta en CONTROL DE CALIDAD
                                                     if (dataItem.estado_interno.includes("CERRADO") == true) {
                                                         //   admCierraOT(modoEnviaOT, dataItem.numero_orden);
                                                         generarOrdenPDFcontrolCalidad(dataItem.numero_orden);
                                                     }
                                                     else {
                                                         window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede reliquidar la OT: <b>" + dataItem.numero_orden + "</b><br />porque no esta <b>CERRADA</b></center>");
                                                     }
    
    
    
                                                 }
                                                 catch (fmo) {
                                                     kendo.ui.progress($("#ccApruebaScreen"), false);
                                                     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo);
                                                     return;
                                                 }
                                             }
                                         }],
                                     },
    
                                      //______________________________________________________________
    
                                         {
                                             title: "Entregar/Reversar",
                                             width: 40,
                                             command: [{
                                                 name: "reversar",
                                                 text: "",
                                                 // imageClass: "fa fa-undo",
                                                 imageClass: "fa fa-play",
                                                 visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
    
                                                 //   visible: function (dataItem) { return verBotonEstadoReversa(dataItem.estado, dataItem.estado_entrega); },
    
                                                 click: function (emo03) {
                                                     try {
                                                         var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                                         emo03.preventDefault();
    
                                                         if (dataItem.estado == "CERRADO") {
                                                             // Entrega Vehiculo
                                                             // entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega);
                                                             entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega, dataItem.chasis, dataItem.placa);
    
                                                         }
                                                     }
                                                     catch (fmo3) {
                                                         kendo.ui.progress($("#ccApruebaScreen"), false);
                                                         window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                                         return;
                                                     }
                                                 }
                                             }],
                                         },
    
                                     //_____________________________________________________________
    
    
                                     {
                                         title: "Ver detalle",
    
                                         width: 25,
                                         command: [{
                                             name: "detalle",
                                             text: "",
                                             imageClass: "fa fa-calculator",
                                             visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                             click: function (emo04) {
                                                 try {
                                                     var dataItem = this.dataItem($(emo04.currentTarget).closest("tr"));
                                                     emo04.preventDefault();
                                                     localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                                     kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");
    
                                                     //   cambiaEstInt(dataItem.numero_orden, dataItem.seccion_orden_trabajo, dataItem.estado_interno);
                                                 }
                                                 catch (fmo4) {
                                                     kendo.ui.progress($("#ccApruebaScreen"), false);
                                                     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                                     return;
                                                 }
                                             }
                                         }],
                                     },
    
    
                                {
                                    field: "estado_entrega", title: "Estado Entrega", width: 40 //, hidden: colOculta
                                },
    
    
                                {
                                    field: "estado", title: "Estado", width: 30 //, hidden: verColEstado
                                },
                                {
                                    field: "estado_interno", title: "Estado Interno", width: 65,
                                   },
    
                                //{ field: "numero_orden", title: "OT", width: 33 },
    
                                // VIP BANDERA
                                  {
                                      field: "numero_orden", title: "OT <b>(VIP <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i>)</b>", width: 35,
                                      template: "#= clienteVIP(numero_orden, persona_clase) #"
                                  },
    
    
                                { field: "placa", title: "Placa", width: 30 },
                                { field: "nombre_modelo", title: "Modelo", width: col1 },
                                {
                                    field: "nombre_propietario",
                                    title: "Propietario",
                                    groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                    width: col2
                                },
    
                                //{
                                //    field: "estado_entrega", title: "Estado Entrega", width: 40 //, hidden: colOculta
                                //},
    
                        //{ field: "fecha_entrega", title: "Fecha Entrega", width: 30 },
                        //{ field: "hora_entrega", title: "Hora Entrega", width: 30 },
    
                        {
                            field: "fecha_entrega", title: "Fecha Entrega", width: 45,
                            template: "#= formatoHoraEntrega(fecha_entrega, hora_entrega) #"
                        },
    
                        { field: "usuario_entrega", title: "Usu. Entrega", width: 30 },
                        { field: "nombre_entrega_auto", title: "Nombre CSI", width: col2 },
                        { field: "tipo_trabajo", title: "Tipo Trabajo", width: 35 }
    
    
                        , { field: "causal_parada_actividad", title: "Causa", width: 35 }
    
    
                        , { field: "persona_clase", title: "VIP", width: 30 }
    
    
                        ]
                    });
                }
    
                document.getElementById("tablaOTDetalleCCA").style.display = "block";
            }
            else {
    
                document.getElementById("tablaOTDetalleCCA").style.display = "none";
    
                var msjError = "<center>No existen registros</center>";
    
                if (strOT.trim().length > 0 && strPLACA.trim().length > 0) {
                    msjError = "<center>No existen registros de la OT: <b>" + strOT + "</b><br/>con Placa <b>" + strPLACA + "</b></center>";
                }
                else if (strOT.trim().length == 0 && strPLACA.trim().length > 0) {
                    msjError = "<center>No existen registros de la Placa <b>" + strPLACA + "</b></center>";
                }
                else if (strOT.trim().length > 0 && strPLACA.trim().length == 0) {
                    msjError = "<center>No existen registros de la OT: <b>" + strOT + "</b></center>";
                }
    
                kendo.ui.progress($("#ccApruebaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjError);
                return;
            }
    
            kendo.ui.progress($("#ccApruebaScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);
    } catch (error) {
        alert(error);
    }
}

function controlCalidadcreaPDF(codOT, htmlReporte) {

    var archivoPDF = localStorage.getItem("ls_empresa").toLocaleString().slice(0, 5) + "_" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
    localStorage.getItem("ls_usagencia").toLocaleString() + "_" + codOT;

    var params = {
        "strArchivo": archivoPDF,
        "strHTML": htmlReporte
    };

    // "http://200.31.10.92:8092/appk_aekia/Services/TL/Taller.svc/creaPdf",
    var UrlPDF = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TL/Taller.svc/creaPdf";

    //   UrlPDF = "http://localhost:55034/FileUpload.asmx/creaPdf";  // local

    kendo.ui.progress($("#lector_barrasScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

        $.ajax({
            url: UrlPDF,
            type: "POST",
            data: JSON.stringify(params),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (data) {
                try {
                    var respPdf = JSON.stringify(data);

                    var MsjPdfOT = "<center>El archivo fue generado correctamente<br/>para la OT: <b>" + codOT + "</b></center>";

                    if (respPdf.includes("error") == true) {

                        kendo.ui.progress($("#lector_barrasScreen"), false);
                        MsjPdfOT = respPdf.split(",")[1];
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", MsjPdfOT);
                        return;
                    }

                    window.myalert("<center><i class=\"fa fa-file-pdf-o\"></i> GENERADO</center>", MsjPdfOT);
                    // return;
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>3 ERROR</center>", JSON.stringify(err));
                return;
            }
        });

        kendo.ui.progress($("#lector_barrasScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);

}