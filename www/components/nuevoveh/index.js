/*=======================================================================
Fecha: 20/03/2018
=========================================================================
ENTREGA DE VEHICULOS
=========================================================================
Detalles: 
- Grid de autos facturados
- Formulario de preguntas
- Captura y sube la imagen al repositorio
- Calendario de citas de entrega
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

// --------------------------------------------------------------------------
// Valores por default
// --------------------------------------------------------------------------
var validaProceAgendaEV = true;
// --------------------------------------------------------------------------

app.nuevoveh = kendo.observable({
    onShow: function () {
       
      llamarColorTexto(".w3-text-red");
      llamarNuevoestilo("lydEntrega");
      var arrLi = ["li_ev1","liev2","li_ev4", "li_ev6","li_ev5","li_ev8","liev3"];
      var idLi = 1;
      for (var x = 0; x < arrLi.length; x++) {
          document.getElementById(arrLi[x]).removeAttribute("style");
           if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
              document.getElementById("l" + idLi).style.fontSize = "12px";
              idLi++;
          }
      }
        if (localStorage.getItem("ls_urlSesEnt") != undefined) {
           
            document.getElementById("2agendaEntregaE1").style.display = "none";
            vistaParametrosEntVeh();
            verFormDesdeAgendaEV(localStorage.getItem("ls_urlSesEnt").toLocaleString());

        }
        else {
            
            document.getElementById("divColor01").innerHTML = "";
            document.getElementById("2agendaEntregaE1").style.display = "initial";

            cargaInfoAgendaEntrega_2();
            vistaParametrosEntVeh();


        }

    },
    afterShow: function () { }
});
app.localization.registerView('nuevoveh');

// START_CUSTOM_CODE_nuevoveh
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


function verFormDesdeAgendaEV(urlAgendaEV) {
    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", urlAgendaEV);

    document.getElementById("rbEntregado_2").checked = true;

    var arrUrlEV = urlAgendaEV.split("|");

  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> arrUrlEV[0]</center>", arrUrlEV[0]);


    var infEntregas;
    $.ajax({
        url: arrUrlEV[0],
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                if (inspeccionar(data).includes("tvh03") == true) {
                    infEntregas = (JSON.parse(data.vh03FacturasGetResult)).tvh03;

                    if (inspeccionar(infEntregas[0]).length > 0) {
                          //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", inspeccionar(infEntregas[0]));
                        verForm(infEntregas[0], true);
                    }
                }
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                return;
            }
        },
        error: function (eEntrega) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
            return;
        }
    });


}

function vistaParametrosEntVeh() {

    //document.getElementById("tablaEntregaDet").style.display = "initial";
    //document.getElementById("formEntrega").style.display = "none";
    document.getElementById("headEV").style.display = "initial";

    document.getElementById("tablaEntregaDet").style.display = "none";
    document.getElementById("formEntrega").style.display = "none";
    document.getElementById("divExplica").style.display = "none";
    document.getElementById("playVideo_ev").innerHTML = "";
    document.getElementById('fileOT_ev').value = "";

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("tablaEntVeh").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p>" +
        "<p><input id='dpentFecIni' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p>" +
        "<p><input id='dpentFecFin' style='max-width:120px' /></p>" +
        "</td> " +

        "<td><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='rbEntregado_1' name='rbEntregado' value='0' onclick='volverForm();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='rbEntregado_2' name='rbEntregado' value='1' onclick='volverForm();'> Entregado</p></td>" +


        "<td valign='bottom' style='text-align:right'>" +
        "<p>" +
         "<button onclick='entConsultar();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i> BUSCAR</button>" +
        "&nbsp;&nbsp;<button class='w3-btn w3-red'><a id='mostrar2' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='ocultar2' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</p>" +
        "</td>" +
        "</tr>" +

        "<tr><td colspan='4'>" +

        "<div id='divControlesEnt' style='display:initial' class='target2'>" + // mas controles    
        "<table width='100%' align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p>" +
        "<p><input id='entFacFis' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p>" +
        "<p><input id='entIdCli' style='max-width:120px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p>" +
         "<p><input id='entVin' style='max-width:150px' /></p>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>" +
        "</td></tr>" +
         "</table>";

        document.getElementById("btnFooterEntrega").innerHTML = "<button id='btnRegrearEntrega0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
        llamarNuevoestiloIconB("icnRegrearEntrega");
        llamarNuevoestilo("btnRegrearEntrega");
        //document.getElementById("btnFooterEntrega").innerHTML += "<a class='w3-btn w3-red primary' aria-label='Buscar2' onclick='captureImagenEV();'><i class='fa fa-camera-retro' aria-hidden='true'></i> foto</a>";

    }
    else {
        document.getElementById("tablaEntVeh").innerHTML = "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>Inicio</b></label></p><p><input id='dpentFecIni' style='max-width:100px' /></p>" +
        "</td> " +
        "<td>" +
        "<p><label class='w3-text-red'><b>Fin</b></label></p><p><input id='dpentFecFin' style='max-width:100px' /></p>" +
        "</td> " +
        "<td valign='bottom'>" +
        "<button onclick='entConsultar();' class='w3-btn w3-red'><i class='fa fa-search' aria-hidden='true'></i></button>&nbsp;" +
        "</td>" +
         "<td valign='bottom'>" +
        "<button class='w3-btn w3-red'><a id='mostrar2' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='ocultar2' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a></button>" +
        "</td>" +
        "</tr>" +

         "<tr>" +
        "<td colspan='4'><p><label class='w3-text-red'><b>Estado</b></label></p><p><input type='radio' id='rbEntregado_1' name='rbEntregado' value='0' onclick='volverForm();' checked> No Entregado&nbsp;&nbsp;" +
        "<input type='radio' id='rbEntregado_2' name='rbEntregado' value='1' onclick='volverForm();'> Entregado</p></td>" +
        "</tr>" +

        "</table>" +
        "<div id='divControlesEnt' style='display:initial' class='target2'>" + // mas controles    
        "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>N&#186; Factura Fis&#237;ca</b></label></p></td><td><p><input id='entFacFis' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>ID Cliente</b></label></p></td><td><p><input id='entIdCli' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<p><label class='w3-text-red'><b>VIN</b></label></p></td><td><p><input id='entVin' style='max-width:180px' /></p>" +
        "</td> " +
        "</tr>" +
        "</table>" +
        "</div>";

        document.getElementById("btnFooterEntrega").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i></button>";

        //  document.getElementById("btnFooterEntrega").innerHTML += "<a class='w3-btn w3-red primary' aria-label='Buscar2' onclick='captureImagenEV();'><i class='fa fa-camera-retro' aria-hidden='true'></i> foto</a>";
    }

    //   document.getElementById("div_volver_ent").innerHTML = "<a id='volver_ent' data-align='right' class='fa fa-reply' href='components/home/view.html' aria-hidden='true' data-role='button'></a>";
    document.getElementById("volver_ent").removeAttribute("href");
    document.getElementById('volver_ent').removeAttribute("onclick");
    document.getElementById("volver_ent").href = "components/home/view.html";

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
            // INICIO
            document.getElementById("dpentFecIni").value = begin.format('DD-MM-YYYY');
            break;
        }
        //  alert(begin.format('DD-MM-YYYY'));
        begin.add('d', 1);
    }





    $("#dpentFecIni").kendoDatePicker({
        format: "dd-MM-yyyy",
    });

    // FIN
    document.getElementById("dpentFecFin").value = dd + '-' + mm + '-' + yyyy;

    $("#dpentFecFin").kendoDatePicker({
        format: "dd-MM-yyyy",
    });


    $('.target2').hide("fast");

    $(document).ready(function () {
        $("#mostrar2").click(function () {
            $('#target2').show(1000);
            $('.target2').show("fast");
            $('.mostrar2').hide("fast");
            document.getElementById("mostrar2").style.display = 'none';
            document.getElementById("ocultar2").style.display = 'initial';
        });
        $("#ocultar2").click(function () {
            $('#target2').hide(3000);
            $('.target2').hide("fast");
            document.getElementById("mostrar2").style.display = 'initial';
            document.getElementById("ocultar2").style.display = 'none';
        });
    });
}

function entConsultar() {

    document.getElementById("headEV").style.display = "initial";
    document.getElementById("tablaEntregaDet").style.display = "none";
    document.getElementById("formEntrega").style.display = "none";
    document.getElementById("divExplica").style.display = "none";
    document.getElementById('fileOT_ev').value = "";

    try {
        // Grid VIN
        var gridE1 = $("#gridListaEntrega").data("kendoGrid");
        gridE1.destroy();
    }
    catch (een1) {
        kendo.ui.progress($("#nuevovehScreen"), false);
    }

    var dpentFecIni = document.getElementById("dpentFecIni").value;
    var dpentFecFin = document.getElementById("dpentFecFin").value;

    //  document.getElementById("tablaEntregaDet").style.display = "none";
    // document.getElementById("formEntrega").style.display = "none";

    if (validaFecha(dpentFecIni, dpentFecFin) == false) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
        return;
    }
    else {

        cargaGridEntrega();

        //if (document.getElementById("rbEntregado_2").checked == true) {
        //    cargaGridEntrega();
        //}
        //else {
        //    agendaEntrega();
        //}
    }
}

function cargaGridEntrega() {
    kendo.ui.progress($("#nuevovehScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

        var dpentFecIni = document.getElementById("dpentFecIni").value;
        var dpentFecFin = document.getElementById("dpentFecFin").value;
        var entFacFis = document.getElementById("entFacFis").value;
        var entIdCli = document.getElementById("entIdCli").value;
        var entVin = document.getElementById("entVin").value;


        // rrppp
        var intEntregado = "0";
        var imgBotGrid = "fa fa-calculator fa-lg";
        if (document.getElementById("rbEntregado_2").checked == true) {
            intEntregado = "1";
            imgBotGrid = "fa fa-print fa-lg";
        }

        //   http://localhost:4044/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json;1;01;01;0;;0;;;;FACTURADO;jmera;29-01-2018;31-01-2018;

        var UrlEntregas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json" + ";" +
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

     //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> GRID</center>", UrlEntregas);

        // http:/192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json;1;01;01;0;;0;;;;FACTURADO;jmera;25-02-2017;26-02-2017;

        //// Si es No entregado va a la agenda
        //if (document.getElementById("rbEntregado_1").checked == true) {
        //    agendaEntrega();
        //    kendo.ui.progress($("#nuevovehScreen"), false);
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
                        /* window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> GRID</center>", inspeccionar(infEntregas)); */
                    }
                } catch (e) {
                    document.getElementById("headEV").style.display = "initial";
                    document.getElementById("tablaEntregaDet").style.display = "none";
                    document.getElementById("formEntrega").style.display = "none";
                    document.getElementById("divExplica").style.display = "none";

                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (eEntrega) {

                document.getElementById("headEV").style.display = "initial";
                document.getElementById("tablaEntregaDet").style.display = "none";
                document.getElementById("formEntrega").style.display = "none";
                document.getElementById("divExplica").style.display = "none";

                errorConexEV = true;
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
                return;
            }
        });

        if (errorConexEV == false) {

            if (inspeccionar(infEntregas).length > 0) {
                var numeroFilasEnt = 5;
                var colEnt1 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 7) / 100;
                var colEnt2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 5) / 100;

                //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                //    numeroFilasEnt = 23;
                //}

                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {

                    numeroFilasEnt = 23;

                    if (document.getElementById("rbEntregado_1").checked == true) {

                        $("#gridListaEntrega").kendoGrid({
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
                                {
                                    width: 15,
                                    command: [{
                                        name: "forma",
                                        text: "",
                                        imageClass: imgBotGrid,
                                        visible: function (dataItem) { return dataItem.estado_entrega.trim().length == 0 && dataItem.evaluado == false && dataItem.fecha_entrega === null },

                                        click: function (emf01) {
                                            try {
                                                var dataItem = this.dataItem($(emf01.currentTarget).closest("tr"));
                                                emf01.preventDefault();

                                                //  Ver formulario de entrega
                                                verForm(dataItem, false);
                                            }
                                            catch (ef01) {
                                                kendo.ui.progress($("#nuevovehScreen"), false);
                                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef01);
                                                return;
                                            }
                                        }
                                    }],

                                },


                                //-----------------------------
                                 { field: "chasis", title: "Chasis", width: 30 },
                                 { field: "nombre_modelo", title: "Modelo", width: 30 },
                                 { field: "color_vehiculo", title: "Color", width: 30 },
                                 { field: "placa", title: "Placa", width: 25 },
                              {
                                  field: "nombre_cliente",
                                  title: "Propietario",
                                  groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                  width: colEnt2
                              },
                              { field: "identifica", title: "ID", width: 35 },

                              { field: "telefono_cliente", title: "Tel&#233;fono", width: 25 },
                                                              {
                                                                  field: "secuencia_factura", title: "Factura",
                                                                  template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                                                                  width: 40
                                                              },

                               { field: "fecha_factura", title: "Fec.Fact.", width: 25 },
                               { field: "forma_pago", title: "Forma Pago", width: 25 }
                                , { field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true }

                                                         //,  { field: "fecha_entrega", title: "Entregado", width: 30 }


                                //-------------------------------


                          //  {
                          //      field: "secuencia_factura", title: "Factura",
                          //      template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                          //      width: 40
                          //  },
                          //  { field: "fecha_factura", title: "Facturado", width: 30 },
                          //  {
                          //      field: "nombre_cliente",
                          //      title: "Propietario",
                          //      groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                          //      width: colEnt2
                          //  },
                          //  { field: "identifica", title: "ID", width: 35 },
                          //  { field: "placa", title: "Placa", width: 25 },
                          //  { field: "nombre_modelo", title: "Modelo", width: 30 },
                          //  { field: "color_vehiculo", title: "Color", width: 30 },
                          //  { field: "fecha_entrega", title: "Entregado", width: 30 }

                          //, { field: "nombre_entrega_vehiculo", title: "ENTREGADO POR", width: 30, hidden: true }

                            //-------------------

                            //,{ field: "chasis", title: "chasis", width: 30 },
                            //{ field: "fecha_entrega", title: "fecha_entrega", width: 30 },
                            //{ field: "estado_entrega", title: "estado_entrega", width: 30 },
                            //{ field: "evaluado", title: "evaluado", width: 30 }
                            ]
                        });
                    }
                    else {


                        $("#gridListaEntrega").kendoGrid({
                            dataSource: {
                                pageSize: numeroFilasEnt,
                                data: infEntregas,
                                group: { field: "nombre_entrega_vehiculo" },

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
                                {
                                    width: 15,
                                    command: [{
                                        name: "forma",
                                        text: "",
                                        imageClass: imgBotGrid,
                                        visible: function (dataItem) { return dataItem.estado_entrega == "ENTREGADO" && dataItem.evaluado == true },

                                        click: function (emf01) {
                                            try {
                                                var dataItem = this.dataItem($(emf01.currentTarget).closest("tr"));
                                                emf01.preventDefault();

                                                // Vista previa
                                                verForm(dataItem, true);
                                            }
                                            catch (ef01) {
                                                kendo.ui.progress($("#nuevovehScreen"), false);
                                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef01);
                                                return;
                                            }
                                        }
                                    }],

                                },


                                                                    //-----------------------------
                            { field: "chasis", title: "Chasis", width: 30 },
                            { field: "nombre_modelo", title: "Modelo", width: 30 },
                            { field: "color_vehiculo", title: "Color", width: 30 },
                             { field: "placa", title: "Placa", width: 25 },
                              {
                                  field: "nombre_cliente",
                                  title: "Propietario",
                                  groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                                  width: colEnt2
                              },
                              { field: "identifica", title: "ID", width: 35 },

                              { field: "telefono_cliente", title: "Tel&#233;fono", width: 25 },
                               {
                                   field: "secuencia_factura", title: "Factura",
                                   template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                                   width: 40
                               },

                               { field: "fecha_factura", title: "Fec.Fact.", width: 25 },
                               { field: "forma_pago", title: "Forma Pago", width: 25 }
                               , {
                                   field: "nombre_entrega_vehiculo", title: "ENTREGADO POR: ", width: 30, hidden: true
                               }

                               //, { field: "fecha_entrega", title: "Entregado", width: 30 }


                                //-------------------------------



                          //  {
                          //      field: "secuencia_factura", title: "Factura",
                          //      template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                          //      width: 40
                          //  },
                          //  { field: "fecha_factura", title: "Facturado", width: 30 },
                          //  {
                          //      field: "nombre_cliente",
                          //      title: "Propietario",
                          //      groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #",
                          //      width: colEnt2
                          //  },
                          //  { field: "identifica", title: "ID", width: 35 },
                          //  { field: "placa", title: "Placa", width: 25 },
                          //  { field: "nombre_modelo", title: "Modelo", width: 30 },
                          //  { field: "color_vehiculo", title: "Color", width: 30 },
                          //  { field: "fecha_entrega", title: "Entregado", width: 30 }

                          //, { field: "nombre_entrega_vehiculo", title: "ENTREGADO POR", width: 30, hidden: true }

                           // -------------------

                           //,{ field: "chasis", title: "chasis", width: 30 },
                           // { field: "fecha_entrega", title: "fecha_entrega", width: 30 },
                           // { field: "estado_entrega", title: "estado_entrega", width: 30 },
                           // { field: "evaluado", title: "evaluado", width: 30 },
                            ]
                        });
                    }
                }
                else {

                    if (document.getElementById("rbEntregado_1").checked == true) {

                        $("#gridListaEntrega").kendoGrid({
                            dataSource: {
                                pageSize: numeroFilasEnt,
                                data: infEntregas,
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
                                {
                                    width: 15,
                                    command: [{
                                        name: "forma",
                                        text: "",
                                        imageClass: imgBotGrid,
                                        visible: function (dataItem) { return dataItem.estado_entrega.trim().length == 0 && dataItem.evaluado == false && dataItem.fecha_entrega === null },

                                        click: function (emf01) {
                                            try {
                                                var dataItem = this.dataItem($(emf01.currentTarget).closest("tr"));
                                                emf01.preventDefault();

                                                //  Ver formulario de entrega
                                                verForm(dataItem, false);
                                            }
                                            catch (ef01) {
                                                kendo.ui.progress($("#nuevovehScreen"), false);
                                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef01);
                                                return;
                                            }
                                        }
                                    }],

                                },
                            {
                                field: "secuencia_factura", title: "Factura",
                                template: "#=almacen#-#=serie#-0000#=secuencia_factura# ",
                                width: colEnt2
                            },

                            {
                                field: "nombre_cliente", title: "Propietario",
                                template: "#=nombre_cliente# <br/><b>ID: </b> #=identifica#",
                                width: 40
                            },

                            {
                                field: "placa", title: "Placa",
                                template: "#=placa# <br/><b>Modelo: </b>#=nombre_modelo# <br/><b>Color: </b>#=color_vehiculo#",
                                width: 30
                            }

                            //-------------------

                            //,{ field: "chasis", title: "chasis", width: 30 },
                            //{ field: "fecha_entrega", title: "fecha_entrega", width: 30 },
                            //{ field: "estado_entrega", title: "estado_entrega", width: 30 },
                            //{ field: "evaluado", title: "evaluado", width: 30 }
                            ]
                        });
                    }
                    else {

                        $("#gridListaEntrega").kendoGrid({
                            dataSource: {
                                pageSize: numeroFilasEnt,
                                data: infEntregas,
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
                                {
                                    width: 15,
                                    command: [{
                                        name: "forma",
                                        text: "",
                                        imageClass: imgBotGrid,
                                        visible: function (dataItem) { return dataItem.estado_entrega == "ENTREGADO" && dataItem.evaluado == true },

                                        click: function (emf01) {
                                            try {
                                                var dataItem = this.dataItem($(emf01.currentTarget).closest("tr"));
                                                emf01.preventDefault();

                                                // Vista previa
                                                verForm(dataItem, true);
                                            }
                                            catch (ef01) {
                                                kendo.ui.progress($("#nuevovehScreen"), false);
                                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", ef01);
                                                return;
                                            }
                                        }
                                    }],

                                },

                            {
                                field: "secuencia_factura", title: "Factura",
                                template: "#=almacen#-#=serie#-0000#=secuencia_factura# <br/><b>Fec. </b>#=fecha_factura#",
                                width: colEnt2
                            },

                            {
                                field: "nombre_cliente", title: "Propietario",
                                template: "#=nombre_cliente# <br/><b>ID: </b> #=identifica#",
                                width: 40
                            },

                            {
                                field: "placa", title: "Placa",
                                template: "#=placa# <br/><b>Modelo: </b>#=nombre_modelo# <br/><b>Color: </b>#=color_vehiculo#",
                                width: 30
                            }

                           // -------------------

                           //,{ field: "chasis", title: "chasis", width: 30 },
                           // { field: "fecha_entrega", title: "fecha_entrega", width: 30 },
                           // { field: "estado_entrega", title: "estado_entrega", width: 30 },
                           // { field: "evaluado", title: "evaluado", width: 30 },
                            ]
                        });


                    }
                }
                //  document.getElementById("tablaEntregaDet").style.display = "block";
                document.getElementById("tablaEntregaDet").style.display = "initial";

            }
            else {

                document.getElementById("tablaEntregaDet").style.display = "none";
                document.getElementById("formEntrega").style.display = "none";
                document.getElementById("divExplica").style.display = "none";

                var msjErrorEnt = "<center>No existen registros</center>";

                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", msjErrorEnt);
                return;
            }
        }

        kendo.ui.progress($("#nuevovehScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);

}


function replaceString(value) {
    return value.replace(",", "<br />");
}

function cboCargaEV(idCombo, arrCombo, selItem, divCombo) {
    var cboAgenciaHTML = "";

    cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos'>";

    if (idCombo == "tipo_id_cliente") {
        cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos' onchange='cboEVNacionalidad(this.value);'>";
    }

    for (var i = 0; i < arrCombo.length; i++) {
        if (selItem == arrCombo[i]) {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "' selected>" + arrCombo[i] + "</option>";
        }
        else {
            cboAgenciaHTML += "<option  value='" + arrCombo[i] + "'>" + arrCombo[i] + "</option>";
        }
    }
    cboAgenciaHTML += "</select></p>";

    document.getElementById(divCombo).innerHTML = cboAgenciaHTML;
}

function cboEVNacionalidad(opVista, selNac) {

    if (opVista != "PASAPORTE") {
        document.getElementById("divcboEVNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";
    }
    else {
        //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,10
        var UrlcboEVPaises = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,10"
        var cboEVPaResp = "";

        $.ajax({
            url: UrlcboEVPaises,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboEVPaResp = JSON.parse(data.ParametroGralGetResult);
                } catch (e) {
                    kendo.ui.progress($("#admEVScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admEVScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
                return;
            }
        });

        if (cboEVPaResp.length > 0) {

            var cboEVPaisHTML = "<p><label class='w3-text-red'><b>Nacionalidad</b></label><select id='nacionalidad_cliente' class='w3-input w3-border textos'>";

            for (var i = 0; i < cboEVPaResp.length; i++) {
                if (selNac == cboEVPaResp[i].CodigoClase) {
                    cboEVPaisHTML += "<option  value='" + cboEVPaResp[i].CodigoClase + "' selected>" + cboEVPaResp[i].NombreClase + "</option>";
                }
                else {
                    cboEVPaisHTML += "<option  value='" + cboEVPaResp[i].CodigoClase + "'>" + cboEVPaResp[i].NombreClase + "</option>";
                }
            }
            cboEVPaisHTML += "</select></p>";
            document.getElementById("divcboEVNacionalidad").innerHTML = "" + cboEVPaisHTML;
        }
        else {
            kendo.ui.progress($("#admEVScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
            return;
        }
    }
}

function verForm(dsFactura, bolVistaPrev) {
    try {

        pregParVeh = [];
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> dsFactura</center>", inspeccionar(dsFactura));

        bolImprimeEV = false;
        if (dsFactura.estado_entrega == 'ENTREGADO') {
            bolImprimeEV = true;
        }

        document.getElementById("listaVideo_ev").innerHTML = "";
        document.getElementById("playVideo_ev").innerHTML = "";
        document.getElementById('fileOT_ev').value = "";

        document.getElementById("ev_placa_conf").value = "";
        document.getElementById("obsEV").value = "";
        //   document.getElementById("ev_imei").value = "";
        verIMEI("NO");
        document.getElementById("ev_numfac").value = "";
        document.getElementById("ev_vh26").value = "";
        document.getElementById("ev_secuencia_detalle").value = "";
        document.getElementById("ev_estado_entrega").value = "";
        document.getElementById("ev_identifica_cliente").value = "";

        if (localStorage.getItem("ls_entregacliente") != undefined) {
            localStorage.removeItem("ls_entregacliente");
        }

        document.getElementById("ev_nombres").value = "";
        document.getElementById("ev_nombres_2").value = "";
        document.getElementById("ev_apellidos").value = "";
        document.getElementById("ev_apellidos_2").value = "";
        document.getElementById("ev_telefono_cliente").value = "";
        document.getElementById("ev_celular_cliente").value = "";
        document.getElementById("ev_email_cliente").value = "";

        document.getElementById("ev_imei_conf").value = "";
        document.getElementById("ev_relacionev").value = "";


        // cliente VIP
        document.getElementById("vip_ev").innerHTML = "";
        document.getElementById("vip_ev").style.display = "none";
        document.getElementById("txt_vip_ev").value = "";

        //cupones
        document.getElementById("cuponD").value = "";
        document.getElementById("cuponH").value = "";


        /* window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> dsFactura</center>", inspeccionar(dsFactura)); */
        //return;

        kendo.ui.progress($("#nuevovehScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            var cupones="NO";
            // tab
            $("#tabstripEV").kendoTabStrip({
                animation: {
                    open: {
                        effects: "fadeIn"
                    }
                }
            });

            ktedsEV = dsFactura;

            var ev_estado = dsFactura.estado;
            var chasisEV = dsFactura.chasis;
            var placaEV = dsFactura.placa;
            //se cambia de nombre_modelo a modelo_homologado peticion de Luis Cevallos 26-04-2019
            var modeloEV = dsFactura.nombre_modelo;
            //var modeloEV = dsFactura.modelo_homologado_transito;
            var numFac = dsFactura.numero_factura;
            var num_factura = dsFactura.almacen + "-" + dsFactura.serie + "-0000" + dsFactura.secuencia_factura;
            var vh26 = dsFactura.anio_vh26;
            var num_factura_ev = dsFactura.numero_factura;
            var fecha_factura_ev = dsFactura.fecha_factura;
            var persona_tipo = dsFactura.persona_tipo;
            var tipo_id = dsFactura.tipo_id;
            var identifica_ev = dsFactura.identifica;
            var persona_numero_ev = dsFactura.persona_numero;
            var nombre_cliente = dsFactura.nombre_cliente;
            var pais_cliente = dsFactura.pais_cliente;
            var ciudad_cliente = dsFactura.ciudad_cliente;
            var direccion_cliente = dsFactura.direccion_cliente;
            var numero_calle_cliente = dsFactura.numero_calle_cliente;
            var calle_interseccion_cliente = dsFactura.calle_interseccion_cliente;
            var telefono_cliente = dsFactura.telefono_cliente;
            var mail_1 = dsFactura.mail_1;
            
            if (dsFactura.nombre_promocion == "") {
                dsFactura.nombre_promocion="NO"
            }
            cupones = dsFactura.nombre_promocion;
            var cuponD = dsFactura.numero_cupon_desde;
            var cuponH = dsFactura.numero_cupon_hasta;
            var chasis_ev = dsFactura.chasis;
            var anio_modelo_ev = dsFactura.anio_modelo;
            var secuencia_detalle = dsFactura.secuencia_detalle;
            var estado_entrega = dsFactura.estado_entrega;
            var dispositivo_satelital = dsFactura.dispositivo_satelital;
            var numero_satelital = dsFactura.numero_satelital;
            var arrCiudadEV = localStorage.getItem("ls_usdiragencia").toLocaleString().split(/\b(\s)/);
            var fecha_entrega = dsFactura.fecha_entrega;
            var hora_entrega = dsFactura.hora_entrega;
            var observacion_entrega = dsFactura.observacion_entrega;
            var identifica_recibe_vh = dsFactura.identifica_recibe_vh;
            var telefono_recibe_vh = dsFactura.telefono_recibe_vh;
            var celular_recibe_vh = dsFactura.celular_recibe_vh;
            var mail_recibe_vh = dsFactura.mail_recibe_vh;
            var nacionalidad_recibe_vh = dsFactura.nacionalidad_recibe_vh;
            var tipo_id_recibe_vehiculo = dsFactura.tipo_id_recibe_vehiculo;
            var tipo_documento_recibe = dsFactura.tipo_documento_recibe;
            var nombre_recibe_vehiculo = dsFactura.nombre_recibe_vehiculo;


            // VIP PERSONA
            document.getElementById("txt_vip_ev").value = dsFactura.persona_clase;
            document.getElementById("vip_ev").innerHTML = "<div id='rcorners2'>" + dsFactura.persona_clase + "</div>";
            if (dsFactura.persona_clase.trim() != "") {
                document.getElementById("vip_ev").style.display = "initial";
            }
            else {
                document.getElementById("vip_ev").style.display = "none";
            }


            // VIP
            //var persona_clase = dsFactura.persona_clase;
            //document.getElementById("vip_ev").innerHTML = dsFactura.persona_clase;
            //document.getElementById("txt_vip_ev").value = dsFactura.persona_clase;

            // relacion
            var relacion_con_cliente = dsFactura.relacion_con_cliente;

            var color_vehiculo = dsFactura.color_vehiculo;
            var arrSelImeiValor = ["", "selected"];

            var selValImei = "NO";

            if (dispositivo_satelital == true) {
                arrSelImeiValor = ["selected", ""];
                verIMEI("SI");
                selValImei = "SI";
            }

            var arrSelImei = ["SI", "NO"];
            var htmlSelImei = "";
            htmlSelImei = radioBut(arrSelImei, "selIMEI", selValImei);

            document.getElementById("ev_estado").value = ev_estado;
            document.getElementById("cboIMEI").innerHTML = htmlSelImei;
            document.getElementById("ev_imei").value = numero_satelital;
            document.getElementById("num_factura_ev").value = num_factura_ev;
            document.getElementById("fecha_factura_ev").value = fecha_factura_ev;
            document.getElementById("persona_tipo_ev").value = persona_tipo;
            document.getElementById("persona_tipo_id_ev").value = tipo_id;
            document.getElementById("identifica_ev").value = identifica_ev;
            document.getElementById("persona_numero_ev").value = persona_numero_ev;

            localStorage.setItem("ls_entregacliente", nombre_cliente);

            document.getElementById("persona_nom1_ev").value = nombre_cliente.replace(/,/g, " ");

            document.getElementById("persona_pais_ev").value = pais_cliente;
            document.getElementById("persona_ciudad_ev").value = ciudad_cliente;
            document.getElementById("celular_ev").value = telefono_cliente;
            document.getElementById("email_ev").value = mail_1;
            document.getElementById("cuponesEVN").value = cupones;
            document.getElementById("cuponD").value = cuponD;
            document.getElementById("cuponH").value = cuponH;
            document.getElementById("numero_calle_ev").value = numero_calle_cliente;
            document.getElementById("calle_interseccion_ev").value = calle_interseccion_cliente;
            document.getElementById("persona_direc_ev").value = direccion_cliente;
            document.getElementById("ev_numfac").value = numFac;
            document.getElementById("num_factura_ev").value = num_factura;
            document.getElementById("ev_vh26").value = vh26;
            document.getElementById("ev_secuencia_detalle").value = secuencia_detalle;
            document.getElementById("ev_estado_entrega").value = estado_entrega;
            document.getElementById("ev_ciudad").value = arrCiudadEV[arrCiudadEV.length - 1];
            document.getElementById("obsEV").value = observacion_entrega;

            // QUIEN RECIBE
            document.getElementById("ev_identifica_cliente").value = identifica_recibe_vh;
            document.getElementById("ev_telefono_cliente").value = telefono_recibe_vh;
            document.getElementById("ev_celular_cliente").value = celular_recibe_vh;
            document.getElementById("ev_email_cliente").value = mail_recibe_vh;
            document.getElementById("ev_relacionev").value = relacion_con_cliente;
            document.getElementById("cboEncEV").value = dsFactura.evaluacion_asesor_entrega;

            // Cbo. Tipo persona
            //  cboCargaEV("persona_tipo", arrTipPers, tipo_id_recibe_vehiculo, "ev_divcbotpers");
            document.getElementById("ev_divcbotpers").innerHTML = "<p><input type='text' id='persona_tipo' value='NATURAL' class='w3-input textos' readonly /></p>";


            // Cbo. Tipod de documento 
            cboCargaEV("tipo_id_cliente", arDoc, tipo_documento_recibe, "ev_divcbotid");
            // Ver cbo Nacionalidad
            cboEVNacionalidad(tipo_documento_recibe, nacionalidad_recibe_vh);

            if (nombre_recibe_vehiculo.trim() != "") {
                if (nombre_recibe_vehiculo.includes(",") == true) {
                    var arrCliNom2 = nombre_recibe_vehiculo.split(",");
                    document.getElementById("ev_nombres").value = arrCliNom2[2];
                    document.getElementById("ev_nombres_2").value = arrCliNom2[3];
                    document.getElementById("ev_apellidos").value = arrCliNom2[0];
                    document.getElementById("ev_apellidos_2").value = arrCliNom2[1];
                }
                else {
                    document.getElementById("ev_apellidos").value = nombre_recibe_vehiculo;
                }
            }

            arrInfoEV = [];

            arrInfoEV.push({
                chasisEV: chasisEV,
                placaEV: placaEV,
                modeloEV: modeloEV,
                numFac: numFac,
                num_factura: num_factura,
                vh26: vh26,
                num_factura_ev: num_factura_ev,
                fecha_factura_ev: fecha_factura_ev,
                persona_tipo: persona_tipo,
                tipo_id: tipo_id,
                identifica_ev: identifica_ev,
                persona_numero_ev: persona_numero_ev,
                nombre_cliente: nombre_cliente,
                pais_cliente: pais_cliente,
                ciudad_cliente: ciudad_cliente,
                direccion_cliente: direccion_cliente,
                numero_calle_cliente: numero_calle_cliente,
                calle_interseccion_cliente: calle_interseccion_cliente,
                telefono_cliente: telefono_cliente,
                mail_1: mail_1,
                chasis_ev: chasis_ev,
                anio_modelo_ev: anio_modelo_ev,
                secuencia_detalle: secuencia_detalle
            });


            //  ============================================================================================================================
            // DATOS VEHICULO
            //  ============================================================================================================================
            document.getElementById("ev_vin").value = chasis_ev;
            localStorage.setItem("chasisvin",chasis_ev);
            document.getElementById("ev_nombre_modelo").value = modeloEV;
            document.getElementById("ev_placa").value = placaEV;
            document.getElementById("ev_anio").value = anio_modelo_ev;

            document.getElementById("ev_color").value = color_vehiculo;

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

            // alert("fecha entrega::::" + inspeccionar(fecha_entrega).length);
            //  alert(hora_entrega);

            //  if (fecha_entrega.trim() == "" || hora_entrega.trim() == "") {
            document.getElementById("ev_yyyy").value = yyyy + "-" + mm + "-" + dd;
            document.getElementById("ev_hh").value = hhmm;
            // }
            if (inspeccionar(fecha_entrega).length > 0) {
                if (fecha_entrega.trim() != "" && hora_entrega.trim() != "") {
                    document.getElementById("ev_yyyy").value = fecha_entrega;
                    document.getElementById("ev_hh").value = hora_entrega.slice(0, 5) // hora_entrega;
                }
            }

            arr_IVPM = [];
            arr_Exp = [];

            var tabstripEV = $("#tabstripEV").kendoTabStrip().data("kendoTabStrip");
            tabstripEV.select(0);

            var UrlVinEV = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + chasisEV + ";";

            if (localStorage.getItem("ls_listavin_ev_rec") != undefined && localStorage.getItem("ls_listavin_ev_rec").toLocaleString() == "1") {
                localStorage.setItem("ls_listavin_ev_rec", "0");
                // http://186.71.21.170:8077/taller/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;9U321366;
                UrlVinEV = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + chasisEV + ";";
            }

            //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlVIN</center>", UrlVinEV);



            var infVINEVResp = "";

            $.ajax({
                url: UrlVinEV,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    //  alert(data);
                    try {
                        infVINEVResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
                    } catch (e) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        if (localStorage.getItem("ls_listavin_ev_rec") != undefined && localStorage.getItem("ls_listavin_ev_rec").toLocaleString() == "0") {
                            infVINEVResp = "";
                            return;
                        }
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", err);
                    return;
                }
            });

            if (infVINEVResp.length == 0) {
                if (localStorage.getItem("ls_listavin_ev_rec") != undefined && localStorage.getItem("ls_listavin_ev_rec").toLocaleString() == "1") {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existen registros del Chasis<br/><b>" + chasisEV + "</b></center>");
                    return;
                }
                else {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    localStorage.setItem("ls_listavin_ev_rec", "1");
                    // verForm(chasisEV);
                    return;
                }
            }
            else {
                //  ============================================================================================================================
                // QUIEN RECIBE
                //  ============================================================================================================================
                document.getElementById("divcboEVNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";
                // Cbo. Tipo persona
                //  cboCargaEV("persona_tipo", arrTipPers, arrTipPers[0], "ev_divcbotpers");

                document.getElementById("ev_divcbotpers").innerHTML = "<p><input type='text' id='persona_tipo' value='NATURAL' class='w3-input textos' readonly /></p>";

                // Cbo. Tipod de documento 
                cboCargaEV("tipo_id_cliente", arDoc, arDoc[0], "ev_divcbotid");

                // vinicio
                var tablaPreguntas = ConsultarMEUSAVN(dsFactura, infVINEVResp[0].tipo_auto, false);

                //     var tablaPreguntasPartesVeh = ConsultarMEUSA(dsFactura, infVINEVResp[0].tipo_auto, true);

                //   document.getElementById("divFormEV").innerHTML = tablaPreguntas;

                // document.getElementById("divPartMov").innerHTML = pregParVeh[0].pregParte;
                for (var m = 0; m < pregParVeh.length; m++) {  
                    if (pregParVeh[m].pregParte.includes("PARTES_MOVILES") == true || pregParVeh[m].pregParte.includes("PARTE") == true || pregParVeh[m].pregParte.includes("MOVIL") == true) {
                        document.getElementById("divPartMov").innerHTML = pregParVeh[m].pregParte;
                    }
                    else {
                        document.getElementById("divFormEV").innerHTML += pregParVeh[m].pregParte;
                    }
                    
                }
                if (tablaPreguntas.trim() == "") {
                    document.getElementById("divFormEV").style.display = 'none';
                }
                else {
                    document.getElementById("divFormEV").style.display = 'block';

                    document.getElementById("videosOT_ev").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a i='btnImagenEntrega0' class='w3-btn' aria-label='Imagen' onclick='captureImagenEV();'><i i='icnImagenEntrega0' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                    "</center></p>";
                    llamarNuevoestilo("btnImagenEntrega");
                    llamarNuevoestiloIconB("icnImagenEntrega");
                    var htmlBotones = "";
                    /* alert(bolImprimeEV);
                    alert(document.getElementById("rbEntregado_2").checked);
                    document.getElementById("rbEntregado_2").checked=false;
                    bolImprimeEV=false */
                    
                    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                        htmlBotones = "<button id='btnRegrearEntrega0' onclick='volverForm()' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";

                        if (document.getElementById("rbEntregado_2").checked == false && bolImprimeEV == false) {
                            htmlBotones += "<button id='btnRegrearEntrega1' onclick='registrarEV();' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-floppy-o' aria-hidden='true'></i> GUARDAR</button>";
                        }

                        if (document.getElementById("rbEntregado_2").checked == true && bolImprimeEV == true ) {
                            htmlBotones += "<button id='btnRegrearEntrega2' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-print' aria-hidden='true'></i> IMPRIMIR</button>";
                            htmlBotones += "<button id='btnRegrearEntrega3' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega3' class='fa fa-envelope' aria-hidden='true'></i> MAIL</button>";

                        }
                        llamarNuevoestilo("btnRegrearEntrega");
                        llamarNuevoestiloIconB("icnRegrearEntrega");
                    }
                    else {
                        htmlBotones = "<button id='btnRegrearEntrega0' onclick='volverForm()' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i></button>";

                        if (document.getElementById("rbEntregado_2").checked == false /* && bolImprimeEV == false */) {
                            htmlBotones += "<button id='btnRegrearEntrega1' onclick='registrarEV();' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-floppy-o' aria-hidden='true'></i> </button>";
                        }

                        if (document.getElementById("rbEntregado_2").checked == true /* && bolImprimeEV == true */) {
                            htmlBotones += "<button id='btnRegrearEntrega2' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-print' aria-hidden='true'></i> </button>";
                            htmlBotones += "<button id='btnRegrearEntrega3' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega3' class='fa fa-envelope' aria-hidden='true'></i> </button>";

                        }
                    }
                    llamarNuevoestilo("btnRegrearEntrega");
                    llamarNuevoestiloIconB("icnRegrearEntrega");
                    
                    // raul
                    if (localStorage.getItem("ls_urlSesEnt") != undefined) {
                        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                            htmlBotones = "<button id='btnRegrearEntrega0' onclick='abrirPagina(\"agencia\")' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
                            "<button id='btnRegrearEntrega1' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-print' aria-hidden='true'></i> IMPRIMIR</button>" +
                            "<button id='btnRegrearEntrega2' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-envelope' aria-hidden='true'></i> MAIL</button>";
                        }
                        else {
                            htmlBotones = "<button id='btnRegrearEntrega0' onclick='abrirPagina(\"agencia\")' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
                            "<button id='btnRegrearEntrega1' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-print' aria-hidden='true'></i> </button>" +
                            "<button id='btnRegrearEntrega2' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-envelope' aria-hidden='true'></i> </button>";
                        }
                    }
                    llamarNuevoestilo("btnRegrearEntrega");
                    llamarNuevoestiloIconB("icnRegrearEntrega");
                    document.getElementById("headEV").style.display = "none";

                    //   verArchivosEV(document.getElementById("ev_vin").value);

                    if (bolVistaPrev == false) {

                        // document.getElementById("headEV").style.display = "initial";

                        // Datos Veh.
                        document.getElementById("lblConfpl_ev").style.visibility = "visible";
                        document.getElementById("ev_placa_conf").style.visibility = "visible";
                        //**   document.getElementById("selIMEI").disabled = false;
                        //document.getElementById("ev_imei").readOnly = false;
                        //document.getElementById("ev_imei").setAttribute("class", "w3-input w3-border textos");

                        document.getElementById("ev_imei").readOnly = true;
                        document.getElementById("ev_imei").setAttribute("class", "w3-input textos");

                        document.getElementById("lblIMEI_conf").style.visibility = "visible";
                        document.getElementById("ev_imei_conf").style.visibility = "visible";

                        // Form - Cbos.
                        var elements = document.getElementsByName("SEL");
                        for (var index = 0; index < elements.length; index++) {
                            elements[index].disabled = false;
                            elements[index].setAttribute("class", "w3-input w3-border textos");
                        }

                        // Radio
                        var selIMEI = document.getElementsByName("selIMEI");
                        for (var index = 0; index < selIMEI.length; index++) {
                            selIMEI[index].disabled = false;
                        }

                        document.getElementById("rbCliente").disabled = false;
                        document.getElementById("rbOtro").disabled = false;

                        document.getElementById("rbCliente").checked = false;
                        document.getElementById("rbOtro").checked = true;

                        if (document.getElementById("identifica_ev").value.trim() == document.getElementById("ev_identifica_cliente").value.trim()) {
                            document.getElementById("rbCliente").checked = true;
                            document.getElementById("rbOtro").checked = false;
                        }

                        // Calificacion
                        document.getElementById("cboEncEV").disabled = false;
                        document.getElementById("cboEncEV").setAttribute("class", "w3-input w3-border textos");


                        // Quien recibe                                               
                        //  document.getElementById("persona_tipo").disabled = false;
                        document.getElementById("tipo_id_cliente").disabled = false;

                        document.getElementById("ev_identifica_cliente").readOnly = false;
                        document.getElementById("ev_nombres").readOnly = false;
                        document.getElementById("ev_nombres_2").readOnly = false;
                        document.getElementById("ev_apellidos").readOnly = false;
                        document.getElementById("ev_apellidos_2").readOnly = false;
                        document.getElementById("ev_telefono_cliente").readOnly = false;
                        document.getElementById("ev_celular_cliente").readOnly = false;
                        document.getElementById("ev_email_cliente").readOnly = false;
                        document.getElementById("obsEV").readOnly = false;

                        document.getElementById("ev_relacionev").readOnly = false;


                        //**    document.getElementById("selIMEI").setAttribute("class", "w3-input w3-border textos");

                        //  document.getElementById("persona_tipo").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("tipo_id_cliente").setAttribute("class", "w3-input w3-border textos");

                        document.getElementById("ev_identifica_cliente").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_nombres").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_nombres_2").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_apellidos").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_apellidos_2").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_telefono_cliente").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_celular_cliente").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_email_cliente").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("obsEV").setAttribute("class", "w3-input w3-border textos");
                        document.getElementById("ev_relacionev").setAttribute("class", "w3-input w3-border textos");
                        // Div princ.
                        document.getElementById("btnFooterEntrega").innerHTML = htmlBotones;
                        document.getElementById("tablaEntregaDet").style.display = "none";
                        document.getElementById("formEntrega").style.display = "initial";
                        //  document.getElementById("divExplica").style.display = "none";
                        llamarNuevoestilo("btnRegrearEntrega");
                        llamarNuevoestiloIconB("icnRegrearEntrega");
                        // RRP: 2018-07-05
                        document.getElementById("lbl_ev_relacionev").style.display = "initial";
                        document.getElementById("rbOtro").checked = true;
                        document.getElementById("rbCliente").disabled = false;
                        document.getElementById("rbOtro").disabled = false;

                    }
                    else {

                        // Datos Veh.
                        document.getElementById("lblConfpl_ev").style.visibility = "hidden";
                        document.getElementById("ev_placa_conf").style.visibility = "hidden";
                        //**    document.getElementById("selIMEI").disabled = true;
                        document.getElementById("ev_imei").readOnly = true;
                        document.getElementById("ev_imei").setAttribute("class", "w3-input textos");
                        document.getElementById("lblIMEI_conf").style.visibility = "hidden";
                        document.getElementById("ev_imei_conf").style.visibility = "hidden";

                        // Form - Cbos.
                        var elements = document.getElementsByName("SEL");
                        for (var index = 0; index < elements.length; index++) {
                            elements[index].disabled = true;
                            elements[index].setAttribute("class", "w3-input textos");
                        }

                        // Radio
                        var selIMEI = document.getElementsByName("selIMEI");
                        for (var index = 0; index < selIMEI.length; index++) {
                            selIMEI[index].disabled = true;
                        }

                        /* error  ini*/

                        //document.getElementById("rbCliente").disabled = true;
                        //document.getElementById("rbOtro").disabled = true;

                        //document.getElementById("rbCliente").checked = false;
                        //document.getElementById("rbOtro").checked = true;

                        //if (document.getElementById("identifica_ev").value.trim() == document.getElementById("ev_identifica_cliente").value.trim()) {
                        //    document.getElementById("rbCliente").checked = true;
                        //    document.getElementById("rbOtro").checked = false;
                        //}

                        /* error  fin*/


                        // Calificacion
                        document.getElementById("cboEncEV").disabled = true;
                        document.getElementById("cboEncEV").setAttribute("class", "w3-input textos");

                        // Quien recibe                                               
                        //  document.getElementById("persona_tipo").disabled = true;
                        document.getElementById("tipo_id_cliente").disabled = true;

                        document.getElementById("ev_identifica_cliente").readOnly = true;
                        document.getElementById("ev_nombres").readOnly = true;
                        document.getElementById("ev_nombres_2").readOnly = true;
                        document.getElementById("ev_apellidos").readOnly = true;
                        document.getElementById("ev_apellidos_2").readOnly = true;
                        document.getElementById("ev_telefono_cliente").readOnly = true;
                        document.getElementById("ev_celular_cliente").readOnly = true;
                        document.getElementById("ev_email_cliente").readOnly = true;
                        document.getElementById("obsEV").readOnly = true;
                        document.getElementById("ev_relacionev").readOnly = true;


                        //**     document.getElementById("selIMEI").setAttribute("class", "w3-input textos");

                        //  document.getElementById("persona_tipo").setAttribute("class", "w3-input textos");
                        document.getElementById("tipo_id_cliente").setAttribute("class", "w3-input textos");

                        document.getElementById("ev_identifica_cliente").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_nombres").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_nombres_2").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_apellidos").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_apellidos_2").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_telefono_cliente").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_celular_cliente").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_email_cliente").setAttribute("class", "w3-input textos");
                        document.getElementById("obsEV").setAttribute("class", "w3-input textos");
                        document.getElementById("ev_relacionev").setAttribute("class", "w3-input textos");

                        // Div princ.
                        document.getElementById("btnFooterEntrega").innerHTML = htmlBotones;
                        document.getElementById("tablaEntregaDet").style.display = "none";
                        document.getElementById("formEntrega").style.display = "initial";
                        llamarNuevoestilo("btnRegrearEntrega");
                        llamarNuevoestiloIconB("icnRegrearEntrega");
                        //   formatoImpEV(bolVistaPrev);


                        // RRP: 2018-07-05
                        document.getElementById("lbl_ev_relacionev").style.display = "none";
                        document.getElementById("rbCliente").checked = true;
                        document.getElementById("rbCliente").disabled = true;
                        document.getElementById("rbOtro").disabled = true;



                    }

                }

                document.getElementById("volver_ent").removeAttribute("href");
                document.getElementById('volver_ent').removeAttribute("onclick");

                //document.getElementById('volver_ent').onclick = function () {
                //    volverForm();
                //}

                // raulrod
                document.getElementById('volver_ent').onclick = function () {
                    if (localStorage.getItem("ls_urlSesEnt") != undefined) {
                        abrirPagina("agencia");
                    }
                    else {
                        volverForm();
                    }
                }

                verArchivosEV(document.getElementById("ev_vin").value);

            }
            llamarColorTexto(".w3-text-red");
            llamarColorTexto(".legend");
            kendo.ui.progress($("#nuevovehScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);



    }
    catch (excForm) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", excForm);
        return;
    }
}

