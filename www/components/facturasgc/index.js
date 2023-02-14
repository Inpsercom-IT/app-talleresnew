/*=======================================================================
Fecha: 05-01-2022
=========================================================================
CONSULTA FACTURAS SGC
=========================================================================
Detalles: 
- Grid de autos facturados
=======================================================================
*/

'use strict';

app.facturasgc = kendo.observable({
    onShow: function () {
    llamarColorTexto(".w3-text-red");
        usuPrincipal();
        document.getElementById("divColorSGC").innerHTML = "";
        document.getElementById('volver_entSGC').setAttribute('onclick', 'volverFormSGC();')
        vistaParametrosSGC();
    },
    afterShow: function () { }
});
app.localization.registerView('facturasgc');

function sumarDiasSGC(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

var arrAgendaGrl = [];
var objEntregaGral;

var arr_IVPM = [];
var arr_Exp = [];
var tamano = "";
var dataRespuesta;
var dataRespuesta1 = "";
var recurrEVCliente = 0;
var arrInfoEV = [];
var kteTipoAuto = "";
var ktedsEV;
var bolImprimeEV = true;
var pregParVeh = [];

function vistaParametrosSGC() {
try {
    

    var colorEstado03 = "";
    var arrEstado03 = ["Reservado", "Entregado", "&nbsp;<i id='icnVIP0'  class='fa fa-flag fa-lg' aria-hidden='true' style='color:#000000'></i>&nbsp;VIP&nbsp;&nbsp;"];
    var arrColor03 = ["#BBFFBB", "#ffcc00", "#FFFFFF"];

    var tamLetra03 = "font-size:11px;";
    for (var j = 0; j < arrEstado03.length; j++) {
        colorEstado03 = colorEstado03.concat("<label style='background-color: " + arrColor03[j] + "; padding:5px; border:solid 1px;" + tamLetra03 + "'>" + arrEstado03[j] + "</label>");
    }
    colorEstado03 = "<td>" +
                    "<p><label class='w3-text-red'><b>Estado</b></label></p>" +
                    "<p>" + colorEstado03 + "</p>" +
                    "</td>";


    document.getElementById("tablaUsuEntSGC").style.display = "none";
    document.getElementById("headEVSGC").style.display = "initial";

    document.getElementById("tablaEntregaDetSGC").style.display = "none";
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("tablaEntVehSGC").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p>" +
        "<p><input id='dpentFecIniSGC' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p>" +
        "<p><input id='dpentFecFinSGC' style='max-width:120px' /></p>" +
        "</td> " +

        "<td><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='rbEntregadoSGC' name='rbEntregado' value='0' onclick='volverFormSGC();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='rbEntregadoSGC_2' name='rbEntregado' value='1' onclick='volverFormSGC();'> Entregado</p></td>" +


        "<td valign='bottom' style='text-align:right'>" +
        "<p>" +
         "<button id='btnBuscarAgeciaSGC0' onclick='entConsultarSGC();' class='w3-btn'><i id='ocultarSGC0' class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
        "&nbsp;&nbsp;<button id='btnBuscarAgeciaSGC1' class='w3-btn'><a id='mostrarSGC' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='ocultarSGC' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</p>" +
        "</td>" +
        "</tr>" +

        "<tr><td colspan='4'>" +

        "<div id='divControlesSGC' style='display:initial' class='target02'>" + // mas controles    
        "<table width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p>" +
        "<p><input id='entFacFisSGC' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p>" +
        "<p><input id='entIdCliSGC' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p>" +
         "<p><input id='entVinSGC' style='max-width:150px' /></p>" +
        "</td>" +

        colorEstado03 +


        "</tr>" +
        "</table>" +
        "</div>" +
        "</td></tr>" +
         "</table>";
        document.getElementById("btnFooterEntregaSGC").innerHTML = "<button id='btnRegresarAgenciaSGC0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgenciaSGC0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";

    }
    else {
        document.getElementById("tablaEntVehSGC").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p><p><input id='dpentFecIniSGC' style='max-width:100px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p><p><input id='dpentFecFinSGC' style='max-width:100px' /></p>" +
        "</td> " +
        "<td valign='bottom'>" +
        "<button onclick='entConsultarSGC();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i></button>&nbsp;" +
        "</td>" +
         "<td valign='bottom'>" +
        "<button id='btnBuscarAgeciaSGC0' class='w3-btn'><a id='mostrarSGC' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='ocultarSGC' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</td>" +
        "</tr>" +

         "<tr>" +
        "<td colspan='4'><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='rbEntregadoSGC' name='rbEntregado' value='0' onclick='volverFormSGC();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='rbEntregadoSGC_2' name='rbEntregado' value='1' onclick='volverFormSGC();'> Entregado</p></td>" +
        "</tr>" +

        "</table>" +
        "<div id='divControlesSGC' style='display:initial' class='target02'>" + // mas controles    
        "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p></td><td><p><input id='entFacFisSGC' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p></td><td><p><input id='entIdCliSGC' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p></td><td><p><input id='entVinSGC' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "</table>" +
        "</div>";

        document.getElementById("btnFooterEntregaSGC").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i></button>";

    }
    
llamarColorTexto(".w3-text-red");
llamarNuevoestilo("btnBuscarAgeciaSGC");
llamarNuevoestiloIconB("ocultarSGC")
llamarNuevoestilo("btnRegresarAgenciaSGC");
llamarNuevoestiloIconB("icnRegresarAgenciaSGC")


    if (document.getElementById('volver_entSGC').hasAttribute("onclick") == true) {
        document.getElementById('volver_entSGC').removeAttribute("onclick");
    }
    document.getElementById("volver_entSGC").href = "components/home/view.html";


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


    //---------------------------------------------------------------------------------
    // fecha de inicio 7 dias atras de hoy
    var d = new Date();
    var x = sumarDiasSGC(d, -7);
    var a = new Date(x);
    var idia = a.getDate();
    if (idia < 10) {
        idia = '0' + idia;
    }

    var imes = a.getMonth() + 1; //var imes = today.getMonth() + 1;
    if (imes < 10) {
        imes = '0' + imes;
    }

    var ianio = a.getFullYear(); //var ianio = today.getFullYear();

    document.getElementById("dpentFecIniSGC").value = idia + "-" + imes + "-" + ianio;
    //---------------------------------------------------------------------------------

    $("#dpentFecIniSGC").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    document.getElementById("dpentFecFinSGC").value = dd + '-' + mm + '-' + yyyy;

    $("#dpentFecFinSGC").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target02').hide("fast");

    $(document).ready(function () {
        $("#mostrarSGC").click(function () {
            $('#target02').show(1000);
            $('.target02').show("fast");
            $('.mostrar2').hide("fast");
            document.getElementById("mostrarSGC").style.display = 'none';
            document.getElementById("ocultarSGC").style.display = 'initial';
        });
        $("#ocultarSGC").click(function () {
            $('#target02').hide(3000);
            $('.target02').hide("fast");
            document.getElementById("mostrarSGC").style.display = 'initial';
            document.getElementById("ocultarSGC").style.display = 'none';
        });
    });
} catch (error) {
    alert(error);
}
}



