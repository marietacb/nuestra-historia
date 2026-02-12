import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import { getAnalytics, isSupported } from "firebase/analytics";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARA4oT4TqDT1fpvYhgDoOTjGE9oiEeRAw",
  authDomain: "nuestra-historia-9ed05.firebaseapp.com",
  projectId: "nuestra-historia-9ed05",
  storageBucket: "nuestra-historia-9ed05.firebasestorage.app",
  messagingSenderId: "135645330606",
  appId: "1:135645330606:web:18fe1a93d72d2765fb013f",
  measurementId: "G-MZKSL94GTP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Inicializar Analytics solo cuando sea compatible (navegador)
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    })
    .catch(() => {
      // Silenciar errores de analytics en entornos donde no esté disponible
    });
}

export { app, db, storage };

