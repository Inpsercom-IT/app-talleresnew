/*=======================================================================
Fecha: 22/06/2018
=========================================================================
AGENDA ENTREGA 
=========================================================================
Detalles: 
- Grid de autos facturados
- Agenda de Entrega
- Ingreso, Eliminaci�n y Reagendamiento de citas
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

app.agencia = kendo.observable({
    onShow: function () {
    llamarColorTexto(".w3-text-red");
        //var smsTexto = "KIA Motors: Entrega AUTO. Estimado cliente su cita ha sido agendada exitosamente para el 06-Jul-2018 a las 12H00. Agradecemos su confianza, muchas gracias.";
        //enviaSmsEv("0990777508", smsTexto);
        //alert("fin");
        usuPrincipal();
        if (localStorage.getItem("ls_urlSesEnt") != undefined) {
            document.getElementById("divColor02").innerHTML = "";

            var urlAgendaEV = localStorage.getItem("ls_urlSesEnt").toLocaleString();
            //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", urlAgendaEV);

            localStorage.removeItem("ls_urlSesEnt");

            var arrUrlEV = urlAgendaEV.split("|");
            var arrcompEV = arrUrlEV[1].split(";");

            document.getElementById("2dpentFecIni").value = arrcompEV[0];
            document.getElementById("2dpentFecFin").value = arrcompEV[1];

            if (arrcompEV[2] == "1") {
                document.getElementById("2rbEntregado_2").checked = true;
            }

            cargaGridEntrega2();
        }
        else {

            document.getElementById("divColor02").innerHTML = "";

            vistaParametrosEntVeh2();
        }

        //usuPrincipal();
        //vistaParametrosEntVeh2();
    },
    afterShow: function () { }
});
app.localization.registerView('agencia');


function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}


/*--------------------------------------------------------------------
Fecha: 29/06/2018
Descripcion: envia SMS
Parametros:
    credenciales
--------------------------------------------------------------------*/
function enviaSmsEv(cel, contenido) {
    var UrlSMS = "https://app.massend.com/api/sms/";

    // KIA Motors le informa que la cita para la entrega de su veh�culo fue agendada para 2018-06-07 a las 18:00. Gracias


// string user = "kiaecuador-api"; string pass = "keapi2018"; string msg = "prueba de envio"; string num = "0991707704"; string ruta = "S"; string camp = "Facturacion";

    var paramsSMS = {
        "user": "kiaecuador-api",
        "pass": "keapi2018",
        "msg": contenido,
        "num": "0990777508", // cel,
        "ruta": "l",
        "camp": "Facturacion"
    };

    $.ajax({
        data: paramsSMS,
        url: UrlSMS,
        type: 'post',
        success: function (response) {
            var respuestaSMS = JSON.stringify(response);
            if (respuestaSMS.includes("\"errores\":0") == true) {
             //   window.myalert("<center><i class=\"fa fa-paper-plane\"></i> SMS ENVIADO</center>", "<center>El SMS fue enviado correctamente<br/>al celular<b> " + cel + "</b></center>");

                window.myalert("<center><i class=\"fa fa-paper-plane\"></i> SMS ENVIADO</center>", "cadena<br/>" + contenido + "<br/>" + "longitud: " + contenido.length + "<br/>" + "OK");
            }
            else {
                //[{ "RefError": { "errorinfo": "Error en el envio: Numero de Telefono Invalido:0990777508123", "errores": 1 } }]
                var arrError = respuestaSMS.split("errorinfo\":");
                var arrError1 = arrError[1].split(",");
                arrError1[0] = arrError1[0].replace(":", " ");
                arrError1[0] = arrError1[0].replace(/"/g, " ");

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "cadena<br/>" + contenido + "<br/>" + "longitud: " + contenido.length + "<br/>" + "error:" + arrError1[0]);
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
        }
    });

}




// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

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

function vistaParametrosEntVeh2() {

    var colorEstado03 = "";
    //var arrEstado03 = ["Reservado", "Entregado"]; 
    //var arrColor03 = ["#BBFFBB", "#ffcc00"];

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


    document.getElementById("2tablaUsuEnt").style.display = "none";
    document.getElementById("2agendaEntrega").style.display = "none";

    document.getElementById("2headEV").style.display = "initial";

    document.getElementById("2tablaEntregaDet").style.display = "none";

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("2tablaEntVeh").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p>" +
        "<p><input id='2dpentFecIni' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p>" +
        "<p><input id='2dpentFecFin' style='max-width:120px' /></p>" +
        "</td> " +

        "<td><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='2rbEntregado_1' name='rbEntregado' value='0' onclick='volverForm2();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='2rbEntregado_2' name='rbEntregado' value='1' onclick='volverForm2();'> Entregado</p></td>" +


        "<td valign='bottom' style='text-align:right'>" +
        "<p>" +
         "<button id='btnBuscarAgecia0' onclick='entConsultar2();' class='w3-btn'><i id='2ocultar0' class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
        "&nbsp;&nbsp;<button id='btnBuscarAgecia1' class='w3-btn'><a id='2mostrar2' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='2ocultar2' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</p>" +
        "</td>" +
        "</tr>" +

        "<tr><td colspan='4'>" +

        "<div id='2divControlesEnt' style='display:initial' class='target02'>" + // mas controles    
        "<table width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p>" +
        "<p><input id='2entFacFis' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p>" +
        "<p><input id='2entIdCli' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p>" +
         "<p><input id='2entVin' style='max-width:150px' /></p>" +
        "</td>" +

        colorEstado03 +


        "</tr>" +
        "</table>" +
        "</div>" +
        "</td></tr>" +
         "</table>";

        document.getElementById("2btnFooterEntrega").innerHTML = "<button id='btnRegresarAgencia0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgencia0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";

    }
    else {
        document.getElementById("2tablaEntVeh").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p><p><input id='2dpentFecIni' style='max-width:100px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p><p><input id='2dpentFecFin' style='max-width:100px' /></p>" +
        "</td> " +
        "<td valign='bottom'>" +
        "<button onclick='entConsultar2();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i></button>&nbsp;" +
        "</td>" +
         "<td valign='bottom'>" +
        "<button id='btnBuscarAgecia0' class='w3-btn'><a id='2mostrar2' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='2ocultar2' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</td>" +
        "</tr>" +

         "<tr>" +
        "<td colspan='4'><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='2rbEntregado_1' name='rbEntregado' value='0' onclick='volverForm2();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='2rbEntregado_2' name='rbEntregado' value='1' onclick='volverForm2();'> Entregado</p></td>" +
        "</tr>" +

        "</table>" +
        "<div id='2divControlesEnt' style='display:initial' class='target02'>" + // mas controles    
        "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p></td><td><p><input id='2entFacFis' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p></td><td><p><input id='2entIdCli' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p></td><td><p><input id='2entVin' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "</table>" +
        "</div>";

        document.getElementById("2btnFooterEntrega").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i></button>";

    }
llamarColorTexto(".w3-text-red");
llamarNuevoestilo("btnBuscarAgecia");
llamarNuevoestiloIconB("2ocultar")
llamarNuevoestilo("btnRegresarAgencia");
llamarNuevoestiloIconB("icnRegresarAgencia")


    if (document.getElementById('2volver_ent').hasAttribute("onclick") == true) {
        document.getElementById('2volver_ent').removeAttribute("onclick");
    }
    document.getElementById("2volver_ent").href = "components/home/view.html";


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

    /*
    for (var i = 0; i < 7; i++) {
        if (i == 1) {
            // Toma el lunes por def.
            document.getElementById("2dpentFecIni").value = begin.format('DD-MM-YYYY');
            break;
        }
        //  alert(begin.format('DD-MM-YYYY'));
        begin.add('d', 1);
    }
    */

    //---------------------------------------------------------------------------------
    // fecha de inicio 7 dias atras de hoy
    var d = new Date();
    var x = sumarDias(d, -7);
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

    document.getElementById("2dpentFecIni").value = idia + "-" + imes + "-" + ianio;
    //---------------------------------------------------------------------------------

    $("#2dpentFecIni").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    document.getElementById("2dpentFecFin").value = dd + '-' + mm + '-' + yyyy;

    $("#2dpentFecFin").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target02').hide("fast");

    $(document).ready(function () {
        $("#2mostrar2").click(function () {
            $('#target02').show(1000);
            $('.target02').show("fast");
            $('.mostrar2').hide("fast");
            document.getElementById("2mostrar2").style.display = 'none';
            document.getElementById("2ocultar2").style.display = 'initial';
        });
        $("#2ocultar2").click(function () {
            $('#target02').hide(3000);
            $('.target02').hide("fast");
            document.getElementById("2mostrar2").style.display = 'initial';
            document.getElementById("2ocultar2").style.display = 'none';
        });
    });

}