function copiaCliente() {

    document.getElementById("ev_identifica_cliente").value = "";
    document.getElementById("ev_nombres").value = "";
    document.getElementById("ev_nombres_2").value = "";
    document.getElementById("ev_apellidos").value = "";
    document.getElementById("ev_apellidos_2").value = "";
    document.getElementById("ev_telefono_cliente").value = "";
    document.getElementById("ev_celular_cliente").value = "";
    document.getElementById("ev_email_cliente").value = "";
    document.getElementById("ev_relacionev").value = "";
    cboCargaEV("tipo_id_cliente", arDoc, arDoc[0], "ev_divcbotid");

    if (document.getElementById("rbCliente").checked == true) {
        // parentezco
        document.getElementById("lbl_ev_relacionev").style.display = "none";
        document.getElementById("ev_relacionev").style.display = "none";

        if (document.getElementById("persona_tipo_ev").value.trim() == "NATURAL") {

            document.getElementById("ev_identifica_cliente").value = document.getElementById("identifica_ev").value;

            var nombre_recibe_cliente = localStorage.getItem("ls_entregacliente").toLocaleString();

            //if (localStorage.getItem("ls_entregacliente") != undefined) {
            //    localStorage.removeItem("ls_entregacliente");
            //}

            if (nombre_recibe_cliente.trim() != "") {
                if (nombre_recibe_cliente.includes(",") == true) {
                    var arrCliNom4 = nombre_recibe_cliente.split(",");
                    document.getElementById("ev_nombres").value = arrCliNom4[2];
                    document.getElementById("ev_nombres_2").value = arrCliNom4[3];
                    document.getElementById("ev_apellidos").value = arrCliNom4[0];
                    document.getElementById("ev_apellidos_2").value = arrCliNom4[1];
                }
                else {
                    document.getElementById("ev_apellidos").value = nombre_recibe_cliente;
                }
            }

            document.getElementById("ev_telefono_cliente").value = document.getElementById("celular_ev").value;
            document.getElementById("ev_celular_cliente").value = document.getElementById("ev_celular_cliente").value;
            document.getElementById("ev_email_cliente").value = document.getElementById("email_ev").value;
            document.getElementById("ev_cuponesEVN").value = document.getElementById("cuponesEVN").value;

            document.getElementById("ev_relacionev").value = "";
            cboCargaEV("tipo_id_cliente", arDoc, document.getElementById("persona_tipo_id_ev").value, "ev_divcbotid");
        }
        else {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Solo se admite Tipo Persona Natural");
            return;
        }
    }
    else {
        // parentezco
        document.getElementById("lbl_ev_relacionev").style.display = "initial";
        document.getElementById("ev_relacionev").style.display = "initial";
        document.getElementById("ev_relacionev").value = "";
    }
}

