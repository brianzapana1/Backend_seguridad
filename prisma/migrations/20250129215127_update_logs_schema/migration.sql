/*
  Warnings:

  - You are about to drop the `Logs_Acceso_Modulo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Fecha_siguiente_cambio` to the `Logs_Passwords` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs_Acciones" ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Logs_Eliminados" ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Logs_Intentos_Login" ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Logs_Passwords" ADD COLUMN     "Fecha_siguiente_cambio" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Logs_Permissions" ALTER COLUMN "idAdministrador_mod" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Logs_Sistema" ALTER COLUMN "idUsuario" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "Logs_Acceso_Modulo";
