# 🌟 Dynamic Island Todo

A minimalist todo app inspired by iPhone's Dynamic Island, built with Next.js and Supabase.

## ✨ Features

- 🎨 **Dynamic Island UI**: Expandable interface inspired by iPhone 14 Pro
- 🔐 **Multi-Social Login**: Google, GitHub, and Kakao OAuth
- 🗃️ **Real-time Sync**: Supabase-powered live updates
- 🌙 **Dark Theme**: Sleek dark design with smooth animations
- 📱 **Responsive**: Perfect on all devices from mobile to desktop
- 🔒 **Secure**: Row-level security and JWT authentication

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## 🎯 Live Demo

[🔗 Visit Dynamic Island Todo](https://mong-todo.vercel.app)

## 📱 Screenshots

### Collapsed State
The Dynamic Island in its compact form, showing todo counts.

### Expanded State  
Full todo management interface with add/edit/complete functionality.

### Social Login
Seamless authentication with Google, GitHub, and Kakao.

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Junhan2/mong.git
   cd mong
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🔧 Configuration

For full functionality, configure OAuth providers in your Supabase dashboard:

- **Google OAuth**: Client ID and Secret required
- **GitHub OAuth**: OAuth App setup required
- **Kakao OAuth**: REST API key and Client Secret required

## 📄 Documentation

- [📋 OAuth Setup Guide](./OAUTH_SETUP_GUIDE.md)
- [🟡 Kakao OAuth Setup](./KAKAO_OAUTH_SETUP.md)
- [📊 Project Completion Report](./PROJECT_COMPLETION_REPORT.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

Created by **Junhan2** - feel free to contact me!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Dynamic Island Todo** - Where productivity meets innovation! 🚀✨
