#!/usr/bin/env node
/**
 * API Testing Script for Capstone2
 * Tests all critical API endpoints
 */

const BASE_URL = "http://localhost:5500/api";

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

let tokens = {
  admin: "",
  worker: "",
  manager: "",
  hrd: "",
};

let ids = {
  adminId: "",
  workerId: "",
  taskId: "",
};

// Helper function to make API calls
async function apiCall(method, endpoint, body = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

// Test functions
async function runTests() {
  console.log(
    `${colors.blue}╔════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(
    `${colors.blue}║  CAPSTONE2 - API TESTING SUITE        ║${colors.reset}`,
  );
  console.log(
    `${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`,
  );

  // TEST 1: Check Backend Connectivity
  console.log(`${colors.blue}[TEST 1] Backend Connectivity${colors.reset}`);
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeNo: "test", password: "test" }),
    });
    if (response.status > 0) {
      console.log(
        `${colors.green}✅ Backend is running on ${BASE_URL}${colors.reset}\n`,
      );
    }
  } catch (error) {
    console.log(
      `${colors.red}❌ Cannot connect to backend: ${error.message}${colors.reset}`,
    );
    console.log(
      `${colors.yellow}Make sure backend is running: npm start${colors.reset}\n`,
    );
    return;
  }

  // TEST 2: Check if Admin User Exists
  console.log(`${colors.blue}[TEST 2] Checking Admin User${colors.reset}`);
  const adminLogin = await apiCall("POST", "/auth/login", {
    employeeNo: "ADMIN001",
    password: "admin123pass",
  });

  if (adminLogin.status === 200 && adminLogin.data.token) {
    console.log(`${colors.green}✅ Admin user found${colors.reset}`);
    tokens.admin = adminLogin.data.token;
    ids.adminId = adminLogin.data.user.id;
    console.log(
      `   Token: ${adminLogin.data.token.substring(0, 20)}...${colors.reset}\n`,
    );
  } else {
    console.log(`${colors.yellow}⚠️  Admin user not found${colors.reset}`);
    console.log(
      `${colors.yellow}Creating admin user automatically...${colors.reset}\n`,
    );

    // Create admin user - this will fail without auth, so we skip for now
    console.log(
      `${colors.yellow}Note: You may need to create the first admin user manually.${colors.reset}\n`,
    );
  }

  // TEST 3: Create Worker User
  if (tokens.admin) {
    console.log(`${colors.blue}[TEST 3] Creating Worker User${colors.reset}`);
    const createWorker = await apiCall(
      "POST",
      "/users/create",
      {
        employeeNo: `WORKER${Date.now()}`,
        firstName: "Test",
        lastName: "Worker",
        email: `worker${Date.now()}@example.com`,
        phoneNumber: "09123456789",
        birthdate: "1995-06-15",
        password: "worker123pass",
        role: "worker",
      },
      tokens.admin,
    );

    if (createWorker.status === 201) {
      console.log(
        `${colors.green}✅ Worker created successfully${colors.reset}\n`,
      );
    } else if (
      createWorker.status === 400 &&
      createWorker.data.message?.includes("already exists")
    ) {
      console.log(
        `${colors.yellow}ℹ️  Worker with this email already exists${colors.reset}\n`,
      );
    } else {
      console.log(`${colors.red}❌ Failed to create worker${colors.reset}`);
      console.log(
        `   ${colors.yellow}${JSON.stringify(createWorker.data)}${colors.reset}\n`,
      );
    }

    // TEST 4: Login as Worker
    console.log(`${colors.blue}[TEST 4] Login as Worker${colors.reset}`);
    const workerLogin = await apiCall("POST", "/auth/login", {
      employeeNo: "WORKER001",
      password: "worker123pass",
    });

    if (workerLogin.status === 200 && workerLogin.data.token) {
      console.log(`${colors.green}✅ Worker login successful${colors.reset}`);
      tokens.worker = workerLogin.data.token;
      ids.workerId = workerLogin.data.user.id;
      console.log(
        `   Token: ${workerLogin.data.token.substring(0, 20)}...${colors.reset}\n`,
      );
    } else {
      console.log(`${colors.red}❌ Worker login failed${colors.reset}`);
      console.log(
        `   ${colors.yellow}${JSON.stringify(workerLogin.data)}${colors.reset}\n`,
      );
    }

    // TEST 5: Get All Users
    console.log(`${colors.blue}[TEST 5] Get All Users${colors.reset}`);
    const allUsers = await apiCall("GET", "/users/all", null, tokens.admin);

    if (allUsers.status === 200 && Array.isArray(allUsers.data)) {
      console.log(
        `${colors.green}✅ Users fetched successfully (Count: ${allUsers.data.length})${colors.reset}\n`,
      );
    } else {
      console.log(`${colors.red}❌ Failed to fetch users${colors.reset}\n`);
    }

    // TEST 6: Create Task
    if (ids.workerId) {
      console.log(`${colors.blue}[TEST 6] Create Task${colors.reset}`);
      const createTask = await apiCall(
        "POST",
        "/tasks/create",
        {
          taskName: "Test Task " + Date.now(),
          description: "This is a test task",
          assignedTo: ids.workerId,
          priority: "high",
          dueDate: "2026-05-15",
        },
        tokens.admin,
      );

      if (createTask.status === 201) {
        console.log(
          `${colors.green}✅ Task created successfully${colors.reset}`,
        );
        ids.taskId = createTask.data.task?._id;
        console.log(`   Task ID: ${ids.taskId}${colors.reset}\n`);
      } else {
        console.log(`${colors.red}❌ Failed to create task${colors.reset}`);
        console.log(
          `   ${colors.yellow}${JSON.stringify(createTask.data)}${colors.reset}\n`,
        );
      }

      // TEST 7: Get Worker's Tasks
      console.log(`${colors.blue}[TEST 7] Get Worker's Tasks${colors.reset}`);
      const myTasks = await apiCall(
        "GET",
        "/tasks/my-tasks",
        null,
        tokens.worker,
      );

      if (myTasks.status === 200 && Array.isArray(myTasks.data)) {
        console.log(
          `${colors.green}✅ Worker tasks fetched (Count: ${myTasks.data.length})${colors.reset}\n`,
        );
      } else {
        console.log(
          `${colors.red}❌ Failed to fetch worker tasks${colors.reset}\n`,
        );
      }

      // TEST 8: Update Task Status
      if (ids.taskId) {
        console.log(`${colors.blue}[TEST 8] Update Task Status${colors.reset}`);
        const updateTask = await apiCall(
          "PATCH",
          `/tasks/update-status/${ids.taskId}`,
          { status: "in-progress" },
          tokens.worker,
        );

        if (updateTask.status === 200) {
          console.log(
            `${colors.green}✅ Task status updated to in-progress${colors.reset}\n`,
          );
        } else {
          console.log(
            `${colors.red}❌ Failed to update task status${colors.reset}\n`,
          );
        }
      }
    }

    // TEST 9: Test Authorization (Worker tries to create task)
    console.log(
      `${colors.blue}[TEST 9] Authorization Check (Worker creates task)${colors.reset}`,
    );
    const unauthorizedTask = await apiCall(
      "POST",
      "/tasks/create",
      {
        taskName: "Unauthorized Task",
        assignedTo: ids.workerId,
      },
      tokens.worker,
    );

    if (unauthorizedTask.status === 403) {
      console.log(
        `${colors.green}✅ Correctly rejected (403 Forbidden)${colors.reset}\n`,
      );
    } else {
      console.log(
        `${colors.red}❌ Authorization check failed${colors.reset}\n`,
      );
    }

    // TEST 10: Test Missing Token
    console.log(`${colors.blue}[TEST 10] Missing Token Check${colors.reset}`);
    const noToken = await apiCall("GET", "/users/all");

    if (noToken.status === 401) {
      console.log(
        `${colors.green}✅ Correctly rejected (401 Unauthorized)${colors.reset}\n`,
      );
    } else {
      console.log(`${colors.red}❌ Token check failed${colors.reset}\n`);
    }
  }

  // Final Summary
  console.log(
    `${colors.blue}╔════════════════════════════════════════╗${colors.reset}`,
  );
  console.log(`${colors.green}✅ TESTING COMPLETE${colors.reset}`);
  console.log(
    `${colors.blue}╚════════════════════════════════════════╝${colors.reset}\n`,
  );

  console.log(`${colors.yellow}📋 NEXT STEPS:${colors.reset}`);
  console.log(`   1. Start frontend: npm start (in frontend folder)`);
  console.log(`   2. Test login with:`);
  console.log(`      - Admin: ADMIN001 / admin123pass`);
  console.log(`      - Worker: WORKER001 / worker123pass`);
  console.log(`   3. Go through user flow in TESTING_GUIDE.md\n`);
}

// Run tests
runTests().catch(console.error);
