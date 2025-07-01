import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfiguration.js";
import ExcelJS from "exceljs";

export const fetchAllCandidates = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "candidates"));

    const candidates = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ candidates: candidates });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

export const getCandidatesInCSV = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "candidates"));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Candidates");

    worksheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Resume URL", key: "resume", width: 50 },
      { header: "Education", key: "education", width: 40 },
    ];
    snapshot.forEach(doc => {
      const data = doc.data();
      worksheet.addRow({
        name: data.name || '',
        email: data.email || '',
        phone: data.number || '',
        resume: data.resumeURL || '',
        education: data.education
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=candidates.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};