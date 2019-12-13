
class ProveedorCapas {
    constuctor(codigo, opciones) {
        this.codigo = codigo;
        this.opciones = opciones || {};
    }

    start() {
        return new Promise((resolve, reject) => {
            const express = require('express');
	        const app = express();
            const bodyParser = require('body-parser');
            const http = require('http');
            if (this.opciones.directorioWeb) app.use("/", express.static(this.opciones.directorioWeb));
            app.use(bodyParser.urlencoded({extended:true}));
            app.use(bodyParser.json({limit:"50mb"}));
            app.use((req, res, next) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
                next();
            });
            httpServer = http.createServer(app);
            httpServer.on("error", err => reject(err));
            if (this.opciones.puertoHTTP) {
                httpServer.listen(this.opciones.puertoHTTP, _ => {
                    console.log("[" + this.codigo + "] HTTP Server iniciado en puerto " + this.opciones.puertoHTTP);
                    resolve();
                });
            }
        });
    }
}