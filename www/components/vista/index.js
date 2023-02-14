/*=======================================================================
Fecha: 05/03/2020
=========================================================================
SEGUIMIENTO VEHÍCULOS NUEVOS
=========================================================================
Detalles:
- Ingresa parámetros y obtiene los datos
=======================================================================
Autor: RRP.
=======================================================================*/

var numeroFilasSeguimiento = 27;
var vistaFechas = false;
var numeroCaracteresMinimo = 6

'use strict';

app.vista = kendo.observable({
    onShow: function () {
        llamarColorTexto(".w3-text-red");
        llamarNuevoestiloIconB("icnVistaBuscar");
        llamarNuevoestilo("btnVistaBuscar");
        llamarNuevoestilo("lydVista");
        llamarNuevoestilo("btnRegresarCausal");
        llamarNuevoestiloIconB("icnRegresarCausal");
        try {
            var grid_Seguimiento = $("#gridSeguimiento").data("kendoGrid");
            grid_Seguimiento.destroy();
        } catch (e) {}
        try {
            var grid_SeguimientoInicial = $("#gridSeguimientoInicial").data("kendoGrid");
            grid_SeguimientoInicial.destroy();
        } catch (e) {}
        try {
            var grid_SeguimientoInicial = $("#gridSeguimientoLlamadas").data("kendoGrid");
            grid_SeguimientoInicial.destroy();
        } catch (e) {}
        try {
            var grid_SeguimientoInicial = $("#gridSeguimientoAccesorios").data("kendoGrid");
            grid_SeguimientoInicial.destroy();
        } catch (e) {}
        try {
            var grid_SeguimientoInicial = $("#gridEstadosAsociados").data("kendoGrid");
            grid_SeguimientoInicial.destroy();
        } catch (e) {}
        try {
            var grid_SeguimientoInicial = $("#gridSeguimientoLlamadasNO").data("kendoGrid");
            grid_SeguimientoInicial.destroy();
        } catch (e) {}

        CargarParametrosSeguimiento();
        if (localStorage.getItem("ls_listavin_rec") != undefined) {
            localStorage.removeItem("ls_listavin_rec");
        }

        if (localStorage.getItem("dataItem") != undefined) {
            localStorage.removeItem("dataItem");
        }

        document.getElementById('facturaSeguimiento').value = '';
        document.getElementById('vinSeguimiento').value = '';
        document.getElementById('numeroClienteSeguimiento').value = '';
        document.getElementById('nombreClienteSeguimiento').value = '';
        document.getElementById("dpInicioSeg").value = setearValorFecha();
        document.getElementById("dpFinSeg").value = setearValorFecha();
        document.getElementById("gridSeguimiento").style.display = "none";
        document.getElementById("contenidoGrid").style.display = "none";
        cargarComboCausales();
        cargarComboCausalesNO();
    },
    afterShow: function () {
    }
});
app.localization.registerView('vista');

// START_CUSTOM_CODE_vista
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
function cargarComboCausales() {
    var infSeguimiento = "1";
    try {
        var parametrosESG = localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + "ENTREGADORES;" + localStorage.getItem("ls_usulog").toLocaleString();
        //var arregloTipoRegistro = ["BIENVENIDO" , "CITA_ENTREGA" , "MATRICULADO" ];
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet"; //1,json;" + parametrosESG;

        var datosObser = {
            "modo": "1",
            "archivo": "json",
            "empresa": localStorage.getItem("ls_idempresa").toLocaleString(),
            "sucursal": localStorage.getItem("ls_ussucursal").toLocaleString(),
            "agencia": localStorage.getItem("ls_usagencia").toLocaleString(),
            "tipo": "ENTREGADORES",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": "",
            "factura": "",
            "secuencia": "",
            "chasis": "",
            "causal": "",
            "observacion": ""
        };
        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {
            //  precarga inicio
            $.ajax({
                url: Url,
                type: "POST",
                async: false,
                dataType: "json",
                data: JSON.stringify(datosObser),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        var resultado = data;
                        if (resultado.substring(0, 2) == "0," || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", resultado.substring(2, resultado.length));
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            infSeguimiento = (JSON.parse(data)).ttg29; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;

                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });

            //alert(infSeguimiento);
            if (infSeguimiento.length > 0) {
                try {
                    var cboCausalesHTML = "<table><tr><td><p><label class='w3-text-red'><b>Causales</b></label></p>" +
                        "<p><select id='causalesvh' class='w3-input w3-border textos select-style'>";
                    //cboCausalesHTML += "<option value=''>Seleccione</option>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTML += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }
                    cboCausalesHTML += "</select></p></td></tr><tr><td><p><label class='w3-text-red'><b>Observación</b></label></p><p>" +
                        "<textarea name='observacionCausal' id='observacionCausal' style='width:1500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'" +
                        "maxlength='300'></textarea></p></td>" +
                        /* "<input name='vin' type='text' id='observacionCausal' class='w3-input w3-border textos'"+
                        "style='width:300px; text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();' /> </p>"+ */
                        "</td></tr><tr><td><p><button id='btnCausal0' onclick='GuardarCausal();' class='w3-btn'><in id='icnCausal0' class='fa fa-cloud-upload' aria-hidden='true'></i>" +
                        " GUARDAR</button></p></td></tr></table>";
                    document.getElementById("consultaCausal").innerHTML = cboCausalesHTML;
                    llamarNuevoestilo("btnCausal");
                    llamarNuevoestiloIconB("icnCausal");
                    /* var cboCausalesHTML = "<table><tr><td><p><input type='radio' id='causales' onclick='handleClick(this);' name='optCausales' class='w3-text-red' checked value='causales'><b><label for='causales'>Causales</label></b></input></p>"+
                            "<p><select id='causalesvh' class='w3-input w3-border textos select-style'>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTML += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }
                    cboCausalesHTML += "</select></p></td>"+
                    "<td><p><input type='radio' class='w3-text-red' id='noentrega' name='optCausales' onclick='handleClick(this);' value='noentrega'><b><label for='causales'>No Entrega</label></b></label></p>"+
                    "<p><select id='noentregavh' class='w3-input w3-border textos select-style'>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTML += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }

                    cboCausalesHTML += "</td></tr><tr><td><p><label class='w3-text-red'><b>Observación</b></label></p><p>"+
                        "<textarea name='observacionCausal' id='observacionCausal' style='width:500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'"+
                        "></textarea></p></td>"+
                       "<td><p><label class='w3-text-red'><b>Observación</b></label></p><p>"+
                        "<textarea name='observacionNoEntrega' id='observacionNoEntrega' style='width:500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'"+
                        "></textarea></p></td>"+

                        "</td></tr><tr><td><p><button onclick='GuardarCausal();' class='w3-btn w3-red'><i class='fa fa-cloud-upload' aria-hidden='true'></i>"+
                        " GUARDAR</button></p></td></tr></table>";
                    document.getElementById("consultaCausal").innerHTML = cboCausalesHTML; */
                } catch (error) {
                    kendo.ui.progress($("#vistaScreen"), false);

                }
            }
            kendo.ui.progress($("#vistaScreen"), false);
            // precarga fin
        }, 2000);

    } catch (error) {
        kendo.ui.progress($("#vistaScreen"), false);
        // precarga fin

    }


}

