class Origen {
    constructor(codigo, nombre, url, icono) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.url = url;
        this.icono = icono;
    }

    getInfo() {
        return {
            codigo:this.codigo,
            nombre:this.nombre,
            url:this.url,
            icono:this.icono
        }
    }
}

module.exports = Origen;