'use strict';

//====================================================================================================

// cel: 340 x 640

//alert(screen.width + " x " + screen.height)

localStorage.setItem("ls_dimensionW", screen.width );
localStorage.setItem("ls_dimensionH", screen.height);
verVersion();
var UrlCitasTaller = "";
var UrlFacturaSGC = "";
var UrlGarantiaSql = "";
var wsPrincipal = "http://200.31.10.92:8092/appk_aekia";
var htmlFormatoEV = "";
var ambiente
//anterior "http://186.71.21.170:8089";


http://200.31.10.92:8092/appk_aekia

//var wsInfoVehiculo = "http://186.71.21.170:8089/biss.sherloc/Services/SL/Sherloc/Sherloc.svc";

var datos_Cliente, Device_identifier, datos_Vehiculo, urlService, observa, observa1;

// placa de la agenda
localStorage.setItem("ls_agendaplaca", "");

//var gl_URL_mayorista = "";
//var gl_URL_concesionario = "";
//var gl_USU_login = "";


//if (localStorage.getItem("ls_url1") != undefined && localStorage.getItem("ls_url2") != undefined) {
    //gl_URL_mayorista = localStorage.getItem("ls_url1").toLocaleString();
    //gl_URL_concesionario = localStorage.getItem("ls_url2").toLocaleString();
    //gl_USU_login = localStorage.getItem("ls_usulog").toLocaleString();
//}
//else {
//    cerrarSistema();
//}


//localStorage.setItem("ls_empresa", empResp.nombre_empresa);
//localStorage.setItem("ls_idempresa", empResp.empresa_erp);
//localStorage.setItem("ls_url1", empResp.URL_mayorista);
//localStorage.setItem("ls_url2", empResp.URL_concesionario);
//localStorage.setItem("ls_usunom", accResp.Observaciones);
//localStorage.setItem("ls_usulog", accResp.UserName);
//localStorage.setItem("ls_usagencia", document.getElementById("cboAgenciasUS").value);
//localStorage.setItem("ls_usagencianom", document.getElementById("cboAgenciasUS").options[document.getElementById("cboAgenciasUS").selectedIndex].innerHTML);
//localStorage.getItem("ls_ussucursal").toLocaleString();

