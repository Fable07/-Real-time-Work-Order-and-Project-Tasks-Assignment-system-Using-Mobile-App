#!/usr/bin/env node
/**
 * Diagnostic Script - Capstone2 Login Issues
 * Helps identify what's wrong with the setup
 */

const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

console.log(
  `\n${colors.blue}╔════════════════════════════════════════╗${colors.reset}`,
);
console.log(
  `${colors.blue}║  Capstone2 - Setup Diagnostic Tool    ║${colors.reset}`,
);
console.log(
  `${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`,
);

async function runDiagnostics() {
  let passCount = 0;
  let failCount = 0;

  // Check 1: .env file exists
  console.log(
    `${colors.blue}[CHECK 1] Environment Configuration${colors.reset}`,
  );
  if (fs.existsSync("./backend/.env")) {
    console.log(`${colors.green}✅ .env file exists${colors.reset}`);
    const envContent = fs.readFileSync("./backend/.env", "utf8");
    const hasPort = envContent.includes("PORT");
    const hasMongo = envContent.includes("MONGO_URI");
    const hasSecret = envContent.includes("JWT_SECRET");

    if (hasPort) {
      console.log(`${colors.green}   ✅ PORT configured${colors.reset}`);
    } else {
      console.log(`${colors.red}   ❌ PORT not found${colors.reset}`);
      failCount++;
    }

    if (hasMongo) {
      console.log(`${colors.green}   ✅ MONGO_URI configured${colors.reset}`);
    } else {
      console.log(`${colors.red}   ❌ MONGO_URI not found${colors.reset}`);
      failCount++;
    }

    if (hasSecret) {
      console.log(`${colors.green}   ✅ JWT_SECRET configured${colors.reset}`);
    } else {
      console.log(`${colors.red}   ❌ JWT_SECRET not found${colors.reset}`);
      failCount++;
    }
    passCount++;
  } else {
    console.log(`${colors.red}❌ .env file NOT found${colors.reset}`);
    console.log(
      `${colors.yellow}   Fix: cp backend/.env.example backend/.env${colors.reset}`,
    );
    failCount++;
  }
  console.log();

  // Check 2: Dependencies installed
  console.log(`${colors.blue}[CHECK 2] Backend Dependencies${colors.reset}`);
  if (fs.existsSync("./backend/node_modules")) {
    console.log(`${colors.green}✅ node_modules exists${colors.reset}`);

    const hasMongoose = fs.existsSync("./backend/node_modules/mongoose");
    const hasExpress = fs.existsSync("./backend/node_modules/express");
    const hasBcrypt = fs.existsSync("./backend/node_modules/bcryptjs");
    const hasJWT = fs.existsSync("./backend/node_modules/jsonwebtoken");

    if (hasMongoose && hasExpress && hasBcrypt && hasJWT) {
      console.log(
        `${colors.green}   ✅ All critical packages installed${colors.reset}`,
      );
      passCount++;
    } else {
      console.log(
        `${colors.red}   ❌ Missing critical packages${colors.reset}`,
      );
      if (!hasMongoose)
        console.log(`${colors.yellow}      - mongoose${colors.reset}`);
      if (!hasExpress)
        console.log(`${colors.yellow}      - express${colors.reset}`);
      if (!hasBcrypt)
        console.log(`${colors.yellow}      - bcryptjs${colors.reset}`);
      if (!hasJWT)
        console.log(`${colors.yellow}      - jsonwebtoken${colors.reset}`);
      console.log(
        `${colors.yellow}   Fix: cd backend && npm install${colors.reset}`,
      );
      failCount++;
    }
  } else {
    console.log(`${colors.red}❌ node_modules NOT found${colors.reset}`);
    console.log(
      `${colors.yellow}   Fix: cd backend && npm install${colors.reset}`,
    );
    failCount++;
  }
  console.log();

  // Check 3: Required files exist
  console.log(`${colors.blue}[CHECK 3] Backend Files${colors.reset}`);
  const requiredFiles = [
    "backend/server.js",
    "backend/models/User.js",
    "backend/models/Task.js",
    "backend/routes/authRoutes.js",
    "backend/middleware/authMiddleware.js",
    "backend/seed-db.js",
  ];

  let allFilesExist = true;
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`${colors.green}✅ ${file}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${file} MISSING${colors.reset}`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    passCount++;
  } else {
    failCount++;
  }
  console.log();

  // Check 4: Frontend Configuration
  console.log(`${colors.blue}[CHECK 4] Frontend Configuration${colors.reset}`);
  if (fs.existsSync("./frontend/constants/Config.ts")) {
    const configContent = fs.readFileSync(
      "./frontend/constants/Config.ts",
      "utf8",
    );
    if (configContent.includes("API_URL")) {
      console.log(`${colors.green}✅ API_URL configured${colors.reset}`);
      const apiMatch = configContent.match(/API_URL\s*=\s*"([^"]+)"/);
      if (apiMatch) {
        console.log(`${colors.yellow}   URL: ${apiMatch[1]}${colors.reset}`);
      }
      passCount++;
    } else {
      console.log(`${colors.red}❌ API_URL not found${colors.reset}`);
      failCount++;
    }
  } else {
    console.log(
      `${colors.yellow}⚠️  Config.ts not found (frontend may not be set up yet)${colors.reset}`,
    );
  }
  console.log();

  // Check 5: Test if MongoDB connection possible (without actually connecting)
  console.log(`${colors.blue}[CHECK 5] MongoDB URI${colors.reset}`);
  if (fs.existsSync("./backend/.env")) {
    const envContent = fs.readFileSync("./backend/.env", "utf8");
    const mongoMatch = envContent.match(/MONGO_URI=(.+)/);
    if (mongoMatch) {
      const uri = mongoMatch[1].trim();
      if (uri.includes("mongodb")) {
        console.log(
          `${colors.green}✅ Valid MongoDB URI format${colors.reset}`,
        );
        if (uri.includes("localhost") || uri.includes("127.0.0.1")) {
          console.log(
            `${colors.yellow}   Local MongoDB: Ensure mongod is running${colors.reset}`,
          );
        } else if (uri.includes("mongodb+srv")) {
          console.log(
            `${colors.yellow}   MongoDB Atlas: Check credentials${colors.reset}`,
          );
        }
        passCount++;
      } else {
        console.log(`${colors.red}❌ Invalid MongoDB URI${colors.reset}`);
        failCount++;
      }
    }
  }
  console.log();

  // Check 6: Seed database exists
  console.log(`${colors.blue}[CHECK 6] Database Seeding${colors.reset}`);
  if (fs.existsSync("./backend/seed-db.js")) {
    console.log(`${colors.green}✅ seed-db.js exists${colors.reset}`);
    console.log(
      `${colors.yellow}   Run: cd backend && node seed-db.js${colors.reset}`,
    );
    passCount++;
  } else {
    console.log(`${colors.red}❌ seed-db.js NOT found${colors.reset}`);
    failCount++;
  }
  console.log();

  // Summary
  console.log(
    `${colors.blue}╔════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.blue}║           DIAGNOSTIC SUMMARY           ║${colors.reset}`,
  );
  console.log(
    `${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`,
  );

  console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failCount}${colors.reset}\n`);

  if (failCount === 0) {
    console.log(`${colors.green}✅ All checks passed!${colors.reset}`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log(`1. Ensure MongoDB is running: mongod`);
    console.log(`2. Start backend: cd backend && npm start`);
    console.log(`3. Seed database: cd backend && node seed-db.js`);
    console.log(`4. Start frontend: cd frontend && npm start`);
    console.log(`5. Try login with ADMIN001 / admin123pass`);
  } else {
    console.log(
      `${colors.red}❌ Some checks failed. Review the issues above.${colors.reset}`,
    );
    console.log(`\n${colors.yellow}Common fixes:${colors.reset}`);
    console.log(`• Copy .env: cp backend/.env.example backend/.env`);
    console.log(`• Install deps: npm install (in both backend & frontend)`);
    console.log(`• Start MongoDB: mongod`);
    console.log(`• Seed database: cd backend && node seed-db.js`);
  }

  console.log();
}

runDiagnostics();
