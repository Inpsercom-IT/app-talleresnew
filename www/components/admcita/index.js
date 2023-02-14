/*=======================================================================
Fecha: 24/11/2017
=======================================================================
Detalles: 
- Creacion y Modificacion de Citas
- Busqueda de VIN, Placa o CI Cliente
- Persona VIP
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

// --------------------------------------------------------------------------
// Valores por default
// --------------------------------------------------------------------------
var resp = "Error";
var validaServicios = 1;
var arrEstCita = ["ABIERTO", "CONFIRMADO", "CANCELADO", "PROCESADO"];
var recurrCitaCliente = 0;
var fhCitaReg = "0";

// --------------------------------------------------------------------------

app.admcita = kendo.observable({
    onShow: function () {
         
        llamarColorTexto(".w3-text-red");
        llamarNuevoestilo("cita_btnBusquedas");
        llamarNuevoestilo("liVehiculo");
      //  alert(localStorage.getItem("ls_usulog_verif").toLocaleString());


        //---------------------
        document.getElementById("cita_op1").checked = true;
        document.getElementById("cita_op2").checked = false;
        document.getElementById("cita_trID").style.display = 'initial';
        // ------------------

        resetCita();

        if (localStorage.getItem("ls_agendaplaca") != undefined) {//    localStorage.getItem("ls_agendaplaca").toLocaleString().trim() != "") {
            document.getElementById('cita_infoPlacasVIN').value = localStorage.getItem("ls_agendaplaca").toLocaleString().trim();

            if (document.getElementById('cita_infoPlacasVIN').value != "n/e") {
                citaPlacaVIN(document.getElementById('cita_infoPlacasVIN').value);
            }
            else {
                verTipoCita2("CLI");
                TraerInfoCita("", "");
            }
        }
    },
    afterShow: function () {
    }
});
app.localization.registerView('admcita');

// START_CUSTOM_CODE_admcita
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes




function arregloHora(limithora) {
    // new Date(1970, 0, 1, 9,15),
    var fechaHoy = fechaActual().split("-");

    var arrTime = [];

    for (var i = 7; i <= limithora; i++) {
        var min = 0;
        for (var j = 0; j < 4; j++) {
            var ffhh = new Date(fechaHoy[2], fechaHoy[1], fechaHoy[0], i, min);
            arrTime.push(ffhh);
            min = min + 15;
        }
    }
    return arrTime;
}

function resetCita() {

    document.getElementById("divcboCitaNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";
    document.getElementById("gridVinAg").style.display = "none";

    fhCitaReg = "0";

    // datetimepicker
    document.getElementById("cita_divCnt").innerHTML = "<table align='center' cellpadding='0' cellspacing='0'><tr height='40'><td><b>Fecha y Hora&nbsp;</b></td><td><input id='dtpCitas2' style='max-width:210px'/></td></tr></table>  ";
    $("#dtpCitas2").kendoDateTimePicker({
        value: new Date(localStorage.getItem("ls_citafechahora").toLocaleString().trim()),
        timeFormat: "HH:mm",
        format: "dd-MM-yyyy HH:mm",
        dateInput: true,

        open: function (e) {
            if (e.view === "time") {
                e.sender.timeView.dataBind(arregloHora(18))
            }
        }
    });

    // tab
    $("#tabstripCitas").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
    document.getElementById("liVehiculo").removeAttribute("style")
    document.getElementById("liCliente").removeAttribute("style")
    document.getElementById('cita_infoPlacasVIN').value = "";
    document.getElementById("cita_nombre_propietario").value = "";
    document.getElementById("cita_chasis").value = "";
    document.getElementById("cita_placa").value = "";
    document.getElementById("cita_persona_nombre").value = "";
    document.getElementById("cita_persona_nombre2").value = "";
    document.getElementById("cita_persona_apellido").value = "";
    document.getElementById("cita_persona_apellido2").value = "";
    document.getElementById("cita_codigo_marca").value = "";
    document.getElementById("cita_mi_modelo").value = "";
    document.getElementById("cita_anio_modelo").value = "";
    document.getElementById("cita_nombre_color").value = "";
    document.getElementById("cita_identifica_cliente").value = "";
    document.getElementById("cita_persona_numero").value = "";
    document.getElementById("cita_calle_cliente").value = "";
    document.getElementById("cita_calle_interseccion").value = "";
    document.getElementById("cita_numero_calle").value = "";
    document.getElementById("cita_telefono_cliente").value = "";
    document.getElementById("cita_email_cliente").value = "";

    document.getElementById("cita_reparaciones").value = "";
    document.getElementById("cita_observaciones").value = "";

    document.getElementById("fecha_creacion").value = "";
    document.getElementById("hora_creacion").value = "";
    document.getElementById("usuario_creacion").value = "";

    // cliente VIP
    document.getElementById("vip_cita").innerHTML = "";
    document.getElementById("vip_cita").style.display = "none";
    document.getElementById("txt_vip_cita").value = "";



    // Cbo de tipos de Cita
    cboCitaTipos("CLIENTE");
    // Cbo Estado 
    cboCargaCita("estado_cita", arrEstCita, arrEstCita[0], "cita_divcboestado");

    //// Cbo. Seccion
    //cboCitaSecciones("MECANICA");
    //// Cbo. Tipo Trabajo
    //cboCitaTrabajos(document.getElementById("seccion_orden_trabajo").value, "");
    //// Cbo. Tipo Mantenimiento
    //cboCitaMantenimientos(document.getElementById("tipo_trabajo").value, "");
    // Cbo. Tipo persona
    cboCargaCita("persona_tipo", arrTipPers, arrTipPers[0], "cita_divcbotpers");
    // Cbo. Tipod de documento 
    cboCargaCita("tipo_id_cliente", arDoc, arDoc[0], "cita_divcbotid");
    // Cbo. tipo direccion 
    cboCargaCita("direccion_cliente", arrDir, arrDir[0], "cita_divcbodirec");
    //// Cbo. pais
    //cboCitaPaises("ECUADOR");
    //// Cbo. ciudad
    //cboCitaCiudades(document.getElementById("pais_cliente").value, "");

    document.getElementById("tabstripCitas").style.display = 'none';


   // for (var i = 1; i < 3; i++) {
        //if (document.getElementById("cita_op" + i).checked == true) {
        //    verTipoCita2(document.getElementById("cita_op" + i).value);
        //    break;
        //}
    //}


    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    }
    else {
        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita1' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestiloIconB("icnCita");
    llamarNuevoestilo("btnCita");
}


/*--------------------------------------------------------------------
Fecha: 20/09/2017
Descripcion: Estado de Mantenimiento
Parametros: VIN, Fecha inicio, Fecha fin
--------------------------------------------------------------------*/
function ConsultarEM_cita(emvin) {
    try {
        document.getElementById("cit_divtableEM").innerHTML = "";


        var anchoInput = "4";
        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 360) {
            anchoInput = "7";
        }

        var marca = document.getElementById("cita_codigo_marca").value;

        if (marca.trim() == "") {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "La marca " + marca + " no esta registrada");
            return;
        }

        var erroresEM = 0;

        document.getElementById("cit_tablaPrmEM").style.display = "none";
        //document.getElementById("cit_tableEM").style.display = "none";
        document.getElementById("cit_fecEM").value = "";
        document.getElementById("cit_kmEM").value = "";

        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;

        if (marca.trim() != "KIA") {
            // nuevo servicio
            UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
        }

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlEM);

        var inforEM;
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforEM = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                    // alert(inspeccionar(data));
                } catch (e) {
                    // loading
                    document.getElementById("cit_divLoading").innerHTML = "";
                    // Borrar imagen de placa
                    document.getElementById("cit_smallImage").style.display = "none";
                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos del Estado de Mantenimiento");

                    for (var i = 0; i < 30; i++) {

                        document.getElementById("cit_cl" + inforEM[i].codigo).style.background = "red";
                        document.getElementById("cit_cx" + inforEM[i].codigo + "x").style.display = "";
                        bandera = "rojo";
                    }
                    document.getElementById("cit_fecEM").value = "";
                    document.getElementById("cit_kmEM").value = "";
                    document.getElementById("cit_divtableEM").innerHTML = "";
                    // Si hay error
                    erroresEM = 1;

                    kendo.ui.progress($("#admcitaScreen"), false);
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admcitaScreen"), false);
                // loading
                document.getElementById("cit_divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("cit_smallImage").style.display = "none";
                //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
                return;
            }
        });

        //     alert(inforEM.length);

        if (erroresEM == 0) {
            var bandera = "verde";

            if (inforEM.length > 0) {

                //------------------

                var tableContenedor = "<table id='cit_tableEM' align='center' style='width: 100%;'><tr>";
                tableContenedor += "<td>";

                var tableEM = "<table>";
                var emKM = 5;
                for (var i = 0; i < 35; i++) {
                    tableEM += "<tr><td class='clase'><input type='text' value='" + emKM + ",000' size='" + anchoInput + "' disabled></td>" +
                     "<td>&nbsp;</td>" +
                    "<td><input id='cit_cl" + emKM + "000' type='text' style='width: 20px;' disabled></td>" +
                    "<td>&nbsp;</td>" +
                    "<td><i id='cit_cx" + emKM + "000v' class='fa fa-check' aria-hidden='true' style='color:green; display:none;width: 30%;'></i>" +
                    "<i id='cit_cx" + emKM + "000x' class='fa fa-times' aria-hidden='true' style='color:red; display:none;width: 30%;'></i></td></tr>";
                    emKM = emKM + 5;
                }
                tableEM += " </table>"
                tableContenedor += tableEM;
                tableContenedor += "</td>";
                tableContenedor += "<td>&nbsp;&nbsp;</td>";
                tableContenedor += "<td>";
                tableEM = "<table>";
                emKM = 180;
                for (var i = 0; i < 35; i++) {
                    tableEM += "<tr><td class='clase'><input type='text' value='" + emKM + ",000' size='" + anchoInput + "' disabled></td>" +
                 "<td>&nbsp;</td>" +
                "<td><input id='cit_cl" + emKM + "000' type='text' style='width: 20px;' disabled></td>" +
                "<td>&nbsp;</td>" +
                "<td><i id='cit_cx" + emKM + "000v' class='fa fa-check' aria-hidden='true' style='color:green; display:none;width: 30%;'></i>" +
                "<i id='cit_cx" + emKM + "000x' class='fa fa-times' aria-hidden='true' style='color:red; display:none;width: 30%;'></i></td></tr>";

                    emKM = emKM + 5;
                }
                tableEM += " </table>"

                tableContenedor += tableEM;
                tableContenedor += "</td>";
                tableContenedor += "</tr></table>";

                //for (var i = 0; i < 30; i++) {
                //    document.getElementById("cit_cl" + inforEM[i].codigo).style.background = "transparent";
                //    document.getElementById("cit_cx" + inforEM[i].codigo + "v").style.display = "none";
                //    document.getElementById("cit_cx" + inforEM[i].codigo + "x").style.display = "none";
                //}

                document.getElementById("cit_divtableEM").innerHTML = tableContenedor;
                var tabStrip = $("#tabstripCitas").kendoTabStrip().data("kendoTabStrip");
                tabStrip.enable(tabStrip.tabGroup.children().eq(2), true);

                //-------------------


                for (var i = 0; i < inforEM.length; i++) {

                    if (i < 70) {
                        if (inforEM[i].validacion == true) {
                            document.getElementById("cit_cl" + inforEM[i].codigo).style.background = "green";
                            document.getElementById("cit_cx" + inforEM[i].codigo + "v").style.display = "";
                        }
                        else {
                            document.getElementById("cit_cl" + inforEM[i].codigo).style.background = "red";
                            document.getElementById("cit_cx" + inforEM[i].codigo + "x").style.display = "";
                            bandera = "rojo";
                        }
                    }
                    if (inforEM[i].ultimo == true) {

                        var feckm = inforEM[i].fecha_kilometraje;

                        if (feckm.includes("-") == true) {
                            var arrfeckM = feckm.split("-");
                            if (arrfeckM[0] < 10) {
                                arrfeckM[0] = "0" + arrfeckM[0];
                            }

                            if (arrfeckM[1] < 10) {
                                arrfeckM[1] = "0" + arrfeckM[1];
                            }

                            feckm = arrfeckM[0] + "-" + arrfeckM[1] + "-" + arrfeckM[2];
                        }

                        document.getElementById("cit_fecEM").value = feckm;
                        document.getElementById("cit_kmEM").value = inforEM[i].kilometraje;
                        break;
                    }
                    document.getElementById("cit_tablaPrmEM").style.display = "block";
                }

                //document.getElementById("cit_tableEM").style.display = "block";
            }
        }

    } catch (e) {
        kendo.ui.progress($("#admcitaScreen"), false);
        // loading
        //   document.getElementById("cit_divLoading").innerHTML = "";
        // Borrar imagen de placa
        // document.getElementById("cit_smallImage").style.display = "none";
        //     window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error de conexi&oacute;n al servicio Estado de Mantenimiento. Int\u00E9ntelo nuevamente.");
        return;
    }
}



