import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Generate PDF from certificate element
 * @param {React.RefObject} certificateRef - Reference to the certificate DOM element
 * @param {string} certificateId - Certificate ID for filename
 * @param {string} studentName - Student name
 */
export const generateCertificatePdf = async (certificateRef, certificateId, studentName) => {
  try {
    const element = certificateRef.current;

    if (!element) {
      console.error("Certificate element not found");
      return;
    }

    // Configure html2canvas for high quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);

    // Create PDF in landscape orientation
    const pdf = new jsPDF("landscape", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    // Generate filename
    const filename = `certificate-${certificateId || studentName || "download"}.pdf`;

    // Save PDF
    pdf.save(filename);

    return true;
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    return false;
  }
};
