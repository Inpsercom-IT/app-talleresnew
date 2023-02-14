/*=======================================================================n usuPrincipal
Fecha: 24/11/2017
=======================================================================
Detalles: 
- Informacion del usuario / sucursar / agencia
- Presenta el Menu principal
- Presenta el combo de agencia
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';
var banderaCC = 0;
var banderaCCL = 0;
app.home = kendo.observable({
    onShow: function () {
        
        //------------------------------------------------------
        // variable sesion carga VERFORM desde GRID AGENDA EV
        if (localStorage.getItem("ls_urlSesEnt") != undefined) {
            localStorage.removeItem("ls_urlSesEnt");
        }


        // Variable adm OT
        if (localStorage.getItem("ls_otdet2") != undefined) {
            localStorage.removeItem("ls_otdet2");
        }

        localStorage.removeItem("dataItem");
        //------------------------------------------------------

        usuPrincipal();
        cierraControlGral();
        ConsultarParametroCitas();
        if (localStorage.getItem("ls_vercboagen") != undefined) {
            homeInfo();
        }
        else {
            infoMenuUsu();
        }
    },
    afterShow: function () { }
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home RRP
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Carga el cbo de agencias por empresa y usu.
Parametros:
--------------------------------------------------------------------*/
function homeInfo() {

    // presenta la OT
    localStorage.setItem("ls_nuevacita", "ot");

    // Nombre de empresa en pagina Incio
    document.getElementById("usuEmpresa2").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();
    // Recupera las Agencias por Empresa y Usuario
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/EmpAgUsuario/" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_usulog").toLocaleString()


 //var Url = "http://localhost:4044" + "/Services/AU/Seguridad.svc/EmpAgUsuario/" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_usulog").toLocaleString()

 //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
//alert(Url);
    var accResp = "";

    $.ajax({
        url: Url,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                accResp = JSON.parse(data.EmpAgUsuarioResult);

            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Datos Incorrectos");
            return;
        }
    });


    // alert(localStorage.getItem("ls_usagencia").toLocaleString());
    //alert(inspeccionar(accResp));
    // Crea el combo de Agencias con la data anterior 
    if (accResp.length > 0) {
        var cboAgenciaHTML = "<p><label id='usuEmpresa0' class='w3-text-red'><b>Sucursal / Agencia</b></label><select id='cboAgenciasUS' class='w3-input w3-border textos select-style'>";

        cboAgenciaHTML += "<option value='0'>Seleccione</option>";

        for (var i = 0; i < accResp.length; i++) {
            cboAgenciaHTML += "<option  value='" + accResp[i].CodigoSucursal + "," + accResp[i].CodigoAgencia + "," + accResp[i].DireccionSucursal + "'>" + accResp[i].NombreAgencia + "</option>";
        }
        cboAgenciaHTML += "</select> </p><button id='btnAgencia5' class='w3-button w3-block w3-section  w3-ripple w3-padding' onclick='agenciaActiva();'>ASIGNAR</button>";
        document.getElementById("cboAgenciaUsu").innerHTML = cboAgenciaHTML;
        verMenu("0");
        llamarNuevoestiloIcon("usuEmpresa");
        llamarNuevoestilo("btnAgencia");
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "El usuario no tiene agencias asignadas");
        //cerrarSistema();
    }
}

