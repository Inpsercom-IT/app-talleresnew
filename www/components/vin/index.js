/*=======================================================================
Fecha: 01/02/2018
=======================================================================
Detalles: 
- Registro de VIN
- Consulta por VIN (KIA / Otros)
=======================================================================
Autor: RRP.
=======================================================================*/


'use strict';

app.vin = kendo.observable({
    onShow: function () {
        llamarNuevoestilo("btnBuscarVin");
        llamarColorTexto(".w3-text-red");
        llamarNuevoestilo("lydVin");
        usuPrincipal();
        cierraControlGral();
        vaciaVIN();
    },
    afterShow: function () { }
});
app.localization.registerView('vin');

// START_CUSTOM_CODE_vin
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes


var arrCbo01 = ["codigo_marca", "codigo_modelo", "color_vehiculo", "tipo_auto"];
var arrTxt01 = ["chasisRV", "anio_modelo", "version_motor", "tipo_transmision", "cilindraje", "codigo_traccion"];


/*--------------------------------------------------------------------
Fecha: 08/12/2017
Detalle: Seteo de controles
--------------------------------------------------------------------*/
function vaciaVIN() {
    document.getElementById('infVIN').value = "";
    document.getElementById("nuevoVin").innerHTML = "";

    document.getElementById("divInfoVIN").style.display = 'none';


    kendo.ui.progress($("#vinScreen"), false);

    $("#tabstripVIN").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });
    //---------------------------------------------------
    // GRID
    try {
        // Grid VIN
        var grid2 = $("#gridVIN2").data("kendoGrid");
        grid2.destroy();
    }
    catch (evin)
    { }
    document.getElementById("gridVIN2").style.display = 'none';
    //---------------------------------------------------
    document.getElementById("lblKia").innerHTML = localStorage.getItem("ls_idmarca").toLocaleString();
    document.getElementById("chasisRV").value = "";
    cboMarcas(localStorage.getItem("ls_idmarca").toLocaleString());
    cboModelos(document.getElementById("codigo_marca").value, "");
    cboColores("");
    cboTipoAutos("");
    document.getElementById("anio_modelo").value = "";
    document.getElementById("version_motor").value = "";
    document.getElementById("tipo_transmision").value = "";
    document.getElementById("cilindraje").value = "";
    document.getElementById("codigo_traccion").value = "";

    document.getElementById("tipo_producto").value = "VEHICULOS";

   for (var i = 0; i < arrCbo01.length; i++) {
        document.getElementById(arrCbo01[i]).disabled = false;
        document.getElementById(arrCbo01[i]).setAttribute("class", "w3-input w3-border textos");
    }


    for (var i = 0; i < arrTxt01.length; i++) {
        document.getElementById(arrTxt01[i]).readOnly = false;
        document.getElementById(arrTxt01[i]).setAttribute("class", "w3-input w3-border textos");
    }


    //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
    //    document.getElementById("btnGuardaInfoVin").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    //        "<button onclick='registrarVIN();' class='w3-btn w3-red'><i class='fa fa-floppy-o' aria-hidden='true'></i> GENERAR VIN</button>" +
    //"<button onclick='vaciaVIN();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    //}
    //else {
    //    document.getElementById("btnGuardaInfoVin").innerHTML = "<button onclick='abrirPagina(\"home\")' class='w3-btn w3-red'><i class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    //        "<button onclick='registrarVIN();' class='w3-btn w3-red'><i class='fa fa-floppy-o' aria-hidden='true'></i></button>" +
    //"<button onclick='vaciaVIN();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i></button>";
    //}


    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
    "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    }
    else {
        document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
    "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestilo("btnRegresarVin");

}


function vaciaVIN_2() {

    document.getElementById('infVIN').value = "";
    document.getElementById("nuevoVin").innerHTML = "";


    document.getElementById("gridVIN2").style.display = 'none';

    document.getElementById("divInfoVIN").style.display = 'initial';

        kendo.ui.progress($("#vinScreen"), false);

    $("#tabstripVIN").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        }
    });

    //---------------------------------------------------
    // GRID
    try {
        // Grid VIN
        var grid2 = $("#gridVIN2").data("kendoGrid");
        grid2.destroy();
    }
    catch (evin)
    { }
    document.getElementById("gridVIN2").style.display = 'none';
    //---------------------------------------------------

    document.getElementById("lblKia").innerHTML = localStorage.getItem("ls_idmarca").toLocaleString();

    document.getElementById("chasisRV").value = "";
    cboMarcas(localStorage.getItem("ls_idmarca").toLocaleString());
    cboModelos(document.getElementById("codigo_marca").value, "");
    cboColores("");
    cboTipoAutos("");

    document.getElementById("anio_modelo").value = "";
    document.getElementById("version_motor").value = "";
    document.getElementById("tipo_transmision").value = "";
    document.getElementById("cilindraje").value = "";
    document.getElementById("codigo_traccion").value = "";

    document.getElementById("tipo_producto").value = "VEHICULOS";


    for (var i = 0; i < arrCbo01.length; i++) {
        document.getElementById(arrCbo01[i]).disabled = false;
        document.getElementById(arrCbo01[i]).setAttribute("class", "w3-input w3-border textos");
    }


    for (var i = 0; i < arrTxt01.length; i++) {
        document.getElementById(arrTxt01[i]).readOnly = false;
        document.getElementById(arrTxt01[i]).setAttribute("class", "w3-input w3-border textos");
    }

    if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
        document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
            "<button id='btnRegresarVin1' onclick='registrarVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-floppy-o' aria-hidden='true'></i> GENERAR VIN</button>" +
    "<button id='btnRegresarVin2' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin2' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
    }
    else {
        document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
            "<button id='btnRegresarVin1' onclick='registrarVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-floppy-o' aria-hidden='true'></i></button>" +
    "<button id='btnRegresarVin2' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin2' class='fa fa-file' aria-hidden='true'></i></button>";
    }
    llamarNuevoestilo("btnRegresarVin");
    llamarNuevoestiloIconB("icnRegresarVin");

}