function ConsultarMEUSAVN(inforusa, tipo_auto, partes) {
    try {
        var respOT = "0";

        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh68PreguntasAvaluoGet/1,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        inforusa.anio_vh26 + ";" +
        inforusa.numero_factura + ";" +
        inforusa.secuencia_detalle + ";" +
        "ENTREGA_" + tipo_auto + ";" +
        "" + ";" +
        localStorage.getItem("ls_usulog").toLocaleString();


   //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>UrlMotorEscape</center>", UrlMotorEscape);


        var tipoAutoMsj = "";
        if (tipo_auto == "P") {
            tipoAutoMsj = "Pasajeros";
        }
        else if (tipo_auto == "C") {
            tipoAutoMsj = "Comercial";
        }

        var infME;
        $.ajax({
            url: UrlMotorEscape,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    // alert(inspeccionar(data));

                    if (inspeccionar(data).includes("null") == true) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ALERTA</center>", "<center>No existen datos para el Formulario<br/><b>Entrega " + tipoAutoMsj + "</b></center>");
                        return;
                    }
                    else {
                        infME = (JSON.parse(data.vh68PreguntasAvaluoGetResult)).tvh68;
                        //  infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;
                        respOT = "1";
                    }
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                return;
            }
        });
        if (respOT == "1") {
            try {
                var griddata = [];
                tamano = infME.length;
                for (var t = 0; t < infME.length; t++) {
                    if (infME[t].orden_presentacion < 10) {
                        infME[t].orden_presentacion = "0" + infME[t].orden_presentacion;
                    }
                }

                infME.sort(function myfunction(a, b) {
                    return (a.corden_seccion + "" + a.orden_presentacion) - (b.corden_seccion + "" + b.orden_presentacion)
                });
                for (var i = 0; i < infME.length; i++) {


                    // RRP
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>" + i + "</center>",
                    //    "lista_etiquetas:::" + i + ":::" + infME[i].lista_etiquetas + "<br/>" +
                    //"lista_respuesta:::" + i + ":::" + infME[i].lista_respuesta + "<br/>" +
                    //"sevRespt:::" + i + ":::" + infME[i].sevRespt + "<br/>" +
                    //"erRespt:::" + i + ":::" + infME[i].erRespt + "<br/>" +
                    //"evRespt:::" + i + ":::" + infME[i].evRespt);

                    var selecResp = new Array();
                    var sevResp = new Array();
                    var erResp = new Array();
                    var evResp = new Array();
                    if (infME[i].tipo_respuesta == "SELECCION" || infME[i].tipo_respuesta == "SEV") {
                        if (infME[i].tipo_respuesta == "SEV") {
                            sevResp = infME[i].lista_etiquetas.split(",");
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                            }
                        }
                        selecResp = infME[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infME[i].tipo_respuesta == "ER") {
                            erResp = infME[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            selecResp = infME[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infME[i].tipo_respuesta == "EV") {
                                evResp = infME[i].lista_etiquetas.split(",");
                                var evRes = [];
                                for (var l = 0; l < evResp.length; l++) {
                                    evRes.push({ evR: evResp[l] });
                                }
                            }
                        }
                    }

                    griddata.push({
                        codigo_empresa: localStorage.getItem("ls_idempresa").toLocaleString(),
                        codigo_sucursal: localStorage.getItem("ls_ussucursal").toLocaleString(),
                        codigo_agencia: localStorage.getItem("ls_usagencia").toLocaleString(),
                        // anio_vh62: "", // inforusa.anio_vh62,
                        secuencia_vh65: infME[i].secuencia_vh65,
                        // secuencia_vh62: inforusa.secuencia_vh62,
                        seccion_formulario: infME[i].seccion_formulario,
                        pregunta: infME[i].pregunta,
                        orden_presentacion: infME[i].orden_presentacion,
                        tipo_formulario: infME[i].tipo_formulario,
                        tipo_respuesta: infME[i].tipo_respuesta,
                        lista_respuesta: infME[i].lista_respuesta,
                        lista_etiquetas: infME[i].lista_etiquetas,
                        tipo_valor: infME[i].tipo_valor,
                        selResp: selRes,
                        sevResp: sevRes,
                        erResp: erRes,
                        evResp: evRes,
                        selRespt: infME[i].selRespt,
                        sevRespt: infME[i].sevRespt,
                        erRespt: infME[i].erRespt,
                        evRespt: infME[i].evRespt,
                    });
                }
            } catch (ev1) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", ev1);
                return;
            }

            document.getElementById("divFormEV").innerHTML = "";
            dataRespuesta = "";
            var tablaOT = "";
            tablaOT = "<table width='100%' border='1'  cellpadding='0' cellspacing='0' id='docume'>";
            var cuerpo;

            var griddata1 = griddata;

            //RRP
            //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>" + i + "</center>",
            //"lista_etiquetas:::" + i + ":::" + griddata1[i].lista_etiquetas + "<br/>" +
            //"lista_respuesta:::" + i + ":::" + griddata1[i].lista_respuesta + "<br/>" +
            //"sevRespt:::" + i + ":::" + griddata1[i].sevRespt + "<br/>" +
            //"erRespt:::" + i + ":::" + griddata1[i].erRespt + "<br/>" +
            //"evRespt:::" + i + ":::" + griddata1[i].evRespt);


            //  tablaOT += "<tr align='center' style='background-color:#F44336'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"




            for (var i = 0; i < griddata1.length; i++) {


                tablaOT = "<table width='100%' border='1'  cellpadding='0' cellspacing='0' id='docume'>";

                var seccionFor = griddata1[i].seccion_formulario;
                tablaOT += "<tr style='background-color:#000000'><td style='width: 80%;'><p><label style='font-weight:bold; font-size:13px;color:#ffffff'>" + griddata1[i].seccion_formulario + "</label></p></td><td style='width: 1%;'></td><td style='width: 19%;'></td></tr>";


                while (griddata1[i].seccion_formulario == seccionFor) {
                    var tipoUsa = "";
                    if (griddata1[i].tipo_valor == "NUMERICO") {
                        tipoUsa = "number";
                    } else {
                        tipoUsa = "text";
                    }

                    var txtPreg = "</br><table width='100%' border='0'  cellpadding='0' cellspacing='0' id='TABOBS" + i + "' style='display:none'><tr>" +
                        "<td width='5%'><p><label class='w3-text-red'><b>Observaciones</b></label></p></td>" +
                        "<td><p><input type='text' id='OBS" + i + "' name='OBS' class='w3-input w3-border textos' style='display:none' /></p></td></tr></table>";

                    tablaOT += "<tr><td><p>" + griddata1[i].pregunta + txtPreg + "</p></td>";

                    //   tablaOT += "<tr><td><p>" + griddata1[i].pregunta + "</p></td>";

                    if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
                        var sevUsa = "<td><table style='width: 100%;'><tr>";
                        if (griddata1[i].tipo_respuesta == "SEV") {
                            var valorsev = griddata1[i].sevRespt.split(',');
                            for (var l = 0; l < griddata1[i].sevResp.length; l++) {
                                sevUsa += "<td>&nbsp;</td>";
                            }
                        }
                        sevUsa += "</tr></table></td>";

                        if (griddata1[i].selRespt.length == 0) {
                            bolImprimeEV = false;
                        }

                        var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                        tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                    } else {
                        if (griddata1[i].tipo_respuesta == "ER") {
                            var sevUsa = "<td><table style='width: 100%;'><tr>";
                            var valorer = griddata1[i].erRespt.split(',');
                            for (var l = 0; l < griddata1[i].erResp.length; l++) {
                                sevUsa += "<td>&nbsp;</td>";
                            }
                            sevUsa += "</tr></table></td>";

                            if (griddata1[i].selRespt.length == 0) {
                                bolImprimeEV = false;
                            }

                            var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                            tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                        } else {
                            if (griddata1[i].tipo_respuesta == "EV") {
                                var sevUsa = "<td><table style='width: 100%;'><tr>";
                                var valorev = griddata1[i].evRespt.split(',');
                                for (var l = 0; l < griddata1[i].evResp.length; l++) {
                                    sevUsa += "<td>&nbsp;</td>";
                                }
                                sevUsa += "</tr></table></td>";
                                tablaOT += sevUsa + "<td></td>";
                            }
                        }
                    }
                    tablaOT += "</tr>";
                    i++;
                    if (i == tamano) {
                        break;
                    }


                }
                i--;

                //if (seccionFor.includes(partes) == true) {
                //   alert(griddata1[i].seccion_formulario);
                //    break;
                //}
                pregParVeh.push({ pregParte: tablaOT });

            }

            dataRespuesta = griddata1;
            tablaOT += "</table>";

            kteTipoAuto = tipo_auto;

            return tablaOT;
        }
    } catch (ev2) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", ev2);
        return "";
    }
}