function entConsultar2() {
try{
    document.getElementById("2headEV").style.display = "initial";
    document.getElementById("2tablaEntregaDet").style.display = "none";
    try {
        // Grid VIN
        var gridE1 = $("#2gridListaEntrega").data("kendoGrid");
        gridE1.destroy();
    }    catch (een1) {
        kendo.ui.progress($("#agenciaScreen"), false);
    }

    var dpentFecIni = document.getElementById("2dpentFecIni").value;
    var dpentFecFin = document.getElementById("2dpentFecFin").value;

    //  document.getElementById("2tablaEntregaDet").style.display = "none";
    // document.getElementById("2formEntrega").style.display = "none";

    if (validaFecha(dpentFecIni, dpentFecFin) == false) {
        kendo.ui.progress($("#agenciaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
        return;
    }else {
        cargaGridEntrega2();
    }
}catch(e){ alert(e);}
}



function cargaGridEntrega2() {
    kendo.ui.progress($("#agenciaScreen"), true);
    setTimeout(function () {
try {
    

        // precarga *********************************************************************************************

        var dpentFecIni = document.getElementById("2dpentFecIni").value;
        var dpentFecFin = document.getElementById("2dpentFecFin").value;
        var entFacFis = document.getElementById("2entFacFis").value;
        var entIdCli = document.getElementById("2entIdCli").value;
        var entVin = document.getElementById("2entVin").value;


        // rrppp
        var intEntregado = "0";
        var imgBotGrid = "fa fa-calendar-plus-o fa-lg";
        if (document.getElementById("2rbEntregado_2").checked == true) {
            intEntregado = "1";
            imgBotGrid = "fa fa-print fa-lg";
        }

        //   http://localhost:4044/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json;1;01;01;0;;0;;;;FACTURADO;jmera;29-01-2018;31-01-2018;

        //var UrlEntregas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json" + ";" +
        //localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        //localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        //localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        //"0" + ";" +
        //entFacFis + ";" +
        //"0" + ";" +
        //entVin + ";" +
        //entIdCli + ";" +
        //"" + ";" +
        //"FACTURADO" + ";" +
        //localStorage.getItem("ls_usulog").toLocaleString() + ";" +
        //dpentFecIni + ";" +
        //dpentFecFin + ";" +
        //intEntregado;


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

        //  anio_vh26\": 2018,\n    \"numero_factura_vh26\": 436,\n    \"secuencia_detalle_vh03\": 1,\n  


          //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlEntregas</center>", UrlEntregas);

        //// Si es No entregado va a la agenda
        //if (document.getElementById("2rbEntregado_1").checked == true) {
        //    agendaEntrega();
        //    kendo.ui.progress($("#agenciaScreen"), false);
        //    return;
        //}


        var errorConexEV = false;

        var infEntregas;
        $.ajax({
            url: UrlEntregas,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    // alert(inspeccionar(data));

                    if (inspeccionar(data).includes("tvh03") == true) {
                        infEntregas = (JSON.parse(data.vh03FacturasGetResult)).tvh03;
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlEntregas</center>", inspeccionar(infEntregas[0]));
                    }
                } catch (e) {
                    document.getElementById("2headEV").style.display = "initial";
                    document.getElementById("2tablaEntregaDet").style.display = "none";
                    //document.getElementById("2formEntrega").style.display = "none";
                    //document.getElementById("2divExplica").style.display = "none";

                    kendo.ui.progress($("#agenciaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (eEntrega) {

                document.getElementById("2headEV").style.display = "initial";
                document.getElementById("2tablaEntregaDet").style.display = "none";
                //document.getElementById("2formEntrega").style.display = "none";
                //document.getElementById("2divExplica").style.display = "none";

                errorConexEV = true;
                kendo.ui.progress($("#agenciaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
                return;
            }
        });

        if (errorConexEV == false) {

            if (inspeccionar(infEntregas).length > 0) {
                for (let index = 0; index < infEntregas.length; index++) {
                    var respuestaSGC = ConsultarSGcFactura(infEntregas[index]);
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

                //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                //    numeroFilasEnt = 23;
                //}


                numeroFilasEnt = 23;
                if (document.getElementById("2rbEntregado_1").checked == true) {

                    $("#2gridListaEntrega").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasEnt,
                            data: infEntregas,


                            //   group: { field: "nombre_entrega_vehiculo" },

                            //  group: { field: "fecha_factura" },
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
                           

                            //+++++++++++++++++++++++++++++++++++++++++++++++++++++

                            {
                                width: 15,
                                command: [{
                                    name: "agendar",
                                    text: "",
                                    imageClass: imgBotGrid, // "fa fa-calendar-plus-o fa-lg",
                                    visible: function (dataItem) { return dataItem.factura_sgc != "NO SGC" },

                                    click: function (emf07) {
                                        try {
                                            var dataItem7 = this.dataItem($(emf07.currentTarget).closest("tr"));
                                            emf07.preventDefault();

                                            // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", inspeccionar(dataItem7));

                                            //---------------------------------
                                            
                                            cargaInfoAgendaEntrega(dataItem7);

                                            //---------------------------------

                                            //  Ver formulario de entrega
                                            //   verForm(dataItem, false);
                                        }
                                        catch (ef07) {
                                            kendo.ui.progress($("#agenciaScreen"), false);
                                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>222 ALERTA</center>", ef07);
                                            return;
                                        }
                                    }
                                }],

                            },

                            //+++++++++++++++++++++++++++++++++++++++++++++++++++++
                             {
                                 width: 15,
                                 command: [{
                                     name: "forma",
                                     text: "",
                                     imageClass: "fa fa-trash-o fa-lg",
                                     visible: function (dataItem01) { return dataItem01.hora_cita_aux > 0 },

                                     click: function (emf01) {
                                         try {
                                             var dataItem01 = this.dataItem($(emf01.currentTarget).closest("tr"));
                                             emf01.preventDefault();

                                             //  Ver formulario de entrega
                                             //  verForm2(dataItem, false);


                                             kendo.confirm("<center><h1><i class=\"fa fa-calendar-times-o\"></i> ELIMINAR CITA</h1><br />Desea eliminar la cita ?</center>")
                                            .done(function () {
                                                onElimCita_2(dataItem01.fecha_cita_aux, dataItem01.hora_cita_aux); // RRP
                                                volverForm2();
                                            })
                                            .fail(function () {
                                                // Elimina el localstorage con la feha y hora de la cita
                                                //localStorage.removeItem("ls_citafechahora");
                                            });
                                            llamarColorBotonGeneral(".k-primary");

                                         }
                                         catch (ef01) {
                                             kendo.ui.progress($("#agenciaScreen"), false);
                                             window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef01);
                                             return;
                                         }
                                     }
                                 }],

                             },

                            //-----------------------------
                            {
                                field: "factura_sgc", title: "Factura SGC", width: 30, attributes: {
                                    style: "#= celdaColorFac(factura_sgc,observacion_sgc) #"
                                }
                            },
                             {
                                 field: "chasis", title: "Chasis", width: 30,
                                   template: "#= clienteVIP_EV(chasis, persona_clase) #",
                                 attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },


                             //{
                             //    field: "chasis", title: "Hora Cita", width: 25,
                             //    template: "#= formatoHoraAEV(hora_cita_aux)# ",
                             //    attributes: {
                             //        style: "#= celdaColor(hora_cita_aux) #"
                             //    }
                             //},


                             {
                                 field: "nombre_modelo", title: "Modelo", width: 30, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                             {
                                 field: "color_vehiculo", title: "Color", width: 30, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                             {
                                 field: "placa", title: "Placa", width: 25, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                          {
                              field: "nombre_cliente",
                              title: "Propietario",
                              groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                              width: colEnt2, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }

                          },
                          {
                              field: "identifica", title: "ID", width: 35, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }
                          },

                          {
                              field: "telefono_cliente", title: "Tel&#233;fono", width: 25, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }
                          },
                          {
                              field: "secuencia_factura", title: "Factura",
                              template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                              width: 40, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #" // "background-color:red;"
                              }

                          },

                         //  { field: "fecha_factura", title: "Fec.Fact.", width: 25 },

                           {
                               field: "fecha_cita_aux", title: "Fec.Cita", width: 25,
                               attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }

                           },
                           {
                               field: "hora_cita_aux", title: "Hora Cita", width: 25,
                               template: "#= formatoHoraAEV(hora_cita_aux)# ",
                               attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }
                           },


                           {
                               field: "forma_pago", title: "Forma Pago", width: 25, attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }
                           }
                            , {
                                field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true, attributes: {
                                    style: "#= celdaColor(hora_cita_aux) #"
                                }
                            }

                            // VIP
                            , {
                                field: "persona_clase", title: "VIP", width: 25, attributes: {
                                    style: "#= celdaColor(hora_cita_aux) #"
                                }
                            }

                            //-------------------------------
                        ]
                    });
                }
                else {

                    $("#2gridListaEntrega").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasEnt,
                            data: infEntregas,


                            //   group: { field: "nombre_entrega_vehiculo" },

                            //  group: { field: "fecha_factura" },
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


                            //+++++++++++++++++++++++++++++++++++++++++++++++++++++

                                                            {
                                                                width: 15,
                                                                command: [{
                                                                    name: "agendar",
                                                                    text: "",
                                                                    imageClass: imgBotGrid, // "fa fa-calendar-plus-o fa-lg",
                                                                    //   visible: function (dataItem) { return dataItem.estado_entrega.trim().length == 0 && dataItem.evaluado == false && dataItem.fecha_entrega === null },

                                                                    click: function (emf07) {
                                                                        try {
                                                                            var dataItem7 = this.dataItem($(emf07.currentTarget).closest("tr"));
                                                                            emf07.preventDefault();

                                                                            //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", inspeccionar(dataItem7));
                                                                            //---------------------------------

                                                                        //    cargaInfoAgendaEntrega(dataItem7);

                                                                            var urlSesEnt = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/4,json" + ";" +
                                                                           localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                                                                           localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                                                                           localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
                                                                           "0" + ";" +
                                                                           entFacFis + ";" +
                                                                           "0" + ";" +
                                                                           dataItem7.chasis + ";" +
                                                                           dataItem7.identifica + ";" +
                                                                           "" + ";" +
                                                                           "FACTURADO" + ";" +
                                                                           localStorage.getItem("ls_usulog").toLocaleString() + ";" +
                                                                           dpentFecIni + ";" +
                                                                           dpentFecFin + ";" +
                                                                           intEntregado;


                                                                            urlSesEnt += "|" + dpentFecIni + ";" + dpentFecFin + ";" + intEntregado;

                                                                            if (localStorage.getItem("ls_urlSesEnt") != undefined) {
                                                                                localStorage.removeItem("ls_urlSesEnt");
                                                                            }
                                                                            localStorage.setItem("ls_urlSesEnt", urlSesEnt);

                                                                          //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ls_urlSesEnt</center>", localStorage.getItem("ls_urlSesEnt").toLocaleString());
                                                                            
                                                                            abrirPagina("nuevoveh");

                                                                            //---------------------------------

                                                                            //  Ver formulario de entrega
                                                                            //   verForm(dataItem, false);
                                                                        }
                                                                        catch (ef07) {
                                                                            kendo.ui.progress($("#agenciaScreen"), false);
                                                                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef07);
                                                                            return;
                                                                        }
                                                                    }
                                                                }],

                                                            },

                            //+++++++++++++++++++++++++++++++++++++++++++++++++++++
                             {
                                 width: 1
                             },

                             {
                                field: "factura_sgc", title: "Factura SGC", width: 30, attributes: {
                                    style: "#= celdaColorFac(factura_sgc,observacion_sgc) #"
                                }
                            },
                            {
                                 field: "chasis", title: "Chasis", width: 30,
                                 template: "#= clienteVIP_EV(chasis, persona_clase) #",
                                 attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },


                             {
                                 field: "nombre_modelo", title: "Modelo", width: 30, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                             {
                                 field: "color_vehiculo", title: "Color", width: 30, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                             {
                                 field: "placa", title: "Placa", width: 25, attributes: {
                                     style: "#= celdaColor(hora_cita_aux) #"
                                 }
                             },
                          {
                              field: "nombre_cliente",
                              title: "Propietario",
                              groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                              width: colEnt2, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }
                          },
                          {
                              field: "identifica", title: "ID", width: 35, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }
                          },

                          {
                              field: "telefono_cliente", title: "Tel&#233;fono", width: 25, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #"
                              }
                          },
                          {
                              field: "secuencia_factura", title: "Factura",
                              template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                              width: 40, attributes: {
                                  style: "#= celdaColor(hora_cita_aux) #" // "background-color:red;"
                              }
                          },

                         //  { field: "fecha_factura", title: "Fec.Fact.", width: 25 },

                           {
                               field: "fecha_cita_aux", title: "Fec.Cita", width: 25,
                               attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }

                           },
                           {
                               field: "hora_cita_aux", title: "Hora Cita", width: 25,
                               template: "#= formatoHoraAEV(hora_cita_aux)# ",
                               attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }
                           },


                           {
                               field: "forma_pago", title: "Forma Pago", width: 25, attributes: {
                                   style: "#= celdaColor(hora_cita_aux) #"
                               }
                           }
                            , {
                                field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true, attributes: {
                                    style: "#= celdaColor(hora_cita_aux) #"
                                }
                            }

                            // VIP
                            , {
                                field: "persona_clase", title: "VIP", width: 25, attributes: {
                                    style: "#= celdaColor(hora_cita_aux) #"
                                }
                            }

                            //-------------------------------
                        ]
                    });
                  
                }

                //  document.getElementById("2tablaEntregaDet").style.display = "block";
                document.getElementById("2tablaEntregaDet").style.display = "initial";


            }
            else {

                document.getElementById("2tablaEntregaDet").style.display = "none";
                //document.getElementById("2formEntrega").style.display = "none";
                //document.getElementById("2divExplica").style.display = "none";



                var msjErrorEnt = "<center>No existen registros</center>";

                kendo.ui.progress($("#agenciaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjErrorEnt);
                return;
            }
        }

        kendo.ui.progress($("#agenciaScreen"), false);
        // precarga *********************************************************************************************
    } catch (error) {
    alert(error);
    kendo.ui.progress($("#agenciaScreen"), false);
    }
    }, 2000);

}
function celdaColorFac(fact, observa) {
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
function ConsultarSGcFactura(parametros) {
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
                 kendo.ui.progress($("#agenciaScreen"), false);
                 alert("Alerta en consulta OT", "mens"); kendo.ui.progress($("#lector_barrasScreen"), false); return;
             }
         });
     } catch (e) {
         kendo.ui.progress($("#agenciaScreen"), false);
         mens("Alerta de conexi" + String.fromCharCode(243) + "n a base", "mens"); kendo.ui.progress($("#lector_barrasScreen"), false); return;
     }
     return respuestaGara;
 }