function cargarComboCausalesNO() {
    var infSeguimiento = "1";
    try {
        var parametrosESG = localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + "ENTREGADORES;" + localStorage.getItem("ls_usulog").toLocaleString();
        //var arregloTipoRegistro = ["BIENVENIDO" , "CITA_ENTREGA" , "MATRICULADO" ];
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet"; //1,json;" + parametrosESG;

        var datosObser = {
            "modo": "1",
            "archivo": "json",
            "empresa": localStorage.getItem("ls_idempresa").toLocaleString(),
            "sucursal": localStorage.getItem("ls_ussucursal").toLocaleString(),
            "agencia": localStorage.getItem("ls_usagencia").toLocaleString(),
            "tipo": "NO_ENTREGA_VH",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": "",
            "factura": "",
            "secuencia": "",
            "chasis": "",
            "causal": "",
            "observacion": ""
        };
        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {
            //  precarga inicio
            $.ajax({
                url: Url,
                type: "POST",
                async: false,
                dataType: "json",
                data: JSON.stringify(datosObser),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        var resultado = data;
                        if (resultado.substring(0, 2) == "0," || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", resultado.substring(2, resultado.length));
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            infSeguimiento = (JSON.parse(data)).ttg29; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;

                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });

         // alert(infSeguimiento.length);
            if (infSeguimiento.length > 0) {
                try {
                    var cboCausalesHTMLNO = "<table><tr><td><p><label class='w3-text-red'><b>Causales no Entrega</b></label></p>" +
                        "<p><select id='causalesvhNO' class='w3-input w3-border textos select-style'>";
                    //cboCausalesHTML += "<option value=''>Seleccione</option>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTMLNO += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }
                    cboCausalesHTMLNO += "</select></p></td></tr><tr><td><p><label class='w3-text-red'><b>Observación</b></label></p><p>" +
                        "<textarea name='observacionCausalNO' id='observacionCausalNO' style='width:1500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'" +
                        "maxlength='300'></textarea></p></td>" +
                        /* "<input name='vin' type='text' id='observacionCausal' class='w3-input w3-border textos'"+
                        "style='width:300px; text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();' /> </p>"+ */
                        "</td></tr><tr><td><p><button id='btnCausalNO0' onclick='GuardarCausalNO();' class='w3-btn'><i id='icnCausalNO0 class='fa fa-cloud-upload' aria-hidden='true'></i>" +
                        " GUARDAR</button></p></td></tr></table>";
                    document.getElementById("consultaCausalNO").innerHTML = cboCausalesHTMLNO;
                    llamarNuevoestilo("btnCausalNO");
                    llamarNuevoestiloIconB("icnCausalNO");
                    /* var cboCausalesHTML = "<table><tr><td><p><input type='radio' id='causales' onclick='handleClick(this);' name='optCausales' class='w3-text-red' checked value='causales'><b><label for='causales'>Causales</label></b></input></p>"+
                            "<p><select id='causalesvh' class='w3-input w3-border textos select-style'>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTML += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }
                    cboCausalesHTML += "</select></p></td>"+
                    "<td><p><input type='radio' class='w3-text-red' id='noentrega' name='optCausales' onclick='handleClick(this);' value='noentrega'><b><label for='causales'>No Entrega</label></b></label></p>"+
                    "<p><select id='noentregavh' class='w3-input w3-border textos select-style'>";

                    for (var i = 0; i < infSeguimiento.length; i++) {
                        cboCausalesHTML += "<option  value='" + infSeguimiento[i].elemento + "'>" + infSeguimiento[i].descripcion + "</option>";
                    }

                    cboCausalesHTML += "</td></tr><tr><td><p><label class='w3-text-red'><b>Observación</b></label></p><p>"+
                        "<textarea name='observacionCausal' id='observacionCausal' style='width:500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'"+
                        "></textarea></p></td>"+
                       "<td><p><label class='w3-text-red'><b>Observación</b></label></p><p>"+
                        "<textarea name='observacionNoEntrega' id='observacionNoEntrega' style='width:500px;height:100px;text-align:lefth;padding-right:10px;text-transform:uppercase;' onkeyup='javascript:this.value=this.value.toUpperCase();'"+
                        "></textarea></p></td>"+

                        "</td></tr><tr><td><p><button onclick='GuardarCausal();' class='w3-btn w3-red'><i class='fa fa-cloud-upload' aria-hidden='true'></i>"+
                        " GUARDAR</button></p></td></tr></table>";
                    document.getElementById("consultaCausal").innerHTML = cboCausalesHTML; */
                } catch (error) {
                    kendo.ui.progress($("#vistaScreen"), false);

                }
            }
            kendo.ui.progress($("#vistaScreen"), false);
            // precarga fin
        }, 2000);

    } catch (error) {
        kendo.ui.progress($("#vistaScreen"), false);
        // precarga fin

    }


}

var currentValue = 0;

function handleClick(myRadio) {
    alert('Old value: ' + currentValue);
    alert('New value: ' + myRadio.value);
    currentValue = myRadio.value;
}

/*--------------------------------------------------------------------
Fecha: 05/03/2020
Descripcion: Carga los controles del modulo
--------------------------------------------------------------------*/
function CargarParametrosSeguimiento() {
    //cargarTipoRegistro();

    document.getElementById("dpInicioSeg").value = setearValorFecha();
    $("#dpInicioSeg").kendoDatePicker({format: "dd-MM-yyyy"});

    document.getElementById("dpFinSeg").value = setearValorFecha();
    $("#dpFinSeg").kendoDatePicker({format: "dd-MM-yyyy"});

    $("#tabstripSeg").kendoTabStrip({animation: {open: {effects: "fadeIn"}}});


    var arrLi = ["liSeguimientoSeg", "liFacturaSeg", "liEstadosSeg", "liAccesoriosSeg", "liLlamadasSeg", "liLlamadasSegNO"];
    var idLi = 1;
    for (var x = 0; x < arrLi.length; x++) {
        document.getElementById(arrLi[x]).removeAttribute("style");
        if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) < 361) {
            document.getElementById("l" + idLi).style.fontSize = "12px";
            idLi++;
        }
    }

    var tabstrip = $("#tabstripSeg").kendoTabStrip().data("kendoTabStrip");
    tabstrip.enable(tabstrip.tabGroup.children().eq(1), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(2), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(3), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(4), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(5), false);

}

/*--------------------------------------------------------------------
Fecha: 05/03/2020
Descripcion: Setea los campos del formulario
--------------------------------------------------------------------*/
function VaciarCamposSeguimiento(vin) {
    var tabstrip = $("#tabstripSeg").kendoTabStrip().data("kendoTabStrip");
    tabstrip.enable(tabstrip.tabGroup.children().eq(1), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(2), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(3), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(4), false);
    tabstrip.enable(tabstrip.tabGroup.children().eq(5), false);
    tabstrip.select(0);

    if (vin) {
        document.getElementById('vinSeguimiento').value = '';
    }

    //document.getElementById('tipoRegistroSvh').value = '';
    document.getElementById('facturaSeguimiento').value = '';
    document.getElementById('numeroClienteSeguimiento').value = '';
    document.getElementById('nombreClienteSeguimiento').value = '';
    document.getElementById('identificacionClienteSeguimiento').value = '';
    //document.getElementById("conFecha").checked = false;
    document.getElementById("dpInicioSeg").value = setearValorFecha();
    document.getElementById("dpFinSeg").value = setearValorFecha();
    document.getElementById("gridSeguimiento").style.display = "none";
    document.getElementById("contenidoGrid").style.display = "none";
    document.getElementById("gridSeguimientoInicial").style.display = "none";

    if (localStorage.getItem("ls_listavin_rec") != undefined) {
        localStorage.removeItem("ls_listavin_rec");
    }

    if (localStorage.getItem("dataItem") != undefined) {
        localStorage.removeItem("dataItem");
    }

    try {
        var grid_Seguimiento = $("#gridSeguimiento").data("kendoGrid");
        grid_Seguimiento.destroy();

        var grid_SeguimientoInicial = $("#gridSeguimientoInicial").data("kendoGrid");
        grid_SeguimientoInicial.destroy();
    } catch (e) {
    }
}

function validarVIN(valor) {
    if (valor.includes("*")) {
        VaciarCamposSeguimiento(false);
        $('#targetSeg').hide(1000);
        $('.targetSeg').hide("fast");
    } else {
        $('#targetSeg').show(1000);
        $('.targetSeg').show("fast");
        document.getElementById("divControlesSeg").style.display = 'initial';
    }
}

function altoContainer() {
    setTimeout(() => {
        document.getElementById("tabstripSeg-1").style.height = "auto";
        document.getElementById("tabstripSeg-2").style.height = "auto";
        document.getElementById("tabstripSeg-3").style.height = "auto";
        document.getElementById("tabstripSeg-4").style.height = "auto";
        document.getElementById("tabstripSeg-5").style.height = "auto";
        $("table").removeAttr("style");
    }, 500);
}