/*--------------------------------------------------------------------
Fecha: 08/12/2017
Detalle: Registro de nuevo VIN
--------------------------------------------------------------------*/
function registrarVIN() {
    try {

        var validaVin = true;

        // chasis
        var chasis = document.getElementById("chasisRV").value;

        // Solo numeros y letras
        for (var i = 0; i < chasis.length; i++) {
            if (!(((chasis.charAt(i) >= "0") && (chasis.charAt(i) <= "9")) ||
                    ((chasis.charAt(i) >= "a") && (chasis.charAt(i) <= "z")) ||
                    ((chasis.charAt(i) >= "A") && (chasis.charAt(i) <= "Z")))) {
                validaVin = false;
                break;
            }
        }

        if (chasis.trim() == "" || chasis.trim().length != 17 || validaVin == false) {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Chasis incorrecto<br/>Debe contener 17 caracteres N&uacute;meros y Letras");
            return;
        }

        var codigo_marca = document.getElementById("codigo_marca").value;
        var codigo_modelo = document.getElementById("codigo_modelo").value;

        if (codigo_modelo.trim() == "") {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Seleccione el Modelo");
            return;
        }

        var color_vehiculo = document.getElementById("color_vehiculo").value;
        var tipo_auto = document.getElementById("tipo_auto").value;



        // a�o modelo
        var anio_modelo = document.getElementById("anio_modelo").value;

       // alert(anio_modelo);

       // alert(anio_modelo);

        //if (anio_modelo.trim() == "") {
        //    kendo.ui.progress($("#vinScreen"), false);
        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el A&ntilde;o Modelo");
        //    return;
        //}
        //else {

            if (parseInt(anio_modelo.trim()) <= 1900) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el A&ntilde;o Modelo Correctamente<br />No puede ser menor a 1900");
                return;
            }

            var today = new Date();
            var yyyy = today.getFullYear();

            if (parseInt(anio_modelo.trim()) > yyyy + 1) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el A&ntilde;o Modelo Correctamente<br />No puede ser mayor a 1 a&ntilde;o de la fecha actual");
                return;
            }
      //  }

        //// version motor
        var version_motor = document.getElementById("version_motor").value;
        //if (version_motor.trim() == "") {
        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese la Versi&oacute;n del Motor");
        //    return;
        //}
        //// Tipo transmision
        var tipo_transmision = document.getElementById("tipo_transmision").value;
        //if (tipo_transmision.trim() == "") {
        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el Tipo Transmisi&oacute;n");
        //    return;
        //}
        //// Cilindraje
        var cilindraje = document.getElementById("cilindraje").value;
        //if (cilindraje.trim() == "") {
        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el Cilindraje");
        //    return;
        //}
        //// Codigo traccion
        var codigo_traccion = document.getElementById("codigo_traccion").value;
        //if (codigo_traccion.trim() == "") {
        //    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el C&oacute;digo Tracci&oacute;n");
        //    return;
        //}

        // Van por def.
        var tipo_producto = document.getElementById("tipo_producto").value;
        var estado = document.getElementById("estado").value;

        var accesorios_concesionario = "";	 //	accesorios_concesionario    char           x(15)
        var accesorios_pdi = "";	 //	accesorios_pdi              char           x(15)
        var agrupador_asignacion = "";	 //	agrupador_asignacion        char           x(8)
        var agrupador_facturacion = "";	 //	agrupador_facturacion       char           x(8)
        var agrupador_importacion = "";	 //	agrupador_importacion       char           x(8)
        var agrupador_temporal = "";	 //	agrupador_temporal          char           x(8)
        var almacen_comp_concesionario = "";	 //	almacen_comp_concesionario  char           x(3)
        var almacen_reserva = "";	 //	almacen_reserva             char       i   x(3)
        var anio_cpn = 0;	 //	anio_cpn                    inte       i   9999
        var anio_entrega = 0;	 //	anio_entrega                inte       i   9999
        var anio_ga62 = 0;	 //	anio_ga62                   inte           9999
        var anio_im22 = 0;	 //	anio_im22                   inte       i   9999
        var anio_kdvin = "";	 //	anio_kdvin                  char           xx
        var anio_kdvin_calendario = 0;	 //	anio_kdvin_calendario       inte       i   9999
        // var anio_modelo = 0;	 //	anio_modelo                 inte           9999
        var anio_mrds = "";	 //	anio_mrds                   char           xx
        var anio_mrds_calendario = 0;	 //	anio_mrds_calendario        inte       i   9999
        var anio_orden_produccion = 0;	 //	anio_orden_produccion       inte           9999
        var anio_vh26 = 0;	 //	anio_vh26                   inte       i   9999
        var anio_vh39 = 0;	 //	anio_vh39                   inte           9999
        var anio_vh56 = 0;	 //	anio_vh56                   inte           >>>>>9
        var anio_vh57 = 0;	 //	anio_vh57                   inte           9999
        var anio_vh58 = 0;	 //	anio_vh58                   inte           9999
        var aprobacion_especial = null;	 //	aprobacion_especial         date           99/99/9999
        var aseguradora_retail = "";	 //	aseguradora_retail          char           x(20)
        var autoparte = false;	 //	autoparte                   logi           Si/No
        var autorizacion_sri_concesiona = "";	 //	autorizacion_sri_concesiona char           X(49)
        var banco_retail = "";	 //	banco_retail                char           x(20)
        var bateria_codigo = "";	 //	bateria_codigo              char           x(30)
        var bateria_voltaje = 0;	 //	bateria_voltaje             deci-2         >9.99
        var bodega_destino = "";	 //	bodega_destino              char           x(30)
        var bodega_origen = "";	 //	bodega_origen               char           x(30)
        var calle_interseccion_propieta = "";	 //	calle_interseccion_propieta char           X(150)
        var calle_principal_propietario = "";	 //	calle_principal_propietario char           X(150)
        var cambio_datos = false;	 //	cambio_datos                logi           Si/No
        var canton_matriculacion = "";	 //	canton_matriculacion        char           x(20)
        var capacidad_pasajeros = 0;	 //	capacidad_pasajeros         inte           >>>9
        var carga_util = 0;	 //	carga_util                  deci-2         >>,>>9.99
        var causal_bloqueo = "";	 //	causal_bloqueo              char           x(25)
        //  var chasis = "";	 //	chasis                      char       i   X(30)
        var chasis_anterior = "";	 //	chasis_anterior             char           X(30)
        //   var cilindraje = "";	 //	cilindraje                  char           X(20)
        var ciudad_entrega_concesionari = "";	 //	ciudad_entrega_concesionari char           X(40)
        var ciudad_nacionaliza = "";	 //	ciudad_nacionaliza          char           x(20)
        var ciudad_propietario = "";	 //	ciudad_propietario          char           X(40)
        var ciudad_punto_venta = "";	 //	ciudad_punto_venta          char           X(40)
        var clase_auto = "";	 //	clase_auto                  char           x(20)

        var codigo_agencia = localStorage.getItem("ls_usagencia").toLocaleString();	 //	codigo_agencia              char       i   x(30)
        var codigo_agencia_origen = "";	 //	codigo_agencia_origen       char           x(30)
        var codigo_color_primario = "";	 //	codigo_color_primario       char           x(25)
        var codigo_concesionario = "";	 //	codigo_concesionario        char       i   X(5)
        var codigo_empresa = localStorage.getItem("ls_idempresa").toLocaleString();	 //	codigo_empresa              inte       i   >>>9
        var codigo_entrega = "";	 //	codigo_entrega              char           x(10)
        var codigo_especificacion = "";	 //	codigo_especificacion       char           x(15)
        var codigo_familia = "";	 //	codigo_familia              char           X(20)
        var codigo_importacion = "";	 //	codigo_importacion          char       i   X(20)
        var codigo_inen = "";	 //	codigo_inen                 char           X(20)
        var codigo_llave = "";	 //	codigo_llave                char           x(15)
        //   var codigo_marca = "";	 //	codigo_marca                char       i   x(20)
        // var codigo_modelo = "";	 //	codigo_modelo               char       i   X(20)
        var codigo_packing = "";	 //	codigo_packing              char           x(25)
        var codigo_seriado_airbag = "";	 //	codigo_seriado_airbag       char           X(30)
        var codigo_subcategoria_subclas = "";	 //	codigo_subcategoria_subclas char           x(20)

        var codigo_sucursal = localStorage.getItem("ls_ussucursal").toLocaleString();;	 //	codigo_sucursal             char       i   x(30)
        var codigo_sucursal_origen = "";	 //	codigo_sucursal_origen      char           x(30)
        //  var codigo_traccion = "";	 //	codigo_traccion             char           x(20)
        var codigo_vendedor = "";	 //	codigo_vendedor             char           x(20)
        var codigo_vendedor_entrega = "";	 //	codigo_vendedor_entrega     char           x(20)
        var color_interno = "";	 //	color_interno               char           X(30)
        var color_origen = "";	 //	color_origen                char           X(40)
        //  var color_vehiculo = "";	 //	color_vehiculo              char           X(30)
        var con_iva_venta = false;	 //	con_iva_venta               logi           SI/NO
        var concesionario_asignado = "";	 //	concesionario_asignado      char           X(25)
        var conocimiento_embarque = "";	 //	conocimiento_embarque       char       i   X(15)
        var contabilizado = false;	 //	contabilizado               logi           Si/No
        var contabilizado_entrega = false;	 //	contabilizado_entrega       logi           Si/No
        var costeo = false;	 //	costeo                      logi           Si/No
        var costo = 0;	 //	costo                       deci-2         ->>>,>>>,>>>,>>9.99
        var costo_acc_facturados = 0;	 //	costo_acc_facturados        deci-2         ->>>,>>>,>>>,>>9.99
        var costo_accesorios = 0;	 //	costo_accesorios            deci-2         ->>>,>>>,>>>,>>9.99
        var costo_ajustes = 0;	 //	costo_ajustes               deci-2         ->>>,>>>,>>>,>>9.99
        var costo_autoparte = 0;	 //	costo_autoparte             deci-2         ->>>,>>>,>>>,>>9.99
        var costo_fob = 0;	 //	costo_fob                   deci-2         ->>>,>>>,>>>,>>9.99
        var costo_gf = 0;	 //	costo_gf                    deci-2         ->>>,>>>,>>>,>>9.99
        var costo_gf_autoparte = 0;	 //	costo_gf_autoparte          deci-2         ->>>,>>>,>>9.99
        var costo_items_autoparte = 0;	 //	costo_items_autoparte       deci-2         ->>>,>>>,>>>,>>9.99
        var costo_items_consignacion = 0;	 //	costo_items_consignacion    deci-2         ->>>,>>>,>>>,>>9.99
        var costo_items_ensamble = 0;	 //	costo_items_ensamble        deci-2         ->>>,>>>,>>>,>>9.99
        var costo_kit = 0;	 //	costo_kit                   deci-2         ->>>,>>>,>>9.99
        var costo_mo = 0;	 //	costo_mo                    deci-2         ->>>,>>>,>>>,>>9.99
        var costo_mo_autoparte = 0;	 //	costo_mo_autoparte          deci-2         ->>>,>>>,>>>,>>9.99
        var costo_nacionalizacion = 0;	 //	costo_nacionalizacion       deci-2         ->>>,>>>,>>>,>>9.99
        var costo_origen = 0;	 //	costo_origen                deci-2         ->>>,>>>,>>9.99
        var costo_promedio_pt = 0;	 //	costo_promedio_pt           deci-6         ->>>,>>>,>>>,>>9.999999
        var costo_transformacion = 0;	 //	costo_transformacion        deci-2         ->>>,>>>,>>>,>>9.99
        var costo_vehiculo = 0;	 //	costo_vehiculo              deci-2         ->>>,>>>,>>>,>>9.99
        var destino_final = "";	 //	destino_final               char           X(25)
        var ejercicio = 0;	 //	ejercicio                   inte           >>>9
        var ejercicio_contable_liquidac = 0;	 //	ejercicio_contable_liquidac inte           >>>9
        var ejercicio_entrega = 0;	 //	ejercicio_entrega           inte           >>>9
        var en_consignacion = false;	 //	en_consignacion             logi           Si/No
        //  var estado = "";	 //	estado                      char           X(15)
        var estado_costeo = "";	 //	estado_costeo               char       i   X(15)
        var estado_costeo_autoparte = "";	 //	estado_costeo_autoparte     char       i   X(15)
        var estado_disponible = "";	 //	estado_disponible           char           X(15)
        var estado_entrega = "";	 //	estado_entrega              char           X(15)
        var estado_nacionalizacion = "";	 //	estado_nacionalizacion      char           X(20)
        var estado_sri = "";	 //	estado_sri                  char           X(15)
        var estado_sri_ensamblaje = "";	 //	estado_sri_ensamblaje       char           X(15)
        var estado_transferencia_materi = "";	 //	estado_transferencia_materi char           x(15)
        var estado_usado = "";	 //	estado_usado                char           X(15)
        var exportacion = false;	 //	exportacion                 logi           Si/No
        var factor = 0;	 //	factor                      deci-8         ->>,>>9.99999999
        var fecha_adhesivo = null;	 //	fecha_adhesivo              date           99/99/9999
        var fecha_aprobacion = null;	 //	fecha_aprobacion            date           99/99/9999
        var fecha_bloqueo = null;	 //	fecha_bloqueo               date           99/99/9999
        var fecha_conocimiento_embarque = null;	 //	fecha_conocimiento_embarque date           99/99/9999
        var fecha_contable_liquidacion = null;	 //	fecha_contable_liquidacion  date           99/99/9999
        var fecha_creacion = null;	 //	fecha_creacion              date           99/99/9999
        var fecha_declaracion = null;	 //	fecha_declaracion           date           99/99/9999
        var fecha_destino_final = null;	 //	fecha_destino_final         date           99/99/9999
        var fecha_documento_cg13 = null;	 //	fecha_documento_cg13        date           99/99/9999
        var fecha_embarque = null;	 //	fecha_embarque              date           99/99/9999
        var fecha_entrega = null;	 //	fecha_entrega               date           99/99/9999
        var fecha_envio_kdcs = null;	 //	fecha_envio_kdcs            date           99/99/9999
        var fecha_envio_sri = null;	 //	fecha_envio_sri             date           99/99/9999
        var fecha_factura_emb = null;	 //	fecha_factura_emb           date           99/99/9999
        var fecha_garantia = null;	 //	fecha_garantia              date       i   99/99/9999
        var fecha_garantia_anterior = null;	 //	fecha_garantia_anterior     date           99/99/9999
        var fecha_importacion = null;	 //	fecha_importacion           date           99/99/9999
        var fecha_ingreso = null;	 //	fecha_ingreso               date           99/99/9999
        var fecha_inicial_retail = null;	 //	fecha_inicial_retail        date           99/99/9999
        var fecha_kdvin = null;	 //	fecha_kdvin                 date           99/99/9999
        var fecha_levante = null;	 //	fecha_levante               date           99/99/9999
        var fecha_liquidacion_importaci = null;	 //	fecha_liquidacion_importaci date           99/99/9999
        var fecha_matriculacion = null;	 //	fecha_matriculacion         date           99/99/9999
        var fecha_modificacion = null;	 //	fecha_modificacion          date           99/99/9999
        var fecha_mrds = null;	 //	fecha_mrds                  date           99/99/9999
        var fecha_nacimiento_propietari = null;	 //	fecha_nacimiento_propietari date           99/99/9999
        var fecha_produccion = null;	 //	fecha_produccion            date       i   99/99/9999
        var fecha_produccion_autoparte = null;	 //	fecha_produccion_autoparte  date       i   99/99/9999
        var fecha_puerto_llegada = null;	 //	fecha_puerto_llegada        date           99/99/9999
        var fecha_rec_ventas = null;	 //	fecha_rec_ventas            date           99/99/9999
        var fecha_reporte_sri_ensamblaj = null;	 //	fecha_reporte_sri_ensamblaj date           99/99/9999
        var fecha_reserva = null;	 //	fecha_reserva               date           99/99/9999
        var fecha_retail = null;	 //	fecha_retail                date           99/99/9999
        var fecha_retail_origen = null;	 //	fecha_retail_origen         date           99/99/9999
        var fecha_sri = null;	 //	fecha_sri                   date           99/99/9999
        var fecha_wholesale = null;	 //	fecha_wholesale             date           99/99/9999
        var flete_moneda_extranjera = 0;	 //	flete_moneda_extranjera     deci-2         ->>>,>>>,>>9.99
        var fob_moneda_extranjera = 0;	 //	fob_moneda_extranjera       deci-6         ->,>>>,>>9.999999
        var forma_pago_retail = "";	 //	forma_pago_retail           char           x(20)
        var fsc = "";	 //	fsc                         char       i   X(20)
        var fsc_origen = "";	 //	fsc_origen                  char           X(20)
        var genero_costo = false;	 //	genero_costo                logi           Si/No
        var grupo_concesionario = "";	 //	grupo_concesionario         char       i   x(25)
        var hora_bloqueo = "";	 //	hora_bloqueo                char           x(15)
        var hora_creacion = "";	 //	hora_creacion               char           x(15)
        var hora_entrega = "";	 //	hora_entrega                char           x(15)
        var hora_envio_sri = "";	 //	hora_envio_sri              char           X(15)
        var hora_envio_sri_ensamblaje = "";	 //	hora_envio_sri_ensamblaje   char           X(15)
        var hora_liquidacion_importacio = "";	 //	hora_liquidacion_importacio char           x(15)
        var hora_modificacion = "";	 //	hora_modificacion           char           x(15)
        var hora_reserva = "";	 //	hora_reserva                char           x(15)
        var id_vendedor = "";	 //	id_vendedor                 char           X(15)
        var id_vendedor_entrega = "";	 //	id_vendedor_entrega         char           X(15)
        var impuesto_ice = 0;	 //	impuesto_ice                deci-2         ->>,>>9.99
        var informe_tecnico = "";	 //	informe_tecnico             char           X(20)
        var lote_importacion = "";	 //	lote_importacion            char           x(25)
        var lote_numero = 0;	 //	lote_numero                 inte           >>>>>>9
        var lote_produccion = "";	 //	lote_produccion             char           X(20)
        var mail_1_propietario = "";	 //	mail_1_propietario          char           X(50)
        var mes_kdvin = 0;	 //	mes_kdvin                   inte       i   99
        var mes_mrds = 0;	 //	mes_mrds                    inte       i   99
        var modelo_comercial = "";	 //	modelo_comercial            char           X(20)
        var modelo_version = "";	 //	modelo_version              char       i   x(25)
        var modelo_version_origen = "";	 //	modelo_version_origen       char           x(25)
        var nacionalizado = false;	 //	nacionalizado               logi           Si/No
        var nombre_intermediario_nacion = "";	 //	nombre_intermediario_nacion char           x(65)
        var nombre_propietario = "";	 //	nombre_propietario          char           X(256)
        var num_carta_credito = "";	 //	num_carta_credito           char           x(20)
        var num_trn_exterior = 0;	 //	num_trn_exterior            inte       i   >,>>>,>>9
        var numero_asiento_liquidacion = 0;	 //	numero_asiento_liquidacion  inte           ->,>>>,>>9
        var numero_autoadhesivo = "";	 //	numero_autoadhesivo         char           x(20)
        var numero_cae = "";	 //	numero_cae                  char           X(20)
        var numero_calle_propietario = "";	 //	numero_calle_propietario    char           X(15)
        var numero_carroceria = 0;	 //	numero_carroceria           inte           >>>>>>9
        var numero_chasis = 0;	 //	numero_chasis               inte           9999999
        var numero_ckd = "";	 //	numero_ckd                  char           x(20)
        var numero_comp_concesionario = 0;	 //	numero_comp_concesionario   inte           9999999
        var numero_cpn = "";	 //	numero_cpn                  char           X(20)
        var numero_cpn_anterior = "";	 //	numero_cpn_anterior         char           X(20)
        var numero_declaracion = "";	 //	numero_declaracion          char           x(17)
        var numero_ejes = 0;	 //	numero_ejes                 inte           >>9
        var numero_envio = 0;	 //	numero_envio                inte           9999999
        var numero_envio_ensamblaje = 0;	 //	numero_envio_ensamblaje     inte           9999999
        var numero_factura_emb = "";	 //	numero_factura_emb          char           x(25)
        var numero_factura_vh26 = 0;	 //	numero_factura_vh26         inte       i   ->,>>>,>>9
        var numero_id_propietario = "";	 //	numero_id_propietario       char       i   X(15)
        var numero_kdvin = "";	 //	numero_kdvin                char       i   x(30)
        var numero_kdvin_anterior = "";	 //	numero_kdvin_anterior       char           x(30)
        var numero_kennumber = "";	 //	numero_kennumber            char           x(15)
        var numero_levante = "";	 //	numero_levante              char           x(20)
        var numero_motor = "";	 //	numero_motor                char           X(30)
        var numero_mrds = "";	 //	numero_mrds                 char       i   x(30)
        var numero_orden_produccion = 0;	 //	numero_orden_produccion     inte           >>>>>>9
        var numero_puertas = 0;	 //	numero_puertas              inte           >>9
        var numero_ruedas = 0;	 //	numero_ruedas               inte           >9
        var observaciones = "";	 //	observaciones               char           X(100)
        var opcion = "";	 //	opcion                      char           x(2)
        var opcion_origen = "";	 //	opcion_origen               char           x(2)
        var otros_moneda_extranjera = 0;	 //	otros_moneda_extranjera     deci-2         ->>>,>>>,>>9.99
        var pais = "";	 //	pais                        char           X(20)
        var pais_origen_vehiculo = "";	 //	pais_origen_vehiculo        char           X(20)
        var partida_arancelaria = "";	 //	partida_arancelaria         char           X(20)
        var partno_proveedor_pt = "";	 //	partno_proveedor_pt         char           X(30)
        var persona_numero_ga62 = 0;	 //	persona_numero_ga62         inte           >>>>>>>>>9
        var peso_auto = 0;	 //	peso_auto                   deci-2         >>,>>9.99
        var placa = "";	 //	placa                       char       i   x(15)
        var precio_venta = 0;	 //	precio_venta                deci-2         ->>>,>>>,>>>,>>9.99
        var prefijo_catalogo_pt = "";	 //	prefijo_catalogo_pt         char           X(3)
        var prog_creacion = "";	 //	prog_creacion               char           X(15)
        var prog_envio_sri = "";	 //	prog_envio_sri              char           X(15)
        var prog_envio_sri_ensamblaje = "";	 //	prog_envio_sri_ensamblaje   char           X(15)
        var prog_modificacion = "";	 //	prog_modificacion           char           X(15)
        var provincia_matriculacion = "";	 //	provincia_matriculacion     char           X(30)
        var provincia_tel_propietario = "";	 //	provincia_tel_propietario   char           x(20)
        var puerto_embarque = "";	 //	puerto_embarque             char           X(20)
        var puerto_llegada = "";	 //	puerto_llegada              char           X(25)
        var punto_venta = "";	 //	punto_venta                 char           x(20)
        var responsable_garantia = "";	 //	responsable_garantia        char       i   X(15)
        var secuencia_cg04 = 0;	 //	secuencia_cg04              inte           ->,>>>,>>9
        var secuencia_cg04_entrega = 0;	 //	secuencia_cg04_entrega      inte           ->,>>>,>>9
        var secuencia_cpn = 0;	 //	secuencia_cpn               inte       i   >,>>>,>>9
        var secuencia_entrega = 0;	 //	secuencia_entrega           inte       i   >,>>>,>>9
        var secuencia_factura_reserva = 0;	 //	secuencia_factura_reserva   inte       i   999999999
        var secuencia_ga62 = 0;	 //	secuencia_ga62              inte           >>>>>>9
        var secuencia_im18 = 0;	 //	secuencia_im18              inte       i   >>>>>>9
        var secuencia_im22 = 0;	 //	secuencia_im22              inte       i   ->,>>>,>>9
        var secuencia_im23 = 0;	 //	secuencia_im23              inte       i   ->,>>>,>>9
        var secuencia_kdvin = 0;	 //	secuencia_kdvin             inte       i   >,>>>,>>9
        var secuencia_mf05 = 0;	 //	secuencia_mf05              inte           >>>>>>9
        var secuencia_mf05_origen = 0;	 //	secuencia_mf05_origen       inte           >>>>>>9
        var secuencia_mrds = 0;	 //	secuencia_mrds              inte       i   >,>>>,>>9
        var secuencia_orden_produccion = 0;	 //	secuencia_orden_produccion  inte           >>>>>>9
        var secuencia_vh32 = 0;	 //	secuencia_vh32              inte       i   >,>>>,>>9
        var secuencia_vh39 = 0;	 //	secuencia_vh39              inte           ->,>>>,>>9
        var secuencia_vh40 = 0;	 //	secuencia_vh40              inte           ->,>>>,>>9
        var secuencia_vh56 = 0;	 //	secuencia_vh56              inte           >,>>>,>>9
        var secuencia_vh57 = 0;	 //	secuencia_vh57              inte           >>>>>>9
        var secuencia_vh58 = 0;	 //	secuencia_vh58              inte           >>>>>>9
        var secuencia_vh59 = 0;	 //	secuencia_vh59              inte           ->,>>>,>>9
        var seguro_moneda_extranjera = 0;	 //	seguro_moneda_extranjera    deci-2         ->>>,>>>,>>9.99
        var serie_comp_concesionario = "";	 //	serie_comp_concesionario    char           x(3)
        var serie_reserva = "";	 //	serie_reserva               char       i   x(3)
        var servicio_vehiculo = "";	 //	servicio_vehiculo           char           x(20)
        var sexo_propietario = false;	 //	sexo_propietario            logi           Masculino/Femenino
        var subclase_auto = "";	 //	subclase_auto               char           X(20)
        var taller = "";	 //	taller                      char           X(25)
        var telefono_movil_propietario = "";	 //	telefono_movil_propietario  char           X(20)
        var telefono_propietario = "";	 //	telefono_propietario        char           X(15)
        //   var tipo_auto = "";	 //	tipo_auto                   char           X(8)
        var tipo_carroceria = "";	 //	tipo_carroceria             char           x(20)
        var tipo_combustible = "";	 //	tipo_combustible            char           x(20)
        var tipo_comp_concesionario = "";	 //	tipo_comp_concesionario     char           x(20)
        var tipo_dir_propietario = "";	 //	tipo_dir_propietario        char           x(20)
        var tipo_documento_reserva = "";	 //	tipo_documento_reserva      char       i   X(8)
        var tipo_id_propietario = "";	 //	tipo_id_propietario         char           x(20)
        var tipo_produccion = "";	 //	tipo_produccion             char           x(8)
        //  var tipo_producto = "";	 //	tipo_producto               char           x(20)
        var tipo_servicio = "";	 //	tipo_servicio               char           x(20)
        var tipo_servicio_nacionaliza = "";	 //	tipo_servicio_nacionaliza   char           x(20)
        var tipo_telefono_propietario = "";	 //	tipo_telefono_propietario   char           x(20)
        //   var tipo_transmision = "";	 //	tipo_transmision            char           x(20)
        var transporte_reserva_lote = "";	 //	transporte_reserva_lote     char           x(20)
        var ubicacion = "";	 //	ubicacion                   char           X(25)
        var uso_vehiculo = "";	 //	uso_vehiculo                char           x(20)
        var usuario_bloqueo = "";	 //	usuario_bloqueo             char           X(20)
        var usuario_creacion = "";	 //	usuario_creacion            char           X(20)
        var usuario_entrega = "";	 //	usuario_entrega             char           X(20)
        var usuario_envio_sri = "";	 //	usuario_envio_sri           char           X(20)
        var usuario_envio_sri_ensamblaj = "";	 //	usuario_envio_sri_ensamblaj char           X(20)
        var usuario_liquidacion_importa = "";	 //	usuario_liquidacion_importa char           x(20)
        var usuario_modificacion = "";	 //	usuario_modificacion        char           X(20)
        var usuario_reserva = "";	 //	usuario_reserva             char           X(20)
        var valor_flete = 0;	 //	valor_flete                 deci-2         ->>>,>>>,>>9.99
        var valor_otros = 0;	 //	valor_otros                 deci-2         ->>>,>>>,>>9.99
        var valor_seguro = 0;	 //	valor_seguro                deci-2         ->>>,>>>,>>9.99
        // var version_motor = "";	 //	version_motor               char           x(8)
        var vin_destino = "";	 //	vin_destino                 char       i   X(30)
        var vin_origen = "";	 //	vin_origen                  char           X(30)


        var params = {
            "chasis": chasis,
            "tipo_auto": tipo_auto,
            "codigo_modelo": codigo_modelo,
            "numero_motor": numero_motor,
            "nombre_propietario": nombre_propietario,
            "color_vehiculo": color_vehiculo,
            "fecha_produccion": fecha_produccion,
            "lote_produccion": lote_produccion,
            "fsc": fsc,
            "codigo_concesionario": codigo_concesionario,
            "codigo_importacion": codigo_importacion,
            "fecha_importacion": fecha_importacion,
            "fecha_wholesale": fecha_wholesale,
            "fecha_retail": fecha_retail,
            "fecha_sri": fecha_sri,
            "fecha_garantia": fecha_garantia,
            "fecha_ingreso": fecha_ingreso,
            "fecha_aprobacion": fecha_aprobacion,
            "fecha_rec_ventas": fecha_rec_ventas,
            "numero_cae": numero_cae,
            "numero_cpn": numero_cpn,
            "anio_modelo": anio_modelo,
            "color_origen": color_origen,
            "observaciones": observaciones,
            "estado": estado,
            "fecha_embarque": fecha_embarque,
            "costo": costo,
            "costo_fob": costo_fob,
            "factor": factor,
            "aprobacion_especial": aprobacion_especial,
            "fecha_entrega": fecha_entrega,
            "ubicacion": ubicacion,
            "concesionario_asignado": concesionario_asignado,
            "taller": taller,
            "impuesto_ice": impuesto_ice,
            "placa": placa,
            "numero_mrds": numero_mrds,
            "fecha_mrds": fecha_mrds,
            "codigo_empresa": codigo_empresa,
            "responsable_garantia": responsable_garantia,
            "codigo_sucursal": codigo_sucursal,
            "tipo_id_propietario": tipo_id_propietario,
            "codigo_agencia": codigo_agencia,
            "numero_id_propietario": numero_id_propietario,
            "tipo_comp_concesionario": tipo_comp_concesionario,
            "almacen_comp_concesionario": almacen_comp_concesionario,
            "serie_comp_concesionario": serie_comp_concesionario,
            "numero_comp_concesionario": numero_comp_concesionario,
            "autorizacion_sri_concesiona": autorizacion_sri_concesiona,
            "precio_venta": precio_venta,
            "canton_matriculacion": canton_matriculacion,
            "tipo_dir_propietario": tipo_dir_propietario,
            "calle_principal_propietario": calle_principal_propietario,
            "numero_calle_propietario": numero_calle_propietario,
            "calle_interseccion_propieta": calle_interseccion_propieta,
            "tipo_telefono_propietario": tipo_telefono_propietario,
            "provincia_tel_propietario": provincia_tel_propietario,
            "telefono_propietario": telefono_propietario,
            "estado_sri": estado_sri,
            "fecha_envio_sri": fecha_envio_sri,
            "usuario_envio_sri": usuario_envio_sri,
            "hora_envio_sri": hora_envio_sri,
            "prog_envio_sri": prog_envio_sri,
            "grupo_concesionario": grupo_concesionario,
            "codigo_vendedor": codigo_vendedor,
            "punto_venta": punto_venta,
            "banco_retail": banco_retail,
            "aseguradora_retail": aseguradora_retail,
            "forma_pago_retail": forma_pago_retail,
            "pais": pais,
            "provincia_matriculacion": provincia_matriculacion,
            "numero_envio": numero_envio,
            "fecha_envio_kdcs": fecha_envio_kdcs,
            "fecha_inicial_retail": fecha_inicial_retail,
            "codigo_marca": codigo_marca,
            "cilindraje": cilindraje,
            "tipo_combustible": tipo_combustible,
            "tipo_carroceria": tipo_carroceria,
            "capacidad_pasajeros": capacidad_pasajeros,
            "numero_ckd": numero_ckd,
            "carga_util": carga_util,
            "fecha_reporte_sri_ensamblaj": fecha_reporte_sri_ensamblaj,
            "estado_sri_ensamblaje": estado_sri_ensamblaje,
            "codigo_subcategoria_subclas": codigo_subcategoria_subclas,
            "usuario_envio_sri_ensamblaj": usuario_envio_sri_ensamblaj,
            "hora_envio_sri_ensamblaje": hora_envio_sri_ensamblaje,
            "prog_envio_sri_ensamblaje": prog_envio_sri_ensamblaje,
            "numero_envio_ensamblaje": numero_envio_ensamblaje,
            "tipo_documento_reserva": tipo_documento_reserva,
            "almacen_reserva": almacen_reserva,
            "serie_reserva": serie_reserva,
            "secuencia_factura_reserva": secuencia_factura_reserva,
            "fecha_reserva": fecha_reserva,
            "hora_reserva": hora_reserva,
            "usuario_reserva": usuario_reserva,
            "anio_vh26": anio_vh26,
            "numero_factura_vh26": numero_factura_vh26,
            "numero_kdvin": numero_kdvin,
            "fecha_kdvin": fecha_kdvin,
            "anio_kdvin_calendario": anio_kdvin_calendario,
            "anio_mrds": anio_mrds,
            "mes_mrds": mes_mrds,
            "secuencia_mrds": secuencia_mrds,
            "anio_mrds_calendario": anio_mrds_calendario,
            "anio_kdvin": anio_kdvin,
            "mes_kdvin": mes_kdvin,
            "secuencia_kdvin": secuencia_kdvin,
            "codigo_familia": codigo_familia,
            "chasis_anterior": chasis_anterior,
            "numero_cpn_anterior": numero_cpn_anterior,
            "cambio_datos": cambio_datos,
            "modelo_version": modelo_version,
            "opcion": opcion,
            "anio_orden_produccion": anio_orden_produccion,
            "numero_orden_produccion": numero_orden_produccion,
            "secuencia_orden_produccion": secuencia_orden_produccion,
            "codigo_packing": codigo_packing,
            "lote_numero": lote_numero,
            "numero_chasis": numero_chasis,
            "anio_cpn": anio_cpn,
            "secuencia_cpn": secuencia_cpn,
            "peso_auto": peso_auto,
            "num_trn_exterior": num_trn_exterior,
            "secuencia_vh32": secuencia_vh32,
            "secuencia_mf05": secuencia_mf05,
            "lote_importacion": lote_importacion,
            "codigo_color_primario": codigo_color_primario,
            "exportacion": exportacion,
            "codigo_traccion": codigo_traccion,
            "numero_carroceria": numero_carroceria,
            "costeo": costeo,
            "estado_costeo": estado_costeo,
            "contabilizado": contabilizado,
            "ejercicio": ejercicio,
            "secuencia_cg04": secuencia_cg04,
            "fecha_creacion": fecha_creacion,
            "hora_creacion": hora_creacion,
            "usuario_creacion": usuario_creacion,
            "anio_vh39": anio_vh39,
            "prog_creacion": prog_creacion,
            "secuencia_vh39": secuencia_vh39,
            "fecha_modificacion": fecha_modificacion,
            "secuencia_vh40": secuencia_vh40,
            "hora_modificacion": hora_modificacion,
            "usuario_modificacion": usuario_modificacion,
            "prog_modificacion": prog_modificacion,
            "fsc_origen": fsc_origen,
            "modelo_version_origen": modelo_version_origen,
            "secuencia_mf05_origen": secuencia_mf05_origen,
            "genero_costo": genero_costo,
            "partida_arancelaria": partida_arancelaria,
            "codigo_inen": codigo_inen,
            "tipo_transmision": tipo_transmision,
            "fecha_liquidacion_importaci": fecha_liquidacion_importaci,
            "hora_liquidacion_importacio": hora_liquidacion_importacio,
            "usuario_liquidacion_importa": usuario_liquidacion_importa,
            "fecha_contable_liquidacion": fecha_contable_liquidacion,
            "ejercicio_contable_liquidac": ejercicio_contable_liquidac,
            "numero_asiento_liquidacion": numero_asiento_liquidacion,
            "codigo_seriado_airbag": codigo_seriado_airbag,
            "causal_bloqueo": causal_bloqueo,
            "fecha_bloqueo": fecha_bloqueo,
            "hora_bloqueo": hora_bloqueo,
            "usuario_bloqueo": usuario_bloqueo,
            "codigo_especificacion": codigo_especificacion,
            "ciudad_punto_venta": ciudad_punto_venta,
            "anio_entrega": anio_entrega,
            "secuencia_entrega": secuencia_entrega,
            "codigo_entrega": codigo_entrega,
            "telefono_movil_propietario": telefono_movil_propietario,
            "mail_1_propietario": mail_1_propietario,
            "ciudad_propietario": ciudad_propietario,
            "uso_vehiculo": uso_vehiculo,
            "costo_vehiculo": costo_vehiculo,
            "costo_accesorios": costo_accesorios,
            "estado_transferencia_materi": estado_transferencia_materi,
            "estado_usado": estado_usado,
            "transporte_reserva_lote": transporte_reserva_lote,
            "pais_origen_vehiculo": pais_origen_vehiculo,
            "estado_costeo_autoparte": estado_costeo_autoparte,
            "fecha_produccion_autoparte": fecha_produccion_autoparte,
            "autoparte": autoparte,
            "costo_mo": costo_mo,
            "costo_gf": costo_gf,
            "costo_autoparte": costo_autoparte,
            "costo_mo_autoparte": costo_mo_autoparte,
            "costo_gf_autoparte": costo_gf_autoparte,
            "costo_items_ensamble": costo_items_ensamble,
            "costo_items_consignacion": costo_items_consignacion,
            "costo_items_autoparte": costo_items_autoparte,
            "numero_kdvin_anterior": numero_kdvin_anterior,
            "servicio_vehiculo": servicio_vehiculo,
            "anio_ga62": anio_ga62,
            "secuencia_ga62": secuencia_ga62,
            "persona_numero_ga62": persona_numero_ga62,
            "tipo_producto": tipo_producto,
            "bateria_codigo": bateria_codigo,
            "accesorios_pdi": accesorios_pdi,
            "accesorios_concesionario": accesorios_concesionario,
            "bateria_voltaje": bateria_voltaje,
            "opcion_origen": opcion_origen,
            "codigo_vendedor_entrega": codigo_vendedor_entrega,
            "id_vendedor": id_vendedor,
            "id_vendedor_entrega": id_vendedor_entrega,
            "costo_kit": costo_kit,
            "costo_acc_facturados": costo_acc_facturados,
            "costo_transformacion": costo_transformacion,
            "estado_disponible": estado_disponible,
            "costo_ajustes": costo_ajustes,
            "conocimiento_embarque": conocimiento_embarque,
            "estado_entrega": estado_entrega,
            "numero_factura_emb": numero_factura_emb,
            "fecha_factura_emb": fecha_factura_emb,
            "codigo_llave": codigo_llave,
            "costo_origen": costo_origen,
            "prefijo_catalogo_pt": prefijo_catalogo_pt,
            "fecha_puerto_llegada": fecha_puerto_llegada,
            "fecha_documento_cg13": fecha_documento_cg13,
            "partno_proveedor_pt": partno_proveedor_pt,
            "costo_promedio_pt": costo_promedio_pt,
            "fecha_destino_final": fecha_destino_final,
            "puerto_embarque": puerto_embarque,
            "puerto_llegada": puerto_llegada,
            "destino_final": destino_final,
            "con_iva_venta": con_iva_venta,
            "en_consignacion": en_consignacion,
            "anio_vh56": anio_vh56,
            "secuencia_vh56": secuencia_vh56,
            "codigo_sucursal_origen": codigo_sucursal_origen,
            "codigo_agencia_origen": codigo_agencia_origen,
            "informe_tecnico": informe_tecnico,
            "fecha_retail_origen": fecha_retail_origen,
            "modelo_comercial": modelo_comercial,
            "bodega_destino": bodega_destino,
            "bodega_origen": bodega_origen,
            "agrupador_temporal": agrupador_temporal,
            "agrupador_facturacion": agrupador_facturacion,
            "agrupador_importacion": agrupador_importacion,
            "anio_vh57": anio_vh57,
            "secuencia_vh57": secuencia_vh57,
            "ciudad_entrega_concesionari": ciudad_entrega_concesionari,
            "numero_declaracion": numero_declaracion,
            "fecha_declaracion": fecha_declaracion,
            "numero_levante": numero_levante,
            "fecha_levante": fecha_levante,
            "numero_autoadhesivo": numero_autoadhesivo,
            "fecha_adhesivo": fecha_adhesivo,
            "version_motor": version_motor,
            "fecha_conocimiento_embarque": fecha_conocimiento_embarque,
            "num_carta_credito": num_carta_credito,
            "anio_vh58": anio_vh58,
            "secuencia_vh58": secuencia_vh58,
            "secuencia_vh59": secuencia_vh59,
            "ciudad_nacionaliza": ciudad_nacionaliza,
            "nombre_intermediario_nacion": nombre_intermediario_nacion,
            "numero_puertas": numero_puertas,
            "subclase_auto": subclase_auto,
            "clase_auto": clase_auto,
            "tipo_servicio": tipo_servicio,
            "agrupador_asignacion": agrupador_asignacion,
            "color_interno": color_interno,
            "tipo_servicio_nacionaliza": tipo_servicio_nacionaliza,
            "secuencia_im18": secuencia_im18,
            "anio_im22": anio_im22,
            "secuencia_im22": secuencia_im22,
            "secuencia_im23": secuencia_im23,
            "valor_flete": valor_flete,
            "valor_seguro": valor_seguro,
            "valor_otros": valor_otros,
            "nacionalizado": nacionalizado,
            "estado_nacionalizacion": estado_nacionalizacion,
            "flete_moneda_extranjera": flete_moneda_extranjera,
            "seguro_moneda_extranjera": seguro_moneda_extranjera,
            "fob_moneda_extranjera": fob_moneda_extranjera,
            "otros_moneda_extranjera": otros_moneda_extranjera,
            "fecha_matriculacion": fecha_matriculacion,
            "numero_kennumber": numero_kennumber,
            "fecha_nacimiento_propietari": fecha_nacimiento_propietari,
            "sexo_propietario": sexo_propietario,
            "usuario_entrega": usuario_entrega,
            "hora_entrega": hora_entrega,
            "ejercicio_entrega": ejercicio_entrega,
            "secuencia_cg04_entrega": secuencia_cg04_entrega,
            "contabilizado_entrega": contabilizado_entrega,
            "fecha_garantia_anterior": fecha_garantia_anterior,
            "costo_nacionalizacion": costo_nacionalizacion,
            "numero_ejes": numero_ejes,
            "tipo_produccion": tipo_produccion,
            "numero_ruedas": numero_ruedas,
            "vin_destino": vin_destino,
            "vin_origen": vin_origen
        };

     //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(params));

        kendo.ui.progress($("#vinScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************

        // 186.71.21.170:8077/taller/Services/vh/Vehiculos.svc/vh01VehiculosSet/
        var UrlGuardaVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosSet";



        $.ajax({
            url: UrlGuardaVIN,
            type: "POST",
            data: JSON.stringify(params),
            async: false,
            dataType: "json",
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            success: function (data) {
                if (data.includes("Success") == true) {
                    try {
                        localStorage.setItem("ls_agendaplaca", chasis);
                        localStorage.setItem("ls_nuevacita", "ot");
                        vaciaVIN();

                        window.myalert("<center><i class=\"fa fa-check-circle-o\"></i> REGISTRADO</center>", "<center>El VIN: <b>" + chasis + "</b><br/>fue registrado correctamente");

                        // abrirPagina("lector_barras");
                        return;
                    } catch (s) {
                        kendo.ui.progress($("#vinScreen"), false);
                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>7 ERROR</center>", "Error en el servicio de Registro VIN<br />" + s);
                        return;
                    }
                }
                else {
                    kendo.ui.progress($("#vinScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>8 ERROR</center>", "No fue ingresado el registro. <br />" + data);
                    return;
                }
            },
            error: function (err) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "1Error durante el proceso.<br /> Int\u00E9ntelo nuevamente.<br />" + inspeccionar(err));
                return;
            }
        });



            kendo.ui.progress($("#vinScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);


    } catch (e) {
        kendo.ui.progress($("#vinScreen"), false);
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "2Error durante el proceso.<br /> Int\u00E9ntelo nuevamente.<br />" + inspeccionar(e));
        return;
    }
}


