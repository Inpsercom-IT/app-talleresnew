/*=======================================================================
Fecha: 11/01/2018 - ok
=======================================================================
Detalles: 
- busca OT's por rango de fechas, Placa, OT
- Cerrar / Reversar OT
- Cambio de estado interno
- Detalle de orden de trabajo
=======================================================================
Autor: RRP.
=======================================================================*/

var arrEstOT; 
var conInSitu;
var conMP;
var arrColorOT;
var arrMenuAbierto = ["LIQUIDAR","CAMBIO ESTADO INT.","VER DETALLE OT","VER CONTROL CALIDAD","ENCUESTA"];
var arrMenuCerrado = ["RELIQUIDAR","ENTREGA","REVERSAR ENTREGA","VER DETALLE OT","ENTREGAR VEHICULO","VER CONTROL CALIDAD"];

'use strict';

app.admOt = kendo.observable({
    onShow: function () {

        vistaParametros();
        localStorage.removeItem("banderaE");
        arrEstOT = ["RECEPCIONADO", "EN ESPERA DE ASIGNACION", "ASIGNADO TECNICO", "TRABAJANDO", "PARALIZADO", "LAVADO", "CONTROL CALIDAD", "CERRADO", "FINALIZADO"];
        arrColorOT  = ["#ffffff", "#C6C7C6", "#FF00FF", "#FFFF00", "#FF5152", "#5151FF", "#BDFFBD", "#00EF00", "#2cd612"];
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if (localStorage.getItem("ls_otdet2") != undefined) {
            kendo.ui.progress($("#admOtScreen"), true);
            setTimeout(function () {
            var arrFecOteV = localStorage.getItem("ls_otdet2").toLocaleString().split('|');
            document.getElementById("dpInicioOT").value = arrFecOteV[3];
            document.getElementById("dpFinOT").value = arrFecOteV[4];
            document.getElementById('otEstado2').value = arrFecOteV[5];
            document.getElementById('numProf').value = arrFecOteV[6];
            
            admConsultarOT();
            
            llamarColorTexto(".w3-text-red");
            kendo.ui.progress($("#admOtScreen"), false);
            // precarga *********************************************************************************************
            }, 2000);
        }
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        //  admConsultarOT();
    },
    afterShow: function () { }
});
app.localization.registerView('admOt');

// START_CUSTOM_CODE_admOt
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function consultaEncuestaINS() {
    try {
        var accResp = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/3,"+localStorage.getItem("ls_idempresa").toLocaleString()+";TL;ORDEN_TRABAJO;ENCUESTA_INSITU_SALESFORCE";
        var respPar;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = data.ParametroEmpGetResult;
                    if (accResp.substr(0,1)=="0") {
                        respPar = accResp;
                    } else {
                        respPar = accResp.split(';')[1];
                    }
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });

        return respPar;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return "error";
    }
}