function clienteVIP_EV(chasis, txtVip) {
    if (txtVip.trim() != "") {
        chasis = chasis + " <i id='icnVIP0' class='fa fa-flag fa-lg' aria-hidden='true' ></i>";
    }
llamarNuevoestiloIconB("icnVIP");
    return chasis;
}


function celdaColor(hora) {
    var colorCel = "background-color:transparent;";
    //if (parseInt(hora) > 0) {
    //    colorCel = "background-color:#BBFFBB;";
    //}

    //if (document.getElementById("2rbEntregado_1").checked == true) {
    //    if (parseInt(hora) > 0) {
    //        colorCel = "background-color:#BBFFBB;";
    //    }
    //}
    //else {
    //    colorCel = "background-color:#ffcc00;";
    //}

    //---------------------------------------------------------------------
    
    if (document.getElementById("2rbEntregado_1").checked == true) {
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
  //  ---------------------------------------------------------------------



    return colorCel;
}

function formatoHoraAEV(hora) {
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


function fechaActual() {
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

function agendaEntrega2(objEntrega, fechaBusqueda) {

    if (document.getElementById('2volver_ent').hasAttribute("href") == true) {
        document.getElementById("2volver_ent").removeAttribute("href");
    }
    document.getElementById('2volver_ent').setAttribute('onclick', 'volverForm2();')


    document.getElementById("2agendaEntrega").innerHTML = "";

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
    var hora_cita_aux = objEntrega.hora_cita_aux;

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


    arrAgendaGrl = getEvents2(document.getElementById("2datepicker").value, document.getElementById("2cboUsuarioEntrega").value);

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


    document.getElementById("2agendaEntrega").innerHTML = "<div class='mycalEnt2'></div>";

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
             //   alert(fecha_cita_aux + " " + hora_cita_aux);
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



}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: 
- Presenta la ventana para crear una nueva cita
- Solo se pueden crear citas con fecha y hora mayor a las actuales
Autor: RRP
--------------------------------------------------------------------*/
function confirmaCita2(titulo, contenido, startTime, objCitaEn) {
    
    if (verifFecHoraAgenda2(startTime) == true) {


        if (parseInt(objCitaEn.hora_cita_aux) == 0) {

            kendo.confirm("<center><h1><i class=\"fa fa-calendar-plus-o\"></i> NUEVA CITA</h1><br />" + contenido + "</center>")
                   .done(function () {
                       //localStorage.setItem("ls_nuevacita", "cita");
                       //localStorage.setItem("ls_citafechahora", startTime);
                       //localStorage.removeItem("ls_agendaplaca");
                       //  abrirPagina("admcita");

                       guardaCita2(startTime, objCitaEn);


                   })
                   .fail(function () {
                       // Elimina el localstorage con la feha y hora de la cita
                       //localStorage.removeItem("ls_citafechahora");
                   });
                   llamarColorBotonGeneral(".k-primary");
        }
        else {
            kendo.confirm("<center><h1><i class=\"fa fa-calendar-plus-o\"></i> CAMBIAR CITA</h1><br />" + contenido + "</center>")
       .done(function () {


        //   onElimCita_2(objCitaEn.fecha_cita_aux, objCitaEn.hora_cita_aux); // RRP

           if (onElimCita_2(objCitaEn.fecha_cita_aux, objCitaEn.hora_cita_aux) == true) {
               guardaCita2(startTime, objCitaEn);
           }

       })
       .fail(function () {
           // Elimina el localstorage con la feha y hora de la cita
           //localStorage.removeItem("ls_citafechahora");
       });
       llamarColorBotonGeneral(".k-primary");
        }
    }
    else {

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
        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

        var arrhm = hhmm.split(":");

        if (parseInt(arrhm[1]) >= 0 && parseInt(arrhm[1]) < 15) {
            arrhm[1] = "00";
        } else if (parseInt(arrhm[1]) >= 15 && parseInt(arrhm[1]) < 30) {
            arrhm[1] = "15";
        } else if (parseInt(arrhm[1]) >= 30 && parseInt(arrhm[1]) < 45) {
            arrhm[1] = "30";
        } else if (parseInt(arrhm[1]) >= 45) {
            arrhm[1] = "45";
        }

        hhmm = arrhm[0] + ":" + arrhm[1];

        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede registrar una cita<br />antes del <b>" + yyyy + "-" + mm + "-" + dd + " " + hhmm + "</b></center>");
    }
    dialog.data("kendoDialog").close();
}


function onElimCita_2(fecCita, horCita) {


    var numHH = horCita.toFixed(2);



  //  var arrCitaFH = localStorage.getItem("ls_citafechahora").toLocaleString().split(/\b(\s)/);
    var hCita = numHH

    var arrCitaOk = fecCita.trim().split("-");

    //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/3,json;" +
    // localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    // localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    // localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    // localStorage.getItem("ls_usulog").toLocaleString() + ";;;;RECEPCION;" +
    // arrCitaOk[1] + "-" + arrCitaOk[0] + "-" + arrCitaOk[2] + ";" +
    // hCita + ";";


    // http://186.71.21.170:8089/concesionario/Services/TL/Taller.svc/tl33CitasGet/3,json;1;01;01;INPSERCOM;;;;RECEPCION;29-06-2018;10.00;

    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/3,json;" +
     localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
     localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
     localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
     localStorage.getItem("ls_usulog").toLocaleString() + ";;;;ENTREGA_NUEVOS;" +
     arrCitaOk[2] + "-" + arrCitaOk[1] + "-" + arrCitaOk[0] + ";" +
     hCita + ";";


    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

     var bolR1 = false;

    var infor;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                // alert(inspeccionar(data));

                if (inspeccionar(data).includes("Success") == true) {
                  //  window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ELIMINADO</center>", "La cita fue eliminada correctamente");

                    bolR1 = true;

                  //  cargaAgenda(document.getElementById("datepicker").value);
                }
                else {
                    var arrEstado = inspeccionar(data).split(/\b(\s)/);
                    var arrEstado2 = arrEstado[4].split(",");
                    var miEst = arrEstado2[1].replace("Estado:", "");
                    /* alert(inspeccionar(arrEstado));
                    alert(miEst);
                    alert(inspeccionar(data)); */
                    if (inspeccionar(data).includes("ABIERTO") == false)
                    {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se ha podido eliminar la Cita<br />Estado: <b>" + inspeccionar(data).split(",")[1] + "</b></center>");
                    }
                    else {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se ha podido eliminar la Cita<br />" + inspeccionar(data) + "</center>");
                    }
                    return bolR1;
                }
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>Error durante el proceso.<br />" + e + "</center>");
                return bolR1;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante el proceso.<br />" + inspeccionar(err) + "</center>");
            return bolR1;
        }
    });


    return bolR1;
    
}



