const extend = require("extend");

class Capa {
    constructor(proveedor, codigo, nombre, origen, tipo, opciones, grupos, icono) {
        this.proveedor = proveedor;
        this.codigo = codigo;
        this.nombre = nombre;
        this.origen = origen;
        this.opciones = opciones;
        this.tipo = tipo;
        this.grupos = grupos;
        this.icono = icono;        
    }
    getInfo() {
        return {
            proveedor:this.proveedor,
            codigo:this.codigo,
            nombre:this.nombre,
            origen:this.origen,
            grupos:this.grupos,
            tipo:this.tipo,
            icono:this.icono,
            decimales:this.opciones.decimales
        }
    }
}

class CapaRaster extends Capa {
    constructor(proveedor, codigo, nombre, origen, opciones, grupos, icono, unidad, niveles, nivelInicial) {
        let opcionesDefault = {
            temporal:true,
            formatos:{
                isolineas:false,
                isobandas:false,
                serieTiempo:false,
                valorEnPunto:false,
                tiff:false,
                windglPNG:false,
                uv:false
            },
            decimales:2
        }
        if (!opciones) opciones = {};
        super(proveedor, codigo,  nombre, origen, "raster", extend(true, opcionesDefault, opciones), grupos, icono);
        this.unidad = unidad;
        this.niveles = niveles;
        this.nivelInicial = nivelInicial;        
    }
    getInfo() {
        let info = super.getInfo();
        info.unidad = this.unidad;
        info.niveles = this.niveles;
        info.nivelInicial = this.nivelInicial;
        info.temporal = this.opciones.temporal;
        info.formatos = this.opciones.formatos;
        info.decimales = this.opciones.decimales;
        return info;
    }
}

class CapaVectorial extends Capa {
    constructor(proveedor, codigo, nombre, origen, opciones, grupos, icono) {
        if (!opciones) opciones = {};
        super(proveedor, codigo, nombre, origen, "vectorial", opciones, grupos, icono);
    }
}

module.exports = {Capa, CapaRaster, CapaVectorial}