function entConsultarSGC() {
try{
    document.getElementById("headEVSGC").style.display = "initial";
    document.getElementById("tablaEntregaDetSGC").style.display = "none";
    try {
        // Grid VIN
        var gridE1 = $("#gridListaEntregaSGC").data("kendoGrid");
        gridE1.destroy();
    }    catch (een1) {
        kendo.ui.progress($("#facturasgcScreen"), false);
    }

    var dpentFecIni = document.getElementById("dpentFecIniSGC").value;
    var dpentFecFin = document.getElementById("dpentFecFinSGC").value;

    if (validaFecha(dpentFecIni, dpentFecFin) == false) {
        kendo.ui.progress($("#facturasgcScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
        return;
    }else {
        cargaGridEntregaSGC();
    }
}catch(e){ alert(e);}
}

function cargaGridEntregaSGC() {
    kendo.ui.progress($("#facturasgcScreen"), true);
    setTimeout(function () {
try {
        var dpentFecIni = document.getElementById("dpentFecIniSGC").value;
        var dpentFecFin = document.getElementById("dpentFecFinSGC").value;
        var entFacFis = document.getElementById("entFacFisSGC").value;
        var entIdCli = document.getElementById("entIdCliSGC").value;
        var entVin = document.getElementById("entVinSGC").value;


        // rrppp
        var intEntregado = "0";
        var imgBotGrid = "fa fa-calendar-plus-o fa-lg";
        if (document.getElementById("rbEntregadoSGC_2").checked == true) {
            intEntregado = "1";
            imgBotGrid = "fa fa-print fa-lg";
        }

        var UrlEntregas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/4,json" + ";" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        "0" + ";" +
        entFacFis + ";" +
        "0" + ";" +
        entVin + ";" +
        entIdCli + ";" +
        "" + ";" +
        "FACTURADO" + ";" +
        localStorage.getItem("ls_usulog").toLocaleString() + ";" +
        dpentFecIni + ";" +
        dpentFecFin + ";" +
        intEntregado;
        var errorConexEV = false;
        var infEntregas;
        $.ajax({
            url: UrlEntregas,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (inspeccionar(data).includes("tvh03") == true) {
                        infEntregas = (JSON.parse(data.vh03FacturasGetResult)).tvh03;
                    }
                } catch (e) {
                    document.getElementById("headEVSGC").style.display = "initial";
                    document.getElementById("tablaEntregaDetSGC").style.display = "none";
                    kendo.ui.progress($("#facturasgcScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (eEntrega) {

                document.getElementById("headEVSGC").style.display = "initial";
                document.getElementById("tablaEntregaDetSGC").style.display = "none";
                errorConexEV = true;
                kendo.ui.progress($("#facturasgcScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
                return;
            }
        });

        if (errorConexEV == false) {

            if (inspeccionar(infEntregas).length > 0) {
                for (let index = 0; index < infEntregas.length; index++) {
                    var respuestaSGC = ConsultarFacturaSGc(infEntregas[index]);
                    if (respuestaSGC.bdt1) {
                        infEntregas[index].factura_sgc = "SI SGC";                        
                    } else {
                        infEntregas[index].factura_sgc = "NO SGC";
                    }
                    infEntregas[index].observacion_sgc = respuestaSGC.dt1;                    
                }

                var numeroFilasEnt = 5;
                var colEnt1 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 7) / 100;
                var colEnt2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 5) / 100;
                numeroFilasEnt = 23;

                if (document.getElementById("rbEntregadoSGC").checked == true) {

                    $("#gridListaEntregaSGC").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasEnt,
                            data: infEntregas,
                            sort: { field: "numero_factura", dir: "desc" }
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
                        groupable: false,
                        columns: [
                            {
                                field: "factura_sgc", title: "Factura SGC", width: 30, attributes: {
                                    style: "#= celdaColorSGCFac(factura_sgc, observacion_sgc) #"
                                }
                            },
                            {
                                field: "observacion_sgc", title: "Observación SGC", width: 30, attributes: {
                                    style: "#= celdaColorSGCFac(factura_sgc,observacion_sgc) #"
                                }
                            },
                             {
                                 field: "chasis", title: "Chasis", width: 30,
                                   template: "#= clienteVIPSGC(chasis, persona_clase) #",
                                 attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },

                             {
                                 field: "nombre_modelo", title: "Modelo", width: 30, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                             {
                                 field: "color_vehiculo", title: "Color", width: 30, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                             {
                                 field: "placa", title: "Placa", width: 25, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                          {
                              field: "nombre_cliente",
                              title: "Propietario",
                              groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                              width: colEnt2, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }

                          },
                          {
                              field: "identifica", title: "ID", width: 35, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }
                          },

                          {
                              field: "telefono_cliente", title: "Tel&#233;fono", width: 25, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }
                          },
                          {
                              field: "secuencia_factura", title: "Factura",
                              template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                              width: 40, attributes: {
                                  style: "#= celdaColorSGC(0.0) #" 
                              }

                          },

                           {
                               field: "fecha_cita_aux", title: "Fec.Cita", width: 25,
                               attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }

                           },
                           {
                               field: "0.0", title: "Hora Cita", width: 25,
                               template: "#= formatoHoraSGC(0.0)# ",
                               attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }
                           },


                           {
                               field: "forma_pago", title: "Forma Pago", width: 25, attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }
                           }
                            , {
                                field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true, attributes: {
                                    style: "#= celdaColorSGC(0.0) #"
                                }
                            }

                            // VIP
                            , {
                                field: "persona_clase", title: "VIP", width: 25, attributes: {
                                    style: "#= celdaColorSGC(0.0) #"
                                }
                            }

                        ]
                    });
                }
                else {

                    $("#gridListaEntregaSGC").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasEnt,
                            data: infEntregas,
                            sort: { field: "numero_factura", dir: "desc" }
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
                        groupable: false,
                        columns: [
                             {
                                 width: 1
                             },

                             {
                                 field: "chasis", title: "Chasis", width: 30,
                                 template: "#= clienteVIPSGC(chasis, persona_clase) #",
                                 attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },


                             {
                                 field: "nombre_modelo", title: "Modelo", width: 30, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                             {
                                 field: "color_vehiculo", title: "Color", width: 30, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                             {
                                 field: "placa", title: "Placa", width: 25, attributes: {
                                     style: "#= celdaColorSGC(0.0) #"
                                 }
                             },
                          {
                              field: "nombre_cliente",
                              title: "Propietario",
                              groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                              width: colEnt2, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }
                          },
                          {
                              field: "identifica", title: "ID", width: 35, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }
                          },

                          {
                              field: "telefono_cliente", title: "Tel&#233;fono", width: 25, attributes: {
                                  style: "#= celdaColorSGC(0.0) #"
                              }
                          },
                          {
                              field: "secuencia_factura", title: "Factura",
                              template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                              width: 40, attributes: {
                                  style: "#= celdaColorSGC(0.0) #" // "background-color:red;"
                              }
                          },

                           {
                               field: "fecha_cita_aux", title: "Fec.Cita", width: 25,
                               attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }

                           },
                           {
                               field: "0.0", title: "Hora Cita", width: 25,
                               template: "#= formatoHoraSGC(0.0)# ",
                               attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }
                           },


                           {
                               field: "forma_pago", title: "Forma Pago", width: 25, attributes: {
                                   style: "#= celdaColorSGC(0.0) #"
                               }
                           }
                            , {
                                field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true, attributes: {
                                    style: "#= celdaColorSGC(0.0) #"
                                }
                            }

                            // VIP
                            , {
                                field: "persona_clase", title: "VIP", width: 25, attributes: {
                                    style: "#= celdaColorSGC(0.0) #"
                                }
                            }

                            //-------------------------------
                        ]
                    });
                  
                }
                document.getElementById("tablaEntregaDetSGC").style.display = "initial";
            }
            else {

                document.getElementById("tablaEntregaDetSGC").style.display = "none";
                var msjErrorEnt = "<center>No existen registros</center>";

                kendo.ui.progress($("#facturasgcScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjErrorEnt);
                return;
            }
        }

        kendo.ui.progress($("#facturasgcScreen"), false);
        // precarga *********************************************************************************************
    } catch (error) {
    alert(error);
    kendo.ui.progress($("#facturasgcScreen"), false);
    }
    }, 2000);

}

