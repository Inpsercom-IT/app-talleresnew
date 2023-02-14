/*=======================================================================
Fecha: 20/10/2017
=======================================================================
Detalles: 
- Presenta la agenda de citas por usuario y fecha
- Creacion de nuevas citas
- Consulta la informacion de la cita creada
- Cliente VIP
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

// --------------------------------------------------------------------------
// Valores por default
// --------------------------------------------------------------------------
var arrAgendaGrl = [];
var dialog;
var arrEsCt = ["CONFIRMADO", "CANCELADO", "ABIERTO"];
var validaProceAgenda = true;
// --------------------------------------------------------------------------

app.agenda = kendo.observable({
    onShow: function () {
    llamarNuevoestiloIconB("iconMenuP");
    llamarNuevoestilo("bntAgCarga");
        usuPrincipal();

        usuariosAgencia();

        arregloHora();

        cierraControlGral();

        if (localStorage.getItem("ls_dimensionW") == undefined) {
            localStorage.setItem("ls_dimensionW", screen.width);
            localStorage.setItem("ls_dimensionH", screen.height);
        }

        localStorage.setItem("ls_agendaplaca", "");

        if (localStorage.getItem("ls_citafechahoraresp") != undefined) {
            document.getElementById("datepicker").value = localStorage.getItem("ls_citafechahoraresp").toLocaleString();
            localStorage.removeItem("ls_citafechahoraresp");
        }
        else {
            document.getElementById("datepicker").value = fechaActual();
        }

        // dd-mm-yyyy
        if (validaProceAgenda == true) {

            $("#datepicker").kendoDatePicker({
                format: "dd-MM-yyyy",
                change: onChange,
                culture: "es-ES"
            });

            cargaAgenda(document.getElementById("datepicker").value);

            document.getElementById("bntAgCarga0").style.display = 'initial';
            document.getElementById("bntAgCarga1").style.display = 'initial';
            document.getElementById("contAgenda").style.display = 'initial';
        }
        else {

            $("#datepicker").kendoDatePicker({
                format: "dd-MM-yyyy",
                culture: "es-ES"
            });

            if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                document.getElementById("titCitaBusqFech").innerHTML = "Seleccione la fecha";
            }
            else {
                document.getElementById("titCitaBusqFech").innerHTML = "Seleccione";
            }

            document.getElementById("bntAgCarga0").style.display = 'none';
            document.getElementById("bntAgCarga1").style.display = 'none';
            document.getElementById("contAgenda").style.display = 'none';
        }

        // VIP
        //var arrEstado = ["&nbsp;&nbsp;Abierto&nbsp;&nbsp;", "Cancelado", "Procesado", "Confirmado", "&nbsp;&nbsp;VIP&nbsp;&nbsp;"];
        //var arrColor = ["#DFCEFF", "#ff0000", "#ffcc00", "#00FF00", "#fb5d03d6"];

        var arrEstado = ["&nbsp;&nbsp;Abierto&nbsp;&nbsp;", "Cancelado", "Procesado", "Confirmado", "&nbsp;&nbsp;<i id='iconvip0' class='fa fa-flag fa-lg' aria-hidden='true'></i>&nbsp;VIP&nbsp;&nbsp;&nbsp;"];
        var arrColor = ["#DFCEFF", "#808075", "#ffcc00", "#00FF00", "#FFFFFF"];


        var colorEstado = "";

        var tamLetra = "font-size:11px;";

        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            tamLetra = "font-size:12px;";
            document.getElementById("btnSinc").innerHTML = "&nbsp;SINCRONIZAR";
        }

        for (var j = 0; j < arrEstado.length; j++) {
            colorEstado = colorEstado.concat("<label style='background-color: " + arrColor[j] + "; padding:5px; border:solid 1px;" + tamLetra + "'>" + arrEstado[j] + "</label>");
        }

        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
            document.getElementById("divColor").innerHTML = colorEstado;
            llamarNuevoestiloIcon("iconvip")
            document.getElementById("btnFooterAgenda").innerHTML = "<button id='btnAgenda0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='iconAgenda0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>";
            llamarNuevoestilo("btnAgenda");
        }
        else {
            document.getElementById("btnFooterAgenda").innerHTML = "<button id='btnAgenda0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='iconAgenda0' class='fa fa-chevron-left' aria-hidden='true'></i></button> " + colorEstado;
            document.getElementById("trColor").style.display = 'none';
            llamarNuevoestiloIcon("iconAgenda");
            llamarNuevoestilo("btnAgenda");
        }

    },
    afterShow: function () {
        // presenta la OT
        localStorage.setItem("ls_nuevacita", "ot");
    }
});

app.localization.registerView('agenda');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


function verifFecHoraAgenda(fAgenda) {

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

    //alert(new Date(fAgenda + ":00"));
    //alert(new Date(yyyy + "-" + mm + "-" + dd + " " + hhmm + ":00"));

    if (new Date(fAgenda + ":00") >= new Date(yyyy + "-" + mm + "-" + dd + " " + hhmm + ":00")) {
        respValAgenda = true;
    }

    return respValAgenda;
}


function usuariosAgencia() {
    // http://186.71.21.170:8077/taller/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3,1;;01;01

    //var UrlUsu = localStorage.getItem("ls_url2").toLocaleString() + "/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3," +
    //    localStorage.getItem("ls_idempresa").toLocaleString() + ";;" + localStorage.getItem("ls_ussucursal").toLocaleString() +
    //    ";" + localStorage.getItem("ls_usagencia").toLocaleString();

    var UrlUsu = localStorage.getItem("ls_url2").toLocaleString() + "/Services/tg/Parametros.svc/Combotg23ProfesionalesGet/3," +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";;" + localStorage.getItem("ls_ussucursal").toLocaleString() +
    ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";ASESORES_ENT|ASESORES";


    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", UrlUsu);

    var ageMsjusuariosAgencia = "";
    var cboUsu;

    $.ajax({
        url: UrlUsu,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                if (data.Combotg23ProfesionalesGetResult.includes("ASESORES_ENT") == true) {
                    validaProceAgenda = false;
                    ageMsjusuariosAgencia = data.Combotg23ProfesionalesGetResult.replace("0,", "");
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>" + ageMsjusuariosAgencia + "</center>");
                    return;
                }
                else {
                    validaProceAgenda = true;
                    cboUsu = JSON.parse(data.Combotg23ProfesionalesGetResult);
                }
                //   cboUsu = JSON.parse(data.Combotg23ProfesionalesGetResult);
            } catch (e) {
                kendo.ui.progress($("#agendaScreen"), false);
                //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agendaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
            return;
        }
    });


    if (ageMsjusuariosAgencia == "") {
        if (cboUsu.length > 0) {

            var cboUsuHTML = "<select id='cboUsuarioCita' class='w3-input w3-border' onchange='cargaAgenda(document.getElementById(\"datepicker\").value);'>";

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

            document.getElementById("divListaUsu").innerHTML = cboUsuHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Usuarios");
        }
    }
    else {
        document.getElementById("divListaUsu").innerHTML = "<select id='cboUsuarioCita' class='w3-input w3-border'>" +
        "<option  value='" + localStorage.getItem("ls_usulog").toLocaleString() + "'>" + localStorage.getItem("ls_usunom").toLocaleString() + "</option>";
        "</select>";
    }
}

/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: Presenta la agenda con las citas de la semana de la fecha seleccionada
Autor: RRP
--------------------------------------------------------------------*/

