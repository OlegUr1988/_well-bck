import cors from "cors";

const corsOptions: cors.CorsOptions = {
  origin: "*",
};

export default cors(corsOptions);
