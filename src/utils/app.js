import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser"; // ✅ Importar cookie-parser
import helmet from "helmet";

// Crear __dirname manualmente en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Importar rutas
import authRoutes from "../routes/auth.routes.js";
import noticiasRoutes from "../routes/noticias.routes.js";
import recursosAcademicosRoutes from "../routes/recursosAcademicos.routes.js";
import personasRoutes from "../routes/personas.routes.js";
import actividadesRoutes from "../routes/actividades.routes.js";
import carreraRoutes from "../routes/carrera.routes.js";
import usuarioRoutes from "../routes/usuario.routes.js";
import rolesRoutes from "../routes/roles.routes.js";
import usuarioRol from "../routes/usuarioRol.routes.js";
import permiso from "../routes/permiso.routes.js";
import modulo from "../routes/modulo.routes.js";
import admiBeca from "../routes/admiBeca.routes.js";
const app = express();


app.use(
    helmet({
      hsts: {
        maxAge: 31536000, // 🔥 Fuerza HTTPS por 1 año
        includeSubDomains: true,
        preload: true,
      },
    })
  );

dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ Habilita el uso de cookies
app.use(morgan("dev"));


// ✅ CORS con credenciales habilitadas para permitir cookies
app.use(
  cors({
    origin: "http://localhost:5173", // Reemplazar con la URL del frontend en producción
    credentials: true, // ✅ Permitir cookies en las solicitudes CORS
  })
);

app.use((req, res, next) => {
    res.setHeader("Set-Cookie", [
      "AMP_MKTG_9ada0d4f2a=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      "AMP_9ada0d4f2a=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);
    next();
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/noticia", noticiasRoutes);
app.use("/api/recurso", recursosAcademicosRoutes);
app.use("/api/persona", personasRoutes);
app.use("/api/actividad", actividadesRoutes);
app.use("/api/carrera", carreraRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/rol", rolesRoutes);
app.use("/api/usuariorol", usuarioRol);
app.use("/api/permiso", permiso);
app.use("/api/modulo", modulo);
app.use("/api/admibeca", admiBeca);


// app.get("/test-error", async (req, res, next) => {
//   try {
//     throw new Error("Este es un error de prueba en la API");
//   } catch (error) {
//     await registrarLogSistema({
//       idUsuario: req.user?.userId || 1,
//       Tipo_evento: "ERROR_API",
//       Descripcion: error.message,
//       ipUsuario: req.ip || "0.0.0.0",
//       Nivel: "ERROR",
//     });

//     console.error(" Error de prueba detectado:", error.message);
//     res.status(500).json({ error: "Error de prueba registrado en logs" });
//   }
// });


// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;
