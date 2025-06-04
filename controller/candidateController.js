import { collection,getDocs } from "firebase/firestore"
import { db } from "../utils/firebaseConfiguration.js";

export const fetchAllCandidates = async(req,res)=>{
    try {
        const querySnapshot = await getDocs(collection(db,"candidates"));
       
        const candidates = querySnapshot.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
         }))

         res.status(200).json({candidates:candidates})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}