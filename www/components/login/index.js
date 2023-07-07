/*=======================================================================
Fecha: 21/08/2017
=======================================================================
Detalles: 
- Acceso a la Empresa
- Acceso por Login y Pass
=======================================================================
Autor: RRP.
=======================================================================*/

'use strict';

app.login = kendo.observable({
    onShow: function () {

     //   var h = $(window).height();
     //   var w = $(window).width();
     // h =  (h * 50) / 100;
     //w =   (w * 80) / 100;
     verVersion();
        llamarNuevoestilo("btnEmpresa");
        llamarNuevoestiloIcon("icnEmpresa");
        llamarNuevoestiloBorde("brdEmpresa");
       cierraControlGral();

        //localStorage.setItem("ls_dimensionW", screen.width);
        //localStorage.setItem("ls_dimensionH", screen.height);

        // RRP: 2018-04-11
       var scrWidth = $(window).width();
       var scrHeight = $(window).height();
       localStorage.setItem("ls_dimensionW", scrWidth);
       localStorage.setItem("ls_dimensionH", scrHeight);

        localStorage.setItem("ls_agendaplaca", "");

        localStorage.setItem("ls_verRecepcion", "0");

        kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
        kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false }));


 /*        $(".toggle-password").click(function() {

            $(this).toggleClass("fa-eye fa-eye-slash");
            var input = $($(this).attr("toggle"));
            if (input.attr("type") == "password") {
              input.attr("type", "text");
            } else {
              input.attr("type", "password");
            }
          }); */

    },
    afterShow: function () {
    }
});
app.localization.registerView('login');

