class Capa {
    constructor(proveedor, codigo) {
        this.proveedor = proveedor;
        this.codigo = codigo;
    }
}

class CapaRaster extends Capa {

}

class CapaVectorial extends Capa {

}

module.exports = {Capa, CapaRaster, CapaVectorial}