function verTipoCita2(tipo) {

    resetCita();

    var tabStrip = $("#tabstripCitas").kendoTabStrip().data("kendoTabStrip");

    if (tipo == "VIN") {
        document.getElementById("cita_trID").style.display = 'initial';
        document.getElementById("tabstripCitas").style.display = 'none';

        tabStrip.enable(tabStrip.tabGroup.children().eq(0), true);
        tabStrip.enable(tabStrip.tabGroup.children().eq(2), true);

        tabStrip.select(0);

        document.getElementById("cita_btnGuardaInfo").innerHTML = "";

        //document.getElementById("cita_divCnt").innerHTML = "<table align='center' cellpadding='0' cellspacing='0'><tr height='40'><td>Fecha y Hora&nbsp;</b></td><td><input id='dtpCitas'/></td></tr></table>  ";

        $("#dtpCitas2").kendoDateTimePicker({
            value: new Date(localStorage.getItem("ls_citafechahora").toLocaleString()),
            timeFormat: "HH:mm",
            format: "dd-MM-yyyy HH:mm",
            dateInput: true,
        });


        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
        "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
        }
        else {
            document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
        "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i></button>";
        }
        llamarNuevoestiloIconB("icnCita");
        llamarNuevoestilo("btnCita");

    }
    else {
        tabStrip.enable(tabStrip.tabGroup.children().eq(0), false);
        tabStrip.enable(tabStrip.tabGroup.children().eq(2), false);

        tabStrip.select(1);
        document.getElementById("cita_trID").style.display = 'none';
        document.getElementById("tabstripCitas").style.display = 'block';

        // Cbo. pais
        cboCitaPaises("ECUADOR");
        // Cbo. ciudad
        cboCitaCiudades(document.getElementById("pais_cliente").value, "");

        ////document.getElementById("cita_divCnt").innerHTML = "<table align='center' cellpadding='0' cellspacing='0'><tr height='40'><td><b>Fecha y Hora&nbsp;</b></td><td><input id='dtpCitas'/></td></tr></table>  ";

        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    "<button id='btnCita1' onclick='guardaCita(true);' class='w3-btn'><i id='icnCita1' class='fa fa-floppy-o' aria-hidden='true'></i> GENERAR CITA</button>" +
"<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita2' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";

        }
        else {
            document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button id='btnCita1' onclick='guardaCita(true);' class='w3-btn'><i id='icnCita1' class='fa fa-floppy-o' aria-hidden='true'></i></button>" +
"<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita2' class='fa fa-file' aria-hidden='true'></i></button>";

        }
        llamarNuevoestiloIconB("icnCita");
        llamarNuevoestilo("btnCita");
    }
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Determina el tipo de busqueda sea por VIN, Placa u OT segun el texto ingresado
Parametros: VIN -> C / Placa -> P / OT  -> O
Autor: RRP
--------------------------------------------------------------------*/
function citaPlacaVIN(placaVIN) {
    resetCita();

    if (placaVIN != "") {

        if (placaVIN.includes("*") == true) {
            listaVinAgenda(placaVIN);
        }
        else {
            if (placaVIN.length > 8) {
                TraerInfoCita(placaVIN, "C");
            }
            else {
                TraerInfoCita(placaVIN, "P");
            }
        }
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Determina el tipo de busqueda sea por VIN, Placa u OT segun el texto ingresado
Parametros: VIN -> C / Placa -> P / OT  -> O
Autor: RRP
--------------------------------------------------------------------*/
function citaPlacaVIN_2(placaVIN) {
    resetCita();

    if (placaVIN != "") {

        if (placaVIN.includes("*") == true) {
            listaVinAgenda(placaVIN);
        }
        else {
            if (placaVIN.length > 8) {
                TraerInfoCita_2(placaVIN, "C");
            }
            else {
                TraerInfoCita_2(placaVIN, "P");
            }
        }
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 31/10/2017
Descripcion: Citas - Busqueda por VIN en GRID
Parametros: VIN
--------------------------------------------------------------------*/
function listaVinAgenda(strVinAgenda) {

    kendo.ui.progress($("#admcitaScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************



    try {
        // Grid VIN
        var grid2 = $("#gridVinAg").data("kendoGrid");
        grid2.destroy();
    }
    catch (evin)
    { }

    document.getElementById("gridVinAg").innerHTML = "";
    document.getElementById("gridVinAg").style.display = "none";
    //  resetCita();

    strVinAgenda = strVinAgenda.replace('*', ' ').trim();

    if (strVinAgenda.length < 8) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese m&iacute;nimo 8 caracteres");
        kendo.ui.progress($("#admcitaScreen"), false);
        return;
    }

    var UrlVinAgenda = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVinAgenda + ";";

    if (localStorage.getItem("ls_listavinag_rec") != undefined && localStorage.getItem("ls_listavinag_rec").toLocaleString() == "1") {
        localStorage.setItem("ls_listavinag_rec", "0");
        // http://186.71.21.170:8077/taller/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;9U321366;
        UrlVinAgenda = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVinAgenda + ";";
    }

    var infVinAgendaResp = "";
    var obs = (screen.width * 9) / 100;
    var fecha = (screen.width * 14) / 100;
    var ot = (screen.width * 17) / 100;

    $.ajax({
        url: UrlVinAgenda,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                infVinAgendaResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
            } catch (e) {
                kendo.ui.progress($("#admcitaScreen"), false);
                if (localStorage.getItem("ls_listavinag_rec") != undefined && localStorage.getItem("ls_listavinag_rec").toLocaleString() == "0") {
                    infVinAgendaResp = "";
                    return;
                }
            }
        },
        error: function (err) {
            kendo.ui.progress($("#admcitaScreen"), false);
         //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);

            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el servicio VIN</center>");


            return;
        }
    });


    if (infVinAgendaResp.length > 0) {

        $("#gridVinAg").kendoGrid({
            dataSource: {
                data: infVinAgendaResp,
                pageSize: 5
            },

            // height: 400,
            scrollable: false,
            //pageable: {
            //    input: true,
            //    numeric: false
            //},

            pageable: false,

            columns: [
                {
                    title: "", width: obs,
                    command: [{
                        name: "obs",
                        text: " ",
                        imageClass: "fa fa-search-plus",

                        visible: function (dataItem) { return dataItem.chasis != "0," },
                        click: function (e) {
                            try {
                                e.preventDefault();
                                var tr = $(e.target).closest('tr');
                                var dataItem = this.dataItem(tr);
                                //   window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>CHASIS</font></center>", dataItem.chasis);

                                kendo.ui.progress($("#admcitaScreen"), true);
                                setTimeout(function () {
                                    // precarga ***********************
                                    TraerInfoCita_2(dataItem.chasis, "C");
                                    // precarga ***********************
                                }, 2000);

                            } catch (f) {
                                kendo.ui.progress($("#admcitaScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                return;
                                //alert(f);
                            }
                        }
                    }],
                },

                { field: "chasis", title: "VIN", width: "100px" },
                { field: "nombre_propietario", title: "Propietario" },
                //{ field: "placa", title: "Placa", width: obs}
            ]
        });

        if (localStorage.getItem("ls_listavinag_rec") != undefined) {
            localStorage.removeItem("ls_listavinag_rec");
        }

        document.getElementById("gridVinAg").style.display = "initial";

        kendo.ui.progress($("#admcitaScreen"), false);

    }
    else {
        if (localStorage.getItem("ls_listavinag_rec") != undefined && localStorage.getItem("ls_listavinag_rec").toLocaleString() == "0") {
            kendo.ui.progress($("#admcitaScreen"), false);
            localStorage.removeItem("ls_listavinag_rec");
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
            return;
        }
        else {
            kendo.ui.progress($("#admcitaScreen"), false);
            // Si no encuentra en mayorista vuelve va concesionario
            localStorage.setItem("ls_listavinag_rec", "1");
            listaVinAgenda(strVinAgenda);
            return;
        }
    }

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    }
    else {
        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestiloIconB("icnCita");
    llamarNuevoestilo("btnCita");



     kendo.ui.progress($("#admcitaScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);


}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Busqueda de Citas por VIN, Placa u OT segun el texto ingresado
Parametros: VIN -> C / Placa -> P / OT  -> O
--------------------------------------------------------------------*/
function TraerInfoCita(responseText, tipo) {
    try {
        // Presenta el primer item del tabtrip
        var tabstrip = $("#tabstripCitas").kendoTabStrip().data("kendoTabStrip");
        tabstrip.select(0);

        var recurrenteOT = 0;
        var intResult = 0;

        var arrCitaFH = document.getElementById("dtpCitas2").value.split(/\b(\s)/);
        var hCita = arrCitaFH[2].replace(":", ".").trim();

        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        localStorage.getItem("ls_usulog").toLocaleString() + ";;;;RECEPCION;" +
        arrCitaFH[0].trim() + ";" +
        hCita + ";";

        // Fecha y hora de citas recuperada
        fhCitaReg = arrCitaFH[0].trim() + "," + hCita;

      //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

        kendo.ui.progress($("#admcitaScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

            var infor;
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        infor = (JSON.parse(data.tl33CitasGetResult)).ttl33[0];
                    } catch (e) {
                        kendo.ui.progress($("#admcitaScreen"), false);
                        recurrenteOT = 1;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso.<br />" + inspeccionar(err));
                    return;
                }
            });

            // Si no existe data envia mensaje de error
            if (inspeccionar(infor).length < 1) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos para el registro " + responseText);
                return;
            }
            else {
                document.getElementById("cita_nombre_propietario").value = infor.nombre_propietario;
                document.getElementById("cita_chasis").value = infor.chasis;

                document.getElementById("cita_placa").value = infor.placa;
                //____________________________________

                if (infor.placa.length > 0) {
                    document.getElementById("cita_placa").className = "w3-input textos";
                    document.getElementById("cita_placa").readOnly = true;
                }
                else {
                    document.getElementById("cita_placa").className = "w3-input w3-border textos3";
                    document.getElementById("cita_placa").readOnly = false;
                }
                //___________________________________


                document.getElementById("cita_reparaciones").value = infor.reparaciones_solicitadas;
                document.getElementById("cita_observaciones").value = infor.observacion;

                if (infor.nombre_cliente.trim() != "") {
                    if (infor.nombre_cliente.includes(",") == true) {
                        var arrCliNom = infor.nombre_cliente.split(",");
                        document.getElementById("cita_persona_nombre").value = arrCliNom[2];
                        document.getElementById("cita_persona_nombre2").value = arrCliNom[3];
                        document.getElementById("cita_persona_apellido").value = arrCliNom[0];
                        document.getElementById("cita_persona_apellido2").value = arrCliNom[1];
                    }
                    else {
                        document.getElementById("cita_persona_apellido").value = infor.nombre_cliente;
                    }
                }

                document.getElementById("cita_codigo_marca").value = infor.codigo_marca;
                document.getElementById("cita_mi_modelo").value = infor.nombre_modelo;
                document.getElementById("cita_anio_modelo").value = infor.anio_modelo;
                document.getElementById("cita_nombre_color").value = infor.color_vehiculo;
                document.getElementById("cita_identifica_cliente").value = infor.identifica_cliente;
                document.getElementById("cita_persona_numero").value = infor.persona_numero;
                document.getElementById("cita_calle_cliente").value = infor.calle_cliente;
                document.getElementById("cita_calle_interseccion").value = infor.calle_interseccion;
                document.getElementById("cita_numero_calle").value = infor.numero_calle;
                document.getElementById("cita_telefono_cliente").value = infor.telefono_cliente;
                document.getElementById("cita_celular_cliente").value = infor.celular_cliente;
                document.getElementById("cita_email_cliente").value = infor.email_cliente;

                document.getElementById("fecha_creacion").value = infor.fecha_creacion;
                document.getElementById("hora_creacion").value = infor.hora_creacion;
                document.getElementById("usuario_creacion").value = infor.usuario_creacion;


                // VIP UNA CITA
                document.getElementById("txt_vip_cita").value = infor.persona_clase;
                document.getElementById("vip_cita").innerHTML = "<div id='rcorners2'>" + infor.persona_clase + "</div>";
                if (infor.persona_clase.trim() != "") {
                    document.getElementById("vip_cita").style.display = "initial";
                }
                else {
                    document.getElementById("vip_cita").style.display = "none";
                }


                // Estado Cita
                cboCargaCita("estado_cita", arrEstCita, infor.estado, "cita_divcboestado");
                // Tipo de cita
                cboCitaTipos(infor.tipo_cita);
                // Cbo. Seccion
                cboCitaSecciones(infor.seccion_orden_trabajo);
                // Cbo. Tipo Trabajo
                cboCitaTrabajos(document.getElementById("seccion_orden_trabajo").value, infor.tipo_trabajo);
                // Cbo. Tipo Mantenimiento
                cboCitaMantenimientos(document.getElementById("tipo_trabajo").value, infor.tipo_mantenimiento);
                // Cbo. Tipo persona
                cboCargaCita("persona_tipo", arrTipPers, infor.persona_tipo.toUpperCase(), "cita_divcbotpers");
                // Cbo. Tipod de documento 
                cboCargaCita("tipo_id_cliente", arDoc, infor.tipo_id_cliente.toUpperCase(), "cita_divcbotid");
                // Cbo. tipo direccion 
                cboCargaCita("direccion_cliente", arrDir, infor.direccion_cliente.toUpperCase(), "cita_divcbodirec");
                // Cbo. pais
                cboCitaPaises(infor.pais_cliente);
                // Cbo. ciudad
                cboCitaCiudades(document.getElementById("pais_cliente").value, infor.ciudad_cliente);

                if (infor.chasis.trim() != "" && parseInt(infor.anio_modelo) > 1901) {
                    ConsultarEM_cita(infor.chasis);
                }

                document.getElementById("liVehiculo").removeAttribute("style")
                document.getElementById("liCliente").removeAttribute("style")

                if (parseInt(infor.anio_modelo) < 1901)//(infor.anio_modelo == "1900")
                {
                    tabstrip.enable(tabstrip.tabGroup.children().eq(0), false);
                    tabstrip.enable(tabstrip.tabGroup.children().eq(2), false);

                    tabstrip.select(1);
                    document.getElementById("cita_op1").checked = false;
                    document.getElementById("cita_op2").checked = true;
                    document.getElementById('cita_infoPlacasVIN').value = "";
                    document.getElementById("cita_trID").style.display = 'none';
                }
                else {
                    tabstrip.enable(tabstrip.tabGroup.children().eq(0), true);
                    tabstrip.enable(tabstrip.tabGroup.children().eq(2), true);

                    document.getElementById("cita_op1").checked = true;
                    document.getElementById("cita_op2").checked = false;
                    document.getElementById('cita_infoPlacasVIN').value = responseText;
                    document.getElementById("cita_trID").style.display = 'initial';
                }

                document.getElementById('cita_infoPlacasVIN').value = responseText;


                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                    if (infor.estado.trim() != "ABIERTO") {
                        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
                        "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
                    }
                    else {
                        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
                        "<button id='btnCita1' onclick='guardaCita(false);' class='w3-btn'><i id='icnCita1' class='fa fa-pencil' aria-hidden='true'></i> MODIFICAR CITA</button>" +
                        "<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita2' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
                    }
                }
                else {
                    if (infor.estado.trim() != "ABIERTO") {
                        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
                        "<button id='btnCita1' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i></button>";
                    }
                    else {
                        document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
                        "<button id='btnCita1' onclick='guardaCita(false);' class='w3-btn'><i id='icnCita1' class='fa fa-pencil' aria-hidden='true'></i></button>" +
                        "<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita2' class='fa fa-file' aria-hidden='true'></i></button>";
                    }
                }
                llamarNuevoestiloIconB("icnCita");
                llamarNuevoestilo("btnCita");
            
                document.getElementById("tabstripCitas").style.display = 'block';
            }

            kendo.ui.progress($("#admcitaScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (e) {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso.<br />" + e);
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Busqueda de Vehiculo por VIN, Placa segun el texto ingresado
Parametros: VIN -> C / Placa -> P / OT  -> O
--------------------------------------------------------------------*/
function TraerInfoCita_2(responseText, tipo) {
    try {

        // Presenta el primer item del tabtrip
        var tabstrip = $("#tabstripCitas").kendoTabStrip().data("kendoTabStrip");
        tabstrip.select(0);

        var recurrenteOT = 0;
        var intResult = 0;

        var arrCitaFH = document.getElementById("dtpCitas2").value.split(/\b(\s)/);
        var hCita = arrCitaFH[2].replace(":", ".").trim();

        var Url = Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
        localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
        localStorage.getItem("ls_usulog").toLocaleString() + ";;;;RECEPCION;" +
        arrCitaFH[0].trim() + ";" +
        hCita + ";";

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

        if (tipo == "P") {
            // Placa
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;" + responseText + ";";
        } else if (tipo == "C") {
            // Chasis
            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";;;;" + responseText;
        }
        else {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No se han encontrado datos del registro " + responseText);
            return;
        }

  //      window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> Url UNA CITA</center>", Url);



        fhCitaReg = "0";

        kendo.ui.progress($("#admcitaScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************


            var infor;
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",

                success: function (data) {
                    try {
                        infor = (JSON.parse(data.tl06OrdenesGetResult)).ttl06[0];

                    } catch (e) {
                        // recurrenteOT = 1;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso.<br />" + err);
                    return;
                }
            });

            // Si no existe data envia mensaje de error
            if (inspeccionar(infor).length < 1) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existen datos para el registro " + responseText);
                return;
            }
            else {
                document.getElementById("cita_nombre_propietario").value = infor.nombre_propietario;
                document.getElementById("cita_chasis").value = infor.chasis;
                document.getElementById("cita_placa").value = infor.placa;
                //____________________________________

                if (infor.placa.length > 0) {
                    document.getElementById("cita_placa").className = "w3-input textos";
                    document.getElementById("cita_placa").readOnly = true;
                }
                else {
                    document.getElementById("cita_placa").className = "w3-input w3-border textos3";
                    document.getElementById("cita_placa").readOnly = false;
                }
                //___________________________________

                if (infor.nombre_cliente.trim() != "") {
                    if (infor.nombre_cliente.includes(",") == true) {
                        var arrCliNom = infor.nombre_cliente.split(",");
                        document.getElementById("cita_persona_nombre").value = arrCliNom[2];
                        document.getElementById("cita_persona_nombre2").value = arrCliNom[3];
                        document.getElementById("cita_persona_apellido").value = arrCliNom[0];
                        document.getElementById("cita_persona_apellido2").value = arrCliNom[1];
                    }
                    else {
                        document.getElementById("cita_persona_apellido").value = infor.nombre_cliente;
                    }
                }

                document.getElementById("cita_codigo_marca").value = infor.codigo_marca;
                document.getElementById("cita_mi_modelo").value = infor.nombre_modelo;
                document.getElementById("cita_anio_modelo").value = infor.anio_modelo;
                document.getElementById("cita_nombre_color").value = infor.color_vehiculo;
                document.getElementById("cita_identifica_cliente").value = infor.identifica_cliente;
                document.getElementById("cita_persona_numero").value = infor.persona_numero;
                document.getElementById("cita_calle_cliente").value = infor.calle_cliente;
                document.getElementById("cita_calle_interseccion").value = infor.calle_interseccion;
                document.getElementById("cita_numero_calle").value = infor.numero_calle;
                document.getElementById("cita_telefono_cliente").value = infor.telefono_cliente;
                document.getElementById("cita_celular_cliente").value = infor.celular_cliente;
                document.getElementById("cita_email_cliente").value = infor.email_cliente;

                // cliente VIP                
                document.getElementById("txt_vip_cita").value = infor.persona_clase;
                document.getElementById("vip_cita").innerHTML = "<div id='rcorners2'>" + infor.persona_clase + "</div>";
                if (infor.persona_clase.trim() != "") {
                    document.getElementById("vip_cita").style.display = "initial";
                }
                else {
                    document.getElementById("vip_cita").style.display = "none";
                }


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

                document.getElementById("fecha_creacion").value = yyyy + "-" + mm + "-" + dd;
                document.getElementById("hora_creacion").value = hora + ":" + minuto;
                document.getElementById("usuario_creacion").value = localStorage.getItem("ls_usulog").toLocaleString();

                // Estado Cita
                cboCargaCita("estado_cita", arrEstCita, infor.estado, "cita_divcboestado");
                // Tipo de cita
                cboCitaTipos(infor.tipo_cita);
                // Cbo. Seccion
                //  cboCitaSecciones(infor.seccion_orden_trabajo);
                cboCitaSecciones("MECANICA");

                // Cbo. Tipo Trabajo
                //  cboCitaTrabajos(document.getElementById("seccion_orden_trabajo").value, infor.tipo_trabajo);
                cboCitaTrabajos(document.getElementById("seccion_orden_trabajo").value, "MP");


                // Cbo. Tipo Mantenimiento
                //   cboCitaMantenimientos(document.getElementById("tipo_trabajo").value, infor.tipo_mantenimiento);
                cboCitaMantenimientos(document.getElementById("tipo_trabajo").value, "");

                // Cbo. Tipo persona
                cboCargaCita("persona_tipo", arrTipPers, infor.persona_tipo.toUpperCase(), "cita_divcbotpers");
                // Cbo. Tipod de documento 
                cboCargaCita("tipo_id_cliente", arDoc, infor.tipo_id_cliente.toUpperCase(), "cita_divcbotid");
                // Cbo. tipo direccion 
                cboCargaCita("direccion_cliente", arrDir, infor.direccion_cliente.toUpperCase(), "cita_divcbodirec");
                // Cbo. pais
                cboCitaPaises(infor.pais_cliente);
                // Cbo. ciudad
                cboCitaCiudades(document.getElementById("pais_cliente").value, infor.ciudad_cliente);

                //   alert(infor.chasis + "__" + infor.anio_modelo);

                if (infor.chasis.trim() != "" && parseInt(infor.anio_modelo) > 1901) {
                    ConsultarEM_cita(infor.chasis);
                }

                document.getElementById("liVehiculo").removeAttribute("style");
                document.getElementById("liCliente").removeAttribute("style");
                document.getElementById("liHistorial").removeAttribute("style");

                document.getElementById('cita_infoPlacasVIN').value = responseText;

                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                    document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
        "<button id='btnCita1' onclick='guardaCita(true);' class='w3-btn'><i id='icnCita1' class='fa fa-floppy-o' aria-hidden='true'></i> GENERAR CITA</button>" +
    "<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita2' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
                }
                else {
                    document.getElementById("cita_btnGuardaInfo").innerHTML = "<button id='btnCita0' onclick='abrirPagina(\"agenda\")' class='w3-btn'><i id='icnCita0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
        "<button id='btnCita1' onclick='guardaCita(true);' class='w3-btn'><i id='icnCita1' class='fa fa-floppy-o' aria-hidden='true'></i></button>" +
    "<button id='btnCita2' onclick='resetCita();' class='w3-btn'><i id='icnCita1' class='fa fa-file' aria-hidden='true'></i></button>";
                }
                llamarNuevoestiloIconB("icnCita");
                llamarNuevoestilo("btnCita");
                document.getElementById("tabstripCitas").style.display = 'block';

                document.getElementById("gridVinAg").style.display = "none";

                tabstrip.enable(tabstrip.tabGroup.children().eq(0), true);
                tabstrip.enable(tabstrip.tabGroup.children().eq(1), true);
                tabstrip.enable(tabstrip.tabGroup.children().eq(2), true);
            }


            kendo.ui.progress($("#admcitaScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (e) {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso.<br />" + e);
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Busqueda de cliente
Parametros: documento
--------------------------------------------------------------------*/
function ConsultarClienteCita(identificacion) {
    try {
        document.getElementById("cita_persona_numero").value = "";
        document.getElementById("cita_calle_cliente").value = "";
        document.getElementById("cita_calle_interseccion").value = "";
        document.getElementById("cita_numero_calle").value = "";
        document.getElementById("cita_telefono_cliente").value = "";
        document.getElementById("cita_email_cliente").value = "";
        document.getElementById("cita_celular_cliente").value = "";
        document.getElementById("cita_persona_nombre").value = "";
        document.getElementById("cita_persona_nombre2").value = "";
        document.getElementById("cita_persona_apellido").value = "";
        document.getElementById("cita_persona_apellido2").value = "";
        document.getElementById("persona_numero_profesional").value = "";

        // VIP
        document.getElementById("txt_vip_cita").value = "";
        document.getElementById("vip_cita").innerHTML = "";

        // Cbo de tipos de Cita
        cboCitaTipos("CLIENTE");
        // Cbo Estado 
        cboCargaCita("estado_cita", arrEstCita, arrEstCita[0], "cita_divcboestado");

        // Cbo. Seccion
        //cboCitaSecciones("MECANICA");
        //// Cbo. Tipo Trabajo
        //cboCitaTrabajos(document.getElementById("seccion_orden_trabajo").value, "");
        //// Cbo. Tipo Mantenimiento
        //cboCitaMantenimientos(document.getElementById("tipo_trabajo").value, "");
        // Cbo. Tipo persona
        cboCargaCita("persona_tipo", arrTipPers, arrTipPers[0], "cita_divcbotpers");
        // Cbo. Tipod de documento 
        cboCargaCita("tipo_id_cliente", arDoc, arDoc[0], "cita_divcbotid");
        // Cbo. tipo direccion 
        cboCargaCita("direccion_cliente", arrDir, arrDir[0], "cita_divcbodirec");
        // Cbo. pais
        //cboCitaPaises("ECUADOR");
        //// Cbo. ciudad
        //cboCitaCiudades(document.getElementById("pais_cliente").value, "");


        if (identificacion != "") {

            kendo.ui.progress($("#admcitaScreen"), true);
            setTimeout(function () {
                // precarga *********************************************************************************************


                // Primera vez URL2
                //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/tg04PersonaGet/JSON;1002794855

                var Url = "";
                var infor;

                if (recurrCitaCliente == 0) {
                    Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/tg04PersonaGet/JSON;" + identificacion;

                    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);

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
                                kendo.ui.progress($("#admcitaScreen"), false);
                                recurrCitaCliente = 1;
                                return;
                            }
                        },
                        error: function (err) {
                            kendo.ui.progress($("#admcitaScreen"), false);
                            recurrCitaCliente = 1;
                            return;
                        }
                    });
                }
                else if (recurrCitaCliente == 1) {
                    recurrCitaCliente = 2;
                    Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/TG/Parametros.svc/tg91PersonaGet/JSON;" + identificacion;

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
                                kendo.ui.progress($("#admcitaScreen"), false);
                                return;
                            }
                        },
                        error: function (err) {
                            kendo.ui.progress($("#admcitaScreen"), false);
                            return;
                        }
                    });
                }

                //  alert(inspeccionar(infor));

                if (inspeccionar(infor).length > 0) {
                    recurrCitaCliente = 0;
                    document.getElementById("cita_persona_numero").value = infor.persona_numero;
                    document.getElementById("cita_calle_cliente").value = infor.calle_cliente;
                    document.getElementById("cita_calle_interseccion").value = infor.calle_interseccion;
                    document.getElementById("cita_numero_calle").value = infor.numero_calle;
                    document.getElementById("cita_telefono_cliente").value = infor.telefono_cliente;
                    document.getElementById("cita_email_cliente").value = infor.email_cliente;

                    //  alert(infor.persona_numero_profesional);

                    document.getElementById("persona_numero_profesional").value = "0";// infor.persona_numero_profesional;

                    document.getElementById("cita_celular_cliente").value = infor.celular_cliente;

                    if (infor.persona_nombre.trim() != "") {
                        if (infor.persona_nombre.includes(",") == true) {
                            var arrCliNom = infor.persona_nombre.split(",");
                            document.getElementById("cita_persona_nombre").value = arrCliNom[2];
                            document.getElementById("cita_persona_nombre2").value = arrCliNom[3];
                            document.getElementById("cita_persona_apellido").value = arrCliNom[0];
                            document.getElementById("cita_persona_apellido2").value = arrCliNom[1];
                        }
                        else {
                            document.getElementById("cita_persona_apellido").value = infor.persona_nombre;
                        }
                    }

                    // VIP
                    document.getElementById("txt_vip_cita").value = infor.persona_clase;
                    document.getElementById("vip_cita").innerHTML = "<div id='rcorners2'>" + infor.persona_clase + "</div>";
                    if (infor.persona_clase.trim() != "") {
                        document.getElementById("vip_cita").style.display = "initial";
                    }
                    else {
                        document.getElementById("vip_cita").style.display = "none";
                    }

                    // Cbo. Tipo persona
                    cboCargaCita("persona_tipo", arrTipPers, infor.persona_tipo.toUpperCase(), "cita_divcbotpers");
                    // Cbo. Tipod de documento 
                    cboCargaCita("tipo_id_cliente", arDoc, arDoc[0], "cita_divcbotid");
                    //  Cbo. tipo direccion 
                    cboCargaCita("direccion_cliente", arrDir, infor.direccion_cliente.toUpperCase(), "cita_divcbodirec");
                    // Cbo. pais
                    cboCitaPaises(infor.pais_cliente);
                    // Cbo. ciudad
                    cboCitaCiudades(document.getElementById("pais_cliente").value, infor.ciudad_cliente);
                }
                else {
                    if (recurrCitaCliente > 1) {
                        kendo.ui.progress($("#admcitaScreen"), false);
                        recurrCitaCliente = 0;
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existen datos del documento:&nbsp;<b>" + identificacion + "</b>");
                        return;
                    }
                    else {
                        kendo.ui.progress($("#admcitaScreen"), false);
                        recurrCitaCliente = 1;
                        ConsultarClienteCita(identificacion);
                        return;
                    }
                }

                kendo.ui.progress($("#admcitaScreen"), false);
                // precarga *********************************************************************************************
            }, 2000);

        }
        else {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de C&eacute;dula");
            return;
        }

    } catch (e) {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", e);
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: Creacion y modificacion de citas
Parametros: Campos
--------------------------------------------------------------------*/
function guardaCita(tipoAccion) {
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

       //   var UrlGuardaCita = "http://localhost:4044/Services/TL/Taller.svc/tl33CitasSet"
       var UrlGuardaCita = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasSet";

        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlGuardaCita);

        var codigo_empresa = localStorage.getItem("ls_idempresa").toLocaleString();
        var codigo_sucursal = localStorage.getItem("ls_ussucursal").toLocaleString();
        var codigo_taller = localStorage.getItem("ls_usagencia").toLocaleString();
        var tipo_atencion = "RECEPCION";
        var persona_numero_profesional = document.getElementById("persona_numero_profesional").value;//"0";

        var fhCita = document.getElementById("dtpCitas2").value;

        if (fhCita.length == 16) {
            var arrfhCita = fhCita.split(/\b(\s)/);
            var entregaCita = fhCita.replace(arrfhCita[0], "");

            var arr2Fecha = arrfhCita[0].split('-');
            var fecha_cita = arr2Fecha[2] + "-" + arr2Fecha[1] + "-" + arr2Fecha[0];

            //  var fecha_cita = arrfhCita[0];

            var hora_cita = entregaCita.trim();
            hora_cita = hora_cita.replace(':', '.');

            var fecha_confirmacion = fecha_cita;
            var hora_confirmacion = hora_cita;
        }
        else {
            kendo.ui.progress($("#admcitaScreen"), false);
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione correctamente la Fecha y Hora de la Cita");
            return;
        }

        var persona_nombre_profesional = localStorage.getItem("ls_usunom").toLocaleString(); //"ANCHATUNA MONICA";
        var estado = document.getElementById("estado_cita").value;
        var seccion_orden_trabajo = "";
        var tipo_mantenimiento = "";
        var tipo_trabajo = "";
        var calle_cliente = document.getElementById("cita_calle_cliente").value;
        var calle_interseccion = document.getElementById("cita_calle_interseccion").value;
        var celular_cliente = document.getElementById("cita_celular_cliente").value;
        var chasis = "";
        var codigo_marca = "";
        var codigo_modelo = "";
        var color_vehiculo = "";
        var direccion_cliente = document.getElementById("direccion_cliente").value;
        var email_cliente = document.getElementById("cita_email_cliente").value;

        if (email_cliente.trim() != "" && /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email_cliente) == false) {
            kendo.ui.progress($("#admcitaScreen"), false);
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese correctamente el Email del Cliente");
            return;
        }

        var persona_numero = document.getElementById("cita_persona_numero").value;
        var nombre_propietario = document.getElementById("cita_nombre_propietario").value;

        var identifica_cliente = document.getElementById("cita_identifica_cliente").value;
        if (identifica_cliente == "") {
            kendo.ui.progress($("#admcitaScreen"), false);
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese el N&uacute;mero de Documento del Cliente");
            return;
        }

        var nombre_cliente = "";
        if (document.getElementById("cita_persona_apellido").value == "" && document.getElementById("cita_persona_apellido2").value == "" && document.getElementById("cita_persona_nombre").value == "" && document.getElementById("cita_persona_nombre2").value == "") {
            kendo.ui.progress($("#admcitaScreen"), false);
            validaOT = "0";
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese la Raz&oacute;n Social o<br /> Nombres y Apellidos");
            return;
        }
        else {
            nombre_cliente = document.getElementById("cita_persona_apellido").value + "," + document.getElementById("cita_persona_apellido2").value + "," + document.getElementById("cita_persona_nombre").value + "," + document.getElementById("cita_persona_nombre2").value;
        }


        var persona_nacionalidad = document.getElementById("nacionalidad_cliente").value;
        var numero_calle = document.getElementById("cita_numero_calle").value;
        var pais_cliente = document.getElementById("pais_cliente").value;
        var persona_tipo = document.getElementById("persona_tipo").value;
        var placa = "";
        var telefono_cliente = document.getElementById("cita_telefono_cliente").value;
        var tipo_id_cliente = document.getElementById("tipo_id_cliente").value;
        var ciudad_cliente = document.getElementById("ciudad_cliente").value;

        var tipo_cita = document.getElementById("tipo_cita").value;

        var anio_modelo = "";
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

        // ant
        //var fecha_creacion = yyyy + "-" + mm + "-" + dd;
        //var hora_creacion = hora + ":" + minuto;
        //var usuario_creacion = localStorage.getItem("ls_usulog").toLocaleString();
        // nuevo
        var fecha_creacion = document.getElementById("fecha_creacion").value;
        var hora_creacion = document.getElementById("hora_creacion").value;
        var usuario_creacion = document.getElementById("usuario_creacion").value;

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

        var elementCheckBox = document.getElementsByName("opcBusqueda");
        if (elementCheckBox[0].checked == true) {
            placa = document.getElementById("cita_placa").value;
            chasis = document.getElementById("cita_chasis").value;
            codigo_marca = document.getElementById("cita_codigo_marca").value;
            codigo_modelo = document.getElementById("cita_mi_modelo").value;
            color_vehiculo = document.getElementById("cita_nombre_color").value;
            seccion_orden_trabajo = document.getElementById("seccion_orden_trabajo").value;
            tipo_mantenimiento = document.getElementById("tipo_mantenimiento").value;
            tipo_trabajo = document.getElementById("tipo_trabajo").value;
            anio_modelo = document.getElementById("cita_anio_modelo").value;
            reparaciones_solicitadas = document.getElementById("cita_reparaciones").value;
            observacion = document.getElementById("cita_observaciones").value;

            if ((document.getElementById("tipo_trabajo").value == "MP" || document.getElementById("tipo_trabajo").value == "MANTENIMIENTO") && document.getElementById("tipo_mantenimiento").value.trim() == "") {
                kendo.ui.progress($("#admcitaScreen"), false);
                validaOT = "0";
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Seleccione el Tipo de Mantenimiento");
                return;
            }
        }

        //if (tipoAccion == false)
        //{
        //var cuser = localStorage.getItem("ls_usulog").toLocaleString();
        //var id_cita = codigo_empresa + "," + codigo_sucursal + "," + codigo_taller + "," + tipo_atencion + "," + cuser + "," + fecha_cita + "," + hora_cita;
        //}




        var id_cita = fhCitaReg;


        var persona_clase = document.getElementById("txt_vip_cita").value;


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
            "numero_orden_tl06": numero_orden_tl06,
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

            "persona_clase": persona_clase
        };

      //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(params));

        if (validaOT == "1") {

            kendo.ui.progress($("#admcitaScreen"), true);
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
                                var nombre_cliente2 = document.getElementById("cita_persona_apellido").value + " " + document.getElementById("cita_persona_apellido2").value + " " + document.getElementById("cita_persona_nombre").value + " " + document.getElementById("cita_persona_nombre2").value;
                                var infoOk = "<center>La Cita fue registrada correctamente para<br />" + "<b>" + nombre_cliente2 + "</b><br/>El d&iacute;a <b>" + fhCita + "</b></center>";
                                window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> REGISTRADO</center>", infoOk);

                                localStorage.setItem("ls_citafechahoraresp", arrfhCita[0]);
                                abrirPagina("agenda");
                                return;
                            } catch (s) {
                                kendo.ui.progress($("#admcitaScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Error durante el proceso.<br />" + s);
                                return;
                            }
                        }
                        else {
                            kendo.ui.progress($("#admcitaScreen"), false);
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No fue ingresado el registro. <br />" + data.split(",")[1]);
                            return;
                        }
                    },
                    error: function (err) {
                        kendo.ui.progress($("#admcitaScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err));
                        return;
                    }
                });


                kendo.ui.progress($("#admcitaScreen"), false);
                // precarga *********************************************************************************************
            }, 2000);


        }

    } catch (e) {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Carga cbo Secciones
Parametros: solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaSecciones(selSeccion) {

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;TL;SECCIONES;

    var UrlCboSecciones = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2," + localStorage.getItem("ls_idempresa").toLocaleString() + ";TL;SECCIONES;"

    var cboSecResp = "";

    $.ajax({
        url: UrlCboSecciones,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboSecResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
            return;
        }
    });

    if (cboSecResp.length > 0) {

        var cboAgenciaHTML = "<div class='select-style2'><p><select id='seccion_orden_trabajo'  onchange='cboCitaTrabajos(this.value)' class='w3-input w3-border textos'>";

        for (var i = 0; i < cboSecResp.length; i++) {
            if (selSeccion == cboSecResp[i].CodigoClase) {
                cboAgenciaHTML += "<option  value='" + cboSecResp[i].CodigoClase + "' selected>" + cboSecResp[i].NombreClase + "</option>";
            }
            else {
                cboAgenciaHTML += "<option  value='" + cboSecResp[i].CodigoClase + "'>" + cboSecResp[i].NombreClase + "</option>";
            }
        }
        cboAgenciaHTML += "</select></p></div>";
        document.getElementById("cita_divcboseccion").innerHTML = cboAgenciaHTML;
    }
    else {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Secci&oacute;n");
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Carga cbo Tipo Trabajo
Parametros: 
- Seccion dependiente
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaTrabajos(itmSeccion, selTrabajo) {

    var cboTrabajoHTML = "<p><select id='tipo_trabajo' class='w3-input w3-border textos'>";
    cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
    cboTrabajoHTML += "</select></p>";

    var defVal1 = "";

    if (itmSeccion != "") {
        // var itmSeccion = "COLISION";

        //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,173
        // var UrlCboTrabajos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,173";

        // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/6,1;TL;TIPOS_TRABAJO;;;;;COLISION;

        var UrlCboTrabajos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;TIPOS_TRABAJO;;;;;" + itmSeccion + ";";

        var cboTrbResp = "";

        $.ajax({
            url: UrlCboTrabajos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboTrbResp = JSON.parse(data.ComboParametroEmpGetResult);
                } catch (e) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admcitaScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Trabajo");
                return;
            }
        });

        var matchTrabajo = "0";

        if (cboTrbResp.length > 0) {
            cboTrabajoHTML = "<div class='select-style2'><p><select id='tipo_trabajo' onchange='cboCitaMantenimientos(this.value, 0)' class='w3-input w3-border textos'>";

            //   cboTrabajoHTML = "<p><div class='select-style2'><select id='trabajo2' onchange='cboMantenimientos(this.value)' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboTrbResp.length; i++) {

                if (itmSeccion == "MECANICA" && selTrabajo == undefined) {
                    selTrabajo = "MP";
                }

                if (cboTrbResp[i].CodigoClase != " " || cboTrbResp[i].CodigoClase != "ninguna") {
                    if (selTrabajo == cboTrbResp[i].CodigoClase) {

                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "' selected>" + cboTrbResp[i].NombreClase + "</option>";
                        matchTrabajo = "1";
                        defVal1 = cboTrbResp[i].CodigoClase;
                    }
                    else {
                        cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "'>" + cboTrbResp[i].NombreClase + "</option>";
                    }
                }
            }

            if (matchTrabajo == "0") {
                cboTrabajoHTML = "<div class='select-style2'><p><select id='tipo_trabajo' onchange='cboCitaMantenimientos(this.value, 0)' class='w3-input w3-border textos'>";

                for (var i = 0; i < cboTrbResp.length; i++) {

                    if (itmSeccion == "MECANICA") {
                        selTrabajo = "MANTENIMIENTO";
                    }

                    if (cboTrbResp[i].CodigoClase != " " || cboTrbResp[i].CodigoClase != "ninguna") {
                        if (selTrabajo == cboTrbResp[i].CodigoClase) {
                            cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "' selected>" + cboTrbResp[i].NombreClase + "</option>";
                            defVal1 = cboTrbResp[i].CodigoClase;

                        }
                        else {
                            cboTrabajoHTML += "<option  value='" + cboTrbResp[i].CodigoClase + "'>" + cboTrbResp[i].NombreClase + "</option>";
                        }
                    }
                }
            }
            cboTrabajoHTML += "</select></p></div>";


            //rrp
            if (selTrabajo == "MP" || selTrabajo == "MANTENIMIENTO" && (defVal1 != "")) {
                cboCitaMantenimientos(defVal1, 0);
            }
            else {
                var cboCitaMantenimientoHTML = "<div class='select-style2'><p><select id='tipo_mantenimiento'  class='w3-input w3-border textos'>";
                cboCitaMantenimientoHTML += "<option  value=' '>Ninguno</option>";
                cboCitaMantenimientoHTML += "</select> </p></div>";
                document.getElementById("cita_divcboMantenimiento").innerHTML = cboCitaMantenimientoHTML;
            }
        }
        else {
            cboTrabajoHTML = "<p><select id='tipo_trabajo' class='w3-input w3-border textos'>";
            cboTrabajoHTML += "<option  value=' '>Ninguno</option>";
            cboTrabajoHTML += "</select><p>";
        }
    }

    document.getElementById("cita_divcboTrabajo").innerHTML = cboTrabajoHTML;
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Cbo Tipo Mantenimiento
Parametros: 
- Tipo trabajo dependiente
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaMantenimientos(itmTrabajo, selMantenimiento) {

    var matchMantenim = 0;

    var cboCitaMantenimientoHTML = "<div class='select-style2'><p><select id='tipo_mantenimiento'  class='w3-input w3-border textos'>";
    cboCitaMantenimientoHTML += "<option  value=' '>Ninguno</option>";
    cboCitaMantenimientoHTML += "</select> </p></div>";

    if (itmTrabajo == "MP" || itmTrabajo == "MANTENIMIENTO") {

        //  http://186.71.21.170:8077/taller/Services/GA/Garantias.svc/OperacionesMantGet/1,

        var UrlcboCitaMantenimientos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/GA/Garantias.svc/OperacionesMantGet/1,";

        //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlcboCitaMantenimientos);

        var cboCitaMntResp = "";

        $.ajax({
            url: UrlcboCitaMantenimientos,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboCitaMntResp = JSON.parse(data.OperacionesMantGetResult);
                } catch (e) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    validaServicios = 0;
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admcitaScreen"), false);
                validaServicios = 0;
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Mantenimiento");
                return;
            }
        });


        if (cboCitaMntResp.length > 0) {

            if (cboCitaMntResp[0].CodigoClase == "0") {
                validaServicios = 0;
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", cboCitaMntResp[0].NombreClase);
                return;
            }
            else {
                var cboCitaMantenimientoHTML = "<div class='select-style2'> <p><select id='tipo_mantenimiento'  class='w3-input w3-border textos'>";
                for (var i = 0; i < cboCitaMntResp.length; i++) {
                    //  if ("000 Km. (" + selMantenimiento + ")" == cboCitaMntResp[i].CodigoClase) {
                    if (selMantenimiento == cboCitaMntResp[i].CodigoClase && selMantenimiento != "0") {
                        matchMantenim = 1;
                        cboCitaMantenimientoHTML += "<option  value='" + cboCitaMntResp[i].CodigoClase + "' selected>" + cboCitaMntResp[i].NombreClase + "</option>";
                    }
                    else {
                        cboCitaMantenimientoHTML += "<option  value='" + cboCitaMntResp[i].CodigoClase + "'>" + cboCitaMntResp[i].NombreClase + "</option>";
                    }
                }
                cboCitaMantenimientoHTML += "</select></p></div> ";
            }
        }
        else {

            cboCitaMantenimientoHTML = "<div class='select-style2'><p><select id='tipo_mantenimiento' class='w3-input w3-border textos'>";
            cboCitaMantenimientoHTML += "<option  value=' '>Ninguno</option>";
            cboCitaMantenimientoHTML += "</select></p></div> ";
        }
    }
    //else if (itmTrabajo == "GA" || itmTrabajo == "GARANTIA") {
    //    document.getElementById("referencia_srg").value = "";
    //    document.getElementById("referencia_srg").type = "number";
    //}

    document.getElementById("cita_divcboMantenimiento").innerHTML = cboCitaMantenimientoHTML;

    if (matchMantenim < 1) {
        document.getElementById("tipo_mantenimiento").selectedIndex = "0";
    }
}