function verifFecHoraAgenda2(fAgenda) {

    var respValAgenda = false;

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
    var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" });

    if (new Date(fAgenda + ":00") >= new Date(yyyy + "-" + mm + "-" + dd + " " + hhmm + ":00")) {
        respValAgenda = true;
    }

    return respValAgenda;
}


// AGENDA ENTREG
function cargaInfoAgendaEntrega(dataGrid2) {

    document.getElementById("2datepicker").value = fechaActual();

    $("#2datepicker").kendoDatePicker({
        format: "dd-MM-yyyy",
        change: onChange_2,
        culture: "es-ES"
    });

    usuariosEntrega2();

    objEntregaGral = dataGrid2;

    agendaEntrega2(dataGrid2, document.getElementById("2datepicker").value);


    var htmlBotones = "";
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        htmlBotones = "<button id='btnRegresarAgencia0' onclick='volverForm2()' class='w3-btn'><i id='icnRegresarAgencia0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        htmlBotones = "<button id='btnRegresarAgencia0' onclick='volverForm2()' class='w3-btn'><i id='icnRegresarAgencia0' class='fa fa-chevron-left' aria-hidden='true'></i></button>";
    }

    document.getElementById("2btnFooterEntrega").innerHTML = htmlBotones;
    llamarNuevoestilo("btnRegresarAgencia");
    llamarNuevoestiloIconB("icnRegresarAgencia");

    var colorEstado02 = "";
    //var arrEstado02 = ["&nbsp;&nbsp;Abierto&nbsp;&nbsp;", "Procesado"];
    //var arrColor02 = ["#DFCEFF", "#ffcc00"];

    var arrEstado02 = ["&nbsp;&nbsp;Abierto&nbsp;&nbsp;", "Procesado", "&nbsp;&nbsp;&nbsp;VIP&nbsp;&nbsp;&nbsp;"];
    var arrColor02 = ["#DFCEFF", "#ffcc00", "#fb5d03d6"];


    var tamLetra02 = "font-size:11px;";
    for (var j = 0; j < arrEstado02.length; j++) {
        colorEstado02 = colorEstado02.concat("<label style='background-color: " + arrColor02[j] + "; padding:5px; border:solid 1px;" + tamLetra02 + "'>" + arrEstado02[j] + "</label>");
    }

    document.getElementById("divColor02").innerHTML = colorEstado02;


    //  document.getElementById("2tablaEntVeh").innerHTML = "";
    document.getElementById("2tablaEntregaDet").style.display = "none"; // grid
    document.getElementById("2tablaUsuEnt").style.display = "initial";
    document.getElementById("2agendaEntrega").style.display = "initial";
    document.getElementById("2tablaEntVeh").style.display = "none";

}


