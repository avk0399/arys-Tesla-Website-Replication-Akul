cat > README.md << 'EOF'
# Tesla Website Clone

A full-stack Tesla website replication built with Node.js, Express and MongoDB

## Features

- **Home Page** - Hero banner with CTAs
- **Cars Page** - Display of 6+ Tesla models
- **Customize Page** - Dynamic car customization with live price updates
- **Authentication** - Secure signup/login with hashed passwords
- **Session Management** - Persistent user sessions
- **Responsive Design** - Mobile-friendly layout

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Security:** bcrypt for password hashing, express-session

## Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/tesla-clone.git
cd tesla-clone
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```
MONGODB_URI=mongodb://localhost:27017/tesla-clone
SESSION_SECRET=your-secret-key
PORT=3000
```

4. Start MongoDB
```bash
brew services start mongodb-community@7.0
```

5. Run the application
```bash
npm start
```

6. Open `http://localhost:3000`

## Pages

| Page      | URL          |
|-----------|--------------|
| Home      | `/`          |
| Cars      | `/cars`      |
| Customize | `/customize` |
| Login     | `/login`     |
| Signup    | `/signup`    |

## Customization Options

- Battery: Standard, Long Range, Plaid
- Colors: White, Black, Blue, Red, Silver
- Wheels: 19" Tempest, 21" Arachnid
- Interior: Black, Black & White, Cream

## Author
Akul Vinod Kartha