//import * as moment from "moment";
//====================================================================================================
//var moment = require("moment");
//moment.lang("es");
(function() {
    var app = {
        data: {},
        localization: {
            defaultCulture: 'en',
            cultures: [{
                name: "English",
                code: "en"
            }]
        },
        navigation: {
            viewModel: kendo.observable()
        }
    };
   var bootstrap = function() {
        $(function() {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                skin: 'nova',
                initial: 'components/login/view.html'
               
            });

            kendo.bind($('.navigation-link-text'), app.navigation.viewModel);
        });

        var viewModel11 = kendo.observable({ isVisible: false });
        kendo.bind($("#vwLogout"), viewModel11);


    };

    $(document).ready(function() {

        app.notification = $("#notify");

    });

    app.showNotification = function(message, time) {
        var autoHideAfter = time ? time : 3000;
        app.notification.find('.notify-pop-up__content').html(message);
        app.notification.fadeIn("slow").delay(autoHideAfter).fadeOut("slow");
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function() {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof(element) != 'undefined' && element !== null) {
                if (window.navigator.msPointerEnabled) {
                    $('#navigation-container').on('MSPointerDown', 'a', function(event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $('#navigation-container').on('touchstart', 'a', function(event) {
                        app.keepActiveState($(this).closest('li'));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function(url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function(itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function(event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function(formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function(key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /// start kendo binders
    kendo.data.binders.widget.buttonText = kendo.data.Binder.extend({
        init: function(widget, bindings, options) {
            kendo.data.Binder.fn.init.call(this, widget.element[0], bindings, options);
        },
        refresh: function() {
            var that = this,
                value = that.bindings["buttonText"].get();

            $(that.element).text(value);
        }
    });
    /// end kendo binders
}());

/// start app modules
(function localization(app) {
    var localization = app.localization = kendo.observable({
            cultures: app.localization.cultures,
            defaultCulture: app.localization.defaultCulture,
            currentCulture: '',
            strings: {},
            viewsNames: [],
            registerView: function(viewName) {
                app[viewName].set('strings', getStrings() || {});

                this.viewsNames.push(viewName);
            }
        }),
        i, culture, cultures = localization.cultures,
        getStrings = function() {
            var code = localization.get('currentCulture'),
                strings = localization.get('strings')[code];

            return strings;
        },
        updateStrings = function() {
            var i, viewName, viewsNames,
                strings = getStrings();

            if (strings) {
                viewsNames = localization.get('viewsNames');

                for (i = 0; i < viewsNames.length; i++) {
                    viewName = viewsNames[i];

                    app[viewName].set('strings', strings);
                }

                app.navigation.viewModel.set('strings', strings);
            }
        },
        loadCulture = function(code) {
            $.getJSON('cultures/' + code + '/app.json',
                function onLoadCultureStrings(data) {
                    localization.strings.set(code, data);
                });
        };

    localization.bind('change', function onLanguageChange(e) {
        if (e.field === 'currentCulture') {
            var code = e.sender.get('currentCulture');

            updateStrings();
        } else if (e.field.indexOf('strings') === 0) {
            updateStrings();
        } else if (e.field === 'cultures' && e.action === 'add') {
            loadCulture(e.items[0].code);
        }
    });

    for (i = 0; i < cultures.length; i++) {
        loadCulture(cultures[i].code);
    }

    localization.set('currentCulture', localization.defaultCulture);
})(window.app);
/// end app modules

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

//===========================================================================================================
// RRP: Herramientas
//===========================================================================================================
function inspeccionar(obj) {
    try {
        var msg = '';
        for (var property in obj) {
            if (typeof obj[property] == 'function') {
                var inicio = obj[property].toString().indexOf('function');
                var fin = obj[property].toString().indexOf(')') + 1;
                var propertyValue = obj[property].toString().substring(inicio, fin);
                msg += (typeof obj[property]) + ' ' + property + ' : ' + propertyValue + ' ;\n';
            } else if (typeof obj[property] == 'unknown') {
                msg += 'unknown ' + property + ' : unknown ;\n';
            } else {
                msg += (typeof obj[property]) + ' ' + property + ' : ' + obj[property] + ' ;\n';
            }
        }
        return msg;
    } catch (e) {
        alert(e);
    }
}


/*--------------------------------------------------------------------
Fecha: 05/09/2017
Descripcion: Cierra la sesion actual y setea los controles
Parametros: 
--------------------------------------------------------------------*/
function cerrarSistema() {

 //   resetControls("");

    localStorage.clear();


    localStorage.setItem("ls_dimensionW", screen.width);
    localStorage.setItem("ls_dimensionH", screen.height);
    localStorage.setItem("ls_agendaplaca", "");


    document.getElementById('usuFabrica').value = "";
    document.getElementById('usuLogin').value = "";
    document.getElementById('usuPass').value = "";

    kendo.bind($("#vwEmpresa"), kendo.observable({ isVisible: true }));
    kendo.bind($("#vwLogin2"), kendo.observable({ isVisible: false }));

    kendo.bind($("#vwLogin"), kendo.observable({ isVisible: true }));
    kendo.bind($("#vwLogout"), kendo.observable({ isVisible: false }));

    kendo.mobile.application.navigate("components/login/view.html");


}


/*--------------------------------------------------------------------
Fecha: 05/09/2017
Descripcion: Abre vista
Parametros: vista
--------------------------------------------------------------------*/
function abrirPagina(vista) {
    kendo.mobile.application.navigate("components/" + vista + "/view.html");
}



function abrirPagina2(vista) {
    localStorage.removeItem("ls_agendaplaca");
    kendo.mobile.application.navigate("components/" + vista + "/view.html");
}

/*--------------------------------------------------------------------
Fecha: 22/01/2018
Descripcion: Cierra todos los controles "kendoDialog"
Parametros: vista
--------------------------------------------------------------------*/
function cierraControlGral() {
    // Agenda
    try {
        var window = $("#dialog");
        if (window.data("kendoDialog")) {
            dialog.data("kendoDialog").close();
        }
    }
    catch (e) { }

    // OT - Mail
    try {
        var dialogOT = $("#dialogOT").data("kendoDialog");
        dialogOT.close();
    }
    catch (ed2) {
    }

    // OT - Mail Diag
    try {
        var dialogOT_1 = $("#dialogOT_1").data("kendoDialog");
        dialogOT_1.close();
    }
    catch (ed2) {
    }

    // OT - Mail Rec
    try {
        var dialogOT_2 = $("#dialogOT_2").data("kendoDialog");
        dialogOT_2.close();
    }
    catch (ed2) {
    }

    // OT - Imprime
    try {
        var dialogPrintOT = $("#dialogPrint").data("kendoDialog");
        dialogPrintOT.close();
    }
    catch (ed1) {
    }

    // Entrega vehiculo
    try {
        var dialogMailEV = $("#dialogMailEV").data("kendoDialog");
        dialogMailEV.close();
    }
    catch (ed09) {
    }

    // Agenda entrega
    try {
        var dialogMailEV2 = $("#dialogMailEV2").data("kendoDialog");
        dialogMailEV.close();
    }
    catch (ed10) {
    }

    // Sincronizacion
    try {
        var dialogSincro = $("#dialogSincro");
        dialog.data("kendoDialog").close();
    }
    catch (e) { }

}


/*--------------------------------------------------------------------
Fecha: 18/08/2017
Descripcion: Alerta con formato
Parametros: titulo, contenido
--------------------------------------------------------------------*/
function myalert(titulo, contenido) {
    $("<div></div>").kendoAlert({
        title: titulo,
        content: contenido
    }).data("kendoAlert").open();
}




function myalert2(contenido, titulo) {
    $("<div></div>").kendoAlert({
        title: titulo,
        content: contenido
    }).data("kendoAlert").open();
}


function mens(Mensaje, Tipo) {
    var valorIzq = (Mensaje.length) * 4;
    notificationWidget.setOptions({
        position: {
            top: Math.floor($(window).width() / 2),
            left: Math.floor($(window).width() / 2 - valorIzq),
            bottom: 0,
            right: 0
        },
        font: {
            size: 14,
            bold: true
        }
    });
    notificationWidget.showText(Mensaje, Tipo);
}

/*--------------------------------------------------------------------
Fecha: 11/09/2017
Descripcion: Carga combo
Parametros:
    combo: control
    arreglo: array con los items
    seleccion: seleccion default
--------------------------------------------------------------------*/
function cargaCbo(combo, arreglo, seleccion) {
    if (seleccion != "") {
        $("#" + combo).kendoComboBox({
            dataSource: arreglo,
            value: seleccion
        });
    }
    else {
        $("#" + combo).kendoComboBox({
            dataSource: arreglo
        });
    }
}

/*--------------------------------------------------------------------
Fecha: 27/12/2017
Descripcion: Asigna nuevamente al usuario principal con el logueado
--------------------------------------------------------------------*/
function usuPrincipal()
{
    if (localStorage.getItem("ls_usulog").toLocaleString() != localStorage.getItem("ls_usulog_verif").toLocaleString()) {
        var usuPrinc = localStorage.getItem("ls_usulog_verif").toLocaleString();
        localStorage.setItem("ls_usulog", usuPrinc);
    }
}



function validaFecha(fInicio, fFinal) {

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


/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Numero a Texto
Autor: RRP
--------------------------------------------------------------------*/
function NumToText(valNum) {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/tg09EmpresasGet/99,json;1;233.44

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

    respNumToText = inforNumToText[0].NombreClase;

    return respNumToText;
}


/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Valor IVA
Autor: RRP
--------------------------------------------------------------------*/
function facturaIVA() {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/2,45;IVA

    var UrlIVA = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/2,45;IVA";

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> UrlIVA</center>", UrlIVA);

    var respIVA = 0;

    var inforIVA;
    $.ajax({
        url: UrlIVA,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforIVA = JSON.parse(data.ParametroGralGetResult);
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

    respIVA = parseFloat(inforIVA[0].CodigoClase);
    return respIVA;
}

/*--------------------------------------------------------------------
Fecha: 18/01/2018
Detalle: Datos de la Empresa
Autor: RRP
--------------------------------------------------------------------*/
function datosEmpresa(idEmpresa) {
    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/tg09EmpresasGet/1,json;1;

    var UrlEmpresa = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/tg09EmpresasGet/1,json;" + idEmpresa + ";";

    var inforEmpresa;
    $.ajax({
        url: UrlEmpresa,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforEmpresa = (JSON.parse(data.tg09EmpresasGetResult)).tmpEmpresas;
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

    return inforEmpresa[0];
}
function verVersion(){
    try {
        var param = {
                "dt2": "APP MOVIL"
        };
        var Url = "https://biss.kiaecuador.com.ec/api/MnMrE/VmSMMnE"; //"https://play.google.com/store/apps/details?id="+bundle;
            $.ajax({
                url: Url,
                type: "POST",
                async: false,
                dataType: "json",
                data : JSON.stringify(param),
                //Content-Type: application/json
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (datas) {
                    localStorage.setItem("versionapp", JSON.stringify(datas));
                    var objaux = datas? {
                        dt1:hexToRgb(datas.dt1),
                        dt5:hexToRgb(datas.dt5),
                        dt6:hexToRgb(datas.dt6),
                    }:{};
                    localStorage.setItem("versionappRGB", JSON.stringify(objaux));
                },
                error: function (err) { alert(inspeccionar(err)); alert("Error en servicio clientes");
            } 
            });
        
    } catch (e) {
        alert(e);
    }
}
function llamarColorTexto(menu){
    var elements = Array.prototype.slice.call(document.querySelectorAll(menu));
    var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
  // Loop over each element....
  if(elements.length)
  elements.forEach(function(el){
           el.style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt1.g+","+rgbnuevo.dt1.b+",1)";
          });   
}
function llamarColorBotonGeneral(menu){
    var elements = Array.prototype.slice.call(document.querySelectorAll(menu));
    var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
  // Loop over each element....
  if(elements.length)
  elements.forEach(function(el){
           el.style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
           el.style.color = "#ffffff";
           el.style.borderColor="rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
          });   
}
function llamarNuevoestiloIcon(menu){
    
    try {
        var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
    if(document.getElementById(menu+"0")){document.getElementById(menu+"0").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"1")){document.getElementById(menu+"1").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"2")){document.getElementById(menu+"2").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"3")){document.getElementById(menu+"3").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"4")){document.getElementById(menu+"4").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"5")){document.getElementById(menu+"5").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"6").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"7").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"8").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"9").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"10").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"11").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"12").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";}

    } catch (error) {
        //alert(error);
    }
    
}
function llamarNuevoestiloIconB(menu){
    
    try {
    if(document.getElementById(menu+"0")){document.getElementById(menu+"0").style.color ="#ffffff";}
    if(document.getElementById(menu+"1")){document.getElementById(menu+"1").style.color = "#ffffff";}
    if(document.getElementById(menu+"2")){document.getElementById(menu+"2").style.color = "#ffffff";}
    if(document.getElementById(menu+"3")){document.getElementById(menu+"3").style.color = "#ffffff";}
    if(document.getElementById(menu+"4")){document.getElementById(menu+"4").style.color = "#ffffff";}
    if(document.getElementById(menu+"5")){document.getElementById(menu+"5").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"6").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"7").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"8").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"9").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){document.getElementById(menu+"10").style.color = "#ffffff";}

    } catch (error) {
        //alert(error);
    }
    
}
function llamarNuevoestilo(menu){
    try {
        var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
    if(document.getElementById(menu+"0")){
        document.getElementById(menu+"0").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"0").style.color = "#ffffff";}
    if(document.getElementById(menu+"1")){
        document.getElementById(menu+"1").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"1").style.color = "#ffffff";}
    if(document.getElementById(menu+"2")){
        document.getElementById(menu+"2").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"2").style.color = "#ffffff";}
    if(document.getElementById(menu+"3")){
        document.getElementById(menu+"3").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"3").style.color = "#ffffff";}
    if(document.getElementById(menu+"4")){
        document.getElementById(menu+"4").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"4").style.color = "#ffffff";}
    if(document.getElementById(menu+"5")){
        document.getElementById(menu+"5").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"5").style.color = "#ffffff";}
    if(document.getElementById(menu+"6")){
        document.getElementById(menu+"6").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
        document.getElementById(menu+"6").style.color = "#ffffff";}
    if(document.getElementById(menu+"7")){
            document.getElementById(menu+"7").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
            document.getElementById(menu+"7").style.color = "#ffffff";}
    if(document.getElementById(menu+"8")){
                document.getElementById(menu+"8").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                document.getElementById(menu+"8").style.color = "#ffffff";}
    if(document.getElementById(menu+"9")){
                    document.getElementById(menu+"9").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                    document.getElementById(menu+"9").style.color = "#ffffff";}
    if(document.getElementById(menu+"10")){
                        document.getElementById(menu+"10").style.backgroundColor = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)";
                        document.getElementById(menu+"10").style.color = "#ffffff";}
    } catch (error) {
        alert(error);
    }
}
function llamarNuevoestiloBorde(menu){
    try {
        var rgbnuevo = JSON.parse(localStorage.getItem("versionappRGB"));
    if(document.getElementById(menu+"0")){
        document.getElementById(menu+"0").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"0").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
    if(document.getElementById(menu+"1")){
        document.getElementById(menu+"1").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"1").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
    if(document.getElementById(menu+"2")){
        document.getElementById(menu+"2").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"2").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
    if(document.getElementById(menu+"3")){
        document.getElementById(menu+"3").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"3").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
    if(document.getElementById(menu+"4")){
        document.getElementById(menu+"4").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"4").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";}
    if(document.getElementById(menu+"5")){
        document.getElementById(menu+"5").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"5").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
    }
    if(document.getElementById(menu+"6")){
        document.getElementById(menu+"6").style.border = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
        document.getElementById(menu+"6").style.color = "rgba("+rgbnuevo.dt5.r+","+rgbnuevo.dt5.g+","+rgbnuevo.dt5.b+",0.8)!important";
    }

    } catch (error) {
        //alert(error);
    }
    
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function ValidaMailR() {
    try {
        if (document.getElementById("mail").value != "") {
            var result = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(document.getElementById("mail").value);
            if (result == false) {
                document.getElementById("mail").focus();
                document.getElementById("mail").style.borderColor = "red";
            } else {
                document.getElementById("email").style.borderColor = "";
            }
        }
    } catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n mail", "mens"); return; }
}


