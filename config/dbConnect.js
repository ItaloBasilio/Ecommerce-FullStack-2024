const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        // Verifica se a variável de ambiente MONGODB_URL está definida
        if (!process.env.MONGODB_URL) {
            throw new Error('❌ A variável de ambiente MONGODB_URL não está definida.');
        }
        
        // Conecta ao banco de dados
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(" ✅ Database connected");
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
    }
}

module.exports = dbConnect;
