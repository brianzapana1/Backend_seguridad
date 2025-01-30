import {
  registrarPersona,
  obtenerPersonas,
  editarPersona,
  eliminarPersona,
  obtenerPersonaPorId
} from "../services/personas.service.js";
import { logsDb } from "../config/database.js";

/**
 * Registra una nueva persona.
 */
export const registerPersona = async (req, res) => {
  try {
    const persona = await registrarPersona(req.body);
    res.status(201).json({ message: "✅ Persona registrada exitosamente.", persona });
  } catch (error) {
    console.error("❌ Error al registrar persona:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene todas las personas registradas.
 */
export const getPersonas = async (req, res) => {
  try {
    const personas = await obtenerPersonas();
    res.status(200).json({ success: true, personas });
  } catch (error) {
    console.error("❌ Error al obtener personas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Edita una persona existente.
 */
export const updatePersona = async (req, res) => {
  try {
    const updatedPerson = await editarPersona(req.params.id, req.body);
    res.json({ message: "✅ Persona actualizada exitosamente.", persona: updatedPerson });
  } catch (error) {
    console.error("❌ Error al actualizar persona:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene una persona por ID.
 */
export const getPersonaById = async (req, res) => {
  try {
    const persona = await obtenerPersonaPorId(req.params.id);
    if (!persona) {
      return res.status(404).json({ error: "❌ Persona no encontrada." });
    }
    res.json(persona);
  } catch (error) {
    console.error("❌ Error al obtener persona:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Elimina una persona por ID.
 */
export const deletePersona = async (req, res) => {
  try {
    const result = await eliminarPersona(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("❌ Error al eliminar persona:", error.message);
    res.status(500).json({ error: error.message });
  }
};