function ValidaCelularR() {
    try {
        if (document.getElementById("telefono_celular").value != "") {
            var result = /[09][0-9]{7}$/.test(document.getElementById("telefono_celular").value);
            //alert(result);
            if (result == false) {
                document.getElementById("telefono_celular").focus();
                document.getElementById("telefono_celular").style.borderColor = "red";
            } else {
                document.getElementById("telefono_celular").style.borderColor = "";
            }
        }
    }
    catch (f) { mens("Error validaci" + String.fromCharCode(243) + "n celular", "mens"); return; }
}
function ValidaTelefR() {
    try {
        if (document.getElementById("cli_telefono_propietario").value != "") {
            var result = /^[0][2|3|4|5|6|7][0-9]{7}$/.test(document.getElementById("cli_telefono_propietario").value);
            //alert(result);
            if (result == false) {
                document.getElementById("cli_telefono_propietario").focus();
                document.getElementById("cli_telefono_propietario").style.borderColor = "red";
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el numero de telefono</center>");
            } else {
                document.getElementById("cli_telefono_propietario").style.borderColor = "";
            }
        }
    }
    catch (f) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "<center>Ingrese correctamente el Email</center>");
        return;
    }
}



//===========================================================================================================

// END_CUSTOM_CODE_kendoUiMobileApp