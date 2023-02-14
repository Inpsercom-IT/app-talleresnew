app.ordenesRel = kendo.observable({
    onShow: function () {
        $("#numOTREL").text("Num. Orden Relacionada: " + JSON.parse(localStorage.getItem("dataItemCC")).numero_orden);
        try {
            localStorage.removeItem("numOTRELS");
        } catch (error) {
            
        }
        document.getElementById("btnFooterOTREL").innerHTML = "<button id='btnContinuarREL0' onclick='continuarREL();' class='w3-btn'><i id='icnContinuarREL0' class='fa fa-pencil' aria-hidden='true'></i> CONTINUAR</button>";
        llamarNuevoestiloIconB("icnContinuarREL");
        llamarNuevoestilo("btnContinuarREL");
        admConsultarOTREL();
    },
    afterShow: function () { }
});
app.localization.registerView('ordenesRel');

function continuarREL(){
    kendo.ui.progress($("#ordenesRelScreen"), true);
        setTimeout(function () {
   var nmmotPRU = localStorage.getItem("numOTRELS");
   try {
       
    if (document.getElementById("si").checked) {
        document.getElementById("gridListaOrdenesREL").innerHTML = "";
        kendo.mobile.application.navigate("components/reporteControlCalidad/view.html"); 
       } else {
        alert("Aun no ha seleccionado");
       }
   } catch (error) {
       alert(error);
   }
   
  /*  if (nmmotPRU == "" || nmmotPRU == null) {
       alert("Aun no ha seleccionado");
   } else {
    document.getElementById("gridListaOrdenesREL").innerHTML = "";
    
    kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");  
   } */
   kendo.ui.progress($("#ordenesRelScreen"), false);
   // precarga *********************************************************************************************
}, 2000);
}

function volverOTREL(){
     banderaCC = 1;
    kendo.mobile.application.navigate("components/controlCalidad/view.html");
}

