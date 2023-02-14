var registroavaluo;
app.certifica = kendo.observable({
    onShow: function () {
        try {
            localStorage.setItem("bandera","1");
            kendo.ui.progress($("#certificaScreen"), false)
            registroavaluo = "";
            llamarCERT();
        } catch (e) {
            alert("1"+e);
        }
    },
    afterShow: function () { }
});
app.localization.registerView('certifica');

function llamarCERT() {
    try {
        kendo.ui.progress($("#certificaScreen"), true);
        setTimeout(function () {
            consultaCert();
        }, 2000);
    } catch (e) {
        alert("llama" + e);
    }

}

function consultaCert() {
    var infVINResp = "";
    try {
        //http://192.168.1.50:8089/concesionario/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;1;01;01;;;;;;;;AVALUADO
        var UrlVIN = localStorage.getItem("ls_url2").toLocaleString() + "/Services/VH/Vehiculos.svc/vh62VinUsadoGet/4,json;1;01;01;;;;;;;;AVALUADO";
        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", UrlVIN);
        
        $.ajax({
            url: UrlVIN,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                try {
                    //alert(inspeccionar(data))
                    infVINResp = (JSON.parse(data.vh62VinUsadoGetResult)).tvh62;
                  //  alert(inspeccionar(infVINResp[0]));

                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infVINResp[0]));


                } catch (e) {
                    //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ERROR</center>", e);
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
            var obs = (screen.width * 15) / 100;
            var fecha = (screen.width * 40) / 100;
            $("#gridCertifica").kendoGrid({
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
                        command: [
                            {name: "codigo_empresa",
                            text: " ",
                            imageClass: "fa fa-search-plus",
                            visible: function (dataItem) { return dataItem.chasis != "0," },
                            click: function (e) {
                                try {
                                    e.preventDefault();
                                    var tr = $(e.target).closest('tr');
                                    var dataItem = this.dataItem(tr);
                                    //alert(inspeccionar(dataItem));
                                    kendo.ui.progress($("#certificaScreen"), true);
                                    setTimeout(function () {
                                    registroavaluo = dataItem;
                                        kendo.mobile.application.navigate("components/avaluo/view.html");
                                       // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", dataItem.observacion);
                                    }, 2000);
                                    
                                } catch (f) {
                                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No se han encontrado registros");
                                    return;
                                    //alert(f);
                                }
                            }
                        }],
                    },
                    { field: "fecha_registro", title: "Fecha Reg", width: obs },
                    { field: "placa", title: "Placa", width: obs },
                    { field: "chasis", title: "VIN", width: obs },
                    { field: "nombre_propietario", title: "Propietario", width: fecha },
                    { field: "descripcion_modelo", title: "Descripcion Modelo", width: fecha }
                    
                ]
            });
            document.getElementById("gridCertifica").style.display = "block";
        }
        kendo.ui.progress($("#certificaScreen"), false);
    } catch (e) {
        alert("lista" + e);
    }
    kendo.ui.progress($("#certificaScreen"), false);
}