var resp = "Error";
var respimagen;
var validaServicios = 1;
var inforModelos = "";
var inforImprime = "";
var tamano = "";
var dataRespuesta;
var usadoFormulario;
var dataRespuesta1 = "";
console.log("entro");
app.avaluo = kendo.observable({
    onShow: function () {
        try {
            llamarNuevoestilo("btnBuscarAvaluo");
            llamarNuevoestiloIconB("icnBuscarAvaluo");
            llamarColorTexto(".w3-text-red")
            localStorage.setItem("bandera","1");
            kendo.ui.progress($("#avaluoScreen"), false)
            document.getElementById("tabstripUsaAVA").style.display = "none";
            if (localStorage.getItem("ls_verRecepcion").toLocaleString() == "0") {
                usadoFormulario = "";
                vaciaCamposUsa();
                //marcas
                marcaVheUsa(localStorage.getItem("ls_verRecepcion").toLocaleString());
                //modelo
                cboModeloVheUsa(document.getElementById("marcasUsa").value, "A4");
                //color
                cboColoresUsa("AZUL");
                //Ubicacion
                cboUbicacionUsa("ORELLANA");
                //transmision
                cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionAV2","","dbotransmisionAV");
                //traccion
                cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnAV2","","dboTraccionAV");
                //subclase
                cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseAV2","","dboCarroceriaAV");
                //grupo auto
                cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseAV2","","dboClaseAV");
                //combustible
                cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleAV2","","dboCombustibleAV");

                var today = new Date();
                var hora = today.getHours();
                var minu = today.getMinutes();
                var segu = today.getSeconds();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //Enero is 0
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                document.getElementById("fecha_modificaUsa").value = yyyy + '-' + mm + '-' + dd + '  ' + hora + ':' + minu + ':' + segu;

            }
            else {
                localStorage.setItem("ls_verRecepcion", "0");
            }
            document.getElementById('infoPlacasVINUsa').value = registroavaluo.placa;
            llamarUSAD(registroavaluo.placa); 
        } catch (e) {
            alert("1"+e);
        }
    },
    afterShow: function () { }
});
app.localization.registerView('avaluo');

