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

var arrEstOT = ["RECEPCIONADO", "EN ESPERA DE ASIGNACION", "ASIGNADO TECNICO", "TRABAJANDO", "PARALIZADO", "LAVADO", "CONTROL CALIDAD", "CERRADO"];
var arrColorOT = ["#ffffff", "#C6C7C6", "#FF00FF", "#FFFF00", "#FF5152", "#5151FF", "#BDFFBD", "#00EF00"];

'use strict';

app.controlCalidad = kendo.observable({
    onShow: function () {
        if(banderaCC==0){
            vistaParametrosCA();
        }else{
            admConsultarOTCA();
        }
       
        /* //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if (localStorage.getItem("ls_otdet2CA") != undefined) {
            var arrFecOteV = localStorage.getItem("ls_otdet2CA").toLocaleString().split('|');
            document.getElementById("dpInicioOT").value = arrFecOteV[3];
            document.getElementById("dpFinOTCA").value = arrFecOteV[4];
            document.getElementById('otEstado2').value = arrFecOteV[5];
            document.getElementById('numProfCA').value = arrFecOteV[6];
            //admConsultarOTCA();
            
        }
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        //  admConsultarOT(); */
    },
    afterShow: function () { }
});
app.localization.registerView('controlCalidad');

// START_CUSTOM_CODE_controlCalidad
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