function consultaMP() {
    try {
        var accResp1 = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/3,"+localStorage.getItem("ls_idempresa").toLocaleString()+";TL;ORDEN_TRABAJO;ENCUESTA_INSITU_TIPO_OT";
        var respPar1;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp1 = data.ParametroEmpGetResult;
                   if (accResp1.substr(0,1)=="0") {
                        respPar1 = ccResp1;
                    } else {
                        respPar1 = accResp1.split(';')[1];
                    }
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar1 = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar1 = "error";
            }
        });
        return respPar1;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return "error";
    }
}
function admConsultarOT() {
    document.getElementById("gridListaOrdenes").innerHTML = "";
    // elimina la variable del radio button
    if (localStorage.getItem("ls_otei") != undefined) {
        localStorage.removeItem("ls_otei");
    }

    // elimina la variable del detalle
    if (localStorage.getItem("ls_otdet2") != undefined) {
        localStorage.removeItem("ls_otdet2");
    }

    document.getElementById("tablaOTDetalle").style.display = "none";

    try {
        // Grid VIN
        var grid01_1 = $("#gridListaOrdenes").data("kendoGrid");
        grid01_1.destroy();
    }
    catch (emo1)
    { }

    var strProp = document.getElementById('otProp').value;
    var strPLACA = document.getElementById('otPlaca').value;
    var strOT = document.getElementById('otNum').value;
    var otEstado2 = document.getElementById('otEstado2').value;
    var datFecIni = document.getElementById('dpInicioOT').value;
    var datFecFin = document.getElementById('dpFinOT').value;

    var numProf = document.getElementById('numProf').value;

    if (numProf.trim() == "") {
        numProf = "0";
    }

    if (validaFecha(datFecIni, datFecFin) == false) {
        kendo.ui.progress($("#admOtScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
        return;
    }

    kendo.ui.progress($("#admOtScreen"), true);
    setTimeout(function () {
        //  precarga *********************************************************************************************

        var verColEstado = true;
        var UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() +
        ";;;;;" + strProp + ";;" +
        datFecIni + ";" + datFecFin + ";;" + otEstado2 + "" +
        ";" + numProf+";";

        if (strOT.trim() != "") {

            if (strOT.trim().length > 7) {
                UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() +
                ";;;;;" + strProp + ";" + strOT + ";;;;" + otEstado2 + "" +
                ";" + numProf+";";
            }
            else {
                UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() +
                ";" + strOT + ";;;;" + strProp + ";;;;;" + otEstado2 + "" +
                ";" + numProf+";";
            }
            verColEstado = false;
        }

      //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlOrdenes</center>", UrlOrdenes);
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
//alert(UrlOrdenes);        
//window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> infordenes</center>",UrlOrdenes);
        $.ajax({
            url: UrlOrdenes,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.tl06OrdenesGetResult==null) {
                        alert("No existe datos");
                        kendo.ui.progress($("#admOtScreen"), false);
                        return;
                    } else {
                        infOrdenes = (JSON.parse(data.tl06OrdenesGetResult)).ttl06;
                    } 
                    
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> infordenes</center>",inspeccionar(infOrdenes[1]));
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> infordenes</center>",inspeccionar(infOrdenes[2]));

                } catch (e) {
                    alert("no sale"+inspeccionar(e));
                    kendo.ui.progress($("#admOtScreen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                
                //alert("errormmm"+err)
                kendo.ui.progress($("#admOtScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                return;
            }
        });
         //alert(inspeccionar(infOrdenes).length);
        if (inspeccionar(infOrdenes).length > 0) {
            var numeroFilasOT = 5;

            //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            //}
            var col1 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 4) / 100;
            var col2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 4) / 100;
            //  if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            if (otEstado2 == "ABIERTO") {
                numeroFilasOT = 27;
                $("#gridListaOrdenes").kendoGrid({
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
                                     /* title: titGEv01,width: 20,command: [{name: "cierra",text: "",hidden: true,imageClass: imgBotOt,
                                         visible: false, // visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                         click: function (emo02) {
                                             try {var dataItem = this.dataItem($(emo02.currentTarget).closest("tr"));
                                                 emo02.preventDefault();                                            
                                                 if (dataItem.estado_interno.includes("CALIDAD") == true) {
                                                     admCierraOT(modoEnviaOT, dataItem.numero_orden);
                                                 }else {window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede liquidar la OT: <b>" + dataItem.numero_orden + "</b><br />porque no esta en <b>CONTROL DE CALIDAD</b></center>");
                                                 }}
                                             catch (fmo) {
                                                 kendo.ui.progress($("#admOtScreen"), false);
                                                 window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo);
                                                 return;
                                             }}}],}, { */ 
                                
                                     title: "Menú",
                                     width: 10,
                                     template: "#= cboEstadosOT(estado_calidad) #",
                                     attributes: {
                                         style: "background-color: #= fondoEstOT(estado_calidad) #; color:# if (estado_calidad === \'\') { # black # } else { # white #}#"
                                     },
                                     command: [{
                                         name: "nuevo",text: "",imageClass: "fa fa-undo",
                                          click: function (emo03) {
                                             try {
                                                 var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                                 emo03.preventDefault();
                                                 nuevoMenu(dataItem);
                                             }
                                             catch (fmo3) {
                                                 kendo.ui.progress($("#admOtScreen"), false);
                                                 window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                                 return;
                                             }
                                         }
                                     }],
                                 },
                                 /* {
                                    title: "Cambio Est.Int.",width: 25,command: [{name: "cambio",text: "",imageClass: "fa fa-play",
                                    visible: function (dataItem) { return verBotonEstado(dataItem.estado, dataItem.estado_entrega); },
                                    click: function (emo03) {try {var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                    emo03.preventDefault();if (dataItem.estado == "ABIERTO") {cambiaEstInt(dataItem.numero_orden, dataItem.seccion_orden_trabajo, dataItem.estado_interno);
                                    }else {// Entrega Vehiculo
                                    entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega, dataItem.chasis, dataItem.placa);
                                    }}catch (fmo3) {kendo.ui.progress($("#admOtScreen"), false);
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                    return;}}}],}, */


                                 //______________________________________________________________
                                 /*{width: 15,command: [{name: "reversar",text: "",imageClass: "fa fa-undo",//  visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                    visible: function (dataItem) { return verBotonEstadoReversa(dataItem.estado, dataItem.estado_entrega); },
                                    click: function (emo03) {try {var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                        emo03.preventDefault();if (dataItem.estado == "CERRADO") {// Entrega Vehiculo//  entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega);
                                        entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega, dataItem.chasis, dataItem.placa);
                                        }}catch (fmo3) {kendo.ui.progress($("#admOtScreen"), false);
                                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                        return;}}}],},*/
                                 //_____________________________________________________________
                                 /* {title: "Ver detalle",width: 20,command: [{name: "detalle",text: "",imageClass: "fa fa-calculator",
                                 visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                 click: function (emo04) {try {var dataItem = this.dataItem($(emo04.currentTarget).closest("tr"));
                                emo04.preventDefault();// url detalle OT//    var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataItem.codigo_empresa + "," + dataItem.anio + "," + dataItem.secuencia_orden + "|" + dataItem.numero_orden;
                                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataItem.codigo_empresa + "," + dataItem.anio + "," + dataItem.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataItem.numero_orden;
                                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataItem.codigo_empresa + ";" + dataItem.chasis + ";" + dataItem.estado + ";;TALLER;DIAGNOSTICO";
                                //   var urlSMS = "http://localhost:4044/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataItem.codigo_empresa + ";" + dataItem.chasis + ";" + dataItem.estado + ";;TALLER;DIAGNOSTICO";
                                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                                localStorage.setItem("ls_otdet2", urlDot);//   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> urlDot</center>", urlDot);
                                // abre pagina detalle
                                kendo.mobile.application.navigate("components/reporte1/view.html");}catch (fmo4) {kendo.ui.progress($("#admOtScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                return;}}}],}, */
                                /* {title: "Ver Calidad",width: 20,command: [{name: "control",text: "",imageClass: "fa fa-file-excel-o",
                                visible: function (dataItem) { return dataItem.estado_calidad == "REVISADO" },
                                click: function (emo02L) {try {var dataItem = this.dataItem($(emo02L.currentTarget).closest("tr"));
                                emo02L.preventDefault();localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                kendo.mobile.application.navigate("components/reporteClienteAprobado/view.html");}catch (fmo) {
                                kendo.ui.progress($("#admOtScreen"), false);window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo);
                                return;}}}],}, */
                                /* {title: "Encuesta",width: 20,command: [{name: "encuesta",text: "",imageClass: "fa fa-user-circle-o",
                                visible: function (dataItem) { return dataItem.estado_calidad == "REVISADO" },click: function (emo02LC) {
                                try {var dataItem = this.dataItem($(emo02LC.currentTarget).closest("tr"));emo02LC.preventDefault();
                                localStorage.setItem("dataItem", JSON.stringify(dataItem));kendo.mobile.application.navigate("components/reporteEncuestaClientes/view.html");
                                }catch (fmo) {kendo.ui.progress($("#admOtScreen"), false);window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo);
                                return;}}}],}, */
                            

                            //{ field: "numero_orden", title: "OT", width: 33 },

                            // VIP BANDERA
                              {
                                  field: "numero_orden", title: "OT <b>(VIP <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i>)</b>", width: 15,
                                  template: "#= clienteVIP(numero_orden, persona_clase) #"
                              },


                            { field: "placa", title: "Placa",filterable:false, width: 13,
                            },
                            { field: "nombre_modelo", title: "Modelo",filterable:false, width: col1 -20 },
                            { field: "anio_modelo", title: "Anio Modelo",filterable:false, width: col1 -20 },
                            { field: "kilometraje", title: "Kilometraje",filterable:false, width: col1 -20 },
                            { field: "fecha_recepcion", title: "Fecha Recepción",filterable:false, width: col1 -20 },
                            { field: "nombre_propietario", title: "Propietario",filterable:false,
                             groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                width: col2 - 20
                            },
                            //, hidden: verColEstado
                            
                            {
                                field: "estado_interno", title: "Estado Interno",filterable:false, width: 25,
                                template: "#= cboEstadosOT(estado_interno) #",
                                attributes: {
                                    style: "background-color: #= fondoEstOT(estado_interno) #; color:# if (estado_interno === \'LAVADO\') { # white # } else { # black #}#"
                                }
                            },
                             //{
                             //    field: "estado_entrega", title: "2Estado Entrega", width: 40,
                             //    template: "# if (estado === \'CERRADO\') { # estado_interno # } else { #  #}#",
                             //},

                             //{ field: "fecha_entrega", title: "Fecha Entrega", width: 50 },
                             //{ field: "hora_entrega", title: "Hora Entrega", width: 50 },
                             //{ field: "usuario_entrega", title: "Usuario Entrega", width: 50 },

                             { field: "tipo_trabajo", title: "Tipo Trabajo", width: 15 }, 
                             { field: "seccion_orden_trabajo", title: "Secc. Ord. Trabajo", width: 18 },
                             { field: "causal_parada_actividad", title: "Causa", width: 10 }, 
                             { field: "nombre_entrega_auto", title: "Nombre CSI", width: col2 - 10 },
                             { field: "persona_clase", title: "VIP", width: 30 },
                             {field: "estado", title: "Estado", width: 20 }
                             

                    ]
                });
            }
            else {

                numeroFilasOT = 27;

                $("#gridListaOrdenes").kendoGrid({


                    dataSource: {
                        pageSize: numeroFilasOT,
                        data: infOrdenes//,
                        //  group: { field: "estado" },
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

                    //    height: 'auto',

                    groupable: false,
                    columns: [/* {title: titGEv01,width: 25,command: [{name: "reversa",text: "",imageClass: imgBotOt,
                            visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                            click: function (emo02) {try {var dataItem = this.dataItem($(emo02.currentTarget).closest("tr"));
                            emo02.preventDefault();// Cierra OT solo si esta en CONTROL DE CALIDAD
                            if (dataItem.estado_interno.includes("CERRADO") == true) { //   admCierraOT(modoEnviaOT, dataItem.numero_orden);
                                generarOrdenPDFAdmOT(dataItem.numero_orden);}else {
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede reliquidar la OT: <b>" + dataItem.numero_orden + "</b><br />porque no esta <b>CERRADA</b></center>");
                            }}catch (fmo) {kendo.ui.progress($("#admOtScreen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo);return;
                            }}}],}, */
                            {title: "Menú",
                            width: 13,
                            command: [{
                                name: "nuevo",text: "",imageClass: "fa fa-undo",
                                click: function (emo03) {
                                    try {
                                        var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                        emo03.preventDefault();
                                        nuevoMenuCerrado(dataItem);
                                    }
                                    catch (fmo3) {
                                        kendo.ui.progress($("#admOtScreen"), false);
                                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                        return;
                                    }
                                }
                            }],
                        },
                                 /*

                                 {
                                     title: "Entregar",
                                     width: 20,
                                     command: [{
                                         name: "cambio",
                                         text: "",

                                         imageClass: "fa fa-play",

                                         //  visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },

                                         visible: function (dataItem) { return verBotonEstado(dataItem.estado, dataItem.estado_entrega); },

                                         click: function (emo03) {
                                             try {
                                                 var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                                 emo03.preventDefault();

                                                 if (dataItem.estado == "ABIERTO") {
                                                     // Cambia Estado Interno

                                                     //alert(dataItem.estado);

                                                     cambiaEstInt(dataItem.numero_orden, dataItem.seccion_orden_trabajo, dataItem.estado_interno);
                                                 }
                                                 else {
                                                     // Entrega Vehiculo
                                                     //  entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega);
                                                     entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega, dataItem.chasis, dataItem.placa);

                                                 }
                                             }
                                             catch (fmo3) {
                                                 kendo.ui.progress($("#admOtScreen"), false);
                                                 window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                                 return;
                                             }
                                         }
                                     }],
                                 },

                                 */

                                                                  //______________________________________________________________

                                     /* {title: "Entregar/Reversar",width: 40,command: [{name: "reversar",text: "",imageClass: "fa fa-play",
                                     visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                    click: function (emo03) {try {var dataItem = this.dataItem($(emo03.currentTarget).closest("tr"));
                                    emo03.preventDefault();if (dataItem.estado == "CERRADO") {entregaVehiculo(dataItem.numero_orden, dataItem.estado_entrega, dataItem.chasis, dataItem.placa);
                                    }}catch (fmo3) {kendo.ui.progress($("#admOtScreen"), false);window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo3);
                                    return;}}}],}, */



                                 //_____________________________________________________________
                                 /* {title: "Ver detalle",width: 20,command: [{name: "detalle",text: "",imageClass: "fa fa-calculator",
                                  visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                  click: function (emo04) {try {var dataItem = this.dataItem($(emo04.currentTarget).closest("tr"));
                                  emo04.preventDefault();var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataItem.codigo_empresa + "," + dataItem.anio + "," + dataItem.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataItem.numero_orden;
                                  var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataItem.codigo_empresa + ";" + dataItem.chasis + ";" + dataItem.estado + ";;TALLER;DIAGNOSTICO";
                                  urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                                  localStorage.setItem("ls_otdet2", urlDot);kendo.mobile.application.navigate("components/reporte1/view.html");
                                   }catch (fmo4) {kendo.ui.progress($("#admOtScreen"), false);window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                 return;}}}],}, */
                            

                            //{ field: "numero_orden", title: "OT", width: 33 },

                            // VIP BANDERA
                              {
                                  field: "numero_orden",filterable:false, title: "OT <b>(VIP <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i>)</b>", width: 20,
                                  template: "#= clienteVIP(numero_orden, persona_clase) #"
                              },


                            { field: "placa", title: "Placa",filterable:false, width: 14 },
                            { field: "nombre_modelo", title: "Modelo",filterable:false, width: 20 },
                            { field: "anio_modelo", title: "Anio Modelo",filterable:false, width: 15 },
                            { field: "kilometraje", title: "Kilometraje",filterable:false, width: 15 },
                            { field: "fecha_recepcion", title: "Fecha Recepción",filterable:false, width: 15 },
                            { field: "nombre_propietario",filterable:false,
                                title: "Propietario",
                                groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                width: col2 - 20
                            },
                            {
                                field: "estado_entrega", title: "Estado Entrega",filterable:false, width: 20 //, hidden: colOculta
                            },


                            {
                                field: "estado", title: "Estado", width: 18 //, hidden: verColEstado
                            },
                            {
                                field: "estado_interno", title: "Estado Interno", width: 30,
                                template: "#= cboEstadosOT(estado_interno) #",
                                attributes: {
                                    style: "background-color: #= fondoEstOT(estado_interno) #; color:# if (estado_interno === \'LAVADO\') { # white # } else { # black #}#"
                                }
                            },
                            //{
                            //    field: "estado_entrega", title: "Estado Entrega", width: 40 //, hidden: colOculta
                            //},

                    //{ field: "fecha_entrega", title: "Fecha Entrega", width: 30 },
                    //{ field: "hora_entrega", title: "Hora Entrega", width: 30 },

                    {field: "fecha_entrega", title: "Fecha Entrega", width: 25,
                        template: "#= formatoHoraEntrega(fecha_entrega, hora_entrega) #"
                    },

                    { field: "usuario_entrega", title: "Usu. Entrega", width: 15 },
                    { field: "tipo_trabajo", title: "Tipo Trabajo", width: 15 }, 
                    { field: "seccion_orden_trabajo", title: "Secc. Ord. Trabajo", width: 18 },
                    { field: "causal_parada_actividad", title: "Causa", width: 10 }, 
                    { field: "nombre_entrega_auto", title: "Nombre CSI", width: col2 - 10 },
                    { field: "persona_clase", title: "VIP", width: 30 },
                    {field: "estado", title: "Estado", width: 20 }
                    ]
                });
            }

            document.getElementById("tablaOTDetalle").style.display = "block";
        }
        else {

            document.getElementById("tablaOTDetalle").style.display = "none";

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

            kendo.ui.progress($("#admOtScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjError);
            return;
        }

        kendo.ui.progress($("#admOtScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}




function formatoHoraEntrega(fecha_entrega, hora_entrega) {
    var horaresp = "";

    if (fecha_entrega != '' && fecha_entrega != null) {
        if (hora_entrega.includes(":") == true) {
            var arrHoPr = hora_entrega.split(":");
            horaresp = fecha_entrega + " " + arrHoPr[0] + ":" + arrHoPr[1];
        }
    }
    return horaresp;
}

// Presenta el boton segun el estado y el estado_entrega
function verBotonEstado(estado, entrega) {
    var bolVista = false;

    if (estado == "ABIERTO") {
        bolVista = true;
    }
    else {
        if (entrega.trim() != "" && entrega.trim() != "ENTREGADO") {
            bolVista = true;
        }
    }

    return bolVista;

    //  return true;
}

function verBotonEstadoReversa(estado, entrega) {
    var bolVista = false;

    if (estado == "CERRADO") {
        if (entrega.trim() == "ENTREGADO") {
            bolVista = true;
        }
    }
    return bolVista;
}


function imgBotEntrega(estEntrega) {

    var imgEntrega = "fa fa-play";

    if (estEntrega == "ENTREGADO") {
        imgEntrega = "fa fa-undo";
    }
    return imgEntrega;
}

function entregaVehiculo(numOT, estEntrega, numChasis, numPlaca) {
    cierraControlGralEI();

    var htmlDatosVeh = "Chasis: <b>" + numChasis + "</b>";
    if (numPlaca.trim() != "") {
        htmlDatosVeh += "<br />Placa: <b>" + numPlaca + "</b>";
    }

    var htmlEntrega = "Est&#225; seguro de entregar el veh&#237;culo<br />" + htmlDatosVeh;

    var htmlTitEntrega = "<center><i class=\"fa fa-play\"></i> ENTREGAR VEH&Iacute;CULO</center>";

    if (estEntrega == "ENTREGADO") {
        htmlEntrega = "Est&#225; seguro de reversar la entrega del veh&#237;culo<br />" + htmlDatosVeh;
        htmlTitEntrega = "<center><i class=\"fa fa-undo\"></i> REVERSAR VEH&Iacute;CULO</center>";
    }

    htmlEntrega += "<input id='numOTEntrega' name='numOTEntrega' type='hidden' value='" + numOT + "'>" +
                    "<input id='estEntrega' name='estEntrega' type='hidden' value='" + estEntrega + "'>" +
                    "<input id='numChasis' name='numChasis' type='hidden' value='" + numChasis + "'>" +
                    "<input id='numPlaca' name='numPlaca' type='hidden' value='" + numPlaca + "'>";

    dialogEntVeh = $("#dialogEntVeh").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: htmlTitEntrega,
        closable: false,
        modal: false,
        content: htmlEntrega,
        actions: [
            { text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ACEPTAR&nbsp;&nbsp;</button></font>', action: accEntregaVeh },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
    });
    dialogEntVeh.data("kendoDialog").open();
    llamarColorBotonGeneral(".w3-red");
}

/*--------------------------------------------------------------------
Fecha: 07/08/2018
Descripcion: Realiza el cambio de EI
--------------------------------------------------------------------*/
function accEntregaVeh() {
    var modoEI = "14";
    var numOT = document.getElementById("numOTEntrega").value;

    var estEntrega = document.getElementById("estEntrega").value;

    var numChasis = document.getElementById("numChasis").value;
    var numPlaca = document.getElementById("numPlaca").value;

    var msjDatosVeh = "Chasis: <b>" + numChasis + "</b>";
    if (numPlaca.trim() != "") {
        msjDatosVeh += "<br />Placa: <b>" + numPlaca + "</b>";
    }

    var msjEntrega = "";
    var msjTitEntrega = "";

    var estEntregaEnvia = "";

    if (estEntrega == "ENTREGADO") {
        estEntregaEnvia = "PENDIENTE";
        msjTitEntrega = "<center><i class=\"fa fa-undo\"></i> REVERSADO</center>";
        msjEntrega = "Se ha reversado correctamente la entrega del veh&#237;culo<br />" + msjDatosVeh;
    }
    else {
        estEntregaEnvia = "ENTREGADO";
        msjTitEntrega = "<center><i class=\"fa fa-play\"></i> ENTREGADO</center>";
        msjEntrega = "Se ha entregado correctamente el veh&#237;culo<br />" + msjDatosVeh;
    }

    var UrlEstInt = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/" + modoEI + ",json;" +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    localStorage.getItem("ls_usulog").toLocaleString() + ";" +
    numOT + ";" + estEntregaEnvia + ";";


    //var UrlEstInt = "http://localhost:4044/Services/TL/Taller.svc/tl06OrdenesGet/" + modoEI + ",json;" +
    //localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    //localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    //localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    //localStorage.getItem("ls_usulog").toLocaleString() + ";" +
    //numOT + ";" + estEntregaEnvia + ";";



    //   localStorage.getItem("ls_otei").toLocaleString() + ";";

    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlEstInt</center>", UrlEstInt);

    //if (localStorage.getItem("ls_otei") != undefined) {
    //    localStorage.removeItem("ls_otei");
    //}



    kendo.ui.progress($("#admOtScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************
        $.ajax({
            url: UrlEstInt,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    //  alert(data);
                    //  alert(inspeccionar(data));

                    if (inspeccionar(data).includes(":") == true) {
                        var arrResp = inspeccionar(data).split(":");

                        if (arrResp[1].includes("Succes") == true) {
                            window.myalert(msjTitEntrega, msjEntrega);
                            admConsultarOT();
                            return;
                        }
                        else {
                            kendo.ui.progress($("#admOtScreen"), false);

                            //var arrMsjEI = arrResp[1].split(",");
                            //var MsjEI = arrMsjEI[1] + ": " + arrResp[2];
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", MsjEI);

                            if (estEntrega == "PENDIENTE") {
                                var arrMsjEI = arrResp[1].split(",");
                                var MsjEI = arrMsjEI[1] + ": " + arrResp[2];
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", MsjEI);
                            }
                            else {
                                var MsjEntOk = arrResp[1].replace("0,0,", "");
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", MsjEntOk);
                            }
                            return;
                        }
                    }

                }
                catch (e) {
                    kendo.ui.progress($("#admOtScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admOtScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                return;
            }
        });

        //  kendo.ui.progress($("#admOtScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);



}
function cambiaMNCE(e){
    try {
        var dataMenuce = JSON.parse(localStorage.getItem("dataMNCE")); 
        switch(e){
            case arrMenuCerrado[0]: 
                if (dataMenuce.estado_interno.includes("CERRADO") == true) {
                    generarOrdenPDFAdmOT(dataMenuce.numero_orden);
                }else {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede reliquidar la OT: <b>" + dataMenuce.numero_orden + "</b><br />porque no esta <b>CERRADA</b></center>");
                }break;
            case arrMenuCerrado[1]: 
                if(e == arrMenuCerrado[1]){
                    if (dataMenuce.estado == "CERRADO") {
                        entregaVehiculo(dataMenuce.numero_orden, dataMenuce.estado_entrega, dataMenuce.chasis, dataMenuce.placa);
                    }
                }break;
            case arrMenuCerrado[2]: 
                break;
            case arrMenuCerrado[3]: 
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenuce.codigo_empresa + "," + dataMenuce.anio + "," + dataMenuce.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenuce.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenuce.codigo_empresa + ";" + dataMenuce.chasis + ";" + dataMenuce.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                kendo.mobile.application.navigate("components/reporte1/view.html");break;
            case arrMenuCerrado[4]: 
                 var fechaBase = moment(dataMenuce.fecha_entrega);
                 var fechaActual = moment();
                 var totalDias = Number(fechaActual.diff(fechaBase,"days"));
                
                if (dataMenuce.estado_entrega == "ENTREGADO" && totalDias > 3) {  //"ENTREGADO"
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "AUTO YA FUE ENTREGADO HACE: "+ totalDias + " DIAS "); 
                } else {            
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenuce.codigo_empresa + "," + dataMenuce.anio + "," + dataMenuce.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenuce.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenuce.codigo_empresa + ";" + dataMenuce.chasis + ";" + dataMenuce.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                localStorage.setItem("dataItem", JSON.stringify(dataMenuce));
                localStorage.setItem("banderaE", false);
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(dataMenuce)); 
                kendo.mobile.application.navigate("components/reporteClienteAprobado/view.html");
                }
                break;
            case arrMenuCerrado[5]:
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenuce.codigo_empresa + "," + dataMenuce.anio + "," + dataMenuce.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenuce.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenuce.codigo_empresa + ";" + dataMenuce.chasis + ";" + dataMenuce.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                localStorage.setItem("banderaE", true);
                localStorage.setItem("dataItem", JSON.stringify(dataMenuce));
                kendo.mobile.application.navigate("components/reporteClienteAprobado/view.html");
                break;
        }
        var dialogMN = $("#dialogMNCE").data("kendoDialog");
        dialogMN.close();
    }catch (error) {
        alert(error);
    }    
}
function nuevoMenuCerrado(dataItem){
    localStorage.setItem("dataMNCE", JSON.stringify(dataItem));
    
    //var htmlMenu = "<input id='numOTEI' name='numOTEI' type='hidden' value='" + dataItem.numero_orden + "'>";
    //MenuCerrado = ["RELIQUIDAR","ENTREGA","REVERSAR ENTREGA","VER DETALLE","CONTROL CALIDAD"];

    var htmlrbMenu = ""; //"<p><label class='w3-text-red'><b>Estado Interno</b></label></p><p><b>" + dataItem.estado_interno + "</b></p>";
    for(var i = 0; i < arrMenuCerrado.length; i++){
        if(arrMenuCerrado[i] == "RELIQUIDAR"){
            if(dataItem.estado == "CERRADO" ){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuCerrado[i] + "' onclick='cambiaMNCE(this.value);'> " + arrMenuCerrado[i] + "</p>";
            }
        }
        if(arrMenuCerrado[i] == "REVERSAR ENTREGA"){  
            if(dataItem.estado == "CERRADO"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuCerrado[i] + "' onclick='cambiaMNCE(this.value);'> " + arrMenuCerrado[i] + "</p>";
            }
        }        
        if(arrMenuCerrado[i] == "VER DETALLE OT"){  
            if(verBotonEstado(dataItem.estado, dataItem.estado_entrega)){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuCerrado[i] + "' onclick='cambiaMNCE(this.value);'> " + arrMenuCerrado[i] + "</p>";
            }
        }
        if(arrMenuCerrado[i] == "ENTREGAR VEHICULO"){  
            //if(dataItem.estado_calidad == "FINALIZADO" ){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuCerrado[i] + "' onclick='cambiaMNCE(this.value);'> " + arrMenuCerrado[i] + "</p>";
            //}
        }
        if(arrMenuCerrado[i] == "VER CONTROL CALIDAD"){  
            if(dataItem.estado=="CERRADO" && dataItem.estado_entrega=="ENTREGADO"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuCerrado[i] + "' onclick='cambiaMNCE(this.value);'> " + arrMenuCerrado[i] + "</p>";
            }
        }
    }
    var dialogMN = $("#dialogMNCE").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: "<center><i class=\"fa fa-play\"></i> MENU BOTONES</center>",
        closable: false,
        modal: false,
        content: htmlrbMenu,
        actions: [
            //{ text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ELEGIR&nbsp;&nbsp;</button></font>', action: accCambioMN },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
    });
    dialogMN.data("kendoDialog").open();
    llamarColorBotonGeneral(".w3-red");
}
function cambiaMN(e){
    try {
        var dataMenu = JSON.parse(localStorage.getItem("dataMN")); 
        switch(e){
            case arrMenuAbierto[0]: 
                if (dataMenu.estado_interno.includes("CALIDAD") == true) {
                    var modoEnviaOT = "9";
                    admCierraOT(modoEnviaOT, dataMenu);
                }
                else {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede liquidar la OT: <b>" + dataMenu.numero_orden + "</b><br />porque no esta en <b>CONTROL DE CALIDAD</b></center>");
                }break;
            case arrMenuAbierto[1]: 
                if(e == arrMenuAbierto[1]){
                    if (dataMenu.estado == "ABIERTO") {
                        cambiaEstInt(dataMenu.numero_orden, dataMenu.seccion_orden_trabajo, dataMenu.estado_interno);
                    }
                    else {
                        entregaVehiculo(dataMenu.numero_orden, dataMenu.estado_entrega, dataMenu.chasis, dataMenu.placa);
                    }
                }
                break;
            case arrMenuAbierto[2]: 
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenu.codigo_empresa + "," + dataMenu.anio + "," + dataMenu.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenu.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenu.codigo_empresa + ";" + dataMenu.chasis + ";" + dataMenu.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                kendo.mobile.application.navigate("components/reporte1/view.html");break;
            case arrMenuAbierto[3]: 
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenu.codigo_empresa + "," + dataMenu.anio + "," + dataMenu.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenu.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenu.codigo_empresa + ";" + dataMenu.chasis + ";" + dataMenu.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                localStorage.setItem("banderaE", true);
                localStorage.setItem("dataItem", JSON.stringify(dataMenu));
                kendo.mobile.application.navigate("components/reporteClienteAprobado/view.html");break;
            case arrMenuAbierto[4]: 
                var urlDot = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" + dataMenu.codigo_empresa + "," + dataMenu.anio + "," + dataMenu.secuencia_orden + ",," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," + localStorage.getItem("ls_usagencia").toLocaleString() + "|" + dataMenu.numero_orden;
                var urlSMS = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + dataMenu.codigo_empresa + ";" + dataMenu.chasis + ";" + dataMenu.estado + ";;TALLER;DIAGNOSTICO";
                urlDot = urlDot + "|" + urlSMS + "|" + document.getElementById("dpInicioOT").value + "|" + document.getElementById("dpFinOT").value + "|" + document.getElementById('otEstado2').value + "|" + document.getElementById('numProf').value;
                localStorage.setItem("ls_otdet2", urlDot);
                localStorage.setItem("dataItem", JSON.stringify(dataMenu));
                kendo.mobile.application.navigate("components/reporteEncuestaClientes/view.html");break;
        }
        var dialogMN = $("#dialogMN").data("kendoDialog");
        dialogMN.close();
    }catch (error) {
        alert("opcion"+error);
    }    
}
function nuevoMenu(dataItem){
    localStorage.setItem("dataMN", JSON.stringify(dataItem));
    
    //var htmlMenu = "<input id='numOTEI' name='numOTEI' type='hidden' value='" + dataItem.numero_orden + "'>";
    var htmlrbMenu = ""; //"<p><label class='w3-text-red'><b>Estado Interno</b></label></p><p><b>" + dataItem.estado_interno + "</b></p>";
    for(var i = 0; i < arrMenuAbierto.length; i++){
        if(arrMenuAbierto[i] == "LIQUIDAR"){
            if(dataItem.estado == "ABIERTO" ){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'> " + arrMenuAbierto[i] + "</p>";
            }
        }
        if(arrMenuAbierto[i] == "VER DETALLE OT"){  
            if(dataItem.estado == "ABIERTO"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'> " + arrMenuAbierto[i] + "</p>";
            }
        }        
        if(arrMenuAbierto[i] == "CAMBIO ESTADO INT."){  
            if(verBotonEstado(dataItem.estado, dataItem.estado_entrega)){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'> " + arrMenuAbierto[i] + "</p>";
            }
        }
        if(arrMenuAbierto[i] == "VER CONTROL CALIDAD"){  
            if(dataItem.estado_calidad == "FINALIZADO" ){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'> " + arrMenuAbierto[i] + "</p>";
            }
        }
        /* if(arrMenuAbierto[i] == "VER CONTROL CALIDAD"){  
            if(dataItem.estado == "CERRADO"){
                htmlrbMenu += "<p><input type='radio' name='rbgEI' value='" + arrMenuAbierto[i] + "' onclick='cambiaMN(this.value);'> " + arrMenuAbierto[i] + "</p>";
            }
        } */
    }
    var dialogMN = $("#dialogMN").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: "<center><i class=\"fa fa-play\"></i> MENU BOTONES</center>",
        closable: false,
        modal: false,
        content: htmlrbMenu,
        actions: [
            //{ text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ELEGIR&nbsp;&nbsp;</button></font>', action: accCambioMN },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
    });
    dialogMN.data("kendoDialog").open();
    llamarColorBotonGeneral(".w3-red");
}
/* function accCambioMN(){
    //alert(inspeccionar(e));
    //cambiaEstInt(numOT, seccionOT, actualEI);

} */
/*--------------------------------------------------------------------
Fecha: 07/08/2018
Descripcion: Cambio Estado Interno
Parametros: Id OT / Seccion OT / Est.Int. Actual
--------------------------------------------------------------------*/
function cambiaEstInt(numOT, seccionOT, actualEI) {
    cierraControlGralEI();
    // Colision
    var arrEstInt = ["ENDEREZADO", "PINTURA", "ARMADO", "PARALIZADO", "ALISTAMIENTO", "MECANICA_ELECTRICIDAD", "LAVADO", "CONTROL CALIDAD"];

    if (seccionOT == "MECANICA") {
        // Mecanica
        arrEstInt = ["TRABAJANDO", "PARALIZADO", "LAVADO", "CONTROL CALIDAD"];
    }

    var htmlEstInt = "<input id='numOTEI' name='numOTEI' type='hidden' value='" + numOT + "'>";

    var htmlrbEI = "<p><label class='w3-text-red'><b>Estado Interno</b></label></p><p><b>" + actualEI + "</b></p>";

    var causa = "";

    for (var i = 0; i < arrEstInt.length; i++) {
        htmlrbEI += "<p><input type='radio' name='rbgEI' value='" + arrEstInt[i] + "' onclick='cambiaEI(this.value);'> " + arrEstInt[i] + "</p>";

        //if (arrEstInt[i] == "PARALIZADO") {
        //    htmlrbEI += "<p><div id='divcbocausa'></div></p>";
        //}


        if (actualEI == arrEstInt[i]) {
            htmlrbEI = "<p><label class='w3-text-red'><b>Estado Interno</b></label></p><p><b>" + actualEI + "</b></p>";

            // Paralizado
            if (actualEI == "PARALIZADO") {
                htmlrbEI += "<p><input type='radio' name='rbgEI' value='TRABAJANDO' onclick='cambiaEI(this.value);'> TRABAJANDO</p>";
            }
        }


        if (i == arrEstInt.length - 1) {
            htmlrbEI += "<p><div id='divcbocausa'></div></p>";
        }


    }

    htmlEstInt += htmlrbEI;

    dialogEI = $("#dialogEI").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: "<center><i class=\"fa fa-play\"></i> CAMBIO ESTADO INTERNO</center>",
        closable: false,
        modal: false,
        content: htmlEstInt,
        actions: [
            { text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;GUARDAR&nbsp;&nbsp;</button></font>', action: accCambioEI },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
    });
    dialogEI.data("kendoDialog").open();
    llamarColorBotonGeneral(".w3-red");
    llamarColorTexto(".w3-text-red");
}

/*--------------------------------------------------------------------
Fecha: 07/08/2018
Descripcion: Guarda el EI seleccionado en una variable de ses.
Parametros: Est.Int. seleccionado
--------------------------------------------------------------------*/
function cambiaEI(valorEI) {

    if (valorEI == "PARALIZADO") {
        cboParalizadoEstados("");
    }
    else {
        document.getElementById("divcbocausa").innerHTML = ""; // "<input id='tipo_causa_ei' type='hidden' value='' />";
    }

    if (localStorage.getItem("ls_otei") != undefined) {
        localStorage.removeItem("ls_otei");
    }

    localStorage.setItem("ls_otei", valorEI);
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


/*--------------------------------------------------------------------
Fecha: 07/09/2018
Descripcion: Si es PARALIZADO presenta el combo de Causa
Parametros: 
--------------------------------------------------------------------*/
function cboParalizadoEstados(selcausa) {
    var cbocausaHTML = "<p><label id='lblcausa' class='w3-text-red'><b>Causa</b></label><select id='tipo_causa_ei' class='w3-input w3-border textos'>";
    cbocausaHTML += "<option  value=' '>Ninguno</option>";
    cbocausaHTML += "</select></p>";

    //http://186.71.68.154:8089/test/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;CAUSAL_PARAR_TRABAJO;;;;;;

    var UrlCbocausas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;CAUSAL_PARAR_TRABAJO;;;;;;";

    var cbocausaResp = "";

    $.ajax({
        url: UrlCbocausas,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cbocausaResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo causa");
                return;
            }
        },
        error: function (err) {
            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo causa");
            return;
        }
    });

    if (cbocausaResp.length > 0) {
        cbocausaHTML = "<p><label id='lblcausa' class='w3-text-red'><b>Causa</b></label><select id='tipo_causa_ei'  class='w3-input w3-border textos'>";

        for (var i = 0; i < cbocausaResp.length; i++) {

            if (cbocausaResp[i].CodigoClase != " " || cbocausaResp[i].CodigoClase != "ninguna") {
                if (selcausa == cbocausaResp[i].CodigoClase) {
                    cbocausaHTML += "<option  value='" + cbocausaResp[i].CodigoClase + "' selected>" + cbocausaResp[i].NombreClase + "</option>";
                }
                else {
                    cbocausaHTML += "<option  value='" + cbocausaResp[i].CodigoClase + "'>" + cbocausaResp[i].NombreClase + "</option>";
                }
            }
        }

        cbocausaHTML += "</select></p>";
    }
    else {
        cbocausaHTML = "<p><label id='lblcausa' class='w3-text-red'><b>Tipo causa</b></label><select id='tipo_causa_ei' class='w3-input w3-border textos'>";
        cbocausaHTML += "<option  value=' '>Ninguno</option>";
        cbocausaHTML += "</select></p>";
    }

    document.getElementById("divcbocausa").innerHTML = cbocausaHTML;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


/*--------------------------------------------------------------------
Fecha: 07/08/2018
Descripcion: Destruye el dialog
--------------------------------------------------------------------*/
function cierraControlGralEI() {
    // OT - Mail Rec
    try {
        var dialogEI2 = $("#dialogEI").data("kendoDialog");
        dialogEI2.close();
    }
    catch (ed2) {
    }


    // OT - Entrega Veh.
    try {
        var dialogEntVeh = $("#dialogEntVeh").data("kendoDialog");
        dialogEntVeh.close();
    }
    catch (en1) {
    }
}

/*--------------------------------------------------------------------
Fecha: 07/08/2018
Descripcion: Realiza el cambio de EI
--------------------------------------------------------------------*/
function accCambioEI() {
    var modoEI = "13";
    var numOT = document.getElementById("numOTEI").value;

    var UrlEstInt = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/" + modoEI + ",json;" +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    localStorage.getItem("ls_usulog").toLocaleString() + ";" +
    numOT + ";" +
    localStorage.getItem("ls_otei").toLocaleString() + ";";


    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // 2018-09-07
    // Si es PARALIZADO envia la causa
    if (localStorage.getItem("ls_otei").toLocaleString() == "PARALIZADO") {
        UrlEstInt = UrlEstInt + document.getElementById("tipo_causa_ei").value;
    }
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    //    var UrlEstInt =  "http://localhost:4044/Services/TL/Taller.svc/tl06OrdenesGet/" + modoEI + ",json;" +
    //localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    //localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    //localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    //localStorage.getItem("ls_usulog").toLocaleString() + ";" +
    //numOT + ";" +
    //localStorage.getItem("ls_otei").toLocaleString() + ";";

   //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlEstInt</center>", UrlEstInt);

    if (localStorage.getItem("ls_otei") != undefined) {
        localStorage.removeItem("ls_otei");
    }

    kendo.ui.progress($("#admOtScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************
        $.ajax({
            url: UrlEstInt,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    // alert(data);
                    //alert(inspeccionar(data));
                    if (inspeccionar(data).includes(":") == true) {
                        var arrResp = inspeccionar(data).split(":");

                        if (arrResp[1].includes("Succes") == true) {
                            window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> MODIFICADO</center>", "El Estado Interno ha sido<br/>modificado correctamente");
                            admConsultarOT();
                            return;
                        }
                        else {
                            kendo.ui.progress($("#admOtScreen"), false);
                            var arrMsjEI = arrResp[1].split(",");
                            var MsjEI = arrMsjEI[1] + ": " + arrResp[2];
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", MsjEI);
                            return;
                        }
                    }
                }
                catch (e) {
                    kendo.ui.progress($("#admOtScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admOtScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                return;
            }
        });

        //  kendo.ui.progress($("#admOtScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}

function fondoEstOT(estOt) {

    // http://200.31.10.92:8092/appk_aekia/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;KNAB2512AJT110039;
    var color = "";

    for (var i = 0; i <= arrColorOT.length; i++) {
        if (arrEstOT[i] == estOt.trim()) {
            color = arrColorOT[i];
            break;
        }
    }
    return color;
}

function tablaEstadoColor() {
    var tec = "<p><label class='w3-text-red'><b>Estado Interno</b></label></p>";
    for (var i = 0; i < arrColorOT.length; i++) {
        if (i == 0) {
            tec += "<table style='padding:5px; border:solid 1px;'><tr>";
        }

        if (arrColorOT[i] == "#5151FF") {
            tec += "<td style=\"border:solid 1px; background-color:" + arrColorOT[i] + "\"><p><label style='font-family:Arial; font-size:11px; color:#FFFFFF'>" + arrEstOT[i] + "</label></p></td>";
        }
        else {
            tec += "<td style=\"border:solid 1px; background-color:" + arrColorOT[i] + "\"><p><label style='font-family:Arial; font-size:11px'>" + arrEstOT[i] + "</label></p></td>";
        }

        //   tec += "<td style=\"border:solid 1px; background-color:" + arrColorOT[i] + "\"><p><label style='font-family:Arial; font-size:11px'>" + arrEstOT[i] + "</label></p></td>";

        if (i == 3) {
            tec += "</tr><tr>";
        }

        if (i == arrColorOT.length - 1) {
            tec += "</tr></table><br/>";
        }
    }
    return tec;
}

function cboEstadosOT(estOt) {
    var selecOtEst = "";
    var colorCombo = "#FFFFFF";
    for (var i = 0; i < arrColorOT.length; i++) {
        if (arrEstOT[i] == estOt.trim()) {
            colorCombo = arrColorOT[i];
            //  selecOtEst += "<option value=\"" + arrEstOT[i] + "\" selected>" + arrEstOT[i] + "</option>";
            selecOtEst = "<p><label><b>" + arrEstOT[i] + "</b></label></p>";
            //  selecOtEst = "<input id='otAdmEst' type='text' class='w3-input w3-border textos' style='background:" + arrColorOT[i] + "' value='" + arrEstOT[i] + "' readonly/>";
        }
        //else {
        //    selecOtEst += "<option value=\"" + arrEstOT[i] + "\">" + arrEstOT[i] + "</option>";
        //}
    }

    //  selecOtEst = "<select id=\"cboEstOt\" onchange=\"cambiaEstadoOT(this.value);\" style=\"background-color:" + colorCombo + "\" class=\"w3-input w3-border textos\" style=\"max-width:100px\">" + selecOtEst + "</select>";
    return selecOtEst;
}


function clienteVIP(ot, txtVip) {
    if (txtVip.trim() != "") 
    {
        ot = ot + " <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i>";
    }

    return ot;
}



function cambiaEstadoOT(estado) {
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> estado</center>", estado);
}

function grabarRespuesta(resp,numOT,modoOT) {
    try {
    // http://192.168.1.3:8077/taller/Services/TL/Taller.svc/tl06OrdenesGet/9,json;1;01;01;;;jmera;;;201800010;

    var UrlCierre = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/" + modoOT + ",json;" +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    localStorage.getItem("ls_usagencia").toLocaleString() + ";;;" +
    localStorage.getItem("ls_usulog").toLocaleString() + ";;;" + numOT + ";;;;;;;;;;;;"+resp; 

// window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> UrlCierre</center>", UrlCierre);
kendo.ui.progress($("#admOtScreen"), true);
setTimeout(function () {
    // precarga *********************************************************************************************
    $.ajax({
        url: UrlCierre,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                if (inspeccionar(data).includes("Succes") == true) {
                    window.myalert(msjRespuestaOT[0], msjRespuestaOT[1]);
                    admConsultarOT();
                    
                    // RRP: 2018-08-20 
                    if (modoOT != "10") {
                        generarOrdenPDFAdmOT(numOT);
                    }
                    
                }
                else {
                    kendo.ui.progress($("#admOtScreen"), false);
                    if (inspeccionar(data).includes(",") == true) {
                        var arrResp = inspeccionar(data).split(",");
                        //alert(inspeccionar(arrResp));

                        if (arrResp[0] == "0") {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 0ERROR</center>", arrResp[1] + arrResp[2]);
                        }
                        else {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 1ERROR</center>", arrResp[1]);
                        }
                    }
                    return;
                }
            }
            catch (e) {
                   alert(inspeccionar(e));
                kendo.ui.progress($("#admOtScreen"), false);
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                return;
            }
        },
        error: function (err) {
             alert(inspeccionar(err));
            kendo.ui.progress($("#admOtScreen"), false);
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
            return;
        }
    });

    kendo.ui.progress($("#admOtScreen"), false);
    // precarga *********************************************************************************************
}, 2000);
} catch (error) {
    alert(error);    
}
}
function admCierraOT(modoOT, dataMenu) {
    var msjPreguntaOT = "<center><h1><i class=\"fa fa-unlock-alt\"></i> LIQUIDAR</h1><br />Desea Liquidar la Orden de Trabajo<br /><b>" + dataMenu.numero_orden + "</b></center>";
    var msjRespuestaOT = ["<center><i class=\"fa fa-check-circle-o\"></i> LIQUIDADO</center>", "<center>La Orden de Trabajo <b>" + dataMenu.numero_orden + "</b></br>fue Liquidada correctamente</center>"];
    var msjPreguntaEnc = "<center><h1><i class=\"fa fa-unlock-alt\"></i> ENCUESTA INSITU</h1><br />La encuesta Insitu se realizará con los siguientes datos:<br /><b>Nombre: " + dataMenu.nombre_cliente_csi + "</b><br /><b>Teléfono Móvil: " + dataMenu.telefono_movil_csi + "</b><br /><b>Teléfono Fijo: " + dataMenu.telefono_fijo_csi + "</b><br /></center>";
    if (modoOT == "10") {
        msjPreguntaOT = "<center><h1><i class=\"fa fa-unlock\"></i> REVERSAR</h1><br />Desea Reversar la Orden de Trabajo<br /><b>" + dataMenu.numero_orden + "</b></center>";
        msjRespuestaOT = ["<center><i class=\"fa fa-check-circle-o\"></i> REVERSADO</center>", "<center>La Orden de Trabajo <b>" + dataMenu.numero_orden + "</b></br>fue Reversada correctamente</center>"];
    }

    // var numOT = document.getElementById('numOT_2').value;
    kendo.confirm(msjPreguntaOT)
          .done(function () {
            var conInSitu = consultaEncuestaINS();
            var conMP = consultaMP();
                if (conInSitu == "SI") {
                    if (conMP.includes(dataMenu.tipo_trabajo)) {
                        kendo.confirm(msjPreguntaEnc)
                        .done(function(){grabarRespuesta("SI",dataMenu.numero_orden,modoOT);})
                        .fail(function () { });
                        llamarColorBotonGeneral(".k-primary");
                    } else {
                        grabarRespuesta("NO",dataMenu.numero_orden,modoOT);
                    }
                    
                } else {
                    grabarRespuesta("NO_APLICA",dataMenu.numero_orden,modoOT);
                }
            
          })
          .fail(function () {
              kendo.ui.progress($("#admOtScreen"), false);
          });
          llamarColorBotonGeneral(".k-primary");
}


function vistaParametros() {
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("tablaOT2").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                                                        "    <tr>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                </p><p>" +
                                                        "                <input id='dpInicioOT' value='01-01-1900' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "            </p><p>" +
                                                        "                <input id='dpFinOT' value='01-10-2017' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +

                                                        "<td>" +
                                                        "<p>" +
                                                        "<label class='w3-text-red'><b>N&#186; Asesor</b></label>" +
                                                        "</p>" +
                                                        "<p><input name='numProf' type='number' id='numProf' class='w3-input w3-border textos' style='max-width:100px' value='" + localStorage.getItem("ls_usunumero").toLocaleString() + "'></p>" +
                                                         "</td>" +


                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Estado</b></label>" +
                                                        "            </p><p>" +
                                                        "                <select name='otEstado2' id='otEstado2' class='w3-input w3-border textos' onchange='buscaxEstado();'>" +
                                                        "                    <option value='ABIERTO'>ABIERTO</option>" +
                                                        "                    <option value='CERRADO'>CERRADO</option>" +
                                                        "                </select>" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "        <td valign='bottom'>" +
                                                        "            <p>" +
                                                        "                <button id='btnBuscar0' onclick='admConsultarOT();' class='w3-btn'><i id='icnBuscar0' class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
                                                                "&nbsp;&nbsp;<button id='btnBuscar1' class='w3-btn'><a id='mostrar3' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
                                                        "<a id='ocultar3' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
                                                      "            </p>" +
                                                        "        </td>" +
                                                        "    </tr>" +

                                                        // "<tr><td colspan='4'>" +
                                                        //"<p>" +
                                                        //"<label class='w3-text-red'><b>N&#250;mero Asesor</b></label>" +
                                                        //"</p>" +
                                                        //"<p><input name='numProf' type='number' id='numProf' class='w3-input w3-border textos' style='max-width:150px' value='" + localStorage.getItem("ls_usunumero").toLocaleString() + "'></p>" +
                                                        // "</td></tr>" +

                                                        "<tr><td colspan='4' style='text-align:center'>" +
                                                        "<div id='divControlesOT' style='display:initial' class='target3'>" + // mas controles    
                                                        "<table width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
                                                        "    <tr>" +
                                                        "        <td>" +
                                                        //"            <p>" +
                                                        //"                <label class='w3-text-red'><b>Tipo</b></label>" +
                                                        //"            </p>"+
                                                        "<p>" +
                                                        "                <input name='otNum' type='text' id='otNum' class='w3-input w3-border textos' style='text-transform:uppercase;' placeholder='OT o Placa' onkeyup='javascript: this.value = this.value.toUpperCase();'>" +
                                                         "                <input name='otProp' type='hidden' id='otProp' class='w3-input w3-border textos'>" +
                                                        "                <input name='otPlaca' type='hidden' id='otPlaca' class='w3-input w3-border textos'>" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "    </tr>" +
                                                        "</table>" + tablaEstadoColor() +
                                                        "</div>" +
                                                        "</td></tr>" +
                                                        "</table>";
    }
    else {
        document.getElementById("tablaOT2").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "                <td>" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                        <input id='dpInicioOT' value='01-01-1900' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "                <td >" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                       <input id='dpFinOT' value='01-10-2017' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" +
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "                <td>" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Estado</b></label>" +
                                                        "                         </p></td><td><p>" +

                                                        "                        <select name='otEstado2' id='otEstado2' class='w3-input w3-border textos' onchange='buscaxEstado();'>" +
                                                        "                            <option value='ABIERTO' selected>ABIERTO</option>" +
                                                        "                            <option value='CERRADO'>CERRADO</option>" +
                                                        "                        </select>" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "                <td valign='bottom'>" +
                                                        "                    <p>" +
                                                        "                        <button onclick='admConsultarOT();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i> </button>" +
                                                                "&nbsp;&nbsp;<button class='w3-btn w3-red'><a id='mostrar3' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
                                                        "<a id='ocultar3' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +

                                                        "                    <input name='otProp' type='hidden' id='otProp' class='w3-input w3-border textos'></p>" +
                                                        "                </td>" +
                                                        "            </tr>      " +
                                                        "        </table>" +
                                                        "<div id='divControlesOT' style='display:initial' class='target3'>" + // mas controles    
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        //"                <td>" +
                                                        //"                    <p><label class='w3-text-red'><b>Tipo</b></label>" +
                                                        //"                         </p></td>" +
                                                        "<td>" +

                                                        "                       <p> <input name='otNum' type='text' id='otNum' class='w3-input w3-border textos' style='text-transform:uppercase;' placeholder='OT o Placa' onkeyup='javascript: this.value = this.value.toUpperCase();'>" +
                                                        "                               <input name='otPlaca' type='hidden' id='otPlaca' class='w3-input w3-border textos' style='max-width:100px; text-transform:uppercase;' onkeyup='javascript: this.value = this.value.toUpperCase();' placeholder='Placa'>" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" + tablaEstadoColor() +
                                                        "</div>";
    }

llamarNuevoestilo("btnBuscar");
llamarNuevoestiloIconB("icnBuscar");
llamarColorTexto(".w3-text-red");

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
            document.getElementById("dpInicioOT").value = begin.format('DD-MM-YYYY');
            break;
        }
        //  alert(begin.format('DD-MM-YYYY'));
        begin.add('d', 1);
    }

    $("#dpInicioOT").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    document.getElementById("dpFinOT").value = dd + '-' + mm + '-' + yyyy;

    $("#dpFinOT").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target3').hide("fast");

    $(document).ready(function () {
        $("#mostrar3").click(function () {
            $('#target3').show(1000);
            $('.target3').show("fast");
            $('.mostrar3').hide("fast");
            document.getElementById("mostrar3").style.display = 'none';
            document.getElementById("ocultar3").style.display = 'initial';
            document.getElementById('otNum').value = "";
        });
        $("#ocultar3").click(function () {
            $('#target3').hide(1000);
            $('.target3').hide("fast");
            document.getElementById("mostrar3").style.display = 'initial';
            document.getElementById("ocultar3").style.display = 'none';
            document.getElementById('otNum').value = "";
        });
    });

    document.getElementById("tablaOTDetalle").style.display = "none";

    //    document.getElementById("btnFooterOT").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    //"<button onclick='vistaParametros();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";


    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnFooterOT").innerHTML = "<button id='btnpie0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnpie0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    "<button id='btnpie1' onclick='vistaParametros();' class='w3-btn'><i id='icnpie1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    }
    else {
        document.getElementById("btnFooterOT").innerHTML = "<button id='btnpie0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnpie0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button id='btnpie1' onclick='vistaParametros();' class='w3-btn'><i id='icnpie1' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestilo("btnpie");
    llamarNuevoestiloIconB("icnpie");
}


/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Crea archivo PDF en formato HTML y se guarda via FTP
Autor: RRP
--------------------------------------------------------------------*/
function admOtcreaPDF(codOT, htmlReporte) {

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



/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Preliquidacion formato HTML
Autor: RRP
--------------------------------------------------------------------*/
function admOtformatoRep01(codOT) {
    try {
        //  var codOT = document.getElementById('numOT').value;

        var Url = localStorage.getItem("ls_url2").toLocaleString() +
            "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() + ";;;;;;" + codOT + ";";

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

        var inforR1;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforR1 = (JSON.parse(data.tl06OrdenesGetResult)).ttl06[0];
                } catch (e) {

                    kendo.ui.progress($("#lector_barrasScreen"), false);
                    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso");
                    return;
                }
            },
            error: function (err) {

                kendo.ui.progress($("#lector_barrasScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso");
                return;
            }
        });

        var arrFRec = inforR1.fecha_recepcion.trim().split("-");
        var mesEsp = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

        var txtFLiq = "Fecha Liquidaci&#243;n: " + dd + " de " + mesEsp[mm] + " del " + yyyy + "&nbsp;&nbsp;" + hhmm;
        var txtFRec = "Fecha Recepci&#243;n: " + arrFRec[2] + " de " + mesEsp[(parseInt(arrFRec[1]))] + " del " + arrFRec[0] + "&nbsp;&nbsp;" + inforR1.hora_recepcion.slice(0, 5);
        var txtRegistro = "N/Reg: " + localStorage.getItem("ls_idempresa").toLocaleString() + "_" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
            localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
            inforR1.anio + "_" + codOT.replace((inforR1.anio + "0"), "") + "_" + codOT;

        // Cliente
        var pdfCliente = inforR1.nombre_cliente;

        if (pdfCliente.includes(",") == true);
        {
            pdfCliente = "";
            var arrPdfCli = inforR1.nombre_cliente.split(',');
            for (var p1 = 0; p1 < arrPdfCli.length; p1++) {
                pdfCliente += arrPdfCli[p1] + " ";
            }
        }
        pdfCliente = "Nombre: " + pdfCliente;

        var pdfClienteCI = "RUC/CI: " + inforR1.identifica_cliente;
        var pdfClienteDir = "Direcci&#243;n" + inforR1.calle_cliente + " " + inforR1.numero_calle + " " + inforR1.calle_interseccion;
        var pdfClienteTelf = "Tel&#233;fono:" + inforR1.telefono_cliente;

        // Vehiculo
        var pdfVehMarca = "Marca: " + inforR1.codigo_marca;
        var pdfVehModelo = "Modelo:" + inforR1.nombre_modelo;
        var pdfVehYYModelo = "A&#241;o: " + inforR1.anio_modelo;
        var pdfVehVin = "Chasis N&#186;: " + inforR1.chasis;
        var pdfVehMotor = "Motor N&#186;: " + inforR1.numero_motor
        var pdfVehPlaca = "Placa: " + inforR1.placa;
        var pdfVehColor = "Color: " + inforR1.color_vehiculo;
        var pdfVehKm = "Kilometraje: " + inforR1.kilometraje;
        var pdfVehGas = "Nivel Gasolina: " + inforR1.nivel_gasolina;
        var pdfVehSec = "Secci&#243;n: " + inforR1.seccion_orden_trabajo;
        var pdfVehTrab = "Tipo Trabajo: " + inforR1.nombre_tipo_trabajo;

        // Datos Empresa
        var info_Empresa = datosEmpresa(localStorage.getItem("ls_idempresa").toLocaleString());

        var htmlRep01 = "<table align='center' cellpadding='0' cellspacing='0' style='font-size:10px'> " +
        "<tr><td style='text-align: center'>" + info_Empresa.nombre_empresa + "</td></tr>" +
        "<tr><td style='text-align: center'>R.U.C.:&nbsp;" + info_Empresa.numero_ruc + "</td></tr>" +
        "<tr><td style='text-align: center'>Direcci&#243;n : &nbsp;" + info_Empresa.calle_numero + "</td></tr>" +
        "<tr><td style='text-align: center'>Tel&#233;fono:&nbsp;" + info_Empresa.telefono + "</td></tr>" +
        "<tr><td style='text-align: center'><h3>Preliquidaci&#243;n OT: " + codOT + "&nbsp;&nbsp;&nbsp;***&nbsp;&nbsp;&nbsp;" + inforR1.estado + "</h3></td></tr>" +
        "</table>" +
        "<table align='center' border='0' cellpadding='0' width='100%' style='font-size:8px'>" +
        "<tr><td>" + txtFRec + "</td><td style='text-align: right'>" + txtRegistro + "</td></tr>" +
        "<tr><td>" + txtFLiq + "</td><td>&nbsp;</td></tr></table>" +
        "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:8px'><tr><td>" +
        "<font style='font-size:10px'><b>CLIENTE</b></font>" +
        "</td></tr></table>" +
        "<table align='center' width='100%' border='1' cellpadding='0' cellspacing='0' style='font-size:8px'>" +
        "<tr>" +
        "<td>" + pdfCliente + "</td>" +
        "<td>" + pdfClienteCI + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfClienteDir + "</td>" +
        "<td>" + pdfClienteTelf + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Orden Trabajo: " + codOT + "</td>" +
        "<td>Asesor: " + inforR1.nombre_asesor + "</td>" +
        "</tr>" +
        "</table>" +
        "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:8px'><tr><td>" +
        "<font style='font-size:10px'><b>VEHICULO</b></font>" +
        "</td></tr></table>" +
        "<table align='center' width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:8px'>" +
        "<tr>" +
        "<td>" + pdfVehMarca + "</td>" +
        "<td>" + pdfVehModelo + "</td>" +
        "<td>" + pdfVehYYModelo + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehVin + "</td>" +
        "<td>" + pdfVehMotor + "</td>" +
        "<td>" + pdfVehPlaca + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehColor + "</td>" +
        "<td>" + pdfVehKm + "</td>" +
        "<td>" + pdfVehGas + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehSec + "</td>" +
        "<td colspan='2'>" + pdfVehTrab + "</td>" +
        "</table>";

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlDetalleFac);


        var valIva = facturaIVA();

        var UrlDetalleFac = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" +
          localStorage.getItem("ls_idempresa").toLocaleString() + "," +
          inforR1.anio + "," + inforR1.secuencia_orden + ",2" +
         "," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," +
          localStorage.getItem("ls_usagencia").toLocaleString();

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 01 htmlRep01 </center>", htmlRep01);
        //   return;

        var infordetFac;
        $.ajax({
            url: UrlDetalleFac,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (UrlDetalleFac.includes("tl07DetalleOTGet") == true) {
                        infordetFac = (JSON.parse(data.tl07DetalleOTGetResult)).DetalleOT;
                    }
                    else {
                        infordetFac = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
                    }

                } catch (e) {
                    kendo.ui.progress($("#lector_barrasScreen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                return;
            }
        });


        if (inspeccionar(infordetFac).length > 0) {

            var dsFactura = new kendo.data.DataSource({
                data: infordetFac,
                group: { field: "clase_registro" },

                //  group: [{ field: "clase_registro", dir: "asc" }, { field: "codigo_actividad", dir: "asc" }],

                sort: [{ field: "codigo_actividad", dir: "asc" }, { field: "partno_proveedor", dir: "asc" }]
            });

            dsFactura.fetch(function () {

                var view = dsFactura.view();
                var facSubtotalxTipo = 0;
                var facSubtotal = 0;

                var facBienes = 0, facServ = 0;

                // Cabecera
                htmlRep01 += "<table width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:8px'><tbody>" +
                 "<tr>" +
                 "<th scope='col' style='text-align:center' width='35%'>C&#243;digo</th>" +
                 "<th scope='col' style='text-align:center'>Descripci&#243;n</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>Unid</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>Cant</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>P.U.</th>" +
                 "<th scope='col' style='text-align:center' width='15%'>Valor Total</th>" +
                 "</tr>";

                for (var x = 0; x < view.length; x++) {

                    facSubtotalxTipo = 0;

                    // Clase
                    var facClase = view[x];

                    var titulo_subt = facClase.value.trim();

                    // Items
                    for (var y = 0; y < facClase.items.length; y++) {

                        if (y == 0) {

                            if (x == 0) {
                                htmlRep01 += "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td ><b>&nbsp;* " + facClase.items[y].responsable_factura + " *</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }

                            if (facClase.value.trim() == "MANO OBRA") {

                                titulo_subt = "SERVICIOS DE MANO DE OBRA";

                                htmlRep01 += "<tr>" +
                                "<td width = '35%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td   style='text-align: center'><b>" + titulo_subt + "</b></td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td ><b>&nbsp;*** " + facClase.items[y].tipo_actividad + "</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }
                            else {
                                htmlRep01 += "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td  style='text-align: center'><b>" + titulo_subt + "</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }
                        }

                        var codigoAct = facClase.items[y].codigo_actividad;

                        if (facClase.value == "REPUESTOS") {
                            codigoAct = facClase.items[y].partno_proveedor;
                        }

                        htmlRep01 += "<tr>" +
                        "<td width='35%'>&nbsp;" + codigoAct + "&nbsp;</td>" +
                        "<td>&nbsp;" + facClase.items[y].descripcion + "&nbsp;</td>" +
                        "<td width='10%'>" + facClase.items[y].unidad_medida + "&nbsp;</td>" +
                        "<td width='10%' style='text-align:right'>" + facClase.items[y].cantidad.toFixed(2) + "&nbsp;</td>" +
                        "<td width='10%' style='text-align:right'>" + facClase.items[y].precio_unitario.toFixed(2) + "&nbsp;</td>" +
                        "<td width='15%' style='text-align:right'>" + facClase.items[y].subtotal.toFixed(2) + "&nbsp;</td>" +
                        "</tr>";

                        facSubtotalxTipo += parseFloat(facClase.items[y].subtotal);
                        facSubtotal += parseFloat(facClase.items[y].subtotal);

                        if (facClase.value == "REPUESTOS") {
                            titulo_subt = facClase.items[y].responsable_factura;
                        }
                        else {
                            titulo_subt = facClase.items[y].tipo_actividad;
                        }

                        if (facClase.value == "MANO OBRA") {
                            facServ += parseFloat(facClase.items[y].subtotal);
                        }
                        else {
                            facBienes += parseFloat(facClase.items[y].subtotal);
                        }

                    }

                    htmlRep01 += "<tr>" +
                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td  style='text-align:right'><b>Subtotal " + facClase.value + ":&nbsp;</b></td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo.toFixed(2) + "&nbsp;</b></td>" +
                        "</tr>";

                    if (facClase.value != "INSUMOS") {

                        var facSubtotalxTipo_2 = facSubtotalxTipo.toFixed(2);

                        if (titulo_subt == "CLIENTE") {
                            facSubtotalxTipo_2 = facServ + facBienes;
                        }

                        htmlRep01 += "<tr>" +
                            "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td  style='text-align:right'><b>Subtotal " + titulo_subt + ":&nbsp;</b></td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo_2 + "&nbsp;</b></td>" +
                            "</tr>";
                    }

                    if (x == view.length - 1) {
                        htmlRep01 += "<tr>" +
                            "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td  style='text-align:right'>Bienes: " + facBienes.toFixed(2) + "&nbsp;&nbsp;Servicios:" + facServ.toFixed(2) + "&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "</tr>";
                    }
                }

                htmlRep01 += "</tbody></table>";

                var Sub_iva = (facSubtotal * parseFloat(valIva)) / 100;
                var Total = (facSubtotal + Sub_iva).toFixed(2);

                htmlRep01 += "<table width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:8px'><tbody><tr>" +
                "<td style='border-style: solid; border-color: inherit; border-width: 1px;text-align: center' colspan='5' rowspan='3'>" + NumToText(Total) + "&nbsp;</td>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>Subtotal:&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + facSubtotal.toFixed(2) + "&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>" + (valIva.toFixed(2) + "% IVA") + "&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + Sub_iva.toFixed(2) + "&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>Total:&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + Total + "&nbsp;</td>" +
                "</tr></tbody></table>";
            });
        }


        htmlRep01 += "<br/><table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:8px'><tr>" +
        "<td style='text-align:center;'>Asesor</td>" +
        "<td style='text-align:center;'>Cliente</td>" +
        "</tr></table>" +
        "<br/>" +
        "<table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:8px'><tr>" +
        "<td style='vertical-align:bottom;text-align:center;'>-----------------------------------------</td>" +
        "<td style='vertical-align:bottom;text-align:center;'>-----------------------------------------</td>" +
        "</tr></table>" +
        "<table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:8px'><tr>" +
        "<td style='text-align:center;'>Firma</td>" +
        "<td style='text-align:center;'>Firma</td>" +
        "</tr>" +
        "</table>";

        // Pie de pagina
        //   var f3 = new Date();
        var piePag = "<font style='font-size:5px'>Impreso: " + dd + " de " + mesEsp[mm] + " de " + yyyy + " " + hhmm + " " + localStorage.getItem("ls_usulog").toLocaleString() + " " + localStorage.getItem("ls_empresa").toLocaleString() + "</font>";
        htmlRep01 += "<div style='position: absolute; left: 10px; bottom: 0'>" + piePag + "</div>";


        //     window.myalert("<center><i class=\"fa fa-paper-plane\"></i> PDF</center>", htmlRep01);

        // TU FUNCION
        kendo.ui.progress($("#lector_barrasScreen"), false);

        return htmlRep01;
    }
    catch (e) {
        kendo.ui.progress($("#lector_barrasScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR PDF</center>", e);
        return "";
    }
}


function buscaxEstado() {
    //$('#target3').hide(1000);
    //$('.target3').hide("fast");
    //document.getElementById("mostrar3").style.display = 'initial';
    //document.getElementById("ocultar3").style.display = 'none';
    //document.getElementById('otNum').value = "";

    admConsultarOT();

}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Preliquidacion formato HTML
Autor: RRP
--------------------------------------------------------------------*/
function formatoRep01_admot(codOT) {
    try {
        //  var codOT = document.getElementById('numOT').value;

        var Url = localStorage.getItem("ls_url2").toLocaleString() +
            "/Services/TL/Taller.svc/tl06OrdenesGet/4,json;" +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() + ";;;;;;" + codOT + ";";

        var inforR1;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforR1 = (JSON.parse(data.tl06OrdenesGetResult)).ttl06[0];
                } catch (e) {

                    kendo.ui.progress($("#admOtScreen"), false);
                    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso");
                    return;
                }
            },
            error: function (err) {

                kendo.ui.progress($("#admOtScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso");
                return;
            }
        });


        var htmlDescOT_1 = "";
        var htmlDescOT_2 = "";
        var htmlDescOT_3 = "";

        var arrFRec = inforR1.fecha_recepcion.trim().split("-");
        var mesEsp = ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

        var txtFLiq = "Fecha Liquidaci&#243;n: " + dd + " de " + mesEsp[mm] + " del " + yyyy + "&nbsp;&nbsp;" + hhmm;
        var txtFRec = "Fecha Recepci&#243;n: " + arrFRec[2] + " de " + mesEsp[(parseInt(arrFRec[1]))] + " del " + arrFRec[0] + "&nbsp;&nbsp;" + inforR1.hora_recepcion.slice(0, 5);
        var txtRegistro = "N/Reg: " + localStorage.getItem("ls_idempresa").toLocaleString() + "_" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
            localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
            inforR1.anio + "_" + codOT.replace((inforR1.anio + "0"), "") + "_" + codOT;

        // Cliente
        var pdfCliente = inforR1.nombre_cliente;

        if (pdfCliente.includes(",") == true);
        {
            pdfCliente = "";
            var arrPdfCli = inforR1.nombre_cliente.split(',');
            for (var p1 = 0; p1 < arrPdfCli.length; p1++) {
                pdfCliente += arrPdfCli[p1] + " ";
            }
        }
        pdfCliente = "Nombre: " + pdfCliente + " (" + inforR1.persona_numero + ")";

        var pdfClienteCI = "RUC/CI: " + inforR1.identifica_cliente;
        var pdfClienteDir = "Direcci&#243;n: " + inforR1.calle_cliente + " " + inforR1.numero_calle + " " + inforR1.calle_interseccion;
        var pdfClienteTelf = "Tel&#233;fono: " + inforR1.telefono_cliente;

        // Cliente Fact
        var pdfClienteF = inforR1.persona_nombre_factura ;

        if (pdfClienteF.includes(",") == true);
        {
            pdfClienteF = "";
            var arrPdfCliF = inforR1.persona_nombre_factura.split(',');
            for (var p1 = 0; p1 < arrPdfCliF.length; p1++) {
                pdfClienteF += arrPdfCliF[p1] + " ";
            }
        }
        pdfClienteF = "Nombre: " + pdfClienteF + " (" + inforR1.persona_numero_factura + ")";

        var pdfClienteCIF = "RUC/CI: " + inforR1.identifica_factura;
        var pdfClienteDirF = "Direcci&#243;n: " + inforR1.calle_factura + " " + inforR1.numero_calle + " " + inforR1.calle_interseccion;
        var pdfClienteTelfF = "Tel&#233;fono: " + inforR1.telefono_factura;
        var pdfClienteemailF = "Email: " + inforR1.email_factura;

        // Aseguradora
        var htmlSeguros = "";
        if (inforR1.persona_numero_aseguradora != "0") {
            var pdfAseNombre = "Nombre: " + infoSeguroAdmOT(inforR1.persona_numero_aseguradora);
            var pdfAseRuc = "RUC: "; //***
            var pdfAsePoliza = "N� Poliza: " + inforR1.numero_poliza;
            var pdfAseSiniestro = "N� Siniestro: " + inforR1.numero_siniestro;
            var pdfAseTipo = "Tipo: " + inforR1.tipo_registro_aseguradora;
            var pdfAseCotiza = "Lista cotizaciones: "; // //***

            htmlSeguros = "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:6px'><tr><td>" +
            "<font style='font-size:8px'><b>ASEGURADORA</b></font>" +
            "</td></tr></table>" +
             "<table align='center' width='100%' border='1' cellpadding='2' cellspacing='0' style='font-size:6px'>" +
            "<tr>" +
            "<td width='70%'>" + pdfAseNombre + "</td>" +
            "<td width='30%'>" + pdfAseRuc + "</td>" +
            "</tr>" +
            "<tr>" +
            "</table>" +
            "<table align='center' width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:6px'>" +
            "<tr>" +
            "<td>" + pdfAsePoliza + "</td>" +
            "<td>" + pdfAseSiniestro + "</td>" +
            "<td>" + pdfAseTipo + "</td>" +
            "</tr>" +
            "</table>" +
            "<table align='center' width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:6px'>" +
            "<tr>" +
            "<td>" + pdfAseCotiza + "</td>" +
            "</tr>" +
            "</table>";
        }

        // Vehiculo
        var pdfVehMarca = "Marca: " + inforR1.codigo_marca;
        var pdfVehModelo = "Modelo:" + inforR1.nombre_modelo;
        var pdfVehYYModelo = "A&#241;o: " + inforR1.anio_modelo;
        var pdfVehVin = "Chasis N&#186;: " + inforR1.chasis;
        var pdfVehMotor = "Motor N&#186;: " + inforR1.numero_motor
        var pdfVehPlaca = "Placa: " + inforR1.placa;
        var pdfVehColor = "Color: " + inforR1.color_vehiculo;
        var pdfVehKm = "Kilometraje: " + inforR1.kilometraje;
        var pdfVehGas = "Nivel Gasolina: " + inforR1.nivel_gasolina;
        var pdfVehSec = "Secci&#243;n: " + inforR1.seccion_orden_trabajo;
        var pdfVehTrab = "Tipo Trabajo: " + inforR1.nombre_tipo_trabajo;

        // Datos Empresa
        var info_Empresa = datosEmpresa(localStorage.getItem("ls_idempresa").toLocaleString());

        var htmlRep01 = "<table align='center' border='0' cellpadding='0' cellspacing='0' style='font-size:8px'> " +
        "<tr><td style='text-align: center'>" + info_Empresa.nombre_empresa + "</td></tr>" +
        "<tr><td style='text-align: center'>R.U.C.:&nbsp;" + info_Empresa.numero_ruc + "</td></tr>" +
        "<tr><td style='text-align: center'>Direcci&#243;n : &nbsp;" + info_Empresa.calle_numero + "</td></tr>" +
        "<tr><td style='text-align: center'>Tel&#233;fono:&nbsp;" + info_Empresa.telefono + "</td></tr>" +
        "<tr><td style='text-align: center'><h5><b>Preliquidaci&#243;n OT: " + codOT + "&nbsp;&nbsp;&nbsp;***&nbsp;&nbsp;&nbsp;" + inforR1.estado + "</b></h5></td></tr>" +
        "</table>" +
        "<table align='center' border='0' cellpadding='0' width='100%' style='font-size:6px'>" +
        "<tr><td>" + txtFRec + "</td><td style='text-align: right'>" + txtRegistro + "</td></tr>" +
        "<tr><td>" + txtFLiq + "</td><td>&nbsp;</td></tr></table>";

        // Cliente
        htmlRep01 += "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:6px'><tr><td>" +
        "<font style='font-size:8px'><b>CLIENTE</b></font>" +
        "</td></tr></table>" +
        "<table align='center' width='100%' border='1' cellpadding='2' cellspacing='0' style='font-size:6px'>" +
        "<tr>" +
        "<td width='70%'>" + pdfCliente + "</td>" +
        "<td width='30%'>" + pdfClienteCI + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfClienteDir + "</td>" +
        "<td>" + pdfClienteTelf + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Orden Trabajo: " + codOT + "</td>" +
        "<td>Asesor: " + inforR1.nombre_asesor + "</td>" +
        "</tr>" +
        "</table>";

        // Cliente factura
        htmlRep01 += "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:6px'><tr><td>" +
        "<font style='font-size:8px'><b>CLIENTE FAC</b></font>" +
        "</td></tr></table>" +
        "<table align='center' width='100%' border='1' cellpadding='2' cellspacing='0' style='font-size:6px'>" +
        "<tr>" +
        "<td width='70%'>" + pdfClienteF + "</td>" +
        "<td width='30%'>" + pdfClienteCIF + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfClienteDirF + "</td>" +
        "<td>" + pdfClienteTelfF + "</td>" +
        "</tr>" +
        "<td>" + pdfClienteemailF + "</td>" +
        "<tr>" +
        "</tr>" +
        "</table>";

        // Aseguradora
        if (inforR1.persona_numero_aseguradora != "0") {
            htmlRep01 += htmlSeguros;
        }

        // Vehiculo
        htmlRep01 += "<table border='0'  cellpadding='3' cellspacing='0' style='font-size:6px'><tr><td>" +
        "<font style='font-size:8px'><b>VEHICULO</b></font>" +
        "</td></tr></table>" +
        "<table align='center' width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:6px'>" +
        "<tr>" +
        "<td>" + pdfVehMarca + "</td>" +
        "<td>" + pdfVehModelo + "</td>" +
        "<td>" + pdfVehYYModelo + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehVin + "</td>" +
        "<td>" + pdfVehMotor + "</td>" +
        "<td>" + pdfVehPlaca + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehColor + "</td>" +
        "<td>" + pdfVehKm + "</td>" +
        "<td>" + pdfVehGas + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + pdfVehSec + "</td>" +
        "<td colspan='2'>" + pdfVehTrab + "</td>" +
        "</table>";

        var valIva = facturaIVA();

        var UrlDetalleFac = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl07DetalleOTGet/" +
          localStorage.getItem("ls_idempresa").toLocaleString() + "," +
          inforR1.anio + "," + inforR1.secuencia_orden + ",2" +
         "," + localStorage.getItem("ls_ussucursal").toLocaleString() + "," +
          localStorage.getItem("ls_usagencia").toLocaleString();


        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlDetalleFac</center>", UrlDetalleFac);


        var infordetFac;
        $.ajax({
            url: UrlDetalleFac,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (UrlDetalleFac.includes("tl07DetalleOTGet") == true) {
                        infordetFac = (JSON.parse(data.tl07DetalleOTGetResult)).DetalleOT;
                    }
                    else {
                        infordetFac = (JSON.parse(data.DetalleOTGetResult)).DetalleOT01;
                    }

                } catch (e) {
                    kendo.ui.progress($("#admOtScreen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err02) {

                alert(err02);

                kendo.ui.progress($("#admOtScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err02);
                return;
            }
        });


        if (inspeccionar(infordetFac).length > 0) {

            var dsFactura = new kendo.data.DataSource({
                data: infordetFac,
                group: { field: "clase_registro" },

                //  group: [{ field: "clase_registro", dir: "asc" }, { field: "codigo_actividad", dir: "asc" }],

                sort: [{ field: "codigo_actividad", dir: "asc" }, { field: "partno_proveedor", dir: "asc" }]
            });

            dsFactura.fetch(function () {

                var view = dsFactura.view();
                var facSubtotalxTipo = 0;
                var facSubtotal = 0;

                var facBienes = 0, facServ = 0;

                // Cabecera
                htmlRep01 += "<table width='100%' border='1' cellpadding='2' cellspacing='0' style='font-size:6px'><tbody>" +
                 "<tr>" +
                 "<th scope='col' style='text-align:center' width='35%'>C&#243;digo</th>" +
                 "<th scope='col' style='text-align:center'>Descripci&#243;n</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>Unid</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>Cant</th>" +
                 "<th scope='col' style='text-align:center' width='10%'>P.U.</th>" +
                 "<th scope='col' style='text-align:center' width='15%'>Valor Total</th>" +
                 "</tr>";

                var tabla1 = "", tabla2 = "", tabla3 = "", tabla4 = "", tabla5 = "", tabla6 = "";

                for (var x = 0; x < view.length; x++) {



                    facSubtotalxTipo = 0;

                    // Clase
                    var facClase = view[x];

                    var titulo_subt = facClase.value.trim();

                    // Items
                    for (var y = 0; y < facClase.items.length; y++) {

                        if (y == 0) {

                            if (x == 0) {
                                htmlRep01 += "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td  style='border-left:solid 1px;'><b>&nbsp;* " + facClase.items[y].responsable_factura + " *</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }


                            /*
                            if (facClase.value.trim() == "MANO OBRA") {

                                titulo_subt = "SERVICIOS DE MANO DE OBRA";

                                htmlRep01 += "<tr>" +
                                "<td width = '35%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td   style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td  style='border-left:solid 1px;'><b>&nbsp;*** " + facClase.items[y].tipo_actividad + "</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }
                            else {
                                htmlRep01 += "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td  style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }
                            */

                            if (facClase.value.trim() == "MANO OBRA") {

                                titulo_subt = "SERVICIOS DE MANO DE OBRA";

                                htmlRep01 += "<tr>" +
                                "<td width = '35%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td   style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%'  style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>" +
                                "<tr>" +
                                "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td  style='border-left:solid 1px;'><b>&nbsp;*** " + facClase.items[y].tipo_actividad + "</b></td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                "</tr>";
                            }
                            else {

                                if (facClase.value.trim() == "INSUMOS") {

                                    htmlDescOT_1 += "<tr>" +
                                    "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                    "<td  style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                    "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                    "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                    "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                    "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                    "</tr>";
                                }
                                else {
                                    if (facClase.value.trim() == "REPUESTOS") {

                                        htmlDescOT_2 = "|";

                                        htmlRep01 += htmlDescOT_2 + "<tr>" +
                                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td  style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "</tr>";
                                    }
                                    else {


                                        htmlRep01 += "<tr>" +
                                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td  style='border-left:solid 1px;text-align: center'><b>" + titulo_subt + "</b></td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                                        "</tr>";
                                    }
                                }



                            }

                        }



                        var codigoAct = facClase.items[y].codigo_actividad;

                        if (facClase.value == "REPUESTOS") {
                            codigoAct = facClase.items[y].partno_proveedor;
                        }

                        /*
                        htmlRep01 += "<tr>" +
                        "<td width='35%'>&nbsp;" + codigoAct + "&nbsp;</td>" +
                        "<td style='border-left:solid 1px;'>&nbsp;" + facClase.items[y].descripcion + "&nbsp;</td>" +
                        "<td width='10%'>" + facClase.items[y].unidad_medida + "&nbsp;</td>" +
                        "<td width='10%' style='text-align:right'>" + facClase.items[y].cantidad.toFixed(2) + "&nbsp;</td>" +
                        "<td width='10%' style='text-align:right'>" + facClase.items[y].precio_unitario.toFixed(2) + "&nbsp;</td>" +
                        "<td width='15%' style='text-align:right'>" + facClase.items[y].subtotal.toFixed(2) + "&nbsp;</td>" +
                        "</tr>";
                        */

                        if (facClase.value == "INSUMOS") {
                            htmlDescOT_1 += "<tr>" +
                            "<td width='35%'>&nbsp;" + codigoAct + "&nbsp;</td>" +
                            "<td style='border-left:solid 1px;'>&nbsp;" + facClase.items[y].descripcion + "&nbsp;</td>" +
                            "<td width='10%'>" + facClase.items[y].unidad_medida + "&nbsp;</td>" +
                            "<td width='10%' style='text-align:right'>" + facClase.items[y].cantidad.toFixed(2) + "&nbsp;</td>" +
                            "<td width='10%' style='text-align:right'>" + facClase.items[y].precio_unitario.toFixed(2) + "&nbsp;</td>" +
                            "<td width='15%' style='text-align:right'>" + facClase.items[y].subtotal.toFixed(2) + "&nbsp;</td>" +
                            "</tr>";
                        }
                        else {
                            htmlRep01 += "<tr>" +
                            "<td width='35%'>&nbsp;" + codigoAct + "&nbsp;</td>" +
                            "<td style='border-left:solid 1px;'>&nbsp;" + facClase.items[y].descripcion + "&nbsp;</td>" +
                            "<td width='10%'>" + facClase.items[y].unidad_medida + "&nbsp;</td>" +
                            "<td width='10%' style='text-align:right'>" + facClase.items[y].cantidad.toFixed(2) + "&nbsp;</td>" +
                            "<td width='10%' style='text-align:right'>" + facClase.items[y].precio_unitario.toFixed(2) + "&nbsp;</td>" +
                            "<td width='15%' style='text-align:right'>" + facClase.items[y].subtotal.toFixed(2) + "&nbsp;</td>" +
                            "</tr>";
                        }






                        facSubtotalxTipo += parseFloat(facClase.items[y].subtotal);
                        facSubtotal += parseFloat(facClase.items[y].subtotal);

                        if (facClase.value == "REPUESTOS") {
                            titulo_subt = facClase.items[y].responsable_factura;
                        }
                        else {
                            titulo_subt = facClase.items[y].tipo_actividad;
                        }

                        if (facClase.value == "MANO OBRA") {
                            facServ += parseFloat(facClase.items[y].subtotal);
                        }
                        else {
                            facBienes += parseFloat(facClase.items[y].subtotal);
                        }
                    }

                    /*
                    htmlRep01 += "<tr>" +
                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td style='border-left:solid 1px;text-align:right'><b>Subtotal " + facClase.value + ":&nbsp;</b></td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo.toFixed(2) + "&nbsp;</b></td>" +
                        "</tr>";
                        */

                    if (facClase.value == "INSUMOS") {
                        htmlDescOT_1 += "<tr>" +
                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td style='border-left:solid 1px;text-align:right'><b>Subtotal " + facClase.value + ":&nbsp;</b></td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo.toFixed(2) + "&nbsp;</b></td>" +
                        "</tr>";
                    }
                    else {
                        htmlRep01 += "<tr>" +
                        "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td style='border-left:solid 1px;text-align:right'><b>Subtotal " + facClase.value + ":&nbsp;</b></td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                        "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo.toFixed(2) + "&nbsp;</b></td>" +
                        "</tr>";
                    }




                    if (facClase.value != "INSUMOS") {

                        var facSubtotalxTipo_2 = facSubtotalxTipo.toFixed(2);

                        if (titulo_subt == "CLIENTE") {
                            facSubtotalxTipo_2 = facServ + facBienes;
                        }

                        htmlRep01 += "<tr>" +
                            "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td  style='border-left:solid 1px;text-align:right'><b>Subtotal " + titulo_subt + ":&nbsp;</b></td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '15%' style='border-left:solid 1px;text-align:right'><b>" + facSubtotalxTipo_2 + "&nbsp;</b></td>" +
                            "</tr>";
                    }



                    if (x == view.length - 1) {
                        htmlRep01 += "<tr>" +
                            "<td width = '35%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td  style='border-left:solid 1px;text-align:right'>Bienes: " + facBienes.toFixed(2) + "&nbsp;&nbsp;Servicios:" + facServ.toFixed(2) + "&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '10%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "<td width = '15%' style='border-left:solid 1px'>&nbsp;</td>" +
                            "</tr>";
                    }
                }



                htmlRep01 += "</tbody></table>";

                var Sub_iva = (facSubtotal * parseFloat(valIva)) / 100;
                var Total = (facSubtotal + Sub_iva).toFixed(2);

                htmlRep01 += "<table width='100%' border='1'  cellpadding='2' cellspacing='0' style='font-size:6px'><tbody><tr>" +
                "<td style='border-style: solid; border-color: inherit; border-width: 1px;text-align: center' colspan='5' rowspan='3'>SON: " + NumToText_admOT(Total) + "&nbsp;</td>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>Subtotal:&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + facSubtotal.toFixed(2) + "&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>" + (valIva.toFixed(2) + "% IVA") + "&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + Sub_iva.toFixed(2) + "&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td width = '10%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align: right'>Total:&nbsp;</td>" +
                "<td width = '15%' style='border-style: solid; border-color: inherit; border-width: 1px;text-align:right'>" + Total + "&nbsp;</td>" +
                "</tr></tbody></table>";


                // Observaciones
                var observacion = inforR1.observacion;
                if (observacion.trim() != "") {
                    htmlRep01 += "<table align='center' width='100%' border='0'  cellpadding='2' cellspacing='0' style='font-size:6px'>" +
                    "<tr><td>&nbsp;</td></tr>" +
                    "<tr><td>&nbsp;</td></tr>" +
                    "<tr><td><font style='font-size:8px'><b>OBSERVACIONES</b></font></td></tr>" +
                    "<tr><td>" + observacion + "</td></tr>" +
                    "</table>";
                }
            });
        }

        htmlRep01 += "<br/><table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:6px'><tr>" +
        "<td style='text-align:center;'>Asesor</td>" +
        "<td style='text-align:center;'>Cliente</td>" +
        "</tr></table>" +
        "<br/>" +
        "<table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:6px'><tr>" +
        "<td style='vertical-align:bottom;text-align:center;'>-----------------------------------------</td>" +
        "<td style='vertical-align:bottom;text-align:center;'>-----------------------------------------</td>" +
        "</tr></table>" +
        "<table align='center' border='0'  width='100%' cellpadding='0' cellspacing='0' style='font-size:6px'><tr>" +
        "<td style='text-align:center;'>Firma</td>" +
        "<td style='text-align:center;'>Firma</td>" +
        "</tr>" +
        "</table>";

        //       htmlRep01 += "<table width='100%' border='1'  cellpadding='0' cellspacing='10' style='font-size:6px'><tr><td>prueba</td></tr></table>";

        // Pie de pagina
        //   var f3 = new Date();
        var piePag = "<font style='font-size:5px'>Impreso: " + dd + " de " + mesEsp[mm] + " de " + yyyy + " " + hhmm + " " + localStorage.getItem("ls_usulog").toLocaleString() + " " + localStorage.getItem("ls_empresa").toLocaleString() + "</font>";
        htmlRep01 += "<div style='position: absolute; left: 10px; bottom: 0'>" + piePag + "</div>";

        //   window.myalert("<center><i class=\"fa fa-paper-plane\"></i> PDF_PREF</center>", htmlRep01);

        // PONE INSUMOS BAJO MECANICA
        if (htmlRep01.includes("|") == true) {
            htmlRep01 = htmlRep01.replace("|", htmlDescOT_1);
        }


        // TU FUNCION
        kendo.ui.progress($("#admOtScreen"), false);

        //window.myalert("<center><i class=\"fa fa-paper-plane\"></i> INSUMOS</center>", htmlRep01);



        return htmlRep01;
    }
    catch (e) {

        alert(e);

        kendo.ui.progress($("#admOtScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return "";
    }
}



function NumToText_admOT(valNum) {
    var UrlNumToText = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/tg09EmpresasGet/99,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + valNum;

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlIVA</center>", UrlNumToText);

    var respNumToText = "SON: ";

    var inforNumToText;
    $.ajax({
        url: UrlNumToText,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforNumToText = JSON.parse(data.tg09EmpresasGetResult);
            } catch (e) {
                kendo.ui.progress($("#admOtScreen"), false);
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#admOtScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
            return;
        }
    });

    respNumToText = inforNumToText[0].NombreClase;

    return respNumToText;
}

function generarOrdenPDFAdmOT(numeroOT) {
    try {

        kendo.ui.progress($("#admOtScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************


            var camposEV = parametrosEntregaCompletoAdmOT();
            //   var pathArchivoPDF = camposEV["descripcion-2"] + "\\" + numeroOT + "\\" + "PRE_" + numeroOT;


            var pathArchivoPDF = camposEV["descripcion-2"] + "\\" + numeroOT + "\\" +
                "PRE_" +
                localStorage.getItem("ls_empresa").toLocaleString().substr(0, 5) + "_" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
                localStorage.getItem("ls_usagencia").toLocaleString() + "_" + numeroOT;


            var arrPaths = urlFtpMayo().split("|");
            var strBarcode = "ftp://" + arrPaths[1] + "/" + "|" + arrPaths[0] + "\\"; //"";

            var htmlOrden = formatoRep01_admot(numeroOT);

            var params = {
                "strArchivo": pathArchivoPDF, // strArchivo,
                "strHTML": htmlOrden,
                "strBarcode": strBarcode
            };

            // var Url = "http://localhost:4044/Services/TL/Taller.svc/creaPdf_2";
              var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/creaPdf_2";

            $.ajax({
                url: Url,
                type: "POST",
                data: JSON.stringify(params),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        //   alert(data);

                        var respMail = JSON.stringify(data);

                        if (respMail.includes("Succes")) {
                            var respPdf = "ok";

                            //  adjuntoArchivosOT_2(numeroOT);
                        }
                        else {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", data);
                            return;
                        }
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", JSON.stringify(err));
                    return;
                }
            });

            kendo.ui.progress($("#admOtScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);
    }
    catch (epdf) {
        kendo.ui.progress($("#admOtScreen"), false);
    }
}


function urlFtpMayo() {
    var ftpMayor = "";

    //  ftpMayor = localStorage.getItem("ls_url1").toLocaleString();

    //    var UrlFTP =  "http://localhost:4044/Services/TG/Parametros.svc/ParametroGralGet/12,45;PATH_PDF_PREFACTURA";
    var UrlFTP = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/12,45;PATH_PDF_PREFACTURA";

    var inforFTP;
    $.ajax({
        url: UrlFTP,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforFTP = JSON.parse(data.ParametroGralGetResult);

                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> inforFTP</center>", inforFTP[0].NombreClase);

            } catch (e) {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#lector_barrasScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
            return;
        }
    });

    return inforFTP[0].CodigoClase + "|" + inforFTP[0].NombreClase;

}

function parametrosEntregaCompletoAdmOT() {
    try {

        var accResp = "";

        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS";

        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> Url</center>", Url);

        var respPar;

        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.ParametroEmpGetResult).tmpParamEmp;
                    respPar = accResp[0];
                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });

        return respPar;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return "error";
    }
}


function infoSeguroAdmOT(selAseg) {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/Combotg22ClientesGet/2,

    var cboSeguroHTML = "";

    var UrlCboSeguros = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/Combotg22ClientesGet/2,";

    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboSeguros);

    var cboAseg;

    $.ajax({
        url: UrlCboSeguros,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboAseg = JSON.parse(data.Combotg22ClientesGetResult);
            } catch (e) {
                kendo.ui.progress($("#lector_barrasScreen"), false);
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Seguro");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#lector_barrasScreen"), false);
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Seguro");
            return;
        }
    });

    for (var i = 0; i < cboAseg.length; i++) {
        if (selAseg == cboAseg[i].CodigoClase) {
            cboSeguroHTML = cboAseg[i].NombreClase + " (" + cboAseg[i].CodigoClase + ")";
        }
    }

    return cboSeguroHTML;
}

// END_CUSTOM_CODE_admOt