function cargaAgenda(rangoFec) {

    document.getElementById("contAgenda").innerHTML = "";

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("titCitaBusqFech").innerHTML = "Seleccione la fecha";
    }
    else {
        document.getElementById("titCitaBusqFech").innerHTML = "Seleccione";
    }

    kendo.ui.progress($("#agendaScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

        var diaHoy = rangoFec;
        var aF1 = rangoFec.split("-");
        // mm-dd-yyyy
        diaHoy = aF1[0] + "-" + aF1[1] + "-" + aF1[2];
        // dd-mm-yyyy
        rangoFec = aF1[1] + "-" + aF1[0] + "-" + aF1[2];

        // arrAgendaGrl = getEvents(rangoFec);
        arrAgendaGrl = getEvents(rangoFec, document.getElementById("cboUsuarioCita").value);

        document.getElementById("contAgenda").innerHTML = "<div class='mycal'></div>";

        if (arrAgendaGrl.length > 0) {
            $('.mycal').easycal({
                startDate: diaHoy,
                timeFormat: 'HH:mm',
                columnDateFormat: 'dddd, DD MMM',
                minTime: '07:00:00',
                maxTime: '18:15:00',
                slotDuration: 15,
                timeGranularity: 15,
                dayClick: function (el, startTime) {
                    confirmaCita("<center><i class=\"fa fa-calendar-plus-o\"></i> NUEVA CITA</center>", "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime);
                },
                eventClick: function (eventId) {
                    verCita(eventId);
                },
                events: arrAgendaGrl,
                //overlapColor: '#FF0',
                //overlapTextColor: '#000',
                overlapTitle: 'Multiple'
            });
        }
        else {
            $('.mycal').easycal({
                startDate: diaHoy,
                timeFormat: 'HH:mm',
                columnDateFormat: 'dddd, DD MMM',
                minTime: '07:00:00',
                maxTime: '18:15:00',
                slotDuration: 15,
                timeGranularity: 15,
                dayClick: function (el, startTime) {
                    confirmaCita("<center><i class=\"fa fa-calendar-plus-o\"></i> NUEVA CITA</center>", "Desea agendar una cita para el <br /><b>" + startTime + "</b>", startTime);
                },
                eventClick: function (eventId) {
                    verCita(eventId);
                },

                events: [],
                //overlapColor: '#FF0',
                //overlapTextColor: '#000',
                overlapTitle: 'Multiple'
            });
        }

        kendo.ui.progress($("#agendaScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: Citas de la semana de la fecha seleccionada
Autor: RRP
--------------------------------------------------------------------*/
function getEvents(rangoAg, usuLogin) {

    var diasSemana = 7;

    var date = moment(rangoAg);
    date.isoWeekday(diasSemana - 6);
    var sIni = date.format('DD-MM-YY');
    date.isoWeekday(diasSemana - 1);
    var sFin = date.format('DD-MM-YY');

    // http://186.71.21.170:8077/taller/Services/TL/Taller.svc/tl33CitasGet/1,json;1;01;01;jmera;;03-10-17;03-10-17;

    // Asigna el usuario seleccionado como usuario principal temporalmente
    localStorage.setItem("ls_usulog", usuLogin);
    localStorage.setItem("ls_usuCita", usuLogin);
    //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
    //      localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    //      localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    //      localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    //      localStorage.getItem("ls_usulog").toLocaleString() + ";;" +
    //      sIni + ";" + sFin + ";";

    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/1,json;" +
      localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
      localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
      localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
      localStorage.getItem("ls_usulog").toLocaleString() + ";;" +
      sIni + ";" + sFin + ";RECEPCION;;;";

   //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> RECEPCION</center>", Url);

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
                    kendo.ui.progress($("#agendaScreen"), false);
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

                        var tamLetra = "10";
                        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
                            nombreModelo = nombreModelo.slice(0, 9) + "...";
                            nombreCliente = nombreCliente.slice(0, 18) + "...";
                            tamLetra = "9";
                        }

                        agContenido = "<div style='font-size:" + tamLetra + "px'>" + agContenido + "<br />" + nombreModelo + "</div>";


                        if (infor[i].placa.trim() == "") {
                            // solo presenta 30 caracteres
                            nombreCliente = nombreCliente.substring(0, 30);

                            agContenido = "<b><div style='font-size:" + tamLetra + "px'>" + nombreCliente + "</div></b>";
                        }

                        // Reemplaza todas las "," por " "
                        agContenido = agContenido.replace(/,/g, "&nbsp;");

                        // VIP BANDERA
                        if (infor[i].persona_clase.trim() != "") {
                            agContenido = "<i class='fa fa-flag fa-lg' aria-hidden='true' style='color:#ff0000'></i> " + agContenido;
                        }

                        arrAgenda.push(
                        {
                            id: infor[i].chasis + " " + citaStart + " " + infor[i].estado,
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
                kendo.ui.progress($("#agendaScreen"), false);
                // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", e);
                //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agendaScreen"), false);
            //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
            return;
        }
    });

    return arrAgenda;

    //return [

    //	{
    //	    id: 'PCT7242',
    //	    title: '123456789',
    //	    start: '19-10-2017 07:00:00',
    //	    end: '19-10-2017 07:15:00',
    //	    backgroundColor: '#33cc33',
    //	    textColor: '#000'
    //	},
    //	{
    //	    id: 'E01',
    //	    title: 'Proactive Contact',
    //	    start: '20-10-2017 10:30:00',
    //	    end: '20-10-2017 11:15:00',
    //	    backgroundColor: '#443322',
    //	    textColor: '#FFF'n fechaActual
    //	},
    //];
}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: Fecha de hoy (dd-mm-yyyy)
Autor: RRP
--------------------------------------------------------------------*/
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
    return dd + "-" + mm + "-" + yyyy
}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: Carga la agenda con la fecha seleccionada
Autor: RRP
--------------------------------------------------------------------*/
function onChange() {
    cargaAgenda(document.getElementById("datepicker").value);
}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: Abre a pagina para crear una nueva cita
Autor: RRP
--------------------------------------------------------------------*/
function nuevaCita() {
    localStorage.setItem("ls_nuevacita", "cita");
    abrirPagina("lector_barras");
}


/*--------------------------------------------------------------------
Fecha: 20/10/2017
Detalle: 
- Presenta la ventana para crear una nueva cita
- Solo se pueden crear citas con fecha y hora mayor a las actuales
Autor: RRP
--------------------------------------------------------------------*/
function confirmaCita(titulo, contenido, startTime) {
    if (verifFecHoraAgenda(startTime) == true) {
        kendo.confirm("<center><h1><i class=\"fa fa-calendar-plus-o\"></i> NUEVA CITA</h1><br />" + contenido + "</center>")
               .done(function () {
                   localStorage.setItem("ls_nuevacita", "cita");
                   localStorage.setItem("ls_citafechahora", startTime);
                   localStorage.removeItem("ls_agendaplaca");
                   abrirPagina("admcita");
               })
               .fail(function () {
                   // Elimina el localstorage con la feha y hora de la cita
                   localStorage.removeItem("ls_citafechahora");
               });
               llamarColorBotonGeneral(".k-primary");
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
        } else if (parseInt(arrhm[1]) >= 45 ) {
            arrhm[1] = "45";
        }

        hhmm = arrhm[0] + ":" + arrhm[1];

        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se puede registrar una cita<br />antes del <b>" + yyyy + "-" + mm + "-" + dd + " " + hhmm + "</b></center>");
    }
    dialog.data("kendoDialog").close();
}

/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: Mensaje para Modificar y Eliminar Cita / Generar OT
Autor: RRP
--------------------------------------------------------------------*/
function verCita(valorCita) {

    var window = $("#dialog");
    if (window.data("kendoDialog")) {
        dialog.data("kendoDialog").close();
    }

    var agendaVariables = valorCita.split(/\b(\s)/);

    var arrFecha;
    var arrHora;
    var fechahoraCompleta;

    // alert(inspeccionar(agendaVariables));

    if (agendaVariables.length > 5) {
        //arrFecha = agendaVariables[0].trim().split("-");
        //arrHora = agendaVariables[2].split(":");
        arrFecha = agendaVariables[2].trim().split("-");
        arrHora = agendaVariables[4].split(":");
        fechahoraCompleta = arrFecha[1] + "-" + arrFecha[0] + "-" + arrFecha[2] + " " + arrHora[0] + ":" + arrHora[1];
        localStorage.setItem("ls_nuevacita", "ot");
        localStorage.setItem("ls_agendaplaca", agendaVariables[0].trim());
        localStorage.setItem("ls_citafechahora", fechahoraCompleta);

    }
    else {
        arrFecha = agendaVariables[0].trim().split("-");
        arrHora = agendaVariables[2].split(":");
        fechahoraCompleta = arrFecha[1] + "-" + arrFecha[0] + "-" + arrFecha[2] + " " + arrHora[0] + ":" + arrHora[1];
        localStorage.setItem("ls_nuevacita", "ot");
        localStorage.setItem("ls_agendaplaca", "n/e");
        localStorage.setItem("ls_citafechahora", fechahoraCompleta);
    }

    // ESTADO CITA: ultima posicion del arreglo
    var citaEstado1 = agendaVariables[(agendaVariables.length) - 1].trim();

    var estConfir = "";

    // Combo cambia estado Cita
    //  var arrEsCt = ["CONFIRMADO", "CANCELADO", "ABIERTO"];
    var cboEstadosCitas = "";
    for (var c1 = 0; c1 < arrEsCt.length; c1++) {
        if (c1 == 0) {
            cboEstadosCitas += "<tr style='height:40px'><td><label class='w3-text-red'><b>Estado</b></label></td><td>&nbsp;</td><td>" +
                "<select id='cboEstCita' class='w3-input w3-border textos'  onchange = 'cambiaEstado(this.value);'>";
        }

        if (arrEsCt[c1] == citaEstado1) {
            cboEstadosCitas += "<option value='" + (c1 + 1) + "' selected>" + arrEsCt[c1] + "</option>";
            estConfir = arrEsCt[c1];
        }
        else {
            cboEstadosCitas += "<option value='" + (c1 + 1) + "'>" + arrEsCt[c1] + "</option>";
        }

        if (c1 == arrEsCt.length - 1) {
            cboEstadosCitas += "</select></td></tr>";
        }
    }

 //   alert(estConfir);

    var verCitaOT = "";

    // Solo los q tienen chasis pueden generar OT
    if (agendaVariables[0].trim() != "0000000001CM01901" && agendaVariables[0].trim().length >= 17) {
        verCitaOT = "<table cellspacing='10' align='center'>" +
    "<tr style='height:40px'><td><label class='w3-text-red'><b>Fecha</b></label></td><td>&nbsp;</td><td>" + fechahoraCompleta + verCitaOT + "</td></tr>" +
    cboEstadosCitas +
    "<tr style='height:40px'><td><label class='w3-text-red'><b>Placa o VIN</b></label></td><td>&nbsp;</td><td><input class='w3-input textos' id='agen_infoPlacasVIN' name='agen_infoPlacasVIN' type='text' placeholder='Placa o VIN' value='" + localStorage.getItem("ls_agendaplaca").toLocaleString() + "' readonly></td></tr>" +
    "</table>";
    
        if (estConfir == "CONFIRMADO") {
            verCitaOT += "<center><font style=\"font-size:18px\"><button onclick='onOtCita(document.getElementById(\"agen_infoPlacasVIN\").value);' class=\"w3-button w3-section w3-white w3-border w3-border-red w3-text-red\"><i class=\"fa fa-car\" aria-hidden=\"true\"></i> GENERAR OT</button></font></center>";
        }
    }
    else {
        verCitaOT = "<table cellspacing='10' align='center'>" +
            "<tr style='height:40px'><td><label class='w3-text-red'><b>Fecha</b></label></td><td>&nbsp;</td><td>" + fechahoraCompleta + verCitaOT + "</td></tr>" +
            cboEstadosCitas +
            "<tr style='height:40px'><td><label class='w3-text-red'><b>Placa o VIN</b></label></td><td>&nbsp;</td><td><input class='w3-input w3-border textos2' id='agen_infoPlacasVIN' name='agen_infoPlacasVIN' type='text' placeholder='Placa o VIN' style='text-transform:uppercase; max-width:150px;background-color:#ffffff' ></td></tr>" +
            "</table>";

        if (estConfir == "CONFIRMADO") {
            verCitaOT += "<center><font style=\"font-size:18px\"><button onclick='onOtCita(document.getElementById(\"agen_infoPlacasVIN\").value);' class=\"w3-button w3-section w3-white w3-border w3-border-red w3-text-red\"><i class=\"fa fa-car\" aria-hidden=\"true\"></i> GENERAR OT</button></font></center>";
        }
    }

    // Tablet
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        dialog = $("#dialog").kendoDialog({
            width: "367px",
            buttonLayout: "normal",
            title: "<center><i class=\"fa fa-calendar-check-o\"></i> CITA REGISTRADA</center>",
            closable: false,
            modal: false,
            content: verCitaOT,
            actions: [
                { text: '<font style=\"font-size:12px\"> <button id="btnAgendaC0"  class=\"w3-btn \"><i id="iconAgenB0" class=\"fa fa-pencil\" aria-hidden=\"true\"></i> MODIFICAR</button></font>', action: onModifCita },
                { text: '<font style=\"font-size:12px\"><button id="btnAgendaC1"  class=\"w3-btn \"><i id="iconAgenB1" class=\"fa fa-trash\" aria-hidden=\"true\"></i> ELIMINAR</button></font>', action: onElimCita },
                { text: '<font style=\"font-size:12px\"><button id="btnAgendaC2"  class=\"w3-btn \"> CANCELAR</button></font>', primary: true }
            ]
        });
    }
    else { // cel
        dialog = $("#dialog").kendoDialog({
            width: "280px",
            buttonLayout: "normal",
            title: "<center><i class=\"fa fa-calendar-check-o\"></i> CITA REGISTRADA</center>",
            closable: false,
            modal: false,
            content: verCitaOT,
            actions: [
                { text: '<font style=\"font-size:12px\"> <button id="btnAgendaC0"  class=\"w3-btn \">&nbsp;&nbsp;<i id="iconAgenB0" class=\"fa fa-pencil\" aria-hidden=\"true\"></i>&nbsp;&nbsp;</button></font>', action: onModifCita },
                { text: '<font style=\"font-size:12px\"><button id="btnAgendaC1"  class=\"w3-btn \">&nbsp;&nbsp;<i id="iconAgenB1" class=\"fa fa-trash\" aria-hidden=\"true\"></i>&nbsp;&nbsp;</button></font>', action: onElimCita },
                { text: '<font style=\"font-size:12px\"><button id="btnAgendaC2"  class=\"w3-btn \">CANCELAR</button></font>', primary: true }
            ]
        });
    }
    llamarNuevoestilo("btnAgendaC0");
    llamarNuevoestiloIconB("iconAgenB0");
    dialog.data("kendoDialog").open();
    
}