function seleccionUSA(sele1, i, sele2) {
    try {
        var cboMarcaHTML = "<p><select id='" + "SEL" + i + "' class='w3-input w3-border textos' name='SEL' onchange='fnVerObsPreg(this.value, \"OBS" + i + "\");'>";
        for (var k = 0; k < sele1.length; k++) {
            if (sele2 == sele1[k].sele) {
                cboMarcaHTML += "<option  value='" + sele1[k].sele + "' selected>" + sele1[k].sele + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + sele1[k].sele + "'>" + sele1[k].sele + "</option>";
            }
        }
        cboMarcaHTML += "</select></p>";
        return cboMarcaHTML;
    } catch (e) {
        alert("selec" + e);
    }
}

function fnVerObsPreg(selPreg, item) {
    if (selPreg == "NO") {
        document.getElementById("TAB" + item).style.display = "initial";

        document.getElementById(item).style.display = "initial";
    }
    else {
        document.getElementById("TAB" + item).style.display = "none";

        document.getElementById(item).style.display = "none";
        document.getElementById(item).value = "";
    }
}

function fnVerIMEI(ver) {
    if (ver == "SI") {
        document.getElementById("lblIMEI").style.visibility = "visible";
        document.getElementById("txtIMEI").style.visibility = "visible";
    }
    else {
        document.getElementById("lblIMEI").style.visibility = "hidden";
        document.getElementById("txtIMEI").style.visibility = "hidden";
    }
    document.getElementById("txtIMEI").value = "";
    document.getElementById("ev_imei").value = "";
}


function radioBut(arrSelImei, nameRadio, selRadio) {
    var htmlSelImei = "";

    for (var h = 0; h < arrSelImei.length; h++) {

        if (h == 0) {
            htmlSelImei += "<table cellpadding='0' cellspacing='0' border='0'><tr>";
        }

        if (selRadio == arrSelImei[h]) {
            htmlSelImei += "<td><p><input type='radio' id='" + nameRadio + "_" + h + "' name='" + nameRadio + "' value='" + arrSelImei[h] + "' onclick = 'verIMEI(this.value);' checked>" + arrSelImei[h] + "</p></td>";
        }
        else {
            htmlSelImei += "<td><p><input type='radio' id='" + nameRadio + "_" + h + "' name='" + nameRadio + "' value='" + arrSelImei[h] + "' onclick = 'verIMEI(this.value);'>" + arrSelImei[h] + "</p></td>";
        }

        if (h == arrSelImei.length - 1) {
            htmlSelImei += "</tr></table>";
        }
    }
    return htmlSelImei;
}

function volverForm() {

    // entConsultar();

    cargaInfoAgendaEntrega_2();  // agenda

    vistaParametrosEntVeh();

    document.getElementById("tablaEntregaDet").style.display = "initial";
    document.getElementById("formEntrega").style.display = "none";
    document.getElementById("divExplica").style.display = "none";


    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnFooterEntrega").innerHTML = "<button id='btnRegrearEntrega0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
    else {
        document.getElementById("btnFooterEntrega").innerHTML = "<button id='btnRegrearEntrega0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
    }
llamarNuevoestilo("btnRegrearEntrega");
llamarNuevoestiloIconB("icnRegrearEntrega")
    //  document.getElementById("div_volver_ent").innerHTML = "<a id='volver_ent' data-align='right' class='fa fa-reply' href='components/home/view.html' aria-hidden='true' data-role='button'></a>";
    document.getElementById("volver_ent").removeAttribute("href");
    document.getElementById('volver_ent').removeAttribute("onclick");
    document.getElementById("volver_ent").href = "components/home/view.html";
}


function formatoImpEV(bolVisEV) {

    try {

        var htmlFormatoEV = "";

        kendo.ui.progress($("#nuevovehScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            var dpentFecIni_2 = document.getElementById("dpentFecIni").value;
            var dpentFecFin_2 = document.getElementById("dpentFecFin").value;
            var entFacFis_2 = document.getElementById("entFacFis").value;
            var entIdCli_2 = document.getElementById("identifica_ev").value;
            var entVin_2 = document.getElementById("ev_vin").value;

            // rrppp
            var intEntregado = "1";
            //if (document.getElementById("rbEntregado_2").checked == true) {
            //    intEntregado = "1";
            //}

            var UrlEntregasVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json" + ";" +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
            "0" + ";" +
            entFacFis_2 + ";" +
            "0" + ";" +
            entVin_2 + ";" +
            entIdCli_2 + ";" +
            "" + ";" +
            "FACTURADO" + ";" +
            localStorage.getItem("ls_usulog").toLocaleString() + ";" +
            dpentFecIni_2 + ";" +
            dpentFecFin_2 + ";" +
            intEntregado;

            //----------------------------------------------
              // desde "agencia"
            if (localStorage.getItem("ls_urlSesEnt") != undefined) {
                // RRP::
                var arrUrlEV = localStorage.getItem("ls_urlSesEnt").toLocaleString().split("|");
                UrlEntregasVIN =  arrUrlEV[0];
            }

            //--------------------------------------------


           //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> IMP</center>", UrlEntregasVIN);

            var infEntregasVIN;
            $.ajax({
                url: UrlEntregasVIN,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        // alert(inspeccionar(data));

                        if (inspeccionar(data).includes("tvh03") == true) {
                            infEntregasVIN = (JSON.parse(data.vh03FacturasGetResult)).tvh03;
                        }
                    } catch (e) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                        return;
                    }
                },
                error: function (eEntrega) {
                    // errorConexEV = true;
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
                    return;
                }
            });

            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infEntregasVIN[0]));
            //return;

            var html_ev_01 = "";
            var html_ev_02 = "";
            var html_ev_03 = "";
            var html_ev_04 = "";

            //  ============================================================================================================================
            //  FECHA DE ENTREGA
            //  ============================================================================================================================
            var ev_yyyy = infEntregasVIN[0].fecha_entrega;
            var ev_hhmm = infEntregasVIN[0].hora_entrega;
            //    }
            //}

            if (ev_yyyy.includes("-") == false || ev_hhmm.includes(":") == false) {
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
                ev_yyyy = yyyy + "-" + mm + "-" + dd;
                ev_hhmm = hhmm;
            }

            var arrFecEV = ev_yyyy.split('-');
            var arrHoEv = ev_hhmm.split(':');

            var mesesEV = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

            var diasSemanaEV = new Array("Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado");

            var fecEV = new Date(arrFecEV[0], parseInt(arrFecEV[1]) - 1, arrFecEV[2]);



            // arrFecEV[2] + " de " +  meses[parseInt(arrFecEV[1])] + " de "+arrFecEV[0];


            //  ============================================================================================================================
            //  DATOS VEHICULO
            //  ============================================================================================================================
            html_ev_01 = "<table cellpadding='0' cellspacing='0' border='0'>" +
            "<tr>" +
            "<td width='20%'><p><label style='font-family:Arial; font-size:11px'>En la ciudad de: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].ciudad + "</p></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>Fecha: </p></label></td>" +
            "<td>" +
            "<table cellpadding='0' cellspacing='0' border='0'>" +
            "<tr>" +

            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + diasSemanaEV[fecEV.getDay()] + ", " + arrFecEV[2] + " de " + mesesEV[parseInt(arrFecEV[1]) - 1] + " de " + arrFecEV[0] + "</p></label></td>" +

            //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[0] + "</p></label></td>" +
            //"<td>&nbsp;</td>     " +
            //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[1] + "</p></label></td>" +
            //"<td>&nbsp;</td>     " +
            //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[2] + "</p></label></td>" +


            "<td></td>  " +
            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>&nbsp;&nbsp;Hora: </p></td> " +
            "<td>&nbsp;&nbsp;&nbsp;</td>     " +
            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + arrHoEv[0] + ":" + arrHoEv[1] + "</p></label></td>" +
            "</tr>" +
            "</table>   " +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='2'><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>Se realiza la entrega a entera satisfacci&#243;n de un veh&#237;culo nuevo marca KIA con las siguientes caracter&#237;sticas:</p>" +
            "</td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>MODELO: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].nombre_modelo + "</p></label></td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>A&#209;O MODELO:</p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].anio_modelo + "</p></label></td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>VIN: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].chasis + "</p></l/td>" +
            "</tr>" +
            "<tr> " +
            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>PLACA: </p></label></td>" +
            "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].placa + "</p></label></td>" +
            "</tr>" +
            "</table>";


            //  ============================================================================================================================
            //  CLIENTE
            //  ============================================================================================================================
            html_ev_04 = // "<br/>" +
                "<table width='100%' cellpadding='0' cellspacing='0' border='0'>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Apellidos / Nombres / Raz&#243;n Social: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("persona_nom1_ev").value + "</p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>ID: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("identifica_ev").value + "</p></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>N&#250;mero Factura: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("num_factura_ev").value + "</p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Fecha de la Factura: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("fecha_factura_ev").value + "</p></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Direcci&#243;n: </p></label></td>" +
            "<td colspan='3'><p><label style='font-family:Arial; font-size:11px'>" +
            document.getElementById("persona_direc_ev").value + " " +
            document.getElementById("numero_calle_ev").value + " " +
            document.getElementById("calle_interseccion_ev").value + "</p></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Celular: </p></label></td>" +
            "<td colspan='3'><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("celular_ev").value + "</p></label></td>" +
            "</tr>" +
            "</table>";

            //  ============================================================================================================================
            //  RECIBE
            //  ============================================================================================================================
            var ev_identifica_cliente = infEntregasVIN[0].identifica_recibe_vh;
            var ev_nombres = infEntregasVIN[0].nombre_recibe_vehiculo.replace(/,/g, " "); //.replace(",", "&nbsp;");
            var identifica_entrega = infEntregasVIN[0].identifica_entrega;

            var telEntrega = "";
            if (document.getElementById("ev_telefono_cliente").value.trim() != "" && document.getElementById("ev_celular_cliente").value.trim() != "") {
                telEntrega = document.getElementById("ev_telefono_cliente").value + " / " + document.getElementById("ev_celular_cliente").value;
            }
            else {
                if (document.getElementById("ev_telefono_cliente").value.trim() == "") {
                    telEntrega = document.getElementById("ev_celular_cliente").value;
                }
                else if (document.getElementById("ev_celular_cliente").value.trim() == "") {
                    telEntrega = document.getElementById("ev_telefono_cliente").value;
                }
            }

            //  ============================================================================================================================
            //  IMEI
            //  ============================================================================================================================
            var dispositivo_satelital_imp = infEntregasVIN[0].dispositivo_satelital;
            var numero_satelital = "";

            if (dispositivo_satelital_imp == true) {
                dispositivo_satelital_imp = "SI";

                if (infEntregasVIN[0].numero_satelital.trim() != "") {
                    numero_satelital = " (No. IMEI: " + infEntregasVIN[0].numero_satelital + ")";
                }
            }
            else {
                dispositivo_satelital_imp = "NO";
            }

            html_ev_02 = "<table width='100%' border='0'  cellpadding='2' cellspacing='0' >" +
            "<tr><td style='width: 80%'><p><label style='font-family:Arial; font-size:11px'> Dispone de Dispositivo Satelital ? " + numero_satelital +
            "</label></p></td><td style='width: 1%;'></td><td style='width: 19%;'><p><label style='font-family:Arial; font-size:11px'>" + dispositivo_satelital_imp + "</label></p></td></tr>" +
            "</table>";

            //  ============================================================================================================================
            //  OBSERVACIONES
            //  ============================================================================================================================
            var obsEV = infEntregasVIN[0].observacion_entrega;

            if (obsEV.trim() == "") {
                obsEV = "<hr style='color:#000000; border:solid 1px'/>";
            }
            else {
                obsEV = obsEV.replace(/\r?\n/g, "<br>");
            }

            var tablaPreguntasImp = ConsultarMEUSA_IMP_2(ktedsEV); // ConsultarMEUSA_IMP(ktedsEV);

            //  ============================================================================================================================
            //  FORMATO GENERAL
            //  ============================================================================================================================
            var ima = localStorage.getItem("ls_url2").toLocaleString() + "/formato_mail/logofirma.jpg";
            htmlFormatoEV = "<table width='100%' cellpadding='2' cellspacing='0'>" +
            "<tr>" +
            "<td>" +
            "<table width='100%' cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<td rowspan='2'>" + "<img src='" + ima + "' alt='FLC' width='115' height='70'>" /* imgLogoEV() */ + "</td>" +
            "<td style='text-align:right'>" +
            "<h3><label style='color:#000000'>FORMULARIO PARA ENTREGA DE VEH&#205;CULOS NUEVOS</label></h3>" +
            "</td>" +
            "</tr>" +

             "<tr> <td style='text-align:right'><h3><label style='color:#000000'>PARA CARPETA</label></h3></td></tr>" +

            "</table>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<hr style='color:#000000;border:2px solid' />" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" + html_ev_01 + "</td>" +
            "</tr>" +

            //"<tr>" +
            //"<td style='background-color:#000000'>" +
            //"<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'>CLIENTE</label></p>" +
            //"</td>" +
            //"</tr>" +

            "<tr>" +
            "<td>" +
            "<p><label style='color:#000000; font-family:Arial; font-size:14px'><b>CLIENTE</b></label></p>" +
            //"<p><hr style='color:#000000;border:1px solid' /></p>" +
            "</td>" +
            "</tr>" +



            "<tr>" +
            "<td>" + html_ev_04 + "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            tablaPreguntasImp +
            html_ev_02 +
            "</td>" +
            "</tr>" +

            "<tr>" +
            "<td>&nbsp;</td>" +
            "</tr>" +


            //"<tr>" +
            //"<td style='background-color:#000000'>" +
            //"<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'>COMENTARIOS, RECOMENDACIONES U OBSERVACIONES DEL CLIENTE</label></p>" +
            //"</td>" +
            //"</tr>" +

            "<tr>" +
            "<td>" +
            "<p><label style='color:#000000; font-family:Arial; font-size:14px'><b>COMENTARIOS, RECOMENDACIONES U OBSERVACIONES DEL CLIENTE</b></label></p>" +
                        //"<p><hr style='color:#000000;border:1px solid' /></p>" +
            "</td>" +
            "</tr>" +






            "<tr>" +
            "<td>&nbsp;" +
            "</td>" +
            "</tr>" +


            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + obsEV + "</label></p></td>" +
            "</tr>" +

            "<tr>" +
            "<td>&nbsp;" +
            "</td>" +
            "</tr>" +

            "<tr>" +
            "<td>" +

            //"<table width='100%' cellpadding='3' cellspacing='0' border='0' style='border-color:#000000'>" +
            //"<tr>" +
            //"<td width='50%' style='background-color:#000000'>" +
            //"<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'> ENTREGA:</label></p>" +
            //"</td>" +
            //"<td style='background-color:#000000'>" +
            //"<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'> RECIBE:</label></p>" +
            //"</td>" +
            //"</tr>" +
            //"</table>" +

            "<table width='100%' cellpadding='3' cellspacing='0' border='0' style='border-color:#000000'>" +
            "<tr>" +
            "<td width='50%'>" +
            "<p><label style='color:#000000; font-family:Arial; font-size:14px'><b> ENTREGA:</b></label></p>" +
            "</td>" +
            "<td>" +
            "<p><label style='color:#000000; font-family:Arial; font-size:14px'><b> RECIBE:</b></label></p>" +
            "</td>" +
            "</tr>" +

            //"<tr>" +
            //"<td colspan='2'>" +
            //"<p><hr style='color:#000000;border:1px solid' /></p>" +
            //"</td>" +
            //"</tr>" +



            "</table>" +



            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td>" +
            "<table width='100%' cellpadding='3' cellspacing='0'>" +
            "<tr>" +
            "<td width='50%'><br/><br/><br/></td>" +
            "<td><br/><br/><br/></td>" +
            "</tr>" +
            "<tr>" +
            "<td width='50%'><p><label style='font-family:Arial; font-size:11px'>Firma: _______________________________</label></p></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Firma: _______________________________</label></p></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + localStorage.getItem("ls_usunom").toLocaleString() + "</label></p></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + ev_nombres + "</label></p></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>ID: " + identifica_entrega + "</label></p></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>ID: " + ev_identifica_cliente + "</label></p></td>" +
            "</tr>" +

            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>&nbsp;</label></p></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Tel&#233;fonos: " + telEntrega + "</label></p></td>" +
            "</tr>" +

            "</table>" +
            "</td>" +
            "</tr>" +
            "</table>";


            var htmlFormatoEV_2 = htmlFormatoEV.replace("PARA CARPETA", "PARA GUARDIA");

            htmlFormatoEV = htmlFormatoEV + "<p style='page-break-before: always'>" + htmlFormatoEV_2 + "</p>";

            if (bolVisEV == false) {
                //alert("prueba");
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> IMPRIME</center>", htmlFormatoEV); 
                /* window.open( */
                cordova.plugins.printer.print(
                htmlFormatoEV,
                {
                    graystyle: true,
                },
                function (msg) {
                    kendo.ui.progress($("#nuevovehScreen"), false);

                },
                function (msg) {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                }
								)/* , '_blank') */;

            }
            else {
                localStorage.setItem("ls_htmlReporte", htmlReporte);
                kendo.ui.progress($("#nuevovehScreen"), false);
            }

            kendo.ui.progress($("#nuevovehScreen"), false);

            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (eimpev) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eimpev);
    }
}


