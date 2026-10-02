import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import { bookRepository } from "./modules/books/book.repository";

const bootstrap = async (): Promise<void> => {
    await connectDB();
    await bookRepository.ensureIndexes();
    app.listen(env.port, () => {
        console.log(`Servidor corriendo en el puerto ${env.port} [${env.nodeEnv}]`);
    });
};

bootstrap().catch((error) => {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
});