/*--------------------------------------------------------------------
Fecha: 05/03/2020
Descripción: Busca el seguimiento del vehiculo nuevo
Parametros: Factura / N.cliente / Nombre cliente / VIN / Fechas ini-fin
--------------------------------------------------------------------*/
function BuscarSeguimiento() {
    kendo.ui.progress($("#vistaScreen"), true);
    setTimeout(function () {
        //ListarDatosCliente(null);
        document.getElementById("gridSeguimiento").style.display = "none";
        document.getElementById("contenidoGrid").style.display = "none";
        document.getElementById("gridSeguimientoInicial").style.display = "none";
        var infSeguimiento;
        try {
            var grid_Seguimiento = $("#gridSeguimiento").data("kendoGrid");
            grid_Seguimiento.destroy();
        } catch (e) {
        }

        var vinSeguimiento = document.getElementById('vinSeguimiento').value;
        var tipoRegistro = "TODOS"; //document.getElementById('tipoRegistroSvh').value;

        if (tipoRegistro == 'TODOS') {
            tipoRegistro = '';
        }

        var facturaSeguimiento = document.getElementById('facturaSeguimiento').value;
        var numeroClienteSeguimiento = document.getElementById('numeroClienteSeguimiento').value;
        var identificacionClienteSeguimiento = document.getElementById('identificacionClienteSeguimiento').value;
        var nombreClienteSeguimiento = document.getElementById('nombreClienteSeguimiento').value;
        var dpInicioSeg = document.getElementById('dpInicioSeg').value;
        var dpFinSeg = document.getElementById('dpFinSeg').value;

        /* if(tipoRegistro.length == 0 &&  vinSeguimiento.length == 0 && facturaSeguimiento.length == 0 &&  numeroClienteSeguimiento.length == 0 &&
            identificacionClienteSeguimiento.length == 0 &&  nombreClienteSeguimiento.length == 0 &&  dpInicioSeg.length == 0 && dpFinSeg.length == 0)
            {
                kendo.ui.progress($("#vistaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Escoja por lo menos un parámetro para la búsqueda");
                return;
            } */

        if (vinSeguimiento.includes("*") == true) {
            kendo.ui.progress($("#vistaScreen"), true);
            setTimeout(function () {
                ListarVinSeguimientoNuevos(vinSeguimiento);
                kendo.ui.progress($("#vistaScreen"), false);
            }, 2000);
        } else {
            /*  if (vinSeguimiento.length == 0) {
                 kendo.ui.progress($("#vistaScreen"), false);
                 window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Ingrese el VIN");
                 return;
             }  */

            if (facturaSeguimiento.length > 0 && facturaSeguimiento.length < 17) {
                kendo.ui.progress($("#vistaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", "Ingrese correctamente No. Factura. Ej. 001-001-123456789");
                return;
            } /* else {
            if(facturaSeguimiento.includes('-')){
                facturaSeguimiento = facturaSeguimiento.replace(/-/g, '')
            }
        } */

            if (vistaFechas == true && validaFecha(dpInicioSeg, dpFinSeg) == false) {
                kendo.ui.progress($("#vistaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>3 ERROR</center>", "La Fecha de Inicio no puede ser mayor a la Final");
                return;
            }

            var empsucagen;
            try {

                empsucagen = localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString();

            } catch (error) {

            }

            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + vinSeguimiento+";";

            var conFecha = document.getElementById("conFecha").checked;

            if (conFecha) {/* json;1;02;02;;;;;;;;;;01-09-2020;20-10-2020;0;; */
                empsucagen = empsucagen + ";;;;" + vinSeguimiento + ";" + facturaSeguimiento + ";" + identificacionClienteSeguimiento + ";" + nombreClienteSeguimiento + ";;" + localStorage.getItem("ls_usulog").toLocaleString() + ";" + dpInicioSeg + ";" + dpFinSeg + ";0;" + numeroClienteSeguimiento;
                /* var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" + vinSeguimiento+";;;" + tipoRegistro +";;"+
                nombreClienteSeguimiento +";" + facturaSeguimiento + ";"+ numeroClienteSeguimiento +";"+ identificacionClienteSeguimiento +";"+
                dpInicioSeg +";"+ dpFinSeg +""; */
            } else {
                empsucagen = empsucagen + ";;;;" + vinSeguimiento + ";" + facturaSeguimiento + ";" + identificacionClienteSeguimiento + ";" + nombreClienteSeguimiento + ";;" + localStorage.getItem("ls_usulog").toLocaleString() + ";;;0;" + numeroClienteSeguimiento;
                /* var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" + vinSeguimiento+";;;" + tipoRegistro +";;"+
                nombreClienteSeguimiento +";" + facturaSeguimiento + ";"+ numeroClienteSeguimiento +";"+ identificacionClienteSeguimiento +";;"; */
            }
            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh06FacturasGet/1,json;"+empsucagen;
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh06VehiculoGet/1,json;" + empsucagen;

            //alert(Url);

            kendo.ui.progress($("#vistaScreen"), true);
            setTimeout(function () {
                //  precarga inicio
                $.ajax({
                    url: Url,
                    type: "GET",
                    async: false,
                    dataType: "json",
                    success: function (data) {
                        try {
                            var resultado = data.vh06VehiculoGetResult; //data.vh03FacturasGetResult;
                            if (resultado == "0,No existen datos," || resultado == null) {
                                infSeguimiento = [];
                                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                                kendo.ui.progress($("#vistaScreen"), false);
                            } else {
                                infSeguimiento = (JSON.parse(data.vh06VehiculoGetResult)).tvh03; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                            }
                        } catch (error) {
                            infSeguimiento = [];
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                            kendo.ui.progress($("#vistaScreen"), false);
                        }
                    },
                    error: function (err) {
                        kendo.ui.progress($("#vistaScreen"), false);
                        errorConex = true;
                        kendo.ui.progress($("#vistaScreen"), false);
                        return;
                    }
                });
                try {


                    if (infSeguimiento.length > 0) {
                        try {
                            var obs = (screen.width * 9) / 100;
                            document.getElementById("totalRegistros").value = infSeguimiento.length;
                            $("#gridSeguimiento").kendoGrid({
                                dataSource: {
                                    data: infSeguimiento,
                                    pageSize: numeroFilasSeguimiento
                                },
                                scrollable: false,
                                pageable: {
                                    /* messages: {
                                        display: "Showing {0}-{1} from {2} data items"
                                      }, */
                                    input: true,
                                    numeric: false,

                                },
                                columns: [
                                    {
                                        title: "Cargar",
                                        //attributes: {style: "#= celdaColores(semaforo_alistamiento) #; width:7px;"},
                                        command: [{
                                            name: "carga",
                                            text: " ",
                                            imageClass: "fa fa-search",
                                            click: function (e) {
                                                try {
                                                    e.preventDefault();
                                                    var tr = $(e.target).closest('tr');
                                                    var dataItem = this.dataItem(tr);
                                                    kendo.ui.progress($("#vistaScreen"), true);
                                                    $(".bg-color").removeClass("bg-color")
                                                    setTimeout(function () {
                                                        $(e.target).closest('tr').addClass('bg-color');
                                                        ListarDatosCliente(dataItem);
                                                        ListarEstados(dataItem.chasis);
                                                        ListarVinAccesorios(dataItem.chasis);
                                                        ListarCausales(dataItem);
                                                        ListarCausalesNO(dataItem);
                                                        kendo.ui.progress($("#vistaScreen"), false);
                                                    }, 2000);
                                                } catch (f) {
                                                    alert("448 " + f);
                                                    kendo.ui.progress($("#vistaScreen"), false);
                                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                                }
                                            }
                                        }],
                                    },
                                    {
                                        title: "Aprobación",
                                        attributes: {style: "#= celdaColores(semaforo_alistamiento) #; width:7px;"},
                                        command: [{
                                            name: "obs",
                                            text: " ",
                                            imageClass: "fa fa-thumbs-o-up",

                                            visible: function (dataItem) {
                                                return dataItem.chasis != "0,"
                                            },
                                            click: function (e) {
                                                try {
                                                    e.preventDefault();
                                                    var tr = $(e.target).closest('tr');
                                                    var dataItem = this.dataItem(tr);
                                                    localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                                    kendo.ui.progress($("#vistaScreen"), true);
                                                    setTimeout(function () {
                                                        aprovar(dataItem);
                                                        //BuscarSeguimiento();
                                                        kendo.ui.progress($("#vistaScreen"), false);
                                                    }, 2000);

                                                } catch (f) {
                                                    alert(f);
                                                    kendo.ui.progress($("#vistaScreen"), false);
                                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                                    return;
                                                }
                                            }
                                        }],
                                    },
                                    {
                                        title: "Replica", attributes: {style: "#= celdaColores(semaforo_replica) #; width:7px;"},
                                        command: [{
                                            name: "rplc",
                                            text: " ",
                                            imageClass: "fa fa-handshake-o",

                                            visible: function (dataItem) {
                                                return dataItem.chasis != "0,"
                                            },
                                            click: function (e) {
                                                try {
                                                    e.preventDefault();
                                                    var tr = $(e.target).closest('tr');
                                                    var dataItem = this.dataItem(tr);
                                                    localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                                    kendo.ui.progress($("#vistaScreen"), true);
                                                    setTimeout(function () {
                                                        replica(dataItem);
                                                        //BuscarSeguimiento();
                                                        kendo.ui.progress($("#vistaScreen"), false);
                                                    }, 2000);

                                                } catch (f) {
                                                    alert(f);
                                                    kendo.ui.progress($("#vistaScreen"), false);
                                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                                    return;
                                                }
                                            }
                                        }],
                                    },
                                    {field: "chasis", width: "10px", title: "VIN"},
                                    {field: "nombre_cliente", width: "20px", title: "Nombre Cliente"},
                                    {field: "estado_ultimo_proceso", width: "20px", title: "Ultimo estado"},
                                    {field: "tipo_proceso", width: "10px", title: "Tipo Alistamiento"},
                                    {field: "fecha_factura", width: "15px", title: "Fecha factura"},
                                    {field: "dias_hoy_factura", width: "20px", title: "Días transcurridos"},
                                    {
                                        field: "valor_contra_entrega",
                                        width: "5px",
                                        title: "VNE",
                                        template: "#  if (valor_contra_entrega == true ) { # <center><span>SI</span></center> # } else { # <center><span>NO</span></center> #} #"
                                    },
                                    {field: "fecha_pago_completo", width: "20px", title: "Fecha pago completo"},
                                    {field: "dias_factura_pag_completo", width: "15px", title: "Días trans pago"},
                                    {field: "fecha_autoriza_alistamiento", width: "20px", title: "Fecha aut alist"},
                                    {
                                        field: "fecha_aprobacion_alistamiento",
                                        width: "15px",
                                        title: "Fecha alist",
                                        attributes: {style: "#= celdaColores(semaforo_alistamiento) #"}
                                    },
                                    {
                                        field: "fecha_real_aprob_alistamiento",
                                        width: "15px",
                                        title: "Fecha Replica",
                                        attributes: {style: "#= celdaColores(semaforo_replica) #"}
                                    },
                                    {
                                        field: "fecha_aprobacion_entrega",
                                        width: "25px",
                                        title: "Fecha aprobación entrega"
                                    },
                                    {
                                        field: "fecha_cita_entrega",
                                        width: "20px",
                                        title: "Fecha cita",
                                        attributes: {style: "#= celdaColores(semaforo_cita) #"}
                                    },
                                    {
                                        field: "fecha_real_alist_exhibicion",
                                        width: "35px",
                                        title: "Fecha real Exhibicion"
                                    },
                                    {field: "estado_alistamiento", width: "25px", title: "Estado Alistamiento"},
                                    {field: "replicado_alistamiento", width: "25px", title: "Estado Replica"},

                                ],
                            });
                            $("#gridSeguimiento .k-grid-header-wrap").css("overflow", "hidden");
                            $("#gridSeguimiento .k-grid-content").css("overflow-y", "scroll").css("overflow-x", "auto").scroll(function () {
                                var left = $(this).scrollLeft();
                                var wrap = $("#grid1 > .k-grid-header-wrap");
                                if (wrap.scrollLeft() != left) wrap.scrollLeft(left);
                            });
                            $("#gridSeguimiento").data("kendoGrid").wrapper.find(".k-grid-header-wrap").off("scroll.kendoGrid");
                            var tabstrip = $("#tabstripSeg").kendoTabStrip().data("kendoTabStrip");
                            tabstrip.enable(tabstrip.tabGroup.children().eq(1), false);
                            tabstrip.enable(tabstrip.tabGroup.children().eq(2), false);
                            tabstrip.enable(tabstrip.tabGroup.children().eq(3), false);
                            tabstrip.enable(tabstrip.tabGroup.children().eq(4), false);
                            tabstrip.enable(tabstrip.tabGroup.children().eq(5), false);
                            tabstrip.select(0);
                            document.getElementById("gridSeguimiento").style.display = "initial";
                            document.getElementById("contenidoGrid").style.display = "initial";
                        } catch (error) {
                            alert(error)
                            kendo.ui.progress($("#vistaScreen"), false);

                        }
                    }
                } catch (error) {
                    alert(error);
                }
                kendo.ui.progress($("#vistaScreen"), false);
                $("table").removeAttr("style");
                // precarga fin
            }, 2000);
        }
    }, 2000);
    kendo.ui.progress($("#vistaScreen"), false);
}

function replica(dataitem) {
    try {
        kendo.ui.progress($("#vistaScreen"), true);
        var fec = dataitem.fecha_aprobacion_alistamiento.split('-');
        var modfec = fec[2] + "-" + fec[1] + "-" + fec[0];
        var paramet = dataitem.codigo_empresa + ";;" + dataitem.chasis + ";" + modfec + ";" + dataitem.hora_aprobacion_alistamiento.replace(/:/g, '-') + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + dataitem.anio_vh26 + ";" + dataitem.numero_factura;
        var Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03ReplicaGet/5,json;" + paramet;

        setTimeout(function () {
            //  precarga inicio
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {

                        var resultado = data.vh03ReplicaGetResult; //data.vh03FacturasGetResult;
                        if (resultado.substring(0, 2) == "0," || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>4 ERROR</center>", resultado.substring(2, resultado.length));
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            var UrlConse = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh03ReplicaGet/6,json;" + paramet + ";" + resultado.replace(/\//g, '-');
                            $.ajax({
                                url: UrlConse,
                                type: "GET",
                                async: false,
                                dataType: "json",
                                success: function (data1) {
                                    try {
                                        var resultado = data1.vh03ReplicaGetResult; //data.vh03FacturasGetResult;
                                        if (resultado.substring(0, 2) == "0," || resultado == null) {
                                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>5 ERROR</center>", resultado.substring(2, resultado.length));
                                            kendo.ui.progress($("#vistaScreen"), false);
                                        } else {
                                            window.myalert("<center><i class=\"fa fa-thumbs-o-up\"></i>MENSAJE</center>", "Replica Exitosa");
                                            BuscarSeguimiento();
                                        }
                                    } catch (error) {
                                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Error en conexión");
                                        kendo.ui.progress($("#vistaScreen"), false);
                                    }
                                },
                                error: function (err) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Error en conexión");
                                    kendo.ui.progress($("#vistaScreen"), false);
                                    errorConex = true;
                                    kendo.ui.progress($("#vistaScreen"), false);
                                    //return;
                                }
                            });
                        }
                    } catch (error) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Error en conexión");
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    //return;
                }
            });
            kendo.ui.progress($("#vistaScreen"), false);
        }, 2000);
    } catch (error) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", error);
    }
    //BuscarSeguimiento();
}