function usuariosEntrega2() {
     var cboUsuaux=0;
    var cboUsu;
    var UrlUsu = localStorage.getItem("ls_url2").toLocaleString() + "/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3," +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";;" + localStorage.getItem("ls_ussucursal").toLocaleString() +
    ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";ASESORES_ENT";
    $.ajax({
        url: UrlUsu,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboUsu = JSON.parse(data.Combotg23ProfesionalesGetResult);
                cboUsuaux=1;
            } catch (e) {
                kendo.ui.progress($("#agenciaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros de profesionales");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agenciaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
            return;
        }
    });

    if (cboUsuaux > 0) {
        var cboUsuHTML = "<select id='2cboUsuarioEntrega' class='w3-input w3-border' onchange='agendaEntrega2(objEntregaGral, document.getElementById(\"2datepicker\").value);'>";

        for (var i = 0; i < cboUsu.length; i++) {
            var arrUsuario = cboUsu[i].NombreClase.split(")");

            if (arrUsuario[0].replace("(", "").trim().toUpperCase() == localStorage.getItem("ls_usulog").toLocaleString().toUpperCase()) {
                cboUsuHTML += "<option  value='" + arrUsuario[0].replace("(", "") + "' selected>" + arrUsuario[1] + "</option>";
            }
            else {
                cboUsuHTML += "<option  value='" + arrUsuario[0].replace("(", "") + "'>" + arrUsuario[1] + "</option>";
            }
        }
        cboUsuHTML += "</select>";

        document.getElementById("2divListaUsuEntrega").innerHTML = cboUsuHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe conexi&oacute;n con el servicio Usuarios");
    }
}


