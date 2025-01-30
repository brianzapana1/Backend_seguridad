export const obtenerFechaBolivia = () => {
    // 📌 Obtener la fecha en UTC
    const fechaUTC = new Date();

    // 📌 Convertir a la zona horaria de Bolivia (UTC-4)
    const diferenciaHoras = -4; // Bolivia está en UTC-4
    fechaUTC.setHours(fechaUTC.getHours() + diferenciaHoras);

    return fechaUTC;
};