function ListarDatosCliente(dataItem) {

    var datosCliente = "<table>" +
        "<tr><td><p><label class='w3-text-red'><b>Factura</b></label></p><p>" +
        "<input name='cli' type='text' id='facturaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Fecha Factura</b></label></p><p>" +
        "<input name='cli' type='text' id='fechaFacturaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Cliente</b></label></p><p>" +
        "<textarea name='nombreCliente' id='nombreCliente' style='width:200px;height:35px;text-align:lefth;padding-right:10px;' readonly maxlength='300'></textarea></p></td>" +
        /* "<input name='cli' type='text' id='nombreCliente' class='w3-input w3-border textos'"+   rows='2' cols='2'
        "style='width:200px;height:55px;text-align:right;padding-right:10px;' readonly/> </p></td>"+ */
        "<td><p><label class='w3-text-red'><b>Ruc/CI</b></label></p><p>" +
        "<input name='ruc' type='text' id='rucCli' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr>" +

        "<tr><td><p><label class='w3-text-red'><b>Dirección</b></label></p><p>" +
        "<textarea name='direccionCliente' id='direccionCliente' style='width:200px;height:50px;text-align:lefth;padding-right:10px;' readonly maxlength='300'></textarea></p></td>" +
        /* "<input name='dir' type='text' id='direccionCliente' class='w3-input w3-border textos'"+
        "style='width:200px;height:55px;text-align:right;padding-right:10px;' readonly/> </p></td>"+ */
        "<td><p><label class='w3-text-red'><b>Teléfono</b></label></p><p>" +
        "<textarea name='telfCliente' id='telfCliente' style='width:200px;height:50px;text-align:lefth;padding-right:10px;' readonly maxlength='300'></textarea></p></td>" +
        /* "<input name='tlf' type='text' id='telfCliente' class='w3-input w3-border textos'"+
        "style='width:200px;' readonly/> </p></td></tr><tr>"+ */
        /* "<td><p><label class='w3-text-red'><b>Teléfono Móvil</b></label></p><p>"+
        "<input name='tlm' type='text' id='telfMovilCliente' class='w3-input w3-border textos'"+
        "style='width:200px;' readonly/> </p></td>"+ */

        "<tr><td><p><label class='w3-text-red'><b>Chasis</b></label></p><p>" +
        "<input name='vin' type='text' id='vinCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Marca</b></label></p><p>" +
        "<input name='mrc' type='text' id='marcafCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Modelo</b></label></p><p>" +
        "<input name='mrc' type='text' id='modeloCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Versión</b></label></p><p>" +
        "<textarea name='versionCliente' id='versionCliente' style='width:200px;height:35px;text-align:lefth;padding-right:10px;' readonly maxlength='300'></textarea></p></td>" +
        /* "<input name='ver' type='text' id='versionCliente' class='w3-input w3-border textos'"+
        "style='width:300px;' readonly/> </p></td> */"</tr>" +

        "<tr><td><p><label class='w3-text-red'><b>Motor</b></label></p><p>" +
        "<input name='mtr' type='text' id='motorCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Color</b></label></p><p>" +
        "<input name='col' type='text' id='colorCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Año Modelo</b></label></p><p>" +
        "<input name='mod' type='text' id='modeloAnioCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Línea</b></label></p><p>" +
        "<input name='ver' type='text' id='lineaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr>" +

        "<tr><td><p><label class='w3-text-red'><b>País Orígen</b></label></p><p>" +
        "<input name='org' type='text' id='paisCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Cilindraje</b></label></p><p>" +
        "<input name='cil' type='text' id='cilindrajeCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Tonelaje</b></label></p><p>" +
        "<input name='ton' type='text' id='tonelajeCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Clase</b></label></p><p>" +
        "<input name='cla' type='text' id='claseCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr>" +

        "<tr><td><p><label class='w3-text-red'><b>Subtipo Clase</b></label></p><p>" +
        "<input name='subt' type='text' id='subtipoCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Tipo Combustible</b></label></p><p>" +
        "<input name='tic' type='text' id='combustiblejeCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        /* "<td></td><td><p><label class='w3-text-red'><b>Capacidad Pasajeros</b></label></p><p>"+
        "<input name='cap' type='text' id='capacidadCliente' class='w3-input w3-border textos'"+
        "style='width:200px;' readonly/> </p></td>"+ */
        "</tr>" +

        "<tr><td><p><label class='w3-text-red'><b>Fecha Austoriza Alistamiento</b></label></p><p>" +
        "<input name='ali' type='text' id='alistamientoCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Usuario Aut Alistamiento</b></label></p><p>" +
        "<input name='usu' type='text' id='usuarioCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Fecha Alistamiento</b></label></p><p>" +
        "<input name='apr' type='text' id='aprobacionCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Usuario Alistamiento</b></label></p><p>" +
        "<input name='uap' type='text' id='usuarioAprobacionCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr>" +

        "<tr><td><p><label class='w3-text-red'><b>Fecha Orden Salida</b></label></p><p>" +
        "<input name='ent' type='text' id='entregaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Usuario Orden Salida</b></label></p><p>" +
        "<input name='uen' type='text' id='usuarioEntregaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr><tr>" +
        "<td><p><label class='w3-text-red'><b>Fecha Cita</b></label></p><p>" +
        "<input name='apr' type='text' id='citaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td>" +
        "<td><p><label class='w3-text-red'><b>Hora Cita</b></label></p><p>" +
        "<input name='uci' type='text' id='usuarioCitaCliente' class='w3-input w3-border textos'" +
        "style='width:200px;' readonly/> </p></td></tr>";
    datosCliente += "</table>";

    document.getElementById("tablaDatosCliente").innerHTML = datosCliente;
    llamarColorTexto(".w3-text-red");
    try {
        var nombre = dataItem.nombre_cliente.split(',');
        var vercliente = dataItem.version.split('+');
        var versionCli = "";
        for (let index = 0; index < vercliente.length; index++) {
            versionCli += "  " + vercliente[index];
        }
        var nomape;
        if (nombre.length == 4) {
            nomape = nombre[2] + "  " + nombre[3] + "  " + nombre[0] + "  " + nombre[1];
        } else {
            if (nombre.length == 3) {
                nomape = nombre[2] + "  " + nombre[0] + "  " + nombre[1];
            } else {
                nomape = nombre[0] + "  " + nombre[1];
            }

        }
        document.getElementById("fechaFacturaCliente").value = dataItem.fecha_factura;
        document.getElementById("facturaCliente").value = dataItem.referencia;
        document.getElementById("nombreCliente").value = nomape;
        document.getElementById("rucCli").value = dataItem.identifica;
        document.getElementById("direccionCliente").value = dataItem.direccion_cliente + "  " + dataItem.numero_calle_cliente + "  " + dataItem.calle_interseccion_cliente + "  " + dataItem.ciudad_cliente;
        document.getElementById("telfCliente").value = dataItem.telefono_cliente + "                      " + dataItem.persona_telefono_movil;
        //document.getElementById("telfMovilCliente").value = dataItem.persona_telefono_movil ;
        document.getElementById("vinCliente").value = dataItem.chasis;
        document.getElementById("marcafCliente").value = dataItem.codigo_marca;
        document.getElementById("modeloCliente").value = dataItem.descripcion_factura;
        document.getElementById("versionCliente").value = versionCli;
        document.getElementById("motorCliente").value = dataItem.numero_motor;
        document.getElementById("colorCliente").value = dataItem.color_vehiculo;
        document.getElementById("modeloAnioCliente").value = dataItem.anio_modelo;
        document.getElementById("lineaCliente").value = dataItem.codigo_familia;
        document.getElementById("paisCliente").value = dataItem.pais_origen_vehiculo;
        document.getElementById("cilindrajeCliente").value = dataItem.cilindraje;
        document.getElementById("tonelajeCliente").value = dataItem.carga_util;
        document.getElementById("claseCliente").value = dataItem.descripcion_grupo;
        document.getElementById("subtipoCliente").value = dataItem.descripcion_tipo_auto;
        document.getElementById("combustiblejeCliente").value = dataItem.tipo_combustible;
        document.getElementById("capacidadCliente").value = dataItem.capacidad_pasajeros;
        document.getElementById("alistamientoCliente").value = dataItem.fecha_autoriza_alistamiento;
        document.getElementById("usuarioCliente").value = dataItem.usuario_autoriza_alistamiento;
        document.getElementById("aprobacionCliente").value = dataItem.fecha_aprobacion_alistamiento;
        document.getElementById("usuarioAprobacionCliente").value = dataItem.usuario_aprobacion_alistamiento;
        document.getElementById("entregaCliente").value = dataItem.fecha_aprobacion_entrega;
        document.getElementById("usuarioEntregaCliente").value = dataItem.usuario_aprobacion_entrega;
        document.getElementById("citaCliente").value = dataItem.fecha_cita_entrega;
        document.getElementById("usuarioCitaCliente").value = dataItem.hora_cita_entrega;
        document.getElementById("tablaDatosCliente").style.display = "initial";

    } catch (error) {

    }
}