/*--------------------------------------------------------------------
Fecha: 26/12/2017
Detalle: Confirm para cambiar el estado de la cita
Autor: RRP
--------------------------------------------------------------------*/
function cambiaEstado(intEstado) {
    var window = $("#dialog");
    if (window.data("kendoDialog")) {
        dialog.data("kendoDialog").close();
    }

    var NomEstado;
    for (var c1 = 0; c1 < arrEsCt.length; c1++) {
        if (intEstado == c1 + 1) {
            NomEstado = arrEsCt[c1];
            break;
        }
    }

    kendo.confirm("<center><h1><i class=\"fa fa-calendar-o\"></i> CAMBIAR ESTADO</h1><br />Desea cambiar el estado de<br />la cita a <b>" + NomEstado + "</b> ?</center>")
       .done(function () {

           //   localStorage.setItem("ls_nuevacita", "cita");
           // localStorage.getItem("ls_citafechahora").toLocaleString();
           //  localStorage.removeItem("ls_agendaplaca");

           var arrCitaFH = localStorage.getItem("ls_citafechahora").toLocaleString().split(/\b(\s)/);
           var hCita = arrCitaFH[2].replace(":", ".").trim();

           var arrCitaOk = arrCitaFH[0].trim().split("-");

           //var UrlEstadoC = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/4,json;" +
           // localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
           // localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
           // localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
           // localStorage.getItem("ls_usulog").toLocaleString() + ";;;;RECEPCION;" +
           // arrCitaOk[1] + "-" + arrCitaOk[0] + "-" + arrCitaOk[2] + ";" +
           // hCita + ";" + intEstado;

           var UrlEstadoC = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/4,json;" +
             localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
             localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
             localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
             document.getElementById("cboUsuarioCita").value + ";;;;RECEPCION;" +
             arrCitaOk[1] + "-" + arrCitaOk[0] + "-" + arrCitaOk[2] + ";" +
             hCita + ";" + intEstado;

           //  myalert("PRU", UrlEstadoC);


           kendo.ui.progress($("#agendaScreen"), true);
           setTimeout(function () {
               // precarga *********************************************************************************************

           var infor;
           $.ajax({
               url: UrlEstadoC,
               type: "GET",
               async: false,
               dataType: "json",
               success: function (data) {
                   try {
                       if (inspeccionar(data).includes("Succes") == true) {
                           cargaAgenda(document.getElementById("datepicker").value);
                           myalert("<center><i class=\"fa fa-check-circle-o\"></i> ESTADO CITA</center>", "El Estado de la cita ha cambiado correctamente");
                       }
                       else {
                           kendo.ui.progress($("#agendaScreen"), false);
                           myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido cambiar el Estado de la Cita<br />" + inspeccionar(data) + "</center>");
                           return;
                       }

                   } catch (e) {
                       kendo.ui.progress($("#agendaScreen"), false);
                       myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante el proceso.<br />" + e + "</center>");
                       return;
                   }
               },
               error: function (err) {
                   kendo.ui.progress($("#agendaScreen"), false);
                   myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante el proceso.<br />" + inspeccionar(err) + "</center>");
                   return;
               }
           });

               kendo.ui.progress($("#agendaScreen"), false);
               // precarga *********************************************************************************************
           }, 2000);

       })
       .fail(function () {
           kendo.ui.progress($("#agendaScreen"), false);
           // Elimina el localstorage con la feha y hora de la cita
           // localStorage.removeItem("ls_citafechahora");
           return;
       });
       llamarColorBotonGeneral(".k-primary");
}

