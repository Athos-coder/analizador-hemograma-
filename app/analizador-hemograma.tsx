import React, { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, ArrowLeft } from "lucide-react";
import { globalCss, keyframes } from "@stitches/react";

const blink = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.5 },
});

const globalStyles = globalCss({
  ".select-content": {
    backgroundColor: "#BFDBFE !important", // blue-200
    color: "#1E3A8A !important", // blue-900
  },
  ".select-item": {
    "&:hover": {
      backgroundColor: "#93C5FD !important", // blue-300
    },
    "&[data-highlighted]": {
      backgroundColor: "#60A5FA !important", // blue-400
      color: "#1E3A8A !important", // blue-900
    },
  },
  ".blink": {
    animation: `${blink} 1s ease-in-out infinite`,
  },
});

const translations = {
  es: {
    title: "Analizador de Hemograma",
    redBloodCells: "Glóbulos Rojos (x10^12/L)",
    hemoglobin: "Hemoglobina (g/dL)",
    hematocrit: "Hematocrito (%)",
    whiteBloodCells: "Glóbulos Blancos (x10^9/L)",
    neutrophilsPercentage: "Neutrófilos (%)",
    neutrophilsCount: "Neutrófilos (x10^9/L)",
    platelets: "Plaquetas (x10^9/L)",
    analyze: "Analizar",
    result: "Resultado",
    defenseStatus: "Estado de las defensas:",
    normal: "Normal",
    low: "Bajo",
    high: "Alto",
    errorTitle: "Error de validación",
    errorMessage: "Por favor, complete todos los campos antes de analizar.",
    uploadPDF: "Cargar PDF",
    pdfUploaded: "PDF cargado correctamente",
    pdfError: "Error al cargar el PDF",
    noFileSelected: "No se ha seleccionado ningún archivo",
    invalidFileType: "El archivo seleccionado no es un PDF",
    pdfReadError: "Error al leer el contenido del PDF",
    noDataFound: "No se encontraron datos en el PDF",
    GLOBULOSROJOS: "GLOBULOS ROJOS (x10^12/L)",
    HEMOGLOBINA: "HEMOGLOBINA (g/dL)",
    HEMATOCRITOS: "HEMATOCRITOS (%)",
    GLOBULOSBLANCOS: "GLOBULOS BLANCOS (x10^9/L)",
    NEUTROFILOS: "NEUTROFILOS (%)",
    NEUTROFILOS_ABSOLUTO: "NEUTROFILOS # (x10^9/L)",
    PLAQUETAS: "PLAQUETAS (x10^9/L)",
    backToForm: "Volver al formulario",
    detailedResults: "Resultados Detallados",
  },
  en: {
    title: "Complete Blood Count Analyzer",
    redBloodCells: "Red Blood Cells (x10^12/L)",
    hemoglobin: "Hemoglobin (g/dL)",
    hematocrit: "Hematocrit (%)",
    whiteBloodCells: "White Blood Cells (x10^9/L)",
    neutrophilsPercentage: "Neutrophils (%)",
    neutrophilsCount: "Neutrophils (x10^9/L)",
    platelets: "Platelets (x10^9/L)",
    analyze: "Analyze",
    result: "Result",
    defenseStatus: "Defense status:",
    normal: "Normal",
    low: "Low",
    high: "High",
    errorTitle: "Validation Error",
    errorMessage: "Please fill in all fields before analyzing.",
    uploadPDF: "Upload PDF",
    pdfUploaded: "PDF uploaded successfully",
    pdfError: "Error uploading PDF",
    noFileSelected: "No file selected",
    invalidFileType: "The selected file is not a PDF",
    pdfReadError: "Error reading PDF content",
    noDataFound: "No data found in the PDF",
    GLOBULOSROJOS: "RED BLOOD CELLS (x10^12/L)",
    HEMOGLOBINA: "HEMOGLOBIN (g/dL)",
    HEMATOCRITOS: "HEMATOCRIT (%)",
    GLOBULOSBLANCOS: "WHITE BLOOD CELLS (x10^9/L)",
    NEUTROFILOS: "NEUTROPHILS (%)",
    NEUTROFILOS_ABSOLUTO: "NEUTROPHILS # (x10^9/L)",
    PLAQUETAS: "PLATELETS (x10^9/L)",
    backToForm: "Back to form",
    detailedResults: "Detailed Results",
  },
};

