# fantAUstico

Plataforma web para causa animal, focada em **adoção**, **campanhas de vacinação/castração/doação** e **denúncia de maus-tratos**. Totalmente aberta (sem login), com formulários diretos, visual leve e responsivo.

## ✨ Principais funcionalidades
- Landing com chamadas rápidas para adoção, campanhas e denúncias.
- Listagem de pets para adoção, com contatos rápidos (telefone/WhatsApp) e badges de status.
- Listagem de campanhas com progresso de arrecadação e CTAs.
- Casos/denúncias com status (em aberto/resolvido) e contatos.
- Formulários em modais (Novo Caso/Adoção e Nova Campanha) acionados pelo header.
- Upload opcional de imagens (Firebase Storage ou Supabase, se configurado).

## 🛠 Stack
- React + Vite + TypeScript
- Tailwind CSS (utilities customizadas em `src/index.css`)
- Firebase (Firestore + Storage) e opcional Supabase para storage
- Formik + Yup para formulários
- FontAwesome (ícones)

## 🚀 Como rodar
```bash
npm install
npm run dev      # ambiente local
npm run build    # build de produção
npm run preview  # servir build
npm run lint     # checar lint
```

## 🔧 Variáveis de ambiente
Crie um arquivo `.env` na raiz com, no mínimo, as chaves do Firebase. Exemplo:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Opcional: Supabase para uploads
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_BUCKET=imagens
```
Se algum valor faltar, o app avisa no console e evita chamadas a Firestore/Storage.

## 🗂 Estrutura relevante
- `src/views/home/Home.tsx` — Introdução/hero e CTAs para seções.
- `src/views/pets/Adoption.tsx` — Listagem de pets para adoção.
- `src/views/donations/Campaigns.tsx` — Listagem de campanhas.
- `src/views/reports/Reports.tsx` — Casos e denúncias.
- `src/views/pets/RegisterPet.tsx` — Formulário (modal) para novo caso/adoção.
- `src/views/donations/NewCampaign.tsx` — Formulário (modal) para novas campanhas.
- `src/api/firestore.ts` — Integração Firebase (Firestore/Storage).
- `src/api/supabase.ts` — Upload alternativo de imagens.
- `src/index.css` — Paleta, “glass”, botões, badges e animações utilitárias.

## 🎨 Design e UX
- Tema acolhedor: primário verde/azul suave, secundário amarelo claro, neutros claros.
- Glassmorphism leve, cantos arredondados, animações suaves (`card-hover`, `fade-in-up`).
- Mobile-first: grids 1 coluna no mobile, 2–3 em telas maiores; header com CTAs em destaque.
- Acessibilidade: foco visível em inputs/botões, textos com bom contraste, `alt` em imagens.

## 🧭 Navegação
- Header com âncoras (Início, Adoção, Campanhas, Casos) e botões para abrir modais de formulários.
- Formulários simples, sem login ou multi-etapas; feedback de sucesso/erro via UI/console.

## 📦 Build & deploy
- `npm run build` gera o bundle em `dist/`.
- Pronto para hospedagem estática (ex.: Firebase Hosting, Vercel, Netlify). Configure as variáveis de ambiente no provedor.

## 🤝 Contribuição
1. Faça um fork/clonar.
2. Crie branch: `git checkout -b feature/minha-feature`.
3. Rode `npm run lint && npm run build` antes do PR.

## 🛟 Suporte
Para dúvidas ou sugestões, abra uma issue ou entre em contato pelos canais configurados no footer (WhatsApp/E-mail/Instagram).