function celdaColores(color) {
    var colorCel = "background-color:transparent;";
    if (color == "ROJO") {
        colorCel = "background-color:#B91824;";
    }
    return colorCel;
}

/*--------------------------------------------------------------------
Fecha: 05/03/2020
Descripción: Devuelve la fecha actual en formato dd-mm-yyyy
--------------------------------------------------------------------*/
function setearValorFecha() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //Enero is 0
    var yyyy = today.getFullYear();
    if (dd < 10)
        dd = '0' + dd;

    if (mm < 10)
        mm = '0' + mm;

    return dd + '-' + mm + '-' + yyyy;
}

function GuardarCausal() {
    try {
        var dataItemCau = JSON.parse(localStorage.getItem("dataItemCausal"));
        //var pppp = document.getElementById("causalesvh").options[document.getElementById("causalesvh").selectedIndex].innerHTML;
        var causalOpt = document.getElementById("causalesvh").value;
        var causalObs = document.getElementById("observacionCausal").value;
        //var empsucagen1 = dataItemCau.codigo_empresa+";"+dataItemCau.codigo_sucursal+";"+dataItemCau.codigo_agencia+";"+"ENTREGADORES;"+localStorage.getItem("ls_usulog").toLocaleString()+";"+dataItemCau.anio_vh26+";"+dataItemCau.numero_factura+";"+dataItemCau.secuencia_detalle+";"+dataItemCau.chasis+";"+causalOpt+";"+causalObs;
        var Url1 = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet";
        var infSeguimiento;
        var datosObser = {
            "modo": "3",
            "archivo": "json",
            "empresa": dataItemCau.codigo_empresa,
            "sucursal": dataItemCau.codigo_sucursal,
            "agencia": dataItemCau.codigo_agencia,
            "tipo": "ENTREGADORES",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": dataItemCau.anio_vh26,
            "factura": dataItemCau.numero_factura,
            "secuencia": dataItemCau.secuencia_detalle,
            "chasis": dataItemCau.chasis,
            "causal": causalOpt,
            "observacion": causalObs
        };

        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {

            $.ajax({
                url: Url1,
                type: "POST",
                async: true,
                dataType: "json",
                data: JSON.stringify(datosObser),
                 headers: {
                     'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        var resultado = data; //data.vh03FacturasGetResult;
                        if (resultado != "1,Success" || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>6 ERROR</center>", resultado);
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            //infSeguimiento = (JSON.parse(data.cc17CausalesGetResult)).tvh03; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                            window.myalert("<center><i class=\"fa fa-id-card\"></i>MENSAJE</center>", "Registro grabado exitosamente");

                            document.getElementById("observacionCausal").value = "";
                            document.getElementById("observacionCausal").innerHTML = "";
                            ListarCausales(dataItemCau);
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });
            kendo.ui.progress($("#vistaScreen"), false);
        }, 2000);
    } catch (error) {

    }

}

function GuardarCausalNO() {
    try {
        var dataItemCauNO = JSON.parse(localStorage.getItem("dataItemCausalNO"));
        //var pppp = document.getElementById("causalesvh").options[document.getElementById("causalesvh").selectedIndex].innerHTML;
        var causalOpt = document.getElementById("causalesvhNO").value;
        var causalObs = document.getElementById("observacionCausalNO").value;
        //var empsucagen1 = dataItemCau.codigo_empresa+";"+dataItemCau.codigo_sucursal+";"+dataItemCau.codigo_agencia+";"+"ENTREGADORES;"+localStorage.getItem("ls_usulog").toLocaleString()+";"+dataItemCau.anio_vh26+";"+dataItemCau.numero_factura+";"+dataItemCau.secuencia_detalle+";"+dataItemCau.chasis+";"+causalOpt+";"+causalObs;
        var Url1 = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet";
        ///alert(Url1)
        var infSeguimiento;
        var datosObser = {
            "modo": "4",
            "archivo": "json",
            "empresa": dataItemCauNO.codigo_empresa,
            "sucursal": dataItemCauNO.codigo_sucursal,
            "agencia": dataItemCauNO.codigo_agencia,
            "tipo": "NO_ENTREGA_VH",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": dataItemCauNO.anio_vh26,
            "factura": dataItemCauNO.numero_factura,
            "secuencia": dataItemCauNO.secuencia_detalle,
            "chasis": dataItemCauNO.chasis,
            "causal": causalOpt,
            "observacion": causalObs
        };

        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {

            $.ajax({
                url: Url1,
                type: "POST",
                async: true,
                dataType: "json",
                data: JSON.stringify(datosObser),
                 headers: {
                     'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    //alert(data);
                    try {
                        var resultado = data; //data.vh03FacturasGetResult;
                        if (resultado != "1,Success" || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>6 ERROR</center>", resultado);
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            //infSeguimiento = (JSON.parse(data.cc17CausalesGetResult)).tvh03; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                            window.myalert("<center><i class=\"fa fa-id-card\"></i>MENSAJE</center>", "Registro grabado exitosamente");

                            document.getElementById("observacionCausalNO").value = "";
                            document.getElementById("observacionCausalNO").innerHTML = "";
                            ListarCausalesNO(dataItemCauNO);
                        }
                    } catch (error) {
                        alert(error);
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    alert(err);
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });
            kendo.ui.progress($("#vistaScreen"), false);
        }, 2000);
    } catch (error) {

    }

}

function aprovar(dataItem) {
    try {
        kendo.ui.progress($("#vistaScreen"), true);
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(dataItem));
        var paramet = dataItem.codigo_empresa + ";" + dataItem.codigo_sucursal + ";" + dataItem.codigo_agencia + ";" + dataItem.anio_vh26 + ";" + dataItem.numero_factura + ";" + dataItem.secuencia_detalle + ";" + dataItem.chasis + ";" + dataItem.referencia + ";" + localStorage.getItem("ls_usulog").toLocaleString();
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh06VehiculoGet/2,json;" + paramet;
        setTimeout(function () {
            //alert(Url);
            //  precarga inicio
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        var resultado = data.vh06VehiculoGetResult; //data.vh03FacturasGetResult;
                        if (resultado.substring(0, 2) == "0," || resultado == null) {
                            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>7 ERROR</center>", resultado.substring(2, resultado.length));
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            window.myalert("<center><i class=\"fa fa-thumbs-o-up\"></i>MENSAJE</center>", "Aprobación correcta");
                            infSeguimiento = (JSON.parse(data.vh06VehiculoGetResult)).tvh03; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                            BuscarSeguimiento();
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Error en conexión 1");
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "Error en conexión 2");
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });
            kendo.ui.progress($("#vistaScreen"), false);
        }, 2000);
    } catch (error) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>8 ERROR</center>", error);
    }
}

