-- CreateTable
CREATE TABLE "Logs_Sistema" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "Tipo_evento" VARCHAR(50) NOT NULL,
    "Descripcion" TEXT,
    "Fecha" TIMESTAMP(3) NOT NULL,
    "ipUsuario" VARCHAR(50),
    "Nivel" VARCHAR(50) NOT NULL,

    CONSTRAINT "Logs_Sistema_pkey" PRIMARY KEY ("idLog")
);

-- CreateTable
CREATE TABLE "Logs_Acciones" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "Tipo_Accion" VARCHAR(50) NOT NULL,
    "Tabla_Afectada" VARCHAR(100) NOT NULL,
    "Registro_Antiguo" JSONB,
    "Registro_Nuevo" JSONB,
    "Fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_Acciones_pkey" PRIMARY KEY ("idLog")
);

-- CreateTable
CREATE TABLE "Logs_Eliminados" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "Tabla_Afectada" VARCHAR(100) NOT NULL,
    "Registro_Eliminado" JSONB NOT NULL,
    "Fecha" TIMESTAMP(3) NOT NULL,
    "Motivo" INTEGER NOT NULL,
    "Rollback" BOOLEAN NOT NULL DEFAULT false,
    "Fecha_restauracion" TIMESTAMP(3),

    CONSTRAINT "Logs_Eliminados_pkey" PRIMARY KEY ("idLog")
);

-- CreateTable
CREATE TABLE "Logs_Permissions" (
    "idLog" SERIAL NOT NULL,
    "idAdministrador_mod" INTEGER,
    "idUsuario" INTEGER,
    "idModulo" INTEGER NOT NULL,
    "Permiso" VARCHAR(50) NOT NULL,
    "Estado" BOOLEAN NOT NULL,
    "Fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_Permissions_pkey" PRIMARY KEY ("idLog")
);

-- CreateTable
CREATE TABLE "Logs_Passwords" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "Password_anterior_hash" VARCHAR(255) NOT NULL,
    "Fecha_cambio" TIMESTAMP(3) NOT NULL,
    "Motivo" VARCHAR(100),

    CONSTRAINT "Logs_Passwords_pkey" PRIMARY KEY ("idLog")
);

-- CreateTable
CREATE TABLE "Logs_Intentos_Login" (
    "idIntento" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "ipUsuario" VARCHAR(50),
    "Fecha_intento" TIMESTAMP(3) NOT NULL,
    "Exitoso" BOOLEAN NOT NULL,
    "Motivo_fallo" VARCHAR(255),
    "Numero_intento" INTEGER NOT NULL,

    CONSTRAINT "Logs_Intentos_Login_pkey" PRIMARY KEY ("idIntento")
);

-- CreateTable
CREATE TABLE "Logs_Acceso_Modulo" (
    "idLog" SERIAL NOT NULL,
    "idUsuario" INTEGER,
    "Modulo" VARCHAR(50) NOT NULL,
    "Accion" VARCHAR(50) NOT NULL,
    "Fecha_acceso" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logs_Acceso_Modulo_pkey" PRIMARY KEY ("idLog")
);