function onDeviceReady() {
    $(document).ready(function () {
        $("#tabstripUsaAVA").kendoTabStrip({
            animation: {
                open: {
                    effects: "fadeIn"
                }
            }
        });
    });
    //---------------------------------------------------------------------------
    // resetControls("");
    navigator.splashscreen.hide();
    var app = new App();
    app.run();
}
function marcaVheUsa(selMarca) {
    try {
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;";
        //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
        var inforMarca;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforMarca = (JSON.parse(data.ComboParametroEmpGetResult));
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (inforMarca.length > 0) {
            var cboMarcaHTML = "<p><select id='marcasUsa' onchange='cboModeloVheUsa(this.value)' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforMarca.length; i++) {
                if (selMarca == inforMarca[i].CodigoClase) {
                    cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "' selected>" + inforMarca[i].NombreClase + "</option>";
                }
                else {
                    cboMarcaHTML += "<option  value='" + inforMarca[i].CodigoClase + "'>" + inforMarca[i].NombreClase + "</option>";
                }
            }
            cboMarcaHTML += "</select>";
            document.getElementById("divcbomarcasUsa").innerHTML = cboMarcaHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
        }
    } catch (e) {
        alert("marca" + e);
    }
}
function cboModeloVheUsa(itmMarca, selModelo) {
    try {
        if (itmMarca != "") {
            var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
            //"http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;" + itmMarca;
            inforModelos = "";
            $.ajax({
                url: UrlCboModelos,
                type: "GET",
                dataType: "json",
                async: false,
                success: function (data) {
                    try {
                        inforModelos = JSON.parse(data.in11ModelosGetResult);
                    } catch (e) {
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Modelos");
                        return;
                    }
                },
                error: function (err) {
                    alert(err);
                    return;
                }
            });
            if (inforModelos.length > 0) {
                cboModelosHTML = "<p><select id='modeloUsa' onchange='cboDescVheUsa(this.value)' class='w3-input w3-border textos'>";
                var banDescr = 0;
                for (var i = 0; i < inforModelos.length; i++) {
                    if (inforModelos[i].CodigoClase != " " || inforModelos[i].CodigoClase != "ninguna") {
                        if (selModelo == inforModelos[i].CodigoClase) {
                            cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "' selected>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                            document.getElementById("desmodeloUsa").value = inforModelos[i].NombreClase;
                            banDescr = 1;
                        }
                        else {
                            cboModelosHTML += "<option  value='" + inforModelos[i].CodigoClase + "'>" + inforModelos[i].CodigoClase + " (" + inforModelos[i].NombreClase + ")" + "</option>";
                        }
                    }
                }
                cboModelosHTML += "</select>";
            }
            else {
                cboModelosHTML = "<p><select id='modeloUsa' class='w3-input w3-border textos'>";
                cboModelosHTML += "<option  value=' '>Ninguna</option>";
                cboModelosHTML += "</select>";
            }
        }
        document.getElementById("divcboModeloUsa").innerHTML = cboModelosHTML;
        if (selModelo === undefined) {
            if (inforModelos.length === 1) {
                document.getElementById("desmodeloUsa").value = inforModelos[0].NombreClase;
            } else {
                document.getElementById("desmodeloUsa").value = "";
            }
        }
    } catch (e) {
        alert("modelo" + e);
    }
}
function cboColoresUsa(selColor) {
    try {
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;";
        //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;"
        var inforColor;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforColor = (JSON.parse(data.ComboParametroEmpGetResult));
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (inforColor.length > 0) {
            var cboColorHTML = "<p><select id='ColorUsa' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforColor.length; i++) {
                if (selColor == inforColor[i].CodigoClase) {
                    cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "' selected>" + inforColor[i].NombreClase + "</option>";
                }
                else {
                    cboColorHTML += "<option  value='" + inforColor[i].CodigoClase + "'>" + inforColor[i].NombreClase + "</option>";
                }
            }
            cboColorHTML += "</select>";
            document.getElementById("divcboColorUsa").innerHTML = cboColorHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
        }
    } catch (e) {
        alert("colores" + e);
    }
}
function vaciaCamposUsa() {
    try {
        document.getElementById("tabstripUsaAVA").style.display = "none";
        document.getElementById("gridVINUsaAVA").style.display = "none";
        nuevoFormUsa();
    } catch (e) {
        alert(e);
    }
}
function nuevoFormUsa() {
    try {
        document.getElementById("vehiculoUsa").style.display = 'block';
        // datos vehiculo
        document.getElementById("placaUsa").value = "";
        document.getElementById("chasisUsa").value = "";
        document.getElementById("motorUsa").value = "";
        document.getElementById("anio_modeloUsa").value = "";
        document.getElementById("cilindrajeUsa").value = "";
        document.getElementById("anio_matriculaUsa").value = "";
    } catch (e) {
        alert("nuevo" + e);
    }

}
function listaVin(strVIN) {
    try {
        document.getElementById("gridVINUsaAVA").innerHTML = "";
        strVIN = strVIN.replace('*', ' ').trim();
        if (strVIN.length < 8) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Ingrese m&iacute;nimo 8 caracteres");
            return;
        }
        // var UrlVIN = "http://200.31.10.92:8092/appk_aekia/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;10039;";
        //var UrlVIN = localStorage.getItem("ls_url1").toLocaleString() + "/Services/VH/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";";
        var UrlVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/4,json;" +
               localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
               localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + strVIN + ";" + localStorage.getItem("ls_usulog").toLocaleString() +
               ";;;;;" + "PENDIENTE" + ";;;";
        var infVINResp = "";
       // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlVIN);
        $.ajax({
            url: UrlVIN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    //infVINResp = (JSON.parse(data.vh01VehiculosGetResult)).tvh01;
                    infVINResp = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62;
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", err);
                return;
            }
        });
        if (infVINResp.length > 0) {
            var obs = (screen.width * 20) / 100;
            var fecha = (screen.width * 40) / 100;
            $("#gridVINUsaAVA").kendoGrid({
                dataSource: {
                    data: infVINResp,

                    pageSize: 20
                },
                // height: 400,
                scrollable: false,
                pageable: {
                    input: true,
                    numeric: false
                },
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
                                    kendo.ui.progress($("#avaluoScreen"), true);
                                    setTimeout(function () {
                                        TraerInformacionUsad(dataItem.chasis, "C");
                                    }, 2000);

                                } catch (f) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                    return;
                                    //alert(f);
                                }
                            }
                        }],
                    },

                    { field: "chasis", title: "VIN", width: fecha },
                    { field: "nombre_propietario", title: "Propietario", width: fecha },
                    //{ field: "placa", title: "Placa", width: obs}
                ]
            });
            document.getElementById("gridVINUsaAVA").style.display = "block";
        }
        kendo.ui.progress($("#avaluoScreen"), false);
    } catch (e) {
        alert("lista" + e);
    }
    kendo.ui.progress($("#avaluoScreen"), false);
}
function GuardarDatosCVUsa11111111() {
    try {
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
                }
            }
            dataRespuesta[i].sevRespt = sevRespts;
            dataRespuesta[i].erRespt = erRespts;
            dataRespuesta[i].evRespt = evRespts
        }

        //alert("termino");
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
                        "codigo_empresa": dataRespuesta[i].codigo_empresa,
                        "codigo_sucursal": dataRespuesta[i].codigo_sucursal,
                        "codigo_agencia": dataRespuesta[i].codigo_agencia,
                        "anio_vh62": dataRespuesta[i].anio_vh62,
                        "secuencia_vh65": dataRespuesta[i].secuencia_vh65,
                        "secuencia_vh62": dataRespuesta[i].secuencia_vh62,
                        "tipo_formulario": dataRespuesta[i].tipo_formulario,
                        "seccion_formulario": dataRespuesta[i].seccion_formulario,
                        "pregunta": dataRespuesta[i].pregunta,
                        "orden_presentacion": dataRespuesta[i].orden_presentacion,
                        "selRespt": dataRespuesta[i].selRespt,
                        "sevRespt": sevRespuestaS, //dataRespuesta[i].sevRespt,
                        "erRespt": erRespuestaS, //dataRespuesta[i].erRespt,
                        "evRespt": evRespuestaS, //dataRespuesta[i].evRespt,
                        "observacion": document.getElementById("observacionU").value
                    };
                }
                var today = new Date();
                var hora = today.getHours();
                var minu = today.getMinutes();
                var segu = today.getSeconds();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //Enero is 0
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                document.getElementById("fecha_modificaUsa").value = yyyy + '-' + mm + '-' + dd + '  ' + hora + ':' + minu + ':' + segu;
                
            } catch (e) {
                alert(e);
            }

            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh66VehiculosSet";
            //alert(inspeccionar(para));
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
                        var tabstripUsa = $("#tabstripUsaAVA").kendoTabStrip().data("kendoTabStrip");
                        tabstripUsa.select(2);
                        //vaciaCamposUsa();
                        //return;
                    } else { alert(datas.substr(2, datas.length - 2)); return; }
                },
                error: function (err) { alert(inspeccionar(err)); alert("Error en servicio clientes de el"); return; } //alert(err);
            });
        }
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(inforUsa)); 
        var params = {
            codigo_empresa: localStorage.getItem("ls_idempresa").toLocaleString(),
            codigo_sucursal: localStorage.getItem("ls_ussucursal").toLocaleString(),
            codigo_agencia: localStorage.getItem("ls_usagencia").toLocaleString(),
            anio_vh62: document.getElementById("anio_vh62Usa").value,
            secuencia_vh62: document.getElementById("secuenciaUsa").value,
            fecha_registro: "",
            codigo_marca: "",
            codigo_modelo: "",
            descripcion_modelo: "",
            anio_modelo: "",
            chasis: "",
            numero_motor: "",
            color_vehiculo: "",
            kilometraje: "",
            anio_matricula: 2010,
            placa: "",
            cilindraje: "",
            ubicacion_fisica: "",
            tipo_formulario: "",
            codigo_modelo_nuevo: "",
            persona_numero: "",
            persona_tipo_propietario: "",
            tipo_id_propietario: "",
            identifica_propietario: "",
            nombre_propietario: "",
            giro_comercial: "",
            direccion_propietario: "",
            calle_interseccion_propietario: "",
            numero_calle_propietario: "",
            calle_interseccion_propietario: "",
            tipo_dir_propietario: "",
            pais_propietario: "",
            ciudad_propietario: "",
            tipo_avaluo: "",
            numero_orden: "",
            canton_propietario: "",
            parroquia_propietario: "",
            telefono_cliente: "",
            telefono_propietario: "",
            persona_celular_propietario: "",
            observaciones: "",
            observacion_tecnica: document.getElementById("observacionU").value,
            observacion_certificacion: "",
            monto_avaluo: "0",
            persona_numero_vendedor: "",
            mail_propietario: "",
            estado: "PENDIENTE",
            prohibido_enajenar: "NO",
            matriculado: "NO",
            fecha_anulacion: "",
            usuario_anulacion: "",
            hora_anulacion: "",
            fecha_creacion: "",
            hora_creacion: "",
            usuario_creacion: "",
            prog_creacion: "",
            fecha_modificacion: "",
            hora_modificacion: "",
            usuario_modificacion: "",
            prog_modificacion: ""
        };
        var Url = empRespa.URL_concesionario + "/Services/vh/Vehiculos.svc/vh62VinUsadoSet";
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", Url);
        $.ajax({
            url: Url,
            type: "POST",
            data: JSON.stringify(params),
            async: false,
            dataType: "json",
            //Content-Type: application/json
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (data1) {
                //alert(data1);
                if (data1.substr(0, 1) == "1" || data1 == "") {
                    alert("se actualizaron los datos");
                    var tabstripUsa = $("#tabstripUsaAVA").kendoTabStrip().data("kendoTabStrip");
                    tabstripUsa.select(2);
                    //vaciaCamposUsa();
                    /* document.getElementById("infoPlacasVINUsa").focus();
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0; */
                    //window.scrollTo(0, 0);
                    //$('html, body').animate({ scrollTop: 0 }, 'fast');
                    //return;
                } else { alert(data1.substr(2, data1.length - 2));return; }
            },
            error: function (err) { window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(err)); alert("Error en servicio clientes mios"); return; } //alert(err);
        });
    } catch (e) { alert("salio"+e); }
}
function cboUbicacionUsa(selUbica) {
    try {
        var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;";
        // "http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;UBICACION_USADOS;"
        var inforUbica;
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforUbica = (JSON.parse(data.ComboParametroEmpGetResult));
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (inforUbica.length > 0) {
            var cboUbicaHTML = "<p><select id='UbicaUsa' class='w3-input w3-border textos'>";
            for (var i = 0; i < inforUbica.length; i++) {
                if (selUbica == inforUbica[i].CodigoClase) {
                    cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "' selected>" + inforUbica[i].NombreClase + "</option>";
                }
                else {
                    cboUbicaHTML += "<option  value='" + inforUbica[i].CodigoClase + "'>" + inforUbica[i].NombreClase + "</option>";
                }
            }
            cboUbicaHTML += "</select>";
            document.getElementById("divcboUbicaUsa").innerHTML = cboUbicaHTML;
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Ubicaci?n");
        }
    } catch (e) {
        alert("ubica" + e);
    }
}
function llamarUSAD(placaVIN) {
    try {
        vaciaCamposUsa();
        kendo.ui.progress($("#avaluoScreen"), true);
        setTimeout(function () {
            buscaPlacaUsa(placaVIN);
        }, 2000);
    } catch (e) {
        alert("llama" + e);
    }

}
function buscaPlacaUsa(placaVIN) {
    try {
        document.getElementById("tabstripUsaAVA").style.display = "none";
        document.getElementById("observacionU").disabled = false;
        if (placaVIN != "") {
            if (placaVIN.includes("*") == true) {
                listaVin(placaVIN);
            } else {
                if (placaVIN.length > 8) {
                    var patron = /^\d*$/;
                    if (patron.test(placaVIN)) {
                        TraerInformacionUsad(placaVIN, "O");
                    }
                    else {
                        TraerInformacionUsad(placaVIN, "C");
                    }
                }
                else {
                    TraerInformacionUsad(placaVIN, "P");
                }
            }
        }
        else {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Placa o VIN");
        }
        kendo.ui.progress($("#avaluoScreen"), false);
    } catch (e1) {
        alert("buscaVin  " + e1);
    }
}
function cambiarestadoAV() {
    try {
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;1;01;01;;;;;;2017;1;PENDIENTE
		
		/* // RRP: 2018-08-27
        var urlEstado = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;" + localStorage.getItem("ls_idempresa").toLocaleString() +
            ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() +
            ";;;;;;" + document.getElementById("anio_vh62Usa").value + ";" + document.getElementById("secuenciaUsa").value + ";AVALUADO";
			*/
       var urlEstado = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/6,json;" + localStorage.getItem("ls_idempresa").toLocaleString() +
            ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() +
            ";;;"+ localStorage.getItem("ls_usulog").toLocaleString() +";;;" + document.getElementById("anio_vh62Usa").value + ";" + document.getElementById("secuenciaUsa").value + ";AVALUADO";
			
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", urlEstado);
        var inforEst;
        $.ajax({
            url: urlEstado,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infor = data.vh62VinUsadoGetResult;
                    if (infor.substr(0, 1) == "1") {
                        alert("se actualizaron los datos");
                        var tabstripUsa = $("#tabstripUsaAVA").kendoTabStrip().data("kendoTabStrip");
                        tabstripUsa.select(2);
                        //vaciaCamposUsa();
                        //return;
                    } else { alert(infor.substr(2, infor.length - 2)); return; }
                } catch (e) {
                    alert(e);
                    recurrenteOT = 1;
                }
            },
            error: function (err) {
                // loading
                // Borrar imagen de placa
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "aqui va cambiar de estado");
    } catch (e) {
        alert(e);
    }
    
}
function imprimirAVA() {
    formatoImpEV2P(false);
}
function cargarTablaDat(inforImprime) {
    try {
        //alert(inspeccionar(inforImprime));
        var ev_yyyy = "";
        var ev_hhmm = "";
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
        //alert(inspeccionar(inforImprime));
        //alert(inforImprime.ciudad);
        var arrFecEV = ev_yyyy.split('-');
        var arrHoEv = ev_hhmm.split(':');
        var html_ev_01 = "<table cellpadding='0' cellspacing='0' border='0'>" +
            "<tr>" +
            "<td width='20%'><p><label style='font-family:Arial; font-size:11px'>En la ciudad de: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.ciudad_agencia + "</p></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>Fecha: </p></label></td>" +
            "<td>" +
            "<table cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[0] + "</p></label></td>" +
            "<td>&nbsp;</td>     " +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[1] + "</p></label></td>" +
            "<td>&nbsp;</td>     " +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + arrFecEV[2] + "</p></label></td>" +
            "<td></td>  " +
            "<td><p><label style='font-family:Arial; font-size:11px'>&nbsp;&nbsp;Hora: </p></td> " +
            "<td>&nbsp;&nbsp;&nbsp;</td>     " +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + arrHoEv[0] + ":" + arrHoEv[1] + "</p></label></td>" +
            "</tr>" +
            "</table>   " +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='2'><p><label style='font-family:Arial; font-size:11px'>" +
            //Se realiza la entrega a entera satisfacci&#243;n de un veh&#237;culo nuevo marca KIA con las siguientes caracter&#237;sticas:</p>"
            "</td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>MODELO: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + document.getElementById('modeloUsa').value + "</p></label></td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>VIN: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.chasis + "</p></label></td>" +
            "</tr>" +
            "<tr> " +
            "<td><p><label style='font-family:Arial; font-size:11px'>PLACA: </p></label></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.placa + "</p></label></td>" +
            "</tr>" +
            "<tr> " +
            "<table cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>KM:</p></label></td>" +
            "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>     " +
            "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>" + "<td></td>     " + "<td></td>     " + "<td></td>     " + "<td></td>     " +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.kilometraje + "</p></label></td>" +
            "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>     " +
            "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>" + "<td></td>     " + "<td></td>     " + "<td></td>     " + "<td></td>     " + "<td></td>     " +
             "<td><p><label style='font-family:Arial; font-size:11px'>A&#209;O:</p></label></td>" +
             "<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>     " +
            "<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>" + "<td></td>     " + "<td></td>     " + 
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.anio_modelo + "</p></label></td>" +
            "</tr>" +
            "</table>   "
            "</tr>" +
            "</table>";
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", html_ev_01);
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(inforImprime));

    } catch (e) {
        alert(e);
    }
    return html_ev_01;
    
}
function formatoImpEV2P(bolVisEV) {
     try {
        var htmlFormatoEV = "";
        kendo.ui.progress($("#avaluoScreen"), true);
        setTimeout(function () {
            var tablaDat = cargarTablaDat(inforImprime);
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", tablaDat);
            var tablaPreguntasImp = cargarTablaINP(inforImprime); //ConsultarMEUSA(inforImprime);  // ConsultarMEUSA_IMP_2(ktedsEV); // ConsultarMEUSA_IMP(ktedsEV);
                            
            //  ============================================================================================================================
            //  FORMATO GENERAL
            //  ============================================================================================================================
            htmlFormatoEV = "<table width='100%' cellpadding='2' cellspacing='0'>" +
            "<tr>" +
            "<td>" +
            "<table width='100%' cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<td>" + "<img src='./img/logoimprime.png' height='60' width='129'>" + "</td>" +
            "<td style='text-align:center'>" +
            "<h2><label style='color:#000000'>FORMULARIO PARA RECEPCION DE VEH&#205;CULOS SEMINUEVOS</label></h2>" +
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
            "<td>" +
            tablaDat + //html_ev_01 +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td></td><td>" +
             "<tr>" +
            "<td style='background-color:#000000'>" +
            "<p><label style='color:#FFFFFF; font-family:Arial; font-size:12px'> B = BUENO        R = REGULAR     M = MALO    </label></p>" +
            "</td>" +
            "</tr>" +
            tablaPreguntasImp +
            //html_ev_02 +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='background-color:#000000'>" +
            "<p><label style='color:#FFFFFF; font-family:Arial; font-size:11px'>COMENTARIOS, RECOMENDACIONES U OBSERVACIONES</label></p>" +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>" + inforImprime.observacion_tecnica + "</label></p></td>" +
            "</tr>" +
            //"<tr>" +
            //"<td>&nbsp;" +
            //"</td>" +
            //"</tr>" +
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
            "<td width='50%'><p><label style='font-family:Arial; font-size:11px'>      TECNICO</label></p></td>" +
            "<td><p><label style='font-family:Arial; font-size:11px'>    JEFE DE TALLER</label></p></td>" +
            "</tr>" +
            "<tr>" +
            //"<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + localStorage.getItem("ls_usunom").toLocaleString() + "</label></p></td>" +
            //"<td><p><label style='font-family:Arial; font-size:11px'>Nombre y Apellido: " + ev_nombres + "</label></p></td>" +
            "</tr>" +
            "<tr>" +
            //"<td><p><label style='font-family:Arial; font-size:11px'>ID: " + identifica_entrega + "</label></p></td>" +
            //"<td><p><label style='font-family:Arial; font-size:11px'>ID: " + ev_identifica_cliente + "</label></p></td>" +
            "</tr>" +
            "</table>" +
            "</td>" +
            "</tr>" +
            "</table>";
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> IMPRIME</center>", htmlFormatoEV);
            if (bolVisEV == false) {
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> IMPRIME</center>", htmlFormatoEV); 
                try {
                /* window.plugin.printer.print(
                    htmlFormatoEV,
                    {
                        graystyle: true
                    },
                    function (msg) {
                        kendo.ui.progress($("#avaluoScreen"), false);

                    },
                    function (msg) {
                        kendo.ui.progress($("#avaluoScreen"), false);
                    }
                ); */
                cordova.plugins.printer.print(
                    htmlFormatoEV,
                    {
                        graystyle: true
                    },
                    function (msg) {kendo.ui.progress($("#avaluoScreen"), false);
                    },
                    function (msg) {kendo.ui.progress($("#avaluoScreen"), false);
                    }
                );
                } catch (e) {
                    alert(e);
                }
                //volverForm();
            }
            else {
                //document.getElementById("divExplica").innerHTML = "<table align='center' width='95%' border='0' cellspacing='0' cellpadding='0'><tr><td>" +
                htmlFormatoEV + "</td></tr></table>";
                //document.getElementById("divExplica").style.display = "initial";
                //document.getElementById("headEV").style.display = "none";
            }

            kendo.ui.progress($("#avaluoScreen"), false);

            // precarga *********************************************************************************************
        }, 2000);

    }
    catch (eimpev) {
        kendo.ui.progress($("#avaluoScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", eimpev);
    }
}
function TraerInformacionUsad(responseText, tipo) {
    try {
        var tabstripUsa = $("#tabstripUsaAVA").kendoTabStrip().data("kendoTabStrip");
        tabstripUsa.select(0);
        document.getElementById("divOtEstado").innerHTML = "";
        document.getElementById('gridVINUsaAVA').innerHTML = "";
        vaciaCamposUsa();
        var inforUsa = "";

        if (tipo == "P") {
            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";";
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/1,json;" +
                localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                localStorage.getItem("ls_usagencia").toLocaleString() + ";" + responseText + ";;" + localStorage.getItem("ls_usulog").toLocaleString() +
                ";;;;;;;;";
        } else {
            //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;" + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" + localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";";
            var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh62VinUsadoGet/1,json;" +
               localStorage.getItem("ls_idempresa").toLocaleString() + ";" + localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
               localStorage.getItem("ls_usagencia").toLocaleString() + ";;" + responseText + ";" + localStorage.getItem("ls_usulog").toLocaleString() +
               ";;;;;;;;";
        }
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", Url);
        $.ajax({
            url: Url,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    inforUsa = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62[0];
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(inforUsa));
                } catch (e) {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", data.vh62VinUsadoGetResult.substr(2,(data.vh62VinUsadoGetResult.length - 2)));
                    recurrenteOT = 1;
                    inforUsa = null;
                    return;
                }
            },
            error: function (err) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
                return;
            }
        });
        if (inforUsa != "" ){
            if (inforUsa != null) {
                try {
                    inforImprime = "";
                    document.getElementById("placaUsa").value = inforUsa.placa;
                    document.getElementById("chasisUsa").value = inforUsa.chasis;
                    document.getElementById("motorUsa").value = inforUsa.numero_motor;
                    document.getElementById("kilometrosUsa").value = inforUsa.kilometraje;
                    marcaVheUsa(inforUsa.codigo_marca);
                    cboModeloVheUsa(inforUsa.codigo_marca, inforUsa.codigo_modelo);
                    document.getElementById("anio_modeloUsa").value = inforUsa.anio_modelo;
                    cboColoresUsa(inforUsa.color_vehiculo);
                    //transmision
                    cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","transmision","transmisionAV2",inforUsa.tipo_transmision,"dbotransmisionAV");
                    //traccion
                    cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_traccion","traccionnAV2",inforUsa.codigo_traccion,"dboTraccionAV");
                    //subclase
                    cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","subclase_auto","subclaseAV2",inforUsa.subclase_auto,"dboCarroceriaAV");
                    //grupo auto
                    cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"IN","clase_auto","claseAV2",inforUsa.clase_auto,"dboClaseAV");
                    //combustible
                    cbogenericoAV(localStorage.getItem("ls_idempresa").toLocaleString(),"VH","tipo_combustible","combustibleAV2",inforUsa.tipo_combustible,"dboCombustibleAV");
                    document.getElementById("cilindrajeUsa").value = inforUsa.cilindraje;
                    document.getElementById("anio_vh62Usa").value = inforUsa.anio_vh62;
                    document.getElementById("secuenciaUsa").value = inforUsa.secuencia_vh62;
                    document.getElementById("estadoUsa").value = inforUsa.estado;
                    document.getElementById("anio_matriculaUsa").value = inforUsa.anio_matricula;
                    document.getElementById("cilindrajeUsa").value = inforUsa.cilindraje;
                    cboUbicacionUsa(inforUsa.ubicacion_fisica);
                    document.getElementById("fecha_recepcionUsa").value = inforUsa.fecha_registro;
                    //alert("ob tecnica:" + inforUsa.observacion_tecnica);
                    //alert("ob recepcion:" + inforUsa.observaciones);
                    document.getElementById("observacionU").value = inforUsa.observacion_tecnica;
                    //alert("ob1:" + document.getElementById("observacionU").value);
                    document.getElementById("btnGuardaInfoUsa").innerHTML = " <button id='guardaAV0' onclick='GuardarDatosCVUsa11111111();' class='w3-btn'>GUARDAR</button>" + "  " + "<button id='guardaAV1' onclick='imprimirAVA();' class='w3-btn'>IMPRIMIR</button>" + "  " + "<button id='guardaAV2' onclick='cambiarestadoAV();' class='w3-btn'>CAMBIAR ESTADO</button>";
                    llamarNuevoestilo("guardaAV");
                    ConsultarEMUSA(inforUsa.chasis);
                    ConsultarMEUSA(inforUsa);
                    inforImprime = inforUsa;
                    //ConsultarIVUSA();
                    kendo.ui.progress($("#avaluoScreen"), false);
                    if (validaServicios > 0) {
                        document.getElementById("vehiculoUsa").style.display = 'block';
                        document.getElementById("tabstripUsaAVA").style.display = 'block';
                    }
                    document.getElementById("marcasUsa").disabled = true;
                    document.getElementById("modeloUsa").disabled = true;
                    document.getElementById("ColorUsa").disabled = true;
                    document.getElementById("UbicaUsa").disabled = true;
                    document.getElementById("claseAV2").disabled = true;
                    document.getElementById("subclaseAV2").disabled = true;
                    document.getElementById("combustibleAV2").disabled = true;
                    document.getElementById("traccionnAV2").disabled = true;
                    document.getElementById("transmisionAV2").disabled = true;
                    
                    if (inforUsa.estado !== "PARA_AVALUO") {
                        desactivaTabla(true);
                    }

                } catch (e2) {
                    alert("e2" + e2);
                }
            }
        }
    } catch (e1) {
        alert("traeinf"+e1);
    }
}
// vehiculos
function cbogenericoAV(emp,tipo,tipovh,tipoID,seltipo,nombreTipo) {
    var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,"+
    emp+";"+tipo+";"+tipovh+";";
    //"http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;"
    var inforGene;
    //alert(Url);
    $.ajax({
        url: Url,
        type: "GET",
        async: false,
        dataType: "json",
        success: function (data) {
            try {
                inforGene = (JSON.parse(data.ComboParametroEmpGetResult));
            } catch (e) {
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso");
                return;
            }
        },
        error: function (err) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Error durante el proceso. Int\u00E9ntelo nuevamente.");
            return;
        }
    });
    if (inforGene.length > 0) {
        var cboMarcaHTML = "<p><select id='"+tipoID+"' class='w3-input w3-border textos'>";
        cboMarcaHTML += "<option value='0,0'>Seleccione</option>";
        for (var i = 0; i < inforGene.length; i++) {
            if (seltipo == inforGene[i].CodigoClase) {
                cboMarcaHTML += "<option  value='" + inforGene[i].CodigoClase + "' selected>" + inforGene[i].NombreClase + "</option>";
            }
            else {
                cboMarcaHTML += "<option  value='" + inforGene[i].CodigoClase + "'>" + inforGene[i].NombreClase + "</option>";
            }
        }
        cboMarcaHTML += "</select>";
        document.getElementById(nombreTipo).innerHTML = cboMarcaHTML;
    }
    else {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Marcas");
    }
}
function ConsultarEMUSA(emvin) {
    try {
        var erroresEM = 0;
        document.getElementById("tablaPrmEMUSA").style.display = "none";
        document.getElementById("tableEMUSA").style.display = "none";
        document.getElementById("fecEMUSA").value = "";
        document.getElementById("kmEMUSA").value = "";
        var UrlEM = localStorage.getItem("ls_url1").toLocaleString() + "/Services/SL/Sherloc/Sherloc.svc/Mantenimiento/" + "2," + emvin;
        var inforEMUSA;
        console.log(UrlEM);
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", (UrlEM));
        $.ajax({
            url: UrlEM,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.MantenimientoGetResult !== null && data.MantenimientoGetResult !== "0,No data") {
                        inforEMUSA = (JSON.parse(data.MantenimientoGetResult)).KilometrajeOT;
                    } else {
                        erroresEM = 1;
                    }
                    
                } catch (e) {
                    alert("12"+e);
                    for (var i = 0; i < 30; i++) {
                        document.getElementById("cl" + inforEMUSA[i].codigo).style.background = "red";
                        document.getElementById("cx" + inforEMUSA[i].codigo + "x").style.display = "";
                        bandera = "rojo";
                    }
                    document.getElementById("fecEMUSA").value = "";
                    document.getElementById("kmEMUSA").value = "";
                    // Si hay error
                    erroresEM = 1;
                    return;
                }
            },
            error: function (err) {
                alert("1" + err);
                return;
            }
        });
        //alert(inspeccionar(inforEMUSA));
        if (erroresEM == 0) {
            /* for (var i = 0; i < inforEMUSA.length; i++) {
                document.getElementById("Al" + inforEMUSA[i].codigo + "U").style.background = "transparent";
                document.getElementById("Ax" + inforEMUSA[i].codigo + "vU").style.display = "none";
                document.getElementById("Ax" + inforEMUSA[i].codigo + "xU").style.display = "none";
            } */
            var bandera = "verde";
            if (inforEMUSA.length > 0) {
                for (var i = 0; i < inforEMUSA.length; i++) {
                    if (i < 30) {
                        if (inforEMUSA[i].validacion == true) {
                            document.getElementById("Al" + inforEMUSA[i].codigo + "U").style.background = "green";
                            document.getElementById("Ax" + inforEMUSA[i].codigo + "vU").style.display = "block";
                        }
                        else {
                            document.getElementById("Al" + inforEMUSA[i].codigo + "U").style.background = "red";
                            document.getElementById("Ax" + inforEMUSA[i].codigo + "xU").style.display = "block";
                            bandera = "rojo";
                        }
                    }
                    if (inforEMUSA[i].ultimo == true) {
                        document.getElementById("fecEMUSA").value = inforEMUSA[i].fecha_kilometraje;
                        document.getElementById("kmEMUSA").value = inforEMUSA[i].kilometraje;
                        break;
                    }
                }
                document.getElementById("tablaPrmEMUSA").style.display = "block";
                document.getElementById("tableEMUSA").style.display = "block";
            }
        }
    } catch (e) {
        alert("24" + e);
        return;
    }
}
function ConsultarMEUSA(inforusa) {
    try {
        //alert(inspeccionar(inforusa));
        var respOT = "0";
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;1;01;01;2018;1
        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;" +
            inforusa.codigo_empresa + ";" + inforusa.codigo_sucursal + ";" + inforusa.codigo_agencia + ";" + inforusa.anio_vh62 + ";" +
            inforusa.secuencia_vh62 + ";" + inforusa.tipo_formulario + ";;;;;;";
        //var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh65PreguntasAvaluoGet/1,json;"+inforusa.codigo_empresa+";" + inforusa.tipo_formulario + ";;;"+inforusa.codigo_sucursal+";"+
        //    inforusa.codigo_agencia+";"+inforusa.anio_vh62+";"+inforusa.secuencia_vh62;//"/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOTOR_USADOS;";

        var infME;
        $.ajax({
            url: UrlMotorEscape,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infME = (JSON.parse(data.vh64PreguntasAvaluoGetResult)).tvh64;   //(JSON.parse(data.ComboParametroEmpGetResult));
                    //infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infME));
                    respOT = "1";
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                alert(err);
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
                    var selecResp = new Array();
                    var sevResp = new Array();
                    var erResp = new Array();
                    var evResp = new Array();
                    if (infME[i].tipo_respuesta == "SELECCION" || infME[i].tipo_respuesta == "SEV") {
                        if (infME[i].tipo_respuesta == "SEV") {
                            //alert("etiqu"+infME[i].lista_etiquetas);
                            sevResp = infME[i].lista_etiquetas.split(",");
                            //alert(inspeccionar(sevResp));
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                                //alert(inspeccionar(sevRes[k]));
                            }
                            //alert(inspeccionar(sevRes[0]));
                        }
                        //alert("resp"+infME[i].lista_respuesta)
                        selecResp = infME[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infME[i].tipo_respuesta == "ER") {
                            //alert("else eti" + infME[i].lista_etiquetas);
                            erResp = infME[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            //alert("else resp" + infME[i].lista_respuesta);
                            selecResp = infME[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infME[i].tipo_respuesta == "EV") {
                                //alert("else ev"+infME[i].lista_etiquetas);
                                evResp = infME[i].lista_etiquetas.split(",");
                                //alert((evResp.length));
                                var evRes = [];
                                for (var hh = 0; hh < evResp.length; hh++) {
                                    evRes.push({ evR: evResp[hh] });
                                }
                                //alert("0:" + evRes[0].evR);
                                //alert("1:" + evRes[1].evR);
                                //alert("2:" + evRes[2].evR);
                                //alert("3:" + evRes[3].evR);
                            }
                        }
                    }
                    griddata.push({
                        codigo_empresa: infME[i].codigo_empresa,
                        codigo_sucursal: inforusa.codigo_sucursal,
                        codigo_agencia: inforusa.codigo_agencia,
                        anio_vh62: inforusa.anio_vh62,
                        secuencia_vh65: infME[i].secuencia_vh65,
                        secuencia_vh62: inforusa.secuencia_vh62,
                        seccion_formulario: infME[i].seccion_formulario,
                        nombre_seccion: infME[i].nombre_seccion,
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
                    //if (infME[i].tipo_respuesta == "EV") { alert(griddata[i].evResp[0].evR); alert(griddata[i].evResp[1].evR); alert(griddata[i].evResp[2].evR); alert(griddata[i].evResp[3].evR); }
                    //alert("sevRespt" + infME[i].sevRespt);
                    //alert("sevRes" + inspeccionar(sevRes));
                    //alert("sevResp"+inspeccionar(griddata[i].sevResp));
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(griddata[i].sevResp));
                }
            } catch (e) {
                alert("1" + e);
            }
            //alert("antes de func");
            var tablaINP = cargatablaAVA(griddata);
            registroME = "";
            return tablaINP;
        }
    } catch (e) {
        alert("21" + e);
        return;
    }
}
function cargarTablaINP(inforusa) {
    try {
        //alert(inspeccionar(inforusa));
        var respOT = "0";
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;1;01;01;2018;1
        var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh64PreguntasAvaluoGet/1,json;" +
            inforusa.codigo_empresa + ";" + inforusa.codigo_sucursal + ";" + inforusa.codigo_agencia + ";" + inforusa.anio_vh62 + ";" +
            inforusa.secuencia_vh62 + ";" + inforusa.tipo_formulario + ";;;;;;";
        //var UrlMotorEscape = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh65PreguntasAvaluoGet/1,json;"+inforusa.codigo_empresa+";" + inforusa.tipo_formulario + ";;;"+inforusa.codigo_sucursal+";"+
        //    inforusa.codigo_agencia+";"+inforusa.anio_vh62+";"+inforusa.secuencia_vh62;//"/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOTOR_USADOS;";

        var infME;
        $.ajax({
            url: UrlMotorEscape,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infME = (JSON.parse(data.vh64PreguntasAvaluoGetResult)).tvh64;   //(JSON.parse(data.ComboParametroEmpGetResult));
                    //infME = (JSON.parse(data.vh65PreguntasAvaluoGetResult)).otro_tvh65;
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(infME));
                    respOT = "1";
                } catch (e) {
                    return;
                }
            },
            error: function (err) {
                alert(err);
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
                    var selecResp = new Array();
                    var sevResp = new Array();
                    var erResp = new Array();
                    var evResp = new Array();
                    if (infME[i].tipo_respuesta == "SELECCION" || infME[i].tipo_respuesta == "SEV") {
                        if (infME[i].tipo_respuesta == "SEV") {
                            //alert("etiqu"+infME[i].lista_etiquetas);
                            sevResp = infME[i].lista_etiquetas.split(",");
                            //alert(inspeccionar(sevResp));
                            var sevRes = [];
                            for (var k = 0; k < sevResp.length; k++) {
                                sevRes.push({ sevR: sevResp[k] });
                                //alert(inspeccionar(sevRes[k]));
                            }
                            //alert(inspeccionar(sevRes[0]));
                        }
                        //alert("resp"+infME[i].lista_respuesta)
                        selecResp = infME[i].lista_respuesta.split(",");
                        var selRes = [];
                        selRes.push({ sele: "Seleccione" });
                        for (var j = 0; j < selecResp.length; j++) {
                            selRes.push({ sele: selecResp[j] });
                        }
                    } else {
                        if (infME[i].tipo_respuesta == "ER") {
                            //alert("else eti" + infME[i].lista_etiquetas);
                            erResp = infME[i].lista_etiquetas.split(",");
                            var erRes = [];
                            for (var l = 0; l < erResp.length; l++) {
                                erRes.push({ erR: erResp[l] });
                            }
                            //alert("else resp" + infME[i].lista_respuesta);
                            selecResp = infME[i].lista_respuesta.split(",");
                            var selRes = [];
                            selRes.push({ sele: "Seleccione" });
                            for (var j = 0; j < selecResp.length; j++) {
                                selRes.push({ sele: selecResp[j] });
                            }
                        } else {
                            if (infME[i].tipo_respuesta == "EV") {
                                //alert("else ev"+infME[i].lista_etiquetas);
                                evResp = infME[i].lista_etiquetas.split(",");
                                //alert((evResp.length));
                                var evRes = [];
                                for (var hh = 0; hh < evResp.length; hh++) {
                                    evRes.push({ evR: evResp[hh] });
                                }
                                //alert("0:" + evRes[0].evR);
                                //alert("1:" + evRes[1].evR);
                                //alert("2:" + evRes[2].evR);
                                //alert("3:" + evRes[3].evR);
                            }
                        }
                    }
                    griddata.push({
                        codigo_empresa: infME[i].codigo_empresa,
                        codigo_sucursal: inforusa.codigo_sucursal,
                        codigo_agencia: inforusa.codigo_agencia,
                        anio_vh62: inforusa.anio_vh62,
                        secuencia_vh65: infME[i].secuencia_vh65,
                        secuencia_vh62: inforusa.secuencia_vh62,
                        seccion_formulario: infME[i].seccion_formulario,
                        nombre_seccion: infME[i].nombre_seccion,
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
            } catch (e) {
                alert("1" + e);
            }
            //alert("antes de func");
            var tablaINP = cargatabla_1AVA(griddata);
            registroME = "";
            return tablaINP;
        }
    } catch (e) {
        alert("21" + e);
        return;
    }
}
function cargatabla_1AVA(griddata1) {
    dataRespuesta = "";
    var tablaOT = "";
    tablaOT += "<table>";
        //<tr style='background-color:#C00000'><td></td><td></td><td>" +
        //"<label style='font-weight:bold; font-size:11px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td></tr></table>";
    tablaOT += "<table>"
    for (var i = 0; i < griddata1.length; i++) {
        var seccionFor = griddata1[i].seccion_formulario;
        //  alert(seccionFor);   
        tablaOT += "<tr style='background-color:#000000'><td style='width: 80%;'><p><label style='font-weight:bold; font-size:11px;color:#ffffff' >" +
            griddata1[i].seccion_formulario +
            "</label></p></td><td style='width: 1%;'></td><td style='width: 19%;'></td></tr>";
        while (griddata1[i].seccion_formulario == seccionFor) {
            tablaOT += "<tr><td><p><label style='font-family:Arial; font-size:11px'>" + griddata1[i].pregunta + "</label></p></td>";

            if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
                var sevUsa = "<td><table style='width: 100%;'><tr>";
                if (griddata1[i].tipo_respuesta == "SEV") {
                    var valorsev = griddata1[i].sevRespt.split(',');
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", griddata1[i].erRespt);
                    for (var l = 0; l < griddata1[i].sevResp.length; l++) {
                        //alert("VAL: " + valorsev[l]);
                        if (valorsev[l] === "undefined" || valorsev[l] === null) {
                            valorsev[l] = " ";
                           // alert("VAL1: "+valorsev[l]);
                        }
                        
                        if (l == 4) {
                            sevUsa += "</tr><tr>"
                        }
                        sevUsa += "<td>&nbsp;</td>";
                        //sevUsa += "<td><p><input id=SEV" + i + "" + l + " type='" + tipoUsa + "' style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
                        sevUsa += "<td><p><input id=SEV" + i + "" + l + "style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
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
                        sevUsa += "<td><p><input id=ER" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value=" + valorer[l] + "></p></td>";
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
                            sevUsa += "<td><p><input id=EV" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].evResp[l].evR + " value=" + valorev[l] + "></p></td>";
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
function cargatablaAVA(griddata1) {
    try {
        document.getElementById("divOtEstado").innerHTML = "";
        dataRespuesta = "";
        var tablaOT = "";
        tablaOT = "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume' scr>";
        var cuerpo;
        tablaOT += "<tr align='center' style='background-color:#000000'><td></td><td><label style='font-weight:bold; font-size:13px;color:#ffffff'>B=BUENO   R=REGULAR   M=MALO</label></td><td></td></tr>"
        for (var i = 0; i < griddata1.length; i++) {
            var seccionFor = griddata1[i].seccion_formulario;
            tablaOT += "<tr style='background-color:#000000'><td align='center' style='width: 25%;'><label style='font-weight:bold; font-size:13px;color:#ffffff'>" + griddata1[i].nombre_seccion + "</label></td><td style='width: 50%;'></td><td style='width: 25%;'></td></tr>";
            while (griddata1[i].seccion_formulario == seccionFor) {
                var tipoUsa = "";
                if (griddata1[i].tipo_valor == "NUMERICO") {
                    tipoUsa = "number";
                } else {
                    tipoUsa = "text";
                }
                tablaOT += "<tr><td>" + griddata1[i].orden_presentacion + "&nbsp;&nbsp;<label class='w3-text-black' style='font-weight:bold; font-size:13px'>" + griddata1[i].pregunta + "</label></td>";
                if (griddata1[i].tipo_respuesta == "SELECCION" || griddata1[i].tipo_respuesta == "SEV") {
                    var sevUsa = "<td><table style='width: 100%;'><tr>";
                    if (griddata1[i].tipo_respuesta == "SEV") {
                        var valorsev = griddata1[i].sevRespt.split(',');
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(valorsev));
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(valorsev));
                        for (var l = 0; l < griddata1[i].sevResp.length; l++) {
                            if (valorsev[l] === "undefined" || valorsev[l] === null) {
                                valorsev[l] = " ";
                            }
                            sevUsa += "<td><p><input id=SEV" + i + "" + l + " type='" + tipoUsa + "' style='width:100%' placeholder=" + (l + 1) + " value=" + valorsev[l] + "></p></td>";
                        }
                        //alert(sevUsa);
                    }
                    sevUsa += "</tr></table></td>";
                    var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                    tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                } else {
                    if (griddata1[i].tipo_respuesta == "ER") {
                        var sevUsa = "<td><table style='width: 100%;'><tr>";
                        var valorer = griddata1[i].erRespt.split(',');
                        
                        for (var l = 0; l < griddata1[i].erResp.length; l++) {
                            if (valorer[l] === undefined || valorer[l] === null || valorer[l] === "") {
                                valorer[l] = " ";
                            }
                            sevUsa += "<td><p><input id=ER" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].erResp[l].erR + " value=" + valorer[l] + "></p></td>";
                        }
                        sevUsa += "</tr></table></td>";
                        var selUsa = seleccionUSA(griddata1[i].selResp, i, griddata1[i].selRespt);
                        tablaOT += sevUsa + "<td>" + selUsa + "</td>";
                    } else {
                        if (griddata1[i].tipo_respuesta == "EV") {
                            var sevUsa = "<td><table style='width: 100%;'><tr>";
                            var valorev = griddata1[i].evRespt.split(',');
                            for (var l = 0; l < griddata1[i].evResp.length; l++) {
                                if (valorev[l] === "undefined" || valorev[l] === null) {
                                    valorev[l] = " ";
                                }
                                sevUsa += "<td><p><input id=EV" + i + "" + l + " type='text' size='2' placeholder=" + griddata1[i].evResp[l].evR + " value=" + valorev[l] + "></p></td>";
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
        tablaOT += "</table>";
        document.getElementById("divOtEstado").innerHTML = " ";
        document.getElementById("divOtEstado").innerHTML = tablaOT;
        document.getElementById("divOtEstado").style.display = 'block';
        dataRespuesta = griddata1;
        return tablaOT;
    } catch (e) {
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", inspeccionar(griddata1[i]));
        alert("carga" + i + e);
        
    }
}
function seleccionUSA(sele1, i, sele2) {
        try {
            var cboMarcaHTML = "<p><select id='" + "SEL" + i + "'class='w3-input w3-border textos'>";
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
function ConsultarIVUSA() {
    try {
        document.getElementById("divInspeccion").style.display = "none";
        var respOT = "0";
        var UrlInspeccion = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;PARTE_MOVIL_USADOS;";
        var infIV;
        $.ajax({
            url: UrlInspeccion,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    infIV = (JSON.parse(data.ComboParametroEmpGetResult));
                    respOT = "1";
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
                var griddataIV = [];
                tamano = infIV.length;
                infIV.sort(function myfunction(a, b) {
                    return (a - b);
                });
                var selIV = [];
                //selIV.push({ sele: "Seleccione" });
                selIV.push({ sele: "NO" });
                selIV.push({ sele: "SI" });
                for (var i = 0; i < infIV.length; i++) {
                    griddataIV.push({
                        codigoclase: infIV[i].CodigoClase,
                        nombreclase: infIV[i].NombreClase,
                        respuestaclase: "",
                        selINV: selIV
                    });
                }
                cargaInspeccion(griddataIV);
            } catch (e) {
                alert("1" + e);
            }
        }

    } catch (e) {
        alert("22" + e);
        return;
    }
}
function seleccionUSAIV(insp1, i) {
    try {
        var cboMarcaHTMLIV = "<p><select id='" + "INV" + i + "'class='w3-input w3-border textos'>";
        for (var k = 0; k < insp1.length; k++) {
            if ("Seleccione" == insp1[k].sele) {
                cboMarcaHTMLIV += "<option  value='" + insp1[k].sele + "' selected>" + insp1[k].sele + "</option>";
            }
            else {
                cboMarcaHTMLIV += "<option  value='" + insp1[k].sele + "'>" + insp1[k].sele + "</option>";
            }
        }
        cboMarcaHTMLIV += "</select></p>";
        return cboMarcaHTMLIV;
    } catch (e) {
        alert("selecci" + e);
    }
}
function cargaInspeccion(griddataIV) {
    try {
        var tablaOT = "<div align='center' style='background-color:#88282C'><label style='font-weight:bold; font-size:13px;color:#ffffff'>INSPECCION PARTES MOVILES</label></div>";
        tablaOT += "<table BORDER CELLPADDING=10 CELLSPACING=10 id='docume'>";
        var cuerpo;
        for (var i = 0; i < griddataIV.length; i++) {
            tablaOT += "<tr><td width='10%'>&nbsp;" + griddataIV[i].codigoclase + "</td><td width='50%'><label class='w3-text-black' style='font-weight:bold; font-size:13px'>&nbsp;" + griddataIV[i].nombreclase + "</label></td>";
            var selINV = seleccionUSAIV(griddataIV[i].selINV, i);
            tablaOT += "<td width='30%'>" + selINV + "</td>";
        }
        tablaOT += "</table>";
        document.getElementById("divInspeccion").innerHTML = tablaOT;
        document.getElementById("divInspeccion").style.display = "initial";
        dataRespuesta1 = griddataIV;
    } catch (e) {
        alert("cargai" + e);
    }

}
function desactivaTabla(sn) {
    try {
        for (var i = 0; i < dataRespuesta.length; i++) {
            if (dataRespuesta[i].tipo_respuesta == "SELECCION" || dataRespuesta[i].tipo_respuesta == "SEV") {
                if (dataRespuesta[i].tipo_respuesta == "SEV") {
                    for (var l = 0; l < dataRespuesta[i].sevResp.length; l++) {
                        if (document.getElementById("SEV" + i + "" + l) != null) {
                            document.getElementById("SEV" + i + "" + l).disabled = sn;
                        }
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuesta[i].tipo_respuesta == "ER") {
                for (var k = 0; k < dataRespuesta[i].erResp.length; k++) {
                    if (document.getElementById("ER" + i + "" + k) != null) {
                        document.getElementById("ER" + i + "" + k).disabled = sn;
                    }
                }
                document.getElementById("SEL" + i).disabled = sn;
            }
            if (dataRespuesta[i].tipo_respuesta == "EV") {
                for (var m = 0; m < dataRespuesta[i].evResp.length; m++) {
                    if (document.getElementById("EV" + i + "" + m) != null) {
                        document.getElementById("EV" + i + "" + m).disabled = sn;
                    }
                }
            }
        }
        document.getElementById("guardaAV2").disabled = sn;
        document.getElementById("guardaAV0").disabled = sn;
        document.getElementById("observacionU").disabled = sn;
        
        /* document.getElementById("clase2").disabled = sn;
        document.getElementById("subclase2").disabled = sn;
        document.getElementById("combustible2").disabled = sn;
        document.getElementById("traccionn2").disabled = sn;
        document.getElementById("transmision2").disabled = sn; */
        
     } catch (e) { alert(e); }
}
function imgLogoEV() {
    return "<img src='data:image/png;base64,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' height='60' width='129'>";
}