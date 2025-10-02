import UsersDao from './users.dao.js';
import bcrypt from 'bcrypt';

const usersDao = new UsersDao();

export async function cadastroUser(req, res) {
    try {
        const { senha, ...rest } = req.body;
        const photo = req.files.photo;
        
        
        const caminho = `../back/src/imagens/${Date.now()}_${photo.name}`;
        console.log("caminho: ", caminho);
        await photo.mv(caminho);

        if (!senha) return res.status(400).json({ message: 'Senha é obrigatória' });

        const saltRounds = 10;
        const senha_hash = await bcrypt.hash(senha, saltRounds);

        // const newUser = {
        //     ...rest,
        //     senha_hash,
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString(),
        //     photo: photo
        // };
        
        const newUser = {
            ...rest,
            senha_hash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const saved = await usersDao.cadastrar(newUser);
        const savedUser = Array.isArray(saved) ? saved[0] : saved;

        res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: savedUser
        });
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({
            message: "Erro ao criar usuário",
            error: error.message
        });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

        const user = await usersDao.findByEmail(email);
        if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha inválida" });
        }

        const { senha_hash, ...userSemSenha } = user;
        res.json({
            message: "Login realizado com sucesso!",
            user: userSemSenha
        });
    } catch (error) {
        console.error("Erro na parte de login:", error);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
}