function ConsultarMEUSA_IMP_2(inforimp) {
    try {
        var respOT = "0";

        var UrlFormImp = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh68PreguntasAvaluoGet/1,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        inforimp.codigo_sucursal + ";" +
        inforimp.codigo_agencia + ";" +
        inforimp.anio_vh26 + ";" +
        inforimp.numero_factura + ";" +
        inforimp.secuencia_detalle;

        var infEVImp;
        $.ajax({
            url: UrlFormImp,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    //  alert(data);

                    if (inspeccionar(data).includes("null") == true) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                    }
                    else {
                        infEVImp = (JSON.parse(data.vh68PreguntasAvaluoGetResult)).tvh68;
                        respOT = "1";
                    }
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", e);
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", err);
                kendo.ui.progress($("#nuevovehScreen"), false);
                return;
            }
        });


        if (respOT == "1") {
            try {
                var griddata = [];
                var tamano = infEVImp.length;
                for (var t = 0; t < infEVImp.length; t++) {
                    if (infEVImp[t].orden_presentacion < 10) {
                        infEVImp[t].orden_presentacion = "0" + infEVImp[t].orden_presentacion;
                    }
                }

                infEVImp.sort(function myfunction(a, b) {
                    return (a.corden_seccion + "" + a.orden_presentacion) - (b.corden_seccion + "" + b.orden_presentacion)
                });
                for (var i = 0; i < infEVImp.length; i++) {

                    var selecResp = new Array();
                    var sevResp = new Array();
                    var erResp = new Array();
                    var evResp = new Array();

                    if (infEVImp[i].tipo_respuesta == "SELECCION" || infEVImp[i].tipo_respuesta == "SEV") {
                        if (infEVImp[i].tipo_respuesta == "SEV") {
                            sevResp = infEVImp[i].lista_etiquetas.split(",");
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                            }
                        }
                        selecResp = infEVImp[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infEVImp[i].tipo_respuesta == "ER") {
                            erResp = infEVImp[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            selecResp = infEVImp[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infEVImp[i].tipo_respuesta == "EV") {
                                evResp = infEVImp[i].lista_etiquetas.split(",");
                                var evRes = [];
                                for (var l = 0; l < evResp.length; l++) {
                                    evRes.push({ evR: evResp[l] });
                                }
                            }
                        }
                    }

                    griddata.push({
                        codigo_empresa: localStorage.getItem("ls_idempresa").toLocaleString(),
                        codigo_sucursal: localStorage.getItem("ls_ussucursal").toLocaleString(),
                        codigo_agencia: localStorage.getItem("ls_usagencia").toLocaleString(),
                        // anio_vh62: "", // inforusa.anio_vh62,
                        secuencia_vh65: infEVImp[i].secuencia_vh65,
                        // secuencia_vh62: inforusa.secuencia_vh62,
                        seccion_formulario: infEVImp[i].seccion_formulario,
                        pregunta: infEVImp[i].pregunta,
                        orden_presentacion: infEVImp[i].orden_presentacion,
                        tipo_formulario: infEVImp[i].tipo_formulario,
                        tipo_respuesta: infEVImp[i].tipo_respuesta,
                        lista_respuesta: infEVImp[i].lista_respuesta,
                        lista_etiquetas: infEVImp[i].lista_etiquetas,
                        tipo_valor: infEVImp[i].tipo_valor,
                        selResp: infEVImp[i].respuesta,
                        sevResp: sevRes,
                        erResp: erRes,
                        evResp: evRes,
                        selRespt: infEVImp[i].respuesta,
                        sevRespt: "", // infEVImp[i].sevRespt,
                        erRespt: "", // infEVImp[i].erRespt,
                        evRespt: "", // infEVImp[i].evRespt,
                    });


                }
            } catch (ev1) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", ev1);
                return;
            }

            //  document.getElementById("divFormEV").innerHTML = "";
            var dataRespuesta = "";
            var tablaOT = "";
            tablaOT = "<table width='100%' border='0'  cellpadding='0' cellspacing='0' id='docume'>";
            var cuerpo;

            var griddata1 = griddata;


            //  tablaOT += "<tr align='center' style='background-color:#F44336'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"
            for (var i = 0; i < griddata1.length; i++) {

                var seccionFor = griddata1[i].seccion_formulario;

                //  alert(seccionFor);   

                tablaOT += "<tr><td style='width: 80%;'><p><label style='font-weight:bold; font-size:11px;color:#ffffff'>&nbsp;</label></p></td><td style='width: 1%;'>&nbsp;</td><td style='width: 19%;'>&nbsp;</td></tr>";

                //tablaOT += "<tr style='background-color:#000000'><td style='width: 80%;'><p><label style='font-weight:bold; font-size:11px;color:#ffffff'>" +
                //    griddata1[i].seccion_formulario +
                //    "</label></p></td><td style='width: 1%;'></td><td style='width: 19%;'></td></tr>";
                //tablaOT += "<tr><td style='width: 80%;'><p><label style='font-weight:bold; font-size:11px;color:#ffffff'>&nbsp;</label></p></td><td style='width: 1%;'>&nbsp;</td><td style='width: 19%;'>&nbsp;</td></tr>";

                tablaOT += "<tr><td colspan='3' style='width: 80%;'><p><label style='color:#000000; font-family:Arial; font-size:14px'><b>" +
                griddata1[i].seccion_formulario +
                "</b></label></p>" +
               //  "<p><hr style='color:#000000;border:1px solid' /></p>" +
                "</td></tr>";

                while (griddata1[i].seccion_formulario == seccionFor) {

                    tablaOT += "<tr><td><p><label style='font-family:Arial; font-size:11px'>" + griddata1[i].pregunta + "</label></p></td>";

                    if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
                        var sevUsa = "<td><table style='width: 100%;'><tr>";
                        if (griddata1[i].tipo_respuesta == "SEV") {
                            var valorsev = griddata1[i].sevRespt.split(',');
                            for (var l = 0; l < griddata1[i].sevResp.length; l++) {
                                sevUsa += "<td>&nbsp;</td>";

                                //   sevUsa += "<td><p><input id=SEV" + i + "" + l + " type='" + tipoUsa + "' style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
                            }
                        }
                        sevUsa += "</tr></table></td>";

                        if (griddata1[i].selRespt.length == 0) {
                            bolImprimeEV = false;
                        }

                        var selUsa = griddata1[i].selRespt; // seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                        tablaOT += sevUsa + "<td><p><label style='font-family:Arial; font-size:11px'>" + selUsa + "</label></p></td>";
                    } else {
                        if (griddata1[i].tipo_respuesta == "ER") {
                            var sevUsa = "<td><table style='width: 100%;'><tr>";
                            var valorer = griddata1[i].erRespt.split(',');
                            for (var l = 0; l < griddata1[i].erResp.length; l++) {
                                sevUsa += "<td>&nbsp;</td>";
                                // sevUsa += "<td><p><input id=ER" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value=" + valorer[l] + "></p></td>";
                            }
                            sevUsa += "</tr></table></td>";

                            if (griddata1[i].selRespt.length == 0) {
                                bolImprimeEV = false;
                            }

                            var selUsa = griddata1[i].selRespt;  //seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                            tablaOT += sevUsa + "<td><p><label style='font-family:Arial; font-size:11px'>" + selUsa + "</label></p></td>";
                        } else {
                            if (griddata1[i].tipo_respuesta == "EV") {
                                var sevUsa = "<td><table style='width: 100%;'><tr>";
                                var valorev = griddata1[i].evRespt.split(',');
                                for (var l = 0; l < griddata1[i].evResp.length; l++) {
                                    sevUsa += "<td>&nbsp;</td>";
                                    // sevUsa += "<td><p><input id=EV" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].evResp[l].evR + " value=" + valorev[l] + "></p></td>";
                                }
                                sevUsa += "</tr></table></td>";
                                tablaOT += sevUsa + "<td></td>";
                            }
                        }
                    }
                    tablaOT += "</tr>";
                    i++;
                    if (i == tamano) {
                        break;
                    }
                }
                i--;

            }

            dataRespuesta = griddata1;
            tablaOT += "</table>";

            return tablaOT;
        }
    } catch (ev2) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", ev2);
        return "";
    }
}


function imgLogoEV() {
    return "<img src='data:image/png;base64,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aVb/5/yR/V91S/BFH/+Jz7iIL3KczPmjwohf4ppnS5VXXdexnpnNRVke8mNsyvMsW6afVJxZG0i7VL7P4P8Otpv5/+3t7fCOiH14pvfHTCN9QZsgvNLinPZH/J5WHcs3vJeRXvd9PpNp0p66si3nHPjo/p9p5v/sO32eTEr4sOxY7SbHVMpQ9zP9VN4jr/TfqB1n/67wSh8f1vlsDiAeZeT9J+89itb4P4XNmG/p5/lugO2xYfbr7Jv0vXw3GI0V+T6a/T/HkPRVliXLO6vvEo+irfyPL/Ft9rWeTn8v6ONJjrXZ92bzUdaD/Hp7yPE802TM6TbpZJlu+Tvor9rK/6WyUb4Dlm37e3v3Ne0k/cD7BGnRpnjmFP9nPMYk8iLNXr4lPer8r5RSSimlnlOX2ufNdO9lL/nWlOsgl7BhfRvNvmv699RftfZ5tT+sOdSayWzNeo3S/31tI7/zR9/8S2shrJv082soyznqR/zjMbu/lN7oepbXLK1RvybubM1pVua/iv2y3PsjX9Y88pz2wjO5zp5tJPdeOWcNl3s5JrB3sya82zrLmeuJdY/1Ztaa+rpShfc61r1MK21Xx/QZkFdeox6nxHol90mXve6lMp+j7pdsb6P+z1obtmY/vms09le83Mct6COs860JP1Yv7JdjXv+3IfchEHsZdcy1yrRVptnzGtm3/xNBnNH9kf9HZT5Hff4/xf8Zf/b+kHbinL0Zjvgz/8lYE35qvfqcl3sC+HpUp/RBt09ez/LKsNE+E/ezP3OdeY/KfK628H/fRymfUKY8LzHWMX4yltGe14afUi/CGDf4jwAb074Qc233fx9zco/ymP/5fyLzKPX73f+zMp+rY/7PuR079H6SdS318Sl9g7+Iyzy2Vfgxu2cYtuT9OudhxnDiYue0NXud+DP3KI+Vg39r8SFtJ23KntnI/6Myn/MuyH5b1il9R9/OumKP0VhF3Eyv59f92fvBmnDCluqVYdSDuaT7N+fy0TcYz/fnRnn1MNpA34tMGxM/856Vufe1S2hpvUA9vvS/UkoppZRSSimllFJKXU07EREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREZE75B+Hl45q2TuOnAAAAVNta0JU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TS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qdNLfqnTS36p00t+qfMA3bQlKCKIa+5AAAeVG1rQlT6zsr+AH/mXQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeJztXAd4FNXaPltSNr2RQEISelcUKQJXRBFQ4EpvIUAIHZJQQicJSXYmIVJFRERRuYody7UgooIKclGUpvdarvVe/S3XLioinP/95pzZnWw2sAuJWWG+53mf2c3snDnne+dr55wJYz7KAhaSNdEefnKNxcE32iP4mhrGjcBGa9gLc6yOqIHhMWykI9rXrrnkuuh4tgddnWwL4+vRz4fR5togQDtGSsjvrr/5f77cFr4n1+pIGBUaxcaFRPrdz5qWbvWSGGesZCrGvdbAjw/j8/ke88F/NvhfaQnlG+zhfBWwugaxBrjF6nhuttURebb8j3REOf4aEfMYuOFboYc7MMbVUherDZ+9wZfz+rHAGuaErknnrHdMgt/9rA2ZZg27cnxQ+NeFxL8t3Nfx+dz+dLSfFRTxxSK0r0C/pRJOL5+dHp99OU/HZRbH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MS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmFwzMAAACAASURBVHic7L13nCVXeef9PaHCvbdz94SeKE1QQAEJSQgsAwaMDNgLXof18rJ+12aNsTFJCOf1i72vzb6f5ZVEMGCv8TqtjTG7RrbBJIEkEIoo5xnNaFLP9EzneO+tqnPO/lFV99bt6ZFmRjOaoPpJNRXO7a7Q3VXf+j3PeY6gVKlSL1m9FY1C0Y8QIUL6OKXAF9kEaMATEABaQAgowEsnB2mbOo7dNwADAqAJGJfOk2w9dhADkYPYQtSEKAE3i3MzGFdFcDPxC70MpUqVOgskTvUBlCpV6sToV6nhQHhYpXBeBiSBgCrQI3A96Vz0Clwv0A30CkQv0C3SqQaEQhBmEBOQwo0nQIHQAqRIQUciEKSgI5ceT/Hm4pa0ZesxYHGQgYtzkDicoQ0zzQxyms7RcFAH5hzMOdwsMAvMOMQsMOtw0w7mQMymcxoOIouIDCL5DB+x7+EG/pSFE3LNS5UqdfqoBJpSpc4AXUkfb2eBHXiiD1sR0CWgR0AvMCBwqwSsBFYIGMqmASFEn0xBpSIgFEL4MgUQLYWQAhAIpEjnApAinefrorUOFJez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' height='60' width='129'>";
}

/*--------------------------------------------------------------------
Fecha: 28/02/2018
Descripcion: Muestra u oculta IMEI y confirmacion IMEI
Parametros: SI / NO
--------------------------------------------------------------------*/
function verIMEI(valorIMEI) {
    if (valorIMEI == "SI") {
        document.getElementById("lblIMEI").style.display = "block";
        document.getElementById("ev_imei").style.display = "block";
        document.getElementById("lblIMEI_conf").style.display = "block";
        document.getElementById("ev_imei_conf").style.display = "block";
    }
    else {
        document.getElementById("lblIMEI").style.display = "none";
        document.getElementById("ev_imei").style.display = "none";
        document.getElementById("lblIMEI_conf").style.display = "none";
        document.getElementById("ev_imei_conf").style.display = "none";
    }
}