function admConsultarOTREL() {
    try {
        var dataREL = JSON.parse(localStorage.getItem("dataItemCC"));
        document.getElementById("gridListaOrdenesREL").innerHTML = "";
            
        try {
            // Grid VIN
            var grid01_1 = $("#gridListaOrdenesREL").data("kendoGrid");
            grid01_1.destroy();
        }
        catch (emo1)
        { }
        var strProp = ""; //document.getElementById('otPropCA').value;
        var strPLACA = ""; //document.getElementById('otPlacaCA').value;
        //var strOT = document.getElementById('otNumCA').value;
        var otEstado2 = "ABIERTO"; //document.getElementById('otEstado2CA').value;
        var datFecIni = ""; //document.getElementById('dpInicioOTCA').value;
        var datFecFin = ""; //document.getElementById('dpFinOTCA').value;
        var strOT = dataREL.numero_orden;
        var numProf = "";
        
        if (numProf.trim() == "") {
            numProf = "0";
        }
        
        kendo.ui.progress($("#ordenesRelScreen"), true);
        setTimeout(function () {
            //  precarga *********************************************************************************************
            var verColEstado = true;
            var UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/15,json;" +
            localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
            localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
            localStorage.getItem("ls_usagencia").toLocaleString() +
            ";;;;;" + strProp + ";;" +
            datFecIni + ";" + datFecFin + ";;" + otEstado2 + "" +
            ";" + numProf + ";CONTROL CALIDAD";
    
            if (strOT.trim() != "") {
    
                if (strOT.trim().length > 7) {
                    UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/17,json;" +
                    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                    localStorage.getItem("ls_usagencia").toLocaleString() +
                    ";;" + dataREL.chasis + ";;;;" + strOT + ";;;;;;;;";
                }
                else {
                    UrlOrdenes = localStorage.getItem("ls_url2").toLocaleString() + "/Services/TL/Taller.svc/tl06OrdenesGet/15json;" +
                    localStorage.getItem("ls_idempresa").toLocaleString() + ";" +
                    localStorage.getItem("ls_ussucursal").toLocaleString() + ";" +
                    localStorage.getItem("ls_usagencia").toLocaleString() +
                    ";" + strOT + ";;;;" + strProp + ";;;;;" + otEstado2 + "" +
                    ";" + numProf  + ";CONTROL CALIDAD";
                }
    
                verColEstado = false;
            }
            var imgBotOt = "fa fa-unlock-alt fa-lg";
            var modoEnviaOT = "9";
            var colOculta = true;
            var titGEv01 = "Liquidar";
    
            if (otEstado2 == "CERRADO") {
                imgBotOt = "fa fa-unlock fa-lg";
                modoEnviaOT = "10";
                colOculta = false;
                titGEv01 = "Reliquidar";
            }
    //alert(UrlOrdenes);
            var infOrdenes;
            $.ajax({
                url: UrlOrdenes,
                type: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    try {
                        //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(data)); 
                        infOrdenes = (JSON.parse(data.tl06OrdenesGetResult)).ttl06;
                    } catch (e) {
                        kendo.ui.progress($("#controlCalidadScreen"), false);
                        // window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", "No existe el detalle de la Orden de Trabajo");
                        return;
                    }
                },
                error: function (err) {
                    kendo.ui.progress($("#controlCalidadScreen"), false);
                    window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ALERTA</center>", err);
                    return;
                }
            });
            //window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i> ALERTA</center>", inspeccionar(infOrdenes[0]));
            if (inspeccionar(infOrdenes).length > 0) {
                var numeroFilasOT = 5;
                //if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                //}
                var col1 = ((parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 2) / 100) - 10 +"px";
               
                var col2 = (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) * 2) / 100;
                //  if (parseInt(localStorage.getItem("ls_dimensionW").toLocaleString()) > 361) {
                if (otEstado2 == "ABIERTO") {
                    numeroFilasOT = 27;
                    var gridREL = $("#gridListaOrdenesREL").kendoGrid({
                        dataSource: {
                            pageSize: numeroFilasOT,
                            data: infOrdenes
                        },
                        
                        pageable: {
                            input: true,
                            numeric: false
                        },
                        //    height: 'auto',
                       /*  schema: {model: {
                                id: "numero_orden"
                            }
                        }, */
                        /* scrollable: true, */
                        /* groupable: false, */
                        columns: [ { template: "# if (relacionadas_control_calidad !== '' ) { # <center><input id='si' class='checkbox' name='ckbAE' type='checkbox' checked/></center> # }else { # <center><input id='si' class='checkbox' name='ckbAE' type='checkbox'/> </center> #}#", width: "2PX", title: "Sel" },
                        
                        // VIP BANDERA
                                {field: "numero_orden",filterable:false, title: "Numero de OT", width: "3px",
                                    template: "#= clienteVIP(numero_orden, persona_clase) #",
                                    fontsize: "12px"
                                },        
                                { field: "fecha_recepcion", title: "Fecha Recepción", width:"3px" },
                                { field: "kilometraje", title: "Kilometraje", width: "3px" },
                                { field: "tipo_trabajo", title: "Tipo Trabajo", width: "2px" },
                                { field: "seccion_orden_trabajo", title: "Secc. Ord. Trabajo", width: "3px" },                       
                                { field: "nombre_propietario",filterable:false,title: "Propietario",
                                /* groupHeaderTemplate: "Propietario: #=  kendo.toString(value) #", */
                                width: "6px"
                            },    
                        ]
                    }).data("kendoGrid");
                    
                    //bind click event to the checkbox
                    gridREL.table.on("click", ".checkbox" , selectRow);
                    llamarColorBotonGeneral(".k-state-selected");
                    /* $("#showSelection").bind("click", function () {
                        var checked = [];
                        for(var i in checkedIds){
                            if(checkedIds[i]){
                                checked.push(i);
                            }
                        }

                        alert(checked);
                    });
 */
                }
                else {
                    
                    
                }
    
                document.getElementById("tablaOTDetalleCA").style.display = "block";
            }
            else {
    
                document.getElementById("tablaOTDetalleCA").style.display = "none";  
                kendo.ui.progress($("#ordenesRelScreen"), false);
                window.myalert("<center><i class=\"fa fa-exclamation-triangle\"></i>1 ALERTA</center>", "<center> No existen OT Relacionadas con esta orden : <b>" + strOT + "</b></center>");
                if (banderaCC == 2) {
                    volverOTREL(); 
                }else{kendo.mobile.application.navigate("components/reporteControlCalidad/view.html");}
            }
    
            kendo.ui.progress($("#ordenesRelScreen"), false);
            // precarga *********************************************************************************************
        }, 2000);
    } catch (error) {
        alert("11"+error);
    }
    }
    var checkedIds = {};

    //on click of the checkbox:
    function selectRow() { 
        dataItem = ""; 
        localStorage.removeItem("numOTRELS");
        var checked = this.checked,
        row = $(this).closest("tr"),
        gridREL = $("#gridListaOrdenesREL").data("kendoGrid"),
        dataItem = gridREL.dataItem(row);
        checkedIds[dataItem.numero_orden] = checked;
        if (checked) {
            //-select the row
            row.addClass("k-state-selected");
            } else {
            //-remove selection
            row.removeClass("k-state-selected");
        }
        var checked1 = [];
        for(var i in checkedIds){
            if(checkedIds[i]){
                checked1.push(i);
            }
        }
        localStorage.setItem("numOTRELS", checked1);
    }

    //on dataBound event restore previous selected rows:
    function onDataBound(e) {
        var view = this.dataSource.view();
        for(var i = 0; i < view.length;i++){
            if(checkedIds[view[i].id]){
                this.tbody.find("tr[data-uid='" + view[i].uid + "']")
                .addClass("k-state-selected")
                .find(".checkbox")
                .attr("checked","checked");
            }
        }
    }