/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: ir a Modificar Cita
Autor: RRP
--------------------------------------------------------------------*/
function onModifCita(e) {
    abrirPagina("admcita");
}

/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: ir a Generar OT
Autor: RRP
--------------------------------------------------------------------*/
function onOtCita(vinIngresado) {
    if (vinIngresado.trim() != "") {
        if (vinIngresado.length > 8) {
            localStorage.setItem("ls_viningresado", vinIngresado + ",C");
        }
        else {
            localStorage.setItem("ls_viningresado", vinIngresado + ",P");
        }
    }
    else {
        if (localStorage.getItem("ls_viningresado") != undefined) {
            localStorage.removeItem("ls_viningresado");
        }
    }
    dialog.data("kendoDialog").close();
    abrirPagina("lector_barras");
}


/*--------------------------------------------------------------------
Fecha: 23/11/2017
Detalle: Elimina cita
Autor: RRP
--------------------------------------------------------------------*/
function onElimCita(e) {
    kendo.confirm("<center><h1><i class=\"fa fa-calendar-minus-o\"></i> ELIMINAR CITA</h1><br />Desea Eliminar el Registro ?</center>")
           .done(function () {
               localStorage.setItem("ls_nuevacita", "cita");
               localStorage.getItem("ls_citafechahora").toLocaleString();
               localStorage.removeItem("ls_agendaplaca");

               var arrCitaFH = localStorage.getItem("ls_citafechahora").toLocaleString().split(/\b(\s)/);
               var hCita = arrCitaFH[2].replace(":", ".").trim();

               var arrCitaOk = arrCitaFH[0].trim().split("-");

               var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl33CitasGet/3,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
                localStorage.getItem("ls_usulog").toLocaleString() + ";;;;RECEPCION;" +
                arrCitaOk[1] + "-" + arrCitaOk[0] + "-" + arrCitaOk[2] + ";" +
                hCita + ";";

              // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);


               //kendo.ui.progress($("#agendaScreen"), true);
               //setTimeout(function () {
                   // precarga *********************************************************************************************

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
                               window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> ELIMINADO</center>", "La cita fue eliminada correctamente");
                               //  localStorage.setItem("ls_citafechahoraresp", arrfhCita[0]);
                               cargaAgenda(document.getElementById("datepicker").value);
                           }
                           else {
                               var arrEstado = inspeccionar(data).split(/\b(\s)/);
                               var arrEstado2 = arrEstado[4].split(",");
                               var miEst = arrEstado2[1].replace("Estado:", "");

                               if (inspeccionar(data).includes("ABIERTO") == false) { //(inspeccionar(data).includes("CONFIRMADO") == true) {
                                   kendo.ui.progress($("#agendaScreen"), false);
                                   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido eliminar la Cita<br />Estado: <b>" + miEst + "</b></center>");
                               }
                               else {
                                   kendo.ui.progress($("#agendaScreen"), false);
                                   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No se ha podido eliminar la Cita<br />" + inspeccionar(data) + "</center>");
                               }
                               return;
                           }
                       } catch (e) {
                           kendo.ui.progress($("#agendaScreen"), false);
                           window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante el proceso.<br />" + e + "</center>");
                           return;
                       }
                   },
                   error: function (err) {
                       kendo.ui.progress($("#agendaScreen"), false);
                       window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante el proceso.<br />" + inspeccionar(err) + "</center>");
                       return;
                   }
               });

               //    kendo.ui.progress($("#agendaScreen"), false);
               //    // precarga *********************************************************************************************
               //}, 2000);

           })
           .fail(function () {
               //kendo.ui.progress($("#agendaScreen"), false);
               // Elimina el localstorage con la feha y hora de la cita
               localStorage.removeItem("ls_citafechahora");
               return;
           });
           llamarColorBotonGeneral(".k-primary");
}