function registrarEV() {
    kendo.ui.progress($("#nuevovehScreen"), true);
            setTimeout(function () {
    try {
        var ev_yyyy = document.getElementById("ev_yyyy").value;
        var ev_hh = document.getElementById("ev_hh").value;
        var ev_numfac = document.getElementById("ev_numfac").value;
        var ev_placa_conf = document.getElementById("ev_placa_conf").value;
        var ev_imei = document.getElementById("ev_imei").value;
        var ev_imei_conf = document.getElementById("ev_imei_conf").value;
        var ev_identifica_cliente = document.getElementById("ev_identifica_cliente").value;
        var ev_nombres = document.getElementById("ev_nombres").value;
        var ev_apellidos = document.getElementById("ev_apellidos").value;
        var ev_secuencia_detalle = document.getElementById("ev_secuencia_detalle").value;
        var ev_vh26 = document.getElementById("ev_vh26").value;
        var ev_vin = document.getElementById("ev_vin").value;
        var tipo_id_cliente = document.getElementById("tipo_id_cliente").value;
        var obsEV = document.getElementById("obsEV").value;

        var relacion_con_cliente = document.getElementById("ev_relacionev").value;

        var tipo_persona_recibe_vh = document.getElementById("persona_tipo").value;
        var tipo_documento_recibe_vh = document.getElementById("tipo_id_cliente").value;
        var nombre_recibe_vh = document.getElementById("ev_nombres").value + "," +
             document.getElementById("ev_nombres_2").value + "," +
            document.getElementById("ev_apellidos").value + "," +
            document.getElementById("ev_apellidos_2").value;

        nombre_recibe_vh = nombre_recibe_vh.toUpperCase();

        var nacionalidad_cliente = "ECUATORIANA";

        if (tipo_id_cliente == "PASAPORTE") {
            nacionalidad_cliente = document.getElementById("nacionalidad_cliente").value;
        }

        var ev_telefono_cliente = document.getElementById("ev_telefono_cliente").value;
        var ev_celular_cliente = document.getElementById("ev_celular_cliente").value;
        var ev_email_cliente = document.getElementById("ev_email_cliente").value;
        var ev_estado_entrega = document.getElementById("ev_estado_entrega").value;


        //-----------------------------------------
        var bolIMEI = false;

        var choices = [];
        var els = document.getElementsByName('selIMEI');
        for (var i = 0; i < els.length; i++) {
            if (els[i].checked) {
                if (els[i].value == "SI") {
                    bolIMEI = true;
                }
            }
        }
        //-----------------------------------------

        // PLACA
        if (ev_placa_conf.trim() == "") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Confirme la Placa</center>");
            return;
        }
        else {
            if (ev_placa_conf.length != 7) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>La Placa ingresada es incorrecta</center>");
                return;
            }
        }


        // IME NUEVO
        var bolVeriIMEI = false

        for (var i = 0; i < els.length; i++) {
            if (els[i].checked) {
                bolVeriIMEI = true;
                break;
            }
        }

        if (bolVeriIMEI == false) {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Seleccione si dispone de Dispositivo Satelital</center>");
            return;
        }
        else {
            for (var i = 0; i < els.length; i++) {
                if (els[i].checked) {
                    if (els[i].value == "SI" && ev_imei_conf.trim() == "") {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Confirme el N&#250;mero de IMEI</center>");
                        return;
                    }
                }
            }
        }

        // CI recibe
        if (ev_identifica_cliente.trim() == "") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese el ID de la Persona<br/>que Recibe el Veh&#237;culo</center>");
            return;
        }


        // Relacion
        if (relacion_con_cliente.trim() == "") {
            if (document.getElementById("rbOtro").checked == true) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese la Relaci&#243;n de la Persona<br/>que Recibe el Veh&#237;culo</center>");
                return;
            }
        }


        // Recibe
        if (ev_apellidos.trim() == "") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese los Nombres y Apellidos de la Persona<br/>o la Raz&#243;n Social que Recibe el Veh&#237;culo</center>");
            return;
        }


        // Telefono Recibe
        var ev_telefono_cliente = document.getElementById("ev_telefono_cliente").value;
        //alert(ev_telefono_cliente.trim().length);
        if (ev_telefono_cliente.trim().length > 1 && ev_telefono_cliente.trim().length < 9) {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Tel&#233;fono de la Persona<br/>que Recibe el Veh&#237;culo<br/>Se admite un m&#225;ximo de 9 caracteres</center>");
            return;
        }
        else {
            if (ev_telefono_cliente.length > 9) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Tel&#233;fono de la Persona<br/>que Recibe el Veh&#237;culo <br/>Se admite un m&#225;ximo de 9 caracteres</center>");
                return;
            }
        }

        // Celular Recibe
        var ev_celular_cliente = document.getElementById("ev_celular_cliente").value;
        if (ev_celular_cliente.trim() == "") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Celular de la Persona<br/>que Recibe el Veh&#237;culo<br/>Se admite un m&#225;ximo de 10 caracteres</center>");
            return;
        }
        else {
            if (ev_celular_cliente.length != 10) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Celular de la Persona<br/>que Recibe el Veh&#237;culo<br/>Se admite un m&#225;ximo de 10 caracteres</center>");
                return;
            }
        }

        // Email Recibe
        var ev_email_cliente = document.getElementById("ev_email_cliente").value;
        if (ev_email_cliente.trim() == "" || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(ev_email_cliente) == false) {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Email de la Persona<br/>que Recibe el Veh&#237;culo</center>");
            return;
        }


        // OBSERVACIONES
        if (obsEV.trim().length < 2) {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese las Observaciones</center>");
            return;
        }


        // ENCUESTA
        var cboEncEV = document.getElementById("cboEncEV").value;
        if (cboEncEV == "0") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Seleccione una opci&#243;n para calificar el servicio del asesor</center>");
            return;
        }

        // CUPONES
        var cuponesEV = document.getElementById("cuponesEVN").value;
        var cuponDesde = document.getElementById("cuponD").value;
        var cuponHasta = document.getElementById("cuponH").value;
        
        if (cuponesEV !== "NO") {
            if (cuponDesde == "" || cuponDesde == null || cuponDesde=="0") {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha ingresado numeración de cupon</center>");
                return;
            }
            if (cuponHasta == "" || cuponHasta == null || cuponHasta=="0") {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha ingresado numeración de cupon</center>");
                return;
            }
        }else{
            cuponDesde = "0"; 
            cuponHasta = "0";
        }
        
        // Imagen
        var fileOT_ev = document.getElementById("fileOT_ev").value;
        if (fileOT_ev != "OK") {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha realizado la captura de la imagen</center>");
            return;
        }
            //console.log(inspeccionar(dataRespuesta[0]));
            //console.log(dataRespuesta.length);
        for (var i = 0; i < dataRespuesta.length; i++) {
            //alert(dataRespuesta[i].tipo_respuesta);
            var sevRespts = [];
            var erRespts = [];
            var evRespts = [];
            if (dataRespuesta[i].tipo_respuesta == "SELECCION" || dataRespuesta[i].tipo_respuesta == "SEV") {
                if (dataRespuesta[i].tipo_respuesta == "SEV") {

                    for (var l = 0; l < dataRespuesta[i].sevResp.length; l++) {
                        if (document.getElementById("SEV" + i + "" + l) != null) {
                            //dataRespuesta[i].sevResp[l] = document.getElementById("SEV" + i + "" + l).value.toLocaleString();
                            sevRespts[l] = document.getElementById("SEV" + i + "" + l).value.toLocaleString();
                            //alert(i + "sev " + inspeccionar(dataRespuesta[i].sevResp[l]));
                        }
                    }
                }
                dataRespuesta[i].selRespt = document.getElementById("SEL" + i).value.toLocaleString();

                // Observaciones x seleccion
                dataRespuesta[i].obsRespt = document.getElementById("OBS" + i).value.toLocaleString();

            }
            if (dataRespuesta[i].tipo_respuesta == "ER") {
                for (var k = 0; k < dataRespuesta[i].erResp.length; k++) {
                    if (document.getElementById("ER" + i + "" + k) != null) {
                        //dataRespuesta[i].erResp[l].erR = document.getElementById("ER" + i + "" + l).value;
                        erRespts[k] = document.getElementById("ER" + i + "" + k).value;
                    }
                    //alert(inspeccionar(erRespts));
                }
                dataRespuesta[i].selRespt = document.getElementById("SEL" + i).value.toLocaleString();


            }
            if (dataRespuesta[i].tipo_respuesta == "EV") {
                //var sevUsa = "<td><table style='width: 100%;'><tr>";
                for (var m = 0; m < dataRespuesta[i].evResp.length; m++) {
                    if (document.getElementById("EV" + i + "" + m) != null) {
                        //dataRespuesta[i].evResp[l].evR = document.getElementById("EV" + i + "" + l).value;
                        evRespts[m] = document.getElementById("EV" + i + "" + m).value;
                    }
                    //else {

                    //}
                }
            }
            dataRespuesta[i].sevRespt = sevRespts;
            dataRespuesta[i].erRespt = erRespts;
            dataRespuesta[i].evRespt = evRespts
        }

        var para = [];
        if (dataRespuesta.length > 0) {
            try {
                for (var i = 0; i < dataRespuesta.length; i++) {
                    var sevRespuesta = dataRespuesta[i].sevRespt;
                    var erRespuesta = dataRespuesta[i].erRespt;
                    var evRespuesta = dataRespuesta[i].evRespt;
                    var sevRespuestaS = "";
                    if (sevRespuesta != null) {
                        for (var j = 0; j < sevRespuesta.length; j++) {
                            sevRespuestaS += sevRespuesta[j];
                            sevRespuestaS += ",";
                        }
                    }
                    var erRespuestaS = "";
                    if (erRespuesta != null) {
                        for (var j = 0; j < erRespuesta.length; j++) {
                            erRespuestaS += erRespuesta[j];
                            erRespuestaS += ",";
                        }
                    }

                    var evRespuestaS = "";
                    if (evRespuesta != null) {
                        for (var j = 0; j < evRespuesta.length; j++) {
                            evRespuestaS += evRespuesta[j];
                            evRespuestaS += ",";
                        }
                    }

                    para[i] = {
                        "codigo_empresa": localStorage.getItem("ls_idempresa").toLocaleString(),
                        "codigo_sucursal": localStorage.getItem("ls_ussucursal").toLocaleString(),
                        "codigo_agencia": localStorage.getItem("ls_usagencia").toLocaleString(),
                        "anio_vh26": ev_vh26,
                        "numero_factura": ev_numfac,
                        "secuencia_detalle": ev_secuencia_detalle,
                        "secuencia_vh65": dataRespuesta[i].secuencia_vh65,
                        "tipo_formulario": dataRespuesta[i].tipo_formulario,
                        "seccion_formulario": dataRespuesta[i].seccion_formulario,
                        "pregunta": dataRespuesta[i].pregunta,
                        "orden_presentacion": dataRespuesta[i].orden_presentacion,
                        "selRespt": dataRespuesta[i].selRespt,
                        "sevRespt": sevRespuestaS, //dataRespuesta[i].sevRespt,
                        "erRespt": erRespuestaS, //dataRespuesta[i].erRespt,
                        "evRespt": evRespuestaS, //dataRespuesta[i].evRespt,
                        "cuser": localStorage.getItem("ls_usulog").toLocaleString(),
                        "observacion": dataRespuesta[i].obsRespt
                    };
                }
                var cont = i;
                var codigo_empresa = dataRespuesta[i - 1].codigo_empresa;
                var codigo_sucursal = dataRespuesta[i - 1].codigo_sucursal;
                var codigo_agencia = dataRespuesta[i - 1].codigo_agencia;
                var anio_vh62 = dataRespuesta[i - 1].anio_vh62;
                var secuencia_vh65 = dataRespuesta[i - 1].secuencia_vh65;
                var secuencia_vh62 = dataRespuesta[i - 1].secuencia_vh62;
                var tipo_formulario = dataRespuesta[i - 1].tipo_formulario;

                for (var j = 0; j < dataRespuesta1.length; j++) {
                    dataRespuesta1[j].respuestaclase = document.getElementById("INV" + j).value;
                }

                for (var k = 0; k < dataRespuesta1.length; k++) {
                    para[cont] = {
                        "codigo_empresa": codigo_empresa,
                        "codigo_sucursal": codigo_sucursal,
                        "codigo_agencia": codigo_agencia,
                        //"anio_vh62": anio_vh62,
                        "estado": "ENTREGADO",
                        //"secuencia_vh65": secuencia_vh65,
                        //"secuencia_vh62": secuencia_vh62,
                        "tipo_formulario": tipo_formulario,
                        "seccion_formulario": "",
                        "pregunta": dataRespuesta1[k].nombreclase,
                        "orden_presentacion": "",
                        "selRespt": dataRespuesta1[k].respuestaclase,
                        "sevRespt": "",
                        "erRespt": "",
                        "evRespt": "",
                        "cuser": localStorage.getItem("ls_usulog").toLocaleString()
                    };
                    cont += 1;
                }
            } catch (e) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                return;
            }

            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh68VehiculosSet";
            var etapaVh03 = false;
            
            //preguntas
            for (let index = 0; index < para.length; index++) {
                if (para[index].selRespt == "Seleccione") {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>La pregunta: "+ para[index].pregunta + "<br> Sin responder</center>");
                    etapaVh03=false;
                    return;
                }
            }

            $.ajax({
                url: Url,
                type: "POST",
                data: JSON.stringify(para),
                async: false,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (datas) {
                    if (datas.substr(0, 1) == "1") {
                        etapaVh03 = true;
                    } else {

                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", datas.substr(2, datas.length - 2));
                        return;
                    }
                },
                error: function (err) {
                    //alert(inspeccionar(err));
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error en conexión comuniquese con el administrador por favor");
                    return;
                }
            });
                //alert(etapaVh03);
                //etapaVh03=false;
            if (etapaVh03 == true) {
                var UrlVh03 = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh03VehiculosSet";
                var persona_clase = document.getElementById("txt_vip_ev").value;
                var parVh03 = {
                    "codigo_empresa": localStorage.getItem("ls_idempresa").toLocaleString(),
                    "codigo_sucursal": localStorage.getItem("ls_ussucursal").toLocaleString(),
                    "codigo_agencia": localStorage.getItem("ls_usagencia").toLocaleString(),
                    "anio_vh26": ev_vh26,
                    "numero_factura": ev_numfac,
                    "secuencia_detalle": ev_secuencia_detalle,
                    "chasis": ev_vin,
                    "placa": ev_placa_conf,
                    "dispositivo_satelital": bolIMEI,
                    "numero_satelital": ev_imei_conf, // ev_imei,
                    "identifica_recibe_vh": ev_identifica_cliente,
                    "nacionalidad_recibe_vh": nacionalidad_cliente,
                    "telefono_recibe_vh": ev_telefono_cliente,
                    "celular_recibe_vh": ev_celular_cliente,
                    "mail_recibe_vh": ev_email_cliente,
                    "fecha_entrega": ev_yyyy,
                    "hora_entrega": ev_hh,
                    "identifica_entrega": "",
                    "nombre_entrega_vehiculo": localStorage.getItem("ls_usunom").toLocaleString(),
                    "usuario_entrega": localStorage.getItem("ls_usulog").toLocaleString(),
                    "estado_entrega": ev_estado_entrega,
                    "cuser_entrega": localStorage.getItem("ls_usulog").toLocaleString(),
                    "cobservaciones": obsEV,
                    "tipo_persona_recibe_vh": tipo_persona_recibe_vh,
                    "tipo_documento_recibe_vh": tipo_documento_recibe_vh,
                    "nombre_recibe_vh": nombre_recibe_vh,
                    "relacion_con_cliente": relacion_con_cliente,
                    "evaluacion_asesor_entrega": document.getElementById("cboEncEV").value

                    // VIP
                    , "persona_clase": persona_clase,
                    "numero_cupon_desde":cuponDesde,
                    "numero_cupon_hasta":cuponHasta
                };

                $.ajax({
                    url: UrlVh03,
                    type: "POST",
                    data: JSON.stringify(parVh03),
                    async: false,
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    success: function (datavh03) {
                        if (datavh03.substr(0, 1) == "1") {
                            kendo.ui.progress($("#nuevovehScreen"), false);
                            
                            var htmlBotones = "";
                            bolImprimeEV = true;
                            if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                                htmlBotones = "<button id='btnRegrearEntrega0' onclick='volverForm()' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" /* +
                                "<button id='btnRegrearEntrega1' onclick='ValidarGrabar();' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-floppy-o' aria-hidden='true'></i> GUARDAR</button>" */;
                                htmlBotones += "<button id='btnRegrearEntrega2' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-print' aria-hidden='true'></i> IMPRIMIR</button>";
                                htmlBotones += "<button id='btnRegrearEntrega3' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega3' class='fa fa-envelope' aria-hidden='true'></i> MAIL</button>";

                            }
                            else {
                                htmlBotones = "<button id='btnRegrearEntrega0' onclick='volverForm()' class='w3-btn'><i id='icnRegrearEntrega0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" /* +
                                "<button id='btnRegrearEntrega1' onclick='ValidarGrabar();' class='w3-btn'><i id='icnRegrearEntrega1' class='fa fa-floppy-o' aria-hidden='true'></i> </button>" */;
                                htmlBotones += "<button id='btnRegrearEntrega2' onclick='formatoImpEV(false);' class='w3-btn'><i id='icnRegrearEntrega2' class='fa fa-print' aria-hidden='true'></i> </button>";
                                htmlBotones += "<button id='btnRegrearEntrega3' onclick='enviaMailEV();' class='w3-btn'><i id='icnRegrearEntrega3' class='fa fa-envelope' aria-hidden='true'></i> MAIL</button>";

                            }

                            document.getElementById("btnFooterEntrega").innerHTML = htmlBotones;
                            llamarNuevoestilo("btnRegrearEntrega");
                            llamarNuevoestiloIconB("icnRegrearEntrega");
                            window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ENTREGADO</center>", "<center>El Veh&#237;culo con<br/>VIN: <b>" + ev_vin +
                                "</b><br/>Placa: <b>" + ev_placa_conf + "</b><br/>Ha sido entregado satisfactoriamente</center>");

                            return;
                            
                        } else {
                            kendo.ui.progress($("#nuevovehScreen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", datavh03.substr(2, datavh03.length - 2));
                            return;
                        }
                    },
                    error: function (err) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                        return;
                    }
                });
    
            }
        }

        //------------------------------------------------------------------------------------------------------------------


    } catch (e) {
         
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 7ERROR</center>", inspeccionar(e));
        return;
    }
    kendo.ui.progress($("#nuevovehScreen"), false);
  }, 2000);
}
function ValidarGrabar() {
    kendo.ui.progress($("#nuevovehScreen"), false);
    alert("Encuesta esta en estado ENTREGADO");
    return;
}

function ConsultarClienteEV(identificacion) {
    try {

        //  document.getElementById("ev_identifica_cliente").value = "";
        document.getElementById("ev_nombres").value = "";
        document.getElementById("ev_nombres_2").value = "";
        document.getElementById("ev_apellidos").value = "";
        document.getElementById("ev_apellidos_2").value = "";
        document.getElementById("ev_telefono_cliente").value = "";
        document.getElementById("ev_email_cliente").value = "";
        document.getElementById("ev_celular_cliente").value = "";
        document.getElementById("ev_nombres").value = "";
        document.getElementById("ev_apellidos").value = "";

        // VIP PERSONA
        document.getElementById("vip_ev").innerHTML = "";
        document.getElementById("vip_ev").style.display = "none";
        document.getElementById("txt_vip_ev").value = "";

        //// Cbo de tipos de EV
        //cboEVTipos("CLIENTE");
        //// Cbo Estado 
        //cboCargaEV("estado_EV", arrEstEV, arrEstEV[0], "ev_divcboestado");

        //// Cbo. Tipo persona
        //cboCargaEV("persona_tipo", arrTipPers, arrTipPers[0], "ev_divcbotpers");
        //// Cbo. Tipod de documento 
        //cboCargaEV("tipo_id_cliente", arDoc, arDoc[0], "ev_divcbotid");
        //// Cbo. tipo direccion 
        //cboCargaEV("direccion_cliente", arrDir, arrDir[0], "ev_divcbodirec");


        if (identificacion != "") {

            kendo.ui.progress($("#nuevovehScreen"), true);
            setTimeout(function () {
                // precarga *********************************************************************************************

                // Primera vez URL2
                //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/tg04PersonaGet/JSON;1002794855

                var Url = "";
                var infor;

                if (recurrEVCliente == 0) {
                    Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/tg04PersonaGet/JSON;" + identificacion;

                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> PERSONA EV</center>", Url);

                    $.ajax({
                        url: Url,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            try {
                                infor = (JSON.parse(data.tg04PersonaGetResult)).ttg04[0];
                            }
                            catch (e) {
                                kendo.ui.progress($("#nuevovehScreen"), false);
                                recurrEVCliente = 1;
                                return;
                            }
                        },
                        error: function (err) {
                            kendo.ui.progress($("#nuevovehScreen"), false);
                            recurrEVCliente = 1;
                            return;
                        }
                    });
                }
                else if (recurrEVCliente == 1) {
                    recurrEVCliente = 2;
                    Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TG/Parametros.svc/tg91PersonaGet/JSON;" + identificacion;

                    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

                    $.ajax({
                        url: Url,
                        type: "GET",
                        async: false,
                        dataType: "json",
                        success: function (data) {
                            try {
                                infor = (JSON.parse(data.tg91PersonaGetResult)).ttg91[0];
                            }
                            catch (e) {
                                kendo.ui.progress($("#nuevovehScreen"), false);
                                return;
                            }
                        },
                        error: function (err) {
                            kendo.ui.progress($("#nuevovehScreen"), false);
                            return;
                        }
                    });
                }

                //  alert(inspeccionar(infor));

                // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> consultacliente</center>", inspeccionar(infor));

                //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> infor</center>", inspeccionar(infor));


                if (inspeccionar(infor).length > 0) {
                    recurrEVCliente = 0;
                    //document.getElementById("ev_persona_numero").value = infor.persona_numero;
                    //document.getElementById("ev_calle_cliente").value = infor.calle_cliente;
                    //document.getElementById("ev_calle_interseccion").value = infor.calle_interseccion;
                    //document.getElementById("ev_numero_calle").value = infor.numero_calle;
                    document.getElementById("ev_telefono_cliente").value = infor.telefono_cliente;
                    document.getElementById("ev_email_cliente").value = infor.email_cliente;

                    //  alert(infor.persona_numero_profesional);

                    //       document.getElementById("persona_numero_profesional").value = "0";// infor.persona_numero_profesional;

                    document.getElementById("ev_celular_cliente").value = infor.celular_cliente;

                    if (infor.persona_nombre.trim() != "") {
                        if (infor.persona_nombre.includes(",") == true) {
                            var arrCliNom = infor.persona_nombre.split(",");
                            document.getElementById("ev_nombres").value = arrCliNom[2];
                            document.getElementById("ev_nombres_2").value = arrCliNom[3];
                            document.getElementById("ev_apellidos").value = arrCliNom[0];
                            document.getElementById("ev_apellidos_2").value = arrCliNom[1];
                        }
                        else {
                            document.getElementById("ev_apellidos").value = infor.persona_nombre;
                        }
                    }


                    document.getElementById("divcboEVNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";

                    document.getElementById("ev_divcbotpers").innerHTML = "<p><input type='text' id='persona_tipo' value='NATURAL' class='w3-input textos' readonly /></p>";


                    //// Cbo. Tipod de documento 
                    cboCargaEV("tipo_id_cliente", arDoc, infor.tipo_id.toUpperCase(), "ev_divcbotid");


                    // VIP PERSONA
                    document.getElementById("txt_vip_ev").value = infor.persona_clase;
                    document.getElementById("vip_ev").innerHTML = "<div id='rcorners2'>" + infor.persona_clase + "</div>";
                    if (infor.persona_clase.trim() != "") {
                        document.getElementById("vip_ev").style.display = "initial";
                    }
                    else {
                        document.getElementById("vip_ev").style.display = "none";
                    }

                    //  cboCargaEV("tipo_id_cliente", arDoc, infor.tipo_id_representante.toUpperCase(), "ev_divcbotid");
                }
                else {
                    if (recurrEVCliente > 1) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        recurrEVCliente = 0;
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;<b>" + identificacion + "</b>");
                        //return;
                    }
                    else {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        recurrEVCliente = 1;
                        ConsultarClienteEV(identificacion);
                        //return;
                    }
                }

                kendo.ui.progress($("#nuevovehScreen"), false);
                // precarga *********************************************************************************************
            }, 2000);

        }
        else {
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de C&eacute;dula");
            //return;
        }

    } catch (e) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", e);
        //return;
    }
}


function captureImagenEV() {

    try {

        document.getElementById("playVideo_ev").innerHTML = "";
        document.getElementById('fileOT_ev').value = "";


        //navigator.device.capture.captureImage(onSuccess01, onFail01, { limit: 1 });
        //navigator.device.capture.captureImage(captureSuccessEV, onFail01, { limit: 1 });
        var versionTabletEV =navigator.appVersion;
        if (versionTabletEV.split(';')[1].trim() == "Android 10" && versionTabletEV.split(';')[2].includes("Lenovo TB-X306X") ) {
            navigator.camera.getPicture(onSuccess01, onFail01, {
                quality: 100,
                targetWidth: 800,
                targetHeight: 800,
                destinationType: Camera.DestinationType.FILE_URI,
                correctOrientation: true
            });
        } else {
            navigator.device.capture.captureImage(captureSuccessEV, onFail01, { limit: 1 });
        }
        /* navigator.camera.getPicture(onSuccess01, onFail01, {
            quality: 100,
            targetWidth: 800,
            targetHeight: 800,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
        }); */

        //navigator.camera.getPicture(onSuccess01, function (message) {
        //}, {
        //    quality: 50,
        //    destinationType: navigator.camera.DestinationType.FILE_URI,
        //    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        //});
    }
    catch (errorCam) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        document.getElementById("playVideo_ev").innerHTML = "";
        document.getElementById('fileOT_ev').value = "";
        //  alert(errorCam);
    }
}
function captureSuccessEV(mediaFiles) {
    kendo.confirm("<center><h1><i class=\"fa fa-cloud-upload\"></i> SUBIR ARCHIVO</h1><br />Desea guardar el archivo en el Repositorio ?</center>")
   .done(function () {
       var i, len;
       for (i = 0, len = mediaFiles.length; i < len; i += 1) {
           uploadVideoEV(mediaFiles[i]);
       }
   })
   .fail(function () {
       kendo.ui.progress($("#lector_barrasScreen"), false);
   });
   llamarColorBotonGeneral(".k-primary");
}