function ConsultarFacturaSGc(parametros) {
    var respuestaGara = "";
     try {
         var params = {
             "Dt1": parametros.almacen,
             "Dt2": parametros.serie,
             "Dt3": parametros.chasis,
             "Ndt1":parametros.id_orden_facturacion,
             "Ndt2":parametros.secuencia_factura
         };
         $.ajax({
             url: UrlFacturaSGC,
             type: "POST",
             data: JSON.stringify(params),
             async: false,
             dataType: "json",
             headers: {
                 'Content-Type': 'application/json;charset=UTF-8'
             },
             success: function (datas) {
                 try {
                     respuestaGara = datas;
                 } catch (e) { 
                     alert("No existe datos para esta consulta", "mens"); kendo.ui.progress($("#lector_barrasScreen"), false); return;
                 }
             },
             error: function (err) {
                 alert("Alerta en consulta OT", "mens"); kendo.ui.progress($("#lector_barrasScreen"), false); return;
             }
         });
     } catch (e) {
         mens("Alerta de conexi" + String.fromCharCode(243) + "n a base", "mens"); kendo.ui.progress($("#lector_barrasScreen"), false); return;
     }
     return respuestaGara;
 }

function clienteVIPSGC(chasis, txtVip) {
    if (txtVip.trim() != "") {
        chasis = chasis + " <i id='icnVIP0' class='fa fa-flag fa-lg' aria-hidden='true' ></i>";
    }
llamarNuevoestiloIconB("icnVIP");
    return chasis;
}