/*--------------------------------------------------------------------
Fecha: 08/12/2017
Detalle: Busqueda por VIN
Parametros: VIN
--------------------------------------------------------------------*/
function ConsultarVIN(strVIN) {
    try {
        
        document.getElementById("nuevoVin").innerHTML = "";

        document.getElementById("gridVIN2").style.display = 'none';
        document.getElementById("divInfoVIN").style.display = 'none';

        for (var i = 0; i < arrCbo01.length; i++) {
            document.getElementById(arrCbo01[i]).disabled = false;
            document.getElementById(arrCbo01[i]).setAttribute("class", "w3-input w3-border textos");
        }


        for (var i = 0; i < arrTxt01.length; i++) {
            document.getElementById(arrTxt01[i]).readOnly = false;
            document.getElementById(arrTxt01[i]).setAttribute("class", "w3-input w3-border textos");
        }

        // http://186.71.21.170:8077/taller/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;12345678901234567;;

        //var Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";;";

        var Url = "";

        if (strVIN.trim() == "") {
          //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el VIN correctamente");
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>El VIN debe contener 17 caracteres entre n&#250;meros y letras<br/>O anteponer <b>*</b> (asterisco)  y los 6 &#250;ltimos d&#237;gitos</center>");

            return;
        }
        else {
            var resultValida = /[`~!@#$%^&()_��|+\-=?;:'",.<>\{\}\[\]\\\/]/gi.test(strVIN);

            if (resultValida == true) {
              //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "Ingrese el VIN correctamente");
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>El VIN debe contener 17 caracteres entre n&#250;meros y letras<br/>O anteponer <b>*</b> (asterisco)  y los 6 &#250;ltimos d&#237;gitos</center>");

                    return;
            }
            if (strVIN.includes('*') == true) {
                listaVin2(strVIN);
                return;
            }
            else {
                if (strVIN.length == 17) {
                    if (document.getElementById("rbMiMarca").checked == true) {
                        Url = localStorage.getItem("ls_url1").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN;
                        // Recurrente
                        if (localStorage.getItem("lc_recnuevovin") != undefined) {
                            Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN;
                        }
                    }
                    else {
                        Url = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN ;
                    }
                }
                else {
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>El VIN debe contener 17 caracteres<br/>entre n&#250;meros y letras</center>");
                    return;
                }
            }
        }
        // Url = "http://localhost:4044/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";;";
        document.getElementById("chasisRV").value = strVIN;

     //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> consultaVIN</center>", Url);

        kendo.ui.progress($("#vinScreen"), true);
        setTimeout(function () {
            // precarga *********************************************************************************************
          //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> consultaVIN</center>", Url);
          
            var infor;
            $.ajax({
                url: Url,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        infor = (JSON.parse(data.vh01VehiculosGetResult)).tvh01[0];
                    }
                    catch (e) {
                        vaciaVIN();
                        document.getElementById("chasisRV").value = strVIN;
                        return;
                    }
                },
                error: function (err) {

                    if (localStorage.getItem("lc_recnuevovin") != undefined) {
                        localStorage.removeItem("lc_recnuevovin");
                    }
                    vaciaVIN();
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "3Error durante el proceso.<br />" + err);
                    return;
                }
            });
            if (inspeccionar(infor).length > 0) {
                document.getElementById("chasisRV").value = strVIN;
                cboMarcas(infor.codigo_marca);
                cboModelos(document.getElementById("codigo_marca").value, infor.codigo_modelo);
                cboColores(infor.color_vehiculo);
                cboTipoAutos(infor.tipo_auto);
                document.getElementById("anio_modelo").value = infor.anio_modelo;
                document.getElementById("version_motor").value = infor.version_motor;
                document.getElementById("tipo_transmision").value = infor.tipo_transmision;
                document.getElementById("cilindraje").value = infor.cilindraje;
                document.getElementById("codigo_traccion").value = infor.codigo_traccion;
                if (infor.codigo_marca == localStorage.getItem("ls_idmarca").toLocaleString()) {
                    document.getElementById("chasisRV").readOnly = true;
                    document.getElementById("anio_modelo").readOnly = true;
                    document.getElementById("version_motor").readOnly = true;
                    document.getElementById("tipo_transmision").readOnly = true;
                    document.getElementById("cilindraje").readOnly = true;
                    document.getElementById("codigo_traccion").readOnly = true;

                    var arrCbo01 = ["codigo_marca", "codigo_modelo", "color_vehiculo", "tipo_auto"];
                    var arrTxt01 = ["chasis", "anio_modelo", "version_motor", "tipo_transmision", "cilindraje", "codigo_traccion"];

                    var arrVal01 = [infor.codigo_marca, infor.codigo_modelo, infor.color_vehiculo, infor.tipo_auto];
                    for (var i = 0; i < arrCbo01.length; i++) {
                        if (arrVal01[i].trim() == "") {
                            document.getElementById(arrCbo01[i]).disabled = false;
                            document.getElementById(arrCbo01[i]).setAttribute("class", "w3-input w3-border textos");
                        }
                        else {
                            document.getElementById(arrCbo01[i]).disabled = true;
                            document.getElementById(arrCbo01[i]).setAttribute("class", "w3-input textos");
                        }
                    }
                    try {
                    for (var i = 0; i < arrTxt01.length; i++) {
                        if (document.getElementById(arrTxt01[i]).value.trim() == "") {
                            document.getElementById(arrTxt01[i]).readOnly = false;
                            document.getElementById(arrTxt01[i]).setAttribute("class", "w3-input w3-border textos");
                        }
                        else {
                            document.getElementById(arrTxt01[i]).readOnly = true;
                            document.getElementById(arrTxt01[i]).setAttribute("class", "w3-input textos");
                        }
                    }
                } catch (error) {}
                }
                if (infor.tipo_producto.trim() == "") {
                    document.getElementById("tipo_producto").value = "VEHICULOS";
                }
                else {
                    document.getElementById("tipo_producto").value = infor.tipo_producto;
                }
                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {

                    document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
                "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
                }
                else {
                    document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
                "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i></button>";
                }
                document.getElementById("divInfoVIN").style.display = 'initial';

                if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                    document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
                        "<button id='btnRegresarVin1' onclick='registrarVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-floppy-o' aria-hidden='true'></i> GENERAR VIN</button>" +
                "<button id='btnRegresarVin2' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin2' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
                }
                else {
                    document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
                        "<button id='btnRegresarVin1' onclick='registrarVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-floppy-o' aria-hidden='true'></i></button>" +
                "<button id='btnRegresarVin2' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin2' class='fa fa-file' aria-hidden='true'></i></button>";
                }
                llamarNuevoestilo("btnRegresarVin");
                llamarNuevoestiloIconB("icnRegresarVin");
            
                if (localStorage.getItem("lc_recnuevovin") != undefined) {
                    localStorage.removeItem("lc_recnuevovin");
                }


            }
            else {
                if (document.getElementById("rbMiMarca").checked == true) {

                    if (localStorage.getItem("lc_recnuevovin") != undefined) {
                        vaciaVIN_2();
                        kendo.ui.progress($("#vinScreen"), false);

                        localStorage.removeItem("lc_recnuevovin");
                        document.getElementById("chasisRV").value = strVIN;

                        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se han encontrado registros<br/>del VIN <b>" + strVIN + "</b></center>");
                        return;
                    }
                    else {alert("8");
                        localStorage.setItem("lc_recnuevovin", "1");
                        ConsultarVIN(strVIN);
                        return;
                    }
                }
                else {
                    if (localStorage.getItem("lc_recnuevovin") != undefined) {
                        localStorage.removeItem("lc_recnuevovin");
                    }

                    vaciaVIN_2();
                    kendo.ui.progress($("#vinScreen"), false);
                    document.getElementById("chasisRV").value = strVIN;
                    alert("010");
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se han encontrado registros<br/>del VIN <b>" + strVIN + "</b></center>");
                    return;
                }
               
                //................................

                //vaciaVIN_2();
                //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "<center>No se han encontrado registros<br/>del VIN <b>" + strVIN + "</b></center>");
            }
            kendo.ui.progress($("#vinScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);
    }
    catch (e2) {

        vaciaVIN();
        window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "4Error durante el proceso.<br />" + e2);
        kendo.ui.progress($("#vinScreen"), true);
        return;
    }
}

/*--------------------------------------------------------------------
Fecha: 19/04/2018
Detalle: Busqueda aproximada de VIN 
Recursiva si no encuentra en Mayorista va al concesionario
Parametros: VIN con " * "
--------------------------------------------------------------------*/
function listaVin2(strVIN) {
    kendo.ui.progress($("#vinScreen"), true);
    setTimeout(function () {
        // precarga *********************************************************************************************

        try {
            // Grid VIN
            var grid2 = $("#gridVIN2").data("kendoGrid");
            grid2.destroy();
        }
        catch (evin)
        { }

        document.getElementById("gridVIN2").innerHTML = "";

        document.getElementById("gridVIN2").style.display = 'none';
        document.getElementById("divInfoVIN").style.display = 'none';

        strVIN = strVIN.replace('*', ' ').trim();

        if (strVIN.length < 6) {
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>9 ERROR1</center>", "Ingrese m&iacute;nimo 6 caracteres");
            kendo.ui.progress($("#vinScreen"), false);
            return;
        }

        var UrlVIN = localStorage.getItem("ls_url1").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN;

        // Recurrente
        if (localStorage.getItem("lc_recnuevovin") != undefined) {
            UrlVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN;
        }

       //    window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>LISta</font></center>", UrlVIN);


      //  UrlVIN = "http://localhost:4044/Services/vh/Vehiculos.svc/vh01VehiculosGet/1,JSON;;;;;" + strVIN + ";;";

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
                    vaciaVIN_2();
                    kendo.ui.progress($("#vinScreen"), false);
                  //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                    return;
                }
            },
            error: function (err) {

                if (localStorage.getItem("lc_recnuevovin") != undefined) {
                    localStorage.removeItem("lc_recnuevovin");
                }

                kendo.ui.progress($("#vinScreen"), false);
                /* alert("1111"+err);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>10 ERROR2</center>", inspeccionar(err)); */
                return;
            }
        });
        if (infVINResp.length > 0) {
            $("#gridVIN2").kendoGrid({
                dataSource: {
                    data: infVINResp,
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

                        hidden: document.getElementById("rbOtros").checked,

                        command: [{
                            name: "obs",
                            text: " ",
                            imageClass: "fa fa-search-plus",

                              visible: function (dataItem) { return document.getElementById("rbMiMarca").checked; },

                            click: function (e) {
                                try {
                                    e.preventDefault();
                                    var tr = $(e.target).closest('tr');
                                    var dataItem = this.dataItem(tr);
                                    //   window.myalert("<center><i class=\"fa fa-ambulance\"></i> <font style='font-size: 14px'>CHASIS</font></center>", dataItem.chasis);

                                    kendo.ui.progress($("#vinScreen"), true);
                                    setTimeout(function () {
                                        // precarga ***********************
                                        ConsultarVIN(dataItem.chasis);
                                        // precarga ***********************
                                    }, 2000);

                                } catch (f) {

                                    if (localStorage.getItem("lc_recnuevovin") != undefined) {
                                        localStorage.removeItem("lc_recnuevovin");
                                    }


                                    kendo.ui.progress($("#vinScreen"), false);
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
            document.getElementById("gridVIN2").style.display = "initial";
            kendo.ui.progress($("#vinScreen"), false);

            if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i> REGRESAR</button>" +
            "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i> NUEVO</button>";
            }
            else {
                document.getElementById("btnGuardaInfoVin").innerHTML = "<button id='btnRegresarVin0' onclick='abrirPagina(\"home\")' class='w3-btn'><i id='icnRegresarVin0' class='fa fa-chevron-left' aria-hidden='true'></i></button>" +
            "<button id='btnRegresarVin1' onclick='vaciaVIN();' class='w3-btn'><i id='icnRegresarVin1' class='fa fa-file' aria-hidden='true'></i></button>";
            }
            llamarNuevoestiloIconB("icnRegresarVin");
            llamarNuevoestilo("btnRegresarVin");
            if (localStorage.getItem("lc_recnuevovin") != undefined) {
                localStorage.removeItem("lc_recnuevovin");
            }


            //if (document.getElementById("rbMiMarca").checked == false) {
            //    document.getElementById("nuevoVin").innerHTML = "<button onclick='vaciaVIN_2();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i> CREAR VIN</button>";
            //}
            //else {
            //    document.getElementById("nuevoVin").innerHTML = "";
            //}

            document.getElementById("nuevoVin").innerHTML = "<button onclick='vaciaVIN_2();' class='w3-btn w3-red'><i class='fa fa-file' aria-hidden='true'></i> CREAR VIN</button>";

        }
        else {
            if (document.getElementById("rbMiMarca").checked == true) {
                if (localStorage.getItem("lc_recnuevovin") != undefined) {
                    vaciaVIN_2();
                    kendo.ui.progress($("#vinScreen"), false);
                    localStorage.removeItem("lc_recnuevovin");
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                    return;
                }
                else {
                    localStorage.setItem("lc_recnuevovin", "1");
                    listaVin2(strVIN);
                    return;
                }
            }
            else {
                if (localStorage.getItem("lc_recnuevovin") != undefined) {
                    localStorage.removeItem("lc_recnuevovin");
                }

                vaciaVIN_2();
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");

                

                return;
            }
        }
        kendo.ui.progress($("#vinScreen"), false);
        // precarga *********************************************************************************************
    }, 2000);

}



function limitText(limitField, limitNum) {
    if (limitField.value.length > limitNum) {
        limitField.value = limitField.value.substring(0, limitNum);
    }
}


/*--------------------------------------------------------------------
Fecha: 20/11/2017
Descripcion: Carga combo Marca (VIN)
Parametros: 
            - Empresa
            - Marca enviado y caso contrario sera el 1er item por def.
--------------------------------------------------------------------*/
function cboMarcas(selMarca) {

    var cboMarcaHTML = "<p><select id='codigo_marca' onchange='cboModelos(this.value)' class='w3-input w3-border textos'>";
    cboMarcaHTML += "<option  value=' '>Ninguno</option>";
    cboMarcaHTML += "</select></p>";

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;IN;MARCAS;
    var UrlCboMarcas = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2," + localStorage.getItem("ls_idempresa").toLocaleString() + ";IN;MARCAS;";

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboMarcas);

    var cboResp = "";

    $.ajax({
        url: UrlCboMarcas,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>11 ERROR</center>", "No existe conexi&oacute;n con el servicio Marca");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ERROR</center>", err);
            return;
        }
    });


    if (cboResp.length > 0) {
        cboMarcaHTML = "<div class='select-style2'><p><select id='codigo_marca' onchange='cboModelos(this.value, 0)' class='w3-input w3-border textos'>";

        for (var i = 0; i < cboResp.length; i++) {

            if (cboResp[i].CodigoClase != " " || cboResp[i].CodigoClase != "ninguna") {
                if (selMarca == cboResp[i].CodigoClase) {
                    cboMarcaHTML += "<option  value='" + cboResp[i].CodigoClase + "' selected>" + cboResp[i].NombreClase + "</option>";
                }
                else {
                    cboMarcaHTML += "<option  value='" + cboResp[i].CodigoClase + "'>" + cboResp[i].NombreClase + "</option>";
                }
            }
        }

        cboMarcaHTML += "</select></p></div>";
    }
    else {
        cboMarcaHTML = "<p><select id='codigo_marca' class='w3-input w3-border textos'>";
        cboMarcaHTML += "<option  value=' '>Ninguno</option>";
        cboMarcaHTML += "</select><p>";
    }
    document.getElementById("divcboMarca").innerHTML = cboMarcaHTML;
}


/*--------------------------------------------------------------------
Fecha: 20/11/2017
Descripcion: Carga combo Modelos (VIN)
Parametros:
            - Empresa
            - Marca  
            - Modelo enviado y caso contrario sera el 1er item por def.
--------------------------------------------------------------------*/
function cboModelos(itmMarca, selModelo) {

    var cboModeloHTML = "<p><select id='codigo_modelo' class='w3-input w3-border textos'>";
    cboModeloHTML += "<option  value=' '>Ninguno</option>";
    cboModeloHTML += "</select></p>";

    //  http://186.71.21.170:8077/taller/Services/in/Inventarios.svc/in11ModelosGet/1,1;KIA
    var UrlCboModelos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/in/Inventarios.svc/in11ModelosGet/1," + localStorage.getItem("ls_idempresa").toLocaleString() + ";" + itmMarca;

    //   window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboModelos);

    var cboResp = "";

    $.ajax({
        url: UrlCboModelos,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboResp = JSON.parse(data.in11ModelosGetResult);
            } catch (e) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>2 ERROR</center>", "No existe conexi&oacute;n con el servicio Modelo");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>3 ERROR2</center>", err);
            return;
        }
    });


    if (cboResp.length > 0) {
        cboModeloHTML = "<div class='select-style2'><p><select id='codigo_modelo' class='w3-input w3-border textos'>" +
        "<option  value=' '>Ninguno</option>";
        for (var i = 0; i < cboResp.length; i++) {

            if (cboResp[i].CodigoClase != " " || cboResp[i].CodigoClase != "ninguna") {
                if (selModelo == cboResp[i].CodigoClase) {
                    cboModeloHTML += "<option  value='" + cboResp[i].CodigoClase + "' selected>" + cboResp[i].NombreClase + "</option>";
                }
                else {
                    cboModeloHTML += "<option  value='" + cboResp[i].CodigoClase + "'>" + cboResp[i].NombreClase + "</option>";
                }
            }
        }

        cboModeloHTML += "</select></p></div>";
    }
    else {
        cboModeloHTML = "<p><select id='codigo_modelo' class='w3-input w3-border textos'>";
        cboModeloHTML += "<option  value=' '>Ninguno</option>";
        cboModeloHTML += "</select><p>";
    }
    document.getElementById("divcboModelo").innerHTML = cboModeloHTML;
}


/*--------------------------------------------------------------------
Fecha: 20/11/2017
Descripcion: Carga combo Colores (VIN)
Parametros:
            - Empresa
            - Color enviado y caso contrario sera el 1er item por def.
--------------------------------------------------------------------*/
function cboColores(selColor) {

    var cboColorHTML = "<p><select id='color_vehiculo' class='w3-input w3-border textos'>";
    cboColorHTML += "<option  value=' '>Ninguno</option>";
    cboColorHTML += "</select></p>";

    // http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ComboParametroEmpGet/2,1;VH;COLOR_VEHICULO;
    var UrlCboColores = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ComboParametroEmpGet/2," + localStorage.getItem("ls_idempresa").toLocaleString() + ";VH;COLOR_VEHICULO;";

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboColores);

    var cboResp = "";

    $.ajax({
        url: UrlCboColores,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboResp = JSON.parse(data.ComboParametroEmpGetResult);
            } catch (e) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "No existe conexi&oacute;n con el servicio Color");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>4 ERROR3</center>", err);
            return;
        }
    });


    if (cboResp.length > 0) {
        cboColorHTML = "<div class='select-style2'><p><select id='color_vehiculo' class='w3-input w3-border textos'>";

        for (var i = 0; i < cboResp.length; i++) {

            if (cboResp[i].CodigoClase != " " || cboResp[i].CodigoClase != "ninguna") {
                if (selColor == cboResp[i].CodigoClase) {
                    cboColorHTML += "<option  value='" + cboResp[i].CodigoClase + "' selected>" + cboResp[i].NombreClase + "</option>";
                }
                else {
                    cboColorHTML += "<option  value='" + cboResp[i].CodigoClase + "'>" + cboResp[i].NombreClase + "</option>";
                }
            }
        }

        cboColorHTML += "</select></p></div>";
    }
    else {
        cboColorHTML = "<p><select id='color_vehiculo' class='w3-input w3-border textos'>";
        cboColorHTML += "<option  value=' '>Ninguno</option>";
        cboColorHTML += "</select><p>";
    }
    document.getElementById("divcboColor").innerHTML = cboColorHTML;
}


function cboTipoAutos(selTipoAuto) {

    var cboTipoAutoHTML = "<p><select id='tipo_auto' class='w3-input w3-border textos'>";
    cboTipoAutoHTML += "<option  value=' '>Ninguno</option>";
    cboTipoAutoHTML += "</select></p>";

    //  http://186.71.21.170:8077/taller/Services/TG/Parametros.svc/ParametroGralGet/1,106
    var UrlCboTipoAutos = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TG/Parametros.svc/ParametroGralGet/1,106";

    //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlCboTipoAutos);

    var cboResp = "";

    $.ajax({
        url: UrlCboTipoAutos,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            try {
                cboResp = JSON.parse(data.ParametroGralGetResult);
            } catch (e) {
                kendo.ui.progress($("#vinScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>5 ERROR</center>", "No existe conexi&oacute;n con el servicio TipoAuto");
                return;
            }
        },
        error: function (err) {
            kendo.ui.progress($("#vinScreen"), false);
            window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>6 ERROR</center>", err);
            return;
        }
    });


    if (cboResp.length > 0) {
        cboTipoAutoHTML = "<div class='select-style2'><p><select id='tipo_auto' class='w3-input w3-border textos'>";

        for (var i = 0; i < cboResp.length; i++) {

            if (cboResp[i].CodigoClase != " " || cboResp[i].CodigoClase != "ninguna") {
                if (selTipoAuto == cboResp[i].CodigoClase) {
                    cboTipoAutoHTML += "<option  value='" + cboResp[i].CodigoClase + "' selected>" + cboResp[i].NombreClase + "</option>";
                }
                else {
                    cboTipoAutoHTML += "<option  value='" + cboResp[i].CodigoClase + "'>" + cboResp[i].NombreClase + "</option>";
                }
            }
        }

        cboTipoAutoHTML += "</select></p></div>";
    }
    else {
        cboTipoAutoHTML = "<p><select id='tipo_auto' class='w3-input w3-border textos'>";
        cboTipoAutoHTML += "<option  value=' '>Ninguno</option>";
        cboTipoAutoHTML += "</select><p>";
    }
    document.getElementById("divcboTipoAuto").innerHTML = cboTipoAutoHTML;
}


// END_CUSTOM_CODE_vin