function ListarCausalesNO(dataItem) {
    try {
        // Grid VIN
        var grid2 = $("#gridSeguimientoLlamadasNO").data("kendoGrid");
        grid2.destroy();
    } catch (evin) {
    }
    try {
        localStorage.removeItem("dataItemCausalNO");
    } catch (error) {

    }
    try {

        document.getElementById("gridSeguimientoLlamadasNO").innerHTML = "";
        document.getElementById("totalRegistrosLlamadasNO").innerHTML = "";
        localStorage.setItem("dataItemCausalNO", JSON.stringify(dataItem));
        document.getElementById("consultaCausalNO").style.display = "initial";
        var empsucagen1 = dataItem.codigo_empresa + ";" + dataItem.codigo_sucursal + ";" + dataItem.codigo_agencia + ";" + "ENTREGADORES;" + localStorage.getItem("ls_usulog").toLocaleString() + ";" + dataItem.anio_vh26 + ";" + dataItem.numero_factura + ";" + dataItem.secuencia_detalle + ";" + dataItem.chasis;
        //var empsucagen = dataItem.codigo_empresa+";"+dataItem.codigo_sucursal+";"+dataItem.codigo_agencia+";"+"ENTREGADORES;"+localStorage.getItem("ls_usulog").toLocaleString();
        var Url1 = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet";
        var datosObser = {
            "modo": "2",
            "archivo": "json",
            "empresa": dataItem.codigo_empresa,
            "sucursal": dataItem.codigo_sucursal,
            "agencia": dataItem.codigo_agencia,
            "tipo": "NO_ENTREGA_VH",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": dataItem.anio_vh26,
            "factura": dataItem.numero_factura,
            "secuencia": dataItem.secuencia_detalle,
            "chasis": dataItem.chasis,
            "causal": "",
            "observacion": ""
        };
        var infSeguimientoList;
        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {
            //  precarga inicio
            $.ajax({
                url: Url1,
                type: "POST",
                async: false,
                dataType: "json",
                data: JSON.stringify(datosObser),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        //alert(data);
                        var resultado = data; //data.vh03FacturasGetResult;
                        if (resultado == "0,No existen datos," || resultado == null) {
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            infSeguimientoList = (JSON.parse(data)).tcc17; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", resultado);
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });

            if (infSeguimientoList.length > 0) {
                try {
                    document.getElementById("totalRegistrosLlamadasNO").value = infSeguimientoList.length;
                    var obs = (screen.width * 9) / 100;
                    $("#gridSeguimientoLlamadasNO").kendoGrid({
                        dataSource: {
                            data: infSeguimientoList,
                            pageSize: numeroFilasSeguimiento
                        },
                        scrollable: false,
                        pageable: {
                            input: true,
                            numeric: false
                        },
                        columns: [
                            {field: "causal", title: "Causal", width: "15px"},
                            {field: "descripcion_causal", title: "Descripción", width: "25px"},
                            {field: "fecha_gestion", title: "Fecha Gestión", width: "15px"},
                            {field: "hora_gestion", title: "Hora Gestión", width: "15px"},
                            {field: "observaciones", title: "Observaciones", width: "100px"},
                        ]
                    });
                    document.getElementById("gridSeguimientoLlamadasNO").style.display = "initial";

                } catch (error) {
                    kendo.ui.progress($("#vistaScreen"), false);

                }
            }
            kendo.ui.progress($("#vistaScreen"), false);
            // precarga fin
        }, 2000);
    } catch (error) {

    }
}
function ListarCausales(dataItem) {
    try {
        // Grid VIN
        var grid2 = $("#gridSeguimientoLlamadas").data("kendoGrid");
        grid2.destroy();
    } catch (evin) {
    }
    try {
        localStorage.removeItem("dataItemCausal");
    } catch (error) {

    }
    try {

        document.getElementById("gridSeguimientoLlamadas").innerHTML = "";
        document.getElementById("totalRegistrosLlamadas").innerHTML = "";
        localStorage.setItem("dataItemCausal", JSON.stringify(dataItem));
        document.getElementById("consultaCausal").style.display = "initial";
        var empsucagen1 = dataItem.codigo_empresa + ";" + dataItem.codigo_sucursal + ";" + dataItem.codigo_agencia + ";" + "ENTREGADORES;" + localStorage.getItem("ls_usulog").toLocaleString() + ";" + dataItem.anio_vh26 + ";" + dataItem.numero_factura + ";" + dataItem.secuencia_detalle + ";" + dataItem.chasis;
        //var empsucagen = dataItem.codigo_empresa+";"+dataItem.codigo_sucursal+";"+dataItem.codigo_agencia+";"+"ENTREGADORES;"+localStorage.getItem("ls_usulog").toLocaleString();
        var Url1 = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/cc17CausalesGet";
        var datosObser = {
            "modo": "2",
            "archivo": "json",
            "empresa": dataItem.codigo_empresa,
            "sucursal": dataItem.codigo_sucursal,
            "agencia": dataItem.codigo_agencia,
            "tipo": "ENTREGADORES",
            "usuario": localStorage.getItem("ls_usulog").toLocaleString(),
            "anio26": dataItem.anio_vh26,
            "factura": dataItem.numero_factura,
            "secuencia": dataItem.secuencia_detalle,
            "chasis": dataItem.chasis,
            "causal": "",
            "observacion": ""
        };
        var infSeguimientoList;
        kendo.ui.progress($("#vistaScreen"), true);
        setTimeout(function () {
            //  precarga inicio
            $.ajax({
                url: Url1,
                type: "POST",
                async: false,
                dataType: "json",
                data: JSON.stringify(datosObser),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                success: function (data) {
                    try {
                        //alert(data);
                        var resultado = data; //data.vh03FacturasGetResult;
                        if (resultado == "0,No existen datos," || resultado == null) {
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                            kendo.ui.progress($("#vistaScreen"), false);
                        } else {
                            infSeguimientoList = (JSON.parse(data)).tcc17; //(JSON.parse(data.vh03FacturasGetResult)).tvh03;
                            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", inspeccionar(infSeguimiento[0]));
                        }
                    } catch (error) {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", resultado);
                        kendo.ui.progress($("#vistaScreen"), false);
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#vistaScreen"), false);
                    errorConex = true;
                    kendo.ui.progress($("#vistaScreen"), false);
                    return;
                }
            });

            if (infSeguimientoList.length > 0) {
                try {
                    document.getElementById("totalRegistrosLlamadas").value = infSeguimientoList.length;
                    var obs = (screen.width * 9) / 100;
                    $("#gridSeguimientoLlamadas").kendoGrid({
                        dataSource: {
                            data: infSeguimientoList,
                            pageSize: numeroFilasSeguimiento
                        },
                        scrollable: false,
                        pageable: {
                            input: true,
                            numeric: false
                        },
                        columns: [
                            {field: "causal", title: "Causal", width: "15px"},
                            {field: "descripcion_causal", title: "Descripción", width: "25px"},
                            {field: "fecha_gestion", title: "Fecha Gestión", width: "15px"},
                            {field: "hora_gestion", title: "Hora Gestión", width: "15px"},
                            {field: "observaciones", title: "Observaciones", width: "100px"},
                        ]
                    });
                    document.getElementById("gridSeguimientoLlamadas").style.display = "initial";

                } catch (error) {
                    kendo.ui.progress($("#vistaScreen"), false);

                }
            }
            kendo.ui.progress($("#vistaScreen"), false);
            // precarga fin
        }, 2000);
    } catch (error) {

    }
}

/*--------------------------------------------------------------------
Fecha: 12/03/2020
Descripción: Buscar VIN referente con *
--------------------------------------------------------------------*/
function ListarVinSeguimientoNuevos(strVIN) {
    try {
        // Grid VIN
        var grid2 = $("#gridSeguimientoInicial").data("kendoGrid");
        grid2.destroy();
    } catch (evin) {
    }

    document.getElementById("gridSeguimientoInicial").innerHTML = "";

    strVIN = strVIN.replace('*', ' ').trim();

    if (strVIN.length < numeroCaracteresMinimo) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese m&iacute;nimo " + numeroCaracteresMinimo + " caracteres");
        kendo.ui.progress($("#vistaScreen"), false);
        return;
    }

    var UrlVIN = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";";

    if (localStorage.getItem("ls_listavin_rec") != undefined && localStorage.getItem("ls_listavin_rec").toLocaleString() == "1") {
        localStorage.setItem("ls_listavin_rec", "0");
        UrlVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";";
    }

    var infVINResp = "";
    var obs = (screen.width * 9) / 100;
    var fecha = (screen.width * 14) / 100;
    var ot = (screen.width * 17) / 100;

    $.ajax({
        url: UrlVIN,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                infVINResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
            } catch (e) {
                kendo.ui.progress($("#vistaScreen"), false);
                if (localStorage.getItem("ls_listavin_rec") != undefined && localStorage.getItem("ls_listavin_rec").toLocaleString() == "0") {
                    infVINResp = "";
                    return;
                }
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vistaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>9 ERROR</center>", err);
            return;
        }
    });

    if (infVINResp.length > 0) {

        $("#gridSeguimientoInicial").kendoGrid({
            dataSource: {
                data: infVINResp,
                pageSize: 5
            },
            scrollable: false,
            pageable: false,

            columns: [
                {
                    title: "", width: obs,
                    command: [{
                        name: "obs",
                        text: " ",
                        imageClass: "fa fa-search-plus",

                        visible: function (dataItem) {
                            return dataItem.chasis != "0,"
                        },
                        click: function (e) {
                            try {
                                e.preventDefault();
                                var tr = $(e.target).closest('tr');
                                var dataItem = this.dataItem(tr);
                                localStorage.setItem("dataItem", JSON.stringify(dataItem));
                                kendo.ui.progress($("#vistaScreen"), true);
                                setTimeout(function () {
                                    document.getElementById("conFecha").checked = false;
                                    TraerInformacionSeguimiento(dataItem.chasis);
                                }, 2000);

                            } catch (f) {
                                kendo.ui.progress($("#vistaScreen"), false);
                                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                return;
                            }
                        }
                    }],
                },

                {field: "chasis", title: "VIN", width: "100px"},
                {field: "nombre_propietario", title: "Propietario"},
            ]
        });

        if (localStorage.getItem("ls_listavin_rec") != undefined) {
            localStorage.removeItem("ls_listavin_rec");
        }
        document.getElementById("gridSeguimientoInicial").style.display = "initial";
        kendo.ui.progress($("#vistaScreen"), false);
    } else {
        if (localStorage.getItem("ls_listavin_rec") != undefined && localStorage.getItem("ls_listavin_rec").toLocaleString() == "0") {
            kendo.ui.progress($("#vistaScreen"), false);
            localStorage.removeItem("ls_listavin_rec");
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
            return;
        } else {
            kendo.ui.progress($("#vistaScreen"), false);
            localStorage.setItem("ls_listavin_rec", "1");
            listaVin(strVIN);
            return;
        }
    }

    /*   $('#targetSeg').show(1000);
      $('.targetSeg').show("fast");
      document.getElementById("divControlesSeg").style.display = 'initial';
   */

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnGuardaInfo").innerHTML = "<button id='btnRegresarCausal0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarCausal0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
            "<button id='btnRegresarCausal1' onclick='vaciaCampos();' class='w3-btn'><i id='icnRegresarCausal1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    } else {
        document.getElementById("btnGuardaInfo").innerHTML = "<button id='btnRegresarCausal0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarCausal0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
            "<button id='btnRegresarCausal1' onclick='vaciaCampos();' class='w3-btn'><i id='icnRegresarCausal1' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestilo("btnRegresarCausal");
    llamarNuevoestiloIconB("icnRegresarCausal");
}