/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: Creacion y modificacion de citas
Parametros: Campos
--------------------------------------------------------------------*/
function guardaCita2(startTime, objCitaEn) {
    try {
        var validaOT = "1";

        var hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth() + 1; //hoy es 0!
        var yyyy = hoy.getFullYear();
        var hora = hoy.getHours();
        var minuto = hoy.getMinutes();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        if (hora < 10) {
            hora = '0' + hora;
        }

        if (minuto < 10) {
            minuto = '0' + minuto;
        }

        var UrlGuardaCita = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasSet";


       //   var UrlGuardaCita = "http://localhost:4044/Services/TL/Taller.svc/tl33CitasSet"

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlGuardaCita);

        var codigo_empresa = localStorage.getItem("ls_idempresa").toLocaleString();
        var codigo_sucursal = localStorage.getItem("ls_ussucursal").toLocaleString();
        var codigo_taller = localStorage.getItem("ls_usagencia").toLocaleString();
        var tipo_atencion = "ENTREGA_NUEVOS";
        var persona_numero_profesional = ""; // ******** document.getElementById("persona_numero_profesional").value;//"0";

        var fhCita = startTime; // document.getElementById("dtpCitas2").value;

        if (fhCita.length == 16) {
            var arrfhCita = fhCita.split(/\b(\s)/);
            var entregaCita = fhCita.replace(arrfhCita[0], "");

            var arr2Fecha = arrfhCita[0].split('-');
            //  var fecha_cita = arr2Fecha[2] + "-" + arr2Fecha[1] + "-" + arr2Fecha[0];

            var fecha_cita = arr2Fecha[0] + "-" + arr2Fecha[1] + "-" + arr2Fecha[2];


            //  var fecha_cita = arrfhCita[0];

            var hora_cita = entregaCita.trim();
            hora_cita = hora_cita.replace(':', '.');

            var fecha_confirmacion = fecha_cita;
            var hora_confirmacion = hora_cita;
        }
        else {
            kendo.ui.progress($("#agenciaScreen"), false);
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione correctamente la Fecha y Hora de la Cita");
            return;
        }


        var persona_nombre_profesional = localStorage.getItem("ls_usunom").toLocaleString(); //"ANCHATUNA MONICA";

        // ESTADO:  var arrEstCita = ["ABIERTO", "CONFIRMADO", "CANCELADO", "PROCESADO"];

        var tipo_registro_cita = "PRESENCIAL";
        var estado = "CONFIRMADO";
        var seccion_orden_trabajo = "MECANICA"; // ""; ******
        var tipo_mantenimiento = "00000E00" // "";  ****
        var tipo_trabajo = "MP"; // ""; ****
        var calle_cliente = objCitaEn.calle_interseccion_cliente;
        var calle_interseccion = objCitaEn.calle_interseccion_cliente;
        var celular_cliente = objCitaEn.persona_telefono_movil;
        var chasis = objCitaEn.chasis;
        var codigo_marca = objCitaEn.codigo_marca;
        var codigo_modelo = objCitaEn.codigo_modelo;
        var color_vehiculo = objCitaEn.color_vehiculo;
        var direccion_cliente = objCitaEn.tipo_dir_cliente; // objCitaEn.direccion_cliente;
        var email_cliente = objCitaEn.mail_1;
        var persona_numero = objCitaEn.persona_numero;
        var nombre_propietario = objCitaEn.nombre_cliente;

        var identifica_cliente = objCitaEn.identifica;
        var nombre_cliente = objCitaEn.nombre_cliente;
        var persona_nacionalidad = objCitaEn.pais_cliente;
        var numero_calle = objCitaEn.numero_calle_cliente;
        var pais_cliente = objCitaEn.pais_cliente;
        var persona_tipo = objCitaEn.persona_tipo;
        var placa = objCitaEn.placa;


        var telefono_cliente = objCitaEn.telefono_cliente;

        var tipo_id_cliente = objCitaEn.tipo_id;

        var ciudad_cliente = objCitaEn.ciudad_cliente;


        var tipo_cita = "GESTION_INTERNA"; //********

        var anio_modelo = objCitaEn.anio_modelo;
        var reparaciones_solicitadas = "";
        var observacion = "";
        var usuario_confirmacion = localStorage.getItem("ls_usulog").toLocaleString();

        var prog_confirmacion = "";
        var numero_transaccion_reserva = 0;
        var anio_tl06 = 0;
        var numero_orden_tl06 = "";
        var secuencia_orden_tl06 = 0;
        var mail_enviado = "false";
        var require_taxi = "false";
        var anio_tl10 = 0;
        var secuencia_tl10 = 0;

        var fecha_creacion = yyyy + "-" + mm + "-" + dd;
        var hora_creacion = hora + ":" + minuto;
        var usuario_creacion = localStorage.getItem("ls_usulog_verif").toLocaleString(); // localStorage.getItem("ls_usulog").toLocaleString();

        var prog_creacion = "vtl69_01";

        var fecha_modificacion = yyyy + "-" + mm + "-" + dd;
        var hora_modificacion = hora + ":" + minuto;
        var usuario_modificacion = localStorage.getItem("ls_usulog").toLocaleString();

        var prog_modificacion = "vtl69_01";
        var fecha_cita_af = yyyy + "-" + mm + "-" + dd;
        var hora_cita_af = hora + "." + minuto;
        var clave_af = "";
        var agencia_af = "";
        var asesor_af = "";
        var transmitido_af = "false";
        var tipo_auto = "";

        var id_cita = "0"; //************

        //-------------------------------------------------------------------------

        if (parseInt(objCitaEn.hora_cita_aux) > 0) {
            var hCita = hora_cita.replace(':', '.');
            fhCitaReg = fecha_cita + "," + hCita;
            id_cita = fhCitaReg;
        }
        //-------------------------------------------------------------------------

        var params = {
            "codigo_empresa": codigo_empresa,
            "codigo_sucursal": codigo_sucursal,
            "codigo_taller": codigo_taller,
            "tipo_atencion": tipo_atencion,
            "persona_numero_profesional": persona_numero_profesional,
            "fecha_cita": fecha_cita,
            "hora_cita": hora_cita,
            "persona_nombre_profesional": persona_nombre_profesional,
            "estado": estado,
            "seccion_orden_trabajo": seccion_orden_trabajo,
            "tipo_mantenimiento": tipo_mantenimiento,
            "tipo_trabajo": tipo_trabajo,
            "calle_cliente": calle_cliente,
            "calle_interseccion": calle_interseccion,
            "celular_cliente": celular_cliente,
            "chasis": chasis,
            "codigo_marca": codigo_marca,
            "codigo_modelo": codigo_modelo,
            "color_vehiculo": color_vehiculo,
            "direccion_cliente": direccion_cliente,
            "email_cliente": email_cliente,
            "identifica_cliente": identifica_cliente,
            "persona_numero": persona_numero,
            "nombre_cliente": nombre_cliente,
            "nombre_propietario": nombre_propietario,
            "numero_calle": numero_calle,
            "persona_nacionalidad": persona_nacionalidad,
            "pais_cliente": pais_cliente,
            "persona_tipo": persona_tipo,
            "placa": placa,
            "telefono_cliente": telefono_cliente,
            "tipo_id_cliente": tipo_id_cliente,
            "ciudad_cliente": ciudad_cliente,
            "tipo_cita": tipo_cita,
            "anio_modelo": anio_modelo,
            "reparaciones_solicitadas": reparaciones_solicitadas,
            "observacion": observacion,
            "fecha_confirmacion": fecha_confirmacion,
            "hora_confirmacion": hora_confirmacion,
            "usuario_confirmacion": usuario_confirmacion,
            "prog_confirmacion": prog_confirmacion,
            "numero_transaccion_reserva": numero_transaccion_reserva,
            "anio_tl06": anio_tl06,
            "numero_orden_tl06": objCitaEn.almacen + "-" + objCitaEn.serie + "-" + objCitaEn.secuencia_factura, // numero_orden_tl06,  // *******
            "secuencia_orden_tl06": secuencia_orden_tl06,
            "mail_enviado": mail_enviado,
            "require_taxi": require_taxi,
            "anio_tl10": anio_tl10,
            "secuencia_tl10": secuencia_tl10,
            "fecha_creacion": fecha_creacion,
            "hora_creacion": hora_creacion,
            "usuario_creacion": usuario_creacion,
            "prog_creacion": prog_creacion,
            "fecha_modificacion": fecha_modificacion,
            "hora_modificacion": hora_modificacion,
            "usuario_modificacion": usuario_modificacion,
            "prog_modificacion": prog_modificacion,
            "fecha_cita_af": fecha_cita_af,
            "hora_cita_af": hora_cita_af,
            "clave_af": clave_af,
            "agencia_af": agencia_af,
            "asesor_af": asesor_af,
            "transmitido_af": transmitido_af,
            "tipo_auto": tipo_auto,
            "id_cita": id_cita,
            "tipo_registro_cita":tipo_registro_cita,
            "anio_vh26": objCitaEn.anio_vh26,
            "numero_factura_vh26": objCitaEn.numero_factura,
            "secuencia_detalle_vh03": objCitaEn.secuencia_detalle //,
            //   "numero_orden": objCitaEn.almacen + "-" + objCitaEn.serie + "-" + objCitaEn.secuencia_factura

        };

        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlGuardaCita);
        
        
        if (validaOT == "1") {

            kendo.ui.progress($("#agenciaScreen"), true);
            setTimeout(function () {
                // precarga *********************************************************************************************
              
                $.ajax({
                    url: UrlGuardaCita,
                    type: "POST",
                    data: JSON.stringify(params),
                    async: false,
                    dataType: "json",
                    //Content-Type: application/json
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success: function (data) {
                        
                        if (data.includes("Success") == true) {
                            try {
                                var resp = EnviarCitaEntrega(objCitaEn.id_orden_facturacion, params.fecha_cita);
                                // accionEnviaCorreoFIN(params);
                                volverForm2();                                
                                var nombre_cliente2 = nombre_cliente;
                                var infoOk = "<center>La Cita fue registrada correctamente para<br />" + "<b>" + nombre_cliente2 + "</b><br/>El d&iacute;a <b>" + fhCita + "</b></center>";

                                // RRP: 1,Success;Al enviar mail, no encuentra t�cnico 76594
                                if (data.includes(";") == true)
                                {
                                    var msjCorreo = data.split(";");
                                    infoOk += "<br /><center><b>ALERTA</b><br />" + msjCorreo[1] + "</center>";
                                }

                                window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> REGISTRADO</center>", infoOk);

                                //// Envia SMS
                                //var smsTexto = "KIA Motors. Entrega AUTO. Cita agendada. Fecha:" + fecha_cita + " Hora:" + hora_cita.replace(".", ":") + " Gracias";
                                //enviaSmsEv(celular_cliente, smsTexto);

                                return;
                            } catch (s) {
                                kendo.ui.progress($("#agenciaScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso.<br />" + s);
                                return;
                            }
                        }
                        else {
                            kendo.ui.progress($("#agenciaScreen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No fue ingresado el registro. <br />" + data.split(",")[2]);
                            return;
                        }
                    },
                    error: function (err) {
                        kendo.ui.progress($("#agenciaScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                        return;
                    }
                });

                kendo.ui.progress($("#agenciaScreen"), false);
                // precarga *********************************************************************************************
            }, 2000);
        }
        

    } catch (e) {
        kendo.ui.progress($("#agenciaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 1ERROR</center>", e);
        return;
    }
}
function EnviarCitaEntrega(id_orden_facturacion, fecha_cita) {
    var urlLogin;
    var urlEnvio;
    var clave;
    var usuarioEntrega;
    try {
        ConsultarParametroEntrega();
        var parametroCita = JSON.parse(localStorage.getItem("consultaCitasEntrega"));
        for (let index = 0; index < parametroCita.length; index++) {
            if (parametroCita[index].elemento == "URL_ENTREGA_CITAS_SQL") {
                if(ambiente == 1){
                    urlLogin = parametroCita[index].campo02.split(';')[0];
                    clave = parametroCita[index].campo02.split(';')[2];
                    usuarioEntrega = parametroCita[index].campo02.split(';')[1];
                    urlEnvio = parametroCita[index].programa;
                }else{
                    urlLogin = parametroCita[index].descrip2.split(';')[0];
                    clave = parametroCita[index].descrip2.split(';')[2];
                    usuarioEntrega = parametroCita[index].descrip2.split(';')[1];
                    urlEnvio = parametroCita[index].campo01; 
                }
            }
                      
        }
        var token = LoginCitasEntrega(urlLogin, clave,usuarioEntrega);
        var respuestaEntrega = EnvioCita(token, id_orden_facturacion, urlEnvio, fecha_cita);
        
    } catch (error) {
            alert(error);
    }
}
function EnvioCita(token, id_orden_facturacion, urlEnvio, fecha_cita) {
    var respuestaEnvio;
    try {
        var params = {
            "id": id_orden_facturacion, //ID ORDEN FACTURACIÓN
            "ddt1": fecha_cita, //FECHA CITA
            "dt1": localStorage.getItem("ls_usunom").toString(), //USUARIO
            "dt2": localStorage.getItem("ls_usunomcompleto").toString() //NOMBRE USUARIO
        };
        $.ajax({
            url: urlEnvio,
            type: "POST",
            async: false,
            dataType: "json",
            data : JSON.stringify(params),
            headers: {
                "Authorization": "Bearer "+token,
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (datas) {
                localStorage.setItem("respuestaEnvio", JSON.stringify(datas));
                respuestaEnvio=datas.dt1;
                
            },
            error: function (err) { alert(JSON.parse(err.responseText).dt1); respuestaEnvio =JSON.parse(err.responseText).dt1;
        } 
        });
        return respuestaEnvio;
    } catch (error) {
        alert(error);
    }
       
}
function LoginCitasEntrega(urlLogin, clave, usuarioEntrega) {
    var tokenEntregacita;
    try {
        var parametros = {
            "Dt1": usuarioEntrega,
            "Dt2": clave
        };
        $.ajax({
            url: urlLogin,
            type: "POST",
            async: false,
            dataType: "json",
            data : JSON.stringify(parametros),
            //Content-Type: application/json
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (datas) {
                localStorage.setItem("tokenEntrega", JSON.stringify(datas));
                tokenEntregacita = datas.dt100;
            },
            error: function (err) { alert("Error en servicio clientes");
        } 
        });
        return tokenEntregacita;
    } catch (error) {
        alert(error);
    }
}

function ConsultarParametroEntrega() {
    try {
        var accResp = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;URL_ENTREGA_CITAS_SQL";
        var respPar;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.ParametroEmpGetResult).tmpParamEmp;
                    localStorage.setItem("consultaCitasEntrega", JSON.stringify(accResp));
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>36 ERROR</center>", "parametrosEntregaCompletoOTCCL" + inspeccionar(e));
                    respPar = "error";
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>37 ERROR</center>", inspeccionar(err));
                respPar = "error";
            }
        });
        
        return respPar;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>38 ERROR</center>", f);
        return "error";
    }
}


