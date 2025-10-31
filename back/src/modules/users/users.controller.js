import UsersDao from "./users.dao.js";
import bcrypt from "bcrypt";
import path from "path";
import cpfValidate from "cpf";

const usersDao = new UsersDao();

export async function cadastroUser(req, res) {
    try {
        const { senha, cpf, ...rest } = req.body;
        const photo = req.files.photo;

        const fileName = `${Date.now()}_${photo.name}`;
        const uploadPath = path.join("src", "imagens", fileName);

        await photo.mv(uploadPath);
        const valido = cpfValidate.isValid(cpf);

        if (!senha || !valido)
            return res
                .status(400)
                .json({ message: "Senha é obrigatória || CPF não é valido" });

        const saltRounds = 10;
        const senha_hash = await bcrypt.hash(senha, saltRounds);

        const newUser = {
            ...rest,
            senha_hash,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            photo: fileName,
            cpf: cpf,
        };

        const saved = await usersDao.cadastrar(newUser);
        const savedUser = Array.isArray(saved) ? saved[0] : saved;

        res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: savedUser,
        });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        res.status(500).json({
            message: "Erro ao criar usuário",
            error: error.message,
        });
    }
}

export async function atualizarUser(req, res) {
    try {
        const { id, nome, cpf, rg, email, senha } = req.body;

        const valido = cpfValidate.isValid(cpf);

        if (!valido) return res.status(400).json({ error: "CPF não é valido" });

        const updatedData = {
            ...(nome && { nome }),
            ...(cpf && { cpf }),
            ...(rg && { rg }),
            ...(email && { email }),
            updated_at: new Date().toISOString(),
        };

        if (senha && senha.trim() !== "") {
            const saltRounds = 10;
            updatedData.senha_hash = await bcrypt.hash(senha, saltRounds);
        }

        if (req.files && req.files.photo) {
            const photo = req.files.photo;
            const fileName = `${Date.now()}_${photo.name}`;
            const uploadPath = path.join("src", "imagens", fileName);
            await photo.mv(uploadPath);
            updatedData.photo = fileName;
        }

        const updated = await usersDao.atualizar(updatedData, id);
        const updatedUser = Array.isArray(updated) ? updated[0] : updated;

        res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({
            message: "Erro ao atualizar usuário",
            error: error.message,
        });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha)
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });

        const user = await usersDao.findByEmail(email);
        if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, user.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha inválida" });
        }

        const { senha_hash, ...userSemSenha } = user;
        res.json({
            message: "Login realizado com sucesso!",
            user: userSemSenha,
        });
    } catch (error) {
        console.error("Erro na parte de login:", error);
        res.status(500).json({ erro: "Erro ao fazer login" });
    }
}

export async function findAll(req, res) {
    try {
        const users = await usersDao.findAll();
        res.json(users);
    } catch (error) {
        console.error("erro ao buscar Destaques: ", error);
        res.status(500).json({ erro: "erro ao buscar destaques" });
    }
}

export async function deleteUsers(req, res) {
    const { id } = req.params
    try {
        const usersDeleted = await usersDao.deleteUsers(id);
        return res.json(usersDeleted);
    } catch (error) {
        console.error('Erro ao excluir Sala: ', error);
        return res.status(500).json({ erro: 'Erro ao excluir Sala' });
    }
}