/*--------------------------------------------------------------------
Fecha: 12/03/2020
Descripción: LLamada a la funcion de busqueda general desde Grid
--------------------------------------------------------------------*/
function TraerInformacionSeguimiento(parametro) {
    document.getElementById('vinSeguimiento').value = parametro;
    BuscarSeguimiento();
}


/*--------------------------------------------------------------------
Fecha: 07/04/2020
Descripción: Buscar accesorios por VIN
--------------------------------------------------------------------*/
function ListarVinAccesorios(strVIN) {
    try {
        // Grid VIN
        var grid2 = $("#gridSeguimientoAccesorios").data("kendoGrid");
        grid2.destroy();
    } catch (evin) {
    }

    document.getElementById("gridSeguimientoAccesorios").innerHTML = "";
    document.getElementById("totalRegistrosAccesorios").innerHTML = "";
    var UrlVINAccesorio = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh51VehiculoGet/8,JSON;" +
        localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
        strVIN + ";" + localStorage.getItem("ls_usulog").toLocaleString() + ";;";

    // Llave = json;1;KN123456901234567;RRODRIGUEZ;;

    var infVINAccesorio = "";
    //  var obs = (screen.width * 9) / 100;

    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ACCESORIOS</center>", UrlVINAccesorio);


    $.ajax({
        url: UrlVINAccesorio,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                infVINAccesorio = (JSON.parse(data.vh51VehiculoGetResult)).tvh51;
            } catch (e) {
                kendo.ui.progress($("#vistaScreen"), false);
                if (localStorage.getItem("ls_listavin_rec") != undefined && localStorage.getItem("ls_listavin_rec").toLocaleString() == "0") {
                    infVINAccesorio = "";
                    return;
                }
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vistaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>10 ERROR</center>", err);
            return;
        }
    });

    if (infVINAccesorio.length > 0) {
        document.getElementById("totalRegistrosAccesorios").value = infVINAccesorio.length;
        var gridAccesorios = $("#gridSeguimientoAccesorios").kendoGrid({
            dataSource: {
                data: infVINAccesorio,
                pageSize: numeroFilasSeguimiento
            },
            scrollable: false,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                {field: "chasis", title: "VIN"},
                {field: "tipo_registro", title: "Tipo registro"},
                {field: "tipo_item", title: "Tipo Item"},
                {field: "nombre_item", title: "Nombre Item"},
                {field: "partno_proveedor", title: "Proveedor"},
                {field: "cantidad", title: "Cantidad"},
                {field: "responsable_accesorio", title: "Responsable Accesorio"},
                {field: "tipo_accesorio", title: "Tipo Accesorio"},
                //{ field: "costo_entrega", title: "Costo Entrega" },
                {field: "estado", title: "Estado"},
                //  { field: "numero_factura_vh26", title: "numero_factura_vh26" },
                //{ field: "referencia_vh26", title: "Factura" },
                //{ field: "costo_unitario", title: "costo_unitario" },
                //{ field: "costo_componente", title: "costo_componente" },
                {field: "tercero_factura_a", title: "Tercero factura"},
                {field: "estado_instalacion", title: "Estado instalación"},
                {field: "estado_posteo", title: "Estado posteo"}
            ],

        });

        document.getElementById("gridSeguimientoAccesorios").style.display = "initial";
        var tabstrip = $("#tabstripSeg").kendoTabStrip().data("kendoTabStrip");
        tabstrip.enable(tabstrip.tabGroup.children().eq(1), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(2), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(3), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(4), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(5), true);
        tabstrip.select(0);

    } else {
        kendo.ui.progress($("#vistaScreen"), false);
        localStorage.removeItem("ls_listavin_rec");
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado accesorios");
        return;

    }


}