function onChange_2() {
    // cargaAgenda(document.getElementById("datepicker").value);


    agendaEntrega2(objEntregaGral, document.getElementById("2datepicker").value);


}

// agencia 
function getEvents2(rangoAg, usuLogin) {

    var diasSemana = 7;
    var arrRango = rangoAg.split('-');
    rangoAg = arrRango[1] + "-" + arrRango[0] + "-" + arrRango[2];

    var date = moment(rangoAg);
    date.isoWeekday(diasSemana - 6);
    var sIni = date.format('DD-MM-YY');

    date.isoWeekday(diasSemana );
    var sFin = date.format('DD-MM-YY');


    //date.isoWeekday(diasSemana - 1);
    //var sFin = date.format('DD-MM-YY');

    // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl33CitasGet/1,json;1;01;01;jmera;;03-10-17;03-10-17;

    // Asigna el usuario seleccionado como usuario principal temporalmente
    localStorage.setItem("ls_usulog", usuLogin);

    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
      localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
      localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
      localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
      localStorage.getItem("ls_usulog").toLocaleString() + ";;" +
      sIni + ";" + sFin + ";"+
    "ENTREGA_NUEVOS;;;";

 //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>CALENDARIO ENTREGA_NUEVOS</center>", Url);

    var arrAgenda = [];

    var infor;
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",

        success: function (data) {
            try {
                if (data === undefined || data.tl33CitasGetResult === null) {
                    kendo.ui.progress($("#agenciaScreen"), false);
                  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No tiene Citas Registradas");
                    arrAgenda = [];
                    return;
                }
                else {
                    infor = (JSON.parse(data.tl33CitasGetResult)).ttl33;

                    var myObj, i, x = "";
                    var arrFec, arrHor;
                    for (i in infor) {

                        arrFec = infor[i].fecha_cita.split("-");

                        var horas = infor[i].hora_cita.toFixed(2);
                        var minFin = 59;

                        arrHor = horas.split(".");

                        if (parseInt(arrHor[1]) < 45) {
                            minFin = parseInt(arrHor[1]) + 15;
                        }

                        if (arrHor[0] < 10) {
                            arrHor[0] = "0" + arrHor[0];
                        }

                        var citaStart = arrFec[2] + "-" + arrFec[1] + "-" + arrFec[0] + " " + arrHor[0] + ":" + arrHor[1] + ":00"
                        var citaEnd = arrFec[2] + "-" + arrFec[1] + "-" + arrFec[0] + " " + arrHor[0] + ":" + minFin + ":00"

                        var colorAviso;

                        switch (infor[i].estado) {
                            case "CANCELADO":
                                colorAviso = "#ff0000";
                                break;
                            case "PROCESADO":
                                colorAviso = "#ffcc00";
                                break;
                            case "ABIERTO":
                                colorAviso = "#DFCEFF";
                                break;
                            case "CONFIRMADO":
                                colorAviso = "#00FF00";
                                break;
                            default:
                                colorAviso = "#ffffff";
                        }

                        var agContenido = "<b>" + infor[i].placa + "</b>";

                        var nombreCliente = infor[i].nombre_cliente;
                        var nombreModelo = infor[i].nombre_modelo;

                        //------------------------

                        var nombreChasis = infor[i].chasis;

                        var nombre_cliente = infor[i].nombre_cliente;
                        nombre_cliente = nombre_cliente.replace(/,/g, "&nbsp;");
                        if (nombre_cliente.length > 17) {
                            nombre_cliente = nombre_cliente.slice(0, 17);
                        }

                        var nombreModelo = infor[i].nombre_modelo;
                        if (nombreModelo.length > 17) {
                            nombreModelo = nombreModelo.slice(0, 17);
                        }

                        var tamLetra = "9";

                        //var agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "<br />" + nombre_cliente + "</div>";


                        //------------------------

                        var tamLetra = "10";
                        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
                            nombreModelo = nombreModelo.slice(0, 9) + "...";
                            nombreCliente = nombreCliente.slice(0, 18) + "...";
                            tamLetra = "9";
                        }

                        //    agContenido = "<div style='font-size:" + tamLetra + "px'>" + agContenido + "<br />" + nombreModelo + "</div>";

                        //  if (infor[i].placa.trim() == "") {
                        // colorAviso = "#FF80FF";


                        //  agContenido = "<b><div style='font-size:" + tamLetra + "px'>" + nombreCliente + "</div></b>";
                        agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "<br />" + nombre_cliente + "</div>";

                        //   }


                        //var fcEv = infor[i].fecha_cita;
                        //var hcEv = infor[i].hora_cita;

                        //if (fcEv.includes("-") == true) {
                        //    fcEv = fcEv.replace("-", ".");
                        //}

                        //if (hcEv.includes(".") == true)
                        //{
                        //    hcEv = hcEv.replace(".", ":");
                        //}

                        // RRP: 2018-06-28
                        var llaveAviso = "|" + infor[i].chasis + "-" +
                        nombreModelo + "-" +
                        infor[i].color_vehiculo + "-" +
                        nombre_cliente + "-" +
                        infor[i].celular_cliente;
                      //  + "-" + fcEv + "-" + hcEv;
                        
                        // Reemplaza todas las "," por " "
                        agContenido = agContenido.replace(/,/g, "&nbsp;");

                        arrAgenda.push(
                        {
                            id: infor[i].chasis + " " + citaStart + " " + infor[i].estado + llaveAviso,
                            title: agContenido,
                            start: citaStart,
                            end: citaEnd,
                            backgroundColor: colorAviso,
                            textColor: '#000'
                        }
                        );
                    }
                }
            } catch (e) {
                kendo.ui.progress($("#agenciaScreen"), false);
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agenciaScreen"), false);
            return;
        }
    });

    return arrAgenda;

}




