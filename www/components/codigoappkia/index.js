app.codigoappkia = kendo.observable({
    onShow: function () {
        llamarNuevoestiloIconB("icnOT");
        llamarNuevoestilo("btnBusquedas");
        $("#mailceduVIN").val("");
        document.getElementById("mailceduVIN").innerHTML = "";
    },
    afterShow: function () { }
});
app.localization.registerView('codigoappkia');
function scan() {
    var that = this;
        try {
           
            if (window.navigator.simulator === true) {
                // loading
                document.getElementById("divLoading").innerHTML = "";
                // Borrar imagen de placa
                document.getElementById("smallImage").style.display = "none";

                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", "Aplicaci\u00F3n no compatible.");
            } else {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {
                       
                        if (!result.cancelled) {
                           
                            $("#mailceduVIN").val(result.text);
                            document.getElementById("mailceduVIN").innerHTML = result.text;
                            buscarPlacaVIN(result.text);
                        }
                    },
                    function (error) {
                        // ERROR: SCAN  is already in progress
                        //  window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se realiz\u00F3 el escaneo. Intentelo nuevamente.");

                    });
            }
        } catch (e) {
            
        }
}

function buscarPlacaVIN(consulta) {
    kendo.ui.progress($("#codigoappkiaScreen"), true);
    setTimeout(function () {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(consulta.trim().toLowerCase())){
            var urlCodigo = wsPrincipal + "/Services/SL/Sherloc/Sherloc.svc/CodigoTemporalGet/11,json;;"+consulta.trim().toLowerCase()+";";
        }else{
            if (consulta.trim().length == 10) {
                var urlCodigo = wsPrincipal + "/Services/SL/Sherloc/Sherloc.svc/CodigoTemporalGet/11,json;;;" + consulta.trim();
            }else{var urlCodigo = wsPrincipal + "/Services/SL/Sherloc/Sherloc.svc/CodigoTemporalGet/11,json;"+ consulta.trim()+";;";}
        }
        var infor;
        var bandera = false; 
        $.ajax({
            url: urlCodigo,
            type: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                try {
                    if (data.CodigoTemporalGetResult==null) {
                        alert("No existe datos");
                        kendo.ui.progress($("#codigoappkiaScreen"), false);
                        return;
                    } else {
                        infor = (JSON.parse(data.CodigoTemporalGetResult)).Cliente;
                        bandera = true;
                    } 
                    
                } catch (e) {
                    alert("no sale"+inspeccionar(e));
                    kendo.ui.progress($("#codigoappkiaScreen"), false);
                    return;
                }
            },
            error: function (err) {
                
                //alert("errormmm"+err)
                kendo.ui.progress($("#codigoappkiaScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", err);
                return;
            }
        });
        if (bandera) {
            try {
            numeroFilasOT = 27;
            $("#gridListaCodigos123").kendoGrid({
                dataSource: {
                    pageSize: numeroFilasOT,
                    data: infor
                },
                pageable: {
                    input: true,
                    numeric: false
                }, 
                scrollable: true,
                groupable: false,
                columns: [{field: "codigo_temporal", title: "Código temporal" },
                        { field: "mail", title: "Mail"},
                        { field: "telefono_celular", title: "Celular" },
                        { field: "identificacion_cliente", title: "Cédula" },
                        { field: "persona_nombre", title: "Nombres" },
                        { field: "persona_apellido", title: "Apellidos" },
                        { field: "chasis", title: "Vin" },
                    ]
            });
        } catch (error) {
            kendo.ui.progress($("#codigoappkiaScreen"), false);
            alert(error); 
        }
        }
        kendo.ui.progress($("#codigoappkiaScreen"), false);
    }, 2000);
}