// START_CUSTOM_CODE_login
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function mostrarPassword(){
    var cambio = document.getElementById("usuPass");
    if(cambio.type == "password"){
        cambio.type = "text";
        $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    }else{
        cambio.type = "password";
        $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
} 

$(document).ready(function () {
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso por codigo de empresa
Parametros:
    codEmpresa: codigo de la empresa (EJ.100001)
--------------------------------------------------------------------*/
function accesoEmpresa(codEmpresa) {
    try {

        if ((codEmpresa != "") && (codEmpresa)) {

            var empResp = "";
            var Url2 = wsPrincipal + "/Services/MV/Moviles.svc/mv00EmpresasGet/1,json;" + codEmpresa + ";";
              //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url2);

            $.ajax({
                url: Url2,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {

                        empResp = (JSON.parse(data.mv00EmpresasGetResult)).tmpEmpresas[0];
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(empResp));
                        if (empResp.estado == "ACTIVO") {
                            localStorage.setItem("ls_empresa", empResp.nombre_empresa);
                            localStorage.setItem("ls_idempresa", empResp.empresa_erp);
                            localStorage.setItem("ls_idmarca", empResp.codigo_marca);

                            localStorage.setItem("ls_url1", empResp.URL_mayorista);
                            localStorage.setItem("ls_url2", empResp.URL_concesionario); //"http://45.169.145.226:8089/test"
                            
                            document.getElementById("icnEmpresa0").innerHTML = localStorage.getItem("ls_empresa").toLocaleString();

                            kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: true }));
                            ConsultarParametroAmbiente(empResp.empresa_erp);
                        }
                        else {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Acceso Denegado</br>Empresa Desactivada</center>");
                        }

                    } catch (e) {

                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 2ERROR</center>", e);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Acceso Denegado.<br />C&oacute;digo incorrecto</center>");
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>No existe conexi&oacute;n con el <br/>Servicio Distribuidor</center>");
                    return;
                }
            });
            return empResp;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Acceso Denegado.</br>Ingrese el C&oacute;digo</center>");
        }

    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>l1 ERROR</center>", "<center>Acceso Denegado.</br>C&oacute;digo Incorrecto</center>");
        //return;
    }
}
function ConsultarParametroAmbiente(empresa_erp) {
    try {
        var accResp = "";
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroEmpGet/3,"+empresa_erp+";DE;DOCUMENTO_ELECTRONICO;TIPO_AMBIENTE";
        var respPar;
        $.ajax({
            url: Url,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    accResp = data.ParametroEmpGetResult.split(';');
                    ambiente=accResp[1];
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
/*--------------------------------------------------------------------
Fecha: 26/09/2017
Descripcion: Acceso de Usuario
Parametros:
    accUsu: usuario
    accPass: pass
--------------------------------------------------------------------*/
function accesoUsuario(accUsu, accPass) {
    try {

        // document.getElementById('usuLogin').value + ';' + document.getElementById('usuPass').value

        if (accUsu != "" && accPass != "") {

            var accResp = "";

         var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/AU/Seguridad.svc/accesoUsuario/" + accUsu + ';' + accPass;

       //  var Url = "http://localhost:4044/Services/AU/Seguridad.svc/accesoUsuario/" + accUsu + ';' + accPass;

        $.ajax({
                url: Url,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        var mensaje = inspeccionar(data);
                        if (mensaje.includes(",") == true) {
                            var arrMsjLogin = mensaje.split(',');

                            if (arrMsjLogin[0].includes("0") == true) {
                                var arrAccMsj = mensaje.split(",");
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>" + arrAccMsj[1].replace(";", "") + "</center>");
                                return;
                            }
                        }

                        accResp = JSON.parse(data.accesoUsuarioResult);

                        if (inspeccionar(accResp.Nombre).length > 0) {
                            // Datos Usuario
                            localStorage.setItem("ls_usunom", accResp.Observaciones);
                            localStorage.setItem("ls_usulog", accResp.UserName);

                            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                            // 2018-08-22             
                            localStorage.setItem("ls_usunumero", accResp.PersonaNumero);
                            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                            // Verifica si el login es el mismo en todos los procesos
                            localStorage.setItem("ls_usulog_verif", accResp.UserName);
                            localStorage.setItem("ls_usunomcompleto", accResp.Nombre.replace(/,/g, " "));
                            localStorage.setItem("ls_usumail", accResp.Mail);
                            localStorage.setItem("ls_usutelf", accResp.Telefono);

                            // presenta la OT
                            localStorage.setItem("ls_nuevacita", "ot");
                            localStorage.setItem("ls_vercboagen", "1");
                            
                            kendo.mobile.application.navigate("components/home/view.html");
                            kendo.bind($("#vwLogin"), kendo.observable({ isVisible: false }));
                            kendo.bind($("#vwLogout"), kendo.observable({ isVisible: true }));
                        }
                        else {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Acceso Denegado.<br />El usuario no se encuentra asociado a un profesional</center>");
                            return;
                        }
                    }
                    catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Acceso Denegado.</br>Datos Incorrectos</center>");
                        //borraCamposlogin();
                        return;
                    }
                },
                error: function (err) {
                  
                    /* 
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 2ERROR</center>", inspeccionar(err));
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> 2ERROR</center>", err.responsetext);
                     */                  

                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> mioERROR</center>", "<center>No existe conexi&oacute;n con el servicio<br/>Concesionario</center>");
                    return;
                }
            });
            return accResp;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>El Usuario o la Contrase&#241;a no han sido ingresados</center>");
            return;
        }
    } catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", f);
        return;
    }
}


function printPDF() {
    if (navigator.appName == 'Microsoft Internet Explorer') {

        //Wait until PDF is ready to print    
        if (typeof document.getElementById("pdfDocument").print == 'undefined') {

            setTimeout(function () { printPDF("pdfDocument"); }, 1000);

        } else {

            var x = document.getElementById("pdfDocument");
            x.print();
        }
    } else {
        PDFIframeLoad();  // for chrome 
    }
}

//for Chrome 
function PDFIframeLoad() {
    var iframe = document.getElementById('iframe_a');
    if (iframe.src) {
        var frm = iframe.contentWindow;

        frm.focus();// focus on contentWindow is needed on some ie versions  
        frm.print();
        return false;
    }
}

// Sale de la app pero solo la minimiza
function closeApp() {
    navigator.app.exitApp();
}

// END_CUSTOM_CODE_login