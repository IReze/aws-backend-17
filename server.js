const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "clave_secreta_super_segura_zero_trust";

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "kevin" && password === "Seguridad17*") {
        const token = jwt.sign({ user: username, role: "admin" }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token, message: "Autenticación exitosa" });
    }
    return res.status(401).json({ error: "Credenciales inválidas" });
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: "Token requerido" });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido o expirado" });
        req.user = decoded;
        next();
    });
};

app.get('/api/dashboard/data', verifyToken, (req, res) => {
    res.json({
        status: "Acceso autorizado",
        data: "Información confidencial del sistema empresarial (Zero Trust)",
        user: req.user
    });
});

app.listen(3000, '0.0.0.0', () => console.log('Backend activo en puerto 3000'));