function admConsultarOTCA() {
try {
    document.getElementById("gridListaOrdenesCA").innerHTML = "";
    // elimina la variable del radio button
    if (localStorage.getItem("ls_oteiCA") != undefined) {
        localStorage.removeItem("ls_oteiCA");
    }
    // elimina la variable del detalle
    if (localStorage.getItem("ls_otdet2CA") != undefined) {
        localStorage.removeItem("ls_otdet2CA");
    }
    document.getElementById("tablaOTDetalleCA").style.display = "none";

    try {
        // Grid VIN
        var grid01_1 = $("#gridListaOrdenesCA").data("kendoGrid");
        grid01_1.destroy();
    }
    catch (emo1)
    { }
    var strProp = ""; //document.getElementById('otPropCA').value;
    var strPLACA = ""; //document.getElementById('otPlacaCA').value;
    //var strOT = document.getElementById('otNumCA').value;
    var otEstado2 = "ABIERTO"; //document.getElementById('otEstado2CA').value;
    var datFecIni = document.getElementById('dpInicioOTCA').value;
    var datFecFin = document.getElementById('dpFinOTCA').value;
    var strOT = document.getElementById('numProfCA').value;
    var numProf = "";
    
    if (numProf.trim() == "") {
        numProf = "0";
    }
    if (validaFecha(datFecIni, datFecFin) == false) {
        kendo.ui.progress($("#controlCalidadScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
        return;
    }
    kendo.ui.progress($("#controlCalidadScreen"), true);
    setTimeout(function () {
        //  precarga *********************************************************************************************
        var verColEstado = true;
        var UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/15,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() +
        ";;;;;" + strProp + ";;" +
        datFecIni + ";" + datFecFin + ";;" + otEstado2 + "" +
        ";" + numProf + ";";
        if (strOT.trim() != "") {

            if (strOT.trim().length > 7) {
                UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/15,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() +
                ";;;;;" + strProp + ";" + strOT + ";;;;" + otEstado2 + "" +
                ";" + numProf + ";";
            }
            else {
                UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/15json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() +
                ";" + strOT + ";;;;" + strProp + ";;;;;" + otEstado2 + "" +
                ";" + numProf  + ";";
            }

            verColEstado = false;
        }
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
        var infOrdenes;
        $.ajax({
            url: UrlOrdenes,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    //alert(inspeccionar(data));
                    infOrdenes = (JSON.parse(data.tl06OrdenesGetResult)).ttl06;
                } catch (e) {
                    kendo.ui.progress($("#controlCalidadScreen"), false);
                    // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#controlCalidadScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                return;
            }
        });

        if (inspeccionar(infOrdenes).length > 0) {
            var numeroFilasOT = 5;
            //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            //}
            var col1 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 2) / 100;
            var col2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 2) / 100;
            //  if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            if (otEstado2 == "ABIERTO") {
                numeroFilasOT = 27;
                $("#gridListaOrdenesCA").kendoGrid({
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
                                     width: 11,
                                     command: [{
                                         name: "detalle",
                                         text: "",
                                         imageClass: "fa fa-file-text-o",
                                         visible: function (dataItem) { return dataItem.estado == "ABIERTO" || dataItem.estado == "CERRADO" },
                                         click: function (emo04) {
                                             try {
                                                /* kendo.ui.progress($("#controlCalidadScreen"), true);
                                                setTimeout(function () { */
                                                 var dataItemCC = this.dataItem($(emo04.currentTarget).closest("tr"));
                                                 emo04.preventDefault();
                                                 try {
                                                     localStorage.removeItem("dataItemCC");
                                                 } catch (e) {
                                                     
                                                 }
                                                 localStorage.setItem("dataItemCC", JSON.stringify(dataItemCC));
                                                 // abre pagina detalle
                                                 /* if (dataItemCC.tipo_trabajo == "RC" || dataItemCC.tipo_trabajo == "RP") {
                                                    var msjPreguntaOT = "<center><h1><i class=\"fa fa-unlock\"></i> CONFIRMAR</h1><br />Aqui mostrar ordenes de trabajo relacionadas al vin</b></center>";
                                                    kendo.confirm(msjPreguntaOT)
                                                    .done(function () {
                                                       kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");
                                                       kendo.ui.progress($("#controlCalidadScreen"), true);
                                                    });
                                                 } else { */
                                                    //kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");
                                                    kendo.mobile.application.navigate("components/ordenesRelaciondas/view.html");
                                                    kendo.ui.progress($("#controlCalidadScreen"), true);
                                                 //}
                                                 
                                                 
                                               /*  }, 2000);
                                                kendo.ui.progress($("#controlCalidadScreen"), false); */
                                             }
                                             catch (fmo4) {
                                                 kendo.ui.progress($("#controlCalidadScreen"), false);
                                                 window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                                 return;
                                             }
                                         }
                                     }],
                                 },
                                 {title: "Reversar Calidad",
                                 width: 10,
                                 command: [{
                                    name: "detalle1",
                                    text: "",
                                    imageClass: "fa fa-file-text-o",
                                    visible: function (dataItem) { return dataItem.estado_calidad == "FINALIZADO" || dataItem.estado_calidad == "REVISADO" },
                                    click: function (emo05) {
                                        try {
                                            var dataItem = this.dataItem($(emo05.currentTarget).closest("tr"));
                                            emo05.preventDefault();
                                            localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                            reversoestadoCC();
                                            //kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");
                                        }
                                        catch (fmo4) {
                                            kendo.ui.progress($("#controlCalidadScreen"), false);
                                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", fmo4);
                                            return;
                                        }
                                    }
                                }],
                            },
                                 {
                                    field: "estado_calidad", title: "Est. Calidad", width: 10, filterable: false //, hidden: verColEstado
                                },
                           
                            //{ field: "numero_orden", title: "OT", width: 33 },

                            // VIP BANDERA
                              {
                                  field: "numero_orden",filterable:false, title: "OT <b>(VIP <i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#000000'></i>)</b>", width: 10,
                                  template: "#= clienteVIP(numero_orden, persona_clase) #",
                                  fontsize: "12px"
                              },

                            { field: "placa", title: "Placa",filterable:false, width: 10 },
                            { field: "nombre_modelo", title: "Modelo", width: 20 },
                            { field: "anuo_modelo", title: "Año Modelo", width: 10},
                            { field: "kilometraje", title: "Kilometraje", width: 13 },
                            { field: "fecha_recepcion", title: "Fecha Recepción", width: 13 },
                            {
                                field: "nombre_propietario",filterable:false,
                                title: "Propietario",
                                groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                width: col2
                            },
                            
                            
                            {
                                field: "estado_interno", title: "Estado Interno",filterable:false, width: 15,
                                
                            },
                             { field: "tipo_trabajo", title: "Tipo Trabajo", width: 10 }, 
                             { field: "seccion_orden_trabajo", title: "Secc. Ord. Trabajo", width: 15 }, 
                             /* { field: "causal_parada_actividad", title: "Causa", width: 10 },  */
                             { field: "nombre_entrega_auto", title: "Nombre CSI", width: col2 },
                             { field: "persona_clase", title: "VIP", width: 10 },
                             {field: "estado", title: "Estado", width: 10 }//, hidden: verColEstado

                    ]
                });
            }
            else {
                numeroFilasOT = 27;
                $("#gridListaOrdenesCA").kendoGrid({
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
                                                 kendo.ui.progress($("#controlCalidadScreen"), false);
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
                                                     kendo.ui.progress($("#controlCalidadScreen"), false);
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
                                                 kendo.ui.progress($("#controlCalidadScreen"), false);
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

            document.getElementById("tablaOTDetalleCA").style.display = "block";
        }
        else {

            document.getElementById("tablaOTDetalleCA").style.display = "none";

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

            kendo.ui.progress($("#controlCalidadScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjError);
            return;
        }

        kendo.ui.progress($("#controlCalidadScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
} catch (error) {
    alert(error);
}
}

function reversoestadoCC(){
    try{
        var dataRespuesta = JSON.parse(localStorage.getItem("dataItem"));
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() ;
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> estado</center>", inspeccionar(dataRespuesta[0]));
        var para = [];
        para[0] = {
            "modo": "3",
            "codigo_empresa": localStorage.getItem("ls_idempresa").toLocaleString(),
            "codigo_sucursal": localStorage.getItem("ls_ussucursal").toLocaleString(),
            "codigo_taller": localStorage.getItem("ls_usagencia").toLocaleString(),
            "anio_tl06": dataRespuesta.anio,
            "secuencia_orden_tl06": dataRespuesta.secuencia_orden,
            "secuencia_tl43": "",
            "orden_presentacion": "EN PROCESO",
            "pregunta": "",
            "tipo_formulario": "",
            "seccion_formulario": "",
            "tipo_respuesta": "",
            "lista_respuesta": "",
            "lista_etiquetas": "",
            "tipo_valor": "",
            "lista_valores": "",
            "respuesta": "",
            "secuencia_vh65": "",
            "corden_seccion": "",
            "selRespt": "",
            "sevRespt": "",
            "erRespt": "",
            "evRespt": "",
            "nombre_seccion": "",
            "observacion_calidad": ""                          
        };
               
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl43PreguntasCalidadSet";
        //var Url = "http://localhost:4044" + "/Services/TL/Taller.svc/tl43PreguntasCalidadSet";
        $.ajax({
        url: Url,
        type: "POST",
        data: JSON.stringify(para),
        async: false,
        dataType: "json",
        //Content-Type: application/json
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        success: function (datas) {
            //alert(datas);
            if (datas.substr(0, 1) == "1") {
                alert("se actualizaron los datos");
                
                //vistaParametrosCA();
                var grid01_R = $("#gridListaOrdenesCA").data("kendoGrid");
                grid01_R.destroy();
                admConsultarOTCA();
                document.getElementById("gridListaOrdenesCA").innerText = "";
            } else { alert(datas.substr(2, datas.length - 2)); return; }
        },
        error: function (err) { alert("HOY"+inspeccionar(err)); alert("Error en servicio clientes"); return; } //alert(err);
        });
        
        } catch (e) { alert("salio"+e); }
}

function vistaParametrosCA() {
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("tablaOT2CA").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                                                        "    <tr>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                </p><p>" +
                                                        "                <input id='dpInicioOTCA' value='01-01-1900' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "        <td >" +
                                                        "            <p>" +
                                                        "                <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "            </p><p>" +
                                                        "                <input id='dpFinOTCA' value='01-10-2017' style='max-width:120px' />" +
                                                        "            </p>" +
                                                        "        </td>" +

                                                        "<td>" +
                                                        "<p>" +
                                                        "<label class='w3-text-red'><b>N&#186; Orden Trabajo</b></label>" +
                                                        "</p>" +
                                                        "<p><input name='numProfCA' type='number' id='numProfCA' class='w3-input w3-border textos' style='max-width:115px' value=''></p>" +
                                                         "</td>" +
                                                        "        <td valign='bottom'>" +
                                                        "            <p>" +
                                                        "                <button id='btnBuscarControl0' onclick='admConsultarOTCA();' class='w3-btn'><i id='icnBuscarControl0' class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
                                                        "            </p>" +
                                                        "        </td>" +
                                                        "    </tr>" +

                                                        "</table>";
    }
    else {
        document.getElementById("tablaOT2CA").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "                <td>" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Inicio</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                        <input id='dpInicioOTCA' value='01-01-1900' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "                <td >" +
                                                        "                    <p>" +
                                                        "                        <label class='w3-text-red'><b>Fin</b></label>" +
                                                        "                         </p></td><td><p>" +
                                                        "                       <input id='dpFinOTCA' value='01-10-2017' style='max-width:100px' />" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" +
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "             <tr>" +
                                                        "                <td valign='bottom'>" +
                                                        "                    <p>" +
                                                        "                        <button onclick='admConsultarOTCA();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i> </button>" +
                                                                "&nbsp;&nbsp;<button class='w3-btn w3-red'><a id='mostrar3CA' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
                                                        "<a id='ocultar3CA' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
                                                        "                </td>" +
                                                        "            </tr>      " +
                                                        "        </table>" +
                                                        "<div id='divControlesOTCA' style='display:initial' class='target3'>" + // mas controles    
                                                                    "<table align='center' border='0' cellspacing='0' cellpadding='0' width='100%'>" +
                                                        "            <tr>" +
                                                        "<td>" +
                                                        "                    </p>" +
                                                        "                </td>" +
                                                        "            </tr>" +
                                                        "           </table>" + tablaEstadoColor() +
                                                        "</div>";
    }
    llamarColorTexto(".w3-text-red");
    llamarNuevoestilo("btnBuscarControl");
    llamarNuevoestiloIconB("icnBuscarControl");
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
            document.getElementById("dpInicioOTCA").value = begin.format('DD-MM-YYYY');
            break;
        }
        //  alert(begin.format('DD-MM-YYYY'));
        begin.add('d', 1);
    }

    $("#dpInicioOTCA").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    document.getElementById("dpFinOTCA").value = dd + '-' + mm + '-' + yyyy;

    $("#dpFinOTCA").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target3CA').hide("fast");

    $(document).ready(function () {
        $("#mostrar3CA").click(function () {
            $('#target3CA').show(1000);
            $('.target3CA').show("fast");
            $('.mostrar3CA').hide("fast");
            document.getElementById("mostrar3CA").style.display = 'none';
            document.getElementById("ocultar3CA").style.display = 'initial';
            document.getElementById('otNumCA').value = "";
        });
        $("#ocultar3CA").click(function () {
            $('#target3CA').hide(1000);
            $('.target3CA').hide("fast");
            document.getElementById("mostrar3CA").style.display = 'initial';
            document.getElementById("ocultar3CA").style.display = 'none';
            document.getElementById('otNumCA').value = "";
        });
    });
    if (inspeccionar(localStorage.getItem("dataItem")) == null || inspeccionar(localStorage.getItem("dataItem")) == ""){
        document.getElementById("tablaOTDetalleCA").style.display = "none";
    }
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnFooterOTCA").innerHTML = "<button id='btnRegresarControl0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarControl0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        document.getElementById("btnFooterOTCA").innerHTML = "<button id='btnRegresarControl0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='btnRegresarControl0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button onclick='vistaParametrosCA();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestiloIconB("icnRegresarControl");
    llamarNuevoestilo("btnRegresarControl");
} catch (error) {
    alert(error);
}

}


/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Crea archivo PDF en formato HTML y se guarda via FTP
Autor: RRP
--------------------------------------------------------------------*/
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

