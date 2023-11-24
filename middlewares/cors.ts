import cors from "cors";

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:5173", "https://localhost:5173"],
};

export default cors(corsOptions);