function ListarEstados(strVIN) {
    try {
        // Grid VIN
        var grid2 = $("#gridEstadosAsociados").data("kendoGrid");
        grid2.destroy();
    } catch (evin) {
    }

    document.getElementById("gridEstadosAsociados").innerHTML = "";
    document.getElementById("totalRegistrosAsociados").innerHTML = "";
    var UrlVINEstados = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/qvh70SmsGet/1,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + strVIN + ";";
    var infVINEstados;
    //  var obs = (screen.width * 9) / 100;

    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ACCESORIOS</center>", UrlVINEstados);
    $.ajax({
        url: UrlVINEstados,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            infVINEstados = data.qvh70SmsGetResult;
            if (infVINEstados == "0,No existen datos,") {
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>ERROR</center>", "No existen datos");
                kendo.ui.progress($("#vistaScreen"), false);
            } else {
                infVINEstados = (JSON.parse(data.qvh70SmsGetResult)).tvh70;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vistaScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>0 ERROR</center>", err);
            return;
        }
    });

    if (infVINEstados.length > 0) {
        document.getElementById("totalRegistrosAsociados").value = infVINEstados.length;
        var gridEstados = $("#gridEstadosAsociados").kendoGrid({
            dataSource: {
                data: infVINEstados,
                pageSize: numeroFilasSeguimiento
            },
            scrollable: false,
            pageable: {
                input: true,
                numeric: false
            },
            columns: [
                {field: "chasis", title: "VIN", width: 2},
                {field: "tipo_registro", title: "Tipo Registro", width: 2},
                {field: "subtipo_registro", title: "Sub Tipo Registro", width: 2},
                {field: "causal_rebote", title: "Causal Rebote", width: 2},
                {field: "fecha_registro", title: "Fecha Registro", width: 2},
                {field: "fecha_proceso", title: "Fecha Proceso", width: 2},
                {field: "observaciones", title: "Observaciones", width: 2},
                {field: "persona_nombre_responsable", title: "Nombre Responsable", width: 2},
                {field: "placa", title: "PLACA", width: 2}
            ],
        });

        document.getElementById("gridEstadosAsociados").style.display = "initial";
        var tabstrip = $("#tabstripSeg").kendoTabStrip().data("kendoTabStrip");
        tabstrip.enable(tabstrip.tabGroup.children().eq(1), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(2), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(3), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(4), true);
        tabstrip.enable(tabstrip.tabGroup.children().eq(5), true);
        tabstrip.select(0);

    } else {
        kendo.ui.progress($("#vistaScreen"), false);
        localStorage.removeItem("ls_listavin_rec");
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado estados");
        return;

    }
}

function handleMask(event, mask) {
    with (event) {
        stopPropagation()
        preventDefault()
        if (!charCode) return
        var c = String.fromCharCode(charCode)
        if (c.match(/\D/)) return
        with (target) {
            var val = value.substring(0, selectionStart) + c + value.substr(selectionEnd)
            var pos = selectionStart + 1
        }
    }
    var nan = count(val, /\D/, pos) // nan va calcolato prima di eliminare i separatori
    val = val.replace(/\D/g, '')

    var mask = mask.match(/^(\D*)(.+9)(\D*)$/)
    if (!mask) return // meglio exception?
    if (val.length > count(mask[2], /9/)) return

    for (var txt = '', im = 0, iv = 0; im < mask[2].length && iv < val.length; im += 1) {
        var c = mask[2].charAt(im)
        txt += c.match(/\D/) ? c : val.charAt(iv++)
    }

    with (event.target) {
        value = mask[1] + txt + mask[3]
        selectionStart = selectionEnd = pos + (pos == 1 ? mask[1].length : count(value, /\D/, pos) - nan)
    }

    function count(str, c, e) {
        e = e || str.length
        for (var n = 0, i = 0; i < e; i += 1) if (str.charAt(i).match(c)) n += 1
        return n
    }
}

// END_CUSTOM_CODE_vista
