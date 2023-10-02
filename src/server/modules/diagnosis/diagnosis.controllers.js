import { BAD_REQUEST, SERVER_ERROR, SUCCESS } from "../../types/status_code.js";
import {
  combinedSymptomsArr,
  diagnoseAndReturnPercent,
} from "../../utils/diagnosis.js";

export async function diagonise(req, res, next) {
  try {
    let { userSystoms } = req.body;

    if (!Array.isArray(userSystoms) || userSystoms.length === 0) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Value must be a non empty array" });
    }

    let diagnosisResult = diagnoseAndReturnPercent(userSystoms);

    return res.status(SUCCESS).json({
      message: "Dianosis successfull",
      diagnosisResult,
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}

export async function getAllSymptoms(req, res, next) {
  try {
    return res.status(SUCCESS).json({
      message: "Fetch successful",
      symptoms: combinedSymptomsArr,
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ message: error.message });
  }
}