function celdaColorSGCFac(fact, observa) {
    var colorCel = "background-color:transparent;";
    
    if (fact == "SI SGC") {
        colorCel = "background-color:#BBFFBB;";
        if (observa.includes("no es igual")) {
            colorCel = "background-color:#ffcc00;";
        }
    } else {
        colorCel = "background-color:#ff0d00;";
    }
    return colorCel;
}
function celdaColorSGC(hora) {
    var colorCel = "background-color:transparent;";
    if (document.getElementById("rbEntregadoSGC").checked == true) {
        if (parseInt(hora) > 0) {
            colorCel = "background-color:#BBFFBB;";
        }        
    }
    else {
        if (parseInt(hora) > 0) {
            colorCel = "background-color:#ffcc00;";
        }
        else {
            colorCel = "background-color:#BBFFBB;";
        }
    }
    return colorCel;
}

function formatoHoraSGC(hora) {
    var txtHora = "";
    var intHora = parseInt(hora);

    if (intHora > 0) {
        hora = hora.toFixed(2);
        var arrHM = hora.split(".");

        if (parseInt(arrHM[0]) < 10) {
            arrHM[0] = "0" + arrHM[0];
        }

        txtHora = arrHM[0] + ":" + arrHM[1];
    }

    return txtHora;
}