function volverForm2() {
    usuPrincipal();


    entConsultar2();

    var htmlBotones = "";
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        htmlBotones = "<button id='btnRegresarAgencia0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgencia0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        htmlBotones = "<button id='btnRegresarAgencia0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarAgencia0' class='fa fa-chevron-left' aria-hidden='true'></i></button>";
    }
    
    document.getElementById("2btnFooterEntrega").innerHTML = htmlBotones;
    llamarNuevoestilo("btnRegresarAgencia");
    llamarNuevoestiloIconB("icnRegresarAgencia");
    document.getElementById("2agendaEntrega").innerHTML = "";

    //document.getElementById("2formEntrega").style.display = "none";
    //document.getElementById("2divExplica").style.display = "none";


    document.getElementById("2tablaEntregaDet").style.display = "initial"; // grid
    document.getElementById("2tablaUsuEnt").style.display = "none";
    document.getElementById("2agendaEntrega").style.display = "none";
    document.getElementById("2tablaEntVeh").style.display = "initial";


    if (document.getElementById('2volver_ent').hasAttribute("onclick") == true) {
        document.getElementById('2volver_ent').removeAttribute("onclick");
    }
    document.getElementById("2volver_ent").href = "components/home/view.html";

}






function accionEnviaCorreoFIN(objParam) { //cuerpo, observaciones, adjuntos) {

    var receptor_2 = "";

    var emisor = localStorage.getItem("ls_usumail").toLocaleString();

    // var receptor =  "raul.rodriguez@inpsercom.com;mercedes@mail.com";
    var receptor = objParam.email_cliente;
    if (receptor.includes(";") == true) {
        receptor = receptor.replace(";", ",");
    }

    emisor = "edison.baquero@inpsercom.com";
    receptor = "raul.rodriguez@inpsercom.com;mercedes@mail.com";

    var cuerpo = "";
    var observaciones = "";

    var asunto = "Cita para entrega de VEHICULO NUEVO"; // + mailOT;


    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/mv/Moviles.svc/EnvioMailSet";


    var adjuntos = ""; // "C:\SZECU00920.b2d.ford.com.p7b";

      window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> accionEnviaCorreo</center>", Url);

    var d = new Date();
    var intHour = parseInt(d.getHours());

    var saludo = "Buenos d&#237;as";

    if (intHour > 11) {
        saludo = "Buenas tardes";
    }


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var emNombre = objParam.nombre_cliente.replace(/,/g, "&nbsp;");

    //cuerpo = "<div style='font-family:Arial;font-size:12px'>" +
    // saludo + " Sr(a). " + emNombre + "," + "<br/>" +
    //"Ahora est&#225; m&#225;s cerca de recibir su nuevo KIA" + "<br/>" + "<br/>" +
    //"Soy " + localStorage.getItem("ls_usunom").toLocaleString() + ", me encargar&#233; de realizar la entrega de su veh&#237;culo." + "<br/>" + "<br/>" +
    //"De acuerdo a lo conversado le esperamos: " +
    //"<br/>" + "<br/>" +
    //"<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
    //"<tr><td>" + "<b>Fecha de entrega:</b> " + "</td><td>&nbsp;</td><td>" + objParam.fecha_cita + "</td></tr>" +
    //"<tr><td>" + "<b>Horario:</b> " + "</td><td>&nbsp;</td><td>" + objParam.hora_cita.replace(".", ":") + "</td></tr>" +
    //"<tr><td>" + "<b>Modelo:</b> " + "<b>Modelo:</b> " + "</td><td>&nbsp;</td><td>" + objParam.tipo_trabajo + "</td></tr>" +
    //"<tr><td>" + "<b>Versi&oacute;n:</b> " + "<b>Modelo:</b> " + "</td><td>&nbsp;</td><td>" + objParam.reparaciones_solicitadas + "</td></tr>" +
    //"<tr><td>" + "<b>Lugar:</b> " + "</td><td>&nbsp;</td><td>" + localStorage.getItem("ls_usagencianom").toLocaleString() + "</td></tr>" +
    //"</table>" +
    //"<hr style='color:#000000' /> " +
    //"<div style='font-family:Arial;font-size:9px'>" +
    //"Si tiene alguna duda, comun&#237;quese conmigo:" + "<br/>" +
    //"Tel&#233;fono:" + "<br/>" +
    //"0994782819" + "<br/>" +
    //"<br/>" +
    //"Email:" + "<br/>" +
    //localStorage.getItem("ls_usumail").toLocaleString() + "<br/>" +
    //"<br/>" +
    //"<br/>" +
    //"Concesionario:" + "<br/>" +
    //localStorage.getItem("ls_usagencianom").toLocaleString() + "<br/>" +
    //"<br/>" +
    //"Lugar: " +
    //"</div>";

      window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> MAIL</center>", cuerpo);


    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    var millave = "json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_usulog").toLocaleString();

    var paramsM1 = {
        "imodo": 1,
        "cllave": millave,// "",
        "emisor": emisor,
        "receptor": receptor,
        "asunto": asunto,
        "cuerpo": cuerpo,
        "observaciones": observaciones,
        "adjuntos": adjuntos,
        "imagenes": "",
        "videos": "",
        "otros": ""
    };

  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(paramsM1));

    $.ajax({
        url: Url,
        type: "POST",
        data: JSON.stringify(paramsM1),
        dataType: "json",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        success: function (data) {
            try {

              //  alert(data);

                var respMail = JSON.stringify(data);
                if (respMail.includes("Enviado")) {

                    //  window.myalert("<center><i class=\"fa fa-paper-plane\"></i> ENVIADO</center>", "El mensaje fue enviado correctamente");

                }
                else {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");
                    return;
                }
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");
            return;
        }
    });

}
      



// END_CUSTOM_CODE_home