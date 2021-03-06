const Origen = require("./Origen");

class ProveedorCapas {
    constructor(codigo, opciones) {
        this.codigo = codigo;
        this.opciones = opciones || {};
        this.origenes = [];
        this.capas = [];        
        this.dashboards = [];
    }

    addOrigen(codigo, nombre, url, icono) {
        this.origenes.push(new Origen(codigo, nombre, url, icono));
    }
    getOrigen(codigo) {
        return this.origenes.find(o => o.codigo == codigo);
    }
    addCapa(capa) {
        this.capas.push(capa);
    }
    getCapa(codigo) {
        return this.capas.find(c => c.codigo == codigo);
    }
    addDashboard(dashboard) {
        this.dashboards.push(dashboard);
    }
    comandoGET(cmd, req, res) {
        res.status(404).send("Comando " + cmd + " no implementado por este servidor").end();
    }

    start() {
        return new Promise((resolve, reject) => {
            const express = require('express');
	        const app = express();
            const bodyParser = require('body-parser');
            const http = require('http');            
            app.use(bodyParser.urlencoded({extended:true}));
            app.use(bodyParser.json({limit:"50mb"}));
            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                next();
            });
            if (this.opciones.directorioWeb) app.use("/", express.static(this.opciones.directorioWeb));
            if (this.opciones.directorioPublicacion) {
                app.use("/resultados", express.static(this.opciones.directorioPublicacion));
                console.log("-- Se publica el directorio '" + this.opciones.directorioPublicacion + "' en /resultados");
            } else {
                console.log("-- No se ha configurado un directorio de resultados para publicar");
            }
            app.get("/ping", (req, res) => res.send("pong"));
            app.get("/capas", (req, res) => {
                res.set({'Content-Type':'text/json'}).send(JSON.stringify(this.getInfoCapas()));
            })
            app.get("/origenes", (req, res) => {
                res.set({'Content-Type':'text/json'}).send(JSON.stringify(this.getInfoOrigenes()));
            })
            app.get("/dashboards", (req, res) => {
                res.set({'Content-Type':'text/json'}).send(JSON.stringify(this.getDashboards()));
            })
            app.get("/preconsulta", (req, res) => {
                this.getPreconsulta(req.query["capa"], 
                    parseFloat(req.query["lng0"]), 
                    parseFloat(req.query["lat0"]), 
                    parseFloat(req.query["lng1"]), 
                    parseFloat(req.query["lat1"]),
                    parseInt(req.query["tiempo"]),
                    parseInt(req.query["nivel"]),
                    parseInt(req.query["maxWidth"]),
                    parseInt(req.query["maxHeight"])
                    )
                    .then(ret => res.set({'Content-Type':'text/json'}).send(JSON.stringify(ret)))
                    .catch(err => {
                        if (typeof err == "string") {
                            res.status(400);
                            res.send(err);
                        } else {
                            console.error(err);
                            res.status(500);
                            res.send("Error Interno");
                        }
                    })
                
            })
            app.post("/consulta", (req, res) => {
                this.resuelveConsulta(req.body.formato, req.body.args)                    
                    .then(ret => res.set({'Content-Type':'text/json'}).send(JSON.stringify(ret)))
                    .catch(err => {
                        if (typeof err == "string") {
                            res.status(400);
                            res.send(err);
                        } else {
                            console.error(err);
                            res.status(500);
                            res.send("Error Interno");
                        }
                    })
                
            });
            app.get("/cmd/:comando", (req, res) => this.comandoGET(req.params.comando, req, res));
            // Listeners por capa
            this.capas.forEach(capa => {
                if (capa.opciones.webListeners) {
                    capa.opciones.webListeners.forEach(listener => {
                        if (listener.method == "GET") {
                            app.get(listener.path, (req, res) => listener.resolve(req, res));
                            console.log("[" + this.codigo + "] Iniciando servicio GET en " + listener.path);
                        } else if (listener.method == "POST") {
                            app.post(listener.path, (req, res) => listener.resolve(req, res));
                            console.log("[" + this.codigo + "] Iniciando servicio POST en " + listener.path);
                        }
                    })
                }
            })
            const httpServer = http.createServer(app);
            httpServer.on("error", err => reject(err));
            if (this.opciones.puertoHTTP) {
                httpServer.listen(this.opciones.puertoHTTP, _ => {
                    console.log("[" + this.codigo + "] HTTP Server iniciado en puerto " + this.opciones.puertoHTTP);
                    resolve();
                });
            }
        });
    }

    getInfoOrigenes() {
        return this.origenes.reduce((lista, origen, i) => {
            lista.push(origen.getInfo());
            return lista;
        }, [])
    }
    getInfoCapas() {
        return this.capas.reduce((lista, capa, i) => {
            lista.push(capa.getInfo());
            return lista;
        }, [])
    }
    getDashboards() {
        return this.dashboards;
    }
    async getPreconsulta(capa, lng0, lat0, lng1, lat1, tiempo, nivel, maxWidth, maxHeight) {
        throw "Preconsulta No Implementada en Proveedor '" + this.codigo + "'";
    }
    async resuelveConsulta(formato, args) {
        throw "resuelveConsulta No Implementada en Proveedor '" + this.codigo + "'";
    }
}

module.exports = ProveedorCapas;