const normalRanges = {
  GLOBULOSROJOS: { min: 4.5, max: 5.5 },
  HEMOGLOBINA: { min: 13.5, max: 17.5 },
  HEMATOCRITOS: { min: 41, max: 53 },
  GLOBULOSBLANCOS: { min: 4.5, max: 11.0 },
  NEUTROFILOS: { min: 40, max: 70 },
  NEUTROFILOS_ABSOLUTO: { min: 2.0, max: 7.0 },
  PLAQUETAS: { min: 150, max: 450 },
};

const getStatusColor = (value, range) => {
  const numValue = parseFloat(value);
  if (numValue < range.min || numValue > range.max)
    return "text-red-500 italic font-bold";
  return "text-green-300 italic font-bold";
};

export default function Component() {
  globalStyles();
  const [language, setLanguage] = useState("es");
  const [values, setValues] = useState({
    GLOBULOSROJOS: "",
    HEMOGLOBINA: "",
    HEMATOCRITOS: "",
    GLOBULOSBLANCOS: "",
    NEUTROFILOS: "",
    NEUTROFILOS_ABSOLUTO: "",
    PLAQUETAS: "",
  });
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef(null);

  const t = translations[language];

  const clearFields = () => {
    setValues({
      GLOBULOSROJOS: "",
      HEMOGLOBINA: "",
      HEMATOCRITOS: "",
      GLOBULOSBLANCOS: "",
      NEUTROFILOS: "",
      NEUTROFILOS_ABSOLUTO: "",
      PLAQUETAS: "",
    });
    setErrors({});
    setShowError(false);
    setPdfUploaded(false);
    setPdfError("");
  };

  const handleInputChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const analyzeBloodCount = () => {
    const newErrors = {};
    let hasError = false;

    Object.entries(values).forEach(([key, value]) => {
      if (value.trim() === "") {
        newErrors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      setShowError(true);
      return;
    }

    setShowError(false);

    const { GLOBULOSBLANCOS, NEUTROFILOS_ABSOLUTO, PLAQUETAS } = values;

    let defenseStatus = t.normal;

    if (
      parseFloat(GLOBULOSBLANCOS) < 4.5 ||
      parseFloat(NEUTROFILOS_ABSOLUTO) < 2.0 ||
      parseFloat(PLAQUETAS) < 150
    ) {
      defenseStatus = t.low;
    } else if (
      parseFloat(GLOBULOSBLANCOS) > 11.0 ||
      parseFloat(NEUTROFILOS_ABSOLUTO) > 7.0 ||
      parseFloat(PLAQUETAS) > 450
    ) {
      defenseStatus = t.high;
    }

    setResult(defenseStatus);
    setShowResults(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setPdfError(t.noFileSelected);
      return;
    }

    if (file.type !== "application/pdf") {
      setPdfError(t.invalidFileType);
      return;
    }

    try {
      const text = await file.text();
      console.log("Contenido del archivo:", text);

      const extractValue = (regex) => {
        const match = text.match(regex);
        console.log(
          `Buscando: ${regex}, Encontrado: ${match ? match[1] : "No encontrado"}`,
        );
        return match ? match[1] : "";
      };

      const newValues = {
        GLOBULOSROJOS: extractValue(/GLOBULOS ROJOS:?\s*([\d.]+)/i),
        HEMOGLOBINA: extractValue(/HEMOGLOBINA:?\s*([\d.]+)/i),
        HEMATOCRITOS: extractValue(/HEMATOCRITOS:?\s*([\d.]+)/i),
        GLOBULOSBLANCOS: extractValue(/GLOBULOS BLANCOS:?\s*([\d.]+)/i),
        NEUTROFILOS: extractValue(/NEUTROFILOS:?\s*([\d.]+)/i),
        NEUTROFILOS_ABSOLUTO: extractValue(/NEUTROFILOS #:?\s*([\d.]+)/i),
        PLAQUETAS: extractValue(/PLAQUETAS:?\s*([\d.]+)/i),
      };

      console.log("Búsqueda de campos en el PDF:");
      Object.entries(newValues).forEach(([key, value]) => {
        console.log(`${key}: ${value || "No encontrado"}`);
      });

      console.log("Valores extraídos:", newValues);

      // Verificar si se encontraron datos
      const hasData = Object.values(newValues).some((value) => value !== "");
      if (!hasData) {
        console.log("No se encontraron datos en el PDF");
        setPdfError(t.noDataFound);
        return;
      }

      setValues(newValues);
      setPdfUploaded(true);
      setPdfError("");
      console.log("PDF procesado con éxito");
    } catch (error) {
      console.error("Error al procesar el PDF:", error);
      setPdfUploaded(false);
      setPdfError(`${t.pdfReadError}: ${error.message}`);
      clearFields(); // Use the clearFields function here
    }
  };

  const renderForm = () => (
    <Card className="w-full max-w-md bg-blue-100 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
      <CardHeader className="bg-blue-900 bg-opacity-50 text-white p-6 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-[60px] bg-blue-200 text-blue-900">
              <SelectValue placeholder="ES" />
            </SelectTrigger>
            <SelectContent className="bg-blue-200 text-blue-900">
              <SelectItem value="es">ES</SelectItem>
              <SelectItem value="en">US</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {showError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.errorTitle}</AlertTitle>
            <AlertDescription>{t.errorMessage}</AlertDescription>
          </Alert>
        )}
        {pdfUploaded && (
          <Alert>
            <AlertTitle>{t.pdfUploaded}</AlertTitle>
          </Alert>
        )}
        {pdfError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{pdfError}</AlertTitle>
          </Alert>
        )}
        {Object.entries(values).map(([key, value]) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="block text-sm font-medium text-white mb-1"
            >
              {t[key]}
            </label>
            <Input
              type="number"
              id={key}
              name={key}
              value={value}
              onChange={handleInputChange}
              className={`w-full bg-white bg-opacity-20 border-none text-white placeholder-gray-300 ${
                errors[key] ? "ring-2 ring-red-500" : ""
              }`}
              placeholder={t[key]}
            />
          </div>
        ))}
        <div className="flex space-x-4">
          <Button
            onClick={analyzeBloodCount}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t.analyze}
          </Button>
          <Button
            onClick={() => fileInputRef.current.click()}
            className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            {t.uploadPDF}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderResults = () => (
    <Card className="w-full max-w-2xl  bg-blue-100 bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden">
      <CardHeader className="bg-blue-900 bg-opacity-50 text-white p-6 flex justify-between items-center">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-2xl font-bold">
            {t.detailedResults}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{t.result}</h3>
          <p className="text-white">
            {t.defenseStatus}{" "}
            <span
              className={`font-bold italic ${
                result === t.low
                  ? "text-red-500 blink"
                  : result === t.normal
                    ? "text-green-300 blink"
                    : "text-red-500 blink"
              }`}
            >
              {result}
            </span>
          </p>
        </div>
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className="bg-white bg-opacity-10 p-3 rounded-lg">
            <p className="text-white font-medium">{t[key]}</p>
            <p
              className={`text-lg ${getStatusColor(value, normalRanges[key])}`}
            >
              {value}
              <span className="text-sm font-normal text-gray-300 ml-2">
                (Rango normal: {normalRanges[key].min} - {normalRanges[key].max}
                )
              </span>
            </p>
          </div>
        ))}
        <Button
          onClick={() => {
            setShowResults(false);
            clearFields();
          }}
          className="mt-4 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t.backToForm}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      {showResults ? renderResults() : renderForm()}
    </div>
  );
}
