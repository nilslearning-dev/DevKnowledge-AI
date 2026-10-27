import { PDFParse } from "pdf-parse";

const extractPdfText = async (filePath) => {
  const parser = new PDFParse({
    url: filePath
  });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};

export default extractPdfText;