function onSuccess01(imageURI) {
    uploadPhotoEV(imageURI);
}
function uploadVideoEV(mediaFile) {

    try {
        document.getElementById("fileOT_ev").innerHTML = "";
        document.getElementById("videosOT_ev").innerHTML = "";

        var mediaPlayer = "";

        var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;

        var videoURI = path;
        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;
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
        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
        hhmm = hhmm.replace(":", "");
        var arrExtension = videoURI.split(".");
        var camposEV = parametrosEntregaCompleto();
        var pathServidor = camposEV["descripcion-2"] + "\\" + document.getElementById("ev_vin").value;
        var nombreArchivoEV = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
        localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
                document.getElementById("ev_vin").value + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];
    
        var fileVideo = mediaFile + "|" + nombreArchivoEV + "|" + pathServidor;
       
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;
        options.mimeType = "video/mp4";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        // Variable del archivo
        var ft = new FileTransfer();
        // Presenta el porcentaje de subida de la imagen
        ft.onprogress = function (progressEvent) {
            if (progressEvent.llengthComputable) {
                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                document.getElementById("videosOT_ev").innerHTML = "";
                document.getElementById("statusDom").innerHTML = "<br/><center><i class='fa fa-cog fa-spin fa-lg'></i><br/><b>" + perc + "% guardando...</b></center>";

            } else {
                if (document.getElementById("fileOT_ev").innerHTML == "") {
                    document.getElementById("fileOT_ev").innerHTML = "guardando";
                } else {
                    document.getElementById("fileOT_ev").innerHTML += ".";
                }
            }
        };

        // Ejecuta el proceso de subida de la imagen
        // http://ecuainfo78-002-site3.btempurl.com/FileUpload.asmx/guardaArchivo

        //  var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";



        ft.upload(videoURI, UrlSube,
            function (result) {
                //alert(videoURI+"   "+UrlSube);
                document.getElementById('fileOT_ev').value = "OK";

                verArchivosEV(document.getElementById("ev_vin").value);
                document.getElementById("videosOT_ev").innerHTML = "<p><label class='w3-text-red'> <b>Importante</b></label><br/>Para realizar la captura de imagen coloque el dispositivo en posici&oacute;n horizontal. </p><br />" +
                    "<p><center><img src='kendo/styles/images/tablet_orientacion.png' /></center></p><br />" +
                    "<p><center>" +
                    "<a i='btnImagenEntrega0' class='w3-btn' aria-label='Imagen' onclick='captureImagenEV();'><i i='icnImagenEntrega0' class='fa fa-camera' aria-hidden='true'></i>&nbsp;Imagen</a>" +
                    "</center></p>";
                    llamarNuevoestilo("btnImagenEntrega");
                    llamarNuevoestiloIconB("icnImagenEntrega");
            },
        function (error) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", inspeccionar(error));
        },
        options);
    }
    catch (e) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR0108</center>", e);
    }
}
function onFail01(message) {
    kendo.ui.progress($("#nuevovehScreen"), false);
    document.getElementById("playVideo_ev").innerHTML = "";
    document.getElementById('fileOT_ev').value = "";

    //   alert('Failed because: ' + message);
}
function parametrosOTCompletoEV() {
    try {

        var accResp = "";

        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;PATH_ENTREGAS";

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> Url</center>", Url);
console.log(Url);
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

function captureErrorEV(error) {
    kendo.ui.progress($("#nuevovehScreen"), false);
}

function uploadPhotoEV(mediaFile) {
    try {
        document.getElementById("listaVideo_ev").innerHTML = "";
        document.getElementById("playVideo_ev").innerHTML = "";

        var ft = new FileTransfer();
        //path = mediaFile.fullPath,
        //name = mediaFile.name;

        var vidPorcentaje = 80;
        var vidAlto = (screen.width * 50) / 100;
        var vidAncho = (screen.width * 80) / 100;

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

        var hhmm = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second:"numeric" });
        hhmm = hhmm.replace(":", "");
        var arrExtension = mediaFile.split(".");


        var camposEV = parametrosEntregaCompleto();

        //  pathVer_ot = camposEV["campo01"];

        var pathServidor = camposEV["descripcion-2"] + "\\" + document.getElementById("ev_vin").value;


        //  alert(camposEV["descripcion-2"]);

        //  var pathServidor = parametrosEntrega() + "\\" +  document.getElementById("ev_vin").value; 

        var nombreArchivoEV = localStorage.getItem("ls_empresa").toLocaleString().substring(0, 5) + "_" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + "_" +
    localStorage.getItem("ls_usagencia").toLocaleString() + "_" +
            document.getElementById("ev_vin").value + "_" + yyyy + mm + dd + "_" + hhmm.replace(":", "") + "." + arrExtension[arrExtension.length - 1];

        var fileVideo = mediaFile + "|" + nombreArchivoEV + "|" + pathServidor;

        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> fileVideo</center>", fileVideo);
        //return;

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileVideo;

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;

        //   var UrlSube = "http://localhost:4044/Services/TL/Taller.svc/guardaArchivoEntrega";

        // MAYORISTA:  var UrlSube = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        var UrlSube = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/guardaArchivoEntrega";
        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlSube</center>", UrlSube);


        kendo.ui.progress($("#nuevovehScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            ft.upload(mediaFile, UrlSube,
                       function (result) {
                           //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(result));
                           document.getElementById('fileOT_ev').value = "OK";

                           verArchivosEV(document.getElementById("ev_vin").value);

                           //var vidAlto = (screen.width * 50) / 100;
                           //var vidAncho = (screen.width * 80) / 100;

                           //if (mediaFile.includes("mp4")) {
                           //    document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                           //        "' controls Autoplay=autoplay><source src='" + mediaFile + "' type='video/mp4'></video></p></center><br />";
                           //}
                           //else if (mediaFile.includes("jpg")) {
                           //document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><img src='" + mediaFile + "' width='" + vidAncho + "' /></p></center><br />";
                           //}


                           kendo.ui.progress($("#nuevovehScreen"), false);
                       },
                   function (error) {
                       document.getElementById('fileOT_ev').value = "";
                       kendo.ui.progress($("#nuevovehScreen"), false);
                       window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
                   },
           options);

            kendo.ui.progress($("#nuevovehScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (e) {
        document.getElementById('fileOT_ev').value = "";
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return;
    }
}

function winEV(r) {
    kendo.ui.progress($("#nuevovehScreen"), false);
    // document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><img src='" + mediaFiles[i].fullPath + "' width='" + vidAncho + "' /></p></center><br />";
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(r));
}

function failEV(error) {
    kendo.ui.progress($("#nuevovehScreen"), false);
    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(error));
}


function verArchivosEV(numVIN) {
    try {
        kendo.ui.progress($("#nuevovehScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************
            document.getElementById("listaVideo_ev").innerHTML = "";

            var pathVer_ot = "";
            if (parametrosEntregaCompleto() == "error") {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen Parametros ingresados");
                return;
            }
            else {

                var camposEV = parametrosEntregaCompleto();

                pathVer_ot = camposEV["campo01"];

                var pathVinEV = camposEV["descripcion-2"] + "\\" + numVIN;

               //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> arrfileGral</center>", pathVinEV);

                var jsonData = JSON.stringify({ 'pathVinEV': pathVinEV });
                var ArchivoVIN = "";
                var arrImgVIN = [];
                var arrVidVIN = [];
                var vidPorcentaje = 80;
                var vidAlto = (screen.width * 50) / 100;
                var vidAncho = (screen.width * 80) / 100;

                var mailFileEVN = "";

                //   var UrlVerArc = "http://localhost:4044/Services/TL/Taller.svc/verArchivoEntrega";

                var UrlVerArc = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/verArchivoEntrega";

                $.ajax({
                    type: "POST",
                    url: UrlVerArc,
                    data: jsonData,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    error: function (xhr, status, error) {
                        kendo.ui.progress($("#nuevovehScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", xhr.responseText);
                        return;

                        //alert the error if needed
                        // alert("Sorry there is an error: " + xhr.responseText);
                    },
                    success: function (responseData) {

                        ArchivoVIN = inspeccionar(responseData).replace("string verArchivoEntregaResult : ", "");
                        var htmlVideoEV = "";

                        if (ArchivoVIN.includes("*") == true) {
                            var arrfileGral = ArchivoVIN.split("*");

                            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> arrfileGral</center>", inspeccionar(arrfileGral));

                            if (arrfileGral.length > 0) {
                                for (var c1 = 0; c1 < arrfileGral.length; c1++) {
                                    if (arrfileGral[c1].includes(".") == true) {

                                        var pathFilesEV = pathVer_ot + "/" + numVIN + "/" + arrfileGral[c1];

                                        // borrar
                                        //   var pathFilesEV = "http://186.71.68.154:8089/concesionario/entrega_vehiculos/1_3KPA241AAJE072224/20180503_130832.jpg";

                                        //    alert(pathFilesEV);


                                        if (arrfileGral[c1].includes(".jpg") == true) {
                                            mailFileEVN += "<p><img src='" + pathFilesEV + "' width='" + vidAncho + "' /></p><br />";
                                        }

                                        if (c1 == 0) {
                                            htmlVideoEV += "<table><tr><td><p>" +
                                             "<select id='select_file' onchange='playVideoVIN(this.value);' class='w3-input w3-border textos'>" +
                                             "<option value='0'>- Seleccione el Archivo -</option>";
                                        }

                                        htmlVideoEV += "<option value='" + pathFilesEV + "'>" + arrfileGral[c1] + "</option>";

                                        if (c1 == arrfileGral.length - 1) {
                                            htmlVideoEV += "</select> </p></td></tr></table><br />";
                                        }
                                    }
                                }

                                document.getElementById("otadjuntosEV").value = mailFileEVN;

                            }
                            else {
                                htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                            }
                        }
                        else {
                            htmlVideoEV = "<br/><p><b>No tiene archivos registrados</b></p><br />";
                        }
                        document.getElementById("listaVideo_ev").innerHTML = htmlVideoEV;

                        kendo.ui.progress($("#nuevovehScreen"), false);
                    }
                });
            }

            //  kendo.ui.progress($("#nuevovehScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (eFile) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eFile);
    }
}


function playVideoVIN(idVideo) {

    if (idVideo == "0") {
        document.getElementById("playVideo_ev").innerHTML = "";
    }
    else {
        document.getElementById("fileOT_ev").value = "OK";
        var vidPorcentaje = 80;
        //var vidAlto = (screen.width * 50) / 100;
        //var vidAncho = (screen.width * 80) / 100;

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

        var h = $(window).height();
        var w = $(window).width();

        var vidAlto = (h * 50) / 100;
        var vidAncho = (w * 80) / 100;

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

        //  var playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + document.getElementById('numOT_2').value + "/" + idVideo;
        var playIdVideo = idVideo;

        if (idVideo.includes("mp4") || idVideo.includes("MP4")) {
            //var arrVd = idVideo.split("_");
            //playIdVideo = "http://ecuainfo78-002-site3.btempurl.com/repositorio/" + arrVd[3] + "/" + idVideo;
            document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><video width='" + vidAncho + "' height='" + vidAlto +
                "' controls Autoplay=autoplay><source src='" + playIdVideo + "' type='video/mp4'></video></p></center><br />";
        }
        else if (idVideo.includes("jpg") || idVideo.includes("JPG")) {
            document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><img src='" + playIdVideo + "' width='" + vidAncho + "' /></p></center><br />";
        }
        else {
            document.getElementById("playVideo_ev").innerHTML = "<center><p><br /><audio controls autoplay><source src='" + playIdVideo + "' type='audio/mpeg'>La aplicacion no soporta este formato</audio></p></center><br />";
        }
    }


}

function parametrosEntrega() {
    try {

        var accResp = "";

        //http://192.168.1.50:8089/concesionario/Services/TG/Parametros.svc/ParametroEmpGet/9,;TG;APP_ENTREGAS;;PATH_ENTREGAS

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/9,;TG;APP_ENTREGAS;;PATH_ENTREGAS";

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> Url</center>", Url);

        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {

                    //    alert(inspeccionar(data));
                    var mensaje = inspeccionar(data).replace("string ParametroEmpGetResult :", "");
                    var arrPath = mensaje.split(',');

                    //   accResp = JSON.parse(data.ParametroEmpGetResult);

                    accResp = arrPath[0].trim();

                    //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", arrPath[0]);

                }
                catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(e));
                    //borraCamposlogin();
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                return;
            }
        });
        return accResp;
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return;
    }
}

function parametrosEntregaCompleto() {
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


function enviaMailEV() {
    var contMailOT = "<table cellspacing='10' align='center' width='100%'>" +
  "<tr><td style='height:40px'><p><label class='w3-text-red'><b>Email</b></label><input class='w3-input w3-border textos' id='mail_1' name='mail_1' type='text' value='" + document.getElementById('email_ev').value + "'></p></td></tr>" +
  "<tr><td style='height:40px'><p><label class='w3-text-red'><b>CC</b></label><input class='w3-input w3-border textos' id='mail_2' name='mail_2' type='text' value=''></p></td></tr>" +
  "</p></td></tr>" +
  "</table>";

    var dialogMailEV_1 = $("#dialogMailEV").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: "<center><i class=\"fa fa-envelope-o\"></i> ENTREGA DE VEH&Iacute;CULO</center>",
        closable: false,
        modal: false,
        content: contMailOT,
        actions: [
            { text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ENVIAR&nbsp;&nbsp;</button></font>', action: accionEnviaCorreoEV },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
    });
    dialogMailEV_1.data("kendoDialog").open();
}


function accionEnviaCorreoEV(e) { //cuerpo, observaciones, adjuntos) {

    //var tipomail = document.getElementById("tipomail").value;

    //  formatoImpEV(true);


    //var mailOT = document.getElementById("numOT_2").value;
    var emisor = localStorage.getItem("ls_usumail").toLocaleString();
    var receptor = document.getElementById("mail_1").value;
    var receptor_2 = ""; // localStorage.getItem("ls_usumail").toLocaleString();
    var cuerpo = "";
    var observaciones = "";

    var asunto = "ENTREGA VEHICULO"; // + mailOT;
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/mv/Moviles.svc/EnvioMailSet";
    var adjuntos = ""; // "C:\SZECU00920.b2d.ford.com.p7b";



    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> accionEnviaCorreo</center>", Url);


    if (receptor.trim() == "") {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese la Direcci&oacute;n de Correo correctamente");
        return;
    }
    else {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(receptor) == false) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese la Direcci&oacute;n de Correo correctamente");
            return;
        }

        if (receptor_2.trim() != "" && re.test(receptor_2) == false) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese la Direcci&oacute;n de Correo Copia correctamente");
            return;
        }

        //    if (receptor != receptor_2) {
        //        receptor = receptor + "," + receptor_2;
        //    }

        //    var arrTelUsu = localStorage.getItem("ls_usutelf").toLocaleString().split(".");


        //    if (tipomail == "D") {

        //        var observaciones = document.getElementById("obsdiagnostico").value;

        //        // Agrega los saltos de linea
        //        observaciones = observaciones.replace(/\r?\n/g, "<br>");

        //        cuerpo = "Estimado(a) " + document.getElementById("nombre_propietario").value + " :<br/>" +
        //        "En la Orden de Trabajo No. <b>" + document.getElementById("numOT_2").value + "</b>,  se requiere de su aprobaci&#243;n para proceder con:<br/>" +
        //        observaciones;
        //    }
        //    else {
        //        var arrfhRecepcion = document.getElementById('fecha_hora_recepcion').value.split(/\b(\s)/);

        //        var arrNomAgMail = localStorage.getItem("ls_usagencianom").toLocaleString().split("(");

        cuerpo = "Estimado(a) " + document.getElementById("persona_nom1_ev").value + " :<br/>";
        //"Su veh&#237;culo ha sido recibido con la Orden de Trabajo No. <b>" + document.getElementById("numOT_2").value + "</b>, en la Agencia " + arrNomAgMail[0] +
        //" hoy d&#237;a " + arrfhRecepcion[0] + " a las " + arrfhRecepcion[2] + " horas.";

        //        if (document.getElementById("chkArchivos").checked == true) {
        //            cuerpo += "<br/>Adjunto encontrar&#225; los links donde puede visualizar los videos o fotos capturados en la recepci&#243;n de su veh&#237;culo:<br/>" + localStorage.getItem("ls_mailFileOT").toLocaleString();
        //        }

        //        if (document.getElementById("chkPrefactura").checked == true) {
        //            cuerpo += formatoRepOT(mailOT);
        //        }
        //    }

        //cuerpo += "<br/><br/>Saludos cordiales,<br/>" +
        //localStorage.getItem("ls_usunom").toLocaleString() + "<br/>";
        //  "0" + arrTelUsu[0];

        //  cuerpo += localStorage.getItem("ls_htmlReporte").toLocaleString();

        cuerpo = formatoMailEV(false);

        emisor = "raul.rodriguez@inpsercom.com";
        receptor = "raul.rodriguez@inpsercom.com";



        var params = {
            "imodo": 5,
            "cllave": "",
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

        //  window.myalert("<center><i class=\"fa fa-paper-plane\"></i> ENVIADO</center>", cuerpo);

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

                    var respMail = JSON.stringify(data);
                    if (respMail.includes("Enviado")) {
                        window.myalert("<center><i class=\"fa fa-paper-plane\"></i> ENVIADO</center>", "El mensaje fue enviado correctamente");
                    }
                    else {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");

                        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", respMail);
                        return;
                    }
                } catch (e) {



                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");

                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (err) {


                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido enviar el mensaje<br/>Ha ocurrido un error en el servicio de correo</center>");

                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>3 ERROR</center>", JSON.stringify(err));
                return;
            }
        });
    }
}