/*--------------------------------------------------------------------
Fecha: 27/09/2017
Descripcion: Presenta el Usuario, Empresa, Agencia
Parametros:
--------------------------------------------------------------------*/
function agenciaActiva() {
    if (document.getElementById("cboAgenciasUS").value != 0) {
        localStorage.setItem("ls_usagencia", document.getElementById("cboAgenciasUS").value);
        var arrSucAgen = document.getElementById("cboAgenciasUS").value.split(",");

        if (arrSucAgen.length > 0) {
            localStorage.setItem("ls_ussucursal", arrSucAgen[0]);
            localStorage.setItem("ls_usagencia", arrSucAgen[1]);
            localStorage.setItem("ls_usdiragencia", arrSucAgen[2]);
        }

        localStorage.removeItem("ls_vercboagen");
        localStorage.setItem("ls_usagencianom", document.getElementById("cboAgenciasUS").options[document.getElementById("cboAgenciasUS").selectedIndex].innerHTML);

        infoMenuUsu();
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Seleccione la Agencia");
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 24/11/2017
Descripcion: Presenta la informacion us/emp/agen para el menu principal y el menu auxiliar
Parametros:
--------------------------------------------------------------------*/
function infoMenuUsu() {
    // Presenta el menu segun la pantalla
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("divItemMenuPrinc").style.fontSize = "14px";
    }
    else {
        document.getElementById("divItemMenuPrinc").style.fontSize = "10px";
    }

    var infoUsuEmpAg = "<font color='black' style='font-size: 10px'>USUARIO:&nbsp; " + localStorage.getItem("ls_usunom").toLocaleString() + '</font> <br />' +
            "<font color='black' style='font-size: 10px'>EMPRESA:&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + '</font> <br />' +
          "<font color='black' style='font-size: 10px'>AGENCIA:&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString() + "</font>";

    // Nombre del usuario en el Menu Principal
    var infoUsuHtml = "<font color='white'><i class='fa fa-user-circle' aria-hidden='true'></i>&nbsp;&nbsp;</font>" +
        localStorage.getItem("ls_usunom").toLocaleString() + ' <br />' +
      "<font color='white'>EMPRESA:</font>&nbsp; " + localStorage.getItem("ls_empresa").toLocaleString() + ' <br />' +
      "<font color='white'>AGENCIA:</font>&nbsp; " + localStorage.getItem("ls_usagencianom").toLocaleString();

    document.getElementById("iniUsuario").innerHTML = infoUsuHtml;


    //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {


    //    document.getElementById("iniUsuarioMenu").innerHTML = "<table align='center'> " +
    //    "<tr><td><h1><font color='#F44336'><b>USUARIO:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_usunom").toLocaleString() + '</b></h1></td></tr>' +
    //    "<tr><td><h1><font color='#F44336'><b>EMPRESA:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_empresa").toLocaleString() + '</b></h1></td></tr>' +
    //    "<tr><td><h1><font color='#F44336'><b>AGENCIA:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_usagencianom").toLocaleString() + "</b></h1></td></tr>" +
    //     " </table>";
    //}
    //else {



    //    document.getElementById("iniUsuarioMenu").innerHTML = "<table align='center'> " +
    //    "<tr><td><font color='#F44336'><b>USUARIO:</b></font></h2></td><td>&nbsp;</td><td><h2><b>" + localStorage.getItem("ls_usunom").toLocaleString() + '</b></td></tr>' +
    //    "<tr><td><font color='#F44336'><b>EMPRESA:</b></font></h2></td><td>&nbsp;</td><td><h2><b>" + localStorage.getItem("ls_empresa").toLocaleString() + '</b></td></tr>' +
    //    "<tr><td><font color='#F44336'><b>AGENCIA:</b></font></h2></td><td>&nbsp;</td><td><h2><b>" + localStorage.getItem("ls_usagencianom").toLocaleString() + "</b></td></tr>" +
    //    " </table>";
    //}

    verMenu("1");
}
function ConsultarParametroCitas() {
    try {
        var accResp = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/6,;TG;APP_ENTREGAS;;URL_CITA_TALLER";
        var respPar;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = JSON.parse(data.ParametroEmpGetResult).tmpParamEmp;
                    for (let index = 0; index < accResp.length; index++) {
                        if (accResp[index].elemento == "URL_CITA_TALLER") {
                            UrlCitasTaller = accResp[index].descrip2;
                        }
                        if (accResp[index].elemento == "URL_FACTURA_SGC") {
                            UrlFacturaSGC = accResp[index].descrip2;
                        }
                        if (accResp[index].elemento == "URL_GARANTIA_SQL") {
                            UrlGarantiaSql = accResp[index].descrip2;
                        }           
                    }
                    
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

function verMenu(vista) {

    if (vista == "0") {
        document.getElementById("menuCboAgencia").style.display = "block";
        document.getElementById("menuPagInicio").style.display = "none";

        localStorage.setItem("ls_vercboagen", "1");
    }
    else {
        document.getElementById("menuCboAgencia").style.display = "none";
        document.getElementById("menuPagInicio").style.display = "block";
        menuxNivel();
    }
}


function menuxNivel() {
    var arrItem = ["Calendario de Citas", 
    "Recepci&oacute;n Veh&iacute;culo", 
    "Ordenes de Trabajo", 
    "Registrar VIN",   
    "Seguimiento Veh&iacute;culos Nuevos",
    "Agenda Entrega", 
    "Consulta facturas SGC",
    "Entrega Veh&#237;culos Nuevos", 
    "Control de Calidad",
    "Cambiar Agencia", 
    "Codigo Temporal App Kia",
    /* "Avaluo vehículo seminuevo", */   
    "Cerrar"];
    
      var arrIco = ["fa-calendar", 
      "fa-car", 
      "fa-wrench", 
      "fa-list-alt", 	
      "fa-forward", 
      "fa-calendar-check-o", 
      "fa-id-card-o",
      "fa-taxi", 
      "fa-file-text-o", 
      "fa-caret-square-o-down",
      "fa-file-text-o", 
      /* "fa fa-file-text-o", */	
      "fa-sign-out"];
      
      var arrLink = ["agenda", 
      "abrirPagina2(\"lector_barras\");", 
      "admOt", 
      "vin", 	
      "vista", 
      "agencia",
      "facturasgc", 
      "nuevoveh", 
      "controlCalidad",
      "verMenu(\"0\")",
      "codigoappkia",
      /* "abrirPagina2(\"certificacion_vehiculo\");", */	 
      "cerrarSistema();"];
 
    var item = "";
    var tamLetHome = "18px";
    //alert(parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()));
    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("divItemMenuPrinc").innerHTML = "<table align='center'> " +
        "<tr><td id = 'icnMenuPrincipal0'><h3><b>USUARIO:</b></font></h3></td><td>&nbsp;</td><td><h3><b>" + localStorage.getItem("ls_usunom").toLocaleString() + '</b></h3></td></tr>' +
        "<tr><td id = 'icnMenuPrincipal1'><h3><b>EMPRESA:</b></font></h3></td><td>&nbsp;</td><td><h3><b>" + localStorage.getItem("ls_empresa").toLocaleString() + '</b></h3></td></tr>' +
        "<tr><td id = 'icnMenuPrincipal2'><h3><b>AGENCIA:</b></font></h3></td><td>&nbsp;</td><td><h3><b>" + localStorage.getItem("ls_usagencianom").toLocaleString() + "</b></h3></td></tr>" +
         " </table>";
    }
    else {
        tamLetHome = "14px";
        document.getElementById("divItemMenuPrinc").innerHTML = "<table align='center'><tr> <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>" +
        "<tr><td id = 'icnMenuPrincipal0'><h1><b>USUARIO:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_usunom").toLocaleString() + "</b>" +
         "&nbsp;&nbsp;<a id='mostrar4' data-align='right' class='fa fa-angle-double-down' aria-hidden='true' data-role='button'></a>" +
        "<a id='ocultar4' data-align='right' class='fa fa-angle-double-up' aria-hidden='true' data-role='button' style='display:none'></a>" +
        "</h1></td></tr>" +
        " </table>" +
         "<div id='divControlesHome' style='display:initial' class='target4'>" + // mas controles    
        "<table align='center'> " +
        "<tr><td id = 'icnMenuPrincipal1'><h1><b>EMPRESA:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_empresa").toLocaleString() + "</b></h1></td></tr>" +
        "<tr><td id = 'icnMenuPrincipal2'><h1><b>AGENCIA:</b></font></h1></td><td>&nbsp;</td><td><h1><b>" + localStorage.getItem("ls_usagencianom").toLocaleString() + "</b></h1></td></tr>" +
         " </table>" +
         "</div>"
    }

    for (var i = 0; i < arrItem.length; i++) {
        item += "<ul id='navigation-container' data-role='listview' class='km-widget km-listview km-list' style='touch-action: none;'><li>";

        if (arrLink[i].includes("(") == true) {
            item += "<a onclick='" + arrLink[i] + "' class='km-listview-link' data-role='listview-link'>";
        }
        else {
            item += "<a href='components/" + arrLink[i] + "/view.html' class='km-listview-link' data-role='listview-link'>";
        }

        item += "<span class='fa-stack fa-lg'><i id='iconMenu"+i+"' class='fa " + arrIco[i] + " fa-stack-1x '></i></span>" +
             "<span style='font-size:" + tamLetHome + "; color:#32364c'>" + arrItem[i] + "&nbsp;&nbsp;&nbsp;</span>" +
             "</a></li></ul>"; 
    }
/* item += "<div><ul id='navigation-container' data-role='listview'>"+
          "  <li>"+
            "<a onclick='llamaravaluo();'>"+
            "    <span class='fa-stack fa-lg'>"+
            "    <i class='fa fa-square-o fa-stack-2x w3-text-red'></i>"+
            "    <i id='icnMenu2' class='fa fa-file-text-o fa-stack-1x'></i>"+
            "    </span>"+
            "    <span class='w3-text-red' style='font-size: 18px'>"+
            "    Avaluo Veh&iacute;culo&nbsp;&nbsp;&nbsp;&nbsp;
            "    </span>"+
            "</a>"+
            "</li>"+
            "</ul></div>"; */
    document.getElementById("divItemMenuPrinc").innerHTML += item;
    llamarNuevoestiloIcon("icnMenuPrincipal");
    llamarNuevoestiloIcon("iconMenu");

    $('.target4').hide("fast");

    $(document).ready(function () {
        $("#mostrar4").click(function () {
            $('#target4').show(1000);
            $('.target4').show("fast");
            $('.mostrar4').hide("fast");
            document.getElementById("mostrar4").style.display = 'none';
            document.getElementById("ocultar4").style.display = 'initial';
        });
        $("#ocultar4").click(function () {
            $('#target4').hide(3000);
            $('.target4').hide("fast");
            document.getElementById("mostrar4").style.display = 'initial';
            document.getElementById("ocultar4").style.display = 'none';
        });
    });
}
function llamaravaluo() {
    kendo.ui.progress($("#homeScreen"), true);
    setTimeout(function () {
        avaluo();
    }, 2000);
}
function avaluo() {
    kendo.mobile.application.navigate("components/avaluo/view.html");
    //kendo.mobile.application.navigate("components/avaluo_vehiculo/view.html");
    kendo.ui.progress($("#homeScreen"), false);
}

// END_CUSTOM_CODE_home