function fechaActualSGC() {
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
    // 02-10-2017
    return dd + "-" + mm + "-" + yyyy;
}

/* function agendaEntregaSGC(objEntrega, fechaBusqueda) {

    if (document.getElementById('volver_entSGC').hasAttribute("href") == true) {
        document.getElementById("volver_entSGC").removeAttribute("href");
    }
    document.getElementById('volver_entSGC').setAttribute('onclick', 'volverFormSGC();')


    //document.getElementById("2agendaEntrega").innerHTML = "";

    var nombreChasis = objEntrega.chasis;

    var nombre_cliente = objEntrega.nombre_cliente;
    nombre_cliente = nombre_cliente.replace(/,/g, "&nbsp;");
    if (nombre_cliente.length > 17) {
        nombre_cliente = nombre_cliente.slice(0, 17);
    }

    var nombreModelo = objEntrega.nombre_modelo;
    if (nombreModelo.length > 17) {
        nombreModelo = nombreModelo.slice(0, 17);
    }

    var fecha_cita_aux = objEntrega.fecha_cita_aux;
    var 0.0 = objEntrega.0.0;

    var tamLetra = "9";
    //var tamLetra = "10";
    //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
    //   // nombreModelo = nombreModelo.slice(0, 9) + "...";
    //    nombreChasis = nombreChasis.slice(0, 18) ;

    //    tamLetra = "9";
    //}

    var agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "<br />" + nombre_cliente + "</div>";

    var idCelda = "Chasis: " + objEntrega.chasis;

    //var arrAgendaGrl = [
    //	{
    //	    id: idCelda, //'PCT7242',
    //	    title: agContenido,
    //	    start: '20-06-2018 07:00:00',
    //	    end: '20-06-2018 07:15:00',
    //	    backgroundColor: '#33cc33',
    //	    textColor: '#000'
    //	},
    //	{
    //	    id: idCelda, // 'E01',
    //	    title: agContenido,
    //	    start: '22-06-2018 09:00:00',
    //	    end: '22-06-2018 09:30:00',
    //	    backgroundColor: '#33cc33',
    //	    textColor: '#FFF'
    //	},
    //];


    arrAgendaGrl = getEvents2(document.getElementById("datepickerSGC").value, document.getElementById("2cboUsuarioEntrega").value);

    nombre_cliente = objEntrega.nombre_cliente;
    nombre_cliente = nombre_cliente.replace(/,/g, "&nbsp;");
    if (nombre_cliente.length > 25) {
        nombre_cliente = nombre_cliente.slice(0, 25);
    }

    nombreModelo = objEntrega.nombre_modelo;
    //if (nombreModelo.length > 25) {
    //    nombreModelo = nombreModelo.slice(0, 25);
    //}
    if (nombreModelo.length > 0) {
        if (nombreModelo.length > 25) {
            nombreModelo = nombreModelo.slice(0, 25);
        }
    }
    else {
        nombreModelo = objEntrega.codigo_modelo;
    }


    //document.getElementById("2agendaEntrega").innerHTML = "<div class='mycalEnt2'></div>";

    if (arrAgendaGrl.length > 0) {

        $('.mycalEnt2').easycal({
            startDate: fechaBusqueda, //dd + "-" + mm + "-" + yyyy, // "01-04-2018", // dd-mm-yyyy
            timeFormat: 'HH:mm',
            columnDateFormat: 'dddd, DD MMM',
            minTime: '07:00:00',
            maxTime: '18:15:00',
            slotDuration: 30,
            timeGranularity: 30,
            dayClick: function (el, startTime) {



                confirmaCita2("<center><i class=\"fa fa-calendar-plus-o\"></i> CITA</center>",
    "<b>Cliente:</b> " + nombre_cliente.slice(0, 25) + "<br/>" + "<b>Telf.</b> " + objEntrega.persona_telefono_movil + "<br/>" +
    "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime, objEntrega);


            },
            eventClick: function (eventId) {
             //   alert(fecha_cita_aux + " " + 0.0);
                //   alert(eventId);

                var msjCelda = "";

                if (eventId.includes("|") == true) {
                    var arrEvento = eventId.split("|");
                    var arrCamposEv = arrEvento[1].split("-");

                    msjCelda = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                    "<tr><td>" + "<b>Chasis:</b></td><td>" + arrCamposEv[0] + "</td></tr>" +
                    "<tr><td>" + "<b>Modelo:</b></td><td>" + arrCamposEv[1] + "</td></tr>" +
                    "<tr><td>" + "<b>Color:</b></td><td>" + arrCamposEv[2] + "</td></tr>" +
                    "<tr><td>" + "<b>Cliente:</b></td><td>" + arrCamposEv[3] + "</td></tr>" +
                    "<tr><td>" + "<b>Telf.:</b></td><td>" + arrCamposEv[4] + "</td></tr>" +
                    // "<tr><td>" + "<b>Fecha:</b></td><td>" + arrCamposEv[5] + "</td></tr>" +
                    //"<tr><td>" + "<b>hora:</b></td><td>" + arrCamposEv[6] + "</td></tr>" +
                    "</table>";
                }
                
                //var msjCelda = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                //    "<tr><td>" + "<b>Chasis:</b></td><td>" + nombreChasis + "</td></tr>" +
                //  "<tr><td>" + "<b>Modelo:</b></td><td>" + nombreModelo + "</td></tr>" +
                //  "<tr><td>" + "<b>Color:</b></td><td>" + objEntrega.color_vehiculo + "</td></tr>" +
                //  "<tr><td>" + "<b>Cliente:</b></td><td>" + nombre_cliente + "</td></tr>" +
                //  "<tr><td>" + "<b>Telf.:</b></td><td>" + objEntrega.persona_telefono_movil + "</td></tr>" +
                //  "</table>";

                myalert("<center><i class=\"fa fa-calendar-check-o\"></i><b>&nbsp;RESERVADO</b></center>", msjCelda);



            },
            events: arrAgendaGrl,
            overlapColor: '#FF0',
            overlapTextColor: '#000',
            overlapTitle: 'Multiple'
        });
    }
    else {


        $('.mycalEnt2').easycal({
            startDate: fechaBusqueda, //dd + "-" + mm + "-" + yyyy, // "01-04-2018", // dd-mm-yyyy
            timeFormat: 'HH:mm',
            columnDateFormat: 'dddd, DD MMM',
            minTime: '07:00:00',
            maxTime: '18:15:00',
            slotDuration: 30,
            timeGranularity: 30,
            dayClick: function (el, startTime) {
                confirmaCita2("<center><i class=\"fa fa-calendar-plus-o\"></i> CITA</center>",
                    "<b>Cliente:</b> " + nombre_cliente.slice(0, 25) + "<br/>" + "<b>Telf.</b> " + objEntrega.persona_telefono_movil + "<br/>" +
                    "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime, objEntrega);
            },
            eventClick: function (eventId) {

                //  alert(eventId);
                // verCita(eventId);

                var msjCelda = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                    "<tr><td>" + "<b>Chasis:</b></td><td>" + nombreChasis + "</td></tr>" +
                  "<tr><td>" + "<b>Modelo:</b></td><td>" + nombreModelo + "</td></tr>" +
                  "<tr><td>" + "<b>Color:</b></td><td>" + objEntrega.color_vehiculo + "</td></tr>" +
                  "<tr><td>" + "<b>Cliente:</b></td><td>" + nombre_cliente + "</td></tr>" +
                  "<tr><td>" + "<b>Telf.:</b></td><td>" + objEntrega.persona_telefono_movil + "</td></tr>" +
                  "</table>";

                myalert("<center><i class=\"fa fa-calendar-check-o\"></i>RESERVADO</center>", msjCelda);
            },
            events: [],
            overlapColor: '#FF0',
            overlapTextColor: '#000',
            overlapTitle: 'Multiple'
        });



    }



} */

function volverFormSGC() {
    usuPrincipal();
    entConsultarSGC();
    var htmlBotones = "";
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        htmlBotones = "<button id='btnRegresarAgenciaSGC0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgenciaSGC0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        htmlBotones = "<button id='btnRegresarAgenciaSGC0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgenciaSGC0' class='fa fa-chevron-left' aria-hidden='true'></i></button>";
    }
    
    document.getElementById("btnFooterEntregaSGC").innerHTML = htmlBotones;
    llamarNuevoestilo("btnRegresarAgenciaSGC");
    llamarNuevoestiloIconB("icnRegresarAgenciaSGC");
    //document.getElementById("2agendaEntrega").innerHTML = "";
    document.getElementById("tablaEntregaDetSGC").style.display = "initial"; // grid
    document.getElementById("tablaUsuEntSGC").style.display = "none";
    //document.getElementById("2agendaEntrega").style.display = "none";
    document.getElementById("tablaEntVehSGC").style.display = "initial";
    if (document.getElementById('volver_entSGC').hasAttribute("onclick") == true) {
        document.getElementById('volver_entSGC').removeAttribute("onclick");
    }
    document.getElementById("volver_entSGC").href = "components/home/view.html";

}

// END_CUSTOM_CODE_home