function formatoMailEV(bolVisEV) {

    try {

        var htmlFormatoEV = "";

        //kendo.ui.progress($("#nuevovehScreen"), true);
        //setTimeout(function () {
        // precarga *********************************************************************************************

        var dpentFecIni_2 = document.getElementById("dpentFecIni").value;
        var dpentFecFin_2 = document.getElementById("dpentFecFin").value;
        var entFacFis_2 = document.getElementById("entFacFis").value;
        var entIdCli_2 = document.getElementById("identifica_ev").value;
        var entVin_2 = document.getElementById("ev_vin").value;

        // rrppp
        var intEntregado = "1";
        //if (document.getElementById("rbEntregado_2").checked == true) {
        //    intEntregado = "1";
        //}

        var UrlEntregasVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/1,json" + ";" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        "0" + ";" +
        entFacFis_2 + ";" +
        "0" + ";" +
        entVin_2 + ";" +
        entIdCli_2 + ";" +
        "" + ";" +
        "FACTURADO" + ";" +
        localStorage.getItem("ls_usulog").toLocaleString() + ";" +
        dpentFecIni_2 + ";" +
        dpentFecFin_2 + ";" +
        intEntregado;

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlEntregasVIN</center>", UrlEntregasVIN);

        var infEntregasVIN;
        $.ajax({
            url: UrlEntregasVIN,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    // alert(inspeccionar(data));

                    if (inspeccionar(data).includes("tvh03") == true) {
                        infEntregasVIN = (JSON.parse(data.vh03FacturasGetResult)).tvh03;
                    }
                } catch (e) {
                    kendo.ui.progress($("#nuevovehScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    return;
                }
            },
            error: function (eEntrega) {
                // errorConexEV = true;
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
                return;
            }
        });

        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infEntregasVIN[0]));
        //return;

        var html_ev_01 = "";
        var html_ev_02 = "";
        var html_ev_03 = "";
        var html_ev_04 = "";

        //  ============================================================================================================================
        //  FECHA DE ENTREGA
        //  ============================================================================================================================
        var ev_yyyy = infEntregasVIN[0].fecha_entrega;
        var ev_hhmm = infEntregasVIN[0].hora_entrega;
        //    }
        //}

        if (ev_yyyy.includes("-") == false || ev_hhmm.includes(":") == false) {
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
            ev_yyyy = yyyy + "-" + mm + "-" + dd;
            ev_hhmm = hhmm;
        }

        var arrFecEV = ev_yyyy.split('-');
        var arrHoEv = ev_hhmm.split(':');

        var mesesEV = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

        var diasSemanaEV = new Array("Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado");

        var fecEV = new Date(arrFecEV[0], parseInt(arrFecEV[1]) - 1, arrFecEV[2]);



        // arrFecEV[2] + " de " +  meses[parseInt(arrFecEV[1])] + " de "+arrFecEV[0];


        //  ============================================================================================================================
        //  DATOS VEHICULO
        //  ============================================================================================================================
        html_ev_01 = "<table cellpadding='0' cellspacing='0' border='0'>" +
        "<tr>" +
        "<td width='20%'><p><label style='font-family:Arial; font-size:11px'>En la ciudad de: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].ciudad + "</p></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>Fecha: </p></label></td>" +
        "<td>" +
        "<table cellpadding='0' cellspacing='0' border='0'>" +
        "<tr>" +

        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + diasSemanaEV[fecEV.getDay()] + ", " + arrFecEV[2] + " de " + mesesEV[parseInt(arrFecEV[1]) - 1] + " de " + arrFecEV[0] + "</p></label></td>" +

        //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[0] + "</p></label></td>" +
        //"<td>&nbsp;</td>     " +
        //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[1] + "</p></label></td>" +
        //"<td>&nbsp;</td>     " +
        //"<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[2] + "</p></label></td>" +


        "<td></td>  " +
        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>&nbsp;&nbsp;Hora: </p></td> " +
        "<td>&nbsp;&nbsp;&nbsp;</td>     " +
        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + arrHoEv[0] + ":" + arrHoEv[1] + "</p></label></td>" +
        "</tr>" +
        "</table>   " +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td colspan='2'><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>Se realiza la entrega a entera satisfacci&#243;n de un veh&#237;culo nuevo marca KIA con las siguientes caracter&#237;sticas:</p>" +
        "</td>" +
        "</tr>" +
        "<tr> " +
        "<td><p><label style='font-family:Arial; font-size:11px'>MODELO: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].nombre_modelo + "</p></label></td>" +
        "</tr>" +
        "<tr> " +
        "<td><p><label style='font-family:Arial; font-size:11px'>A&#209;O MODELO:</p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].anio_modelo + "</p></label></td>" +
        "</tr>" +
        "<tr> " +
        "<td><p><label style='font-family:Arial; font-size:11px'>VIN: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].chasis + "</p></l/td>" +
        "</tr>" +
        "<tr> " +
        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>PLACA: </p></label></td>" +
        "<td><p style='padding-bottom:10px'><label style='font-family:Arial; font-size:11px'>" + infEntregasVIN[0].placa + "</p></label></td>" +
        "</tr>" +
        "</table>";


        //  ============================================================================================================================
        //  CLIENTE
        //  ============================================================================================================================
        html_ev_04 = "<br/>" +
            "<table width='100%' cellpadding='0' cellspacing='0' border='0'>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Apellidos / Nombres / Raz&#243;n Social: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("persona_nom1_ev").value + "</p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>ID: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("identifica_ev").value + "</p></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>N&#250;mero Factura: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("num_factura_ev").value + "</p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Fecha de la Factura: </p></label></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("fecha_factura_ev").value + "</p></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Direcci&#243;n: </p></label></td>" +
        "<td colspan='3'><p><label style='font-family:Arial; font-size:11px'>" +
        document.getElementById("persona_direc_ev").value + " " +
        document.getElementById("numero_calle_ev").value + " " +
        document.getElementById("calle_interseccion_ev").value + "</p></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Celular: </p></label></td>" +
        "<td colspan='3'><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById("celular_ev").value + "</p></label></td>" +
        "</tr>" +
        "</table>";

        //  ============================================================================================================================
        //  RECIBE
        //  ============================================================================================================================
        var ev_identifica_cliente = infEntregasVIN[0].identifica_recibe_vh;
        var ev_nombres = infEntregasVIN[0].nombre_recibe_vehiculo.replace(/,/g, " "); //.replace(",", "&nbsp;");
        var identifica_entrega = infEntregasVIN[0].identifica_entrega;

        var telEntrega = "";
        if (document.getElementById("ev_telefono_cliente").value.trim() != "" && document.getElementById("ev_celular_cliente").value.trim() != "") {
            telEntrega = document.getElementById("ev_telefono_cliente").value + " / " + document.getElementById("ev_celular_cliente").value;
        }
        else {
            if (document.getElementById("ev_telefono_cliente").value.trim() == "") {
                telEntrega = document.getElementById("ev_celular_cliente").value;
            }
            else if (document.getElementById("ev_celular_cliente").value.trim() == "") {
                telEntrega = document.getElementById("ev_telefono_cliente").value;
            }
        }

        //  ============================================================================================================================
        //  IMEI
        //  ============================================================================================================================
        var dispositivo_satelital_imp = infEntregasVIN[0].dispositivo_satelital;
        var numero_satelital = "";

        if (dispositivo_satelital_imp == true) {
            dispositivo_satelital_imp = "SI";

            if (infEntregasVIN[0].numero_satelital.trim() != "") {
                numero_satelital = " (No. IMEI: " + infEntregasVIN[0].numero_satelital + ")";
            }
        }
        else {
            dispositivo_satelital_imp = "NO";
        }

        html_ev_02 = "<table width='100%' border='0'  cellpadding='2' cellspacing='0' >" +
        "<tr><td style='width: 80%'><p><label style='font-family:Arial; font-size:11px'> Dispone de Dispositivo Satelital ? " + numero_satelital +
        "</label></p></td><td style='width: 1%;'></td><td style='width: 19%;'><p><label style='font-family:Arial; font-size:11px'>" + dispositivo_satelital_imp + "</label></p></td></tr>" +
        "</table>";

        //  ============================================================================================================================
        //  OBSERVACIONES
        //  ============================================================================================================================
        var obsEV = infEntregasVIN[0].observacion_entrega;

        if (obsEV.trim() == "") {
            obsEV = "<hr style='color:#000000; border:solid 1px'/>";
        }
        else {
            obsEV = obsEV.replace(/\r?\n/g, "<br>");
        }

        var tablaPreguntasImp = ConsultarMEUSA_IMP_2(ktedsEV); // ConsultarMEUSA_IMP(ktedsEV);

        //  ============================================================================================================================
        //  FORMATO GENERAL
        //  ============================================================================================================================
        var ima = localStorage.getItem("ls_url2").toLocaleString() + "/formato_mail/logofirma.jpg";
        htmlFormatoEV = "<table width='100%' cellpadding='2' cellspacing='0'>" +
        "<tr>" +
        "<td>" +
        "<table width='100%' cellpadding='0' cellspacing='0'>" +
        "<tr>" +
        "<td>" + "<img src='" + ima + "' alt='FLC' width='115' height='70'>" /* imgLogoEV() */ + "</td>" +
        "<td style='text-align:center'>" +
        "<h2><label style='color:#000000'>FORMULARIO PARA ENTREGA DE VEH&#205;CULOS NUEVOS</label></h2>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<hr style='color:#000000;border:2px solid' />" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + html_ev_01 + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td style='background-color:#000000'>" +
        "<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'>CLIENTE</label></p>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" + html_ev_04 + "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        tablaPreguntasImp +
        html_ev_02 +
        "</td>" +
        "</tr>" +

        "<tr>" +
        "<td>&nbsp;</td>" +
        "</tr>" +


        "<tr>" +
        "<td style='background-color:#000000'>" +
        "<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'>COMENTARIOS, RECOMENDACIONES U OBSERVACIONES DEL CLIENTE</label></p>" +
        "</td>" +
        "</tr>" +

                    "<tr>" +
        "<td>&nbsp;" +
        "</td>" +
        "</tr>" +


        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>" + obsEV + "</label></p></td>" +
        "</tr>" +

        "<tr>" +
        "<td>&nbsp;" +
        "</td>" +
        "</tr>" +

        "<tr>" +
        "<td>" +
        "<table width='100%' cellpadding='3' cellspacing='0' border='0' style='border-color:#000000'>" +
        "<tr>" +
        "<td width='50%' style='background-color:#000000'>" +
        "<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'> ENTREGA:</label></p>" +
        "</td>" +
        "<td style='background-color:#000000'>" +
        "<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'> RECIBE:</label></p>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>" +
        "<table width='100%' cellpadding='3' cellspacing='0'>" +
        "<tr>" +
        "<td width='50%'><br/><br/><br/></td>" +
        "<td><br/><br/><br/></td>" +
        "</tr>" +
        "<tr>" +
        "<td width='50%'><p><label style='font-family:Arial; font-size:11px'>Firma: _______________________________</label></p></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Firma: _______________________________</label></p></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + localStorage.getItem("ls_usunom").toLocaleString() + "</label></p></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + ev_nombres + "</label></p></td>" +
        "</tr>" +
        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>ID: " + identifica_entrega + "</label></p></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>ID: " + ev_identifica_cliente + "</label></p></td>" +
        "</tr>" +

        "<tr>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>&nbsp;</label></p></td>" +
        "<td><p><label style='font-family:Arial; font-size:11px'>Tel&#233;fonos: " + telEntrega + "</label></p></td>" +
        "</tr>" +

        "</table>" +
        "</td>" +
        "</tr>" +
        "</table>";




        kendo.ui.progress($("#nuevovehScreen"), false);

        return htmlFormatoEV;


        //    // precarga *********************************************************************************************
        //}, 2000);


    }
    catch (eimpev) {
        kendo.ui.progress($("#nuevovehScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eimpev);
        return "";
    }
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><

function onChange_02() {
    agendaEntrega_2(document.getElementById("2datepickerE1").value);
}

// ENTREGA VEH
function cargaInfoAgendaEntrega_2() {

    document.getElementById("2datepickerE1").value = fechaActual();

    $("#2datepickerE1").kendoDatePicker({
        format: "dd-MM-yyyy",
        change: onChange_02,
        culture: "es-ES"
    });


    usuariosEntrega_2();

    if (validaProceAgendaEV == true) {

        agendaEntrega_2(document.getElementById("2datepickerE1").value);

        document.getElementById("formEntrega").style.display = "none";
        document.getElementById("tablaEntVeh").style.display = "none";

        document.getElementById("2tablaUsuEntE1").style.display = "initial";
        document.getElementById("2agendaEntregaE1").style.display = "initial";


        var colorEstado01 = "";
        var arrEstado01 = ["&nbsp;&nbsp;Abierto&nbsp;&nbsp;", "Procesado", "&nbsp;&nbsp;<i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#000000'></i>&nbsp;VIP&nbsp;&nbsp;&nbsp;"];
        var arrColor01 = ["#DFCEFF", "#ffcc00", "#ffffff"];
        var tamLetra01 = "font-size:11px;";
        for (var j = 0; j < arrEstado01.length; j++) {
            colorEstado01 = colorEstado01.concat("<label style='background-color: " + arrColor01[j] + "; padding:5px; border:solid 1px;" + tamLetra01 + "'>" + arrEstado01[j] + "</label>");
        }

        document.getElementById("divColor01").innerHTML = colorEstado01;

    }
    else {
        document.getElementById("formEntrega").style.display = "none";
        document.getElementById("tablaEntVeh").style.display = "none";
        document.getElementById("2tablaUsuEntE1").style.display = "none";
        document.getElementById("2agendaEntregaE1").style.display = "none";
    }

}

// ENTREGA VEH
function usuariosEntrega_2() {
    // http://186.71.21.170:8077/taller/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3,1;;01;01

    //var UrlUsu = localStorage.getItem("ls_url2").toLocaleString() + "/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3," +
    //    localStorage.getItem("ls_idempresa").toLocaleString() + ";;" + localStorage.getItem("ls_ussucursal").toLocaleString() +
    //    ";" + localStorage.getItem("ls_usagencia").toLocaleString();


    var UrlUsu = localStorage.getItem("ls_url2").toLocaleString() + "/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3," +
localStorage.getItem("ls_idempresa").toLocaleString() + ";;" + localStorage.getItem("ls_ussucursal").toLocaleString() +
";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";ASESORES_ENT";


 // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlUsu);

    var ageMsjusuariosAgenciaEV = "";
    var cboUsu;

    $.ajax({
        url: UrlUsu,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {

                if (data.Combotg23ProfesionalesGetResult.includes("ASESORES_ENT") == true) {
                    validaProceAgendaEV = false;
                    ageMsjusuariosAgenciaEV = data.Combotg23ProfesionalesGetResult.replace("0,", "");
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>" + ageMsjusuariosAgenciaEV + "</center>");
                    return;
                }
                else {
                    validaProceAgendaEV = true;
                    cboUsu = JSON.parse(data.Combotg23ProfesionalesGetResult);
                }

             //   cboUsu = JSON.parse(data.Combotg23ProfesionalesGetResult);
            } catch (e) {
                kendo.ui.progress($("#agenciaScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agenciaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
            return;
        }
    });

    if (ageMsjusuariosAgenciaEV == "") {

        if (cboUsu.length > 0) {
            var cboUsuHTML = "<select id='2cboUsuarioEntregaE1' class='w3-input w3-border' onchange='agendaEntrega_2(document.getElementById(\"2datepickerE1\").value);'>";

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

            document.getElementById("2divListaUsuEntregaE1").innerHTML = cboUsuHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Usuarios");
        }
    }
}

//entrega veh
function getEvents_2(rangoAg, usuLogin) {

    var arrAgenda = [];

    // "06-20-2018"  ok

    var diasSemana = 7;


    var arrRango = rangoAg.split('-');

    rangoAg = arrRango[1] + "-" + arrRango[0] + "-" + arrRango[2];

    var date = moment(rangoAg);
    date.isoWeekday(diasSemana - 6);
    var sIni = date.format('DD-MM-YY');
    date.isoWeekday(diasSemana);
    var sFin = date.format('DD-MM-YY');

    //date.isoWeekday(diasSemana - 1);
    //var sFin = date.format('DD-MM-YY');



    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", sIni + "   " + sFin);


    // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl33CitasGet/1,json;1;01;01;jmera;;03-10-17;03-10-17;

    // Asigna el usuario seleccionado como usuario principal temporalmente
    localStorage.setItem("ls_usulog", usuLogin);

    //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
    //  localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    //  localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    //  localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    //  localStorage.getItem("ls_usulog").toLocaleString() + ";;" +
    //  sIni + ";" + sFin + ";";

    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
  localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
  localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
  localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
  localStorage.getItem("ls_usulog").toLocaleString() + ";;" +
  sIni + ";" + sFin + ";" +
  "ENTREGA_NUEVOS;;;";


  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ENTREGA_NUEVOS</center>", Url);


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
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No tiene Citas Registradas");
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

                        //------------------------

                        var tamLetra = "10";
                        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
                            nombreModelo = nombreModelo.slice(0, 9) + "...";
                            nombreCliente = nombreCliente.slice(0, 18) + "...";
                            tamLetra = "9";
                        }


                        // solo presenta 30 caracteres
                    //    nombreModelo = nombreModelo.substring(0, 30);


                        //// VIP BANDERA
                        //if (infor[i].persona_clase.trim() != "") {
                        //    agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "</div>";
                        //    agContenido = "<i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i> " + agContenido;
                        //}
                        //else {
                        //    agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "<br />" + nombre_cliente + "</div>";
                        //}



                        agContenido = "<div style='font-size: 9px'>" + "<b>" + nombreChasis + "</b>" + "</div>" + "<div style='font-size: 10px'>" + nombreModelo + "<br />" + nombre_cliente + "</div>";

                        // VIP BANDERA
                        if (infor[i].persona_clase.trim() != "") {
                            agContenido = "<i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i> " + agContenido;
                        }

                      

                        // Reemplaza todas las "," por " "
                        agContenido = agContenido.replace(/,/g, "&nbsp;");

                        var llaveForm = "|" + infor[i].anio_vh26 + "-" +
                        infor[i].numero_factura_vh26 + "-" +
                        infor[i].secuencia_detalle_vh03 + "-" +
                        infor[i].chasis + "-" +
                        infor[i].identifica_cliente;


                        arrAgenda.push(
                        {
                            id: infor[i].chasis + " " + citaStart + " " + infor[i].estado + llaveForm,
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


function agendaEntrega_2(fechaBusqueda) {
    
    var objEntrega;

    document.getElementById("2agendaEntregaE1").innerHTML = "";

    var tamLetra = "9";


    arrAgendaGrl = getEvents_2(document.getElementById("2datepickerE1").value, document.getElementById("2cboUsuarioEntregaE1").value);


    document.getElementById("2agendaEntregaE1").innerHTML = "<div class='mycalEnt_2'></div>";

    if (arrAgendaGrl.length > 0) {

        $('.mycalEnt_2').easycal({
            startDate: fechaBusqueda, //dd + "-" + mm + "-" + yyyy, // "01-04-2018", // dd-mm-yyyy
            timeFormat: 'HH:mm',
            columnDateFormat: 'dddd, DD MMM',
            minTime: '07:00:00',
            maxTime: '18:15:00',
            slotDuration: 30,
            timeGranularity: 30,
            dayClick: function (el, startTime) {
                //confirmaCita2("<center><i class=\"fa fa-calendar-plus-o\"></i> CITA</center>",
                //    "<b>Cliente:</b> " + nombre_cliente.slice(0, 25) + "<br/>" + "<b>Telf.</b> " + objEntrega.persona_telefono_movil + "<br/>" +
                //    "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime, objEntrega);
            },
            eventClick: function (eventId) {

               //  alert(eventId);
                //  objetoVH03(eventId);
                
                /*
                 var arr_Ag1 = eventId.split("|");

                 var arrEstado = arr_Ag1[0].split(/\b(\s)/);

                 if (arrEstado[6] == "ABIERTO") {
                     var arr_Inf1 = arr_Ag1[1].split("-");
                     kendo.confirm("<center><h1><i class=\"fa fa-taxi\"></i> ENTREGA</h1><br />Desea realizar la entrega del veh&#237;culo<br />Chasis: <b>" + arr_Inf1[3] + " </b></center>")
                     .done(function () {
                         objetoVH03(eventId);
                     })
                     .fail(function () {
                         // NADA               
                     });
                 }
                 else {
                     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se puede realizar la entrega<br />Cita en Estado:<b>" + arrEstado[6] + "</b></center>");
                 }

                 */
                var arr_Ag1 = eventId.split("|");
                var arr_Inf1 = arr_Ag1[1].split("-");
                kendo.confirm("<center><h1><i class=\"fa fa-taxi\"></i> ENTREGA</h1><br />Desea realizar la entrega del veh&#237;culo<br />Chasis: <b>" + arr_Inf1[3] + " </b></center>")
                .done(function () {
                    objetoVH03(eventId);
                })
                .fail(function () {
                    // NADA               
                });
                llamarColorBotonGeneral(".k-primary");
            },
            events: arrAgendaGrl,
            //overlapColor: '#FF0',
            //overlapTextColor: '#000',
            overlapTitle: 'Multiple'
        });
    }
    else {
        $('.mycalEnt_2').easycal({
            startDate: fechaBusqueda, //dd + "-" + mm + "-" + yyyy, // "01-04-2018", // dd-mm-yyyy
            timeFormat: 'HH:mm',
            columnDateFormat: 'dddd, DD MMM',
            minTime: '07:00:00',
            maxTime: '18:15:00',
            slotDuration: 30,
            timeGranularity: 30,
            dayClick: function (el, startTime) {
                //confirmaCita2("<center><i class=\"fa fa-calendar-plus-o\"></i> CITA</center>",
                //    "<b>Cliente:</b> " + nombre_cliente.slice(0, 25) + "<br/>" + "<b>Telf.</b> " + objEntrega.persona_telefono_movil + "<br/>" +
                //    "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime, objEntrega);
            },
            eventClick: function (eventId) {

                //  alert(eventId);
                // verCita(eventId);
            },
            events: [],
            overlapColor: '#FF0',
            overlapTextColor: '#000',
            overlapTitle: 'Multiple'
        });

    }

    //   alert("fin");

}



function objetoVH03(idCelda) {
    var arr_Ag = idCelda.split("|");
    var arr_Inf = arr_Ag[1].split("-");

    var UrlEntregasVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03FacturasGet/4,json" + ";" +
   localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
   localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
   localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
   arr_Inf[0] + ";" +
   arr_Inf[1] + ";" +
   arr_Inf[2] + ";" +
   arr_Inf[3] + ";" +
   arr_Inf[4] + ";" +
   "" + ";" +
   "FACTURADO" + ";" +
   localStorage.getItem("ls_usulog").toLocaleString() + ";" +
   "" + ";" +
   "" + ";" +
   "0";

   //myalert("<center><i class=\"fa fa-calendar-check-o\"></i>er</center>", UrlEntregasVIN);

    var infEntregasVIN;
    $.ajax({
        url: UrlEntregasVIN,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                //  alert(inspeccionar(data.vh03FacturasGetResult).length);

                if (inspeccionar(data.vh03FacturasGetResult).length > 0) {
                    if (inspeccionar(data).includes("tvh03") == true) {
                        infEntregasVIN = (JSON.parse(data.vh03FacturasGetResult)).tvh03;
                        document.getElementById("2agendaEntregaE1").innerHTML = "";
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infEntregasVIN[0]));
                        verForm(infEntregasVIN[0], false);
                    }
                }
                else {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No existen registros para la entrega <br/>del VIN: <b>" + arr_Inf[3] + "</b></center>");
                }

            } catch (e) {
                kendo.ui.progress($("#nuevovehScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                return;
            }
        },
        error: function (eEntrega) {
            // errorConexEV = true;
            kendo.ui.progress($("#nuevovehScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Entrega de Veh&#237;culos</center>");
            return;
        }
    });



    //  return infEntregasVIN;


}