function sincronizaCloud(rangoCloud) {

    // Sincroniza Cloud
    // http://localhost:4044/Services/tl/Taller.svc/ObtenerCitasPorFechaAekia/4,01;01;01;15-12-17;15-12-17

    //   http://186.71.68.154:8089/concesionario/Services/TL/Taller.svc/ObtenerCitasPorFechaAekia/4,1;02;02;22-01-18;27-01-18

    var aF2 = rangoCloud.split("-");
    // dd-mm-yyyy
    rangoCloud = aF2[1] + "-" + aF2[0] + "-" + aF2[2];

    var diasSemana = 7;

    var date = moment(rangoCloud);
    date.isoWeekday(diasSemana - 6);
    var sincIni = date.format('DD-MM-YY');
    date.isoWeekday(diasSemana - 1);
    var sincFin = date.format('DD-MM-YY');

    var UrlCitaCloud = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/ObtenerCitasPorFechaAekia/4," +
    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
    localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
    sincIni + ";" + sincFin + ";" + localStorage.getItem("ls_usulog").toLocaleString();

//    var UrlCitaCloud = "http://localhost:4044/Services/TL/Taller.svc/ObtenerCitasPorFechaAekia/4," +
//localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
//localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
//localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
//sincIni + ";" + sincFin + ";" + localStorage.getItem("ls_usulog").toLocaleString();

  //  myalert("<center><i class=\"fa fa-check-circle-o\"></i>UrlCitaCloud</center>", UrlCitaCloud);


    kendo.ui.progress($("#agendaScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

       // ObtenerCitasPorFechaAekiaResult	"No existe datos a sincronizar"

    $.ajax({
        url: UrlCitaCloud,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {              
                kendo.ui.progress($("#agendaScreen"), true);

             //   alert(inspeccionar(data));

                var anexos = "";

                if (inspeccionar(data).includes("0,No Succes") == true) {

                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                    var descError = inspeccionar(data).replace("string ObtenerCitasPorFechaAekiaResult :", "");
                    kendo.ui.progress($("#agendaScreen"), false);

                    if (inspeccionar(data).includes("-1,Error al leer XML") == true) {
                        descError = "La fecha m&#225;xima para la sincronizaci&#243;n es <b>" + rangoCloud + "</b><br /> Seleccione una fecha menor a la de hoy";
                    }

                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + descError + "</center>");
                    return;

                    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                    //var descError = inspeccionar(data).replace("string ObtenerCitasPorFechaAekiaResult :", "");
                    //kendo.ui.progress($("#agendaScreen"), false);
                    //myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + descError + "</center>");
                    //return;
                }
                else {

                    if (inspeccionar(data).includes("Succes") == true) {

                        var respSincron = inspeccionar(data);

                        if (respSincron.includes("1,Success;") == true) {
                            var arrSincron = respSincron.split(";");
                            //anexos = "<br />";

                            if (arrSincron[1].includes("|") == true) {
                                var arrAnexo = arrSincron[1].split("|")
                                for (var i = 0; i < arrAnexo.length; i++) {
                                    anexos += "<br />" + arrAnexo[i];
                                }
                            }
                        }
                        myalert("<center><i class=\"fa fa-check-circle-o\"></i> SINCRONIZADO</center>", "La Sincronizaci&#243;n se ha realizado correctamente" + anexos);

                        //   kendo.ui.progress($("#agendaScreen"), true);
                        // myalert("<center><i class=\"fa fa-check-circle-o\"></i> SINCRONIZADO</center>", "La Sincronizaci&#243;n se ha realizado correctamente");
                        cargaAgenda(document.getElementById('datepicker').value);
                    }
                    else {
                        kendo.ui.progress($("#agendaScreen"), false);
                        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + inspeccionar(data) + "</center>");
                        return;
                    }
                }
            } catch (e) {
                kendo.ui.progress($("#agendaScreen"), false);
                myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + e + "</center>");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#agendaScreen"), false);
            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + inspeccionar(err) + "</center>");
            return;
        }
    });

        kendo.ui.progress($("#agendaScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);
}



function sincronizaCloud_2()
{
    // Sincronizacion
    try {
        var dialogSincro = $("#dialogSincro");
        if (dialogSincro.data("kendoDialog")) {
            dialog.data("kendoDialog").close();
        }
    }
    catch (e) { }

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

    var htmlTitSincro = "<i class='fa fa-cloud-download' aria-hidden='true'></i> SELECCIONE LAS FECHAS";

    var htmlSincro = "<p>Las fechas no pueden ser mayores a la fecha de hoy</p>" +
                    "<table align='center' border='0' cellspacing='0' cellpadding='0'>" +
                        "<tr>" +
                        "    <td >" +
                        "        <p>" +
                        "            <label class='w3-text-red'><b>Inicio</b></label>" +
                        "            </p><p>" +
                        "            <input id='dpInicioSin' value='" + dd + '-' + mm + '-' + yyyy + "' style='max-width:120px' />" +
                        "        </p>" +
                        "    </td>" +
                        "    <td >" +
                        "        <p>" +
                        "            <label class='w3-text-red'><b>Fin</b></label>" +
                        "        </p><p>" +
                        "            <input id='dpFinSin' value='" + dd + '-' + mm + '-' + yyyy + "' style='max-width:120px' />" +
                        "        </p>" +
                        "    </td>" +
                        "</tr>" +
                        "</table>"+
                        " <script>"+
                        "$(\"#dpInicioSin\").kendoDatePicker({ format: \"dd-MM-yyyy\", });"+
                        "$(\"#dpFinSin\").kendoDatePicker({ format: \"dd-MM-yyyy\", });"+
                        " </script>"

   dialogSincro = $("#dialogSincro").kendoDialog({
        width: "350px",
        buttonLayout: "normal",
        title: htmlTitSincro,
        closable: false,
        modal: false,
        content: htmlSincro,
        actions: [
            { text: '<font style=\"font-size:12px\"> <button  class=\"w3-btn w3-red\"> &nbsp;&nbsp;ACEPTAR&nbsp;&nbsp;</button></font>', action: accSincroniza },
            { text: '<font style=\"font-size:12px\"><button  class=\"w3-btn w3-red\"> CANCELAR</button></font>', primary: true }
        ]
   });

   dialogSincro.data("kendoDialog").open();
}


function accSincroniza()
{
    var sincIni = document.getElementById("dpInicioSin").value;
    var sincFin = document.getElementById("dpFinSin").value;

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

    var arrFinSinc = sincFin.split("-");
    var fechaFinSinc = new Date(arrFinSinc[1] + "-" + arrFinSinc[0] + "-" + arrFinSinc[2]);
    var fechaHoySinc = new Date(mm + "-" + dd + "-" + yyyy);

    if (fechaFinSinc > fechaHoySinc) {
        kendo.ui.progress($("#admOtScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha Final no puede ser mayor a la de Hoy");
        return;
    }
    else {
        if (validaFechaSinc(sincIni, sincFin) == false) {
            kendo.ui.progress($("#admOtScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
            return;
        }
        else {
            var UrlCitaCloud = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/ObtenerCitasPorFechaAekia/4," +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
            sincIni + ";" + sincFin + ";" + localStorage.getItem("ls_usulog").toLocaleString();
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCitaCloud);
                /* var UrlCitaCloud = "http://localhost:4044/Services/TL/Taller.svc/ObtenerCitasPorFechaAekia/4," +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() + ";" +
            sincIni + ";" + sincFin + ";" + localStorage.getItem("ls_usulog").toLocaleString(); */

            //myalert("<center><i class=\"fa fa-check-circle-o\"></i>UrlCitaCloud</center>", UrlCitaCloud);

            kendo.ui.progress($("#agendaScreen"), true);
            setTimeout(function () {
                // precarga *********************************************************************************************

                // ObtenerCitasPorFechaAekiaResult	"No existe datos a sincronizar"

                $.ajax({
                    url: UrlCitaCloud,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        try {
                            kendo.ui.progress($("#agendaScreen"), true);

                               //alert(inspeccionar(data));

                            var anexos = "";

                            if (inspeccionar(data).includes("0,No Succes") == true) {

                                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                                var descError = inspeccionar(data).replace("string ObtenerCitasPorFechaAekiaResult :", "");
                                kendo.ui.progress($("#agendaScreen"), false);

                                if (inspeccionar(data).includes("-1,Error al leer XML") == true) {
                                    descError = "La fecha m&#225;xima para la sincronizaci&#243;n es <b>" + rangoCloud + "</b><br /> Seleccione una fecha menor a la de hoy";
                                }

                                myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 1ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + descError + "</center>");
                                return;

                                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                                //var descError = inspeccionar(data).replace("string ObtenerCitasPorFechaAekiaResult :", "");
                                //kendo.ui.progress($("#agendaScreen"), false);
                                //myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + descError + "</center>");
                                //return;
                            }
                            else {
                                if (inspeccionar(data).includes("Succes") == true) {

                                    var respSincron = inspeccionar(data);

                                    if (respSincron.includes("1,Success;") == true) {
                                        var arrSincron = respSincron.split(";");
                                        //anexos = "<br />";

                                        if (arrSincron[1].includes("|") == true) {
                                            var arrAnexo = arrSincron[1].split("|")
                                            for (var i = 0; i < arrAnexo.length; i++) {
                                                anexos += "<br />" + arrAnexo[i];
                                            }
                                        }
                                    }
                                    myalert("<center><i class=\"fa fa-check-circle-o\"></i> SINCRONIZADO</center>", "La Sincronizaci&#243;n se ha realizado correctamente" + anexos);

                                    //   kendo.ui.progress($("#agendaScreen"), true);
                                    // myalert("<center><i class=\"fa fa-check-circle-o\"></i> SINCRONIZADO</center>", "La Sincronizaci&#243;n se ha realizado correctamente");
                                    cargaAgenda(document.getElementById('datepicker').value);
                                }
                                else {
                                    kendo.ui.progress($("#agendaScreen"), false);
                                    myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + inspeccionar(data) + "</center>");
                                    return;
                                }
                            }
                        } catch (e) {
                            kendo.ui.progress($("#agendaScreen"), false);
                            myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>3 ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + e + "</center>");
                            return;
                        }
                    },
                    error: function (err) {
                        kendo.ui.progress($("#agendaScreen"), false);
                        myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>4 ERROR</center>", "<center>Error durante la Sincronizaci&#243;n<br />" + inspeccionar(err) + "</center>");
                        return;
                    }
                });

                kendo.ui.progress($("#agendaScreen"), false);
                // precarga *********************************************************************************************
            }, 2000);
        }
    }

}


function validaFechaSinc(fInicio, fFinal) {

    var respValFechas = false;

    var arrIni = fInicio.split("-");
    var arrFin = fFinal.split("-");
    var first = arrIni[2] + "-" + arrIni[1] + "-" + arrIni[0];   // '2018-01-14';
    var second = arrFin[2] + "-" + arrFin[1] + "-" + arrFin[0];  //'2018-01-13';

    if (new Date(first) <= new Date(second)) {
        respValFechas = true;
    }

    return respValFechas;
}

// END_CUSTOM_CODE_home