/*--------------------------------------------------------------------
Fecha: 22/11/2017
Detalle: Cbo Tipo Cita
Parametros: 
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaTipos(selCita) {
    var cboCitaHTML = "<p><label id='lblCita' class='w3-text-red'><b>Tipo Cita</b></label><select id='tipo_cita' class='w3-input w3-border textos'>";
    cboCitaHTML += "<option  value=' '>Ninguno</option>";
    cboCitaHTML += "</select></p>";

    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;TIPO_CITA;;;;;;

    var UrlCboCitas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/13,1;TL;TIPO_CITA;;;;;;";

    var cboCitaResp = "";

    $.ajax({
        url: UrlCboCitas,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboCitaResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Cita");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#admcitaScreen"), false);
            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Tipo Cita");
            return;
        }
    });


    if (cboCitaResp.length > 0) {
        cboCitaHTML = "<p><label id='lblCita' class='w3-text-red'><b>Tipo Cita</b></label><select id='tipo_cita'  class='w3-input w3-border textos'>";

        for (var i = 0; i < cboCitaResp.length; i++) {

            if (cboCitaResp[i].CodigoClase != " " || cboCitaResp[i].CodigoClase != "ninguna") {
                if (selCita == cboCitaResp[i].CodigoClase) {
                    cboCitaHTML += "<option  value='" + cboCitaResp[i].CodigoClase + "' selected>" + cboCitaResp[i].NombreClase + "</option>";
                }
                else {
                    cboCitaHTML += "<option  value='" + cboCitaResp[i].CodigoClase + "'>" + cboCitaResp[i].NombreClase + "</option>";
                }
            }
        }
        cboCitaHTML += "</select></p>";
    }
    else {
        cboCitaHTML = "<p><label id='lblCita' class='w3-text-red'><b>Tipo Cita</b></label><select id='tipo_cita' class='w3-input w3-border textos'>";
        cboCitaHTML += "<option  value=' '>Ninguno</option>";
        cboCitaHTML += "</select></p>";
    }

    document.getElementById("cita_divcboCita").innerHTML = cboCitaHTML;
    llamarColorTexto(".w3-text-red");
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Cbo Pais
Parametros: 
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaPaises(selPais) {

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,18

    var UrlcboCitaPaises = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,18"

    var cboCitaPaResp = "";

    $.ajax({
        url: UrlcboCitaPaises,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboCitaPaResp = JSON.parse(data.ParametroGralGetResult);
            } catch (e) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
            return;
        }
    });



    if (cboCitaPaResp.length > 0) {

        var cboCitaPaisHTML = "<p><select id='pais_cliente' onchange='cboCitaCiudades(this.value)' class='w3-input w3-border textos'>";

        for (var i = 0; i < cboCitaPaResp.length; i++) {
            if (selPais == cboCitaPaResp[i].CodigoClase) {
                cboCitaPaisHTML += "<option  value='" + cboCitaPaResp[i].CodigoClase + "' selected>" + cboCitaPaResp[i].NombreClase + "</option>";
            }
            else {
                cboCitaPaisHTML += "<option  value='" + cboCitaPaResp[i].CodigoClase + "'>" + cboCitaPaResp[i].NombreClase + "</option>";
            }
        }
        cboCitaPaisHTML += "</select>";
        document.getElementById("divcboCitaPais").innerHTML = cboCitaPaisHTML;
    }
    else {
        kendo.ui.progress($("#admcitaScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Pais");
        return;
    }
}
/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Cbo Ciudad
Parametros: 
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaCiudades(itmPais, selCiudad) {

    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/CiudadesGet/1,ECUADOR

    var cboCitaCiudadHTML = "<p><select id='ciudad_cliente' class='w3-input w3-border textos'>";
    cboCitaCiudadHTML += "<option  value=' '>Ninguna</option>";
    cboCitaCiudadHTML += "</select>";

    if (itmPais != "") {
        var UrlcboCitaCiudades = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/CiudadesGet/1," + itmPais;

        var cboCitaCiuResp = "";

        $.ajax({
            url: UrlcboCitaCiudades,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboCitaCiuResp = JSON.parse(data.CiudadesGetResult);
                } catch (e) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admcitaScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ciudad");
                return;
            }
        });


        if (cboCitaCiuResp.length > 0) {

            cboCitaCiudadHTML = "<p><select id='ciudad_cliente' class='w3-input w3-border textos'>";
            for (var i = 0; i < cboCitaCiuResp.length; i++) {

                if (cboCitaCiuResp[i].CodigoClase != " " || cboCitaCiuResp[i].CodigoClase != "ninguna") {
                    if (selCiudad == cboCitaCiuResp[i].CodigoClase) {
                        cboCitaCiudadHTML += "<option  value='" + cboCitaCiuResp[i].CodigoClase + "' selected>" + cboCitaCiuResp[i].NombreClase + "</option>";
                    }
                    else {
                        cboCitaCiudadHTML += "<option  value='" + cboCitaCiuResp[i].CodigoClase + "'>" + cboCitaCiuResp[i].NombreClase + "</option>";
                    }
                }
            }
            cboCitaCiudadHTML += "</select>";
        }
        else {
            cboCitaCiudadHTML = "<p><select id='ciudad_cliente' class='w3-input w3-border textos'>";
            cboCitaCiudadHTML += "<option  value=' '>Ninguna</option>";
            cboCitaCiudadHTML += "</select>";
        }
    }

    document.getElementById("divcboCitaCiudad").innerHTML = cboCitaCiudadHTML;
}

/*--------------------------------------------------------------------
Fecha: 21/11/2017
Detalle: Cbo array / Para Estado de cita presenta txt solo lectura
Parametros: 
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCargaCita(idCombo, arrCombo, selItem, divCombo) {
    var cboAgenciaHTML = "";

    if (idCombo == "estado_cita") {

        if (selItem.trim() == "") {
            selItem = "ABIERTO";
        }
        cboAgenciaHTML = "<input id='estado_cita' type='text' value='" + selItem + "' class='w3-input textos' readonly>";
    }
    else {

        cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos'>";

        if (idCombo == "tipo_id_cliente") {
            //  document.getElementById("divcboCitaNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";
            cboAgenciaHTML = "<p><select id='" + idCombo + "' class='w3-input w3-border textos' onchange='cboCitaNacionalidad(this.value);'>";
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
    }

    document.getElementById(divCombo).innerHTML = cboAgenciaHTML;
}

/*--------------------------------------------------------------------
Fecha: 02/01/2017
Detalle: Cbo Nacionalidad
Parametros: 
- Tipo de documento Pasaporte
- solo si existe valor seleccionado por def
--------------------------------------------------------------------*/
function cboCitaNacionalidad(opVista, selNac) {

    if (opVista != "PASAPORTE") {
        document.getElementById("divcboCitaNacionalidad").innerHTML = "<input id='nacionalidad_cliente' type='hidden' value=''>";
    }
    else {
        //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,10
        var UrlcboCitaPaises = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,10"
        var cboCitaPaResp = "";

        $.ajax({
            url: UrlcboCitaPaises,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    cboCitaPaResp = JSON.parse(data.ParametroGralGetResult);
                } catch (e) {
                    kendo.ui.progress($("#admcitaScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#admcitaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
                return;
            }
        });


        if (cboCitaPaResp.length > 0) {

            var cboCitaPaisHTML = "<p><label class='w3-text-red'><b>Nacionalidad</b></label><select id='nacionalidad_cliente' class='w3-input w3-border textos'>";

            for (var i = 0; i < cboCitaPaResp.length; i++) {
                if (selNac == cboCitaPaResp[i].CodigoClase) {
                    cboCitaPaisHTML += "<option  value='" + cboCitaPaResp[i].CodigoClase + "' selected>" + cboCitaPaResp[i].NombreClase + "</option>";
                }
                else {
                    cboCitaPaisHTML += "<option  value='" + cboCitaPaResp[i].CodigoClase + "'>" + cboCitaPaResp[i].NombreClase + "</option>";
                }
            }
            cboCitaPaisHTML += "</select></p>";
            document.getElementById("divcboCitaNacionalidad").innerHTML = "" + cboCitaPaisHTML;
        }
        else {
            kendo.ui.progress($("#admcitaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Nacionalidad");
            return;
        }
    }
}

// END_CUSTOM_CODE_admcita